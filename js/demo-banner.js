document.addEventListener('DOMContentLoaded', function () {
  var body = document.body;
  if (body.dataset.demo !== 'true') return;

  var url  = body.dataset.demoUrl  || '#';
  var text = body.dataset.demoText || 'Want a site like this?';

  var banner = document.createElement('div');
  banner.id = 'demo-banner';
  banner.setAttribute('role', 'banner');
  banner.innerHTML =
    '\u26a1 DEMO SITE \u2014 This is an example website. ' +
    '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';

  Object.assign(banner.style, {
    background:     '#E8A020',
    color:          '#1a1a1a',
    textAlign:      'center',
    padding:        '10px 20px',
    fontSize:       '14px',
    fontWeight:     '600',
    fontFamily:     'sans-serif',
    position:       'sticky',
    top:            '0',
    zIndex:         '9999',
    lineHeight:     '1.5',
    letterSpacing:  '0.01em'
  });

  var link = banner.querySelector('a');
  Object.assign(link.style, {
    color:          '#1a3a5c',
    fontWeight:     '700',
    marginLeft:     '8px',
    textDecoration: 'underline'
  });

  document.body.insertBefore(banner, document.body.firstChild);
});
