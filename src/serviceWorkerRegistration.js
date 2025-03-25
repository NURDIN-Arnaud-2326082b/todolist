// Ce code optionnel est utilisé pour enregistrer un service worker.
// register() n'est pas appelé par défaut.

// Cela permet à l'application de se charger plus rapidement sur les visites suivantes en production, et donne
// des capacités hors ligne. Cependant, cela signifie également que les développeurs (et les utilisateurs)
// ne verront les mises à jour déployées qu'après avoir visité toutes les pages de l'application,
// car les ressources précédemment mises en cache sont mises à jour en arrière-plan.

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] est l'adresse IPv6 localhost.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 sont considérées comme localhost pour IPv4.
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        // Notre service worker ne fonctionnera pas si PUBLIC_URL est sur une origine différente
        // de celle sur laquelle la page est servie. Cela peut se produire si un CDN est utilisé pour
        // servir les ressources; voir https://github.com/facebook/create-react-app/issues/2374
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // Ceci s'exécute sur localhost. Vérifions si un service worker existe toujours ou non.
          checkValidServiceWorker(swUrl, config);
  
          // Ajoutez des journaux supplémentaires pour localhost, pointant les développeurs vers le
          // documentation des service workers/PWA.
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'Cette application web est servie en premier par un service worker. Pour en savoir plus, visitez https://cra.link/PWA'
            );
          });
        } else {
          // Ce n'est pas localhost. Enregistrer simplement le service worker
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // À ce stade, le contenu précédent mis en cache a été récupéré,
                // mais le nouveau contenu du service worker sera disponible
                // lorsque toutes les onglets pour cette page sont fermés.
                console.log(
                  'Le nouveau contenu est disponible et sera utilisé lorsque tous ' +
                    'les onglets pour cette page sont fermés. Voir https://cra.link/PWA.'
                );
  
                // Exécuter le callback
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // À ce stade, tout a été mis en cache.
                // C'est le moment parfait pour afficher un
                // "Le contenu est mis en cache pour une utilisation hors ligne." message.
                console.log('Le contenu est mis en cache pour une utilisation hors ligne.');
  
                // Exécuter le callback
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement du service worker:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Vérifier si le service worker peut être trouvé. S'il ne peut pas être chargé, rechargez la page.
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then((response) => {
        // Assurez-vous que le service worker existe et que nous obtenons vraiment un fichier JS.
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // Aucun service worker trouvé. Probablement une application différente. Rechargez la page.
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Service worker trouvé. Procéder normalement.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('Aucune connexion Internet trouvée. L\'application s\'exécute en mode hors ligne.');
      });
  }
  
  export function unregister() {
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