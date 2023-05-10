// DOM элементы
const container = document.getElementById('postlist-container');
const t = document.querySelector('#element-li');
const h4 = t.content.querySelector('h4');
const span = t.content.querySelector('span');
const span2 = t.content.getElementById('lat');

// Получчить параметры url
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Инициализация карты
function MapInit(osmdata) {
    // Исключения
    if (osmdata == null) {
        projectUtil.showMyAlert("Ошибка", "Не удалось получить ответ от Overpass API", projectUtil.positions.CENTER)
        latlng = [55.03015, 82.921468];
        map.setView(latlng, 14);
        document.body.classList.add('loaded')
        return
    }

    if (osmdata.elements.length == 0) {
        projectUtil.showMyAlert("Ошибка", "Почтовое отделение не найдено!", projectUtil.positions.CENTER)
        latlng = [55.03015, 82.921468];
        map.setView(latlng, 14);
        document.body.classList.add('loaded')
        return;
    }
    
    latlng = [osmdata.elements[0].lat, osmdata.elements[0].lon]; // Широта, долгота
    map.setView(latlng, 14); // Установить вид карты и зум

    let street = osmdata.elements[0].tags['addr:street'];
    let housenumber = osmdata.elements[0].tags["addr:housenumber"];
    let name = osmdata.elements[0].tags["name"];

    let marker = L.marker(latlng);
    console.log(' Широта ' + osmdata.elements[0].lat, ' Долгота ' + osmdata.elements[0].lon);

    // Заполнение DOM элементов
    h4.textContent = street + ", дом " + housenumber;
    span.textContent = name;
    span2.textContent = ' Широта: ' + osmdata.elements[0].lat + ' Долгота: ' + osmdata.elements[0].lon;
    let li = t.content.cloneNode(true);
    container.append(li);

    //marker.bindTooltip(street + ", дом " + housenumber + ' Широта ' + osmdata.elements[0].lat + ' Долгота ' + osmdata.elements[0].lon, { permanent: true, offset: [0, 12] });
    marker.addTo(map);

    document.body.classList.add('loaded')
}

// Запрос к API
function GetOverPassData(url) {
    fetch(url).then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (osmdata) {
                console.log(osmdata);
                MapInit(osmdata);
            });
        }
    ).catch(function (err) {
        console.log('Fetch Error :-S', err);
        projectUtil.showMyAlert("Ошибка", err + '. Проверьте подключение к интернету!', projectUtil.positions.CENTER)
    });
}

let postcode = getParameterByName('postcode');

// Инициализация карты
var element = document.getElementById('osm-map');
var map = L.map(element, {
    dragging: L.Browser.mobile,
    tap: L.Browser.mobile,
    attributionControl: false,
    minZoom: 7,
    maxZoom: 18,
    doubleClickZoom: true
});

var current_markerGroup = null;
var current_markerPositionGroup = null;

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map); // Отрисовать тайлы

console.log(postcode);

GetOverPassData('https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=[out:json];(nwr[amenity=post_office][operator~"Почта%20России",i]["addr:postcode"=' + postcode + '];%20nwr[amenity=post_office][operator~"Почта%20России",i]["ref"=' + postcode + '];);%20out%20geom;');

map.on('load', function (e) {
    console.log('loaded');
    document.body.classList.add('loaded')
});