// backend-autos/src/api/venta/controllers/venta.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::venta.venta', ({ strapi }) => ({
  /** POST /api/solicitudes-compra — toma usuario y precio del servidor, nunca del cliente. */
  async solicitar(ctx: any) {
    const usuario = ctx.state.user;
    if (!usuario) return ctx.unauthorized('Debes iniciar sesión.');
    const datos = ctx.request.body || {};
    const id = String(datos.autoDocumentId || '').trim();
    const nombre = String(datos.nombreCompleto || '').trim();
    const celular = String(datos.celular || '').trim();
    const observaciones = String(datos.observaciones || '').trim();
    if (!id || nombre.length < 3 || celular.length < 6 || observaciones.length > 1500) {
      return ctx.badRequest('Completa el auto, nombre y celular. El mensaje puede tener hasta 1500 caracteres.');
    }
    const auto = await strapi.documents('api::auto.auto').findOne({ documentId: id });
    if (!auto) return ctx.notFound('El auto no existe.');
    if (auto.estado !== 'DISPONIBLE') return ctx.conflict('Este auto ya no está disponible.');

    const email = String(usuario.email || '').toLowerCase();
    let cliente = await strapi.documents('api::cliente.cliente').findFirst({ filters: { correo: { $eq: email } } });
    if (!cliente) {
      cliente = await strapi.documents('api::cliente.cliente').create({
        data: { nombre_completo: nombre, celular, correo: email },
      });
    }
    const registro = await strapi.documents('api::venta.venta').create({
      data: {
        fecha_venta: new Date().toISOString().slice(0, 10),
        precio_final: auto.precio,
        metodo_pago: 'OTRO',
        estado_solicitud: 'PENDIENTE',
        usuario_id: Number(usuario.id),
        observaciones,
        cliente: cliente.documentId,
        auto: auto.documentId,
      } as any,
    });
    ctx.status = 201;
    ctx.body = { data: { documentId: registro.documentId, estado_solicitud: 'PENDIENTE' } };
  },

  /** GET /api/solicitudes-compra — solo solicitudes de quien inició sesión. */
  async mias(ctx: any) {
    const usuario = ctx.state.user;
    if (!usuario) return ctx.unauthorized('Debes iniciar sesión.');
    const registros = await strapi.documents('api::venta.venta').findMany({
      filters: { usuario_id: { $eq: Number(usuario.id) } },
      populate: { auto: true },
      sort: ['createdAt:desc'],
    });
    // No publicar los detalles personales del cliente, ni el usuario_id privado.
    ctx.body = { data: registros.map((r: any) => ({
      documentId: r.documentId,
      fecha_venta: r.fecha_venta,
      precio_final: r.precio_final,
      metodo_pago: r.metodo_pago,
      estado_solicitud: r.estado_solicitud,
      auto: r.auto ? { titulo: r.auto.titulo, moneda: r.auto.moneda } : null,
    })) };
  },

  /** DELETE /api/solicitudes-compra/:documentId — solo solicitudes propias pendientes. */
  async cancelar(ctx: any) {
    const usuario = ctx.state.user;
    if (!usuario) return ctx.unauthorized('Debes iniciar sesión.');
    const id = String(ctx.params.documentId || '');
    const solicitud = await strapi.documents('api::venta.venta').findOne({ documentId: id });
    if (!solicitud) return ctx.notFound('Solicitud no encontrada.');
    if (Number(solicitud.usuario_id) !== Number(usuario.id)) return ctx.forbidden('No puedes borrar una solicitud ajena.');
    if (solicitud.estado_solicitud !== 'PENDIENTE') return ctx.badRequest('Solo se pueden cancelar solicitudes pendientes.');
    await strapi.documents('api::venta.venta').delete({ documentId: id });
    ctx.body = { mensaje: 'Solicitud cancelada.' };
  },
}));
