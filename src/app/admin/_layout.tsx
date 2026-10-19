
 // frontend-autos/src/app/admin/_layout.tsx

import React from 'react';

import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { Redirect, Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { usarSesion } from '../../contextos/sesion';
import { esAdministrador } from '../../servicios/autenticacion';

const ROJO = '#C21D30';
const GRIS = '#8B93A2';

export default function LayoutAdministrador() {
  const { sesion, cargando } = usarSesion();
  const { bottom } = useSafeAreaInsets();

  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator
          size="large"
          color={ROJO}
        />
      </View>
    );
  }

  if (!sesion || !esAdministrador(sesion.usuario)) {
    return <Redirect href="/(tabs)/cuenta" />;
  }

  const espacioInferior =
    Platform.OS === 'web' ? 10 : bottom + 8;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: ROJO,
        tabBarInactiveTintColor: GRIS,

        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          backgroundColor: '#FFFFFF',

          borderTopWidth: 1,
          borderTopColor: '#F1DDE2',

          height: 72 + espacioInferior,
          paddingTop: 8,
          paddingBottom: espacioInferior,

          elevation: 8,

          shadowColor: '#471724',
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },

        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 0,
        },

        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 1,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          marginTop: 0,
          marginBottom: 0,
          textAlign: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Administración',

          tabBarIcon: ({ focused }) => (
            <View
              style={[
                estilos.icono,
                focused && estilos.iconoActivo,
              ]}
            >
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={23}
                color={focused ? ROJO : GRIS}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="cuenta"
        options={{
          title: 'Mi cuenta',

          tabBarIcon: ({ focused }) => (
            <View
              style={[
                estilos.icono,
                focused && estilos.iconoActivo,
              ]}
            >
              <Ionicons
                name={
                  focused
                    ? 'person-circle'
                    : 'person-circle-outline'
                }
                size={25}
                color={focused ? ROJO : GRIS}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  cargando: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icono: {
    width: 59,
    height: 31,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconoActivo: {
    backgroundColor: '#FCE8EC',
  },
});
