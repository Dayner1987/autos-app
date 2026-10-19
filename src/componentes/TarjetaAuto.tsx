
 // frontend-autos/src/componentes/TarjetaAuto.tsx

import React from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import type { Auto } from '../tipos/modelos';
import { imagenUrl } from '../configuracion/api';
import { estilo } from '../configuracion/estilos';
import { n } from '../estilos/nativos';

export function precioAuto(auto: Auto): string {
  const cantidad = Number(auto.precio);

  const valor = Number.isFinite(cantidad)
    ? cantidad.toLocaleString('es-BO', {
        maximumFractionDigits: 2,
      })
    : auto.precio;

  return `${auto.moneda === 'USD' ? '$us' : 'Bs'} ${valor}`;
}

export function TarjetaAuto({ auto }: { auto: Auto }) {
  const foto = imagenUrl(
    auto.imagen?.formats?.medium?.url ??
    auto.imagen?.url
  );

  const disponible = auto.estado === 'DISPONIBLE';

  const estado = disponible
    ? 'Disponible'
    : auto.estado === 'RESERVADO'
      ? 'Reservado'
      : 'Vendido';

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/auto/[id]',
          params: { id: auto.documentId },
        })
      }
      style={estilo('auto-tarjeta', [
        n.tarjeta,
        { padding: 0, overflow: 'hidden' },
      ])}
    >
      {foto ? (
        <Image
          source={{ uri: foto }}
          resizeMode="cover"
          style={estilo('auto-foto', n.fotografia)}
        />
      ) : (
        <View style={estilo('auto-sin-foto', n.sinFoto)}>
          <Ionicons
            name="car-sport-outline"
            size={54}
            color="#C47B88"
          />
        </View>
      )}

      <View style={estilo('auto-contenido', {
        padding: 17,
      })}>
        <View
          style={estilo(
            disponible
              ? 'auto-estado'
              : 'auto-estado vendido',
            [
              n.estadoAutoEtiqueta,
              !disponible && n.estadoAutoVendido,
            ]
          )}
        >
          <Text
            style={estilo(
              disponible
                ? 'auto-estado-texto'
                : 'auto-estado-texto vendido',
              [
                n.estadoAutoTexto,
                !disponible && n.estadoAutoVendidoTexto,
              ]
            )}
          >
            {estado}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          style={estilo('auto-nombre', n.nombreAuto)}
        >
          {auto.titulo}
        </Text>

        <Text
          style={estilo('auto-detalle', n.detalleAuto)}
        >
          {auto.marca?.nombre || 'Sin marca'}
          {' · '}
          {auto.modelo}
          {' · '}
          {auto.anio}
        </Text>

        <View style={estilo('auto-pie', n.autoPie)}>
          <View>
            <Text
              style={estilo(
                'auto-etiqueta-precio',
                n.infoEtiqueta
              )}
            >
              Precio de venta
            </Text>

            <Text style={estilo('auto-precio', n.precio)}>
              {precioAuto(auto)}
            </Text>
          </View>

          <View style={estilo('auto-ver', n.autoVerIcono)}>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#C21D30"
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
