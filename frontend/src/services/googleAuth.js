export function loadGoogleCodeClient(callback) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not configured.');
  }

  if (window.google?.accounts?.oauth2) {
    return window.google.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: 'openid email profile',
      ux_mode: 'popup',
      callback
    });
  }

  throw new Error('Google Identity Services script is not loaded yet.');
}
