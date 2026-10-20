// WebMCP: expone a los agentes de IA del navegador las dos acciones clave
// de la web. Si el navegador no soporta WebMCP, no hace nada.
(function () {
  var mc = document.modelContext || navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;

  function text(t) { return { content: [{ type: 'text', text: t }] }; }

  function register(tool) {
    try {
      var p = mc.registerTool(tool);
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) {}
  }

  register({
    name: 'info_webboost',
    description: 'Devuelve en Markdown quién es Sergio (WebBoost), sus servicios de SEO local en Logroño y La Rioja, el caso de estudio y las guías del blog.',
    inputSchema: { type: 'object', properties: {} },
    execute: function () {
      return fetch('/llms.txt').then(function (r) { return r.text(); }).then(text);
    }
  });

  register({
    name: 'solicitar_diagnostico_seo',
    description: 'Envía a Sergio una solicitud de diagnóstico SEO local gratuito para un negocio de Logroño o La Rioja. Responde en menos de 24 horas.',
    inputSchema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', description: 'Nombre de la persona de contacto' },
        email: { type: 'string', format: 'email', description: 'Correo electrónico de contacto' },
        telefono: { type: 'string', description: 'Teléfono (opcional)' },
        web: { type: 'string', description: 'Web del negocio (opcional)' },
        ficha_google_maps: { type: 'string', description: 'Enlace a la ficha de Google Maps del negocio (opcional)' }
      },
      required: ['nombre', 'email']
    },
    execute: function (input) {
      return fetch('https://formspree.io/f/meevolga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'Nueva solicitud de diagnóstico SEO — WebBoost (vía agente)',
          Nombre: input.nombre,
          Correo: input.email,
          Telefono: input.telefono || '',
          Web_del_negocio: input.web || '',
          Ficha_Google_Maps: input.ficha_google_maps || ''
        })
      }).then(function (r) {
        return text(r.ok
          ? 'Solicitud enviada. Sergio responderá en menos de 24 horas.'
          : 'No se pudo enviar la solicitud. Usa el formulario de https://www.webboost.es/contacto');
      });
    }
  });
})();
