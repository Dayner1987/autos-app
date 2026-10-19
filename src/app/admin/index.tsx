
 // frontend-autos/src/app/admin/index.tsx

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@expo/ui/community/picker';

import { Boton } from '../../componentes/Boton';
import { Campo } from '../../componentes/Campo';

import { esAdministrador } from '../../servicios/autenticacion';
import {
  crear,
  eliminar,
  listar,
} from '../../servicios/colecciones';

import { mensajeError } from '../../servicios/peticion';
import { usarSesion } from '../../contextos/sesion';
import { estilo } from '../../configuracion/estilos';
import { n } from '../../estilos/nativos';

import type { Coleccion } from '../../tipos/modelos';

const ROJO = '#C21D30';

type Registro = {
  id?: number;
  documentId?: string;
  nombre?: string;
  titulo?: string;
  username?: string;
  nombre_completo?: string;
  correo?: string;
  email?: string;
  auto?: { titulo?: string };
};

type CampoFormulario = {
  nombre: string;
  etiqueta: string;
  tipo?: 'numeric' | 'email-address' | 'phone-pad';
  valores?: string[];
  relacion?: 'marcas' | 'categorias' | 'autos' | 'clientes';
  opcional?: boolean;
};

const COLECCIONES: Coleccion[] = [
  'autos',
  'categorias',
  'marcas',
  'clientes',
  'ventas',
  'usuarios',
];

const FORMULARIOS: Record<Coleccion, CampoFormulario[]> = {
  autos: [
    { nombre: 'titulo', etiqueta: 'Título' },
    {
      nombre: 'descripcion',
      etiqueta: 'Descripción',
      opcional: true,
    },
    { nombre: 'modelo', etiqueta: 'Modelo' },
    { nombre: 'anio', etiqueta: 'Año', tipo: 'numeric' },
    { nombre: 'precio', etiqueta: 'Precio', tipo: 'numeric' },
    {
      nombre: 'kilometraje',
      etiqueta: 'Kilometraje',
      tipo: 'numeric',
      opcional: true,
    },
    {
      nombre: 'color',
      etiqueta: 'Color',
      opcional: true,
    },
    {
      nombre: 'moneda',
      etiqueta: 'Moneda',
      valores: ['BOB', 'USD'],
    },
    {
      nombre: 'transmision',
      etiqueta: 'Transmisión',
      valores: ['MANUAL', 'AUTOMATICA'],
    },
    {
      nombre: 'combustible',
      etiqueta: 'Combustible',
      valores: [
        'GASOLINA',
        'DIESEL',
        'GNV',
        'HIBRIDO',
        'ELECTRICO',
      ],
    },
    {
      nombre: 'estado',
      etiqueta: 'Estado',
      valores: ['DISPONIBLE', 'RESERVADO', 'VENDIDO'],
    },
    {
      nombre: 'marca',
      etiqueta: 'Marca',
      relacion: 'marcas',
    },
    {
      nombre: 'categoria',
      etiqueta: 'Categoría',
      relacion: 'categorias',
    },
  ],

  categorias: [
    { nombre: 'nombre', etiqueta: 'Nombre' },
    {
      nombre: 'descripcion',
      etiqueta: 'Descripción',
      opcional: true,
    },
  ],

  marcas: [
    { nombre: 'nombre', etiqueta: 'Nombre' },
    {
      nombre: 'pais_origen',
      etiqueta: 'País de origen',
      opcional: true,
    },
  ],

  clientes: [
    {
      nombre: 'nombre_completo',
      etiqueta: 'Nombre completo',
    },
    {
      nombre: 'celular',
      etiqueta: 'Celular',
      tipo: 'phone-pad',
    },
    {
      nombre: 'correo',
      etiqueta: 'Correo',
      tipo: 'email-address',
      opcional: true,
    },
  ],

  ventas: [
    {
      nombre: 'fecha_venta',
      etiqueta: 'Fecha YYYY-MM-DD',
    },
    {
      nombre: 'precio_final',
      etiqueta: 'Precio final',
      tipo: 'numeric',
    },
    {
      nombre: 'metodo_pago',
      etiqueta: 'Método de pago',
      valores: [
        'EFECTIVO',
        'TRANSFERENCIA',
        'QR',
        'OTRO',
      ],
    },
    {
      nombre: 'cliente',
      etiqueta: 'Cliente',
      relacion: 'clientes',
    },
    {
      nombre: 'auto',
      etiqueta: 'Auto',
      relacion: 'autos',
    },
    {
      nombre: 'observaciones',
      etiqueta: 'Observaciones',
      opcional: true,
    },
  ],

  usuarios: [
    {
      nombre: 'username',
      etiqueta: 'Nombre de usuario',
    },
    {
      nombre: 'email',
      etiqueta: 'Correo',
      tipo: 'email-address',
    },
    {
      nombre: 'password',
      etiqueta: 'Contraseña inicial',
    },
  ],
};

function nombreRegistro(
  registro: Registro,
  coleccion: Coleccion,
): string {
  if (coleccion === 'ventas') {
    return (
      registro.auto?.titulo ||
      `Venta ${registro.documentId?.slice(0, 8) || ''}`
    );
  }

  return (
    registro.titulo ||
    registro.nombre ||
    registro.nombre_completo ||
    registro.username ||
    registro.email ||
    'Registro'
  );
}

function etiquetaColeccion(coleccion: Coleccion): string {
  const nombres: Record<Coleccion, string> = {
    autos: 'Autos',
    categorias: 'Categorías',
    marcas: 'Marcas',
    clientes: 'Clientes',
    ventas: 'Ventas',
    usuarios: 'Usuarios',
  };

  return nombres[coleccion];
}

export default function Administracion() {
  const { sesion, cargando } = usarSesion();

  const token = sesion?.jwt ?? null;
  const permitido = !!sesion && esAdministrador(sesion.usuario);

  const [coleccion, setColeccion] =
    useState<Coleccion>('autos');

  const [registros, setRegistros] =
    useState<Registro[]>([]);

  const [relaciones, setRelaciones] = useState<
    Record<string, Registro[]>
  >({});

  const [valores, setValores] =
    useState<Record<string, string>>({});

  const [abierto, setAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [esperando, setEsperando] = useState(false);
  const [cargandoRelaciones, setCargandoRelaciones] =
    useState(false);

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [confirmacion, setConfirmacion] =
    useState<string | null>(null);

  // Identificar consultas para evitar datos de sesiones anteriores.
  const numeroConsulta = useRef(0);
  const numeroRelaciones = useRef(0);

  const tokenActual = useRef(token);
  tokenActual.current = token;

  const campos = FORMULARIOS[coleccion];

  // CONSULTAR REGISTROS
  const cargar = useCallback(async () => {
    const numero = ++numeroConsulta.current;

    if (!permitido || !token) {
      setRegistros([]);
      setEsperando(false);
      return;
    }

    setEsperando(true);
    setError('');

    try {
      const resultado = await listar<Registro>(
        coleccion,
        token
      );

      if (
        numero !== numeroConsulta.current ||
        tokenActual.current !== token
      ) {
        return;
      }

      setRegistros(resultado);
    } catch (e) {
      if (
        numero !== numeroConsulta.current ||
        tokenActual.current !== token
      ) {
        return;
      }

      setRegistros([]);
      setError(mensajeError(e));
    } finally {
      if (
        numero === numeroConsulta.current &&
        tokenActual.current === token
      ) {
        setEsperando(false);
      }
    }
  }, [coleccion, token, permitido]);

  // Actualizar cuando entremos a Administración.
  useFocusEffect(
    useCallback(() => {
      void cargar();

      return () => {
        numeroConsulta.current += 1;
      };
    }, [cargar])
  );

  // CONSULTAR RELACIONES
  const cargarRelaciones = useCallback(async () => {
    const numero = ++numeroRelaciones.current;

    if (!permitido || !token) {
      setRelaciones({});
      return;
    }

    const necesarias: (
      'marcas' | 'categorias' | 'clientes' | 'autos'
    )[] =
      coleccion === 'autos'
        ? ['marcas', 'categorias']
        : coleccion === 'ventas'
          ? ['clientes', 'autos']
          : [];

    if (necesarias.length === 0) {
      setRelaciones({});
      return;
    }

    setCargandoRelaciones(true);

    try {
      const respuestas = await Promise.allSettled(
        necesarias.map(async (nombre) => ({
          nombre,
          datos: await listar<Registro>(nombre, token),
        }))
      );

      if (
        numero !== numeroRelaciones.current ||
        tokenActual.current !== token
      ) {
        return;
      }

      const datos: Record<string, Registro[]> = {};

      for (const respuesta of respuestas) {
        if (respuesta.status === 'fulfilled') {
          datos[respuesta.value.nombre] =
            respuesta.value.datos;
        }
      }

      setRelaciones(datos);
    } finally {
      if (
        numero === numeroRelaciones.current &&
        tokenActual.current === token
      ) {
        setCargandoRelaciones(false);
      }
    }
  }, [coleccion, token, permitido]);

  useEffect(() => {
    if (abierto) {
      void cargarRelaciones();
    }

    return () => {
      numeroRelaciones.current += 1;
    };
  }, [abierto, cargarRelaciones]);

  // CAMBIAR COLECCIÓN
  function cambiarColeccion(nueva: Coleccion) {
    numeroConsulta.current += 1;
    numeroRelaciones.current += 1;

    setColeccion(nueva);
    setRegistros([]);
    setRelaciones({});
    setValores({});
    setAbierto(false);
    setConfirmacion(null);
    setError('');
    setExito('');
  }

  function cambiarValor(nombre: string, valor: string) {
    setValores((actual) => ({
      ...actual,
      [nombre]: valor,
    }));
  }

  // CREAR REGISTRO
  async function guardar() {
    if (!token || guardando) return;

    setError('');
    setExito('');

    // Validar campos obligatorios.
    for (const campo of campos) {
      const valor = String(
        valores[campo.nombre] ?? ''
      ).trim();

      if (!campo.opcional && !valor) {
        setError(`Completa el campo ${campo.etiqueta}.`);
        return;
      }
    }

    const data: Record<string, unknown> = {};

    for (const campo of campos) {
      const valor = String(
        valores[campo.nombre] ?? ''
      ).trim();

      if (!valor) continue;

      if (campo.tipo === 'numeric') {
        const numero = Number(valor);

        if (!Number.isFinite(numero)) {
          setError(
            `${campo.etiqueta} debe ser un número válido.`
          );
          return;
        }

        data[campo.nombre] = numero;
      } else {
        // Las relaciones se envían con el documentId
        // seleccionado en Strapi 5.
        data[campo.nombre] = valor;
      }
    }

    if (coleccion === 'ventas') {
      data.estado_solicitud = 'CONFIRMADA';
    }

    setGuardando(true);

    try {
      await crear(coleccion, data, token);

      setValores({});
      setAbierto(false);
      setExito('Registro creado correctamente.');

      await cargar();
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  }

  // ELIMINAR REGISTRO
  async function borrar(registro: Registro) {
    if (!token) return;

    const identificador =
      coleccion === 'usuarios'
        ? registro.id
        : registro.documentId;

    if (!identificador) {
      setError(
        'No se encontró el identificador del registro.'
      );
      return;
    }

    setError('');

    try {
      await eliminar(
        coleccion,
        identificador,
        token
      );

      setConfirmacion(null);
      setExito('Registro eliminado correctamente.');

      await cargar();
    } catch (e) {
      setError(mensajeError(e));
    }
  }

  // PICKER DE MARCA Y CATEGORÍA
  function renderizarPicker(campo: CampoFormulario) {
    const opciones = relaciones[campo.relacion ?? ''] ?? [];

    return (
      <View
        key={campo.nombre}
        style={{
          marginTop: 12,
          marginBottom: 8,
          minWidth: 0,
        }}
      >
        <Text style={estilo('ui-etiqueta', n.etiqueta)}>
          {campo.etiqueta}
        </Text>

        <View
          style={estilo('admin-selector', {
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#E7DDE1',
            borderRadius: 13,
            minHeight: 53,
            marginTop: 8,
            marginBottom: 10,
            justifyContent: 'center',
            overflow: 'hidden',
          })}
        >
          <Picker
            selectedValue={valores[campo.nombre] ?? ''}
            enabled={
              !cargandoRelaciones &&
              opciones.length > 0
            }
            onValueChange={(valor) => {
              cambiarValor(
                campo.nombre,
                String(valor)
              );
            }}
          >
            <Picker.Item
              label={`Selecciona ${
                campo.nombre === 'marca'
                  ? 'una marca'
                  : 'una categoría'
              }`}
              value=""
            />

            {opciones
              .filter((registro) => !!registro.documentId)
              .map((registro) => (
                <Picker.Item
                  key={registro.documentId}
                  label={nombreRegistro(
                    registro,
                    campo.nombre === 'marca'
                      ? 'marcas'
                      : 'categorias'
                  )}
                  value={registro.documentId!}
                />
              ))}
          </Picker>
        </View>

        {cargandoRelaciones && (
          <Text style={n.subtitulo}>
            Cargando opciones...
          </Text>
        )}

        {!cargandoRelaciones &&
          opciones.length === 0 && (
            <View style={{ marginTop: 5 }}>
              <Text style={n.subtitulo}>
                No hay opciones disponibles. Crea una
                {campo.nombre === 'marca'
                  ? ' marca'
                  : ' categoría'}{' '}
                o comprueba los permisos de Strapi.
              </Text>

              <Boton
                texto="Actualizar opciones"
                secundario
                alPulsar={() => void cargarRelaciones()}
              />
            </View>
          )}
      </View>
    );
  }

  // BOTONES DE ENUMERACIONES Y OTRAS RELACIONES
  function renderizarOpciones(campo: CampoFormulario) {
    const opciones: (string | Registro)[] =
      campo.relacion
        ? relaciones[campo.relacion] ?? []
        : campo.valores ?? [];

    return (
      <View key={campo.nombre} style={{ marginTop: 12 }}>
        <Text style={estilo('ui-etiqueta', n.etiqueta)}>
          {campo.etiqueta}
        </Text>

        <View
          style={estilo('admin-opciones', {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginVertical: 10,
          })}
        >
          {opciones.map((opcion) => {
            const id =
              typeof opcion === 'string'
                ? opcion
                : opcion.documentId ?? '';

            const nombre =
              typeof opcion === 'string'
                ? opcion
                : nombreRegistro(
                    opcion,
                    campo.relacion === 'clientes'
                      ? 'clientes'
                      : 'autos'
                  );

            const seleccionado =
              valores[campo.nombre] === id;

            return (
              <Pressable
                key={id}
                onPress={() =>
                  cambiarValor(campo.nombre, id)
                }
                style={[
                  estilo(
                    seleccionado
                      ? 'admin-opcion seleccionado'
                      : 'admin-opcion',
                    [
                      n.chip,
                      seleccionado && n.chipActivo,
                    ]
                  ),
                  {
                    marginRight: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <Text
                  style={estilo(
                    seleccionado
                      ? 'admin-opcion-texto seleccionado'
                      : 'admin-opcion-texto',
                    [
                      n.chipTexto,
                      seleccionado && n.chipTextoActivo,
                    ]
                  )}
                >
                  {nombre}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {!!campo.relacion && opciones.length === 0 && (
          <Text style={n.subtitulo}>
            Todavía no hay registros relacionados.
          </Text>
        )}
      </View>
    );
  }

  // GENERAR CAMPOS DEL FORMULARIO
  function renderizarCampo(campo: CampoFormulario) {
    if (
      coleccion === 'autos' &&
      (campo.nombre === 'marca' ||
        campo.nombre === 'categoria')
    ) {
      return renderizarPicker(campo);
    }

    if (campo.valores || campo.relacion) {
      return renderizarOpciones(campo);
    }

    return (
      <Campo
        key={campo.nombre}
        etiqueta={
          campo.etiqueta +
          (campo.opcional ? ' (opcional)' : '')
        }
        tipo={campo.tipo}
        secreto={campo.nombre === 'password'}
        valor={valores[campo.nombre] ?? ''}
        cambiar={(valor) =>
          cambiarValor(campo.nombre, valor)
        }
      />
    );
  }

  // ESPERAR SESIÓN
  if (cargando) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F4F5F7',
        }}
      >
        <ActivityIndicator
          size="large"
          color={ROJO}
        />
      </View>
    );
  }

  // PROTECCIÓN PARA ADMINISTRADORES
  if (!permitido) {
    return (
      <SafeAreaView
        edges={['top']}
        style={n.pantalla}
      >
        <View style={n.contenedor}>
          <Text style={n.error}>
            No tienes permisos de administrador.
          </Text>

          <Boton
            texto="Volver a Mi cuenta"
            alPulsar={() =>
              router.replace('/(tabs)/cuenta')
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  // INTERFAZ PRINCIPAL
  return (
    <SafeAreaView
      edges={['top']}
      style={[
        estilo('admin-pantalla', n.pantalla),
        {
          flex: 1,
          minHeight: 0,
          width: '100%',
        },
      ]}
    >
      <ScrollView
        style={[
          estilo('admin-scroll', {
            flex: 1,
            minHeight: 0,
            width: '100%',
          }),
          {
            flex: 1,
            minHeight: 0,
          },
        ]}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 115,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        nestedScrollEnabled
        scrollEnabled
        showsVerticalScrollIndicator
      >
        {/* ENCABEZADO */}
        <View
          style={estilo('admin-cabecera', [
            n.banner,
            {
              marginHorizontal: 16,
              marginTop: 16,
              marginBottom: 12,
              padding: 23,
            },
          ])}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 14,
                backgroundColor: '#FFFFFF20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="settings-outline"
                size={27}
                color="#FFFFFF"
              />
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={[
                  n.titulo,
                  {
                    color: '#FFFFFF',
                    fontSize: 25,
                    lineHeight: 31,
                  },
                ]}
              >
                Administración
              </Text>

              <Text
                style={[
                  n.subtitulo,
                  { color: '#FFE6EB' },
                ]}
              >
                Gestión de la tienda de autos
              </Text>
            </View>
          </View>
        </View>

        {/* COLECCIONES */}
        <View
          style={estilo('admin-filtros', {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 10,
          })}
        >
          {COLECCIONES.map((nombre) => {
            const seleccionado =
              coleccion === nombre;

            return (
              <Pressable
                key={nombre}
                onPress={() =>
                  cambiarColeccion(nombre)
                }
                style={estilo(
                  seleccionado
                    ? 'admin-filtro seleccionado'
                    : 'admin-filtro',
                  [
                    n.chip,
                    seleccionado && n.chipActivo,
                    {
                      marginRight: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]
                )}
              >
                <Text
                  style={estilo(
                    seleccionado
                      ? 'admin-filtro-texto seleccionado'
                      : 'admin-filtro-texto',
                    [
                      n.chipTexto,
                      seleccionado && n.chipTextoActivo,
                    ]
                  )}
                >
                  {etiquetaColeccion(nombre)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* CONTENIDO */}
        <View
          style={estilo('admin-contenido', {
            width: '100%',
            maxWidth: 900,
            alignSelf: 'center',
            paddingHorizontal: 16,
            paddingBottom: 100,
          })}
        >
          {!!error && (
            <Text
              style={estilo('ui-error', n.error)}
            >
              {error}
            </Text>
          )}

          {!!exito && (
            <Text
              style={estilo('ui-exito', n.exito)}
            >
              {exito}
            </Text>
          )}

          {/* ABRIR / CERRAR FORMULARIO */}
          <Boton
            texto={
              abierto
                ? 'Cerrar formulario'
                : `Crear en ${etiquetaColeccion(
                    coleccion
                  )}`
            }
            secundario={abierto}
            alPulsar={() => {
              const abrir = !abierto;

              setAbierto(abrir);
              setError('');
              setExito('');

              if (abrir) {
                setValores({});
              }
            }}
          />

          {/* FORMULARIO */}
          {abierto && (
            <View
              style={estilo(
                'admin-formulario',
                n.tarjeta
              )}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 15,
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={27}
                  color={ROJO}
                />

                <Text
                  style={[
                    n.nombreAuto,
                    { flex: 1 },
                  ]}
                >
                  Nuevo registro
                </Text>
              </View>

              <Text
                style={[
                  n.subtitulo,
                  { marginBottom: 19 },
                ]}
              >
                Completa los campos para registrar
                {coleccion === 'autos'
                  ? ' un vehículo.'
                  : ' la información.'}
              </Text>

              {campos.map(renderizarCampo)}

              {(coleccion === 'autos' ||
                coleccion === 'categorias') && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 9,
                    backgroundColor: '#F8F0F2',
                    borderRadius: 12,
                    padding: 12,
                    marginVertical: 14,
                  }}
                >
                  <Ionicons
                    name="image-outline"
                    size={22}
                    color={ROJO}
                  />

                  <Text
                    style={[
                      n.subtitulo,
                      {
                        flex: 1,
                        marginTop: 0,
                      },
                    ]}
                  >
                    Por ahora, la fotografía única
                    se adjunta desde el panel de Strapi.
                  </Text>
                </View>
              )}

              <Boton
                texto="Guardar registro"
                cargando={guardando}
                alPulsar={() => void guardar()}
              />
            </View>
          )}

          {/* LISTADO */}
          <Text
            style={estilo(
              'admin-listado-titulo',
              [
                n.nombreAuto,
                {
                  fontSize: 21,
                  marginTop: 25,
                  marginBottom: 15,
                },
              ]
            )}
          >
            Registros de {etiquetaColeccion(coleccion)}
          </Text>

          {esperando ? (
            <ActivityIndicator
              color={ROJO}
              size="large"
              style={{ marginVertical: 28 }}
            />
          ) : registros.length === 0 ? (
            <View
              style={estilo(
                'admin-registro',
                n.tarjeta
              )}
            >
              <Ionicons
                name="folder-open-outline"
                size={32}
                color="#C88490"
              />

              <Text style={n.vacio}>
                No hay registros para mostrar.
              </Text>
            </View>
          ) : (
            registros.map((registro) => {
              const identificador =
                coleccion === 'usuarios'
                  ? registro.id
                  : registro.documentId;

              if (!identificador) return null;

              const id = String(identificador);

              return (
                <View
                  key={id}
                  style={estilo(
                    'admin-registro',
                    n.tarjeta
                  )}
                >
                  <Text
                    style={estilo(
                      'admin-registro-nombre',
                      n.nombreAuto
                    )}
                  >
                    {nombreRegistro(
                      registro,
                      coleccion
                    )}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={n.subtitulo}
                  >
                    {registro.correo ||
                      registro.email ||
                      id}
                  </Text>

                  <View style={{ marginTop: 13 }}>
                    {confirmacion === id ? (
                      <>
                        <Text
                          style={estilo(
                            'ui-error',
                            n.error
                          )}
                        >
                          ¿Eliminar definitivamente
                          este registro?
                        </Text>

                        <Boton
                          texto="Sí, eliminar"
                          peligro
                          alPulsar={() =>
                            void borrar(registro)
                          }
                        />

                        <Boton
                          texto="Conservar"
                          secundario
                          alPulsar={() =>
                            setConfirmacion(null)
                          }
                        />
                      </>
                    ) : (
                      <Boton
                        texto="Eliminar"
                        secundario
                        alPulsar={() =>
                          setConfirmacion(id)
                        }
                      />
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
