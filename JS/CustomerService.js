document.addEventListener('DOMContentLoaded', function() {

   

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
})
    // ======= End: Form Validation =======