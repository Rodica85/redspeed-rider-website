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

// ===== AI CHAT ASSISTANT =====
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatInputArea = document.getElementById('chatInputArea');

const WHATSAPP_NUMBER = '447424714686';

const SERVICES_LIST = [
    'Man with a Van',
    'Home & Office Removals',
    'Furniture Delivery & Assembly',
    'Marketplace Collections',
    'Event & Equipment Transport',
    'Pallet & Commercial Deliveries',
    'Storage Moves',
    'Other'
];

let chatState = {
    step: 'greeting',
    data: { name: '', phone: '', service: '', details: '' }
};

chatToggle.addEventListener('click', () => {
    chatWidget.classList.toggle('open');
    if (chatWidget.classList.contains('open') && chatMessages.children.length === 0) {
        startChat();
    }
});

function appendMessage(text, type = 'bot') {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.innerHTML = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendOptions(options) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-options';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'chat-option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            handleOptionClick(opt);
            wrapper.remove();
        });
        wrapper.appendChild(btn);
    });
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.id = 'chatTyping';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('chatTyping');
    if (typing) typing.remove();
}

function botSay(text, callback, delay = 900) {
    showTyping();
    setTimeout(() => {
        hideTyping();
        appendMessage(text, 'bot');
        if (callback) callback();
    }, delay);
}

function setInputEnabled(enabled, placeholder = 'Type your answer...') {
    chatInput.disabled = !enabled;
    chatSend.disabled = !enabled;
    chatInput.placeholder = placeholder;
    if (enabled) chatInput.focus();
}

function startChat() {
    setInputEnabled(false, 'Choose an option...');
    botSay("👋 Hi! Welcome to <strong>REDSPEED RIDER</strong>!", () => {
        botSay("I'll help you get a <strong>free quote</strong> in just a few quick questions. Ready?", () => {
            setTimeout(() => appendOptions(["Yes, let's go! 🚀", "Just browsing"]), 300);
        }, 1100);
    }, 600);
}

function handleOptionClick(choice) {
    appendMessage(choice, 'user');

    if (chatState.step === 'greeting') {
        if (choice === 'Just browsing') {
            botSay("No problem! Feel free to explore. If you change your mind, I'm here. You can also call us directly at <strong>07424 714686</strong> or message us on WhatsApp anytime. 😊");
            return;
        }
        chatState.step = 'name';
        botSay("Great! First, what's your <strong>name</strong>?", () => {
            setInputEnabled(true, 'Your name...');
        });
    } else if (chatState.step === 'service') {
        chatState.data.service = choice;
        chatState.step = 'details';
        botSay(`Got it — <strong>${choice}</strong>. ✅`, () => {
            botSay("Briefly describe what you need moved (items, pickup/drop-off, any special requirements).", () => {
                setInputEnabled(true, 'Describe your job...');
            }, 900);
        }, 700);
    }
}

function handleUserInput(text) {
    if (!text.trim()) return;
    appendMessage(text, 'user');
    chatInput.value = '';

    if (chatState.step === 'name') {
        chatState.data.name = text.trim();
        chatState.step = 'phone';
        setInputEnabled(false);
        botSay(`Nice to meet you, <strong>${chatState.data.name}</strong>! 👋`, () => {
            botSay("What's the best <strong>phone number</strong> to call you back on?", () => {
                setInputEnabled(true, 'e.g. 07xxx xxx xxx');
            }, 900);
        }, 700);
    } else if (chatState.step === 'phone') {
        chatState.data.phone = text.trim();
        chatState.step = 'service';
        setInputEnabled(false);
        botSay("Perfect! 📞", () => {
            botSay("Which service do you need?", () => {
                appendOptions(SERVICES_LIST);
            }, 900);
        }, 600);
    } else if (chatState.step === 'details') {
        chatState.data.details = text.trim();
        chatState.step = 'done';
        setInputEnabled(false);
        botSay("Thank you! One moment while I send this to our team... ⏳", () => {
            sendToWhatsApp();
        }, 1000);
    }
}

function sendToWhatsApp() {
    const { name, phone, service, details } = chatState.data;
    let msg = `🚚 *NEW QUOTE REQUEST (via website chat)*\n\n`;
    msg += `*Name:* ${name}\n`;
    msg += `*Phone:* ${phone}\n`;
    msg += `*Service:* ${service}\n\n`;
    msg += `*Details:*\n${details}`;

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    setTimeout(() => {
        botSay(`🎉 Thank you, <strong>${name}</strong>!`, () => {
            botSay(`Your request has been received. Our team will contact you <strong>as soon as possible</strong> on <strong>${phone}</strong> with your <strong>free quote</strong>. 📞`, () => {
                botSay(`💡 <strong>Want an instant reply?</strong> Send your details directly to us on WhatsApp:`, () => {
                    const finalOptions = document.createElement('div');
                    finalOptions.className = 'chat-options';
                    finalOptions.innerHTML = `
                        <a href="${whatsappURL}" target="_blank" rel="noopener" class="chat-option-btn" style="text-decoration:none;display:block;text-align:center;background:#25D366;color:white;border-color:#25D366;">
                            <i class="fab fa-whatsapp"></i> Send on WhatsApp
                        </a>
                        <a href="tel:+447424714686" class="chat-option-btn" style="text-decoration:none;display:block;text-align:center;">
                            📞 Call us now
                        </a>
                    `;
                    chatMessages.appendChild(finalOptions);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    chatInputArea.style.display = 'none';
                }, 900);
            }, 1100);
        }, 800);
    }, 500);
}

chatSend.addEventListener('click', () => handleUserInput(chatInput.value));
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput(chatInput.value);
});
