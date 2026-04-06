package com.powertrigger;

import android.accessibilityservice.AccessibilityService;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.view.accessibility.AccessibilityEvent;

public class PowerMenuAccessibilityService extends AccessibilityService {
    public static final String ACTION_SHOW_POWER_MENU = "com.powertrigger.SHOW_POWER_MENU";
    private BroadcastReceiver receiver;

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Não precisamos interceptar eventos na tela para o nosso caso de uso.
    }

    @Override
    public void onInterrupt() {
        // Lida com interrupções se necessário.
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        
        // Registra o Receiver para escutar comandos vindo do nosso Módulo React Native
        receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (ACTION_SHOW_POWER_MENU.equals(intent.getAction())) {
                    // Chama a API Global do Android para abrir a Dialog de Desligar/Reiniciar
                    performGlobalAction(GLOBAL_ACTION_POWER_DIALOG);
                }
            }
        };
        
        IntentFilter filter = new IntentFilter(ACTION_SHOW_POWER_MENU);
        
        // Compatibilidade com as políticas rigorosas do Android 13+ (Tiramisu)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(receiver, filter);
        }
    }

    @Override
    public boolean onUnbind(Intent intent) {
        if (receiver != null) {
            unregisterReceiver(receiver);
            receiver = null;
        }
        return super.onUnbind(intent);
    }
}
