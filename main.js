/* =========================================
   ATELIER VOSS — Premium Interactions v5
   GSAP + Lenis + ScrollTrigger
   ========================================= */
(function () {
    'use strict';

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];

    /* =========================================
       WAIT FOR GSAP + LENIS TO LOAD
       ========================================= */
    function init() {
        if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') {
            requestAnimationFrame(init);
            return;
        }
        gsap.registerPlugin(ScrollTrigger);
        run();
    }
    requestAnimationFrame(init);

    function run() {

        /* =========================================
           LENIS SMOOTH SCROLL
           ========================================= */
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        /* =========================================
           SCROLL PROGRESS
           ========================================= */
        const scrollProgress = $('#scrollProgress');
        if (scrollProgress) {
            gsap.to(scrollProgress, {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.3,
                },
            });
        }

        /* =========================================
           PRELOADER SEQUENCE
           ========================================= */
        const preloader = $('#preloader');
        const preloaderCounter = $('#preloaderCounter');
        const hero = $('.hero');
        const body = document.body;
        body.style.overflow = 'hidden';

        const preloaderTl = gsap.timeline({
            onComplete: () => {
                lenis.start();
                heroReveal();
            }
        });

        preloaderTl
            .to(preloaderCounter, {
                textContent: 100,
                duration: 1.6,
                snap: { textContent: 1 },
                ease: 'power2.inOut',
            })
            .to('.preloader__bar-fill', {
                scaleX: 1,
                duration: 1.6,
                ease: 'power2.inOut',
            }, 0)
            .to('.preloader__text', {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
            }, 0.3)
            .to('.preloader', {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.inOut',
            }, '+=0.3')
            .set('.preloader', { visibility: 'hidden', pointerEvents: 'none' })
            .call(() => { body.style.overflow = ''; });

        /* =========================================
           HERO REVEAL
           ========================================= */
        function heroReveal() {
            if (!hero) return;
            hero.classList.add('is-revealed');

            const heroTl = gsap.timeline();

            heroTl
                .fromTo('.hero__bg-img',
                    { scale: 1.2, filter: 'blur(8px)' },
                    { scale: 1, filter: 'blur(0px)', duration: 2.5, ease: 'power3.out' }
                )
                .fromTo('.hero__badge',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                    '-=1.8'
                )
                .fromTo('.hero__title-line',
                    { yPercent: 110 },
                    { yPercent: 0, duration: 1.3, stagger: 0.18, ease: 'power3.out' },
                    '-=1.4'
                )
                .fromTo('.hero__subtitle',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                    '-=0.8'
                )
                .fromTo('.hero__actions',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                    '-=0.6'
                )
                .fromTo('.hero__scroll',
                    { opacity: 0 },
                    { opacity: 1, duration: 1, ease: 'power2.out' },
                    '-=0.3'
                );

            /* Hero parallax */
            gsap.to('.hero__bg-img', {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5,
                },
            });
        }

        /* =========================================
           ABOUT SECTION
           ========================================= */
        const aboutImage = $('.about__image img');
        if (aboutImage) {
            gsap.fromTo(aboutImage,
                { scale: 1.2, filter: 'blur(6px)' },
                {
                    scale: 1, filter: 'blur(0px)',
                    duration: 1.5, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.about__image',
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            /* Parallax on about image */
            gsap.to(aboutImage, {
                yPercent: -8,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.5,
                },
            });
        }

        /* About content reveal */
        gsap.fromTo('.about__content .tag',
            { opacity: 0, x: -20 },
            {
                opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.about__content', start: 'top 80%' },
            }
        );

        gsap.fromTo('.about__heading',
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '.about__content', start: 'top 75%' },
            }
        );

        /* Split heading text for character reveals */
        $$('.about__heading').forEach(heading => {
            const text = heading.innerHTML;
            const emMatch = text.match(/<em>(.*?)<\/em>/);
            if (emMatch) {
                const before = text.split('<em>')[0];
                const inner = emMatch[1];
                const after = text.split('</em>')[1] || '';
                heading.innerHTML = before + '<em>' + inner.split('').map(c =>
                    c === ' ' ? ' ' : `<span style="display:inline-block">${c}</span>`
                ).join('') + '</em>' + after;

                gsap.fromTo(heading.querySelectorAll('em span'),
                    { opacity: 0, y: 20, rotateX: -90 },
                    {
                        opacity: 1, y: 0, rotateX: 0,
                        duration: 0.6, stagger: 0.03, ease: 'power3.out',
                        scrollTrigger: { trigger: heading, start: 'top 80%' },
                    }
                );
            }
        });

        gsap.fromTo('.about__statement',
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.about__statement', start: 'top 85%' },
            }
        );

        gsap.fromTo('.about__cta',
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.about__cta', start: 'top 90%' },
            }
        );

        /* =========================================
           SERVICES — Glass Panels
           ========================================= */
        gsap.fromTo('.services__heading',
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '.services__header', start: 'top 80%' },
            }
        );

        gsap.fromTo('.tag--light',
            { opacity: 0, x: -20 },
            {
                opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.services__header', start: 'top 85%' },
            }
        );

        $$('.glass-panel').forEach((panel, i) => {
            gsap.fromTo(panel,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.8,
                    delay: i * 0.08,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: panel,
                        start: 'top 90%',
                    },
                }
            );
        });

        /* Auto-open first panel */
        setTimeout(() => {
            const firstPanel = $('.glass-panel');
            if (firstPanel) firstPanel.classList.add('is-active');
        }, 3500);

        /* =========================================
           GALLERY
           ========================================= */
        gsap.fromTo('.gallery__heading',
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '.gallery__header', start: 'top 80%' },
            }
        );

        $$('.gallery__item').forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, y: 40, scale: 0.96 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 1, delay: i * 0.06,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                    },
                }
            );

            /* Image parallax inside gallery items (desktop only) */
            if (window.innerWidth >= 1024) {
                const img = item.querySelector('img');
                if (img) {
                    gsap.fromTo(img,
                        { scale: 1.2 },
                        {
                            scale: 1.05,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: 0.5,
                            },
                        }
                    );
                }
            }
        });

        /* =========================================
           REVIEWS
           ========================================= */
        $$('.review-card').forEach((card, i) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                },
            });

            tl.fromTo(card,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
            );

            const portrait = card.querySelector('.review-card__portrait');
            if (portrait) {
                tl.fromTo(portrait,
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
                    '-=0.7'
                );
            }

            const mark = card.querySelector('.review-card__mark');
            if (mark) {
                tl.fromTo(mark,
                    { opacity: 0, scale: 0.5 },
                    { opacity: 0.3, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
                    '-=0.6'
                );
            }

            const quote = card.querySelector('.review-card__quote');
            if (quote) {
                tl.fromTo(quote,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                    '-=0.5'
                );
            }

            const author = card.querySelector('.review-card__author');
            if (author) {
                tl.fromTo(author,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
                    '-=0.4'
                );
            }
        });

        /* =========================================
           BOOKING
           ========================================= */
        /* Booking bg parallax */
        const bookingBgImg = $('.booking__bg img');
        if (bookingBgImg) {
            gsap.fromTo(bookingBgImg,
                { scale: 1.15 },
                {
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.booking',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.5,
                    },
                }
            );
        }

        const bookingTl = gsap.timeline({
            scrollTrigger: { trigger: '.booking', start: 'top 60%' },
        });

        bookingTl
            .fromTo('.booking .tag',
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
            )
            .fromTo('.booking__heading',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                '-=0.5'
            )
            .fromTo('.booking__sub',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                '-=0.6'
            )
            .fromTo('.booking__glass',
                { opacity: 0, y: 30, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
                '-=0.5'
            );

        /* =========================================
           SECTION DIVIDERS
           ========================================= */
        $$('.section-divider').forEach(div => {
            gsap.fromTo(div.querySelectorAll('.section-divider__line'),
                { scaleX: 0 },
                {
                    scaleX: 1, duration: 1, stagger: 0.1,
                    ease: 'power3.inOut',
                    scrollTrigger: { trigger: div, start: 'top 90%' },
                }
            );
            gsap.fromTo(div.querySelector('.section-divider__diamond'),
                { opacity: 0, scale: 0, rotation: 0 },
                {
                    opacity: 0.5, scale: 1, rotation: 45, duration: 0.6,
                    ease: 'back.out(1.7)',
                    scrollTrigger: { trigger: div, start: 'top 90%' },
                }
            );
        });

        /* =========================================
           FOOTER
           ========================================= */
        gsap.fromTo('.footer__inner',
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '.footer', start: 'top 90%' },
            }
        );

        /* =========================================
           GLASS PANEL INTERACTIONS
           ========================================= */
        const glassPanels = $$('.glass-panel');
        glassPanels.forEach(panel => {
            panel.addEventListener('click', () => {
                const wasActive = panel.classList.contains('is-active');
                glassPanels.forEach(p => p.classList.remove('is-active'));
                if (!wasActive) panel.classList.add('is-active');
            });
        });

        /* =========================================
           MOBILE MENU
           ========================================= */
        const burgerBtn = $('#burgerBtn');
        const mobileMenu = $('#mobileMenu');
        let menuOpen = false;

        burgerBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;
            burgerBtn.classList.toggle('is-active', menuOpen);
            mobileMenu.classList.toggle('is-open', menuOpen);
            if (menuOpen) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        $$('.mobile-menu__link').forEach(link => {
            link.addEventListener('click', e => {
                if (menuOpen) {
                    e.preventDefault();
                    burgerBtn.classList.remove('is-active');
                    mobileMenu.classList.remove('is-open');
                    lenis.start();
                    setTimeout(() => {
                        const t = $(link.getAttribute('href'));
                        if (t) lenis.scrollTo(t, { offset: -80 });
                    }, 400);
                }
            });
        });

        /* =========================================
           SMOOTH SCROLL
           ========================================= */
        $$('a[href^="#"]:not(.mobile-menu__link)').forEach(a => {
            a.addEventListener('click', e => {
                const id = a.getAttribute('href');
                if (id === '#') return;
                const t = $(id);
                if (t) {
                    e.preventDefault();
                    lenis.scrollTo(t, { offset: -80 });
                }
            });
        });

        /* =========================================
           HEADER SCROLL STATE
           ========================================= */
        const header = $('#header');
        ScrollTrigger.create({
            start: 80,
            onUpdate: (self) => {
                header.classList.toggle('is-scrolled', self.progress > 0);
            },
        });

        /* =========================================
           GALLERY LIGHTBOX
           ========================================= */
        const lightbox = $('#lightbox');
        const lightboxImg = $('#lightboxImg');

        $$('.gallery__link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const src = link.getAttribute('data-lightbox');
                if (src && lightbox && lightboxImg) {
                    lightboxImg.src = src;
                    lightbox.classList.add('is-open');
                    lenis.stop();
                }
            });
        });

        function closeLightbox() {
            if (lightbox) {
                lightbox.classList.remove('is-open');
                lenis.start();
            }
        }

        $$('.lightbox__close').forEach(btn => btn.addEventListener('click', closeLightbox));
        if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

        /* =========================================
           BOOKING FORM
           ========================================= */
        const bookingForm = $('#bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', e => {
                e.preventDefault();
                const btn = bookingForm.querySelector('.booking__submit');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<span>Message Sent</span>';
                gsap.to(btn, { backgroundColor: 'transparent', color: '#c8a96a', borderColor: '#c8a96a', duration: 0.4 });
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    gsap.to(btn, { backgroundColor: '#c8a96a', color: '#171514', borderColor: '#c8a96a', duration: 0.4 });
                    bookingForm.reset();
                }, 3000);
            });
        }

        /* =========================================
           IMAGE HOVER EFFECTS
           ========================================= */
        $$('.gallery__link').forEach(link => {
            const img = link.querySelector('img');
            const caption = link.querySelector('.gallery__caption');
            if (!img || !caption) return;

            link.addEventListener('mouseenter', () => {
                gsap.to(img, { scale: 1.06, duration: 1.2, ease: 'power2.out' });
                gsap.fromTo(caption, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(img, { scale: 1, duration: 1.2, ease: 'power2.out' });
                gsap.to(caption, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.in' });
            });
        });

        /* =========================================
            MOBILE GALLERY TAP ANIMATION
            ========================================= */
        if (window.innerWidth < 768) {
            $$('.gallery__link').forEach(link => {
                link.addEventListener('touchstart', () => {
                    gsap.to(link, { scale: 0.96, duration: 0.3, ease: 'power2.out' });
                }, { passive: true });
                link.addEventListener('touchend', () => {
                    gsap.to(link, { scale: 1, duration: 0.5, ease: 'power3.out' });
                }, { passive: true });
            });
        }

        /* =========================================
            MAGNETIC HOVER EFFECT
            ========================================= */
        $$('.magnetic').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            });
        });

        /* =========================================
            BUTTON HOVER SHINE EFFECT
            ========================================= */
        $$('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.fromTo(btn,
                    { boxShadow: '0 4px 20px rgba(200,169,106,0.2)' },
                    { boxShadow: '0 8px 32px rgba(200,169,106,0.35)', duration: 0.4, ease: 'power2.out' }
                );
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { boxShadow: '0 4px 20px rgba(200,169,106,0)', duration: 0.4, ease: 'power2.out' });
            });
        });

    } /* end run() */
})();
