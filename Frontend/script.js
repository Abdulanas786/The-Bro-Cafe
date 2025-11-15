const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('nav-active');

    // Animate Links
    const links = document.querySelectorAll('.nav-links li');
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Hamburger animation
    hamburger.classList.toggle('toggle');
});

// Optional: Add CSS animation Keyframes directly in JS or keep in CSS
if (!document.styleSheets[0].cssRules.length) { // Basic check to avoid re-adding
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0px);
            }
        }
    `, styleSheet.cssRules.length);
    
    styleSheet.insertRule(`
        .toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        `, styleSheet.cssRules.length);
    styleSheet.insertRule(`
        .toggle .line2 {
            opacity: 0;
        }
        `, styleSheet.cssRules.length);
    styleSheet.insertRule(`
        .toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        `, styleSheet.cssRules.length);
}

// --- NEW: Contact Form Handling ---
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Get form data
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    const submitButton = contactForm.querySelector('.cta-button');

    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
    }

    // Change button text to show it's working
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Send data to the backend
    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Show success/error message from the server
        contactForm.reset(); // Clear the form
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    })
    .finally(() => {
        // Revert button text and enable it
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
    });
});