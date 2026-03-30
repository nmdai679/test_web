/**
 * MCUverse — Master JavaScript
 * ════════════════════════════════════════════════════
 * Modules:
 *  1. Custom Cursor
 *  2. Starfield Canvas
 *  3. Navbar Scroll Behavior
 *  4. Hero Parallax (Mouse)
 *  5. Hero Counter Animation
 *  6. Search & Filter Bar
 *  7. Timeline Scroll-triggered Animation
 *  8. Movie Card 3D Tilt Effect
 *  9. Movie Grid Intersection Observer
 * ════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════
       UTILITIES
    ═══════════════════════════════════════════════════ */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const map = (v, in1, in2, out1, out2) =>
        out1 + ((v - in1) / (in2 - in1)) * (out2 - out1);

    /* ═══════════════════════════════════════════════════
       1. CUSTOM CURSOR
    ═══════════════════════════════════════════════════ */
    function initCursor() {
        const cursor = $('#cursor');
        const follower = $('#cursor-follower');
        if (!cursor || !follower) return;

        let mx = 0, my = 0;
        let fx = 0, fy = 0;
        let rafId;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });

        function trackFollower() {
            fx = lerp(fx, mx, 0.12);
            fy = lerp(fy, my, 0.12);
            follower.style.left = fx + 'px';
            follower.style.top = fy + 'px';
            rafId = requestAnimationFrame(trackFollower);
        }
        trackFollower();

        // Hover state on interactive elements
        const hoverEls = 'a, button, select, input, [data-tilt], .filter-tab, .filter-chip';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverEls)) {
                cursor.classList.add('is-hovering');
                follower.classList.add('is-hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverEls)) {
                cursor.classList.remove('is-hovering');
                follower.classList.remove('is-hovering');
            }
        });

        // Hide on mobile
        document.addEventListener('touchstart', () => {
            cursor.style.display = 'none';
            follower.style.display = 'none';
        }, { once: true });
    }


    /* ═══════════════════════════════════════════════════
       2. STARFIELD CANVAS
    ═══════════════════════════════════════════════════ */
    function initStarfield() {
        const canvas = $('#hero-stars');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let W, H, stars = [];
        const NUM_STARS = 200;

        function resize() {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }

        function createStars() {
            stars = Array.from({ length: NUM_STARS }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.2 + 0.2,
                speed: Math.random() * 0.15 + 0.03,
                opacity: Math.random() * 0.7 + 0.1,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                // Occasional cyan stars
                isCyan: Math.random() < 0.08,
            }));
        }

        function drawStars(t) {
            ctx.clearRect(0, 0, W, H);

            stars.forEach((s) => {
                s.twinkle += s.twinkleSpeed;
                const alpha = s.opacity * (0.5 + 0.5 * Math.sin(s.twinkle));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = s.isCyan
                    ? `rgba(0, 212, 255, ${alpha})`
                    : `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
            });
        }

        let lastT = 0;
        function animate(t) {
            if (t - lastT > 16) { // ~60fps cap
                drawStars(t);
                lastT = t;
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => { resize(); createStars(); });
        resize();
        createStars();
        requestAnimationFrame(animate);
    }


    /* ═══════════════════════════════════════════════════
       3. NAVBAR SCROLL BEHAVIOR
    ═══════════════════════════════════════════════════ */
    function initNavbar() {
        const navbar = $('#navbar');
        if (!navbar) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    navbar.classList.toggle('is-scrolled', window.scrollY > 60);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }


    /* ═══════════════════════════════════════════════════
       4. HERO PARALLAX (Mouse)
       — text and background layers shift slightly
    ═══════════════════════════════════════════════════ */
    function initHeroParallax() {
        const hero = $('#hero');
        if (!hero) return;

        const layers = $$('[data-parallax]', hero);
        const titleWrapper = $('#hero-title-wrapper');

        let targetX = 0, targetY = 0;
        let currX = 0, currY = 0;
        let rafRunning = false;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            // Normalize -1 to 1
            targetX = (e.clientX - rect.left) / rect.width * 2 - 1;
            targetY = (e.clientY - rect.top) / rect.height * 2 - 1;

            if (!rafRunning) {
                rafRunning = true;
                requestAnimationFrame(animateParallax);
            }
        });

        hero.addEventListener('mouseleave', () => {
            targetX = 0; targetY = 0;
        });

        function animateParallax() {
            currX = lerp(currX, targetX, 0.05);
            currY = lerp(currY, targetY, 0.05);

            // Background layers
            layers.forEach((el) => {
                const depth = parseFloat(el.dataset.parallax) || 0.1;
                const tx = currX * depth * 40;
                const ty = currY * depth * 30;
                el.style.transform = `translate(${tx}px, ${ty}px)`;
            });

            // Title subtle shift
            if (titleWrapper) {
                const tx = currX * 12;
                const ty = currY * 6;
                titleWrapper.style.transform = `translate(${tx}px, ${ty}px)`;
            }

            const still = Math.abs(targetX - currX) < 0.001 && Math.abs(targetY - currY) < 0.001;
            if (!still) {
                requestAnimationFrame(animateParallax);
            } else {
                rafRunning = false;
            }
        }
    }


    /* ═══════════════════════════════════════════════════
       5. HERO COUNTER ANIMATION
    ═══════════════════════════════════════════════════ */
    function initCounters() {
        const counters = $$('[data-count]');
        if (!counters.length) return;

        const raf = (fn) => requestAnimationFrame(fn);

        function animateCount(el) {
            const target = parseInt(el.dataset.count, 10);
            const duration = 1600;
            const start = performance.now();

            // Easing: ease-out-cubic
            const ease = (t) => 1 - Math.pow(1 - t, 3);

            function tick(now) {
                const elapsed = now - start;
                const progress = clamp(elapsed / duration, 0, 1);
                const value = Math.round(ease(progress) * target);
                el.textContent = value.toLocaleString('vi');
                if (progress < 1) raf(() => tick(performance.now()));
            }

            raf(() => tick(performance.now()));
        }

        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((el) => obs.observe(el));
    }


    /* ═══════════════════════════════════════════════════
       6. SEARCH & FILTER BAR
    ═══════════════════════════════════════════════════ */
    function initFilterBar() {
        const searchInput = $('#search-input');
        const searchWrapper = $('#search-wrapper');
        const searchClear = $('#search-clear');
        const filterBar = $('#filter-bar');
        const filterReset = $('#filter-reset');
        const filterCount = $('#filter-count');
        const phaseTabs = $$('.filter-tab[data-filter="phase"]');
        const typeChips = $$('.filter-chip[data-filter="type"]');
        const movieCards = $$('.movie-card');
        const sortSelect = $('#sort-select');

        if (!searchInput) return;

        let state = {
            query: '',
            phase: 'all',
            type: 'all',
            sort: 'timeline',
        };

        /* ── Search expand / focus ── */
        searchInput.addEventListener('focus', () => {
            searchWrapper.classList.add('is-focused');
            searchInput.classList.add('is-expanded');
            filterBar.classList.add('is-focused');
        });

        searchInput.addEventListener('blur', () => {
            if (!searchInput.value) {
                searchWrapper.classList.remove('is-focused');
                searchInput.classList.remove('is-expanded');
                filterBar.classList.remove('is-focused');
            }
        });

        searchInput.addEventListener('input', () => {
            state.query = searchInput.value.trim().toLowerCase();
            searchClear.classList.toggle('is-visible', !!searchInput.value);
            applyFilters();
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            state.query = '';
            searchClear.classList.remove('is-visible');
            searchInput.focus();
            applyFilters();
        });

        /* ── Phase tab filter ── */
        phaseTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                phaseTabs.forEach((t) => t.classList.remove('filter-tab--active'));
                tab.classList.add('filter-tab--active');
                state.phase = tab.dataset.value;
                applyFilters();
            });
        });

        /* ── Type chip filter ── */
        typeChips.forEach((chip) => {
            chip.addEventListener('click', () => {
                typeChips.forEach((c) => c.classList.remove('filter-chip--active'));
                chip.classList.add('filter-chip--active');
                state.type = chip.dataset.value;
                applyFilters();
            });
        });

        /* ── Sort ── */
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                state.sort = sortSelect.value;
                applyFilters();
            });
        }

        /* ── Reset ── */
        if (filterReset) {
            filterReset.addEventListener('click', () => {
                state = { query: '', phase: 'all', type: 'all', sort: 'timeline' };
                searchInput.value = '';
                searchClear.classList.remove('is-visible');
                phaseTabs.forEach((t, i) => t.classList.toggle('filter-tab--active', i === 0));
                typeChips.forEach((c, i) => c.classList.toggle('filter-chip--active', i === 0));
                sortSelect.value = 'timeline';
                applyFilters();
            });
        }

        /* ── Core filter logic ── */
        function applyFilters() {
            let visible = 0;

            movieCards.forEach((card) => {
                const cardPhase = card.dataset.phase || 'all';
                const cardType = card.dataset.type || '';
                const cardTitle = ($('.movie-card-title', card)?.textContent || '').toLowerCase();

                const matchPhase = state.phase === 'all' || cardPhase === state.phase;
                const matchType = state.type === 'all' || cardType === state.type;
                const matchQuery = !state.query || cardTitle.includes(state.query);

                const show = matchPhase && matchType && matchQuery;
                card.style.display = show ? '' : 'none';

                // Re-trigger reveal animation
                if (show) {
                    card.classList.remove('is-revealed');
                    requestAnimationFrame(() => card.classList.add('is-revealed'));
                    visible++;
                }
            });

            // Update count
            if (filterCount) {
                filterCount.textContent = `${visible} kết quả`;
            }

            // Show/hide reset
            const isDirty = state.phase !== 'all' || state.type !== 'all' || state.query;
            if (filterReset) filterReset.classList.toggle('is-visible', !!isDirty);
        }
    }


    /* ═══════════════════════════════════════════════════
       7. TIMELINE SCROLL-TRIGGERED ANIMATION
       — spine fills as user scrolls, items fade in
    ═══════════════════════════════════════════════════ */
    function initTimeline() {
        const container = $('#timeline-container');
        const spineFill = $('#timeline-spine-fill');
        const items = $$('.timeline-item');
        const phases = $$('.timeline-phase-label');

        if (!container || !spineFill) return;

        /* ── Spine fill on scroll ── */
        function updateSpine() {
            const rect = container.getBoundingClientRect();
            const wh = window.innerHeight;

            // How far through the container we are
            const progress = clamp(
                (wh * 0.6 - rect.top) / rect.height,
                0, 1
            );

            spineFill.style.height = (progress * 100) + '%';
        }

        /* ── Item reveal observer ── */
        const itemObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Stagger based on item order
                    const order = parseInt(entry.target.dataset.order, 10) || 0;
                    entry.target.style.transitionDelay = (order % 3) * 60 + 'ms';
                    entry.target.classList.add('is-visible');
                    itemObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

        items.forEach((item) => itemObs.observe(item));

        /* ── Phase label observer ── */
        const phaseObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('is-active', entry.isIntersecting);
            });
        }, { threshold: 0.5 });

        phases.forEach((phase) => phaseObs.observe(phase));

        /* ── Scroll listener ── */
        window.addEventListener('scroll', updateSpine, { passive: true });
        updateSpine(); // initial
    }


    /* ═══════════════════════════════════════════════════
       8. MOVIE CARD 3D TILT EFFECT
       — hardware-accelerated CSS transform
       — shadow tracks tilt direction
    ═══════════════════════════════════════════════════ */
    function initTiltCards() {
        const cards = $$('[data-tilt]');
        if (!cards.length) return;

        const MAX_TILT = 14; // degrees
        const PERSPECTIVE = 800;

        cards.forEach((card) => {
            let rafId = null;
            let targetRX = 0, targetRY = 0;
            let currRX = 0, currRY = 0;

            function applyTilt() {
                currRX = lerp(currRX, targetRX, 0.1);
                currRY = lerp(currRY, targetRY, 0.1);

                card.querySelector('.movie-card-inner').style.transform =
                    `perspective(${PERSPECTIVE}px) rotateX(${currRX}deg) rotateY(${currRY}deg) scale3d(1.03, 1.03, 1.03)`;

                // Shift glow shadow in the tilt direction
                const glowX = currRY * 2;
                const glowY = -currRX * 2;
                const glow = card.querySelector('.movie-card-glow');
                if (glow) {
                    glow.style.boxShadow =
                        `${glowX}px ${glowY}px 40px rgba(226,54,54,0.4),
             0 16px 48px rgba(0,0,0,0.8)`;
                }

                const still = Math.abs(targetRX - currRX) < 0.05 &&
                    Math.abs(targetRY - currRY) < 0.05;
                if (!still) {
                    rafId = requestAnimationFrame(applyTilt);
                } else {
                    rafId = null;
                }
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const relX = (e.clientX - rect.left) / rect.width;   // 0–1
                const relY = (e.clientY - rect.top) / rect.height;  // 0–1

                targetRY = map(relX, 0, 1, -MAX_TILT, MAX_TILT);
                targetRX = -map(relY, 0, 1, -MAX_TILT, MAX_TILT);

                if (!rafId) {
                    rafId = requestAnimationFrame(applyTilt);
                }
            });

            card.addEventListener('mouseleave', () => {
                targetRX = 0; targetRY = 0;
                if (!rafId) {
                    rafId = requestAnimationFrame(applyTilt);
                }

                // Reset glow
                const glow = card.querySelector('.movie-card-glow');
                if (glow) glow.style.boxShadow = '';

                // Reset inner
                const inner = card.querySelector('.movie-card-inner');
                if (inner) inner.style.transform = '';
            });

            // Scale up poster image on hover
            card.addEventListener('mouseenter', () => {
                const img = card.querySelector('.movie-card-poster img, .poster-placeholder--card');
                if (img) img.style.transform = 'scale(1.06)';
            });

            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('.movie-card-poster img, .poster-placeholder--card');
                if (img) img.style.transform = '';
            });
        });
    }


    /* ═══════════════════════════════════════════════════
       9. MOVIE GRID — STAGGERED INTERSECTION OBSERVER
    ═══════════════════════════════════════════════════ */
    function initMovieGrid() {
        const cards = $$('.movie-card, .character-card');
        if (!cards.length) return;

        const gridObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = cards.indexOf(entry.target);
                    const stagger = (index % 6) * 60;
                    setTimeout(() => {
                        entry.target.classList.add('is-revealed');
                    }, stagger);
                    gridObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        cards.forEach((card) => {
            card.style.opacity = '0';
            gridObs.observe(card);
        });

        // Phase cards fade-in
        const phaseCards = $$('.phase-card');
        const phaseObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = phaseCards.indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 80);
                    phaseObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        phaseCards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s var(--ease-out-expo), transform 0.6s var(--ease-out-expo)';
            phaseObs.observe(card);
        });
    }


    /* ═══════════════════════════════════════════════════
       10. SMOOTH ANCHOR SCROLLING (Accounting for sticky bar)
    ═══════════════════════════════════════════════════ */
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const id = anchor.getAttribute('href').slice(1);
                const target = document.getElementById(id);
                if (!target) return;

                e.preventDefault();

                const navHeight = parseInt(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue('--nav-height'), 10
                ) || 72;

                const offset = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

                window.scrollTo({ top: offset, behavior: 'smooth' });
            });
        });
    }


    /* ═══════════════════════════════════════════════════
       INIT — run all modules after DOM ready
    ═══════════════════════════════════════════════════ */
    function init() {
        initCursor();
        initStarfield();
        initNavbar();
        initHeroParallax();
        initCounters();
        initFilterBar();
        initTimeline();
        initTiltCards();
        initMovieGrid();
        initSmoothScroll();

        console.log(
            '%cMCUverse UI System loaded ✓',
            'color: #E23636; font-family: monospace; font-size: 13px; font-weight: bold;'
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();