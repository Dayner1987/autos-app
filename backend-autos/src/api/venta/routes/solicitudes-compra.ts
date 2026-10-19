// backend-autos/src/api/venta/routes/solicitudes-compra.ts
// Los 3 métodos requieren JWT; en Users & Permissions activar solo al rol Authenticated.
export default {
  routes: [
    { method: 'GET', path: '/solicitudes-compra', handler: 'venta.mias', config: { policies: [] } },
    { method: 'POST', path: '/solicitudes-compra', handler: 'venta.solicitar', config: { policies: [] } },
    { method: 'DELETE', path: '/solicitudes-compra/:documentId', handler: 'venta.cancelar', config: { policies: [] } },
  ],
};
