// Service Worker Registration Helper
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((registration) => {
          console.log('✅ ServiceWorker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('⚠️ ServiceWorker registration failed:', error);
        });
    });
  }
}

export function unregisterServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
