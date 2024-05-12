document.addEventListener('DOMContentLoaded', function () {
    updateLoginLogoutUI();
});

// Function to update login/logout link based on user's login status
function updateLoginLogoutUI() {
    const currentUserJSON = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    const logoutButtons = document.querySelectorAll('.logout-button');

    if (!currentUserJSON) {
        // If no user is logged in, change the logout button to login
        logoutButtons.forEach(button => {
            button.textContent = 'Login'; // Change text to Login
            button.href = '../login.html'; // Update href to point to the login page
        });
    } else {
        // Setup logout functionality if user is logged in
        logoutButtons.forEach(button => {
            button.textContent = 'Logout'; // Ensure text is Logout
            button.addEventListener('click', function (e) {
                e.preventDefault();
                // Clear the current user from storage
                sessionStorage.removeItem('currentUser');
                localStorage.removeItem('currentUser'); // Also remove from localStorage if used

                // Determine the correct path for redirection based on the current location
                const pathToRoot = window.location.pathname.includes('pages/') ? '../' : './';
                const loginPagePath = `${pathToRoot}login.html`;

                // Redirect to the login page after logout
                window.location.href = loginPagePath;
            });
        });
    }
}

