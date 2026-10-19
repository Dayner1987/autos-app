// frontend-autos/src/servicios/colecciones.ts
import type { Auto, Categoria, Cliente, Coleccion, Lista, Marca, Usuario, Venta } from '../tipos/modelos';
import { peticion } from './peticion';

const RUTAS: Record<Coleccion, string> = {
  autos: '/autos', categorias: '/categorias', marcas: '/marcas',
  clientes: '/clientes', ventas: '/ventas', usuarios: '/users',
};
export async function listar<T>(coleccion: Coleccion, token?: string): Promise<T[]> {
  const parametros = coleccion === 'usuarios' ? '' : '?populate=*&pagination[pageSize]=100';
  const resultado = await peticion<Lista<T> | T[]>(`${RUTAS[coleccion]}${parametros}`, { token });
  return Array.isArray(resultado) ? resultado : resultado.data;
}
export async function buscarAuto(id: string): Promise<Auto> {
  const r = await peticion<{ data: Auto }>(`/autos/${encodeURIComponent(id)}?populate=*`);
  return r.data;
}
export async function autosCategoria(id: string): Promise<Auto[]> {
  const p = new URLSearchParams();
  p.set('filters[categoria][documentId][$eq]', id);
  p.set('populate', '*');
  p.set('pagination[pageSize]', '100');
  const r = await peticion<Lista<Auto>>(`/autos?${p.toString()}`);
  return r.data;
}
export async function crear(coleccion: Coleccion, data: Record<string, unknown>, token: string): Promise<void> {
  await peticion(RUTAS[coleccion], { metodo: 'POST', token, datos: coleccion === 'usuarios' ? data : { data } });
}
export async function eliminar(coleccion: Coleccion, id: string | number, token: string): Promise<void> {
  await peticion(`${RUTAS[coleccion]}/${encodeURIComponent(String(id))}`, { metodo: 'DELETE', token });
}
export type Recursos = { autos: Auto[]; categorias: Categoria[]; marcas: Marca[]; clientes: Cliente[]; ventas: Venta[]; usuarios: Usuario[] };
