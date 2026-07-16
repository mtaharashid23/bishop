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

function createFallbackToast(type, message) {
    let container = document.querySelector('.custom-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'custom-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast custom-toast-${type}`;
    toast.innerHTML = `<div class="custom-toast-message">${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('custom-toast-fade');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 4000);
}

function showToast(type, message) {
    try {
        if (window.toastr && typeof window.toastr[type] === 'function') {
            window.toastr[type](message);
            return;
        }
    } catch (error) {
        console.error('Toastr fallback activated:', error);
    }
    createFallbackToast(type, message);
}

function initContactForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = form.querySelector('#btnText');
    const spinner = form.querySelector('#spinner');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!submitBtn) return;

        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending...';
        if (spinner) spinner.classList.remove('d-none');

        const formData = new FormData(this);

        fetch('contact-handler.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('success', data.message);
                    form.reset();
                    setTimeout(() => {
                        window.location.href = 'thank-you';
                    }, 1500);
                } else {
                    showToast('error', data.message);
                }
            })
            .catch(error => {
                console.error('Contact form error:', error);
                showToast('error', 'An error occurred. Please try again.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Inquiry';
                if (spinner) spinner.classList.add('d-none');
            });
    });
}

function initContactForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = form.querySelector('#btnText');
    const spinner = form.querySelector('#spinner');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!submitBtn) return;

        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending...';
        if (spinner) spinner.classList.remove('d-none');

        const formData = new FormData(this);

        fetch('contact-handler.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (window.toastr) {
                        toastr.success(data.message);
                    }
                    form.reset();
                    setTimeout(() => {
                        window.location.href = 'thank-you';
                    }, 1500);
                } else {
                    if (window.toastr) {
                        toastr.error(data.message);
                    }
                }
            })
            .catch(error => {
                console.error('Contact form error:', error);
                if (window.toastr) {
                    toastr.error('An error occurred. Please try again.');
                }
            })
            .finally(() => {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Inquiry';
                if (spinner) spinner.classList.add('d-none');
            });
    });
}
