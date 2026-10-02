/* Loader: keeps every page working with its existing <script src="app.js"> tag.
   Order matters: config -> original site code (app-core.js) -> database layer. */
(function(){
  var files = ['supabase-config.js', 'app-core.js', 'velos-api.js'];
  var s = document.currentScript;
  if(s && !s.async && !s.defer && document.readyState === 'loading'){
    files.forEach(function(f){ document.write('<script src="' + f + '"><\/script>'); });
  } else {
    files.forEach(function(f){ var e = document.createElement('script'); e.src = f; e.async = false; document.head.appendChild(e); });
  }
})();
