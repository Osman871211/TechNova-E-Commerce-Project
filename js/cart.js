/* ==========================================================================
   TECHNOVA - SHOPPING CART (localStorage)
   ========================================================================== */

const CART_STORAGE_KEY = 'technova_cart_items';

// Cart data helpers
function getCart() {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

// Add product to cart
function addToCart(productId, quantity = 1) {
  const product = getProductById(productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === parseInt(productId));

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      categoryName: product.categoryName,
      quantity
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" to cart!`, 'success');
}

// Remove product from cart
function removeFromCart(productId) {
  let cart = getCart();
  const product = cart.find(item => item.id === parseInt(productId));
  cart = cart.filter(item => item.id !== parseInt(productId));
  saveCart(cart);

  if (product) showToast(`Removed "${product.name}" from cart.`, 'info');
  if (document.getElementById('cart-table-body')) renderCartPage();
}

// Change quantity (+1 or -1)
function updateQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === parseInt(productId));
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) { removeFromCart(productId); return; }

  saveCart(cart);
  if (document.getElementById('cart-table-body')) renderCartPage();
}

// Update cart badge in header
function updateCartBadge() {
  const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}

// Calculate order totals
function getCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 150 ? 0 : 15) : 0;
  const tax = subtotal * 0.05;

  return {
    subtotal: subtotal.toFixed(2),
    shipping: subtotal > 150 && subtotal > 0 ? 'FREE' : `$${shipping.toFixed(2)}`,
    tax: tax.toFixed(2),
    total: (subtotal + shipping + tax).toFixed(2)
  };
}

// Render cart page UI
function renderCartPage() {
  const tbody = document.getElementById('cart-table-body');
  const summaryBox = document.getElementById('cart-summary-box');
  if (!tbody) return;

  const cart = getCart();

  if (cart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:3rem 1rem;">
          <i class="fas fa-shopping-cart" style="font-size:3rem;color:var(--text-light);margin-bottom:1rem;"></i>
          <h3>Your cart is empty</h3>
          <p style="color:var(--text-muted);margin-bottom:1.5rem;">Looks like you haven't added any products yet.</p>
          <a href="shop.html" class="btn btn-primary">Start Shopping</a>
        </td>
      </tr>`;
    if (summaryBox) summaryBox.innerHTML = `<h3>Order Summary</h3><p style="color:var(--text-muted);margin-top:1rem;">No items in cart.</p>`;
    return;
  }

  // Table rows
  tbody.innerHTML = cart.map(item => `
    <tr>
      <td>
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <div class="cart-item-title">${item.name}</div>
            <small style="color:var(--text-muted);">${item.categoryName}</small>
          </div>
        </div>
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <div class="qty-btn-group" style="width:fit-content;">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <input type="text" class="qty-input" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </td>
      <td style="font-weight:700;color:var(--primary);">$${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>`).join('');

  // Order summary
  const s = getCartSummary();
  if (summaryBox) {
    summaryBox.innerHTML = `
      <h3>Order Summary</h3>
      <div style="margin-top:1.5rem;">
        <div class="summary-row"><span>Subtotal</span><span>$${s.subtotal}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${s.shipping}</span></div>
        <div class="summary-row"><span>Estimated Tax (5%)</span><span>$${s.tax}</span></div>

        <div class="promo-code-box">
          <input type="text" placeholder="Promo code (Try 'DIPLOMA')">
          <button class="btn btn-secondary btn-sm" onclick="showToast('Promo code applied!','success')">Apply</button>
        </div>

        <div class="summary-row total"><span>Total</span><span>$${s.total}</span></div>
        <a href="checkout.html" class="btn btn-primary" style="width:100%;margin-top:1.5rem;">
          Proceed to Checkout <i class="fas fa-arrow-right"></i>
        </a>
      </div>`;
  }
}

// Init on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  if (document.getElementById('cart-table-body')) renderCartPage();
});
