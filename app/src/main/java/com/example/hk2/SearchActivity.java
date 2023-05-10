package com.example.hk2;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.EditText;
import android.widget.ImageButton;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class SearchActivity extends AppCompatActivity {

    private ImageButton buttonBack, buttonCheck;
    private EditText editText;
    private WebView webView;
    private WebSettings settings;
    private Intent intentMain;
    private String postCode;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        //настройка и инициализация намерения для запуска главной активности

        intentMain = new Intent();
        intentMain.setClass(this, MainActivity.class);

        //инициализация элементов интерфейса
        editText = findViewById(R.id.editTextNumber);

        buttonBack = findViewById(R.id.buttonBack1);
        buttonCheck = findViewById(R.id.buttonCheck);

        //настройка и инициализации контейнера для отображения html файла с результатом отправленного запроса
        webView = findViewById(R.id.webView2);
        settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.loadUrl("file:///android_asset/osm.html?radius=1&lat=" + 55.030156 + "&lon=" + 82.921468);

        //обработка нажатия на кнопки
        buttonBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            //запуск главной активности
            startActivity(intentMain);

            }
        });

        buttonCheck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            //отправка запроса о поиске почтового отделения по индексу
            postCode = String.valueOf(editText.getText());
            webView.loadUrl("file:///android_asset/postcode.html?postcode=" + postCode);

            }
        });
    }
}
