document.addEventListener('DOMContentLoaded', async function () {
    // Attempt to fetch product data from a JSON file
    try {
        const response = await fetch('./products.json');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        populateProducts(data.bestSelling);
    } catch (error) {
        console.error('Error loading products:', error);
    }
    updateCartCount();  // Update the cart count on page load
});

function populateProducts(bestSellingData) {
    const bestSellingContainer = document.getElementById('bestSellingContainer');
    if (!bestSellingContainer) return; // Exit if the container doesn't exist

    bestSellingData.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const productImage = document.createElement('div');
        productImage.className = 'product-image';
        productImage.innerHTML = `
            <span class="discount-tag">${product.OnSale} off</span>
            <img src="${product.image}" class="product-thumb" alt="${product.name}">
            <button class="card-btn" id="addToCart${product.id}">Add to Cart</button>
        `;

        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        productInfo.innerHTML = `
            <h2 class="product-brand">${product.brand}</h2>
            <p class="product-short-description">${product.name}</p>
            <span class="price">${product.price}</span>
            <span class="actual-price">${product.actualPrice}</span>
        `;

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        bestSellingContainer.appendChild(productCard);

        document.getElementById(`addToCart${product.id}`).addEventListener('click', function () {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });
        });
    });
}

// Function to handle adding items to the shopping cart
function addToCart(product) {
    let currentUserJSON = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!currentUserJSON) {
        alert("You must be logged in to add items to your cart.");
        window.location.href = './login.html'; // Redirect to login if not logged in
        return;
    }

    // Parse the current user's data from JSON
    let currentUser = JSON.parse(currentUserJSON);
    // Retrieve the list of users from localStorage and parse it
    let users = JSON.parse(localStorage.getItem('users'));
    // Find the current user in the list of users based on their ID
    let user = users.find(user => user.id === currentUser.id);

    // Find the index of the product in the cart that matches the product ID
    let productIndex = user.cart.findIndex(item => item.productId === product.id);

    // Check if the product is already in the cart
    if (productIndex !== -1) {
        user.cart[productIndex].quantity += 1;  // Increment quantity if item already in cart
    } else {
        // If the product is not in the cart, add it with initial quantity of 1
        user.cart.push({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    }

    // Save the updated user data back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Call function to update the cart count display
    updateCartCount();
}

// Function to update the display of the cart count
function updateCartCount() {
    let currentUserJSON = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!currentUserJSON) {
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = '0';
        });
        return;
    }

    // Parse the current user's data from JSON
    let currentUser = JSON.parse(currentUserJSON);

    // Retrieve the list of users from localStorage and parse it
    let users = JSON.parse(localStorage.getItem('users'));

    // Find the current user in the list of users based on their ID
    let user = users.find(user => user.id === currentUser.id);

    // Calculate the total quantity of items in the user's cart
    const totalCount = user.cart.reduce((acc, item) => acc + item.quantity, 0); // starting count is 0

    // Update all elements with class 'cart-count' to display the total item count
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalCount.toString();
    });
}
