// DaBuDu Universe - Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Welcome to DaBuDu Universe!');
    
    // Initialize all components
    initMobileMenu();
    initStarsBackground();
    initSmoothScrolling();
    initForms();
    initCounters();
    initScrollEffects();
    initHeroCharactersAnimation(); // Добавляем анимацию героев
    initPWA();
    
    // AOS animations отключены - карточки статичны для максимальной скорости
    // if (typeof AOS !== 'undefined') {
    //     AOS.init({
    //         duration: 1,        
    //         once: true,
    //         offset: 1,          
    //         easing: 'ease-out'   
    //     });
    // }
    console.log('🚀 Анимации AOS отключены! Карточки отображаются мгновенно.');
    console.log('⚡ Максимальная скорость: никаких задержек загрузки.');
});

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Stars background animation
function initStarsBackground() {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }

    for (let i = 0; i < 5; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.left = Math.random() * 50 + '%';
        shootingStar.style.top = Math.random() * 50 + '%';
        shootingStar.style.animationDelay = Math.random() * 10 + 's';
        starsContainer.appendChild(shootingStar);
    }
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', () => {
            document.getElementById('characters').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Initialize forms
function initForms() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (email) {
        console.log(`New newsletter subscription: ${email}`);
        // Здесь может быть логика отправки на сервер
        showNotification(`Спасибо за подписку, ${email}!`);
        emailInput.value = '';
    }
}

// Initialize counters
function initCounters() {
    const stored = localStorage.getItem('dabudu_preorders');
    if (!stored) {
        localStorage.setItem('dabudu_preorders', '1247');
    }
    updatePreorderDisplay();
    initCountdown();
    
    if (typeof IntersectionObserver !== 'undefined') {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        document.querySelectorAll('#preorders-count, #countdown-days').forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}

function incrementPreorderCounter() {
    const current = parseInt(localStorage.getItem('dabudu_preorders') || '1247');
    const newCount = current + 1;
    localStorage.setItem('dabudu_preorders', newCount.toString());
    updatePreorderDisplay();
}

function updatePreorderDisplay() {
    const counter = document.getElementById('preorders-count');
    if (counter) {
        const count = localStorage.getItem('dabudu_preorders') || '1247';
        counter.textContent = count;
    }
}

function initCountdown() {
    const countdownElement = document.getElementById('countdown-days');
    if (!countdownElement) return;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 15);

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        
        if (days >= 0) {
            countdownElement.textContent = days;
        } else {
            countdownElement.textContent = '0';
        }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60);
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const start = performance.now();
    
    const animate = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target;
        }
    };
    
    element.textContent = '0';
    requestAnimationFrame(animate);
}

function initScrollEffects() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        indicator.style.transform = `scaleX(${scrolled / 100})`;
        
        const scrollY = window.pageYOffset;
        document.querySelectorAll('.parallax-element').forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

function initPWA() {
    // Service Worker отключен для разработки
    console.log('🚧 Service Worker отключен для разработки. Все изменения будут видны сразу!');
    console.log('📝 Для включения в продакшене см. README.md секцию "Кэширование"');
    
    // Для включения в продакшене раскомментируйте код ниже
    /*
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    */

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt(deferredPrompt);
    });
}

function showInstallPrompt(deferredPrompt) {
    const installBanner = document.createElement('div');
    installBanner.className = 'fixed bottom-4 left-4 right-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between max-w-md mx-auto';
    installBanner.innerHTML = `
        <div>
            <p class="font-semibold">Установить приложение DaBuDu</p>
            <p class="text-sm opacity-90">Получите быстрый доступ</p>
        </div>
        <div class="flex gap-2">
            <button id="install-btn" class="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm">
                Установить
            </button>
            <button id="dismiss-install" class="text-white/70 hover:text-white p-2">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(installBanner);
    
    document.getElementById('install-btn')?.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            deferredPrompt = null;
            installBanner.remove();
        }
    });
    
    document.getElementById('dismiss-install')?.addEventListener('click', () => {
        installBanner.remove();
    });
}

// GSAP animations
window.addEventListener('load', function() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero Characters Animation
        initHeroCharactersAnimation();
        
        // Product Cards Animation - оптимизировано для скорости
        gsap.utils.toArray('.product-card').forEach((card, index) => {
            gsap.fromTo(card, {
                y: 30,                // Уменьшено с 60px до 30px
                opacity: 0,
                scale: 0.95           // Уменьшено с 0.9 до 0.95
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.5,        // Ускорено с 0.8s до 0.5s
                ease: 'power2.out',   // Более быстрый easing
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',  // Раньше срабатывание - с 80% до 90%
                    toggleActions: 'play none none reverse'
                },
                delay: index * 0.05   // Уменьшена задержка с 0.1s до 0.05s
            });
        });
    }
});

// Hero Characters Advanced Animations
function initHeroCharactersAnimation() {
    const dabuduChar = document.querySelector('.dabudu-char');
    const luminusChar = document.querySelector('.luminus-char');
    const dabuduGlow = document.querySelector('.dabudu-glow');
    const luminusGlow = document.querySelector('.luminus-glow');
    const dabuduContainer = document.querySelector('.hero-character-left');
    const luminusContainer = document.querySelector('.hero-character-right');
    
    if (!dabuduChar || !luminusChar) return;
    
    // Handle image loading errors gracefully
    setupImageErrorHandling();
    
    // Регистрируем ScrollTrigger плагин
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initial animation - Characters entrance (ускорено)
        const heroTimeline = gsap.timeline({ delay: 0.2 }); // Уменьшено с 0.5s до 0.2s
        
        // Дабуду появляется слева
        heroTimeline.fromTo(dabuduContainer, {
            x: -200,              // Уменьшено с -300px до -200px
            opacity: 0,
            scale: 0.7,           // Увеличено с 0.5 до 0.7
            rotation: -10         // Уменьшено с -15deg до -10deg
        }, {
            x: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.0,        // Ускорено с 1.5s до 1.0s
            ease: 'back.out(1.4)' // Уменьшен отскок
        });
        
        // Люминус появляется справа (одновременно)
        heroTimeline.fromTo(luminusContainer, {
            x: 200,               // Уменьшено с 300px до 200px
            opacity: 0,
            scale: 0.7,           // Увеличено с 0.5 до 0.7
            rotation: 10          // Уменьшено с 15deg до 10deg
        }, {
            x: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.0,        // Ускорено с 1.5s до 1.0s
            ease: 'back.out(1.4)' // Уменьшен отскок
        }, '<');
        
        // Continuous floating animation
        gsap.to(dabuduChar, {
            y: -15,
            duration: 3,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1
        });
        
        gsap.to(luminusChar, {
            y: -20,
            duration: 2.5,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1,
            delay: 0.5              // Уменьшено с 1s до 0.5s
        });
        
        // Паральлакс эффект с ScrollTrigger
        const isMobile = window.innerWidth <= 768;
        
        gsap.to(dabuduContainer, {
            y: isMobile ? -80 : -150,
            x: isMobile ? 15 : 30,
            rotation: isMobile ? 2 : 5,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: isMobile ? 3 : 2,
                invalidateOnRefresh: true
            }
        });
        
        gsap.to(luminusContainer, {
            y: isMobile ? -60 : -120,
            x: isMobile ? -12 : -25,
            rotation: isMobile ? -1.5 : -3,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: isMobile ? 4 : 1.5,
                invalidateOnRefresh: true
            }
        });
        
        // Обновление анимаций при изменении размера окна
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 250);
        });
    } else {
        // Fallback: простой JavaScript паральлакс без GSAP
        initSimpleParallax();
    }
    
    // Interactive hover animations
    addHeroInteractivity();
}

// Простой паральлакс эффект на чистом JavaScript
function initSimpleParallax() {
    const dabuduContainer = document.querySelector('.hero-character-left');
    const luminusContainer = document.querySelector('.hero-character-right');
    
    if (!dabuduContainer || !luminusContainer) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const rateFast = scrolled * -0.7;
        
        // Дабуду движется быстрее
        dabuduContainer.style.transform = `translate(${15 + scrolled * 0.05}px, calc(-50% + ${rateFast}px)) rotate(${scrolled * 0.01}deg)`;
        
        // Люминус движется медленнее
        luminusContainer.style.transform = `translate(${-15 - scrolled * 0.03}px, calc(-50% + ${rate}px)) rotate(${scrolled * -0.008}deg)`;
    }
    
    // Используем requestAnimationFrame для плавности
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Простая анимация входа
    setTimeout(() => {
        dabuduContainer.style.transition = 'opacity 1s ease, transform 1s ease';
        luminusContainer.style.transition = 'opacity 1s ease, transform 1s ease';
        dabuduContainer.style.opacity = '1';
        luminusContainer.style.opacity = '1';
    }, 500);
}

// Interactive effects for hero characters
function addHeroInteractivity() {
    const heroCharacters = document.querySelectorAll('.hero-character');
    
    heroCharacters.forEach(char => {
        const image = char.querySelector('.hero-char-image');
        const glow = char.querySelector('.char-glow');
        
        char.addEventListener('mouseenter', () => {
            gsap.to(image, {
                scale: 1.1,
                rotation: char.classList.contains('hero-character-left') ? 10 : -10,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(glow, {
                scale: 1.3,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Add magical sparkles on hover
            createMagicalSparkles(char);
        });
        
        char.addEventListener('mouseleave', () => {
            gsap.to(image, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(glow, {
                scale: 1,
                opacity: 0.6,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Create magical sparkles effect
function createMagicalSparkles(container) {
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(sparkle);
        
        gsap.fromTo(sparkle, {
            scale: 0,
            opacity: 1
        }, {
            scale: 2,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out',
            onComplete: () => sparkle.remove()
        });
        
        gsap.to(sparkle, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            duration: 1.5,
            ease: 'power2.out'
        });
    }
}

// Mouse tracking for subtle character movement
function initMouseTracking() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    if (typeof gsap !== 'undefined') {
        gsap.ticker.add(() => {
            gsap.to('.dabudu-char', {
                x: mouseX * 10,
                y: mouseY * 5,
                duration: 2,
                ease: 'power2.out'
            });
            
            gsap.to('.luminus-char', {
                x: mouseX * -8,
                y: mouseY * -3,
                duration: 2.5,
                ease: 'power2.out'
            });
        });
    }
}

// Initialize mouse tracking after page load
window.addEventListener('load', () => {
    setTimeout(initMouseTracking, 2000);
});

// Setup error handling for hero images
function setupImageErrorHandling() {
    const heroImages = document.querySelectorAll('.hero-char-image');
    
    heroImages.forEach(img => {
        img.addEventListener('error', function() {
            console.log(`Hero image not found: ${this.src}`);
            // Hide the character container gracefully
            const container = this.closest('.hero-character');
            if (container) {
                container.style.opacity = '0';
                container.style.pointerEvents = 'none';
            }
        });
        
        img.addEventListener('load', function() {
            console.log(`Hero image loaded successfully: ${this.src}`);
            // Ensure the character is visible
            const container = this.closest('.hero-character');
            if (container) {
                container.style.opacity = '';
                container.style.pointerEvents = '';
            }
        });
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${bgColor} text-white max-w-sm`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}
