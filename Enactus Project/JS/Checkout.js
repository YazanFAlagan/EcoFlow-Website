
document.addEventListener('DOMContentLoaded', function() {
    // ========== SECTION: DOM ELEMENT REFERENCES ==========
    // Checkout process steps and containers
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.checkout-step-content');
    
    // Navigation buttons between checkout steps
    const backToCartBtn = document.getElementById('back-to-cart-btn');
    const toPaymentBtn = document.getElementById('to-payment-btn');
    const backToShippingBtn = document.getElementById('back-to-shipping-btn');
    const toReviewBtn = document.getElementById('to-review-btn');
    const backToPaymentBtn = document.getElementById('back-to-payment-btn');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const editBtns = document.querySelectorAll('.edit-btn');
    
    // Payment method selection elements
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentContents = document.querySelectorAll('.payment-method-content');
    
    // Billing address toggle
    const sameAsShippingCheckbox = document.getElementById('sameAsShipping');
    const billingAddressForm = document.getElementById('billing-address-form');
    
    // Terms and conditions
    const termsAgreeCheckbox = document.getElementById('termsAgree');
    
    // Promo code elements
    const promoCodeInput = document.getElementById('promo-code');
    const applyPromoBtn = document.getElementById('apply-promo-code');
    const appliedPromoDiv = document.getElementById('applied-promo');
    const removePromoBtn = document.getElementById('remove-promo');
    const appliedPromoCode = document.getElementById('applied-promo-code');
    const promoDiscountAmount = document.getElementById('promo-discount-amount');
    
    // Order summary elements
    const cartCountSpan = document.getElementById('cartCount');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryDiscountRow = document.getElementById('summary-discount-row');
    const summaryDiscount = document.getElementById('summary-discount');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');
    
    // Order review elements
    const reviewSubtotal = document.getElementById('review-subtotal');
    const reviewShipping = document.getElementById('review-shipping');
    const discountRow = document.getElementById('discount-row');
    const reviewDiscount = document.getElementById('review-discount');
    const reviewTax = document.getElementById('review-tax');
    const reviewTotal = document.getElementById('review-total');
    
    // Order confirmation elements
    const orderNumber = document.getElementById('order-number');
    const confirmationEmail = document.getElementById('confirmation-email');
    const deliveryDate = document.getElementById('delivery-date');
    const confirmationAddress = document.getElementById('confirmation-address');
    // ========== END SECTION: DOM ELEMENT REFERENCES ==========
    
        // ========== SECTION: SAMPLE DATA ==========
        const cartItems = [
            {
                id: 1,
                name: "Eco-Friendly Water Bottle",
                image: "../Assets/Products/1.jpg",
                price: 25.99,
                quantity: 2,
                variant: "Blue, 750ml"
            },
            {
                id: 2,
                name: "Bamboo Toothbrush Set",
                image: "../Assets/Products/2.jpg",
                price: 12.50,
                quantity: 1,
                variant: "Medium Bristle"
            },
            {
                id: 3,
                name: "Reusable Shopping Bag",
                image: "../Assets/Products/3.jpg",
                price: 8.99,
                quantity: 3,
                variant: "Large, Green"
            }
        ];
        // ========== END SECTION: SAMPLE DATA ==========
    
        // ========== SECTION: INITIALIZATION ==========
        function init() {
            populateOrderSummary();
            updateCartCount();
            updateOrderTotals();
            setupEventListeners();
        }
        // ========== END SECTION: INITIALIZATION ==========
    
        // ========== SECTION: EVENT LISTENERS ==========
        function setupEventListeners() {
            if (backToCartBtn) backToCartBtn.addEventListener('click', () => { window.location.href = 'cart.html'; });
            if (toPaymentBtn) toPaymentBtn.addEventListener('click', goToPayment);
            if (backToShippingBtn) backToShippingBtn.addEventListener('click', () => { goToStep(1); });
            if (toReviewBtn) toReviewBtn.addEventListener('click', goToReview);
            if (backToPaymentBtn) backToPaymentBtn.addEventListener('click', () => { goToStep(2); });
            if (placeOrderBtn) placeOrderBtn.addEventListener('click', placeOrder);
            
            editBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const stepNumber = parseInt(this.getAttribute('data-step'));
                    goToStep(stepNumber);
                });
            });
            
            paymentTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const method = this.getAttribute('data-method');
                    selectPaymentMethod(method);
                });
            });
            
            if (sameAsShippingCheckbox) {
                sameAsShippingCheckbox.addEventListener('change', function() {
                    billingAddressForm.classList.toggle('hidden', this.checked);
                });
            }
            
            if (applyPromoBtn) applyPromoBtn.addEventListener('click', applyPromoCode);
            if (removePromoBtn) removePromoBtn.addEventListener('click', removePromoCode);
            
            const shippingMethods = document.querySelectorAll('input[name="shippingMethod"]');
            shippingMethods.forEach(method => {
                method.addEventListener('change', updateShippingMethod);
            });
            
            const cardNumberInput = document.getElementById('cardNumber');
            if (cardNumberInput) {
                cardNumberInput.addEventListener('input', formatCardNumber);
            }
            
            const expDateInput = document.getElementById('expDate');
            if (expDateInput) {
                expDateInput.addEventListener('input', formatExpDate);
            }
            
            const scrollTopBtn = document.querySelector('.scroll-top');
            if (scrollTopBtn) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 300) {
                        scrollTopBtn.classList.add('show');
                    } else {
                        scrollTopBtn.classList.remove('show');
                    }
                });
                
                scrollTopBtn.addEventListener('click', function() {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
            
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                });
            }
        }
        // ========== END SECTION: EVENT LISTENERS ==========
    
        // ========== SECTION: STEP NAVIGATION ==========
        function goToStep(stepNumber) {
            steps.forEach(step => {
                const currentStepNumber = parseInt(step.getAttribute('data-step'));
                step.classList.remove('active', 'completed');
                
                if (currentStepNumber < stepNumber) {
                    step.classList.add('completed');
                } else if (currentStepNumber === stepNumber) {
                    step.classList.add('active');
                }
            });
            
            stepContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`step-${stepNumber}`).classList.add('active');
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        // ========== END SECTION: STEP NAVIGATION ==========
    
        // ========== SECTION: FORM VALIDATION & NAVIGATION ==========
        function goToPayment() {
            const shippingForm = document.getElementById('shipping-form');
            const requiredFields = shippingForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ff4b4b';
                    isValid = false;
                } else {
                    field.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                goToStep(2);
                populateReviewShippingInfo();
            } else {
                showNotification('Please fill in all required fields', 'error');
            }
        }
        
        function goToReview() {
            const paymentForm = document.getElementById('payment-form');
            const activeMethod = document.querySelector('.payment-tab.active').getAttribute('data-method');
            let isValid = true;
            
            if (activeMethod === 'credit-card') {
                const requiredFields = document.querySelectorAll('#credit-card [required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = '#ff4b4b';
                        isValid = false;
                    } else {
                        field.style.borderColor = '#ddd';
                    }
                });
            }
            
            if (isValid) {
                goToStep(3);
                populateReviewPaymentInfo();
                populateOrderItemsReview();
            } else {
                showNotification('Please fill in all required fields', 'error');
            }
        }
        
        function placeOrder() {
            if (!termsAgreeCheckbox.checked) {
                showNotification('Please agree to the Terms & Conditions', 'error');
                return;
            }
            
            stepContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const randomOrderNumber = 'ECO-' + Math.floor(10000 + Math.random() * 90000);
            orderNumber.textContent = randomOrderNumber;
            
            const emailInput = document.getElementById('email');
            if (emailInput) {
                confirmationEmail.textContent = emailInput.value;
            }
            
            const today = new Date();
            const deliveryStart = new Date(today);
            deliveryStart.setDate(today.getDate() + 5);
            const deliveryEnd = new Date(today);
            deliveryEnd.setDate(today.getDate() + 10);
            
            const options = { month: 'long', day: 'numeric' };
            deliveryDate.textContent = `${deliveryStart.toLocaleDateString('en-US', options)} - ${deliveryEnd.toLocaleDateString('en-US', options)}`;
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const zipCode = document.getElementById('zipCode').value;
            const country = document.getElementById('country').value;
            confirmationAddress.textContent = `${firstName} ${lastName}, ${address}, ${city}, ${zipCode}, ${country}`;
            
            document.getElementById('order-confirmation').classList.add('active');
        }
        // ========== END SECTION: FORM VALIDATION & NAVIGATION ==========
    
        // ========== SECTION: PAYMENT METHODS ==========
        function selectPaymentMethod(method) {
            paymentTabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('data-method') === method) {
                    tab.classList.add('active');
                }
            });
            
            paymentContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(method).classList.add('active');
        }
        // ========== END SECTION: PAYMENT METHODS ==========
    
        // ========== SECTION: ORDER SUMMARY ==========
        function populateOrderSummary() {
            const summaryItemsContainer = document.getElementById('summary-items');
            if (!summaryItemsContainer) return;
            
            summaryItemsContainer.innerHTML = '';
            
            cartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'summary-item';
                
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="summary-item-image">
                    <div class="summary-item-details">
                        <div class="summary-item-name">${item.name}</div>
                        <div class="summary-item-variant">${item.variant}</div>
                        <div class="summary-item-qty">Qty: ${item.quantity}</div>
                    </div>
                    <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                `;
                
                summaryItemsContainer.appendChild(itemElement);
            });
        }
        
        function updateCartCount() {
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            cartCountSpan.textContent = totalItems;
        }
        
        function updateOrderTotals() {
            const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shippingMethodRadio = document.querySelector('input[name="shippingMethod"]:checked');
            let shippingCost = 0;
            
            if (shippingMethodRadio) {
                switch (shippingMethodRadio.value) {
                    case 'express':
                        shippingCost = 12;
                        break;
                    case 'overnight':
                        shippingCost = 25;
                        break;
                    default:
                        shippingCost = 0;
                }
            }
            
            const isPromoApplied = !appliedPromoDiv.classList.contains('hidden');
            let discount = 0;
            
            if (isPromoApplied) {
                discount = parseFloat(promoDiscountAmount.textContent.replace('-$', ''));
            }
            
            const tax = (subtotal - discount) * 0.07;
            const total = subtotal + shippingCost - discount + tax;
            
            summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
            summaryShipping.textContent = shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`;
            summaryTax.textContent = `$${tax.toFixed(2)}`;
            summaryTotal.textContent = `$${total.toFixed(2)}`;
            
            if (isPromoApplied) {
                summaryDiscountRow.classList.remove('hidden');
                summaryDiscount.textContent = `-$${discount.toFixed(2)}`;
            } else {
                summaryDiscountRow.classList.add('hidden');
            }
            
            if (reviewSubtotal) {
                reviewSubtotal.textContent = `$${subtotal.toFixed(2)}`;
                reviewShipping.textContent = shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`;
                reviewTax.textContent = `$${tax.toFixed(2)}`;
                reviewTotal.textContent = `$${total.toFixed(2)}`;
                
                if (isPromoApplied) {
                    discountRow.classList.remove('hidden');
                    reviewDiscount.textContent = `-$${discount.toFixed(2)}`;
                } else {
                    discountRow.classList.add('hidden');
                }
            }
        }
        // ========== END SECTION: ORDER SUMMARY ==========
    
        // ========== SECTION: REVIEW PAGE POPULATION ==========
        function populateReviewShippingInfo() {
            const shippingInfoReview = document.getElementById('shipping-info-review');
            if (!shippingInfoReview) return;
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const zipCode = document.getElementById('zipCode').value;
            const country = document.getElementById('country').options[document.getElementById('country').selectedIndex].text;
            const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked').nextElementSibling.querySelector('.shipping-name').textContent;
            
            shippingInfoReview.innerHTML = `
                <p><strong>${firstName} ${lastName}</strong></p>
                <p>${address}</p>
                <p>${city}, ${zipCode}</p>
                <p>${country}</p>
                <p>${email}</p>
                <p>${phone}</p>
                <p><strong>Shipping Method:</strong> ${shippingMethod}</p>
            `;
        }
        
        function populateReviewPaymentInfo() {
            const paymentInfoReview = document.getElementById('payment-info-review');
            if (!paymentInfoReview) return;
            
            const activeMethod = document.querySelector('.payment-tab.active').getAttribute('data-method');
            
            if (activeMethod === 'credit-card') {
                const cardName = document.getElementById('cardName').value;
                const cardNumber = document.getElementById('cardNumber').value;
                const lastFourDigits = cardNumber.replace(/\s/g, '').slice(-4);
                
                paymentInfoReview.innerHTML = `
                    <p><strong>Credit Card</strong></p>
                    <p>${cardName}</p>
                    <p>Card ending in ${lastFourDigits}</p>
                    ${sameAsShippingCheckbox.checked ? '<p><strong>Billing Address:</strong> Same as shipping</p>' : ''}
                `;
            } else if (activeMethod === 'paypal') {
                paymentInfoReview.innerHTML = `
                    <p><strong>PayPal</strong></p>
                    <p>You will be redirected to PayPal to complete payment upon order submission.</p>
                `;
            } else if (activeMethod === 'apple-pay') {
                paymentInfoReview.innerHTML = `
                    <p><strong>Apple Pay</strong></p>
                    <p>You will be prompted to authenticate your Apple Pay payment upon order submission.</p>
                `;
            }
        }
        
        function populateOrderItemsReview() {
            const orderItemsReview = document.getElementById('order-items');
            if (!orderItemsReview) return;
            
            orderItemsReview.innerHTML = '';
            
            cartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'review-item';
                
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="review-item-image">
                    <div class="review-item-details">
                        <div class="review-item-name">${item.name}</div>
                        <div class="review-item-variant">${item.variant}</div>
                        <div class="review-item-qty">Qty: ${item.quantity}</div>
                    </div>
                    <div class="review-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                `;
                
                orderItemsReview.appendChild(itemElement);
            });
        }
        // ========== END SECTION: REVIEW PAGE POPULATION ==========
    
        // ========== SECTION: PROMO CODE HANDLING ==========
        function applyPromoCode() {
            const promoCode = promoCodeInput.value.trim().toUpperCase();
            
            if (!promoCode) {
                showNotification('Please enter a promo code', 'error');
                return;
            }
            
            const validPromoCodes = {
                'ECO20': 20.00,
                'WELCOME10': 10.00,
                'FREESHIP': 12.00
            };
            
            if (validPromoCodes[promoCode]) {
                appliedPromoCode.textContent = promoCode;
                promoDiscountAmount.textContent = `-$${validPromoCodes[promoCode].toFixed(2)}`;
                
                promoCodeInput.value = '';
                promoForm.classList.add('hidden');
                appliedPromoDiv.classList.remove('hidden');
                
                updateOrderTotals();
                showNotification(`Promo code ${promoCode} applied successfully!`, 'success');
            } else {
                showNotification('Invalid promo code', 'error');
            }
        }
        
        function removePromoCode() {
            appliedPromoDiv.classList.add('hidden');
            promoForm.classList.remove('hidden');
            updateOrderTotals();
            showNotification('Promo code removed', 'info');
        }
        // ========== END SECTION: PROMO CODE HANDLING ==========
    
        // ========== SECTION: UTILITY FUNCTIONS ==========
        function updateShippingMethod() {
            updateOrderTotals();
        }
        
        function formatCardNumber(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
            
            const cardIcons = document.querySelectorAll('.card-icons i');
            cardIcons.forEach(icon => icon.classList.remove('active'));
            
            const firstDigit = value.charAt(0);
            if (firstDigit === '4') {
                document.querySelector('.fa-cc-visa').classList.add('active');
            } else if (['5','2'].includes(firstDigit)) {
                document.querySelector('.fa-cc-mastercard').classList.add('active');
            } else if (['3'].includes(firstDigit)) {
                document.querySelector('.fa-cc-amex').classList.add('active');
            }
        }
        
        function formatExpDate(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            e.target.value = value;
        }
        
        function showNotification(message, type = 'info') {
            let notification = document.querySelector('.notification');
            
            if (!notification) {
                notification = document.createElement('div');
                notification.className = 'notification';
                document.body.appendChild(notification);
                
                notification.style.position = 'fixed';
                notification.style.top = '20px';
                notification.style.right = '20px';
                notification.style.padding = '15px 20px';
                notification.style.borderRadius = '4px';
                notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                notification.style.transition = 'all 0.3s ease';
                notification.style.zIndex = '1000';
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
            }
            
            if (type === 'success') {
                notification.style.backgroundColor = '#2b9830';
                notification.style.color = 'white';
            } else if (type === 'error') {
                notification.style.backgroundColor = '#ff4b4b';
                notification.style.color = 'white';
            } else if (type === 'info') {
                notification.style.backgroundColor = '#3D6CE3';
                notification.style.color = 'white';
            }
            
            notification.textContent = message;
            
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
            }, 3000);
        }
        // ========== END SECTION: UTILITY FUNCTIONS ==========
    
        // Initialize the page
        init();
        
    });

    