(function() {
  const meta = document.createElement('meta');
  meta.name = 'color-scheme';
  meta.content = 'only light';
  document.head.appendChild(meta);

  const style = document.createElement('style');
  style.innerHTML = ':root { color-scheme: light !important; background-color: white !important; }';
  document.head.appendChild(style);
})();