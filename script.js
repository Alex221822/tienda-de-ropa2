document.addEventListener('DOMContentLoaded', () => {

  // 1. Menú Móvil responsivo
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Sliders de Fotos por Tarjeta
  document.querySelectorAll('.product-card').forEach(card => {
    const wrapper = card.querySelector('.slider-wrapper');
    if (!wrapper) return;

    const images = wrapper.querySelectorAll('img');
    const prevBtn = card.querySelector('.slide-nav.prev');
    const nextBtn = card.querySelector('.slide-nav.next');
    let currentIndex = 0;

    if (images.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    function updateSlider() {
      wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        updateSlider();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateSlider();
      });
    }
  });

  // 3. Filtros por Categoría Funcionales + Scroll Automático hacia la sección de productos
  const catButtons = document.querySelectorAll('.cat-card-btn');
  const cards = document.querySelectorAll('.product-card');
  const activeCount = document.getElementById('activeCount');
  const productsSection = document.getElementById('productos');

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      let count = 0;

      cards.forEach(card => {
        if (cat === 'todos' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
          count++;
        } else {
          card.style.display = 'none';
        }
      });

      if (activeCount) activeCount.textContent = count;

      // Desplazamiento suave (Scroll) hacia abajo hacia la sección de productos
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 4. WhatsApp Dinámico en los productos
  const phoneWhatsApp = "5493525555555"; // Reemplaza con tu número real

  document.querySelectorAll('.btn-buy').forEach(button => {
    const productName = button.getAttribute('data-product');
    const message = encodeURIComponent(`Hola, me interesa el producto ${productName}`);
    button.href = `https://wa.me/${phoneWhatsApp}?text=${message}`;
    button.setAttribute('target', '_blank');
  });

});