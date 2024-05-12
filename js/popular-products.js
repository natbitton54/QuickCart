// Event listener to run the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch the products data from a JSON file
        const response = await fetch('./products.json');
        const data = await response.json();
        // Access the array of popular products
        const popularProducts = data.PopularProducts;
        // Find the container to append product cards to
        const container = document.getElementById('popularProductsContainer');

        // Loop through each product in the popular products array
        popularProducts.forEach((product, index) => {
            // Create a card element for each product
            const card = document.createElement('div');
            card.className = 'card';

            // Create an image container with overlay options
            const imgContainer = document.createElement('div');
            imgContainer.className = 'img-container';
            imgContainer.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="overlay">
                    <button class="overlay-icon" id="heart"><i class="far fa-heart"></i></button>
                    <button class="overlay-icon" id="shop">QUICK SHOP</button>
                    <button class="overlay-icon" id="rng"><i class="fal fa-random"></i></button>
                </div>
            `;

            // Create a description container for each product
            const cardDesc = document.createElement('div');
            cardDesc.className = 'card-desc';
            cardDesc.innerHTML = `
                <div class="color">
                    <div class="yellow"></div>
                    <div class="grey"></div>
                    <div the "pink"></div>
                    <div class="red"></div>
                    <div class="one">+1</div>
                </div>
                <div class="wrapper">
                    <p>${product.name}</p>
                    <div class="star">
                        <!-- Add stars dynamically if needed -->
                    </div>
                </div>
                <small>${product.price}</small>
                <button id="add-to-cart-${index}" class="cart-btn">Add to Cart</button>
            `;

            // Append the image and description containers to the card
            card.appendChild(imgContainer);
            card.appendChild(cardDesc);
            container.appendChild(card);

            // Add event listener to the 'Add to Cart' button
            document.getElementById(`add-to-cart-${index}`).addEventListener('click', function () {
                addToCart(product);
            });
        });
    } catch (error) {
        // Log any errors during the fetch operation
        console.error('Error fetching data:', error);
    }
    // Update cart count after setting up the products
    updateCartCount();
});

// Function to add a product to the shopping cart
function addToCart(product) {
    // Retrieve the current user data from storage
    let currentUserJSON = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!currentUserJSON) {
        alert("You must be logged in to add items to your cart.");
        window.location.href = './login.html';
        return;
    }

    // Parse the current user data and retrieve users list
    let currentUser = JSON.parse(currentUserJSON);
    let users = JSON.parse(localStorage.getItem('users'));
    let user = users.find(user => user.id === currentUser.id);

    // Check if the product is already in the user's cart and update accordingly
    let productIndex = user.cart.findIndex(item => item.productId === product.id);
    if (productIndex !== -1) {
        user.cart[productIndex].quantity += 1;
    } else {
        user.cart.push({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    }

    // Save the updated users data back to local storage
    localStorage.setItem('users', JSON.stringify(users));
    // Update cart count after adding a product
    updateCartCount();
}

// Function to update the total count of items in the cart and display it
function updateCartCount() {
    // Retrieve the current user data from storage
    let currentUserJSON = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!currentUserJSON) {
        // If no user data found, set cart count display to '0'
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = '0';
        });
        return;
    }

    // Parse the current user data and retrieve users list
    let currentUser = JSON.parse(currentUserJSON);
    let users = JSON.parse(localStorage.getItem('users'));
    let user = users.find(user => user.id === currentUser.id);

    // Calculate the total count of items in the user's cart
    const totalCount = user.cart.reduce((acc, item) => acc + item.quantity, 0);
    // Update all cart count elements with the new total
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalCount.toString();
    });
}
