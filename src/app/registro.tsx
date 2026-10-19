// frontend-autos/src/app/registro.tsx
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Boton } from '../componentes/Boton';
import { Campo } from '../componentes/Campo';
import { registrar } from '../servicios/autenticacion';
import { mensajeError } from '../servicios/peticion';
import { usarSesion } from '../contextos/sesion';
import { estilo } from '../configuracion/estilos';
import { n } from '../estilos/nativos';
export default function Registro() {
  const { entrar } = usarSesion();
  const [usuario, setUsuario] = useState(''); const [correo, setCorreo] = useState(''); const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(''); const [cargando, setCargando] = useState(false);
  async function enviar() {
    if (usuario.trim().length < 3 || !correo.includes('@') || contrasena.length < 8) {
      setError('Nombre mínimo 3 caracteres, correo válido y contraseña mínimo 8 caracteres.'); return;
    }
    setError(''); setCargando(true);
    try { await entrar(await registrar(usuario.trim(), correo.trim().toLowerCase(), contrasena)); router.replace('/(tabs)/cuenta'); }
    catch (e) { setError(mensajeError(e)); } finally { setCargando(false); }
  }
  return <SafeAreaView edges={['top', 'bottom']} style={estilo('ui-pantalla', n.pantalla)}>
    <ScrollView contentContainerStyle={estilo('cuenta-formulario', { padding: 22, flexGrow: 1, justifyContent: 'center' })}>
      <Text style={estilo('ui-titulo', n.titulo)}>Crear cuenta</Text>
      <Text style={estilo('ui-subtitulo', n.subtitulo)}>Regístrate para solicitar la compra de un auto.</Text>
      <View style={estilo('cuenta-panel', n.tarjeta)}>
        <Campo etiqueta="Nombre de usuario" valor={usuario} cambiar={setUsuario} />
        <Campo etiqueta="Correo" tipo="email-address" valor={correo} cambiar={setCorreo} />
        <Campo etiqueta="Contraseña (mínimo 8 caracteres)" secreto valor={contrasena} cambiar={setContrasena} />
        {!!error && <Text style={estilo('ui-error', n.error)}>{error}</Text>}
        <Boton texto="Registrarme" cargando={cargando} alPulsar={() => void enviar()} />
        <Boton texto="Ya tengo cuenta" secundario alPulsar={() => router.replace('/iniciar-sesion')} />
      </View>
    </ScrollView>
  </SafeAreaView>;
}
