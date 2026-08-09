/* ==========================================================================
   TECHNOVA - CORE INTERACTIVITY & UI LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileMenu();
  initHeaderSearch();
  initHeroSlider();
  initOfferCountdown();
  initScrollTop();
  initFormValidations();
  initShopFilters();
  initProductDetailsPage();
});

/* --------------------------------------------------------------------------
   1. Dark Mode Toggle
   -------------------------------------------------------------------------- */
function initDarkMode() {
  const btn = document.getElementById('theme-toggle-btn');
  const saved = localStorage.getItem('technova_theme') || 'light';

  document.documentElement.setAttribute('data-theme', saved);
  setThemeIcon(saved);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('technova_theme', next);
      setThemeIcon(next);
      showToast(`Switched to ${next} mode`, 'info');
    });
  }
}

function setThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle-btn i');
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('nav-menu');

  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('active');
      btn.innerHTML = nav.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }
}

/* --------------------------------------------------------------------------
   3. Header Search with Autocomplete
   -------------------------------------------------------------------------- */
function initHeaderSearch() {
  const input = document.getElementById('header-search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', e => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
      return;
    }

    const matches = products
      .filter(p => p.name.toLowerCase().includes(query) || p.categoryName.toLowerCase().includes(query))
      .slice(0, 5);

    dropdown.innerHTML = matches.length
      ? matches.map(p => `
          <a href="product.html?id=${p.id}" class="search-item">
            <img src="${p.image}" alt="${p.name}">
            <div class="search-item-info">
              <div class="search-item-title">${p.name}</div>
              <div class="search-item-price">$${p.price.toFixed(2)}</div>
            </div>
          </a>`).join('')
      : `<div class="search-item" style="color: var(--text-muted);">No products found</div>`;

    dropdown.classList.add('active');
  });

  // Enter key → go to shop search
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
    }
  });

  // Click outside → close dropdown
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Hero Slider
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const container = document.getElementById('hero-slider-container');
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!container || slides.length === 0) return;

  let current = 0;
  const total = slides.length;
  let timer = null;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    container.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  resetTimer();
}

/* --------------------------------------------------------------------------
   5. Offer Countdown Timer
   -------------------------------------------------------------------------- */
function initOfferCountdown() {
  const h = document.getElementById('count-hours');
  const m = document.getElementById('count-mins');
  const s = document.getElementById('count-secs');
  if (!h || !m || !s) return;

  let totalSecs = 18 * 3600 + 45 * 60 + 30;

  function tick() {
    if (totalSecs <= 0) { h.textContent = m.textContent = s.textContent = '00'; return; }
    h.textContent = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    m.textContent = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    s.textContent = String(totalSecs % 60).padStart(2, '0');
    totalSecs--;
  }

  tick();
  setInterval(tick, 1000);
}

/* --------------------------------------------------------------------------
   6. Scroll-To-Top Button
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 300));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* --------------------------------------------------------------------------
   7. Form Validations (Contact, Login, Register, Checkout)
   -------------------------------------------------------------------------- */
function initFormValidations() {
  // Helper: show/hide error on an input field
  function validate(input, condition, msg) {
    const group = input.closest('.form-group');
    if (!group) return condition;

    let err = group.querySelector('.error-message');
    if (!err) {
      err = document.createElement('span');
      err.className = 'error-message';
      group.appendChild(err);
    }

    group.classList.toggle('error', !condition);
    err.textContent = condition ? '' : msg;
    return condition;
  }

  const emailRgx = /\S+@\S+\.\S+/;

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.querySelector('#contact-name');
      const email = contactForm.querySelector('#contact-email');
      const msg = contactForm.querySelector('#contact-message');

      const ok =
        validate(name, name.value.trim().length >= 2, 'Name must be at least 2 characters.') &
        validate(email, emailRgx.test(email.value.trim()), 'Enter a valid email address.') &
        validate(msg, msg.value.trim().length >= 10, 'Message must be at least 10 characters.');

      if (ok) { showToast('Thank you! Your message has been sent.', 'success'); contactForm.reset(); }
    });
  }

  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginForm.querySelector('#login-email');
      const pass = loginForm.querySelector('#login-password');

      const ok =
        validate(email, emailRgx.test(email.value.trim()), 'Enter a valid email address.') &
        validate(pass, pass.value.length >= 6, 'Password must be at least 6 characters.');

      if (ok) {
        showToast('Login successful! Welcome back.', 'success');
        setTimeout(() => window.location.href = 'index.html', 1200);
      }
    });
  }

  // Register Form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = registerForm.querySelector('#reg-name');
      const email = registerForm.querySelector('#reg-email');
      const pass = registerForm.querySelector('#reg-password');
      const confirm = registerForm.querySelector('#reg-confirm-password');

      const ok =
        validate(name, name.value.trim().length >= 2, 'Full Name is required.') &
        validate(email, emailRgx.test(email.value.trim()), 'Enter a valid email address.') &
        validate(pass, pass.value.length >= 6, 'Password must be at least 6 characters.') &
        validate(confirm, confirm.value === pass.value && confirm.value !== '', 'Passwords do not match.');

      if (ok) {
        showToast('Account created! Please log in.', 'success');
        setTimeout(() => window.location.href = 'login.html', 1200);
      }
    });
  }

  // Checkout Form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      const f = (id) => checkoutForm.querySelector(id);

      const ok =
        validate(f('#checkout-fullname'), f('#checkout-fullname').value.trim().length >= 2, 'Full Name is required.') &
        validate(f('#checkout-email'), emailRgx.test(f('#checkout-email').value.trim()), 'Valid email is required.') &
        validate(f('#checkout-address'), f('#checkout-address').value.trim().length >= 5, 'Address is required.') &
        validate(f('#checkout-city'), f('#checkout-city').value.trim().length >= 2, 'City is required.') &
        validate(f('#checkout-zip'), f('#checkout-zip').value.trim().length >= 3, 'ZIP code is required.');

      if (ok) {
        showToast('Order Placed! Thank you for your purchase.', 'success');
        localStorage.removeItem(CART_STORAGE_KEY);
        updateCartBadge();
        setTimeout(() => window.location.href = 'index.html', 2000);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. Shop Filtering & Sorting
   -------------------------------------------------------------------------- */
function initShopFilters() {
  const grid = document.getElementById('shop-products-grid');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  let currentCategory = params.get('category') || 'all';
  let currentSearch = params.get('search') || '';
  let maxPrice = 1500;
  let sortOption = 'default';

  const priceSlider = document.getElementById('price-range');
  const priceDisplay = document.getElementById('price-display');
  const sortSelect = document.getElementById('shop-sort');

  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', e => {
      maxPrice = parseFloat(e.target.value);
      priceDisplay.textContent = `$${maxPrice}`;
      render();
    });
  }

  if (sortSelect) sortSelect.addEventListener('change', e => { sortOption = e.target.value; render(); });

  document.querySelectorAll('input[name="shop-category"]').forEach(input => {
    if (input.value.toLowerCase() === currentCategory.toLowerCase()) input.checked = true;
    input.addEventListener('change', e => { currentCategory = e.target.value; render(); });
  });

  function render() {
    let result = products.filter(p => {
      const catMatch = currentCategory === 'all' || p.category.toLowerCase() === currentCategory.toLowerCase();
      const searchMatch = !currentSearch || p.name.toLowerCase().includes(currentSearch.toLowerCase()) || p.categoryName.toLowerCase().includes(currentSearch.toLowerCase());
      return catMatch && searchMatch && p.price <= maxPrice;
    });

    if (sortOption === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortOption === 'rating') result.sort((a, b) => b.rating - a.rating);

    const countEl = document.getElementById('shop-count');
    if (countEl) countEl.textContent = `Showing ${result.length} of ${products.length} products`;

    if (result.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:4rem 1rem;">
          <i class="fas fa-search" style="font-size:3rem;color:var(--text-light);margin-bottom:1rem;"></i>
          <h3>No products found</h3>
          <p style="color:var(--text-muted);">Try adjusting your search or filter settings.</p>
        </div>`;
      return;
    }

    grid.innerHTML = result.map(p => `
      <div class="product-card">
        ${p.badge ? `<span class="badge ${p.badge === 'Sale' ? 'badge-sale' : 'badge-new'} product-badge">${p.badge}</span>` : ''}
        <div class="product-thumb">
          <img src="${p.image}" alt="${p.name}">
          <div class="product-actions">
            <button class="icon-btn" onclick="addToCart(${p.id})" title="Add to Cart"><i class="fas fa-shopping-cart"></i></button>
            <a href="product.html?id=${p.id}" class="icon-btn" title="View Details"><i class="fas fa-eye"></i></a>
          </div>
        </div>
        <div class="product-content">
          <span class="product-category">${p.categoryName}</span>
          <h3 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <div class="product-rating"><i class="fas fa-star"></i> <span>${p.rating} (${p.reviewsCount})</span></div>
          <div class="product-bottom">
            <div class="product-price">
              <span class="current-price">$${p.price.toFixed(2)}</span>
              ${p.oldPrice ? `<span class="old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="add-cart-btn" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i></button>
          </div>
        </div>
      </div>`).join('');
  }

  render();
}

/* --------------------------------------------------------------------------
   9. Product Detail Page Renderer
   -------------------------------------------------------------------------- */
function initProductDetailsPage() {
  const container = document.getElementById('product-detail-view');
  if (!container) return;

  const id = new URLSearchParams(window.location.search).get('id') || 1;
  const p = getProductById(id);

  if (!p) {
    container.innerHTML = `<h2>Product not found</h2><a href="shop.html" class="btn btn-primary">Back to Shop</a>`;
    return;
  }

  document.title = `${p.name} - TechNova`;

  container.innerHTML = `
    <div class="product-details-container">
      <div class="product-gallery">
        <div class="main-image"><img id="detail-main-img" src="${p.image}" alt="${p.name}"></div>
        <div class="thumbnail-list">
          <img class="thumb-item active" src="${p.image}" alt="Thumb 1" onclick="document.getElementById('detail-main-img').src='${p.image}'">
          <img class="thumb-item" src="${p.image}" alt="Thumb 2" onclick="document.getElementById('detail-main-img').src='${p.image}'">
        </div>
      </div>

      <div class="product-info">
        ${p.badge ? `<span class="badge ${p.badge === 'Sale' ? 'badge-sale' : 'badge-new'}">${p.badge}</span>` : ''}
        <h1 style="margin-top:0.5rem;">${p.name}</h1>
        <div class="product-info-meta">
          <div class="product-rating" style="margin-bottom:0;"><i class="fas fa-star"></i> <span>${p.rating} (${p.reviewsCount} reviews)</span></div>
          <span class="stock-status"><i class="fas fa-check-circle"></i> In Stock (${p.stock} left)</span>
        </div>

        <div class="product-price" style="margin:1.5rem 0;">
          <span class="current-price" style="font-size:2rem;">$${p.price.toFixed(2)}</span>
          ${p.oldPrice ? `<span class="old-price" style="font-size:1.2rem;">$${p.oldPrice.toFixed(2)}</span>` : ''}
        </div>

        <p class="product-description-text">${p.description}</p>

        <div class="quantity-selector">
          <label style="font-weight:600;">Quantity:</label>
          <div class="qty-btn-group">
            <button class="qty-btn" onclick="let q=document.getElementById('detail-qty'); if(q.value>1) q.value--;">-</button>
            <input type="text" id="detail-qty" class="qty-input" value="1" readonly>
            <button class="qty-btn" onclick="document.getElementById('detail-qty').value++;">+</button>
          </div>
        </div>

        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <button class="btn btn-primary btn-lg" onclick="addToCart(${p.id}, parseInt(document.getElementById('detail-qty').value))">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="btn btn-secondary btn-lg" onclick="addToCart(${p.id}, parseInt(document.getElementById('detail-qty').value)); window.location.href='checkout.html';">
            Buy Now
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="product-tabs-container">
      <div class="tab-headers">
        <button class="tab-btn active" onclick="switchTab(event,'tab-desc')">Description</button>
        <button class="tab-btn" onclick="switchTab(event,'tab-specs')">Specifications</button>
        <button class="tab-btn" onclick="switchTab(event,'tab-reviews')">Reviews (${p.reviewsCount})</button>
      </div>
      <div id="tab-desc" class="tab-content active">
        <p>${p.description}</p><br>
        <p>Built using industry-standard durable materials with focus on ergonomic design, fast performance, and battery efficiency. Backed by TechNova's 1-year official warranty.</p>
      </div>
      <div id="tab-specs" class="tab-content">
        <ul style="list-style:disc;padding-left:1.5rem;">
          <li>Model: TN-${p.id}00X</li>
          <li>Category: ${p.categoryName}</li>
          <li>Warranty: 1 Year Manufacturer Warranty</li>
          <li>Color: Midnight Dark / Silver Alloy</li>
        </ul>
      </div>
      <div id="tab-reviews" class="tab-content">
        <div class="review-card" style="margin-bottom:1rem;">
          <div class="review-stars">${'<i class="fas fa-star"></i>'.repeat(5)}</div>
          <p class="review-text">"Amazing quality! Received it within 2 days. Exceeded my expectations."</p>
          <div class="reviewer-name">Alex Johnson - <small style="color:var(--text-muted);">Verified Buyer</small></div>
        </div>
      </div>
    </div>`;
}

function switchTab(evt, tabId) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  evt.currentTarget.classList.add('active');
}

/* --------------------------------------------------------------------------
   10. Toast Notifications
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}
