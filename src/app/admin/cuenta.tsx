
 // frontend-autos/src/app/(tabs)/cuenta.tsx

import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Boton } from '../../componentes/Boton';
import { esAdministrador } from '../../servicios/autenticacion';
import { usarSesion } from '../../contextos/sesion';
import { estilo } from '../../configuracion/estilos';
import { n } from '../../estilos/nativos';

export default function Cuenta() {
  const { sesion, cargando, salir } = usarSesion();

  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState('');

  const usuario = sesion?.usuario;
  const administrador = usuario
    ? esAdministrador(usuario)
    : false;

  const iniciales = usuario?.username
    ?.slice(0, 2)
    .toUpperCase() ?? 'AU';

  async function cerrarSesion() {
    if (cerrando) return;

    setCerrando(true);
    setError('');

    try {
      await salir();
      // No navegamos: el contexto actualiza la vista.
    } catch {
      setError('No se pudo cerrar sesión. Intenta nuevamente.');
    } finally {
      setCerrando(false);
    }
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={estilo('ui-pantalla', n.pantalla)}
    >
      <ScrollView
        contentContainerStyle={estilo(
          'cuenta-contenido',
          {
            paddingHorizontal: 18,
            paddingTop: 25,
            paddingBottom: 45,
            flexGrow: 1,
          }
        )}
      >
        <Text style={estilo('ui-titulo', n.titulo)}>
          Mi cuenta
        </Text>

        <Text style={estilo('ui-subtitulo', n.subtitulo)}>
          Administra tu perfil y tu sesión.
        </Text>

        {cargando ? (
          <ActivityIndicator
            size="large"
            color="#C21D30"
            style={{ marginTop: 50 }}
          />
        ) : usuario ? (
          <View style={estilo('cuenta-panel', n.tarjeta)}>
            <View
              style={estilo(
                'cuenta-perfil-cabecera',
                n.perfilCabecera
              )}
            >
              <View
                style={estilo('cuenta-avatar', n.avatar)}
              >
                <Text
                  style={estilo(
                    'cuenta-avatar-texto',
                    n.avatarTexto
                  )}
                >
                  {iniciales}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={estilo('cuenta-nombre', n.nombreAuto)}
                >
                  {usuario.username}
                </Text>

                <Text
                  style={estilo(
                    'cuenta-perfil-subtitulo',
                    n.perfilSubtitulo
                  )}
                >
                  {administrador
                    ? 'Cuenta administrativa'
                    : 'Cliente registrado'}
                </Text>
              </View>
            </View>

            <View
              style={estilo('cuenta-info-fila', n.infoFila)}
            >
              <Ionicons
                name="mail-outline"
                size={22}
                color="#C21D30"
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={estilo(
                    'cuenta-info-etiqueta',
                    n.infoEtiqueta
                  )}
                >
                  Correo electrónico
                </Text>

                <Text
                  style={estilo(
                    'cuenta-info-valor',
                    n.infoValor
                  )}
                >
                  {usuario.email}
                </Text>
              </View>
            </View>

            <View
              style={estilo('cuenta-info-fila', n.infoFila)}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#C21D30"
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={estilo(
                    'cuenta-info-etiqueta',
                    n.infoEtiqueta
                  )}
                >
                  Tipo de cuenta
                </Text>

                <Text
                  style={estilo(
                    'cuenta-info-valor',
                    n.infoValor
                  )}
                >
                  {usuario.role?.name || 'Cliente'}
                </Text>
              </View>
            </View>

            <View
              style={estilo('cuenta-acciones', n.perfilAcciones)}
            >
              {administrador && (
                <Boton
                  texto="Administrar colecciones"
                  alPulsar={() => router.push('/admin')}
                />
              )}

              {!administrador && (
                <Boton
                  texto="Ver mis solicitudes"
                  alPulsar={() =>
                    router.push('/(tabs)/solicitudes')
                  }
                />
              )}

              {!!error && (
                <Text style={estilo('ui-error', n.error)}>
                  {error}
                </Text>
              )}

              <Boton
                texto="Cerrar sesión"
                secundario
                cargando={cerrando}
                alPulsar={() => void cerrarSesion()}
              />
            </View>
          </View>
        ) : (
          <View style={estilo('cuenta-panel', n.tarjeta)}>
            <View
              style={estilo(
                'cuenta-invitado-icono',
                n.invitadoIcono
              )}
            >
              <Ionicons
                name="person-outline"
                size={36}
                color="#C21D30"
              />
            </View>

            <Text
              style={estilo(
                'cuenta-invitado-titulo',
                n.invitadoTitulo
              )}
            >
              Bienvenido a nuestra tienda
            </Text>

            <Text style={estilo('ui-subtitulo', n.subtitulo)}>
              Explora nuestros autos sin registrarte.
              Para solicitar una compra, ingresa a tu cuenta.
            </Text>

            <View
              style={estilo('cuenta-acciones', n.perfilAcciones)}
            >
              <Boton
                texto="Iniciar sesión"
                alPulsar={() =>
                  router.push('/iniciar-sesion')
                }
              />

              <Boton
                texto="Crear una cuenta"
                secundario
                alPulsar={() => router.push('/registro')}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
