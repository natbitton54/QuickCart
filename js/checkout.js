// Event listener to run updateCheckoutDetails when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    updateCheckoutDetails();
});

// Function to display the user's cart summary or a message if the cart is empty
function updateCheckoutDetails() {
    // Attempt to retrieve the current user from session or local storage
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('No user is currently logged in.');
        window.location.href = '../login.html'; // Redirect to login page if no user is found
        return;
    }

    // Retrieve the list of users; default to an empty array if not found
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(user => user.id === currentUser.id);

    // Alert and redirect if user data cannot be retrieved
    if (!user) {
        alert('User data could not be retrieved. Please log in again.');
        window.location.href = '../login.html';
        return;
    }

    // Display cart summary or a message indicating an empty cart
    if (user.cart && user.cart.length > 0) {
        displayCartSummary(user.cart);
    } else {
        displayEmptyCart();
    }
}

// Function to calculate and display the cart summary
function displayCartSummary(cart) {
    let total = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
    let itemsTotal = cart.reduce((acc, item) => acc + item.quantity, 0);
    let shipping = total >= 300 ? 0 : 15; // Free shipping for orders over $300

    // Display the total items, shipping, and grand total in the checkout summary
    document.querySelector('.summary .items').textContent = `Items: ${itemsTotal}`;
    document.querySelector('.summary .shipping').textContent = `Shipping: $${shipping.toFixed(2)}`;
    document.querySelector('.summary .total').textContent = `Total: $${(total + shipping).toFixed(2)}`;
}

// Function to display a message when the cart is empty
function displayEmptyCart() {
    document.querySelector('.summary .items').textContent = 'Items: 0';
    document.querySelector('.summary .shipping').textContent = 'Shipping: $0.00';
    document.querySelector('.summary .total').textContent = 'Total: $0.00';
}

// Event listener for form submission, preventing default submission to handle validation and purchase logic
document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Extract form values for processing
    const fullName = document.getElementById('fname').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('adr').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postal').value;
    const cardName = document.getElementById('cname').value;
    const cardNumber = document.getElementById('ccnum').value;
    const expMonth = document.getElementById('expmonth').value;
    const expYear = document.getElementById('expyear').value;
    const cvv = document.getElementById('cvv').value;

    // Validate form fields and prevent purchase if validation fails
    if (!validateForm(fullName, email, address, city, postalCode, cardName, cardNumber, expMonth, expYear, cvv)) {
        return;
    }

    // Complete the purchase if validation is successful
    completePurchase(fullName);
});

// Function to validate form inputs and alert on validation errors
function validateForm(fullName, email, address, city, postalCode, cardName, cardNumber, expMonth, expYear, cvv) {
    // Regex and logic checks for various input validations
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    const cardNumberRegex = /^(\d{4}-?){3}\d{4}$/;
    if (!cardNumberRegex.test(cardNumber)) {
        alert("Please enter a valid 16-digit credit card number without spaces or hyphens.");
        return false;
    }

    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!postalCodeRegex.test(postalCode)) {
        alert("Please enter a valid postal code.");
        return false;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Month is zero-indexed
    if (parseInt(expYear) < currentYear || (parseInt(expYear) === currentYear && parseInt(expMonth) <= currentMonth)) {
        alert("The expiration date must be in the future.");
        return false;
    }

    if (!fullName || !address || !city || !cardName || !cvv) {
        alert("Please fill out all fields.");
        return false;
    }

    return true; // All validations passed
}

// Function to handle the purchase completion and user feedback
function completePurchase(fullName) {
    // Attempt to retrieve the 'currentUser' object from sessionStorage first, if not found, then try localStorage
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser'));

    // Retrieve the 'users' array from localStorage
    let users = JSON.parse(localStorage.getItem('users'));

    // Find the index of the current user in the 'users' array based on user ID
    let userIndex = users.findIndex(user => user.id === currentUser.id);

    // If the user is not found in the array (index -1), prompt the user and redirect to login page
    if (userIndex === -1) {
        alert('User not found. Please login again.');
        window.location.href = '../login.html'; // Redirect to login page
        return;
    }

    // Access the user object at the found index
    let user = users[userIndex];

    // Retrieve the cart data from the user object
    let cartData = user.cart;

    // Calculate the total number of items in the cart
    let totalItems = cartData.reduce((acc, item) => acc + item.quantity, 0);

    // Calculate the total price of items in the cart, parsing the price as a float and removing the dollar sign
    let totalPrice = cartData.reduce((acc, item) => acc + (item.quantity * parseFloat(item.price.replace('$', ''))), 0);

    // Determine the shipping cost: free if total price is over $300, otherwise $15
    let shippingCost = totalPrice > 300 ? 0 : 15;


    // Alert user of successful purchase and provide a receipt
    alert(`Thank you for your purchase, ${fullName}!\n\nReceipt:\nTotal Items: ${totalItems}\nTotal Price: $${totalPrice.toFixed(2)}\nShipping: $${shippingCost.toFixed(2)}\nShipping: Will ship within 2 - 3 business days\nGrand Total: $${(totalPrice + shippingCost).toFixed(2)}`);

    // Clear the cart post-purchase and save the updated data
    users[userIndex].cart = [];
    localStorage.setItem('users', JSON.stringify(users));

    setTimeout(() => {
        window.location.href = '../index.html'; // Redirect to homepage after 3 seconds
    }, 2000);
}
