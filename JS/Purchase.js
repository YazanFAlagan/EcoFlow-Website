// ========== Scroll-Based Animations ==========
document.addEventListener('DOMContentLoaded', function () {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let scrollTopBtn = document.querySelector('.scroll-top');

    checkVisibility();

    window.addEventListener('scroll', function () {
        checkVisibility();

        const currentScrollY = window.scrollY;

        // Show/hide scroll-to-top button
        if (currentScrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        // Add/remove navbar scroll styling
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
    });

    // Scroll to top button functionality
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Check which elements are in viewport
    function checkVisibility() {
        const windowHeight = window.innerHeight;

        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // ========== Product Card Hover Effects ==========
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.classList.add('hover-effect');
        });

        card.addEventListener('mouseleave', function () {
            this.classList.remove('hover-effect');
        });
    });
    // ========== End Product Card Hover Effects ==========

    // ========== FAQ Toggle Effect ==========
    const faqItems = document.querySelectorAll('.faq');
    faqItems.forEach(item => {
        item.addEventListener('click', function () {
            faqItems.forEach(faq => {
                if (faq !== this) faq.classList.remove('active');
            });

            this.classList.toggle('active');
        });
    });
    // ========== End FAQ Toggle Effect ==========
});
// ========== End Scroll-Based Animations ==========


// ========== Offer Countdown Timer ==========
function startCountdown() {
    const countdownElement = document.getElementById('offer-countdown');
    if (!countdownElement) return;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);

    const countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const distance = endDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "Offer expired!";
        }
    }, 1000);
}
// ========== End Offer Countdown Timer ==========


// ========== Image Zoom & Thumbnail Switcher ==========
function setupImageZoom() {
    const mainImage = document.querySelector('.main-image');
    const magnifyIcon = document.querySelector('.magnify-icon');

    if (mainImage && magnifyIcon) {
        magnifyIcon.addEventListener('click', function () {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <img src="${mainImage.src}" class="modal-image">
                </div>
            `;

            document.body.appendChild(modal);

            const closeButton = modal.querySelector('.close-modal');
            closeButton.addEventListener('click', function () {
                document.body.removeChild(modal);
            });

            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        });
    }

    const thumbnails = document.querySelectorAll('.thumbnail');
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function () {
                mainImage.src = this.src;
                thumbnails.forEach(t => t.classList.remove('active-thumbnail'));
                this.classList.add('active-thumbnail');
            });
        });
    }
}
// ========== End Image Zoom & Thumbnail Switcher ==========


// ========== Initialize on Page Load ==========
window.addEventListener('DOMContentLoaded', function () {
    startCountdown();
    setupImageZoom();
});
// ========== End Initialize ==========

// Cart functionality
let cartItems = [];

// Check if there are items in localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage if they exist
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
        cartItems = JSON.parse(savedCartItems);
        updateCartCount();
    }
    
    // Set up click event on product cards' cart icons
    const quickAddButtons = document.querySelectorAll('.add-to-cart-icon');
    quickAddButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.discounted').textContent;
            const productImage = productCard.querySelector('.product-image').src;
            
            addProductToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        });
    });
});

// Function to increment quantity
function increaseQuantity() {
    const quantityInput = document.getElementById('quantityInput');
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = isNaN(currentValue) ? 1 : currentValue + 1;
}

// Function to decrement quantity
function decreaseQuantity() {
    const quantityInput = document.getElementById('quantityInput');
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

// Add product to cart from the main product display
function addToCart() {
    const quantityInput = document.getElementById('quantityInput');
    const quantity = parseInt(quantityInput.value);
    
    if (isNaN(quantity) || quantity < 1) {
        alert('Please enter a valid quantity');
        return;
    }
    
    const productName = document.querySelector('.product-title').textContent;
    const productPrice = document.querySelector('.current-price').textContent;
    const productImage = document.getElementById('mainImage').src;
    
    addProductToCart({
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity
    });
    
    // Show confirmation message
    const confirmMessage = document.createElement('div');
    confirmMessage.className = 'add-to-cart-confirmation';
    confirmMessage.innerHTML = `
        <div class="confirmation-content">
            <i class="fas fa-check-circle"></i>
            <p>${productName} has been added to your cart!</p>
            <button onclick="this.parentElement.parentElement.remove()">Continue Shopping</button>
            <a href="Cart.html" class="view-cart-btn">View Cart</a>
        </div>
    `;
    document.body.appendChild(confirmMessage);
    
    // Remove confirmation after 5 seconds
    setTimeout(() => {
        if (confirmMessage.parentNode) {
            confirmMessage.remove();
        }
    }, 5000);
}

// Quick add to cart from related products
function quickAddToCart(productId) {
    const productCard = document.querySelectorAll('.product-card')[productId - 1];
    if (!productCard) return;
    
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.discounted').textContent;
    const productImage = productCard.querySelector('.product-image').src;
    
    addProductToCart({
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    });
    
    // Show quick confirmation
    const quickConfirm = document.createElement('div');
    quickConfirm.className = 'quick-add-confirmation';
    quickConfirm.textContent = 'Added to cart!';
    productCard.appendChild(quickConfirm);
    
    setTimeout(() => {
        if (quickConfirm.parentNode) {
            quickConfirm.remove();
        }
    }, 2000);
}

// Common function to add products to cart
function addProductToCart(product) {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => 
        item.name === product.name && item.price === product.price
    );
    
    if (existingItemIndex > -1) {
        // Increase quantity if product already exists
        cartItems[existingItemIndex].quantity += product.quantity;
    } else {
        // Add new product to cart
        cartItems.push(product);
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart count display
    updateCartCount();
}

// Update the cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        // Calculate total quantity across all items
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Make the count visible
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}


