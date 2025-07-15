// === NAV MENU ===
function toggleMenu() {
  document.querySelector(".navbar").classList.toggle("active");
}

// === NUT RAIN ===
const nutImages = [
  'cashew.webp', 'peanut.webp', 'almond.png', 'pistachio.png', 'egypt.png', 'bendo22.png'
];

const nutContainer = document.getElementById('nutRainContainer');

function spawnNut() {
  const nut = document.createElement('div');
  nut.classList.add('nut');

  const img = document.createElement('img');
  img.src = nutImages[Math.floor(Math.random() * nutImages.length)];
  img.style.width = (30 + Math.random() * 30) + 'px';
  img.style.opacity = 0.9;
  img.style.transform = `rotate(${Math.random() * 360}deg)`;

  nut.style.left = Math.random() * 100 + 'vw';
  nut.style.animationDuration = (6 + Math.random() * 4) + 's';

  nut.appendChild(img);
  nutContainer.appendChild(nut);

  setTimeout(() => nut.remove(), 11000);
}

// 🌰 Run nut rain only for 10 seconds after load
window.addEventListener('DOMContentLoaded', () => {
  const nutInterval = setInterval(spawnNut, 1200);

  setTimeout(() => {
    clearInterval(nutInterval); // stop rain after 10 seconds
  }, 5000);
  
});

// === NEWSLETTER POPUP ===
document.querySelector('.discount-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const popup = document.getElementById('emailSuccess');
  popup.classList.remove('hidden');
  this.reset();
  setTimeout(() => popup.classList.add('hidden'), 3200);
});

// === TOGGLE CATALOGUE ===
function toggleCatalogue() {
  const options = document.getElementById('catalogueOptions');
  const label = document.getElementById('catalogueLabel');
  options.style.display = options.style.display === 'flex' ? 'none' : 'flex';
  if (label) label.style.display = 'none';
}

// === CARD REDIRECT ON CLICK ===
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', () => {
    const link = card.getAttribute('data-href');
    if (link) window.location.href = link;
  });
});

// === SEARCH BAR ===
document.getElementById('searchInput')?.addEventListener('input', function () {
  const searchTerm = this.value.trim().toLowerCase();
  const products = document.querySelectorAll('.product-card');
  products.forEach(card => {
    const name = card.getAttribute('data-name')?.toLowerCase() || '';
    card.style.display = name.includes(searchTerm) ? 'flex' : 'none';
  });
});

// === CART FUNCTIONALITY ===
let cart = [];

function toggleCart() {
  document.getElementById('cartPanel').classList.toggle('active');
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
 itemDiv.innerHTML = `
  <img src="${item.image}" />
  <div class="cart-item-info">
    <p><strong>${item.name}</strong></p>
    <p>Price: $${item.price}</p>
    <p>
      Qty:
      <input type="number" class="edit-qty" value="${item.qty}" min="1"
        onchange="editCartQty(${index}, this.value)" />
    </p>
    <p>Total: $${(item.price * item.qty).toFixed(2)}</p>
  </div>
  <span class="remove-item" onclick="removeFromCart(${index})">&times;</span>
`;


    cartItems.appendChild(itemDiv);
    total += item.price * item.qty;
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = total.toFixed(2);
  const exchangeRates = {
  usd: 1,
  lbp: 89000,  // Example rates
  eur: 0.92,
  sar: 3.75
};

document.getElementById('cartCurrency')?.addEventListener('change', function () {
  const currency = this.value;
  const usdTotal = parseFloat(document.getElementById('cartTotal')?.textContent) || 0;

  let converted = usdTotal * exchangeRates[currency];
  let symbol = currency === 'usd' ? '$' :
               currency === 'lbp' ? 'LBP' :
               currency === 'eur' ? '€' :
               currency === 'sar' ? 'SAR' : '';

  converted = currency === 'lbp' ? Math.round(converted) : converted.toFixed(2);
  document.getElementById('convertedTotal').innerText = `${symbol}${converted}`;
});
updateConvertedCartTotal();

}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
  saveCart();
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const card = this.closest('.product-card');
    const name = card.dataset.name || card.querySelector('.product-title')?.textContent.trim() || 'Unnamed Product';

    // ✅ Use .price-value instead of .price
    const priceSpan = card.querySelector('.price-value');
    const usdValue = priceSpan?.dataset?.usd;
    const price = usdValue ? parseFloat(usdValue) : 0;

    const image = card.querySelector('img')?.src || '';
    const qty = parseInt(card.querySelector('.quantity-input')?.value) || 1;

    cart.push({ name, price, image, qty });
    updateCartDisplay();
    saveCart();
  });
});






function updateCartTotal() {
  let total = 0;
  document.querySelectorAll('.cart-item').forEach(item => {
    const price = parseFloat(item.querySelector('.price')?.textContent.replace('$', '')) || 0;
    const quantity = parseInt(item.querySelector('.quantity')?.textContent) || 1;
    total += price * quantity;
  });
  document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function closeCart() {
  document.getElementById("cartPanel").classList.remove("active");
}

function saveCart() {
  localStorage.setItem('kruxyCart', JSON.stringify(cart));
}

function loadCart() {
  const storedCart = localStorage.getItem('kruxyCart');
  cart = storedCart ? JSON.parse(storedCart) : [];
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartDisplay();

  document.querySelectorAll(".flip-trigger").forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      card.classList.add("flipped");
    });
  });

  document.querySelectorAll(".flip-back").forEach(button => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      card.classList.remove("flipped");
    });
  });
});

const productGrid = document.getElementById('productGrid');
const originalOrder = Array.from(productGrid.children);

document.getElementById('sortSelect').addEventListener('change', function () {
  const sortValue = this.value;
  const products = Array.from(productGrid.getElementsByClassName('product-card'));

  if (sortValue === 'low-high' || sortValue === 'high-low') {
    products.sort((a, b) => {
      const priceA = parseFloat(a.querySelector('.price-value')?.dataset.usd || 0);
      const priceB = parseFloat(b.querySelector('.price-value')?.dataset.usd || 0);
      return sortValue === 'low-high' ? priceA - priceB : priceB - priceA;
    });
  }

  else if (sortValue === 'weight-low-high' || sortValue === 'weight-high-low') {
    products.sort((a, b) => {
      // Get weight from 2nd .pieces (assuming “Weight: 250g”)
      const weightA = parseInt(a.querySelectorAll('.pieces')[1]?.textContent.replace(/\D/g, '') || 0);
      const weightB = parseInt(b.querySelectorAll('.pieces')[1]?.textContent.replace(/\D/g, '') || 0);
      return sortValue === 'weight-low-high' ? weightA - weightB : weightB - weightA;
    });
  }

  else if (sortValue === 'top-rated') {
    products.sort((a, b) => {
      const ratingA = parseInt(a.querySelector('.star-rating')?.dataset.rating || 0);
      const ratingB = parseInt(b.querySelector('.star-rating')?.dataset.rating || 0);
      return ratingB - ratingA;
    });
  }

  else if (sortValue === 'on-sale') {
    const saleItems = products.filter(card => card.classList.contains('on-sale'));
    const nonSaleItems = products.filter(card => !card.classList.contains('on-sale'));
    [...saleItems, ...nonSaleItems].forEach(card => productGrid.appendChild(card));
    return; // exit early to avoid re-appending again below
  }

  else if (sortValue === 'default') {
    originalOrder.forEach(card => productGrid.appendChild(card));
    return;
  }

  // Append sorted items (for all other cases)
  products.forEach(card => productGrid.appendChild(card));
});



function editCartQty(index, newQty) {
  newQty = parseInt(newQty);
  if (isNaN(newQty) || newQty < 1) return;

  cart[index].qty = newQty;
  updateCartDisplay();
  saveCart();
}
const exchangeRates = {
  usd: 1,
  lbp: 89000,  // Example rate: 1 USD = 89,000 LBP
  eur: 0.92,   // Example: 1 USD = 0.92 EUR
  sar: 3.75    // Example: 1 USD = 3.75 SAR
};

document.querySelectorAll('.currency-selector').forEach(selector => {
  selector.addEventListener('change', function () {
    const currency = this.value;
    const wrapper = this.closest('.price-wrapper');
    const priceSpan = wrapper.querySelector('.price-value');
    const usdPrice = parseFloat(priceSpan.dataset.usd);

    let converted = usdPrice * exchangeRates[currency];
    let symbol = currency === 'usd' ? '$' : 
                 currency === 'lbp' ? 'LBP' : 
                 currency === 'eur' ? '€' : 
                 currency === 'sar' ? 'SAR' : '';

    converted = currency === 'lbp' ? Math.round(converted) : converted.toFixed(2);
    priceSpan.innerText = `${symbol}${converted}`;
  });
  const exchangeRates = {
  usd: 1,
  lbp: 89000,  // Example rates
  eur: 0.92,
  sar: 3.75
};

document.getElementById('cartCurrency')?.addEventListener('change', function () {
  const currency = this.value;
  const usdTotal = parseFloat(document.getElementById('cartTotal')?.textContent) || 0;

  let converted = usdTotal * exchangeRates[currency];
  let symbol = currency === 'usd' ? '$' :
               currency === 'lbp' ? 'LBP' :
               currency === 'eur' ? '€' :
               currency === 'sar' ? 'SAR' : '';

  converted = currency === 'lbp' ? Math.round(converted) : converted.toFixed(2);
  document.getElementById('convertedTotal').innerText = `${symbol}${converted}`;
});

});

function updateConvertedCartTotal() {
  const selector = document.getElementById('cartCurrency');
  if (selector) selector.dispatchEvent(new Event('change'));
}
function toggleLoginModal() {
  document.getElementById("loginModal").classList.toggle("hidden");
}
// 👇 Show alert bar after signing up
document.querySelector('#loginModal form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById("loginModal").classList.add("hidden");
  showAlert();
});

function showAlert() {
  const bar = document.getElementById("alertBar");
  bar.classList.remove("hidden");

  setTimeout(() => {
    bar.classList.add("hidden");
  }, 5000); // auto-hide after 5s
}

function openLoginFromAlert() {
  document.getElementById("alertBar").classList.add("hidden");
  toggleLoginForm();
}

// 👇 Toggle login modal (separate from sign-up)
function toggleLoginForm() {
  document.getElementById("loginFormModal").classList.toggle("hidden");
}
// 👇 Login success alert with loading bar
document.querySelector('#loginFormModal form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  // Close the login modal
  document.getElementById("loginFormModal").classList.add("hidden");

  // Show success alert
  const loginSuccess = document.getElementById("loginSuccessAlert");
  loginSuccess.classList.remove("hidden");

  // Reset and animate loading bar
  const bar = loginSuccess.querySelector('.login-loading-fill');
  bar.style.width = '0%';
  bar.offsetHeight; // force reflow
  bar.style.width = '100%';

  // Hide after animation
  setTimeout(() => {
    loginSuccess.classList.add("hidden");
  }, 3500);
});


document.querySelectorAll('.star-rating').forEach(starContainer => {
  const stars = starContainer.querySelectorAll('i');

  stars.forEach(star => {
    // Hover effect
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.value);
      stars.forEach(s => {
        s.classList.toggle('hovered', parseInt(s.dataset.value) <= val);
      });
    });

    // Remove hover on leave
    starContainer.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hovered'));
    });

    // Click to rate
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value);
      starContainer.dataset.rating = val;
      stars.forEach(s => {
        s.classList.toggle('selected', parseInt(s.dataset.value) <= val);
      });
      console.log(`⭐ Rated ${val} stars`);
    });
  });
});
function togglePaymentOptions() {
  document.getElementById("paymentOptions").classList.toggle("hidden");
}

function initStarRatings() {
  document.querySelectorAll('.star-rating').forEach(ratingDiv => {
    const stars = ratingDiv.querySelectorAll('i');
    const productName = ratingDiv.dataset.name;
    const savedRating = localStorage.getItem(`rating_${productName}`);

    function updateStars(value) {
      stars.forEach(star => {
        const starValue = parseInt(star.dataset.value);
        star.classList.toggle('active', starValue <= value);
      });
      ratingDiv.dataset.rating = value;
    }

    // Load saved rating
    if (savedRating) {
      updateStars(parseInt(savedRating));
    }

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        localStorage.setItem(`rating_${productName}`, value);
        updateStars(value);
      });
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  initStarRatings();
});
function handleCashOnDelivery() {
  alert("✅ Order confirmed with Cash on Delivery. We will contact you shortly.");
}

  // FAQ toggle
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      answer.style.display = answer.style.display === "block" ? "none" : "block";
    });
  });

