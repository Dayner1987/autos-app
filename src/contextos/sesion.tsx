// frontend-autos/src/contextos/sesion.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Sesion } from '../tipos/modelos';
import { guardarToken, recuperarToken } from '../servicios/sesion-almacenamiento';
import { perfil } from '../servicios/autenticacion';
import { ErrorApi } from '../servicios/peticion';

type ContextoSesion = {
  sesion: Sesion | null; cargando: boolean;
  entrar: (sesion: Sesion) => Promise<void>; salir: () => Promise<void>;
};
const Contexto = createContext<ContextoSesion | null>(null);
export function ProveedorSesion({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const jwt = await recuperarToken();
        if (!jwt) return;
        const usuario = await perfil(jwt);
        if (activo) setSesion({ jwt, usuario });
      } catch (error) {
        if (error instanceof ErrorApi && [401, 403].includes(error.codigo)) await guardarToken(null);
      } finally { if (activo) setCargando(false); }
    })();
    return () => { activo = false; };
  }, []);
  const entrar = useCallback(async (datos: Sesion) => { await guardarToken(datos.jwt); setSesion(datos); }, []);
  const salir = useCallback(async () => { await guardarToken(null); setSesion(null); }, []);
  const valor = useMemo(() => ({ sesion, cargando, entrar, salir }), [sesion, cargando, entrar, salir]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
export function usarSesion(): ContextoSesion {
  const c = useContext(Contexto);
  if (!c) throw new Error('Falta ProveedorSesion');
  return c;
}
