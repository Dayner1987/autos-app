
 // frontend-autos/src/app/(tabs)/categorias.tsx

import React, {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

import { Boton } from '../../componentes/Boton';
import { listar } from '../../servicios/colecciones';
import { mensajeError } from '../../servicios/peticion';

import { imagenUrl } from '../../configuracion/api';
import { estilo } from '../../configuracion/estilos';
import { n } from '../../estilos/nativos';

import type { Categoria } from '../../tipos/modelos';

const ROJO = '#C21D30';

export default function PantallaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [esperando, setEsperando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const [error, setError] = useState('');

  const numeroPeticion = useRef(0);

  const cargar = useCallback(
    async (esActualizacion = false) => {
      const numero = ++numeroPeticion.current;

      if (esActualizacion) {
        setActualizando(true);
      } else {
        setEsperando(true);
      }

      setError('');

      try {
        const resultado = await listar<Categoria>(
          'categorias'
        );

        if (numero !== numeroPeticion.current) return;

        setCategorias(resultado);
      } catch (e) {
        if (numero !== numeroPeticion.current) return;

        setError(mensajeError(e));
      } finally {
        if (numero === numeroPeticion.current) {
          setEsperando(false);
          setActualizando(false);
        }
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      setCategorias([]);
      void cargar();

      return () => {
        numeroPeticion.current += 1;
      };
    }, [cargar])
  );

  function abrirCategoria(categoria: Categoria) {
    router.push({
      pathname: '/',
      params: {
        categoria: categoria.documentId,
      },
    });
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        estilo('ui-pantalla', n.pantalla),
        {
          flex: 1,
          minHeight: 0,
        },
      ]}
    >
      <FlatList
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
        }}
        data={categorias}
        keyExtractor={(item) => item.documentId}
        keyboardShouldPersistTaps="handled"
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
              style={estilo('categorias-cabecera', [
                n.encabezado,
                n.banner,
              ])}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 11,
                }}
              >
                <Ionicons
                  name="grid"
                  size={27}
                  color="#FFFFFF"
                />

                <Text
                  style={[
                    n.titulo,
                    n.tituloBanner,
                    { flex: 1 },
                  ]}
                >
                  Categorías
                </Text>
              </View>

              <Text
                style={[
                  n.subtitulo,
                  n.subtituloBanner,
                ]}
              >
                Selecciona una categoría para descubrir sus autos.
              </Text>
            </View>

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
                  texto="Reintentar"
                  secundario
                  alPulsar={() => void cargar()}
                />
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          esperando ? (
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
                Cargando categorías...
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
                name="grid-outline"
                size={48}
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
                Sin categorías
              </Text>

              <Text
                style={[
                  n.subtitulo,
                  { textAlign: 'center' },
                ]}
              >
                Todavía no se registraron categorías
                en la tienda.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const foto = imagenUrl(
            item.imagen?.formats?.medium?.url ??
            item.imagen?.url
          );

          return (
            <View
              style={{
                width: '100%',
                maxWidth: 960,
                alignSelf: 'center',
                paddingHorizontal: 16,
              }}
            >
              <Pressable
                onPress={() => abrirCategoria(item)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  estilo('categoria-tarjeta', n.tarjeta),
                  {
                    overflow: 'hidden',
                    padding: 0,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                {foto ? (
                  <Image
                    source={{ uri: foto }}
                    resizeMode="cover"
                    style={estilo('categoria-foto', {
                      width: '100%',
                      height: 180,
                    })}
                  />
                ) : (
                  <View
                    style={estilo(
                      'categoria-sin-foto',
                      [
                        n.sinFoto,
                        {
                          height: 180,
                          borderRadius: 0,
                        },
                      ]
                    )}
                  >
                    <Ionicons
                      name="car-sport-outline"
                      size={46}
                      color="#C68491"
                    />
                  </View>
                )}

                <View style={{ padding: 19 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <Text
                      style={[
                        estilo(
                          'categoria-nombre',
                          n.nombreAuto
                        ),
                        { flex: 1 },
                      ]}
                    >
                      {item.nombre}
                    </Text>

                    <View
                      style={{
                        width: 39,
                        height: 39,
                        borderRadius: 12,
                        backgroundColor: '#FCE8EC',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={ROJO}
                      />
                    </View>
                  </View>

                  {!!item.descripcion && (
                    <Text
                      style={[
                        estilo(
                          'categoria-descripcion',
                          n.detalleAuto
                        ),
                        { marginTop: 6 },
                      ]}
                    >
                      {item.descripcion}
                    </Text>
                  )}

                  <Text
                    style={{
                      color: ROJO,
                      fontSize: 13,
                      fontWeight: '700',
                      marginTop: 12,
                    }}
                  >
                    Explorar vehículos
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
