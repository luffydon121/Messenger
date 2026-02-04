// ===== Valentine's Day Interactive Webpage =====
// For Mutu 💖

// ===== Global Variables =====
let soundEnabled = true;
let noButtonEscapeCount = 0;
let isMobile = false;
let touchStartPos = { x: 0, y: 0 };

// Romantic quotes for the quote rotator
const loveQuotes = [
    "You're the reason I believe in magic ✨",
    "Every love story is beautiful, but ours is my favorite 💕",
    "You had me at hello 💗",
    "In all the world, there is no heart for me like yours 💖",
    "You are my sun, my moon, and all my stars 🌟",
    "I fell in love the way you fall asleep: slowly, then all at once 😴💘",
    "To the world you may be one person, but to me you are the world 🌍💓",
    "I love you more than yesterday, less than tomorrow 💝",
    "You're the peanut butter to my jelly 🥜💜",
    "My heart beats your name 💓",
    "You're my favorite notification 📱💕",
    "I love you to the moon and back 🌙💖",
    "You make my heart skip a beat 💗",
    "Forever wouldn't be enough with you ∞",
    "You're my person 👫💘"
];

// Teasing messages when No button is approached
const teaseMessages = [
    "Hehe, nice try! 😜",
    "Oops! Wrong button! 🙈",
    "Are you sure about that? 🤔",
    "That button doesn't work! 💕",
    "The heart wants what it wants! 💖",
    "Come on, you know you want to! 😊",
    "I believe in you! Say yes! 🌹",
    "That's not the answer I'm looking for! 💝",
    "Try the other button! 💘",
    "My love is escaping! Chase the Yes! 🏃💨",
    "I'll keep running away! 🏃‍♀️",
    "You can't catch me! 🎈",
    "Just say YES already! 💗",
    "The No button is shy! 🙊",
    "Resistance is futile! 💫"
];

// Floating love messages
const floatingLoveMessages = [
    "I love you 💕",
    "You're amazing 🌟",
    "My heart is yours 💖",
    "Forever yours 💗",
    "You make me smile 😊",
    "My everything 💝",
    "Mutu 💘",
    "Always & Forever ∞"
];

// Emojis for floating elements
const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '🩷', '💜', '🧡'];
const sparkleEmojis = ['✨', '⭐', '🌟', '💫', '✧', '★'];
const flowerEmojis = ['🌹', '🌸', '💐', '🌺', '🌷', '🪻', '🌻'];

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    detectMobile();
    initializeNoButtonBehavior();
    startQuoteRotation();
    
    // Start floating elements after a delay
    setTimeout(() => {
        startFloatingElements();
        startFloatingMessages();
    }, 2000);
});

// ===== Device Detection =====
function detectMobile() {
    isMobile = ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0) ||
               (window.innerWidth <= 768);
    
    if (isMobile) {
        document.body.classList.add('is-mobile');
    }
    
    // Set up touch/mouse sparkle trail
    if (isMobile) {
        document.addEventListener('touchmove', handleSparkleTrail, { passive: true });
    } else {
        document.addEventListener('mousemove', handleSparkleTrail);
    }
}

// ===== Intro Screen =====
function startExperience() {
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    
    // Play sound if enabled
    playClickSound();
    
    // Create burst effect
    createIntroBurst();
    
    // Fade out intro
    introScreen.classList.add('fade-out');
    
    // Show main content after animation
    setTimeout(() => {
        introScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        mainContent.classList.add('fade-in');
        
        // Start background music
        if (soundEnabled) {
            startBackgroundAmbience();
        }
    }, 800);
}

function createIntroBurst() {
    const introScreen = document.getElementById('intro-screen');
    
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 2 + 1}rem;
            top: 50%;
            left: 50%;
            pointer-events: none;
            animation: burstOut 1s ease-out forwards;
            --angle: ${Math.random() * 360}deg;
            --distance: ${Math.random() * 200 + 100}px;
        `;
        
        // Add keyframes dynamically
        heart.style.animation = `burstOut 1s ease-out forwards`;
        
        introScreen.appendChild(heart);
        
        // Animate manually
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 200 + 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        heart.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out',
            fill: 'forwards'
        });
        
        setTimeout(() => heart.remove(), 1000);
    }
}

// ===== Sound Management =====
function toggleSound() {
    soundEnabled = !soundEnabled;
    
    const soundOn = document.querySelector('.sound-on');
    const soundOff = document.querySelector('.sound-off');
    
    soundOn.classList.toggle('hidden', !soundEnabled);
    soundOff.classList.toggle('hidden', soundEnabled);
    
    if (!soundEnabled) {
        stopAllSounds();
    }
}

function playClickSound() {
    if (!soundEnabled) return;
    
    // Create a simple click sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Audio not supported
    }
}

function startBackgroundAmbience() {
    // Background ambience handled by CSS animations
    // Could add actual audio here if desired
}

function stopAllSounds() {
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.pause();
    }
}

// ===== Sparkle Trail =====
let sparkleThrottle = 0;

function handleSparkleTrail(e) {
    const now = Date.now();
    if (now - sparkleThrottle < 50) return; // Throttle for performance
    sparkleThrottle = now;
    
    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    
    createSparkle(x, y);
}

function createSparkle(x, y) {
    const container = document.getElementById('sparkle-trail');
    if (!container) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    sparkle.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        font-size: ${Math.random() * 0.8 + 0.5}rem;
    `;
    
    container.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 800);
}

// ===== Quote Rotation =====
function startQuoteRotation() {
    const quoteText = document.getElementById('quote-text');
    let currentIndex = 0;
    
    setInterval(() => {
        // Fade out
        quoteText.style.opacity = '0';
        quoteText.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % loveQuotes.length;
            quoteText.textContent = loveQuotes[currentIndex];
            
            // Fade in
            quoteText.style.opacity = '1';
            quoteText.style.transform = 'translateY(0)';
        }, 300);
    }, 5000);
    
    // Initial transition setup
    quoteText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

// ===== Floating Elements =====
function startFloatingElements() {
    // Create petals
    setInterval(() => createFloatingElement('petal'), 800);
    
    // Create hearts
    setInterval(() => createFloatingElement('heart'), 1200);
    
    // Create sparkles
    setInterval(() => createFloatingElement('sparkle'), 600);
}

function createFloatingElement(type) {
    const container = document.getElementById('floating-elements');
    if (!container) return;
    
    const element = document.createElement('div');
    element.className = 'float-element';
    
    const x = Math.random() * 100;
    const size = Math.random() * 0.5 + 0.8;
    
    element.style.left = `${x}%`;
    element.style.transform = `scale(${size})`;
    
    switch (type) {
        case 'petal':
            element.classList.add('petal');
            element.style.animationDuration = `${Math.random() * 4 + 6}s`;
            break;
        case 'heart':
            element.classList.add('heart-float');
            element.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            element.style.animationDuration = `${Math.random() * 3 + 5}s`;
            break;
        case 'sparkle':
            element.classList.add('sparkle-float');
            element.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
            element.style.animationDuration = `${Math.random() * 2 + 3}s`;
            break;
    }
    
    container.appendChild(element);
    
    // Clean up after animation
    const duration = parseFloat(element.style.animationDuration) * 1000;
    setTimeout(() => element.remove(), duration);
}

// ===== Floating Messages =====
function startFloatingMessages() {
    setInterval(() => {
        createFloatingMessage();
    }, 8000);
    
    // Create first one after a delay
    setTimeout(createFloatingMessage, 3000);
}

function createFloatingMessage() {
    const container = document.getElementById('floating-messages');
    if (!container) return;
    
    const msg = document.createElement('div');
    msg.className = 'floating-msg';
    msg.textContent = floatingLoveMessages[Math.floor(Math.random() * floatingLoveMessages.length)];
    
    const x = Math.random() * 60 + 20; // 20% to 80%
    const y = Math.random() * 40 + 30; // 30% to 70%
    
    msg.style.left = `${x}%`;
    msg.style.top = `${y}%`;
    
    container.appendChild(msg);
    
    setTimeout(() => msg.remove(), 8000);
}

// ===== No Button Escape Behavior =====
function initializeNoButtonBehavior() {
    const noBtn = document.getElementById('no-btn');
    if (!noBtn) return;
    
    // Mouse events (desktop)
    noBtn.addEventListener('mouseenter', handleNoButtonApproach);
    noBtn.addEventListener('mousemove', handleNoButtonApproach);
    
    // Touch events (mobile)
    noBtn.addEventListener('touchstart', handleNoButtonTouch, { passive: true });
    noBtn.addEventListener('touchmove', handleNoButtonTouch, { passive: true });
    
    // Click prevention
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        escapeNoButton();
        return false;
    });
    
    // Track touch position for proximity detection on mobile
    if (isMobile) {
        document.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                checkNoButtonProximity(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
    }
}

function handleNoButtonApproach(e) {
    escapeNoButton();
}

function handleNoButtonTouch(e) {
    e.preventDefault();
    escapeNoButton();
}

function checkNoButtonProximity(touchX, touchY) {
    const noBtn = document.getElementById('no-btn');
    if (!noBtn) return;
    
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
        Math.pow(touchX - btnCenterX, 2) + 
        Math.pow(touchY - btnCenterY, 2)
    );
    
    // If touch is within 100px of the button, escape
    if (distance < 100) {
        escapeNoButton();
    }
}

function escapeNoButton() {
    const noBtn = document.getElementById('no-btn');
    const teaseMsg = document.getElementById('tease-message');
    if (!noBtn) return;
    
    noButtonEscapeCount++;
    
    // Update tease message
    if (teaseMsg) {
        teaseMsg.textContent = teaseMessages[noButtonEscapeCount % teaseMessages.length];
        teaseMsg.style.animation = 'none';
        teaseMsg.offsetHeight; // Trigger reflow
        teaseMsg.style.animation = 'messageAppear 0.3s ease-out';
    }
    
    // Play sound
    playClickSound();
    
    // Apply random escape effect
    const escapeType = Math.floor(Math.random() * 8);
    
    // Reset classes
    noBtn.className = 'btn no-btn escaping';
    
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate safe boundaries
    const maxX = containerRect.width - btnRect.width;
    const maxY = 100; // Limit vertical movement
    
    switch (escapeType) {
        case 0: // Jump to random position
            const newX = Math.random() * maxX;
            const newY = (Math.random() - 0.5) * maxY;
            noBtn.style.transform = `translate(${newX - maxX/2}px, ${newY}px)`;
            break;
            
        case 1: // Shrink
            noBtn.classList.add('shrinking');
            setTimeout(() => noBtn.classList.remove('shrinking'), 300);
            break;
            
        case 2: // Rotate
            noBtn.classList.add('rotating');
            setTimeout(() => noBtn.classList.remove('rotating'), 300);
            const rx = (Math.random() - 0.5) * maxX;
            noBtn.style.transform = `translateX(${rx}px) rotate(${Math.random() * 360}deg)`;
            break;
            
        case 3: // Vibrate then move
            noBtn.classList.add('vibrating');
            setTimeout(() => {
                noBtn.classList.remove('vibrating');
                const vx = (Math.random() - 0.5) * maxX;
                noBtn.style.transform = `translateX(${vx}px)`;
            }, 200);
            break;
            
        case 4: // Fade and reappear
            noBtn.classList.add('fading');
            setTimeout(() => {
                noBtn.classList.remove('fading');
                const fx = (Math.random() - 0.5) * maxX;
                noBtn.style.transform = `translateX(${fx}px)`;
            }, 300);
            break;
            
        case 5: // Grow smaller
            noBtn.classList.add('growing');
            setTimeout(() => noBtn.classList.remove('growing'), 300);
            break;
            
        case 6: // Slide up
            noBtn.classList.add('sliding-up');
            setTimeout(() => {
                noBtn.classList.remove('sliding-up');
                const sx = (Math.random() - 0.5) * maxX;
                noBtn.style.transform = `translateX(${sx}px)`;
            }, 200);
            break;
            
        case 7: // Slide down
            noBtn.classList.add('sliding-down');
            setTimeout(() => {
                noBtn.classList.remove('sliding-down');
                const dx = (Math.random() - 0.5) * maxX;
                noBtn.style.transform = `translateX(${dx}px)`;
            }, 200);
            break;
    }
    
    // Create mini heart burst
    createMiniHeartBurst(btnRect.left + btnRect.width/2, btnRect.top + btnRect.height/2);
}

function createMiniHeartBurst(x, y) {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 1rem;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(heart);
        
        const angle = (Math.PI * 2 / 5) * i;
        const distance = 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        heart.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out',
            fill: 'forwards'
        });
        
        setTimeout(() => heart.remove(), 600);
    }
}

// ===== Yes Button - Celebration =====
function sayYes() {
    const mainContent = document.getElementById('main-content');
    const celebrationScreen = document.getElementById('celebration-screen');
    
    // Play success sound
    playSuccessSound();
    
    // Screen pulse effect
    mainContent.classList.add('screen-pulse');
    
    // Create massive heart explosion from button
    const yesBtn = document.getElementById('yes-btn');
    const rect = yesBtn.getBoundingClientRect();
    createMassiveHeartExplosion(rect.left + rect.width/2, rect.top + rect.height/2);
    
    // Transition to celebration
    setTimeout(() => {
        mainContent.classList.add('hidden');
        celebrationScreen.classList.remove('hidden');
        celebrationScreen.classList.add('show');
        
        // Start celebration effects
        startCelebration();
    }, 1000);
}

function playSuccessSound() {
    if (!soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a happy chord
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + index * 0.1);
            
            oscillator.start(audioContext.currentTime + index * 0.1);
            oscillator.stop(audioContext.currentTime + 0.5 + index * 0.1);
        });
    } catch (e) {
        // Audio not supported
    }
}

function createMassiveHeartExplosion(centerX, centerY) {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: ${Math.random() * 2 + 1}rem;
                pointer-events: none;
                z-index: 3000;
            `;
            
            document.body.appendChild(heart);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 300 + 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            heart.animate([
                { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.5) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 1500,
                easing: 'ease-out',
                fill: 'forwards'
            });
            
            setTimeout(() => heart.remove(), 1500);
        }, i * 20);
    }
}

// ===== Celebration Effects =====
function startCelebration() {
    // Start confetti
    startConfetti();
    
    // Create heart explosions
    createCelebrationHearts();
    
    // Start hearts rain
    startHeartsRain();
    
    // Screen glow effect
    addScreenGlow();
}

function startConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    const colors = ['#ff6b9d', '#ffd700', '#ff1744', '#e91e63', '#fff', '#fab1a0', '#dda0dd'];
    
    // Initial burst
    for (let i = 0; i < 100; i++) {
        setTimeout(() => createConfetti(container, colors), i * 30);
    }
    
    // Continuous confetti
    setInterval(() => {
        for (let i = 0; i < 5; i++) {
            createConfetti(container, colors);
        }
    }, 300);
}

function createConfetti(container, colors) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * 100;
    const duration = Math.random() * 2 + 2;
    const size = Math.random() * 10 + 5;
    const shape = Math.random() > 0.5 ? '50%' : '0';
    
    confetti.style.cssText = `
        left: ${x}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${shape};
        animation-duration: ${duration}s;
    `;
    
    container.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), duration * 1000);
}

function createCelebrationHearts() {
    const container = document.getElementById('hearts-explosion');
    if (!container) return;
    
    // Create hearts from center
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'exploding-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            const angle = (Math.PI * 2 / 30) * i + Math.random() * 0.5;
            const distance = Math.random() * 200 + 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            heart.style.fontSize = `${Math.random() * 2 + 2}rem`;
            
            container.appendChild(heart);
            
            setTimeout(() => heart.remove(), 2000);
        }, i * 50);
    }
}

function startHeartsRain() {
    const container = document.getElementById('hearts-rain');
    if (!container) return;
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'rain-heart';
        heart.textContent = [...heartEmojis, ...flowerEmojis][Math.floor(Math.random() * (heartEmojis.length + flowerEmojis.length))];
        
        const x = Math.random() * 100;
        const duration = Math.random() * 3 + 3;
        const size = Math.random() * 1 + 0.8;
        
        heart.style.cssText = `
            left: ${x}%;
            font-size: ${size}rem;
            animation-duration: ${duration}s;
        `;
        
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), duration * 1000);
    }, 200);
}

function addScreenGlow() {
    const celebration = document.getElementById('celebration-screen');
    if (!celebration) return;
    
    // Add pulsing glow overlay
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(255, 107, 157, 0.2) 0%, transparent 70%);
        pointer-events: none;
        animation: glowPulse 2s ease-in-out infinite;
    `;
    
    celebration.insertBefore(glow, celebration.firstChild);
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Window Resize Handler =====
window.addEventListener('resize', debounce(() => {
    detectMobile();
}, 250));

// ===== Visibility Change Handler =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause intensive animations when tab is hidden
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.log('An error occurred:', e.message);
});

// ===== Touch Start Tracking =====
document.addEventListener('touchstart', (e) => {
    if (e.touches[0]) {
        touchStartPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
}, { passive: true });

// ===== Prevent Default on Drag =====
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

// ===== Initialize Everything When Ready =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('💕 Valentine\'s page loaded successfully! 💕');
    });
} else {
    console.log('💕 Valentine\'s page loaded successfully! 💕');
}
