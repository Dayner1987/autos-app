
 // frontend-autos/src/app/(tabs)/solicitudes.tsx

import React, {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Boton } from '../../componentes/Boton';

import {
  cancelarSolicitud,
  misSolicitudes,
} from '../../servicios/compras';

import {
  esAdministrador,
} from '../../servicios/autenticacion';

import { mensajeError } from '../../servicios/peticion';
import { usarSesion } from '../../contextos/sesion';
import { estilo } from '../../configuracion/estilos';
import { n } from '../../estilos/nativos';

import type { Venta } from '../../tipos/modelos';

const ROJO = '#C21D30';

export default function Solicitudes() {
  const { sesion } = usarSesion();

  const token = sesion?.jwt ?? null;
  const administrador = esAdministrador(
    sesion?.usuario ?? null
  );

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  const [error, setError] = useState('');
  const [confirmarId, setConfirmarId] = useState<string | null>(null);

  // Identifica cada petición para descartar respuestas anteriores.
  const numeroPeticion = useRef(0);

  // Guarda el token actual, incluso si cambia durante una petición.
  const tokenActual = useRef(token);
  tokenActual.current = token;

  const cargar = useCallback(
    async (esActualizacion = false) => {
      const numero = ++numeroPeticion.current;

      // Sin sesión, o si es administrador, no consultar
      // las solicitudes privadas de un cliente.
      if (!token || administrador) {
        setVentas([]);
        setError('');
        setCargando(false);
        setActualizando(false);
        return;
      }

      if (esActualizacion) {
        setActualizando(true);
      } else {
        setCargando(true);
      }

      setError('');

      try {
        const resultado = await misSolicitudes(token);

        // Ignorar respuestas de una sesión anterior.
        if (
          numero !== numeroPeticion.current ||
          tokenActual.current !== token
        ) {
          return;
        }

        setVentas(resultado);
      } catch (e) {
        if (
          numero !== numeroPeticion.current ||
          tokenActual.current !== token
        ) {
          return;
        }

        setError(mensajeError(e));
      } finally {
        if (
          numero === numeroPeticion.current &&
          tokenActual.current === token
        ) {
          setCargando(false);
          setActualizando(false);
        }
      }
    },
    [token, administrador]
  );

  // Se ejecuta al entrar a la pantalla y cuando cambia
  // el usuario o su token de autenticación.
  useFocusEffect(
    useCallback(() => {
      setVentas([]);
      setError('');
      setConfirmarId(null);
      setCancelando(false);

      void cargar();

      return () => {
        // Invalidar las peticiones al salir de la ventana.
        numeroPeticion.current += 1;
      };
    }, [cargar])
  );

  async function cancelar(id: string) {
    if (!token || cancelando || administrador) return;

    const tokenOperacion = token;

    setCancelando(true);
    setError('');

    try {
      await cancelarSolicitud(tokenOperacion, id);

      // No actualizar esta pantalla si cambió la sesión.
      if (tokenActual.current !== tokenOperacion) return;

      setConfirmarId(null);

      await cargar(true);
    } catch (e) {
      if (tokenActual.current === tokenOperacion) {
        setError(mensajeError(e));
      }
    } finally {
      if (tokenActual.current === tokenOperacion) {
        setCancelando(false);
      }
    }
  }

  const necesitaPermisos =
    /forbidden|403|prohibido|sin permiso/i.test(error);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        estilo('ui-pantalla', n.pantalla),
        { flex: 1, minHeight: 0 },
      ]}
    >
      <FlatList
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
        }}
        data={token && !administrador ? ventas : []}
        keyExtractor={(item) => item.documentId}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        scrollEnabled
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 90,
        }}
        refreshControl={
          <RefreshControl
            refreshing={actualizando}
            onRefresh={() => void cargar(true)}
            colors={[ROJO]}
            tintColor={ROJO}
          />
        }
        ListHeaderComponent={
          <>
            <View
              style={estilo('solicitudes-cabecera', [
                n.encabezado,
                n.banner,
              ])}
            >
              <Text
                style={estilo('ui-titulo', [
                  n.titulo,
                  n.tituloBanner,
                ])}
              >
                Mis solicitudes
              </Text>

              <Text
                style={estilo('ui-subtitulo', [
                  n.subtitulo,
                  n.subtituloBanner,
                ])}
              >
                Consulta el estado de tus solicitudes de compra.
              </Text>
            </View>

            {!token && (
              <View
                style={estilo('solicitudes-bloque', [
                  n.tarjeta,
                  { marginHorizontal: 16 },
                ])}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={32}
                  color={ROJO}
                />

                <Text
                  style={[
                    n.nombreAuto,
                    { marginTop: 12, marginBottom: 8 },
                  ]}
                >
                  Inicia sesión
                </Text>

                <Text style={n.subtitulo}>
                  Para consultar y cancelar tus solicitudes
                  necesitas acceder a tu cuenta.
                </Text>

                <View style={{ marginTop: 15 }}>
                  <Boton
                    texto="Iniciar sesión"
                    alPulsar={() =>
                      router.push('/iniciar-sesion')
                    }
                  />
                </View>
              </View>
            )}

            {!!token && administrador && (
              <View
                style={[
                  n.tarjeta,
                  { marginHorizontal: 16 },
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={32}
                  color={ROJO}
                />

                <Text
                  style={[
                    n.nombreAuto,
                    { marginTop: 12 },
                  ]}
                >
                  Cuenta administrativa
                </Text>

                <Text style={n.subtitulo}>
                  Las solicitudes de clientes se gestionan
                  desde el panel de administración.
                </Text>

                <View style={{ marginTop: 15 }}>
                  <Boton
                    texto="Ir a administración"
                    alPulsar={() => router.push('/admin')}
                  />
                </View>
              </View>
            )}

            {!!error && (
              <View
                style={[
                  n.tarjeta,
                  { marginHorizontal: 16 },
                ]}
              >
                <Text style={estilo('ui-error', n.error)}>
                  {error}
                </Text>

                {necesitaPermisos && (
                  <Text style={n.subtitulo}>
                    Strapi rechazó el acceso. Comprueba que
                    el rol Authenticated tenga habilitado
                    el permiso mias de Venta.
                  </Text>
                )}

                <Boton
                  texto="Intentar nuevamente"
                  secundario
                  alPulsar={() => void cargar()}
                />
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !token || administrador ? null : cargando ? (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 55,
                gap: 12,
              }}
            >
              <ActivityIndicator
                size="large"
                color={ROJO}
              />

              <Text style={n.subtitulo}>
                Consultando tus solicitudes...
              </Text>
            </View>
          ) : error ? null : (
            <View
              style={{
                alignItems: 'center',
                paddingHorizontal: 25,
                paddingVertical: 55,
              }}
            >
              <Ionicons
                name="receipt-outline"
                size={48}
                color="#CBA5AC"
              />

              <Text
                style={[
                  n.nombreAuto,
                  { marginTop: 15, textAlign: 'center' },
                ]}
              >
                Sin solicitudes
              </Text>

              <Text
                style={[
                  n.subtitulo,
                  { textAlign: 'center' },
                ]}
              >
                Todavía no has solicitado ningún auto.
              </Text>

              <View
                style={{
                  width: '100%',
                  maxWidth: 320,
                  marginTop: 18,
                }}
              >
                <Boton
                  texto="Explorar autos"
                  alPulsar={() => router.push('/(tabs)')}
                />
              </View>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <View
              style={estilo('solicitud-tarjeta', n.tarjeta)}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <Ionicons
                  name="car-sport-outline"
                  size={25}
                  color={ROJO}
                />

                <Text
                  style={[
                    n.nombreAuto,
                    { flex: 1 },
                  ]}
                >
                  {item.auto?.titulo || 'Auto solicitado'}
                </Text>
              </View>

              <Text
                style={estilo(
                  'solicitud-detalle',
                  n.detalleAuto
                )}
              >
                Estado: {item.estado_solicitud || 'PENDIENTE'}
              </Text>

              <Text
                style={estilo(
                  'solicitud-detalle',
                  n.detalleAuto
                )}
              >
                Precio referencial: {item.precio_final ?? 'Sin definir'}{' '}
                {item.auto?.moneda === 'USD' ? '$us' : 'Bs'}
              </Text>

              {item.estado_solicitud === 'PENDIENTE' && (
                confirmarId === item.documentId ? (
                  <View style={{ marginTop: 12 }}>
                    <Text style={estilo('ui-error', n.error)}>
                      ¿Deseas cancelar esta solicitud?
                    </Text>

                    <Boton
                      texto="Sí, cancelar solicitud"
                      peligro
                      cargando={cancelando}
                      alPulsar={() =>
                        void cancelar(item.documentId)
                      }
                    />

                    <Boton
                      texto="No, conservar"
                      secundario
                      alPulsar={() => setConfirmarId(null)}
                    />
                  </View>
                ) : (
                  <View style={{ marginTop: 12 }}>
                    <Boton
                      texto="Cancelar solicitud"
                      secundario
                      alPulsar={() =>
                        setConfirmarId(item.documentId)
                      }
                    />
                  </View>
                )
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
