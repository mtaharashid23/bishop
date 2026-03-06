// Simple script for handling navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
        navbar.style.padding = "10px 0";
    } else {
        navbar.classList.remove('shadow-lg');
        navbar.style.padding = "15px 0";
    }
});

// Placeholder for contact form submission
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your inquiry, Dr. Bishop will contact you soon.');
    this.reset();
});

// Counter Animation Function
const runCounter = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower is slower

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer to trigger counter on scroll
const observerOptions = {
    threshold: 0.5 // Triggers when 50% of the section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            runCounter();
            observer.unobserve(entry.target); // Stops observing after running once
        }
    });
}, observerOptions);

const metricsSection = document.querySelector('#metrics-section');
if (metricsSection) {
    observer.observe(metricsSection);
}