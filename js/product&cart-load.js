// Event listener to load cart items after the page has fully loaded
document.addEventListener('DOMContentLoaded', function () {
    loadCartItems();
});

// Function to load and display cart items from local storage or session storage
function loadCartItems() {
    // Retrieve the current user's data from local storage, or if not available, from session storage
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(user => user.id === currentUser.id);

    // Get the container where cart items will be displayed
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear the container to prevent duplication of items

    // Get the checkout button by its ID
    let checkoutButton = document.getElementById('checkout-button');

    // Check if the user exists and has items in the cart
    if (user && user.cart && user.cart.length > 0) {
        user.cart.forEach(item => {
            // Create elements to display the cart item details
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';

            const productImage = document.createElement('img');
            productImage.src = `../${item.image}`; // Use relative path to the product image
            productImage.alt = item.name;
            productImage.className = 'product-image';

            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';

            const productTitle = document.createElement('p');
            productTitle.className = 'product-title';
            productTitle.textContent = `Product Name: ${item.name}`;

            const productPrice = document.createElement('p');
            productPrice.className = 'product-price';
            productPrice.textContent = `Price: ${item.price}`;

            const quantityContainer = document.createElement('div');
            quantityContainer.className = 'quantity-container';

            const quantityLabel = document.createElement('label');
            quantityLabel.className = 'quantity-label';
            quantityLabel.textContent = 'Quantity: ';

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.className = 'quantity-input';
            quantityInput.value = item.quantity;
            quantityInput.min = '1';
            quantityInput.addEventListener('change', function () {
                updateItemQuantity(item.productId, parseInt(quantityInput.value), user);
            });

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-btn';
            removeButton.textContent = 'Remove';
            removeButton.onclick = function () { removeFromCart(item.productId, user); };

            // Assemble the item details
            quantityContainer.appendChild(quantityLabel);
            quantityContainer.appendChild(quantityInput);

            itemDetails.appendChild(productTitle);
            itemDetails.appendChild(productPrice);
            itemDetails.appendChild(quantityContainer);
            itemDetails.appendChild(removeButton);

            itemElement.appendChild(productImage);
            itemElement.appendChild(itemDetails);

            cartItemsContainer.appendChild(itemElement);
        });
        checkoutButton.disabled = false; // Enable the checkout button if the cart has items
    } else {
        // Display message if the cart is empty
        const emptyCart = document.createElement('h1');
        emptyCart.textContent = 'Your cart is empty!';
        emptyCart.style.margin = "20px";
        emptyCart.style.textAlign = "left";
        emptyCart.style.color = "Red";
        cartItemsContainer.appendChild(emptyCart);

        checkoutButton.disabled = true; // Disable the checkout button if the cart is empty
    }
    // Update the total amount of the cart
    updateTotal(user);
}

// Updates the quantity of an item in the user's cart.
function updateItemQuantity(productId, newQuantity, user) {
    // Load the users array from local storage or default to an empty array if not found.
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // Find the index of the current user in the users array.
    let userIndex = users.findIndex(u => u.id === user.id);
    // Find the index of the specified product in the user's cart.
    let itemIndex = users[userIndex].cart.findIndex(item => item.productId === productId);

    // If the product is found in the cart, update its quantity.
    if (itemIndex !== -1) {
        users[userIndex].cart[itemIndex].quantity = newQuantity; // Set new quantity.
        localStorage.setItem('users', JSON.stringify(users)); // Persist the updated users array to local storage.
        updateTotal(users[userIndex]); // Recalculate the total cart value after quantity update.
    }
}

// Calculates and displays the total price for all items in the user's cart.
function updateTotal(user) {
    const cart = user.cart; // Access the user's cart array.
    let total = 0; // Initialize total cost variable.

    // Iterate over each item in the cart to calculate total cost.
    cart.forEach(item => {
        const priceNumber = parseFloat(item.price.replace('$', '')); // Convert price string to float and strip dollar sign.
        total += priceNumber * item.quantity; //  total cost of items.
    });

    // Update the displayed total cost in the UI.
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
}

// Removes an item from the user's cart.
function removeFromCart(productId, user) {
    // Load users array from local storage or default to an empty array.
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // Find the index of the current user in the users array.
    let userIndex = users.findIndex(u => u.id === user.id);
    // Remove the specified product from the user's cart using filter.
    users[userIndex].cart = users[userIndex].cart.filter(item => item.productId !== productId);

    // Save the updated users array back to local storage.
    localStorage.setItem('users', JSON.stringify(users));
    // Reload the UI to reflect changes in the cart.
    loadCartItems();
}
