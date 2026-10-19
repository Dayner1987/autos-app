
 // frontend-autos/src/componentes/Boton.tsx

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
} from 'react-native';

import { estilo } from '../configuracion/estilos';
import { n } from '../estilos/nativos';

interface PropiedadesBoton {
  texto: string;
  alPulsar: () => void;
  cargando?: boolean;
  secundario?: boolean;
  peligro?: boolean;
  deshabilitado?: boolean;
}

export function Boton({
  texto,
  alPulsar,
  cargando = false,
  secundario = false,
  peligro = false,
  deshabilitado = false,
}: PropiedadesBoton) {
  const inactivo = cargando || deshabilitado;

  const clase = peligro
    ? 'ui-boton ui-boton-peligro'
    : secundario
      ? 'ui-boton ui-boton-secundario'
      : 'ui-boton';

  return (
    <Pressable
      disabled={inactivo}
      onPress={alPulsar}
      accessibilityRole="button"
      style={({ pressed }) => [
        estilo(clase, [
          n.boton,
          peligro && n.botonPeligro,
          secundario && n.botonSecundario,
        ]),
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'stretch',
          minHeight: 52,
          paddingHorizontal: 18,
          paddingVertical: 13,
          opacity: inactivo ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      {cargando ? (
        <ActivityIndicator
          color={secundario ? '#C21D30' : '#FFFFFF'}
        />
      ) : (
        <Text
          numberOfLines={2}
          style={[
            estilo(
              secundario
                ? 'ui-boton-texto secundario'
                : 'ui-boton-texto',
              [
                n.textoBoton,
                secundario && n.textoSecundario,
              ]
            ),
            {
              textAlign: 'center',
              fontSize: 15,
              fontWeight: '800',
              flexShrink: 1,
            },
          ]}
        >
          {texto}
        </Text>
      )}
    </Pressable>
  );
}
