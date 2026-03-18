// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// ===== FORM HANDLING =====
const quoteForm = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const pickup = document.getElementById('pickup').value.trim();
    const dropoff = document.getElementById('dropoff').value.trim();
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value.trim();

    // Build WhatsApp message
    let whatsappMsg = `Hi, I'd like a quote please!\n\n`;
    whatsappMsg += `*Name:* ${name}\n`;
    whatsappMsg += `*Phone:* ${phone}\n`;
    if (email) whatsappMsg += `*Email:* ${email}\n`;
    whatsappMsg += `*Service:* ${service}\n`;
    if (pickup) whatsappMsg += `*Pickup:* ${pickup}\n`;
    if (dropoff) whatsappMsg += `*Drop-off:* ${dropoff}\n`;
    if (date) whatsappMsg += `*Date:* ${date}\n`;
    whatsappMsg += `\n*Details:*\n${message}`;

    const encoded = encodeURIComponent(whatsappMsg);
    const whatsappURL = `https://wa.me/447424714686?text=${encoded}`;

    // Also send via email as backup (mailto)
    const emailSubject = encodeURIComponent(`Quote Request - ${service} - ${name}`);
    let emailBody = `Name: ${name}\nPhone: ${phone}\n`;
    if (email) emailBody += `Email: ${email}\n`;
    emailBody += `Service: ${service}\n`;
    if (pickup) emailBody += `Pickup: ${pickup}\n`;
    if (dropoff) emailBody += `Drop-off: ${dropoff}\n`;
    if (date) emailBody += `Preferred Date: ${date}\n`;
    emailBody += `\nDetails:\n${message}`;
    const mailtoURL = `mailto:rider.redspeed@gmail.com?subject=${emailSubject}&body=${encodeURIComponent(emailBody)}`;

    // Show success and open WhatsApp
    quoteForm.style.display = 'none';
    formSuccess.style.display = 'block';

    // Add email backup link to success message
    formSuccess.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Thank You, ${name}!</h3>
        <p>You'll be redirected to WhatsApp to send your quote request.</p>
        <p style="margin-top: 15px; color: #666;">Didn't open? Use these links:</p>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px; flex-wrap: wrap;">
            <a href="${whatsappURL}" target="_blank" rel="noopener" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i> Open WhatsApp</a>
            <a href="${mailtoURL}" class="btn btn-primary"><i class="fas fa-envelope"></i> Send via Email</a>
        </div>
    `;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    quoteForm.reset();
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animate service cards and features
document.querySelectorAll('.service-card, .feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Set minimum date on date picker to today
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}
