// frontend-autos/src/tipos/modelos.ts
export type Multimedia = { id: number; url: string; formats?: { medium?: { url: string }; small?: { url: string } } };
export type Marca = { id: number; documentId: string; nombre: string; pais_origen?: string };
export type Categoria = { id: number; documentId: string; nombre: string; descripcion?: string; imagen?: Multimedia | null };
export type Auto = {
  id: number; documentId: string; titulo: string; descripcion?: string; modelo: string; anio: number;
  kilometraje?: number; color?: string; transmision: 'MANUAL' | 'AUTOMATICA';
  combustible: string; precio: number | string; moneda: 'BOB' | 'USD';
  estado: 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO'; ubicacion?: string;
  imagen?: Multimedia | null; marca?: Marca | null; categoria?: Categoria | null;
};
export type Cliente = { id: number; documentId: string; nombre_completo: string; celular: string; correo?: string };
export type Venta = {
  id: number; documentId: string; fecha_venta: string; precio_final: string | number;
  metodo_pago: string; estado_solicitud: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
  observaciones?: string; cliente?: Cliente | null; auto?: Auto | null;
};
export type Usuario = { id: number; username: string; email: string; role?: { id: number; name: string; type: string } | null };
export type Sesion = { jwt: string; usuario: Usuario };
export type Coleccion = 'autos' | 'categorias' | 'marcas' | 'clientes' | 'ventas' | 'usuarios';
export type Lista<T> = { data: T[]; meta?: unknown };
