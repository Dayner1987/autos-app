
 // frontend-autos/src/estilos/nativos.ts

import { StyleSheet } from 'react-native';

export const n = StyleSheet.create({
  // GENERALES

  pantalla: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },

  contenedor: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 22,
  },

  encabezado: {
    paddingHorizontal: 20,
    paddingVertical: 22,
    marginBottom: 16,
  },

  banner: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 22,
    backgroundColor: '#A81729',
    padding: 23,
  },

  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1D2433',
    letterSpacing: -0.6,
  },

  tituloBanner: {
    color: '#FFFFFF',
  },

  subtitulo: {
    fontSize: 14,
    lineHeight: 21,
    color: '#758093',
    marginTop: 7,
  },

  subtituloBanner: {
    color: '#FFE7EB',
  },

  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0E7E9',
    shadowColor: '#2F1820',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  separador: {
    height: 14,
  },

  campo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2DDE0',
    borderWidth: 1,
    borderRadius: 13,
    paddingVertical: 14,
    paddingHorizontal: 15,
    color: '#202533',
    marginTop: 8,
    marginBottom: 14,
    fontSize: 15,
  },

  etiqueta: {
    fontSize: 14,
    fontWeight: '700',
    color: '#353A48',
    marginTop: 7,
  },

  boton: {
    backgroundColor: '#C21D30',
    borderRadius: 13,
    minHeight: 52,
    paddingHorizontal: 17,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },

  botonSecundario: {
    borderColor: '#E3B9C0',
    borderWidth: 1,
    backgroundColor: '#FFF7F8',
  },

  textoSecundario: {
    color: '#B91C2C',
  },

  botonPeligro: {
    backgroundColor: '#A41527',
  },

  error: {
    padding: 14,
    backgroundColor: '#FEECEF',
    color: '#B42335',
    borderRadius: 12,
    marginVertical: 10,
    overflow: 'hidden',
  },

  exito: {
    padding: 14,
    backgroundColor: '#E8F7EE',
    color: '#187849',
    borderRadius: 12,
    marginVertical: 10,
  },

  vacio: {
    color: '#8992A0',
    textAlign: 'center',
    paddingVertical: 35,
    fontSize: 14,
  },

  fotografia: {
    width: '100%',
    height: 210,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  sinFoto: {
    height: 210,
    backgroundColor: '#F6E8EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  nombreAuto: {
    color: '#202535',
    fontWeight: '800',
    fontSize: 18,
  },

  detalleAuto: {
    color: '#7C8594',
    fontSize: 13,
    marginVertical: 8,
    lineHeight: 19,
  },

  precio: {
    color: '#C21D30',
    fontWeight: '900',
    fontSize: 23,
  },

  enlace: {
    color: '#B91C2C',
    fontWeight: '800',
  },

  chips: {
    flexDirection: 'row',
    gap: 9,
    paddingVertical: 10,
  },

  chip: {
    borderRadius: 12,
    backgroundColor: '#F8EDEF',
    paddingHorizontal: 17,
    paddingVertical: 11,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#F1DCE1',
  },

  chipActivo: {
    backgroundColor: '#C21D30',
    borderColor: '#C21D30',
  },

  chipTexto: {
    color: '#8F3946',
    fontWeight: '700',
  },

  chipTextoActivo: {
    color: '#FFFFFF',
  },

  // MI CUENTA

  perfilCabecera: {
    backgroundColor: '#FFF1F3',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },

  avatar: {
    width: 61,
    height: 61,
    borderRadius: 19,
    backgroundColor: '#C21D30',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarTexto: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  perfilSubtitulo: {
    fontSize: 12,
    color: '#9A5360',
    marginTop: 5,
  },

  infoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1ECEE',
  },

  infoEtiqueta: {
    fontSize: 12,
    color: '#8A8991',
    marginBottom: 4,
  },

  infoValor: {
    fontSize: 15,
    color: '#272B37',
    fontWeight: '700',
  },

  perfilAcciones: {
    marginTop: 20,
    gap: 6,
  },

  invitadoIcono: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor: '#FFF1F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },

  invitadoTitulo: {
    color: '#222735',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  // TARJETAS DE AUTOS

  estadoAutoEtiqueta: {
    backgroundColor: '#EAF8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 9,
  },

  estadoAutoVendido: {
    backgroundColor: '#FCE7EC',
  },

  estadoAutoTexto: {
    color: '#187B4D',
    fontSize: 11,
    fontWeight: '800',
  },

  estadoAutoVendidoTexto: {
    color: '#AF1C30',
  },

  autoPie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },

  autoVerIcono: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#FCE8EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // DETALLE DEL VEHÍCULO

  detalleScroll: {
    flex: 1,
    minHeight: 0,
    width: '100%',
  },

  detalleContenido: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 85,
  },

  detalleVolver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    alignSelf: 'flex-start',
    marginBottom: 17,
  },

  detalleVolverIcono: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE8EC',
  },

  detalleCargando: {
    paddingVertical: 65,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },

  detalleImagenContenedor: {
    width: '100%',
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#F8E9ED',
  },

  detalleFoto: {
    width: '100%',
    height: 250,
    borderRadius: 19,
  },

  detalleSinFoto: {
    width: '100%',
    height: 250,
    backgroundColor: '#F8E9ED',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  detalleInformacion: {
    paddingHorizontal: 3,
    paddingTop: 19,
    paddingBottom: 16,
  },

  detalleEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    borderRadius: 9,
    backgroundColor: '#E8F8EF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 13,
  },

  detalleEstadoTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: '#187849',
  },

  detalleTitulo: {
    color: '#252938',
    fontSize: 29,
    fontWeight: '800',
    lineHeight: 35,
  },

  detalleMarca: {
    color: '#7B8493',
    fontSize: 15,
    marginTop: 9,
  },

  detallePrecioContenedor: {
    marginTop: 18,
  },

  detallePrecio: {
    fontSize: 30,
    fontWeight: '900',
    color: '#C21D30',
  },

  detalleCaracteristicas: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: '#F0E5E8',
    marginVertical: 12,
  },

  detalleSubtitulo: {
    color: '#252A38',
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 13,
  },

  detalleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  detalleDato: {
    flexDirection: 'row',
    alignItems: 'center',
    flexBasis: '46%',
    flexGrow: 1,
    gap: 9,
    backgroundColor: '#F7F8FA',
    borderRadius: 13,
    padding: 11,
    minWidth: 0,
  },

  detalleDatoIcono: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE9ED',
  },

  detalleDatoEtiqueta: {
    fontSize: 11,
    color: '#8A909D',
    marginBottom: 4,
  },

  detalleDatoValor: {
    fontSize: 13,
    fontWeight: '800',
    color: '#333945',
    flexShrink: 1,
  },

  detalleDescripcionContenedor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0E5E8',
    marginVertical: 10,
  },

  detalleDescripcion: {
    fontSize: 14,
    lineHeight: 23,
    color: '#4C5565',
  },

  detalleFormulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 19,
    borderWidth: 1,
    borderColor: '#F0E4E8',
    marginTop: 12,
    marginBottom: 24,
  },

  detalleFormularioCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    marginBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EAED',
  },

  detalleFormularioIcono: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: '#FCE8EC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  detalleAviso: {
    backgroundColor: '#FFF0F2',
    borderRadius: 13,
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  detalleExito: {
    backgroundColor: '#E8F7EE',
    borderRadius: 13,
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  detalleAyuda: {
    color: '#727D8F',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },

  detalleNota: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 13,
  },
});
