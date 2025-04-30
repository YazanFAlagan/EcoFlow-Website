// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", function() {
    // Elements
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const navLinks = document.querySelector('.nav-links');
    
    // Ensure cart icon exists
    let cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon || cartIcon.innerHTML.trim() === '') {
        // If cart icon doesn't exist or is empty, create it
        if (!cartIcon) {
            cartIcon = document.createElement('div');
            cartIcon.className = 'cart-icon';
            navbar.appendChild(cartIcon);
        }
        
        // Add cart content if empty
        if (cartIcon.innerHTML.trim() === '') {
            cartIcon.innerHTML = '<a href="../HTML/Cart.html" title="View Cart"><i class="fas fa-shopping-cart"></i></a><span class="cart-count" id="cartCount">0</span>';
        }
    }
    
    // Check if mobile menu button exists, if not create it
    let mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (!mobileMenuBtn) {
        // Create mobile menu button
        mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert the button at the end of the navbar
        navbar.appendChild(mobileMenuBtn);
    }
    
    // Variables
    let lastScrollTop = 0;
    let menuOpen = false;
    
    // Ensure navigation links exist and are properly structured
    const ensureNavLinks = function() {
        // Check if we're on mobile view
        if (window.innerWidth <= 768) {
            // Get all current links
            const currentLinks = navLinks.querySelectorAll('a');
            const linkTexts = Array.from(currentLinks).map(link => link.textContent.trim());
            
            // Check if we need to add any missing links
            const requiredLinks = ['Home', 'About Us', 'Customer Service'];
            const linkPaths = ['../HTML/Home.html', '../HTML/AboutUs.html', '../HTML/CustomerService.html'];
            
            // Add any missing links
            requiredLinks.forEach((text, index) => {
                if (!linkTexts.includes(text)) {
                    const newLink = document.createElement('a');
                    newLink.href = linkPaths[index];
                    newLink.textContent = text;
                    
                    // Set active class if current page matches link
                    if (window.location.href.includes(linkPaths[index])) {
                        newLink.classList.add('active');
                    }
                    
                    navLinks.appendChild(newLink);
                }
            });
            
            // Add mobile cart if it doesn't exist
            if (!document.querySelector('.mobile-cart')) {
                const mobileCart = document.createElement('div');
                mobileCart.className = 'mobile-cart';
                mobileCart.innerHTML = cartIcon.innerHTML;
                navLinks.appendChild(mobileCart);
            }
        } else if (window.innerWidth > 768 && document.querySelector('.mobile-cart')) {
            // Remove mobile cart when not on mobile
            const mobileCart = document.querySelector('.mobile-cart');
            if (mobileCart) {
                mobileCart.remove();
            }
        }
    };
    
    // Function to handle mobile cart visibility
    function handleMobileCart() {
        // Check if we're on mobile view
        if (window.innerWidth <= 768) {
            // Ensure mobile cart exists in nav menu
            if (!document.querySelector('.mobile-cart')) {
                const mobileCart = document.createElement('div');
                mobileCart.className = 'mobile-cart';
                mobileCart.innerHTML = cartIcon.innerHTML;
                navLinks.appendChild(mobileCart);
            }
        } else if (window.innerWidth > 768 && document.querySelector('.mobile-cart')) {
            // Remove mobile cart when not on mobile
            const mobileCart = document.querySelector('.mobile-cart');
            if (mobileCart) {
                mobileCart.remove();
            }
        }
    }
    
    // Call handleMobileCart on page load
    handleMobileCart();
    
    // Mobile menu toggle functionality
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuOpen = !menuOpen;
        
        // Change icon based on menu state
        this.innerHTML = menuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbar.contains(event.target);
        
        if (menuOpen && !isClickInsideNav) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            menuOpen = false;
        }
    });
    
    // Combined resize event listener
    window.addEventListener('resize', function() {
        // Handle mobile cart
        handleMobileCart();
        
        // Close menu when window is resized above mobile breakpoint
        if (window.innerWidth > 768 && menuOpen) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            menuOpen = false;
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar appearance change on scroll
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
        
        // Show/hide scroll to top button
        if (scrollTop > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});