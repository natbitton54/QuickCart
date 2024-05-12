// Event listener to ensure the code runs after the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get references to the form and the element that displays the sent message status
    const form = document.getElementById('contact-form');
    const sentMessage = document.getElementById('sent');

    // Add an event listener to handle the form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission behavior

        // Collect data from the form fields
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toUTCString() // Timestamp for tracking when the message was sent
        };

        // Simulate an AJAX request to store the message
        AjaxStoring(formData).then(response => {
            sentMessage.textContent = "Message sent successfully!";
            sentMessage.style.color = 'green';
            form.reset(); // Clear form fields after successful submission
            setTimeout(() => {
                sentMessage.textContent = ''; // Clear the success message after 3 seconds
            }, 3000);
        }).catch(error => {
            sentMessage.textContent = "Failed to send message: " + error;
            sentMessage.style.color = 'red';
            form.reset(); // Clear form fields after successful submission
            setTimeout(() => {
                sentMessage.textContent = ''; // Clear the error message after 3 seconds
            }, 3000);
        });
    });
});

// Simulate storing the data via AJAX and return a promise
function AjaxStoring(data) {
    return new Promise((resolve, reject) => {
        if (!validateForm(data)) {
            reject("Please check your form for errors."); // Reject the promise if the form validation fails
            return;
        }

        // Retrieve the current user's data from local or session storage
        const currentUserJSON = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (!currentUserJSON) {
            reject("No user logged in."); // Reject if no user is currently logged in
            return;
        }

        const currentUser = JSON.parse(currentUserJSON);
        let messages = JSON.parse(localStorage.getItem('userMessages')) || {};

        // Create a storage array for messages if it doesn't already exist for the current user
        if (!messages[currentUser.id]) {
            messages[currentUser.id] = [];
        }

        // Add the new message to the user's array of messages
        messages[currentUser.id].push(data);
        localStorage.setItem('userMessages', JSON.stringify(messages)); // Update the local storage

        resolve("Data stored successfully!"); // Resolve the promise with a success message
    });
}

// Function to validate the form data
function validateForm(data) {
    // Regular expression for validating the email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // Check if required fields are filled and the email is valid
    return data.firstName && data.lastName && emailRegex.test(data.email) && data.message;
}
