/**
 * XJ-Aerospace Campus Recruitment Website
 * Interactive JavaScript Features
 */

// ========================================
// Star Field Background
// ========================================
class StarField {
    constructor() {
        this.canvas = document.getElementById('starfield');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        const numStars = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        this.stars = [];
        
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }

    createShootingStar() {
        if (Math.random() < 0.005 && this.shootingStars.length < 3) {
            this.shootingStars.push({
                x: Math.random() * this.canvas.width,
                y: 0,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 15 + 10,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
                opacity: 1
            });
        }
    }

    updateShootingStars() {
        this.shootingStars = this.shootingStars.filter(star => {
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            star.opacity -= 0.01;
            return star.opacity > 0 && star.x < this.canvas.width && star.y < this.canvas.height;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => {
            const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
            const parallaxX = (this.mouseX - this.canvas.width / 2) * star.speed * 0.01;
            const parallaxY = (this.mouseY - this.canvas.height / 2) * star.speed * 0.01;
            
            this.ctx.beginPath();
            this.ctx.arc(
                star.x + parallaxX,
                star.y + parallaxY,
                star.size,
                0,
                Math.PI * 2
            );
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
            this.ctx.fill();
            
            // Add glow to larger stars
            if (star.size > 1.5) {
                this.ctx.beginPath();
                this.ctx.arc(
                    star.x + parallaxX,
                    star.y + parallaxY,
                    star.size * 2,
                    0,
                    Math.PI * 2
                );
                const gradient = this.ctx.createRadialGradient(
                    star.x + parallaxX,
                    star.y + parallaxY,
                    0,
                    star.x + parallaxX,
                    star.y + parallaxY,
                    star.size * 2
                );
                gradient.addColorStop(0, `rgba(0, 212, 255, ${star.opacity * twinkle * 0.3})`);
                gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
            
            star.twinklePhase += star.twinkleSpeed;
        });
        
        // Draw shooting stars
        this.shootingStars.forEach(star => {
            const gradient = this.ctx.createLinearGradient(
                star.x,
                star.y,
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(0.3, `rgba(0, 212, 255, ${star.opacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }

    animate() {
        this.createShootingStar();
        this.updateShootingStars();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// Language Switcher
// ========================================
class LanguageSwitcher {
    constructor() {
        this.currentLang = 'zh';
        this.langToggle = document.getElementById('langToggle');
        this.init();
    }

    init() {
        if (this.langToggle) {
            this.langToggle.setAttribute('data-lang', this.currentLang);
            this.langToggle.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        this.langToggle.setAttribute('data-lang', this.currentLang);
        this.updateContent();
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-zh][data-en]');
        elements.forEach(el => {
            const text = el.getAttribute(`data-${this.currentLang}`);
            if (text) {
                el.textContent = text;
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
    }
}

// ========================================
// Mobile Menu
// ========================================
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.menu = document.getElementById('mobileMenu');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (this.menuBtn && this.menu) {
            this.menuBtn.addEventListener('click', () => this.toggle());
            
            // Close menu when clicking on links
            this.menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.close());
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.menu.contains(e.target) && !this.menuBtn.contains(e.target)) {
                    this.close();
                }
            });
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.menuBtn.classList.toggle('active', this.isOpen);
        this.menu.classList.toggle('active', this.isOpen);
    }

    close() {
        this.isOpen = false;
        this.menuBtn.classList.remove('active');
        this.menu.classList.remove('active');
    }
}

// ========================================
// Scroll Animations
// ========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-animate');
        this.init();
    }

    init() {
        this.observeElements();
        this.handleNavbar();
    }

    observeElements() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.elements.forEach(el => observer.observe(el));
    }

    handleNavbar() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
}

// ========================================
// Number Counter Animation
// ========================================
class NumberCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateNumber(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateNumber(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = 2000;
        const startTime = performance.now();

        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentNumber = Math.floor(easedProgress * target);

            element.textContent = currentNumber;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateNumber);
    }
}

// ========================================
// Parallax Effect
// ========================================
class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.layers = document.querySelectorAll('.parallax-layer');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        this.layers.forEach((layer, index) => {
            const speed = (index + 1) * 0.1;
            layer.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    handleMouseMove(e) {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.layers.forEach((layer, index) => {
            const speed = (index + 1) * 0.02;
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;
            layer.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ========================================
// Smooth Scroll
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ========================================
// Card Hover Effects
// ========================================
class CardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.position-card, .feature-card, .benefit-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
    }

    handleMouseLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ========================================
// Glow Effect on Buttons
// ========================================
class GlowEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.glow-btn');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                btn.style.setProperty('--mouse-x', `${x}px`);
                btn.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
}

// ========================================
// Typing Effect for Hero
// ========================================
class TypingEffect {
    constructor() {
        this.element = document.querySelector('.hero-desc');
        this.originalText = this.element ? this.element.textContent : '';
        // Disabled for cleaner look
        // this.init();
    }

    init() {
        if (!this.element) return;
        
        this.element.textContent = '';
        let index = 0;
        
        const typeChar = () => {
            if (index < this.originalText.length) {
                this.element.textContent += this.originalText.charAt(index);
                index++;
                setTimeout(typeChar, 50);
            }
        };
        
        setTimeout(typeChar, 1500);
    }
}

// ========================================
// Initialize All Features
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    new StarField();
    new LanguageSwitcher();
    new MobileMenu();
    new ScrollAnimations();
    new NumberCounter();
    new ParallaxEffect();
    new SmoothScroll();
    new CardEffects();
    new GlowEffect();
    new TypingEffect();
    
    // Add loading complete class
    document.body.classList.add('loaded');
});

// ========================================
// Preloader
// ========================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});
