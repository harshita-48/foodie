document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    }

    // Display foods
    function displayFoods() {
        Object.keys(foods).forEach(category => {
            const container = document.getElementById(`${category}-foods`);
            foods[category].forEach(food => {
                const foodItem = createFoodItem(food);
                container.appendChild(foodItem);
            });
        });
    }

    function createFoodItem(food) {
        const div = document.createElement('div');
        div.className = 'food-item';
        div.innerHTML = `
            <img src="${food.image}" alt="${food.name}" class="food-image">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-price">₹${food.price.toFixed(0)}</div>
                <div class="food-rating">★ ${food.rating}</div>
                <button class="add-btn" data-id="${food.id}">Add to Cart</button>
                <button class="favorite-btn" data-id="${food.id}">♥ Favorite</button>
            </div>
        `;
        div.addEventListener('click', () => showFoodModal(food));
        return div;
    }

    // Modal
    const modal = document.getElementById('food-modal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', () => modal.style.display = 'none');

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    function showFoodModal(food) {
        const details = document.getElementById('food-details');
        details.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <h3>${food.name}</h3>
            <p><strong>Price:</strong> ₹${food.price.toFixed(0)}</p>
            <p><strong>Rating:</strong> ★ ${food.rating}</p>
            <p>${food.description}</p>
            <button class="add-btn" data-id="${food.id}">Add to Cart</button>
            <button class="favorite-btn" data-id="${food.id}">♥ Favorite</button>
        `;
        modal.style.display = 'block';
    }

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCart(id);
        } else if (e.target.classList.contains('favorite-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            toggleFavorite(id);
        }
    });

    function addToCart(id) {
        const food = findFoodById(id);
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...food, quantity: 1 });
        }
        saveCart();
        updateCartDisplay();
        alert(`${food.name} added to cart!`);
    }

    function toggleFavorite(id) {
        const index = favorites.indexOf(id);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(id);
        }
        saveFavorites();
        updateFavoritesDisplay();
    }

    function findFoodById(id) {
        for (const category in foods) {
            const food = foods[category].find(f => f.id === id);
            if (food) return food;
        }
        return null;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toFixed(0)}</span>
            `;
            cartItems.appendChild(div);
            total += item.price * item.quantity;
        });
        document.getElementById('total-price').textContent = total.toFixed(0);
    }

    function updateFavoritesDisplay() {
        const favoritesList = document.getElementById('favorites-list');
        favoritesList.innerHTML = '';
        favorites.forEach(id => {
            const food = findFoodById(id);
            if (food) {
                const foodItem = createFoodItem(food);
                favoritesList.appendChild(foodItem);
            }
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const query = searchInput.value.toLowerCase();
        const allFoods = document.querySelectorAll('.food-item');
        allFoods.forEach(item => {
            const name = item.querySelector('.food-name').textContent.toLowerCase();
            if (name.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        showSection('home');
    }

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            alert('Order placed successfully!');
            cart = [];
            saveCart();
            updateCartDisplay();
        }
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (in a real app, this would be server-side)
        if (username && password) {
            alert('Login successful! Welcome, ' + username);
            // Here you could redirect or update the UI
        } else {
            alert('Please enter both username and password.');
        }
    });

    document.getElementById('signup-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Sign up functionality would be implemented here.');
    });

    // Initialize
    displayFoods();
    updateCartDisplay();
    updateFavoritesDisplay();
});