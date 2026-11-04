(function () {
  var parts = (location.pathname || '').split('/').filter(Boolean);
  var langs = { it: 1, el: 1, es: 1, fr: 1, de: 1, ru: 1 };
  var lang = '';
  if (parts.length && langs[parts[0]]) lang = '/' + parts.shift();
  if (!parts.length) return;
  var kind = parts[0];
  if (kind !== 'product-category' && kind !== 'product' && kind !== 'prodotto' && kind !== 'shop' && kind !== 'categoria-prodotto') return;
  var slug = (parts[1] || '').replace(/\/$/, '');
  var alias = {
    'magic-yoke-copia': 'magic-yoke',
    'pro-flight-radio-panel-copia': 'pro-flight-radio-panel',
    'full-cockpit-cessna-c172-kit': 'cessna-cabin-172-152',
    'cessna-172': 'cessna-172-magic-big',
    'cessna-152': 'cessna-152-magic-big',
    'garmin-g1000': 'garmin-g1000',
    'garmin-g430': 'garmin-g430',
    'garmin-g530': 'garmin-g530',
    'atc': 'atc-simulator',
    'drone': 'drone-simulator',
    'yoke': 'magic-yoke',
    'cabin': 'cessna-cabin-172-152'
  };
  var known = {
    'atc-simulator': 1,
    'cessna-152-magic-big': 1,
    'cessna-152-magic-mini': 1,
    'cessna-172-magic-big': 1,
    'cessna-172-magic-mini': 1,
    'cessna-cabin-172-152': 1,
    'cessna-magnetic-compass': 1,
    'drone-simulator': 1,
    'garmin-g1000': 1,
    'garmin-g430': 1,
    'garmin-g530': 1,
    'magic-yoke': 1,
    'pro-flight-radio-panel': 1,
    'professional-cessna-152-magic-big': 1,
    'professional-cessna-152-magic-mini': 1,
    'professional-cessna-172-magic-big': 1,
    'professional-cessna-172-magic-mini': 1,
    'transponder': 1
  };
  if (slug === 'home' || slug === '') {
    location.replace(lang ? lang + '/' : '/');
    return;
  }
  var target = alias[slug] || slug;
  if (known[target]) location.replace(lang + '/products/' + target + '.html');
  else location.replace(lang + '/products/');
})();
