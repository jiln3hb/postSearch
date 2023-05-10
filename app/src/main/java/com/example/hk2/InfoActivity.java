package com.example.hk2;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class InfoActivity extends AppCompatActivity {

    private Intent intentMain;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_info);

        //инициализация и настройка намерения для запуска главной активности
        intentMain = new Intent();
        intentMain.setClass(InfoActivity.this, MainActivity.class);

        //инициализация кнопки
        ImageButton buttonBack = findViewById(R.id.buttonBack3);

        //обработка нажатия на кнопку
        buttonBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                //запуск главной активности
                startActivity(intentMain);
            }
        });
    }
}
