/**
 * xj-aerospace 官网
 * 交互功能脚本
 */

// ========================================
// 星空粒子背景
// ========================================
class StarField {
    constructor() {
        this.canvas = document.getElementById('starfield');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.nebulas = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.createNebulas();
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
        this.createStars();
    }

    createStars() {
        const numStars = Math.floor((this.canvas.width * this.canvas.height) / 6000);
        this.stars = [];
        
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2.5 + 0.3,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                color: this.getStarColor()
            });
        }
    }

    getStarColor() {
        const colors = [
            { r: 255, g: 255, b: 255 },
            { r: 200, g: 220, b: 255 },
            { r: 0, g: 212, b: 255 },
            { r: 100, g: 180, b: 255 }
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createNebulas() {
        this.nebulas = [
            { x: this.canvas.width * 0.2, y: this.canvas.height * 0.3, size: 300, opacity: 0.03 },
            { x: this.canvas.width * 0.8, y: this.canvas.height * 0.7, size: 400, opacity: 0.02 },
            { x: this.canvas.width * 0.5, y: this.canvas.height * 0.5, size: 500, opacity: 0.015 }
        ];
    }

    createShootingStar() {
        if (Math.random() < 0.003 && this.shootingStars.length < 2) {
            const startX = Math.random() * this.canvas.width * 0.8;
            this.shootingStars.push({
                x: startX,
                y: 0,
                length: Math.random() * 100 + 60,
                speed: Math.random() * 20 + 12,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
                opacity: 1,
                trail: []
            });
        }
    }

    updateShootingStars() {
        this.shootingStars = this.shootingStars.filter(star => {
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            star.opacity -= 0.008;
            
            star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity });
            if (star.trail.length > 20) star.trail.pop();
            
            return star.opacity > 0 && star.x < this.canvas.width && star.y < this.canvas.height;
        });
    }

    drawNebulas() {
        this.nebulas.forEach(nebula => {
            const gradient = this.ctx.createRadialGradient(
                nebula.x, nebula.y, 0,
                nebula.x, nebula.y, nebula.size
            );
            gradient.addColorStop(0, `rgba(0, 212, 255, ${nebula.opacity})`);
            gradient.addColorStop(0.5, `rgba(79, 156, 255, ${nebula.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw nebulas
        this.drawNebulas();
        
        // Draw stars
        this.stars.forEach(star => {
            const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
            const parallaxX = (this.mouseX - this.canvas.width / 2) * star.speed * 0.015;
            const parallaxY = (this.mouseY - this.canvas.height / 2) * star.speed * 0.015;
            
            const x = star.x + parallaxX;
            const y = star.y + parallaxY;
            
            // Star core
            this.ctx.beginPath();
            this.ctx.arc(x, y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity * twinkle})`;
            this.ctx.fill();
            
            // Glow effect for larger stars
            if (star.size > 1.2) {
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, star.size * 4);
                gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity * twinkle * 0.4})`);
                gradient.addColorStop(0.5, `rgba(0, 212, 255, ${star.opacity * twinkle * 0.1})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, star.size * 4, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
            
            star.twinklePhase += star.twinkleSpeed;
        });
        
        // Draw shooting stars
        this.shootingStars.forEach(star => {
            // Trail
            star.trail.forEach((point, index) => {
                const trailOpacity = point.opacity * (1 - index / star.trail.length) * 0.5;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 1.5 * (1 - index / star.trail.length), 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 212, 255, ${trailOpacity})`;
                this.ctx.fill();
            });
            
            // Main streak
            const gradient = this.ctx.createLinearGradient(
                star.x, star.y,
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(0.2, `rgba(0, 212, 255, ${star.opacity * 0.8})`);
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2.5;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
            
            // Bright head
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
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
// 语言切换
// ========================================
class LanguageSwitcher {
    constructor() {
        this.currentLang = 'zh';
        this.langToggle = document.getElementById('langToggle');
        this.init();
    }

    init() {
        if (!this.langToggle) return;
        
        this.updateToggleUI();
        this.langToggle.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        this.updateToggleUI();
        this.updateContent();
    }

    updateToggleUI() {
        const zhOption = this.langToggle.querySelector('[data-lang="zh"]');
        const enOption = this.langToggle.querySelector('[data-lang="en"]');
        
        if (zhOption && enOption) {
            zhOption.classList.toggle('active', this.currentLang === 'zh');
            enOption.classList.toggle('active', this.currentLang === 'en');
        }
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-zh][data-en]');
        elements.forEach(el => {
            const text = el.getAttribute(`data-${this.currentLang}`);
            if (text) {
                el.textContent = text;
            }
        });
        
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
    }
}

// ========================================
// 移动端菜单
// ========================================
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.menu = document.getElementById('mobileMenu');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.menuBtn || !this.menu) return;
        
        this.menuBtn.addEventListener('click', () => this.toggle());
        
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.menuBtn.classList.toggle('active', this.isOpen);
        this.menu.classList.toggle('active', this.isOpen);
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    close() {
        this.isOpen = false;
        this.menuBtn.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// 滚动动画
// ========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-animate');
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        this.observeElements();
        this.handleNavbar();
        this.handleActiveNavLink();
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
                rootMargin: '0px 0px -80px 0px'
            }
        );

        this.elements.forEach(el => observer.observe(el));
    }

    handleNavbar() {
        if (!this.navbar) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.pageYOffset > 50) {
                        this.navbar.classList.add('scrolled');
                    } else {
                        this.navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleActiveNavLink() {
        if (!this.sections.length || !this.navLinks.length) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.navLinks.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                        });
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-100px 0px -50% 0px'
            }
        );

        this.sections.forEach(section => observer.observe(section));
    }
}

// ========================================
// 数字递增动画
// ========================================
class NumberCounter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
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
        const duration = 2500;
        const startTime = performance.now();

        const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
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
// 视差效果
// ========================================
class ParallaxEffect {
    constructor() {
        this.heroContent = document.querySelector('.hero-content');
        this.heroOrbit = document.querySelectorAll('.hero-orbit');
        this.init();
    }

    init() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        if (this.heroContent && scrollY < window.innerHeight) {
            this.heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            this.heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
        }
        
        this.heroOrbit.forEach((orbit, index) => {
            const speed = (index + 1) * 0.05;
            orbit.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
        });
    }
}

// ========================================
// 平滑滚动
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
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
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
// 卡片 3D 悬浮效果
// ========================================
class Card3DEffect {
    constructor() {
        this.cards = document.querySelectorAll('.tech-card, .position-card, .product-item');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        const inner = card.querySelector('.tech-card-inner') || card;
        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }

    handleMouseLeave(card) {
        const inner = card.querySelector('.tech-card-inner') || card;
        inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ========================================
// 按钮发光跟随效果
// ========================================
class ButtonGlowEffect {
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
                
                btn.style.setProperty('--glow-x', `${x}px`);
                btn.style.setProperty('--glow-y', `${y}px`);
            });
        });
    }
}

// ========================================
// 高亮项目悬浮效果
// ========================================
class HighlightEffect {
    constructor() {
        this.items = document.querySelectorAll('.highlight-item, .benefit-item');
        this.init();
    }

    init() {
        this.items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.2)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.boxShadow = '';
            });
        });
    }
}

// ========================================
// 流程步骤动画
// ========================================
class ProcessAnimation {
    constructor() {
        this.steps = document.querySelectorAll('.process-step');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 150);
                    }
                });
            },
            { threshold: 0.3 }
        );

        this.steps.forEach(step => {
            step.classList.add('scroll-animate');
            observer.observe(step);
        });
    }
}

// ========================================
// 初始化所有功能
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化各组件
    new StarField();
    new LanguageSwitcher();
    new MobileMenu();
    new ScrollAnimations();
    new NumberCounter();
    new ParallaxEffect();
    new SmoothScroll();
    new Card3DEffect();
    new ButtonGlowEffect();
    new HighlightEffect();
    new ProcessAnimation();
    
    // 添加页面加载完成类
    document.body.classList.add('loaded');
    
    // 初始触发一次滚动动画检查
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});

// ========================================
// 页面加载完成
// ========================================
window.addEventListener('load', () => {
    // 移除可能的预加载器
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
    
    // 确保所有动画正常工作
    document.querySelectorAll('.scroll-animate').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
});
