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
    const fadeElements = document.querySelectorAll('.contact-left, .contact-right, .faq-left, .faq-right, .faq, .cta-content');
    
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    checkFade();
    // We'll call checkFade() again in scroll listener below
    // ======= End: Scroll Animation =======

    // ======= Start: Form Validation =======
    const contactForm = document.querySelector('.contact-right form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        let isValid = true;
        
        if (!nameField.value.trim()) {
            highlightField(nameField, true);
            isValid = false;
        } else {
            highlightField(nameField, false);
        }
        
        if (!validateEmail(emailField.value)) {
            highlightField(emailField, true);
            isValid = false;
        } else {
            highlightField(emailField, false);
        }
        
        if (isValid) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you! Your message has been submitted successfully.';
            successMessage.style.color = '#4CAF50';
            successMessage.style.marginTop = '20px';
            successMessage.style.fontWeight = 'bold';
            
            contactForm.appendChild(successMessage);
            contactForm.reset();
            
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
    });
    
    function highlightField(field, isError) {
        field.style.borderColor = isError ? '#ff4b4b' : '#ddd';
        field.style.backgroundColor = isError ? 'rgba(255, 75, 75, 0.05)' : '#f9f9f9';
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    // ======= End: Form Validation =======

    // ======= Start: Scroll to Top Button =======
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    // ======= End: Scroll to Top Button =======

    // ======= Start: Unified Scroll Handler =======
    const navbar = document.querySelector('.navbar');
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

});