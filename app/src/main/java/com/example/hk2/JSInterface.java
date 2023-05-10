package com.example.hk2;

import android.content.Context;
import android.widget.Toast;

//интерфейс для передачи данных из веб части в java код
public class JSInterface {

    public String responce;

    @android.webkit.JavascriptInterface
    public void getData(String responce) {
        this.responce = responce;
    }
}
