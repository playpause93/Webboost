(function () {
  var STORAGE_KEY = 'webboost_cookie_consent';
  if (localStorage.getItem(STORAGE_KEY)) return;

  var style = document.createElement('style');
  style.textContent = [
    '#cookie-banner,#cookie-banner *{box-sizing:border-box;}',
    '#cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;',
    'background:#0A2020;color:#fff;padding:18px 20px;',
    'box-shadow:0 -4px 24px rgba(0,0,0,0.25);',
    'font-family:"Open Sans",Arial,sans-serif;font-size:0.9rem;line-height:1.5;',
    'display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:16px;}',
    '#cookie-banner p{margin:0;max-width:640px;color:rgba(255,255,255,0.85);}',
    '#cookie-banner a{color:#fff;text-decoration:underline;}',
    '#cookie-banner .cookie-actions{display:flex;gap:10px;flex-shrink:0;}',
    '#cookie-banner button{cursor:pointer;border-radius:8px;padding:10px 18px;font-size:0.85rem;font-weight:600;border:1px solid rgba(255,255,255,0.25);font-family:inherit;}',
    '#cookie-accept{background:#fff;color:#0A2020;border-color:#fff;}',
    '#cookie-reject{background:transparent;color:#fff;}',
    '@media (max-width:600px){',
    '#cookie-banner{flex-direction:column;align-items:stretch;justify-content:center;padding:4px 12px;gap:4px;text-align:center;}',
    '#cookie-banner p{font-size:0.875rem;line-height:1.15;}',
    '#cookie-banner .cookie-actions{justify-content:center;gap:8px;}',
    '#cookie-banner button{flex:1;max-width:150px;min-height:44px;padding:0 8px;font-size:1rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;}',
    '}'
  ].join('');
  document.head.appendChild(style);

  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML =
    '<p>Usamos cookies propias y de terceros (Google Analytics) para analizar tráfico. <a href="/cookies">Política de cookies</a>.</p>' +
    '<div class="cookie-actions">' +
    '<button id="cookie-reject" type="button">Rechazar</button>' +
    '<button id="cookie-accept" type="button">Aceptar</button>' +
    '</div>';
  document.body.appendChild(banner);

  function hide(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    banner.remove();
  }
  document.getElementById('cookie-accept').addEventListener('click', function () {
    hide('accepted');
  });
  document.getElementById('cookie-reject').addEventListener('click', function () {
    hide('rejected');
  });
})();
