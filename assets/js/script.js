document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', function () {
      const item = this.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach((faq) => faq.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm && formNote) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formNote.textContent = 'Request captured on the page. Connect this form to Formspree, Netlify Forms, EmailJS, or your backend for real submissions.';
      formNote.classList.add('success');
      contactForm.reset();
    });
  }
});
