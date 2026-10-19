
 // frontend-autos/src/app/(tabs)/_layout.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROJO = '#C21D30';
const GRIS = '#88909F';

type NombreIcono = React.ComponentProps<typeof Ionicons>['name'];

function IconoPestana({
  activo,
  normal,
  seleccionado,
}: {
  activo: boolean;
  normal: NombreIcono;
  seleccionado: NombreIcono;
}) {
  return (
    <View style={[
      estilos.contenedorIcono,
      activo && estilos.iconoSeleccionado,
    ]}>
      <Ionicons
        name={activo ? seleccionado : normal}
        size={23}
        color={activo ? ROJO : GRIS}
      />
    </View>
  );
}

export default function DistribucionPestanas() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ROJO,
        tabBarInactiveTintColor: GRIS,

        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1E8EA',
          height: 69 + bottom,
          paddingTop: 7,
          paddingBottom: Math.max(bottom, 5),
          elevation: 12,
          shadowColor: '#3B1520',
          shadowOpacity: 0.08,
          shadowRadius: 15,
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 1,
        },

        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Autos',
          tabBarIcon: ({ focused }) => (
            <IconoPestana
              activo={focused}
              normal="car-sport-outline"
              seleccionado="car-sport"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="categorias"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ focused }) => (
            <IconoPestana
              activo={focused}
              normal="grid-outline"
              seleccionado="grid"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="solicitudes"
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ focused }) => (
            <IconoPestana
              activo={focused}
              normal="receipt-outline"
              seleccionado="receipt"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cuenta"
        options={{
          title: 'Mi cuenta',
          tabBarIcon: ({ focused }) => (
            <IconoPestana
              activo={focused}
              normal="person-circle-outline"
              seleccionado="person-circle"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  contenedorIcono: {
    width: 53,
    height: 33,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoSeleccionado: {
    backgroundColor: '#FCE8EC',
  },
});
