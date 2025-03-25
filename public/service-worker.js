/* eslint-disable no-restricted-globals */

// Ce service worker peut être personnalisé!
// Voir https://developers.google.com/web/tools/workbox/modules
// pour la liste des modules Workbox disponibles, ou ajoutez n'importe quel autre
// code que vous voulez.
// Vous pouvez également supprimer ce fichier si vous préférez ne pas utiliser un
// service worker, et la demande d'inscription échouera silencieusement.

// Précachez la page d'accueil
const CACHE_NAME = 'todolist-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/data.json',
  '/static/css/main.css',
  '/static/js/main.js',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event) => {
  // Effectuer l'installation des étapes
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retourner la réponse
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Vérifier si nous avons reçu une réponse valide
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse. Une réponse est un flux
            // et ne peut être consommé qu'une seule fois.
            // Nous devons le sauvegarder et le renvoyer.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});