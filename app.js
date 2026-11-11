
/* Loader: keeps every page working with its existing <script src="app.js"> tag.
   Order matters: Supabase config -> money -> site config -> original site code
   -> sharing -> database layer and other modules. */

(function () {
  var files = [
    'supabase-config.js?v=14',
    'velos-money.js?v=14',
    'velos-site-config.js?v=2',
    'app-core.js',
    'velos-share.js?v=5',
    'velos-api.js?v=19',
    'velos-assistant.js?v=2',
    'velos-push.js?v=1'
  ];

  var s = document.currentScript;

  if (s && !s.async && !s.defer && document.readyState === 'loading') {
    files.forEach(function (f) {
      document.write('<script src="' + f + '"><\/script>');
    });
  } else {
    files.forEach(function (f) {
      var e = document.createElement('script');
      e.src = f;
      e.async = false;
      document.head.appendChild(e);
    });
  }
})();
