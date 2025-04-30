document.addEventListener('DOMContentLoaded', function() {
    // ======= Start: Mobile Menu Toggle =======
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.navbar').appendChild(mobileMenuBtn);
    
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    // ======= End: Mobile Menu Toggle =======

    // ======= Start: Scroll Animation =======
    const fadeElements = document.querySelectorAll('.feature-item, .products-container');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    checkFade(); // Initial check
    // ======= End: Scroll Animation =======

    // ======= Start: Cart Counter =======
    const cartCount = document.getElementById('cartCount');
    
    // Check if there's a saved cart count in localStorage
    if (localStorage.getItem('cartCount')) {
        cartCount.textContent = localStorage.getItem('cartCount');
    }
    
    // Add event listeners to product cart icons
    const productCartIcons = document.querySelectorAll('.product-cart');
    productCartIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const currentCount = parseInt(cartCount.textContent);
            const newCount = currentCount + 1;
            cartCount.textContent = newCount;
            
            // Save to localStorage
            localStorage.setItem('cartCount', newCount);
            
            // Animation effect
            cartCount.classList.add('pulse');
            setTimeout(() => {
                cartCount.classList.remove('pulse');
            }, 300);
        });
    });
    // ======= End: Cart Counter =======

    // ======= Start: Unified Scroll Handler =======
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.querySelector('.scroll-top');
    let lastScrollY = 0;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        // Navbar hide/show on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        // Navbar styling on scroll
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to top button visibility
        if (currentScrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }

        // Trigger fade-in animation
        checkFade();

        lastScrollY = currentScrollY;
    });
    // ======= End: Unified Scroll Handler =======

    // ======= Start: Scroll to Top Button Event =======
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    // ======= End: Scroll to Top Button Event =======

    // ======= Start: Smooth Scroll for Navigation Links =======
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only apply smooth scroll for links that point to sections on the same page
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            }
        });
    });
    // ======= End: Smooth Scroll for Navigation Links =======
});