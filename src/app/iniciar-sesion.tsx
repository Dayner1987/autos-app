
 // frontend-autos/src/app/iniciar-sesion.tsx

import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Boton } from '../componentes/Boton';
import { Campo } from '../componentes/Campo';

import {
  identificar,
  esAdministrador,
} from '../servicios/autenticacion';

import { mensajeError } from '../servicios/peticion';
import { usarSesion } from '../contextos/sesion';
import { estilo } from '../configuracion/estilos';
import { n } from '../estilos/nativos';

export default function IniciarSesion() {
  const { entrar } = usarSesion();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function enviar() {
    if (cargando) return;

    setError('');

    const identificador = correo.trim();

    if (!identificador || !contrasena) {
      setError('Completa tu correo y contraseña.');
      return;
    }

    setCargando(true);

    try {
      // 1. Identificar usuario en Strapi
      const datos = await identificar(
        identificador,
        contrasena
      );

      // 2. Guardar token y datos de sesión
      await entrar(datos);

      // 3. Obtener el rol recuperado de Strapi
      const usuario = datos.usuario;

      // 4. Redirigir según el rol
      if (esAdministrador(usuario)) {
        router.replace('/admin');
      } else {
        router.replace('/(tabs)/cuenta');
      }

    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }

  return (
    <SafeAreaView
      style={estilo('ui-pantalla', n.pantalla)}
      edges={['top', 'bottom']}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={estilo(
          'cuenta-formulario',
          {
            padding: 22,
            flexGrow: 1,
            justifyContent: 'center',
          }
        )}
      >
        <Text style={estilo('ui-titulo', n.titulo)}>
          Iniciar sesión
        </Text>

        <Text style={estilo('ui-subtitulo', n.subtitulo)}>
          Accede a tu cuenta de compra de autos.
        </Text>

        <View style={estilo('cuenta-panel', n.tarjeta)}>
          <Campo
            etiqueta="Correo o nombre de usuario"
            valor={correo}
            cambiar={setCorreo}
          />

          <Campo
            etiqueta="Contraseña"
            secreto
            valor={contrasena}
            cambiar={setContrasena}
          />

          {!!error && (
            <Text style={estilo('ui-error', n.error)}>
              {error}
            </Text>
          )}

          <Boton
            texto="Ingresar"
            cargando={cargando}
            alPulsar={() => void enviar()}
          />

          <Boton
            texto="Crear cuenta"
            secundario
            alPulsar={() => router.push('/registro')}
          />
        </View>

        <Pressable
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={estilo('cuenta-volver', n.enlace)}>
            Volver al catálogo
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
