// frontend-autos/src/componentes/Campo.tsx
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { estilo } from '../configuracion/estilos';
import { n } from '../estilos/nativos';
export function Campo({ etiqueta, valor, cambiar, tipo, secreto = false, multilinea = false, pista }: {
  etiqueta: string; valor: string; cambiar: (v: string) => void; tipo?: 'email-address' | 'numeric' | 'phone-pad'; secreto?: boolean; multilinea?: boolean; pista?: string;
}) {
  return <View><Text style={estilo('ui-etiqueta', n.etiqueta)}>{etiqueta}</Text>
    <TextInput style={estilo('ui-campo', n.campo)} value={valor} onChangeText={cambiar}
      placeholder={pista || etiqueta} secureTextEntry={secreto} keyboardType={tipo || 'default'}
      multiline={multilinea} placeholderTextColor="#8b96a5" autoCapitalize={tipo === 'email-address' ? 'none' : 'sentences'} />
  </View>;
}
