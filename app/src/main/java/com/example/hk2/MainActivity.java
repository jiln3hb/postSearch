package com.example.hk2;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;


import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Environment;
import android.view.View;

import androidx.core.app.ActivityCompat;

import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ImageButton;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.FileWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class MainActivity extends AppCompatActivity implements SeekBar.OnSeekBarChangeListener {

    private TextView textView2;
    private WebView webView;
    private LocationManager locationManager;
    private Double lat, lon;
    private int radius;
    private Boolean enabled;
    private Intent intentSearch, intentInfo;
    private JSInterface jsInterface;
    DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");

    static String varApi;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //начальный радиус
        radius = 1000;

        final JSInterface jsInterface = new JSInterface();

        //базовый api (в перспективе можно реализовать смену api)
        varApi = "osm.html";

        //настройка инициализация намерений для запуска придаточных активностей
        intentSearch = new Intent();
        intentInfo = new Intent();

        intentSearch.setClass(MainActivity.this, SearchActivity.class);
        intentInfo.setClass(MainActivity.this, InfoActivity.class);

        //настройка инициализация элементов интерфейса
        textView2 = findViewById(R.id.textView2);

        SeekBar seekBar = findViewById(R.id.seekBar1);
        seekBar.setOnSeekBarChangeListener(this);

        ImageButton buttonGeo = findViewById(R.id.buttonGeo);
        ImageButton buttonSea = findViewById(R.id.buttonSea);
        ImageButton buttonInf = findViewById(R.id.buttonInf);
        ImageButton buttonSav = findViewById(R.id.buttonSav);

        //настройка и инициализация контейнера для отображения результатов запроса
        webView = findViewById(R.id.webView1);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webView.addJavascriptInterface(jsInterface, "test");

        //инициализация locationManager для работы с геолокацией
        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);

        //обработка нажатия на кнопки
        buttonGeo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                //проверка, включен ли GPS на устройстве
                enabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);

                if (enabled == true){
                    if (lat == null && lon == null) {
                        getLocation(locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER));
                    } else {
                        webView.loadUrl("file:///android_asset/" + varApi + "?radius=" + radius + "&lat=" + lat + "&lon=" + lon);
                    }
                }else {
                    webView.loadUrl("javascript:projectUtil.showMyAlert('Ошибка', 'Включите геолокацию!', projectUtil.positions.CENTER)");
                }

            }
        });

        buttonSea.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                //запуск активности с поиском отделения по индексу
                startActivity(intentSearch);

            }
        });

        buttonInf.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                //запуск активности с информацией
                startActivity(intentInfo);

            }
        });

        buttonSav.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
            if (jsInterface.responce == null) {
                return;
                }

            //переменная, которая хранит в себе текущую дату и время
            Date currentDate = Calendar.getInstance().getTime();

            //инициализация экземпляра класса file для создания директории сохранения
            File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS), "/PostSearchOutput");

            try{
                //создание директории
                if (!dir.exists()) {
                    dir.mkdir();
                }

                //ициниализация экземпляра класса file для создания файла json, в котором будет сохранятся сведения об отделениях
                File gpxfile = new File(dir, dateFormat.format(currentDate) + ".json");
                //инициализация экземпляра класса filewriter для записи сведений об отделениях
                FileWriter writer = new FileWriter(gpxfile);

                //запись данных в файл
                writer.append(jsInterface.responce);
                writer.flush();
                writer.close();

                //вывод тоста пользователю с данными о месте сохранения
                Toast toastCr = Toast.makeText(getApplicationContext(), "Файл сохранён в директории\nstorage/emulated/0/documents/PostSearchOutput", Toast.LENGTH_SHORT);
                toastCr.show();
                } catch (Exception e) {}
            }
        });

        //метод проверки разрешений на геолокацию
        checkPermissions();
    }

    @Override
    protected void onResume() {
        super.onResume();
        getLocation(locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER));
        if (lat == null && lon == null) {
            webView.loadUrl("file:///android_asset/" + varApi + "?radius=" + radius + "&lat=" + 55 + "&lon=" + 83);
        }else {
            webView.loadUrl("file:///android_asset/" + varApi + "?radius=" + radius + "&lat=" + lat + "&lon=" + lon);
        }
    }

    //создание слушателя для работы с геолокацией
    private LocationListener locationListener = new LocationListener() {

        //метод вызывается при смене геолокации
        @Override
        public void onLocationChanged(Location location) {
            getLocation(location);
        }

        @Override
        public void onProviderEnabled(@NonNull String provider) {}
    };

    //метод для получения широты и долготы
    private void getLocation(Location location) {
        if (location == null) {
            return;
        } else {
            lat = location.getLatitude();
            lon = location.getLongitude();
        }
    }

    //проверка разрешений на геолокацию
    private void checkPermissions() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION}, 27);
        } else {
            locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000, (float) 0.1, locationListener);
        }
    }

    //обработка перемещения ползунка
    @Override
    public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
        textView2.setText(seekBar.getProgress() + " м");
        radius = seekBar.getProgress();
    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {}

    //прекращение перемещения ползунка
    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {
        webView.loadUrl("javascript:setRadius(" + radius + ")");
    }
}

