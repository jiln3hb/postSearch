// Ссылки на DOM в документе
const container = document.getElementById('postlist-container');
const t = document.querySelector('#element-li');
const h4 = t.content.querySelector('h4');
const span = t.content.querySelector('span');

// Получить параметры из URL
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

radius = getParameterByName('radius');

// Сеттер, вызывается из WebView
function setRadius(value) {
    radius = value;
    console.log(radius);
    updateMap(current_latlng);
}

// Инициализация карты
current_latlng = { lat: parseFloat(getParameterByName('lat')), lng: parseFloat(getParameterByName('lon')) };
console.log(current_latlng);

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

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// Добавить маркер точки отсчёта
function addStartMarker(latlng) {
    // Очистить группу маркеров и создать новую
    if (current_markerGroup != null) {
        for (let i in current_markerGroup._layers)
            current_markerGroup.removeLayer(i);
    }
    current_markerGroup = L.layerGroup().addTo(map);

    // Удалить стартовую точку и создать новую 
    if (current_markerPositionGroup != null) {
        for (let i in current_markerPositionGroup._layers)
            current_markerPositionGroup.removeLayer(i);
    }
    current_markerPositionGroup = L.layerGroup().addTo(map);

    map._targets = [];
    map._layers = [];

    let marker2 = L.marker(latlng).addTo(current_markerPositionGroup);
    marker2._icon.classList.add("huechange"); // Стиль стартовой точки

    map.setView([marker2._latlng.lat, marker2._latlng.lng], 14); // Установить камеру в заданной точке с заданным зумом
}

function updateMap(latlng) {
    addStartMarker(latlng);

    //Очистить
    container.innerHTML = '';

    let url = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=[out:json];nwr[amenity=post_office][operator~%22%D0%9F%D0%BE%D1%87%D1%82%D0%B0%20%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8%22,i](around:' + radius + ',%20' + latlng.lat + ',%20' + latlng.lng + ');%20out;';

    // Запрос к Overpass API
    document.body.classList.remove('loaded');
    fetch(url).then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (osmdata) {
                document.body.classList.add('loaded')
                updateMap2(osmdata);
            });
        }
    ).catch(function (err) {
        console.log('Fetch Error :-S', err);
        document.body.classList.add('loaded');
        projectUtil.showMyAlert("Ошибка", err + '. Проверьте подключение к интернету!', projectUtil.positions.CENTER)
    });
    return true;
}

function updateMap2(osmdata) {
    if (osmdata == null) {
        projectUtil.showMyAlert("Ошибка", "Не удалось получить ответ от Overpass API", projectUtil.positions.CENTER)
        return false
    }

    alert(test.getData(JSON.stringify(osmdata))); // Вернуть данные в WebView

    console.log(osmdata);

    if (osmdata.elements.length == 0) {
        projectUtil.showMyAlert("Ошибка", "В заданном радиусе не найдено почтовых отделений!", projectUtil.positions.CENTER)
        return;
    }

    let targets = [];

    // Заполнить список данными
    for (let i in osmdata.elements) {
        let street = osmdata.elements[i].tags['addr:street'];
        let housenumber = osmdata.elements[i].tags["addr:housenumber"];
        let name = osmdata.elements[i].tags["name"];


        if (street != null) {
            targets.push([L.latLng(osmdata.elements[i].lat, osmdata.elements[i].lon), street + ", дом " + housenumber]);
            h4.textContent = street + ", дом " + housenumber;
            span.textContent = name;
            h4.dataset.lat = osmdata.elements[i].lat;
            h4.dataset.lon = osmdata.elements[i].lon;
            let li = t.content.cloneNode(true);
            container.append(li);
        }
        else {
            targets.push([L.latLng(osmdata.elements[i].lat, osmdata.elements[i].lon), 'Неопределено']);
        }

    }

    // Создать метки
    for (let i in targets) {
        let marker = L.marker(targets[i][0]);
        marker.bindTooltip(targets[i][1], { permanent: true, offset: [0, 12] });
        marker.addTo(current_markerGroup);
    }

    // Создаём Event каждому элементу в листбоксе
    container.querySelectorAll("li").forEach(function (element) { 
        element.addEventListener('click', function (e) {
            map.setView([element.querySelector('h4').getAttribute('data-lat'), element.querySelector('h4').getAttribute('data-lon')], 14);
        })
    });
}

map.on('load', function (e) {
    updateMap(current_latlng);
});

map.on('dblclick dbltap', function (e) {
    current_latlng.lat = e.latlng.lat;
    current_latlng.lng = e.latlng.lng;
    console.log(current_latlng);
    updateMap(current_latlng);
});

map.setView([getParameterByName('lat'), getParameterByName('lon')], 14);