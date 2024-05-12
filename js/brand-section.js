// Set up an event listener that waits for the DOM to fully load before executing the function
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Attempt to fetch the products JSON file
        const response = await fetch('../products.json');
        if (!response.ok) {
            // If the response is not OK, throw an error
            throw new Error('Failed to fetch products');
        }
        // Parse the JSON response into data
        const data = await response.json();
        // Populate UI with products from different brands
        populateBrandProducts(data.Nike, "Nike");
        populateBrandProducts(data.Adidas, "Adidas");
        populateBrandProducts(data.Puma, "Puma");
        populateBrandProducts(data.Reebok, "Reebok");
        populateBrandProducts(data.NewBalance, "NewBalance");
        // Update the cart count after populating the products
        updateCartCount();
    } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error("Error fetching data: ", error);
    }
});

// Function to populate brand-specific products into the respective HTML container
function populateBrandProducts(products, containerId) {
    // Get the container by its ID and select the specific class for layout
    const container = document.getElementById(containerId).querySelector(".card-layout");

    // Loop through each product and create a card element for it
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="img-container">
                <img src=".${product.image}" alt="${product.name}">
                <div class="overlay">
                    <button class="overlay-icon" id="heart"><i class="far fa-heart"></i></button>
                    <button class="overlay-icon" id="shop">QUICK SHOP</button>
                    <button class="overlay-icon" id="rng"><i class="fal fa-random"></i></button>
                </div>
            </div>
            <div class="card-desc">
                <div class="color">
                    <div class="yellow"></div>
                    <div class="grey"></div>
                    <div class="pink"></div>
                    <div class="red"></div>
                    <div class="one">+1</div>
                </div>
                <div class="wrapper">
                    <p>${product.name}</p>
                    <div class="star">
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star-half"></i>
                    </div>
                </div>
                <small>${product.price}</small>
                <button onclick="addCart('${product.id}', '${product.name}', '${product.price}', '${product.image}')" class="cart-btn">Add to Cart</button>
            </div>
        `;
        // Append the newly created card to the container
        container.appendChild(card);
    });
}

// Function to add a product to the shopping cart
function addCart(productId, name, price, image) {
    // Get current user from local or session storage
    let currentUserJSON = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!currentUserJSON) {
        // Alert user and redirect if not logged in
        alert("You must be logged in to add items to your cart.");
        window.location.href = '../login.html';
        return;
    }

    // Parse user data and find current user in the list
    let currentUser = JSON.parse(currentUserJSON);
    let users = JSON.parse(localStorage.getItem('users'));
    let user = users.find(user => user.id === currentUser.id);

    // Check if the product is already in the cart
    let productIndex = user.cart.findIndex(item => item.productId === productId);
    if (productIndex !== -1) {
        user.cart[productIndex].quantity += 1; // Increment the quantity
    } else {
        user.cart.push({ productId, name, price, image, quantity: 1 }); // Add new product
    }

    // Save the updated user data back to local storage
    localStorage.setItem('users', JSON.stringify(users));
    updateCartCount(); // Update the cart count
}

// Function to update the count of items in the cart display
function updateCartCount() {
    let currentUserJSON = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!currentUserJSON) {
        // Set cart count to 0 if no user is logged in
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = '0';
        });
        return;
    }

    // Calculate the total count of items in the cart
    let currentUser = JSON.parse(currentUserJSON);
    let users = JSON.parse(localStorage.getItem('users'));
    let user = users.find(user => user.id === currentUser.id);
    const totalCount = user.cart.reduce((acc, item) => acc + item.quantity, 0); // starting count is 0
    // Update the cart count display for all elements
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalCount.toString();
    });
}
