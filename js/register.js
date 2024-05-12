function registerUser(event) {
    event.preventDefault();  // Prevents the default form submission behavior

    // Retrieve and trim user inputs from the registration form
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase(); // Normalize the email
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Regular expression for validating email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address!");
        return;  // Stop further execution if the email is invalid
    }

    // Regular expression for validating password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.");
        return;  // Stop further execution if the password is invalid
    }

    // Check if the passwords entered match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;  // Stop further execution if the passwords do not match
    }

    // Retrieve existing users from local storage or initialize an empty array if none exist
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // Check if the email is already registered
    if (users.some(user => user.email === email)) {
        alert("Email already registered!");
        return;  // Stop further execution if the email is already in use
    }

    // Assign a unique user ID by finding the maximum existing user ID and adding one
    let newUser = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,  // Ensures ID is at least 1
        firstName,
        lastName,
        email,
        password,
        cart: [] // Initialize an empty cart for new user
    };

    // Add the new user to the array of users
    users.push(newUser);
    // Save the updated users array to local storage
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registration successful!");
    // Redirect to the login page after successful registration
    window.location.href = '../login.html';
}

// Attach the registerUser function to the submit event of the registration form
document.querySelector('.register-container form').addEventListener('submit', registerUser);
