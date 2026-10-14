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

  // 3. Filtros por Categoría + Scroll Automático
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

      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 4. Lógica Completa del Carrito de Compras
  let cart = [];
  const phoneWhatsApp = "5493525555555"; // Reemplaza con tu número real

  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartFloatingBtn = document.getElementById('cartFloatingBtn');
  const cartTriggerHeader = document.getElementById('cartTriggerHeader');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotalAmount = document.getElementById('cartTotalAmount');
  const cartCountFloat = document.getElementById('cartCountFloat');
  const cartCountHeader = document.getElementById('cartCountHeader');
  const checkoutWaBtn = document.getElementById('checkoutWaBtn');

  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  if (cartFloatingBtn) cartFloatingBtn.addEventListener('click', openCart);
  if (cartTriggerHeader) cartTriggerHeader.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Agregar al carrito
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');

      const existingIndex = cart.findIndex(item => item.name === name);
      if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
      } else {
        cart.push({ name, price, img, qty: 1 });
      }

      updateCartUI();
      openCart();
    });
  });

  function updateCartUI() {
    // Total contador
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountFloat.textContent = totalItems;
    cartCountHeader.textContent = totalItems;

    // Dibujar items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Tu carrito está vacío</p>';
      cartTotalAmount.textContent = '$0';
      return;
    }

    let grandTotal = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      grandTotal += itemTotal;

      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price.toLocaleString('es-AR')}</div>
          <div class="cart-item-qty">
            <button class="qty-btn minus-btn" data-index="${index}">-</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn plus-btn" data-index="${index}">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-index="${index}">&times;</button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    cartTotalAmount.textContent = `$${grandTotal.toLocaleString('es-AR')}`;

    // Eventos de botones dentro del carrito
    document.querySelectorAll('.minus-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        if (cart[idx].qty > 1) {
          cart[idx].qty -= 1;
        } else {
          cart.splice(idx, 1);
        }
        updateCartUI();
      });
    });

    document.querySelectorAll('.plus-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        cart[idx].qty += 1;
        updateCartUI();
      });
    });

    document.querySelectorAll('.remove-item-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        cart.splice(idx, 1);
        updateCartUI();
      });
    });
  }

  // Finalizar pedido por WhatsApp
  if (checkoutWaBtn) {
    checkoutWaBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Agrega al menos una prenda a tu carrito');
        return;
      }

      let msg = "Hola STYLO B! Quiero realizar el siguiente pedido:\n\n";
      let total = 0;

      cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        msg += `• ${item.name} (x${item.qty}) - $${subtotal.toLocaleString('es-AR')}\n`;
      });

      msg += `\n*TOTAL: $${total.toLocaleString('es-AR')}*`;

      const finalUrl = `https://wa.me/${phoneWhatsApp}?text=${encodeURIComponent(msg)}`;
      window.open(finalUrl, '_blank');
    });
  }

});