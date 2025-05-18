/**
 * EcoFlow Add to Cart Functionality
 * This file contains all the functions needed to manage the shopping cart
 * across Home, Purchase, and Cart pages.
 */

// ========== SECTION: CORE CART FUNCTIONS ==========

/**
 * Adds a product to the cart
 * @param {Object} product - The product to add to cart
 * @param {number} product.id - Product ID
 * @param {string} product.name - Product name
 * @param {number} product.price - Product price
 * @param {string} product.image - Product image URL
 * @param {string} product.category - Product category
 * @param {number} quantity - Quantity to add (default: 1)
 */
function addProductToCart(product, quantity = 1) {
    // Load current cart
    let cart = getCart();
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Update quantity if product already exists
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity
        });
    }
    
    // Save updated cart
    saveCart(cart);
    
    // Update cart count in UI
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
}

/**
 * Retrieves the cart from localStorage
 * @returns {Array} The cart array
 */
function getCart() {
    const savedCart = localStorage.getItem('ecoFlowCart');
    return savedCart ? JSON.parse(savedCart) : [];
}

/**
 * Saves the cart to localStorage
 * @param {Array} cart - The cart to save
 */
function saveCart(cart) {
    localStorage.setItem('ecoFlowCart', JSON.stringify(cart));
}

/**
 * Updates the cart count in the UI
 */
function updateCartCount() {
    const cart = getCart();
    const cartCount = document.getElementById('cartCount');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Add animation effect
        cartCount.classList.add('pulse');
        setTimeout(() => {
            cartCount.classList.remove('pulse');
        }, 300);
    }
}

/**
 * Removes a product from the cart
 * @param {number} productId - The ID of the product to remove
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
}

/**
 * Updates the quantity of a product in the cart
 * @param {number} productId - The ID of the product to update
 * @param {number} change - The amount to change the quantity by
 */
function updateItemQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            saveCart(cart);
            updateCartCount();
        }
    }
}

// ========== SECTION: PAGE-SPECIFIC FUNCTIONS ==========

/**
 * Add to cart from the Home page
 * @param {Event} event - The click event
 * @param {number} productId - The product ID
 */
function addToCartFromHome(event, productId) {
    event.stopPropagation(); // Prevent navigation to product page
    
    // Get product details from the DOM
    const productCard = event.target.closest('.product-card');
    const name = productCard.querySelector('.product-name').textContent;
    const category = productCard.querySelector('.product-category').textContent;
    const priceText = productCard.querySelector('.sale-price').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    const image = productCard.querySelector('img').src;
    
    // Create product object
    const product = {
        id: productId,
        name: name,
        price: price,
        image: image,
        category: category
    };
    
    // Add to cart
    addProductToCart(product);
}

/**
 * Add to cart from the Purchase page
 */
function addToCartFromPurchase() {
    // Get quantity from input
    const quantityInput = document.getElementById('quantityInput');
    const quantity = parseInt(quantityInput.value) || 1;
    
    // Get product details
    const productTitle = document.querySelector('.product-title').textContent;
    const category = document.querySelector('.categories a').textContent;
    const priceText = document.querySelector('.current-price').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    const image = document.getElementById('mainImage').src;
    
    // Create product object
    const product = {
        id: 1, // Main product is always ID 1 on the purchase page
        name: productTitle,
        price: price,
        image: image,
        category: category
    };
    
    // Add to cart
    addProductToCart(product, quantity);
}

/**
 * Quick add to cart from related products section
 * @param {number} productId - The product ID
 */
function quickAddToCart(productId) {
    // Find the product card
    const productCards = document.querySelectorAll('.product-card');
    const productCard = Array.from(productCards)[productId - 1];
    
    if (!productCard) return;
    
    // Get product details
    const name = productCard.querySelector('.product-name').textContent;
    const category = productCard.querySelector('.product-category').textContent;
    const priceText = productCard.querySelector('.discounted').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    const image = productCard.querySelector('.product-image').src;
    
    // Create product object
    const product = {
        id: productId,
        name: name,
        price: price,
        image: image,
        category: category
    };
    
    // Add to cart
    addProductToCart(product);
}

// ========== SECTION: UTILITY FUNCTIONS ==========

/**
 * Shows a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles if not already in CSS
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            }
            .notification {
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                opacity: 0;
                transform: translateX(50px);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            .notification.success {
                background-color: #4CAF50;
            }
            .notification.error {
                background-color: #F44336;
            }
            .notification.info {
                background-color: #2196F3;
            }
            .notification i {
                margin-right: 10px;
            }
            .pulse {
                animation: pulse 0.3s ease-in-out;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    notification.innerHTML = `${icon} ${message}`;
    notificationContainer.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize cart count when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Clear cart data on page refresh
    localStorage.removeItem('ecoFlowCart');
    
    updateCartCount();
    
    // Add event listeners for cart icons on Home page
    const productCarts = document.querySelectorAll('.product-cart');
    productCarts.forEach((cart, index) => {
        cart.addEventListener('click', (event) => {
            addToCartFromHome(event, index + 1);
        });
    });
    
    // Add event listener for add to cart button on Purchase page
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCartFromPurchase);
    }
    
    // Add event listeners for quantity buttons on Purchase page
    const decreaseBtn = document.querySelector('.quantity-btn:first-child');
    const increaseBtn = document.querySelector('.quantity-btn:nth-child(4)');
    const quantityInput = document.getElementById('quantityInput');
    
    if (decreaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (increaseBtn && quantityInput) {
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 1;
            quantityInput.value = currentValue + 1;
        });
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
        });
    }
    
    // Add event listeners for quick add to cart in related products
    const quickAddBtns = document.querySelectorAll('.add-to-cart-icon');
    quickAddBtns.forEach((btn) => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/\d+/);
            if (match) {
                const productId = parseInt(match[0]);
                btn.removeAttribute('onclick');
                btn.addEventListener('click', function() {
                    quickAddToCart(productId);
                });
            }
        }
    });
});