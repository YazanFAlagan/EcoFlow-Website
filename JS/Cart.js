// ========== SECTION: INITIALIZATION AND CORE VARIABLES ==========
let cart = [];
const TAX_RATE = 0.10;

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    renderCart();
    setupEventListeners();
    updateCartCount();
    setupScrollBehavior();
});
// ========== END SECTION: INITIALIZATION AND CORE VARIABLES ==========

// ========== SECTION: CART STORAGE FUNCTIONS ==========
function loadCart() {
    const savedCart = localStorage.getItem('ecoFlowCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [
            {
                id: 1,
                name: "Sugar Cane Filter",
                price: 79.00,
                image: "../Assets/Products/2.jpg",
                category: "Filter",
                quantity: 1
            },
            {
                id: 2,
                name: "Premium Filter System",
                price: 58.00,
                image: "../Assets/Products/3.jpg",
                category: "Filter",
                quantity: 2
            }
        ];
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('ecoFlowCart', JSON.stringify(cart));
}
// ========== END SECTION: CART STORAGE FUNCTIONS ==========

// ========== SECTION: EVENT HANDLERS SETUP ==========
function setupEventListeners() {
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) applyPromoBtn.addEventListener('click', applyPromoCode);

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', proceedToCheckout);

    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', continueShopping);

    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
    }

    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) cartIcon.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
}
// ========== END SECTION: EVENT HANDLERS SETUP ==========

// ========== SECTION: CART RENDERING FUNCTIONS ==========
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="Purchase.html" class="empty-cart-button">Start Shopping</a>
            </div>
        `;
        document.getElementById('subtotal-amount').textContent = '$0.00';
        document.getElementById('total-amount').textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item fade-in';
        cartItemElement.innerHTML = `
            <div class="product-info">
                <img src="../Assets/Products/1.jpg" alt="${item.name}" class="product-image">
                <div class="product-details">
                    <h3>${item.name}</h3>
                    <p>${item.category}</p>
                </div>
            </div>
            <div class="item-price">$${item.price.toFixed(2)}</div>
            <div class="quantity-selector">
                <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-id="${item.id}">
                <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            </div>
            <div class="item-subtotal">$${itemTotal.toFixed(2)}</div>
            <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });

    addCartItemEventListeners();
    updateCartSummary(subtotal);
}

function addCartItemEventListeners() {
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateItemQuantity(itemId, -1);
        });
    });

    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateItemQuantity(itemId, 1);
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            const newQuantity = parseInt(this.value);
            if (newQuantity > 0) {
                setItemQuantity(itemId, newQuantity);
            } else {
                this.value = 1;
                setItemQuantity(itemId, 1);
            }
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}
// ========== END SECTION: CART RENDERING FUNCTIONS ==========

// ========== SECTION: CART OPERATIONS ==========
function updateItemQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            saveCart();
            renderCart();
            updateCartCount();
        }
    }
}

function setItemQuantity(itemId, quantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = quantity;
        saveCart();
        renderCart();
        updateCartCount();
    }
}

function removeFromCart(itemId) {
    const cartItemElement = document.querySelector(`.cart-item .remove-btn[data-id="${itemId}"]`).closest('.cart-item');
    cartItemElement.style.transition = 'all 0.3s ease';
    cartItemElement.style.opacity = '0';
    cartItemElement.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        renderCart();
        updateCartCount();
    }, 300);
}
// ========== END SECTION: CART OPERATIONS ==========

// ========== SECTION: CART SUMMARY AND COUNT ==========
function updateCartSummary(subtotal) {
    document.getElementById('subtotal-amount').textContent = `$${subtotal.toFixed(2)}`;
    const tax = subtotal * TAX_RATE;
    const total = subtotal;
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCountElement.classList.add('pulse');
            setTimeout(() => {
                cartCountElement.classList.remove('pulse');
            }, 1000);
        }
    }
}
// ========== END SECTION: CART SUMMARY AND COUNT ==========

// ========== SECTION: PROMO CODE HANDLING ==========
function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    const promoCodes = {
        'ECO20': 0.20,
        'FLOW10': 0.10,
        'WELCOME': 0.15
    };
    
    if (promoCodes[promoCode]) {
        const subtotalElement = document.getElementById('subtotal-amount');
        const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
        const discount = subtotal * promoCodes[promoCode];
        const newTotal = subtotal - discount;
        
        document.getElementById('total-amount').textContent = `$${newTotal.toFixed(2)}`;
        showNotification('Promo code applied successfully!', 'success');
        
        const summarySection = document.querySelector('.summary-row.total').parentNode;
        const discountRow = document.createElement('div');
        discountRow.className = 'summary-row discount';
        discountRow.innerHTML = `
            <span>Discount (${promoCode})</span>
            <span>-$${discount.toFixed(2)}</span>
        `;
        
        const existingDiscountRow = document.querySelector('.summary-row.discount');
        if (existingDiscountRow) existingDiscountRow.remove();
        
        summarySection.insertBefore(discountRow, document.querySelector('.summary-row.total'));
        discountRow.style.color = '#2b9830';
        setTimeout(() => {
            discountRow.style.transition = 'background-color 1s ease';
            discountRow.style.backgroundColor = 'rgba(43, 152, 48, 0.1)';
        }, 100);
    } else {
        showNotification('Invalid promo code. Please try again.', 'error');
        promoInput.classList.add('error');
        setTimeout(() => {
            promoInput.classList.remove('error');
        }, 1000);
    }
}
// ========== END SECTION: PROMO CODE HANDLING ==========

// ========== SECTION: NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    notification.style.opacity = '1';
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}
// ========== END SECTION: NOTIFICATION SYSTEM ==========

// ========== SECTION: CHECKOUT AND NAVIGATION ==========
// ========== SECTION: CHECKOUT FUNCTIONALITY ==========
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty. Add items before checkout.', 'error');
        return;
    }
    
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.classList.add('disabled');
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(() => {
        showNotification('Redirecting to checkout...', 'success');
        
        // Save cart to localStorage before redirecting
        saveCart();
        
        // Redirect to checkout page after a short delay
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1500);
        
    }, 1000);
}
// ========== END SECTION: CHECKOUT FUNCTIONALITY ==========

function continueShopping(e) {
    e.preventDefault();
    window.location.href = 'Purchase.html';
}

function quickAddToCart(productId) {
    const products = [
        { id: 3, name: "Eco Flow Mini Filter", price: 80.00, image: "../Assets/Products/1.jpg", category: "Filter" },
        { id: 4, name: "Premium Sugar Cane Filter", price: 80.00, image: "../Assets/Products/2.jpg", category: "Filter" },
        { id: 5, name: "Advanced Eco Filter", price: 80.00, image: "../Assets/Products/3.jpg", category: "Filter" },
        { id: 6, name: "Complete Filter System", price: 80.00, image: "../Assets/Products/4.jpg", category: "Filter" }
    ];
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    saveCart();
    renderCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
    
    const cartIcon = document.querySelector('.cart-icon i');
    cartIcon.classList.add('pulse');
    setTimeout(() => {
        cartIcon.classList.remove('pulse');
    }, 1000);
}
// ========== END SECTION: CHECKOUT AND NAVIGATION ==========

// ========== SECTION: SCROLL AND THEME FUNCTIONS ==========
function setupScrollBehavior() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-switch input');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('ecoFlowTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('ecoFlowTheme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('ecoFlowTheme', 'light');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggle();
});
// ========== END SECTION: SCROLL AND THEME FUNCTIONS ==========

// ========== SECTION: DYNAMIC STYLES ==========
(function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            max-width: 300px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: opacity 0.3s ease;
            opacity: 0;
            display: none;
        }
        .notification.success { background-color: #2b9830; }
        .notification.error { background-color: #ff4b4b; }
        .notification.info { background-color: #3D6CE3; }
        
        @keyframes shake {
            0%, 100% {transform: translateX(0);}
            10%, 30%, 50%, 70%, 90% {transform: translateX(-5px);}
            20%, 40%, 60%, 80% {transform: translateX(5px);}
        }
        .error { animation: shake 0.6s ease-in-out; }
    `;
    document.head.appendChild(style);
})();
// ========== END SECTION: DYNAMIC STYLES ==========

