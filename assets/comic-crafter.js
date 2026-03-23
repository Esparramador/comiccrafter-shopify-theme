/* Comic Crafter Shopify Theme JS */
(function() {
  'use strict';

  var menuToggle = document.getElementById('mobile-menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      var isOpen = mobileMenu.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  var animateEls = document.querySelectorAll('.cc-animate-fade-in');
  if ('IntersectionObserver' in window && animateEls.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animateEls.forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  var galleryItems = document.querySelectorAll('.cc-gallery-bg__item');
  if (galleryItems.length > 1) {
    var currentSet = 0;
    setInterval(function() {
      galleryItems.forEach(function(item, i) {
        item.style.opacity = (Math.floor(i / 4) === currentSet) ? '1' : '0';
      });
      currentSet = (currentSet + 1) % Math.ceil(galleryItems.length / 4);
    }, 6000);
  }

  var header = document.querySelector('.cc-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(11,13,23,0.95)';
        header.style.backdropFilter = 'blur(20px)';
      } else {
        header.style.background = 'rgba(11,13,23,0.5)';
        header.style.backdropFilter = 'blur(12px)';
      }
    }, { passive: true });
  }

  document.querySelectorAll('form[action="/cart/add"]').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var originalText = btn.innerHTML;
      btn.textContent = 'Añadiendo...';
      btn.disabled = true;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })
      .then(function(res) { return res.json(); })
      .then(function() {
        btn.textContent = 'Añadido al carrito';
        btn.style.background = 'var(--cc-green)';
        fetch('/cart.js').then(function(r){return r.json()}).then(function(cart){
          var badge = document.querySelector('.cc-header__cart-count');
          if (badge) { badge.textContent = cart.item_count; }
          else {
            var cartLink = document.querySelector('.cc-header__cart');
            if (cartLink) {
              var span = document.createElement('span');
              span.className = 'cc-header__cart-count';
              span.textContent = cart.item_count;
              cartLink.appendChild(span);
            }
          }
        });
        setTimeout(function() {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 2000);
      })
      .catch(function() {
        btn.innerHTML = originalText;
        btn.disabled = false;
      });
    });
  });
})();
