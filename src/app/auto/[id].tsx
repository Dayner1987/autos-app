
 // frontend-autos/src/app/auto/[id].tsx

import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

import { Campo } from '../../componentes/Campo';
import { Boton } from '../../componentes/Boton';
import { precioAuto } from '../../componentes/TarjetaAuto';

import { buscarAuto } from '../../servicios/colecciones';
import { solicitarCompra } from '../../servicios/compras';
import { mensajeError } from '../../servicios/peticion';

import { usarSesion } from '../../contextos/sesion';
import { imagenUrl } from '../../configuracion/api';
import { estilo } from '../../configuracion/estilos';
import { n } from '../../estilos/nativos';

import type { Auto } from '../../tipos/modelos';

const ROJO = '#C21D30';

export default function PantallaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sesion } = usarSesion();

  const [auto, setAuto] = useState<Auto | null>(null);

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Obtener la información real del auto desde Strapi.
  useEffect(() => {
    let activo = true;

    async function cargarAuto() {
      setCargando(true);
      setError('');
      setExito('');
      setAuto(null);

      try {
        if (!id) {
          throw new Error('No se encontró el identificador del auto.');
        }

        const resultado = await buscarAuto(id);

        if (activo) {
          setAuto(resultado);
        }
      } catch (e) {
        if (activo) {
          setError(mensajeError(e));
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargarAuto();

    return () => {
      activo = false;
    };
  }, [id]);

  // Volver al catálogo si no existe una pantalla anterior.
  function volver() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }

  // Enviar una solicitud de compra.
  async function solicitar() {
    if (enviando || !sesion || !auto) return;

    setError('');
    setExito('');

    if (nombre.trim().length < 3) {
      setError('Escribe tu nombre completo.');
      return;
    }

    const telefono = celular.trim();

    if (!/^\+?[\d\s()-]{6,20}$/.test(telefono)) {
      setError('Introduce un número de celular válido.');
      return;
    }

    if (auto.estado !== 'DISPONIBLE') {
      setError('Este auto ya no está disponible.');
      return;
    }

    setEnviando(true);

    try {
      await solicitarCompra(sesion.jwt, {
        autoDocumentId: auto.documentId,
        nombreCompleto: nombre.trim(),
        celular: telefono,
        observaciones: observaciones.trim(),
      });

      setExito(
        'Tu solicitud fue enviada correctamente. Puedes consultar su estado en Mis solicitudes.'
      );

      setObservaciones('');
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setEnviando(false);
    }
  }

  const foto = imagenUrl(
    auto?.imagen?.formats?.medium?.url ??
    auto?.imagen?.url
  );

  const disponible = auto?.estado === 'DISPONIBLE';

  const estadoTexto =
    auto?.estado === 'DISPONIBLE'
      ? 'Disponible'
      : auto?.estado === 'RESERVADO'
        ? 'Reservado'
        : 'Vendido';

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[
        estilo('ui-pantalla detalle-pantalla', n.pantalla),
        {
          flex: 1,
          minHeight: 0,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          minHeight: 0,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={[
            estilo('detalle-scroll', n.detalleScroll),
            {
              flex: 1,
              minHeight: 0,
            },
          ]}
          contentContainerStyle={[
            estilo('detalle-contenido', n.detalleContenido),
            {
              flexGrow: 1,
              paddingBottom: 85,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Navegación */}
          <Pressable
            onPress={volver}
            accessibilityRole="button"
            style={estilo('detalle-volver', n.detalleVolver)}
          >
            <View
              style={estilo(
                'detalle-volver-icono',
                n.detalleVolverIcono
              )}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={ROJO}
              />
            </View>

            <Text
              style={estilo(
                'detalle-volver-texto',
                n.enlace
              )}
            >
              Volver al catálogo
            </Text>
          </Pressable>

          {/* Cargando */}
          {cargando && (
            <View style={estilo(
              'detalle-cargando',
              n.detalleCargando
            )}>
              <ActivityIndicator
                size="large"
                color={ROJO}
              />

              <Text style={estilo('ui-subtitulo', n.subtitulo)}>
                Cargando información del vehículo...
              </Text>
            </View>
          )}

          {/* Auto no encontrado */}
          {!cargando && !auto && (
            <View style={estilo('detalle-formulario', n.tarjeta)}>
              <Ionicons
                name="alert-circle-outline"
                size={38}
                color={ROJO}
              />

              <Text
                style={estilo('detalle-subtitulo', n.nombreAuto)}
              >
                No se pudo cargar el vehículo
              </Text>

              <Text style={estilo('ui-error', n.error)}>
                {error || 'No encontramos este vehículo.'}
              </Text>

              <Boton
                texto="Volver al catálogo"
                alPulsar={volver}
              />
            </View>
          )}

          {/* Información principal */}
          {!cargando && auto && (
            <>
              <View
                style={estilo(
                  'detalle-imagen-contenedor',
                  n.detalleImagenContenedor
                )}
              >
                {foto ? (
                  <Image
                    source={{ uri: foto }}
                    resizeMode="cover"
                    style={estilo(
                      'detalle-foto',
                      n.detalleFoto
                    )}
                  />
                ) : (
                  <View
                    style={estilo(
                      'detalle-sin-foto',
                      n.detalleSinFoto
                    )}
                  >
                    <Ionicons
                      name="car-sport-outline"
                      size={65}
                      color="#C68491"
                    />
                    <Text style={estilo(
                      'ui-subtitulo',
                      n.subtitulo
                    )}>
                      Fotografía no disponible
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={estilo(
                  'detalle-informacion',
                  n.detalleInformacion
                )}
              >
                <View
                  style={[
                    estilo('detalle-estado', n.detalleEstado),
                    !disponible && {
                      backgroundColor: '#FCE8EC',
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      disponible
                        ? 'checkmark-circle'
                        : 'time-outline'
                    }
                    size={16}
                    color={
                      disponible ? '#187849' : ROJO
                    }
                  />

                  <Text
                    style={[
                      estilo(
                        'detalle-estado-texto',
                        n.detalleEstadoTexto
                      ),
                      !disponible && {
                        color: ROJO,
                      },
                    ]}
                  >
                    {estadoTexto}
                  </Text>
                </View>

                <Text
                  style={estilo(
                    'detalle-titulo',
                    n.detalleTitulo
                  )}
                >
                  {auto.titulo}
                </Text>

                <Text
                  style={estilo(
                    'detalle-marca',
                    n.detalleMarca
                  )}
                >
                  {auto.marca?.nombre || 'Sin marca'}
                  {' · '}
                  {auto.modelo}
                </Text>

                <View
                  style={estilo(
                    'detalle-precio-contenedor',
                    n.detallePrecioContenedor
                  )}
                >
                  <Text
                    style={estilo(
                      'detalle-precio-etiqueta',
                      n.infoEtiqueta
                    )}
                  >
                    Precio de venta
                  </Text>

                  <Text
                    style={estilo(
                      'detalle-precio',
                      n.detallePrecio
                    )}
                  >
                    {precioAuto(auto)}
                  </Text>
                </View>
              </View>

              {/* Características */}
              <View
                style={estilo(
                  'detalle-caracteristicas',
                  n.detalleCaracteristicas
                )}
              >
                <Text
                  style={estilo(
                    'detalle-subtitulo',
                    n.detalleSubtitulo
                  )}
                >
                  Características
                </Text>

                <View
                  style={estilo(
                    'detalle-grid',
                    n.detalleGrid
                  )}
                >
                  <DatoAuto
                    icono="calendar-outline"
                    etiqueta="Año"
                    valor={String(auto.anio)}
                  />

                  <DatoAuto
                    icono="speedometer-outline"
                    etiqueta="Kilometraje"
                    valor={
                      auto.kilometraje != null
                        ? `${auto.kilometraje.toLocaleString('es-BO')} km`
                        : 'No especificado'
                    }
                  />

                  <DatoAuto
                    icono="settings-outline"
                    etiqueta="Transmisión"
                    valor={
                      auto.transmision === 'AUTOMATICA'
                        ? 'Automática'
                        : 'Manual'
                    }
                  />

                  <DatoAuto
                    icono="flash-outline"
                    etiqueta="Combustible"
                    valor={auto.combustible || 'No especificado'}
                  />

                  {!!auto.color && (
                    <DatoAuto
                      icono="color-palette-outline"
                      etiqueta="Color"
                      valor={auto.color}
                    />
                  )}

                  {!!auto.ubicacion && (
                    <DatoAuto
                      icono="location-outline"
                      etiqueta="Ubicación"
                      valor={auto.ubicacion}
                    />
                  )}
                </View>
              </View>

              {/* Descripción */}
              {!!auto.descripcion && (
                <View
                  style={estilo(
                    'detalle-descripcion-contenedor',
                    n.detalleDescripcionContenedor
                  )}
                >
                  <Text
                    style={estilo(
                      'detalle-subtitulo',
                      n.detalleSubtitulo
                    )}
                  >
                    Descripción
                  </Text>

                  <Text
                    style={estilo(
                      'detalle-descripcion',
                      n.detalleDescripcion
                    )}
                  >
                    {auto.descripcion}
                  </Text>
                </View>
              )}

              {/* Formulario de solicitud */}
              <View
                style={estilo(
                  'detalle-formulario',
                  n.detalleFormulario
                )}
              >
                <View
                  style={estilo(
                    'detalle-formulario-cabecera',
                    n.detalleFormularioCabecera
                  )}
                >
                  <View
                    style={estilo(
                      'detalle-formulario-icono',
                      n.detalleFormularioIcono
                    )}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={25}
                      color={ROJO}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={estilo(
                        'detalle-subtitulo',
                        n.detalleSubtitulo
                      )}
                    >
                      Solicitar compra
                    </Text>

                    <Text
                      style={estilo(
                        'ui-subtitulo',
                        n.subtitulo
                      )}
                    >
                      Envía tus datos para que la tienda te contacte.
                    </Text>
                  </View>
                </View>

                {!disponible ? (
                  <View
                    style={estilo(
                      'detalle-aviso',
                      n.detalleAviso
                    )}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={22}
                      color={ROJO}
                    />

                    <Text
                      style={{
                        color: '#9E2637',
                        flex: 1,
                        lineHeight: 21,
                      }}
                    >
                      Este vehículo no está disponible para nuevas solicitudes.
                    </Text>
                  </View>
                ) : !sesion ? (
                  <>
                    <Text
                      style={estilo(
                        'detalle-ayuda',
                        n.detalleAyuda
                      )}
                    >
                      Para reservar o solicitar un vehículo,
                      primero debes iniciar sesión o registrarte.
                    </Text>

                    <Boton
                      texto="Iniciar sesión"
                      alPulsar={() =>
                        router.push('/iniciar-sesion')
                      }
                    />

                    <Boton
                      texto="Crear una cuenta"
                      secundario
                      alPulsar={() =>
                        router.push('/registro')
                      }
                    />
                  </>
                ) : (
                  <>
                    <Campo
                      etiqueta="Nombre completo"
                      valor={nombre}
                      cambiar={setNombre}
                      pista="Ej. Juan Pérez"
                    />

                    <Campo
                      etiqueta="Celular"
                      tipo="phone-pad"
                      valor={celular}
                      cambiar={setCelular}
                      pista="Número de contacto"
                    />

                    <Campo
                      etiqueta="Mensaje (opcional)"
                      valor={observaciones}
                      cambiar={setObservaciones}
                      pista="¿Qué deseas consultar sobre este auto?"
                      multilinea
                    />

                    {!!error && (
                      <Text
                        style={estilo('ui-error', n.error)}
                      >
                        {error}
                      </Text>
                    )}

                    {!!exito && (
                      <View
                        style={estilo(
                          'detalle-exito',
                          n.detalleExito
                        )}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={23}
                          color="#187849"
                        />

                        <Text
                          style={{
                            flex: 1,
                            color: '#187849',
                            lineHeight: 21,
                          }}
                        >
                          {exito}
                        </Text>
                      </View>
                    )}

                    <Boton
                      texto={
                        exito
                          ? 'Solicitud enviada'
                          : 'Enviar solicitud'
                      }
                      cargando={enviando}
                      deshabilitado={!!exito}
                      alPulsar={() => void solicitar()}
                    />

                    {!!exito && (
                      <Boton
                        texto="Ver mis solicitudes"
                        secundario
                        alPulsar={() =>
                          router.push('/(tabs)/solicitudes')
                        }
                      />
                    )}

                    <View
                      style={estilo(
                        'detalle-nota',
                        n.detalleNota
                      )}
                    >
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={18}
                        color="#768292"
                      />

                      <Text
                        style={{
                          flex: 1,
                          color: '#768292',
                          fontSize: 12,
                          lineHeight: 19,
                        }}
                      >
                        Esta solicitud no realiza ningún cobro.
                        La tienda confirmará la disponibilidad
                        y el proceso de compra.
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Componente reutilizable para las características.
type NombreIcono = React.ComponentProps<
  typeof Ionicons
>['name'];

function DatoAuto({
  icono,
  etiqueta,
  valor,
}: {
  icono: NombreIcono;
  etiqueta: string;
  valor: string;
}) {
  return (
    <View
      style={estilo('detalle-dato', n.detalleDato)}
    >
      <View
        style={estilo(
          'detalle-dato-icono',
          n.detalleDatoIcono
        )}
      >
        <Ionicons
          name={icono}
          size={21}
          color={ROJO}
        />
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={estilo(
            'detalle-dato-etiqueta',
            n.detalleDatoEtiqueta
          )}
        >
          {etiqueta}
        </Text>

        <Text
          style={estilo(
            'detalle-dato-valor',
            n.detalleDatoValor
          )}
        >
          {valor}
        </Text>
      </View>
    </View>
  );
}
