// Medication dispenser functionality
document.addEventListener('DOMContentLoaded', function() {
    let currentCategory = 'pain-relief';
    let cart = [];
    
    // Declare makeRequest function
    function makeRequest(url, options = {}) {
        return fetch(url, options)
            .then(response => response.json());
    }
    
    // Declare animateProgress function
    function animateProgress(elementId, duration) {
        const element = document.getElementById(elementId);
        let start = null;
        const step = timestamp => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.width = Math.min((progress / duration) * 100, 100) + '%';
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Category selection
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            loadMedications(currentCategory);
        });
    });
    
    // Dispense button
    document.getElementById('dispense-btn')?.addEventListener('click', dispenseItems);
    
    // Load initial medications
    loadMedications(currentCategory);
    
    function loadMedications(category) {
        makeRequest(`/api/medications/${category}`)
        .then(data => {
            displayMedications(data.medications);
            updateCategoryDescription(category);
        })
        .catch(error => {
            console.error('Error loading medications:', error);
        });
    }
    
    function displayMedications(medications) {
        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = '';
        
        medications.forEach(med => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-header">
                    <div class="product-info">
                        <h4>${med.name}</h4>
                        <p>${med.description}</p>
                    </div>
                    <div class="product-price">
                        <div class="price">$${med.price}</div>
                        <div class="stock">${med.stock} in stock</div>
                    </div>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${med.id}, '${med.name}', ${med.price})" ${med.stock === 0 ? 'disabled' : ''}>
                    Add to Cart
                </button>
            `;
            productsGrid.appendChild(productCard);
        });
    }
    
    function updateCategoryDescription(category) {
        const descriptions = {
            'pain-relief': 'Pain Relief',
            'cold-flu': 'Cold & Flu',
            'first-aid': 'First Aid',
            'digestive': 'Digestive Health',
            'allergy': 'Allergy Relief'
        };
        
        document.getElementById('category-description').textContent = descriptions[category] || '';
    }
    
    window.addToCart = function(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        
        updateCartDisplay();
    };
    
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartDisplay();
    }
    
    function updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const dispenseBtn = document.getElementById('dispense-btn');
        
        // Update count
        cartCount.textContent = cart.length;
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
        
        // Update items display
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Cart is empty</p>';
            dispenseBtn.disabled = true;
        } else {
            cartItems.innerHTML = '';
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-qty">Qty: ${item.quantity}</div>
                    </div>
                    <div class="cart-item-price">
                        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            dispenseBtn.disabled = false;
        }
    }
    
    window.removeFromCart = removeFromCart;
    
    function dispenseItems() {
        const modal = document.getElementById('dispensing-modal');
        modal?.classList.remove('hidden');
        
        // Animate progress
        animateProgress('dispensing-progress', 3000);
        
        // Make API call
        makeRequest('/api/dispense', {
            method: 'POST',
            body: JSON.stringify({ cart })
        })
        .then(data => {
            if (data.success) {
                setTimeout(() => {
                    modal?.classList.add('hidden');
                    cart = [];
                    updateCartDisplay();
                    alert('Items dispensed successfully!');
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Dispensing error:', error);
            modal?.classList.add('hidden');
            alert('Error dispensing items. Please try again.');
        });
    }
});
