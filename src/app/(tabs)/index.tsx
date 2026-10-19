
 // frontend-autos/src/app/(tabs)/index.tsx

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

import { Boton } from '../../componentes/Boton';
import { TarjetaAuto } from '../../componentes/TarjetaAuto';

import {
  listar,
  autosCategoria,
} from '../../servicios/colecciones';

import { mensajeError } from '../../servicios/peticion';

import type { Auto } from '../../tipos/modelos';

import { estilo } from '../../configuracion/estilos';
import { n } from '../../estilos/nativos';

const ROJO = '#C21D30';

export default function PantallaCatalogo() {
  const { categoria } = useLocalSearchParams<{
    categoria?: string;
  }>();

  const categoriaId = Array.isArray(categoria)
    ? categoria[0]
    : categoria;

  const [autos, setAutos] = useState<Auto[]>([]);
  const [busqueda, setBusqueda] = useState('');

  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const [error, setError] = useState('');

  // Permite ignorar resultados de consultas anteriores.
  const numeroPeticion = useRef(0);

  const cargar = useCallback(
    async (esActualizacion = false) => {
      const numero = ++numeroPeticion.current;

      if (esActualizacion) {
        setActualizando(true);
      } else {
        setCargando(true);
      }

      setError('');

      try {
        const resultado = categoriaId
          ? await autosCategoria(categoriaId)
          : await listar<Auto>('autos');

        if (numero !== numeroPeticion.current) return;

        setAutos(resultado);
      } catch (e) {
        if (numero !== numeroPeticion.current) return;

        setError(mensajeError(e));
      } finally {
        if (numero === numeroPeticion.current) {
          setCargando(false);
          setActualizando(false);
        }
      }
    },
    [categoriaId]
  );

  // Recargar cuando la pantalla recibe el foco.
  useFocusEffect(
    useCallback(() => {
      setAutos([]);
      void cargar();

      return () => {
        numeroPeticion.current += 1;
      };
    }, [cargar])
  );

  // Filtrado local sin llamadas adicionales a Strapi.
  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase();

    if (!texto) return autos;

    return autos.filter((auto) => {
      const contenido = [
        auto.titulo,
        auto.modelo,
        auto.marca?.nombre ?? '',
        auto.anio,
      ]
        .join(' ')
        .toLocaleLowerCase();

      return contenido.includes(texto);
    });
  }, [autos, busqueda]);

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
        data={resultados}
        keyExtractor={(item) => item.documentId}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled
        scrollEnabled
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 95,
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
              style={estilo('catalogo-cabecera', [
                n.encabezado,
                n.banner,
              ])}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Ionicons
                  name="car-sport"
                  size={29}
                  color="#FFFFFF"
                />

                <Text
                  style={[
                    n.titulo,
                    n.tituloBanner,
                    { flex: 1, fontSize: 26 },
                  ]}
                >
                  Encuentra tu próximo auto
                </Text>
              </View>

              <Text
                style={estilo(
                  'catalogo-subtitulo',
                  [
                    n.subtitulo,
                    n.subtituloBanner,
                  ]
                )}
              >
                Explora nuestros vehículos disponibles.
              </Text>

              <View
                style={{
                  marginTop: 17,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  paddingHorizontal: 13,
                  minHeight: 53,
                  gap: 10,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={22}
                  color="#A45B68"
                />

                <TextInput
                  placeholder="Buscar por marca o modelo..."
                  placeholderTextColor="#8490A0"
                  value={busqueda}
                  onChangeText={setBusqueda}
                  returnKeyType="search"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: 52,
                    fontSize: 14,
                    color: '#242938',
                    outlineStyle: 'none',
                  } as any}
                />
              </View>
            </View>

            {categoriaId && (
              <View
                style={{
                  marginHorizontal: 16,
                  marginBottom: 13,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 14,
                }}
              >
                <Text style={n.nombreAuto}>
                  Autos de la categoría seleccionada
                </Text>

                <Text style={n.subtitulo}>
                  Mostrando únicamente vehículos de esta categoría.
                </Text>

                <Boton
                  texto="Ver todos los autos"
                  secundario
                  alPulsar={() =>
                    router.replace('/(tabs)')
                  }
                />
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
          cargando ? (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 60,
                gap: 12,
              }}
            >
              <ActivityIndicator
                size="large"
                color={ROJO}
              />

              <Text style={n.subtitulo}>
                Cargando vehículos...
              </Text>
            </View>
          ) : error ? null : (
            <View
              style={{
                alignItems: 'center',
                padding: 35,
              }}
            >
              <Ionicons
                name="car-sport-outline"
                size={50}
                color="#CBA5AC"
              />

              <Text
                style={[
                  n.nombreAuto,
                  {
                    marginTop: 15,
                    textAlign: 'center',
                  },
                ]}
              >
                No encontramos vehículos
              </Text>

              <Text
                style={[
                  n.subtitulo,
                  { textAlign: 'center' },
                ]}
              >
                {busqueda
                  ? 'Prueba con otro nombre o modelo.'
                  : 'Todavía no hay autos para mostrar.'}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View
            style={{
              width: '100%',
              maxWidth: 960,
              alignSelf: 'center',
              paddingHorizontal: 16,
            }}
          >
            <TarjetaAuto auto={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
