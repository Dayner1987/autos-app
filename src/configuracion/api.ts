// frontend-autos/src/configuracion/api.ts
// No utilizamos .env. Cambia SOLO esta IP por la IPv4 de la computadora
// donde esta ejecutandose Strapi (CMD: ipconfig).
// Ejemplo: 192.168.1.35
const IP_SERVIDOR = '192.168.100.130';
const PUERTO_STRAPI = 1337;

export const URL_API = `http://${IP_SERVIDOR}:${PUERTO_STRAPI}`;

export function imagenUrl(ruta?: string | null): string | undefined {
  if (!ruta) return undefined;
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return `${URL_API}${ruta.startsWith('/') ? '' : '/'}${ruta}`;
}
