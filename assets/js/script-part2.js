/**
 * MCUverse — JavaScript Part 2
 * ════════════════════════════════════════════════════
 * Modules:
 *  1. API Layer   — fetch /api/movies & /api/characters từ CodeIgniter backend
 *  2. Render      — renderMoviesGrid() và renderCharactersGrid()
 *  3. Modal System — open / close / animate
 *  4. Phases Section Reveal
 *  5. Characters Section Reveal
 *  6. Infinity Gems tracker (Easter Egg)
 * ════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════
       1. API LAYER — MOVIE_DB được build từ fetch API
    ═══════════════════════════════════════════════════ */

    // MOVIE_DB bắt đầu rỗng, sẽ được populate sau khi fetch xong
    const MOVIE_DB = {};

    // Lấy base URL từ biến global được inject bởi CI3 View (main.php)
    // Fallback về relative path nếu dùng trực tiếp file HTML tĩnh
    const API_BASE = (window.MCU_API) || '/api';

    /**
     * Gọi song song 2 API, render UI, build MOVIE_DB cho modal.
     */
    async function loadFromAPI() {
        try {
            const [moviesRes, charsRes] = await Promise.all([
                fetch(API_BASE + '/movies'),
                fetch(API_BASE + '/characters'),
            ]);

            if (!moviesRes.ok || !charsRes.ok) {
                throw new Error('API response not ok');
            }

            const moviesJson = await moviesRes.json();
            const charsJson  = await charsRes.json();

            const movies = moviesJson.data || [];
            const chars  = charsJson.data  || [];

            // Render UI
            renderMoviesGrid(movies);
            renderCharactersGrid(chars);

            // Build MOVIE_DB (slug → object) cho modal system
            movies.forEach(m => {
                MOVIE_DB[m.slug] = {
                    title:      m.title,
                    year:       m.year,
                    phase:      m.phase_num,
                    type:       m.type === 'series' ? 'Disney+ Series' : 'Phim điện ảnh',
                    duration:   m.duration,
                    rating:     parseFloat(m.rating),
                    order:      String(m.view_order).padStart(2, '0'),
                    boxOffice:  m.box_office,
                    director:   m.director,
                    cast:       m.cast_list,
                    tagline:    m.tagline,
                    desc:       m.description,
                    bgColor:    m.bg_color,
                    connections: [],   // có thể mở rộng sau
                    watchUrl:   'https://disneyplus.com',
                    trailerUrl: 'https://youtube.com',
                };
            });

            // Cập nhật counter trong header + hero-badge
            const movieCount = movies.filter(m => m.type === 'movie').length;
            const seriesCount = movies.filter(m => m.type === 'series').length;
            const filterCount = document.getElementById('filter-count');
            if (filterCount) filterCount.textContent = `${movies.length} bộ phim & series`;
            const heroBadge = document.getElementById('hero-badge-num');
            if (heroBadge) heroBadge.textContent = movieCount;
            updateStatCounters(movieCount, seriesCount);

            // Reinitialize các animation reveal sau khi render xong
            initCharactersReveal();

        } catch (err) {
            console.warn('[MCUverse] API fetch failed, falling back to static mode:', err);
            // Giữ nguyên content HTML tĩnh từ index.html nếu API lỗi
            const moviesGrid = document.getElementById('movies-grid');
            if (moviesGrid && moviesGrid.children.length <= 1) {
                moviesGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;padding:40px">Không thể kết nối API. Kiểm tra XAMPP &amp; CodeIgniter.</p>';
            }
        }
    }

    /* ─────────────────────────────────────────────────
       2a. RENDER: Movies Grid
    ───────────────────────────────────────────────── */
    function renderMoviesGrid(movies) {
        const grid = document.getElementById('movies-grid');
        if (!grid) return;

        if (!movies.length) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;padding:40px">Không có phim nào.</p>';
            return;
        }

        grid.innerHTML = movies.map(m => {
            const isEndgame  = m.slug === 'avengers-endgame';
            const isFeatured = m.rating >= 8.2 && !isEndgame;
            const typeBadge  = m.type === 'series'
                ? `<span class="movie-card-type-badge movie-card-type-badge--series">Series</span>`
                : `<span class="movie-card-type-badge">Phim</span>`;
            const ratingBarStyle = isEndgame
                ? `width:${m.rating * 10}%;background:linear-gradient(90deg,var(--clr-red),var(--clr-gold))`
                : `width:${m.rating * 10}%`;
            const ratingStyle = isEndgame ? 'style="color:var(--clr-gold)"' : '';
            const featuredBadge = isEndgame
                ? `<div class="movie-card-featured-badge" style="background:var(--clr-gold);color:#000;">Huyền thoại</div>`
                : isFeatured
                ? `<div class="movie-card-featured-badge">Đỉnh cao</div>`
                : '';
            const glowStyle = isEndgame ? 'style="box-shadow:0 0 40px rgba(245,200,66,0.2)"' : '';

            return `
            <article class="movie-card${isFeatured ? ' movie-card--featured' : ''}${isEndgame ? ' movie-card--endgame' : ''}"
                     data-phase="${m.phase_num}" data-type="${m.type}" data-tilt data-movie-id="${m.slug}">
                <div class="movie-card-inner">
                    <div class="movie-card-poster">
                        <div class="poster-placeholder poster-placeholder--card"
                             style="--ph-color: ${m.bg_color}${m.slug === 'avengers-endgame' ? '; border:1px solid rgba(226,54,54,0.3)' : ''};"></div>
                        <div class="movie-card-overlay"></div>
                        <div class="movie-card-phase-badge">Phase ${m.phase_num}</div>
                        ${featuredBadge}
                    </div>
                    <div class="movie-card-info">
                        <div class="movie-card-meta-row">
                            <span class="movie-card-year">${m.year}</span>
                            ${typeBadge}
                        </div>
                        <h3 class="movie-card-title">${m.title}</h3>
                        <div class="movie-card-rating">
                            <div class="rating-stars"><div class="rating-fill" style="${ratingBarStyle}"></div></div>
                            <span class="rating-score" ${ratingStyle}>${m.rating || '—'}</span>
                        </div>
                        <div class="movie-card-actions">
                            <button class="card-btn card-btn--watch" data-open-modal="${m.slug}">
                                <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="2,1 10,6 2,11" fill="currentColor" /></svg>
                                Chi tiết
                            </button>
                            <button class="card-btn card-btn--info" data-slug="${m.slug}">Lưu</button>
                        </div>
                    </div>
                </div>
                <div class="movie-card-glow" ${glowStyle}></div>
            </article>`;
        }).join('');

        // Kích hoạt tilt effect nếu script.js có initTilt
        if (typeof initTilt === 'function') initTilt();
    }

    /* ─────────────────────────────────────────────────
       2b. RENDER: Characters Grid
    ───────────────────────────────────────────────── */
    function renderCharactersGrid(characters) {
        const grid = document.getElementById('characters-grid');
        if (!grid) return;

        if (!characters.length) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;padding:40px">Không có nhân vật nào.</p>';
            return;
        }

        grid.innerHTML = characters.map(c => {
            const phaseDots = c.phases.map((active, i) =>
                `<span class="char-phase-dot${active ? ' active' : ''}" title="Phase ${i + 1}"></span>`
            ).join('');

            return `
            <div class="char-card" data-char="${c.slug}" style="--char-clr: ${c.bg_color};">
                <div class="char-card-bg" style="--char-clr: ${c.bg_color};"></div>
                <div class="char-card-avatar">
                    <div class="char-avatar-placeholder" style="--av-clr: ${c.bg_color};">${c.avatar_initials}</div>
                </div>
                <div class="char-card-info">
                    <h4 class="char-name">${c.name}</h4>
                    <p class="char-alter">${c.alter_ego}</p>
                    <div class="char-phases">${phaseDots}</div>
                    <p class="char-status char-status--${c.status}">${c.status_label}</p>
                </div>
            </div>`;
        }).join('');
    }

    /* ─────────────────────────────────────────────────
       2c. Update hero stat counters after data loads
    ───────────────────────────────────────────────── */
    function updateStatCounters(movieCount, seriesCount) {
        const statMovies  = document.getElementById('stat-movies');
        const statSeries  = document.getElementById('stat-series');
        if (statMovies) { statMovies.dataset.count = movieCount;  statMovies.textContent = movieCount; }
        if (statSeries) { statSeries.dataset.count = seriesCount; statSeries.textContent = seriesCount; }
    }


    /* ═══════════════════════════════════════════════════
       2. MODAL SYSTEM
    ═══════════════════════════════════════════════════ */
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    let savedScrollY = 0;

    function openModal(movieId) {
        const data = MOVIE_DB[movieId];
        if (!data) {
            console.warn(`[MCUverse] No data found for movieId: "${movieId}"`);
            // Still open with a generic fallback
            populateModal({
                title: movieId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                year: '—', phase: '—', type: '—', duration: '—',
                rating: 0, order: '—', boxOffice: '—',
                director: '—', cast: '—', tagline: '', desc: 'Dữ liệu đang được cập nhật...',
                bgColor: '#333', connections: [], watchUrl: '#', trailerUrl: '#',
            });
        } else {
            populateModal(data);
        }

        savedScrollY = window.scrollY;
        document.body.style.overflow = 'hidden';
        modalBackdrop.classList.add('is-open');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        modal.scrollTop = 0;

        // Trap focus
        setTimeout(() => modalClose.focus(), 300);
    }

    function closeModal() {
        modalBackdrop.classList.remove('is-open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        window.scrollTo(0, savedScrollY);
    }

    function populateModal(data) {
        // Blurred background
        const bgImg = document.getElementById('modal-backdrop-img');
        bgImg.style.background = `radial-gradient(ellipse at 50% 0%, ${data.bgColor}33 0%, #0a0a0a 70%)`;

        // Poster placeholder
        const posterEl = document.getElementById('modal-poster');
        posterEl.innerHTML = `<div class="poster-placeholder" data-title="${data.title}" style="--ph-color: ${data.bgColor}; width:100%; height:100%;"></div>`;

        // Score ring
        const circumference = 150.8; // 2 * π * 24
        const offset = circumference - (data.rating / 10) * circumference;
        const scoreRing = document.getElementById('modal-score-ring');
        scoreRing.style.strokeDashoffset = circumference; // reset
        // Animate after a brief delay
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scoreRing.style.strokeDashoffset = offset;
                // Color based on score
                if (data.rating >= 8) scoreRing.style.stroke = '#F5C842';
                else if (data.rating >= 7) scoreRing.style.stroke = '#00d4ff';
                else scoreRing.style.stroke = '#E23636';
            });
        });

        document.getElementById('modal-score').textContent = data.rating;

        // Badges
        document.getElementById('modal-phase-badge').textContent = `Phase ${data.phase}`;
        document.getElementById('modal-type-badge').textContent = data.type;

        // Text content
        document.getElementById('modal-eyebrow').textContent = `Marvel Studios · ${data.year}`;
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-tagline').textContent = data.tagline || '';
        document.getElementById('modal-duration').textContent = data.duration;
        document.getElementById('modal-year').textContent = data.year;
        document.getElementById('modal-order').textContent = data.order;
        document.getElementById('modal-box-office').textContent = data.boxOffice;
        document.getElementById('modal-desc').textContent = data.desc;
        document.getElementById('modal-director').textContent = data.director;
        document.getElementById('modal-cast').textContent = data.cast;

        // Connections
        const connList = document.getElementById('modal-connections');
        connList.innerHTML = data.connections
            .map(c => `<span class="modal-connection-tag">${c}</span>`)
            .join('');

        // Watch / trailer buttons
        document.getElementById('modal-watch-btn').href = data.watchUrl;
        document.getElementById('modal-trailer-btn').onclick = () => window.open(data.trailerUrl, '_blank');

        // Reset bookmark
        document.getElementById('modal-bookmark-btn').classList.remove('is-saved');
    }

    // Close events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }

    // Keyboard close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop?.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Bookmark toggle
    const bookmarkBtn = document.getElementById('modal-bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            bookmarkBtn.classList.toggle('is-saved');
            // PHP integration point: send AJAX/fetch to save to user's watchlist
        });
    }

    // ── Open modal from cards and timeline items ──
    // PHP will render data-open-modal="<?= $movie['slug'] ?>" on cards
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-modal]');
        if (trigger) {
            e.preventDefault();
            const movieId = trigger.dataset.openModal;
            openModal(movieId);
        }
    });


    /* ═══════════════════════════════════════════════════
       3. PHASES SECTION — STAGGERED REVEAL
    ═══════════════════════════════════════════════════ */
    function initPhasesReveal() {
        const cards = document.querySelectorAll('.phase-card');
        if (!cards.length) return;

        cards.forEach(c => {
            c.style.opacity = '0';
            c.style.transform = 'translateY(30px)';
            c.style.transition = 'opacity 0.6s cubic-bezier(0.19,1,0.22,1), transform 0.6s cubic-bezier(0.19,1,0.22,1)';
        });

        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const idx = [...cards].indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, idx * 80);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        cards.forEach(c => obs.observe(c));
    }


    /* ═══════════════════════════════════════════════════
       4. CHARACTERS SECTION — REVEAL + HOVER GLOW
    ═══════════════════════════════════════════════════ */
    function initCharactersReveal() {
        const cards = document.querySelectorAll('.char-card');
        if (!cards.length) return;

        // Initial state
        cards.forEach(c => {
            c.style.opacity = '0';
            c.style.transform = 'translateY(24px) scale(0.97)';
            c.style.transition = 'opacity 0.5s cubic-bezier(0.19,1,0.22,1), transform 0.5s cubic-bezier(0.19,1,0.22,1), border-color 0.2s';
        });

        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const idx = [...cards].indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, idx * 60);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        cards.forEach(c => obs.observe(c));

        // Color-tinted hover glow using CSS custom property
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const bg = card.querySelector('.char-card-bg');
                const clr = getComputedStyle(card).getPropertyValue('--char-clr') || '';
                if (bg && clr) {
                    bg.style.opacity = '1';
                }
            });
        });
    }


    /* ═══════════════════════════════════════════════════
       5. INFINITY STONES TRACKER — Easter Egg
       Counts how many "gem" tags are currently visible
       Shows a mini tracker in the corner
    ═══════════════════════════════════════════════════ */
    function initInfinityTracker() {
        const gemTags = document.querySelectorAll('.tl-tag--gem');
        if (gemTags.length < 2) return; // not enough for the easter egg

        // Create tracker element
        const tracker = document.createElement('div');
        tracker.className = 'infinity-tracker';
        tracker.innerHTML = `
      <div class="it-label">Infinity Stones</div>
      <div class="it-gems" id="it-gems">
        <div class="it-gem it-gem--space"  title="Space Stone (Tesseract)"></div>
        <div class="it-gem it-gem--mind"   title="Mind Stone (Scepter/Vision)"></div>
        <div class="it-gem it-gem--reality" title="Reality Stone (Aether)"></div>
        <div class="it-gem it-gem--power"  title="Power Stone"></div>
        <div class="it-gem it-gem--time"   title="Time Stone (Eye of Agamotto)"></div>
        <div class="it-gem it-gem--soul"   title="Soul Stone"></div>
      </div>
    `;
        document.body.appendChild(tracker);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
      .infinity-tracker {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 800;
        background: rgba(10,10,10,0.9);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        padding: 10px 14px;
        backdrop-filter: blur(16px);
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.4s, transform 0.4s;
        pointer-events: none;
      }
      .infinity-tracker.is-visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      .it-label {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.3);
        margin-bottom: 8px;
        text-align: center;
      }
      .it-gems {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
      }
      .it-gem {
        width: 18px; height: 18px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.1);
        transition: box-shadow 0.4s, transform 0.3s;
        position: relative;
      }
      .it-gem::after {
        content: '';
        position: absolute;
        inset: 3px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
      }
      .it-gem.is-found { border-color: transparent; }
      .it-gem.is-found::after { display: none; }
      .it-gem--space  { background: #4fc3f7; }
      .it-gem--mind   { background: #ffee00; }
      .it-gem--reality{ background: #e53935; }
      .it-gem--power  { background: #9c27b0; }
      .it-gem--time   { background: #00ff88; }
      .it-gem--soul   { background: #ff9800; }
      .it-gem:not(.is-found) { filter: grayscale(1) brightness(0.3); }
      .it-gem.is-found {
        box-shadow: 0 0 12px currentColor;
        transform: scale(1.1);
      }
    `;
        document.head.appendChild(style);

        // Show after some scroll
        window.addEventListener('scroll', () => {
            tracker.classList.toggle('is-visible', window.scrollY > 400);
        }, { passive: true });

        // Observe gem tags — light up stones as user scrolls to them
        const gemMap = {
            'Space Stone': 'it-gem--space',
            'Reality Stone': 'it-gem--reality',
            'Mind Stone': 'it-gem--mind',
            'Power Stone': 'it-gem--power',
            'Time Stone': 'it-gem--time',
            'Soul Stone': 'it-gem--soul',
        };

        const gemObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const text = entry.target.textContent;
                    for (const [stone, cls] of Object.entries(gemMap)) {
                        if (text.includes(stone)) {
                            const gemEl = tracker.querySelector(`.${cls}`);
                            if (gemEl) {
                                gemEl.classList.add('is-found');
                                // Pulse animation
                                gemEl.animate([
                                    { transform: 'scale(1.5)', opacity: 1 },
                                    { transform: 'scale(1.1)', opacity: 1 }
                                ], { duration: 400, easing: 'cubic-bezier(0.19,1,0.22,1)', fill: 'forwards' });
                            }
                        }
                    }
                }
            });
        }, { threshold: 0.8 });

        gemTags.forEach(tag => gemObs.observe(tag));
    }


    /* ═══════════════════════════════════════════════════
       6. SMOOTH HORIZONTAL SCROLL for Phase Filter (mobile)
    ═══════════════════════════════════════════════════ */
    function initFilterTabsDrag() {
        const tabs = document.querySelector('.filter-tabs');
        if (!tabs) return;

        let isDown = false, startX, scrollLeft;

        tabs.addEventListener('mousedown', (e) => {
            isDown = true;
            tabs.style.cursor = 'grabbing';
            startX = e.pageX - tabs.offsetLeft;
            scrollLeft = tabs.scrollLeft;
        });

        tabs.addEventListener('mouseleave', () => { isDown = false; tabs.style.cursor = 'default'; });
        tabs.addEventListener('mouseup', () => { isDown = false; tabs.style.cursor = 'default'; });
        tabs.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - tabs.offsetLeft;
            tabs.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });
    }


    /* ═══════════════════════════════════════════════════
       INIT
    ═══════════════════════════════════════════════════ */
    function init() {
        initPhasesReveal();
        // initCharactersReveal() sẽ được gọi LẠI sau loadFromAPI()
        // để đảm bảo các .char-card đã được render vào DOM
        initInfinityTracker();
        initFilterTabsDrag();

        // === GỌI API — tải data động từ CodeIgniter backend ===
        loadFromAPI();

        console.log(
            '%cMCUverse Part 2 loaded ✓ (API mode)',
            'color: #00d4ff; font-family: monospace; font-size: 13px; font-weight: bold;'
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();