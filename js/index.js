document.addEventListener('DOMContentLoaded', function () {
    // Selectors for different elements in the document
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-link'); // Ensure this matches your navigation element in HTML
    const menuItems = document.querySelectorAll('.nav-link a'); // Targets all anchor elements within '.nav-link'
    const body = document.body;
    const userIcon = document.querySelector('.user-icon');
    const dropdown = document.querySelector('.user-dropdown');

    const darkMode = document.getElementById("dark-mode");
    const lightMode = document.getElementById("light-mode");

    // Event listener to toggle mobile navigation menu
    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active'); // Toggle visibility of the navigation links
        hamburger.classList.toggle('is-active'); // Toggle hamburger animation
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto'; // Prevent scrolling when menu is open
    });

    // Close the navigation menu when any of the links are clicked
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            navLinks.classList.remove('active');
            hamburger.classList.remove('is-active');
            body.style.overflow = 'auto'; // Restore scrolling on body
        });
    });

    // Toggle user dropdown menu
    userIcon.addEventListener('click', function () {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block'; // Switch between showing and hiding the dropdown
    });

    // Click event to close dropdown menu if clicked outside of it
    window.addEventListener('click', function (e) {
        if (!userIcon.contains(e.target)) { // Check if the click was outside the userIcon
            dropdown.style.display = 'none'; // Hide the dropdown menu
        }
    });

    // Toggle dark mode and light mode by adding/removing class and hiding/showing buttons
    darkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark_mode'); // Toggle dark mode styling
        darkMode.classList.toggle('hide'); // Toggle visibility of the dark mode button
        lightMode.classList.remove('hide'); // Ensure light mode button is visible
    });

    lightMode.addEventListener('click', () => {
        document.body.classList.remove('dark_mode'); // Remove dark mode styling
        lightMode.classList.toggle('hide'); // Toggle visibility of the light mode button
        darkMode.classList.remove('hide'); // Ensure dark mode button is visible
    });

    // Setup of Swiper slider with configuration for autoplay and navigation
    const swiper = new Swiper('.myslider', {
        loop: true,
        autoplay: {
            delay: 5000, // Delay between automatic transitions
            disableOnInteraction: false, // Continue autoplay after user interaction
        },
        pagination: {
            el: '.swiper-pagination', // Element for the clickable pagination
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next', // Next slide button
            prevEl: '.swiper-button-prev', // Previous slide button
        },
    });

    // Horizontal scrolling for product containers with next and previous buttons
    const productContainers = [...document.querySelectorAll('.product-container')];
    const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
    const preBtn = [...document.querySelectorAll('.pre-btn')];

    productContainers.forEach((item, i) => {
        let containerDimensions = item.getBoundingClientRect(); // Get dimensions of the container
        let containerWidth = containerDimensions.width; // Extract width for scroll amount

        nxtBtn[i].addEventListener('click', () => {
            item.scrollLeft += containerWidth; // Scroll right within the container
        });

        preBtn[i].addEventListener('click', () => {
            item.scrollLeft -= containerWidth; // Scroll left within the container
        });
    });
});
