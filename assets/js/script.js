document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      panel.classList.toggle('show');
    });

    panel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        panel.classList.remove('show');
      });
    });
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    const button = item.querySelector('.faq-question');
    button?.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const href = link.getAttribute('href');
    if ((current === '' || current === 'index.html') && href === 'index.html') link.classList.add('active');
    if (href === current) link.classList.add('active');
  });
});
