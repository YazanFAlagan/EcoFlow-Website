document.addEventListener("DOMContentLoaded", function() {
    // Elements
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const cartCountElement = document.getElementById('cartCount');
    
    // Variables
    let lastScrollTop = 0;
    let currentTestimonial = 0;
    
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
    
    // Testimonial slider functionality
    function showTestimonial(index) {
        testimonialItems.forEach(item => {
            item.classList.remove('active');
        });
        
        testimonialDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        testimonialItems[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    // Initialize testimonials
    showTestimonial(0);
    
    // Auto-rotate testimonials
    setInterval(function() {
        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Manual testimonial navigation with dots
    testimonialDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showTestimonial(index);
        });
    });
    
    // Mobile menu toggle (if needed)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                }
            }
        }
    });
    
    // Get cart count from localStorage (if available)
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('ecoFlowCart')) || [];
        let count = 0;
        
        if (cart.length > 0) {
            count = cart.reduce((total, item) => total + item.quantity, 0);
        }
        
        cartCountElement.textContent = count;
    }
    
    // Initialize cart count
    updateCartCount();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation on scroll for various sections
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections that should animate on scroll
    document.querySelectorAll('.mission-content, .story-content, .team-member, .testimonial-content').forEach(section => {
        observer.observe(section);
    });
});
