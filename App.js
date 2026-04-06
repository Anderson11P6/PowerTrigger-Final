import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, NativeModules, AppState, Alert } from 'react-native';

const { PowerMenuModule } = NativeModules;

export default function App() {
  const [isEnabled, setIsEnabled] = useState(false);

  const checkStatus = async () => {
    if (!PowerMenuModule) return;
    try {
      const status = await PowerMenuModule.isAccessibilityServiceEnabled();
      setIsEnabled(status);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkStatus();
    const subscription = AppState.addEventListener('change', checkStatus);
    return () => subscription.remove();
  }, []);

  const handleOpenPowerMenu = () => {
    if (!PowerMenuModule) {
      Alert.alert('Erro', 'Módulo Nativo não encontrado.');
      return;
    }
    
    if (isEnabled) {
      PowerMenuModule.showPowerMenu();
    } else {
      Alert.alert(
        'Permissão Necessária',
        'Ative o serviço "PowerTrigger" na Acessibilidade.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configurações', onPress: () => PowerMenuModule.openAccessibilitySettings() }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PowerTrigger</Text>
      <Text style={styles.status}>Serviço: {isEnabled ? '✅' : '❌'}</Text>
      <TouchableOpacity
        style={[styles.button, isEnabled ? styles.btnActive : styles.btnInactive]}
        onPress={handleOpenPowerMenu}
      >
        <Text style={styles.buttonText}>{isEnabled ? 'ABRIR MENU' : 'ATIVAR'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2E' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#CDD6F4', marginBottom: 10 },
  status: { fontSize: 14, marginBottom: 50, color: '#A6ADC8' },
  button: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, width: '80%', alignItems: 'center' },
  btnActive: { backgroundColor: '#F38BA8' },
  btnInactive: { backgroundColor: '#89B4FA' },
  buttonText: { color: '#11111B', fontSize: 16, fontWeight: 'bold' }
});
    
