// frontend-autos/src/app/_layout.tsx
import '../estilos/hoja';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProveedorSesion } from '../contextos/sesion';
export default function DistribucionPrincipal() {
  return <SafeAreaProvider><ProveedorSesion>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auto/[id]" />
      <Stack.Screen name="iniciar-sesion" />
      <Stack.Screen name="registro" />
      <Stack.Screen name="admin/index" />
    </Stack>
  </ProveedorSesion></SafeAreaProvider>;
}
