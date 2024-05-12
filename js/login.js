// https://www.w3schools.com/js/js_cookies.asp
// Function to set a cookie with an optional expiration date
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();  // Calculate expiration date
    }
    // Set the cookie with the name, value, and expiration date, path set to root
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

// Function to handle user login
function loginUser(event) {
    event.preventDefault();  // Prevent default form submission behavior
    // Retrieve and trim the email and password from form inputs
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    // Check if "Remember Me" is checked
    const rememberMe = document.querySelector('input[name="keepMeSignedIn"]').checked;

    // Regular expression for validating email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address!");
        return;  // Exit if email is invalid
    }

    // Regular expression for validating password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.");
        return;  // Exit if password is invalid
    }

    // Retrieve users from local storage or initialize an empty array if none exist
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // Attempt to find a user match based on email and password
    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert("Login successful!");

        // If "Remember Me" is checked, store user details in local storage
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        // Always store user details in session storage
        sessionStorage.setItem('currentUser', JSON.stringify(user));

        // Set a cookie to store the user ID, duration based on "Remember Me"
        setCookie('userId', user.id, rememberMe ? 7 : 0);

        console.log("User authentication successful, redirecting...");
        window.location.href = 'index.html'; // Redirect to the main page
    } else {
        console.log("Authentication failed, no redirect.");
        alert("Invalid credentials!");
    }
}

// Attach the loginUser function to the submit event of the login form
document.querySelector('.login-container form').addEventListener('submit', loginUser);
