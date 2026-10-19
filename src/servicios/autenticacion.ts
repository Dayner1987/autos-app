// frontend-autos/src/servicios/autenticacion.ts
import { peticion } from './peticion';
import type { Sesion, Usuario } from '../tipos/modelos';

type Respuesta = { jwt: string; user: Usuario };
export async function identificar(correo: string, contrasena: string): Promise<Sesion> {
  const r = await peticion<Respuesta>('/auth/local', { metodo: 'POST', datos: { identifier: correo, password: contrasena } });
  const usuario = await perfil(r.jwt);
  return { jwt: r.jwt, usuario };
}
export async function registrar(username: string, email: string, password: string): Promise<Sesion> {
  const r = await peticion<Respuesta>('/auth/local/register', { metodo: 'POST', datos: { username, email, password } });
  const usuario = await perfil(r.jwt);
  return { jwt: r.jwt, usuario };
}
export async function perfil(jwt: string): Promise<Usuario> {
  return peticion<Usuario>('/users/me?populate=role', { token: jwt });
}
export function esAdministrador(usuario: Usuario | null): boolean {
  const rol = (usuario?.role?.name ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return rol === 'administrador' || rol === 'adminstrador';
}
