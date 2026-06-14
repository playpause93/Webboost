export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.webboost.es');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    // Añadir contacto a lista Brevo
    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [2],
        updateEnabled: true,
        attributes: { SOURCE: 'blog-newsletter' }
      }),
    });

    const contactData = await contactRes.json();

    // Ya suscrito — OK igualmente
    if (contactRes.status === 400 && contactData.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true, message: 'Ya estás suscrito' });
    }

    if (contactRes.status !== 201 && contactRes.status !== 204) {
      return res.status(500).json({ error: 'Error al añadir contacto', brevo_status: contactRes.status, brevo_detail: contactData });
    }

    // Email de bienvenida (fallo no bloquea la suscripción)
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Sergio · WebBoost', email: 'info@webboost.es' },
        to: [{ email }],
        subject: '¡Bienvenido a la newsletter de WebBoost!',
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
            <div style="background:#0d2626;padding:36px 32px;text-align:center;background-image:radial-gradient(rgba(255,255,255,0.1) 1px,transparent 1px);background-size:20px 20px;">
              <div style="font-size:1.9rem;font-weight:900;color:#fff;letter-spacing:-0.02em;">Web<span style="color:#c9a035;">Boost</span></div>
              <p style="color:rgba(255,255,255,0.5);margin-top:6px;font-size:0.85rem;">Consultor SEO Local · Logroño</p>
            </div>
            <div style="padding:44px 36px;">
              <h2 style="color:#0d2626;font-size:1.4rem;margin-bottom:16px;">Bienvenido 👋</h2>
              <p style="line-height:1.8;color:#555;margin-bottom:16px;">
                Gracias por suscribirte. Recibirás estrategias reales de SEO local y Google Maps para tu negocio — sin relleno, sin spam, solo lo que funciona.
              </p>
              <p style="line-height:1.8;color:#555;margin-bottom:32px;">
                Para empezar, te dejo el artículo más leído del blog:
              </p>
              <div style="text-align:center;margin-bottom:36px;">
                <a href="https://www.webboost.es/blog/como-aparecer-en-google-maps"
                   style="background:#0d2626;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:0.95rem;display:inline-block;">
                  Cómo aparecer en Google Maps →
                </a>
              </div>
              <div style="background:#f9f7f2;border-left:4px solid #c9a035;border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:32px;">
                <p style="margin:0;font-size:0.9rem;color:#555;line-height:1.7;">
                  Si tienes alguna pregunta sobre la visibilidad de tu negocio en Google, responde directamente a este email — leo todos los mensajes personalmente.
                </p>
              </div>
              <p style="color:#555;line-height:1.7;">Un saludo,<br>
                <strong style="color:#0d2626;">Sergio</strong><br>
                <span style="color:#888;font-size:0.85rem;">Consultor SEO · WebBoost · Logroño</span>
              </p>
            </div>
            <div style="background:#f5f5f3;padding:20px 32px;text-align:center;font-size:0.75rem;color:#999;border-top:1px solid #eee;">
              <p style="margin:0 0 4px;">WebBoost · Logroño, La Rioja, España</p>
              <p style="margin:0;">Recibiste este email porque te suscribiste en webboost.es</p>
            </div>
          </div>
        `
      }),
      });
    } catch (_) {}

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: 'Error interno' });
  }
}
