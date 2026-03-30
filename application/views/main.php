<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * application/views/main.php
 * ─────────────────────────────────────────────────────────────
 * View chính của MCUverse SPA.
 * Giữ nguyên toàn bộ HTML từ index.html,
 * chỉ thay các đường dẫn tĩnh bằng base_url() của CI3.
 *
 * base_url() được load trong CI3 nhờ helper 'url'
 * → thêm $this->load->helper('url') trong Welcome controller nếu cần.
 *
 * JavaScript sẽ tự fetch /api/movies và /api/characters để điền data.
 */
?>
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MCU Universe — Bách Khoa &amp; Lộ Trình Xem Phim</title>
    <meta name="description" content="Bách khoa toàn thư MCU — lộ trình xem phim Marvel theo thứ tự thời gian, đầy đủ 6 phases." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;1,300&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="<?= base_url('assets/css/style.css') ?>" />
    <link rel="stylesheet" href="<?= base_url('assets/css/style-part2.css') ?>" />
</head>

<body>

    <!-- CURSOR -->
    <div class="cursor" id="cursor"></div>
    <div class="cursor-follower" id="cursor-follower"></div>

    <!-- ═══════════════════════════════════════════
       MOVIE DETAIL MODAL — JS điền data vào
  ═══════════════════════════════════════════ -->
    <div class="modal-backdrop" id="modal-backdrop" aria-hidden="true">
        <div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button class="modal-close" id="modal-close" aria-label="Đóng">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
            </button>
            <div class="modal-backdrop-img" id="modal-backdrop-img"></div>
            <div class="modal-layout">
                <div class="modal-poster-col">
                    <div class="modal-poster" id="modal-poster"></div>
                    <div class="modal-poster-meta">
                        <div class="modal-score-ring">
                            <svg viewBox="0 0 56 56" class="score-ring-svg">
                                <circle cx="28" cy="28" r="24" class="score-ring-track" />
                                <circle cx="28" cy="28" r="24" class="score-ring-fill" id="modal-score-ring" stroke-dasharray="150.8" stroke-dashoffset="150.8" />
                            </svg>
                            <span class="modal-score-num" id="modal-score">0</span>
                        </div>
                        <div class="modal-poster-badges">
                            <span class="modal-phase-badge" id="modal-phase-badge">Phase 1</span>
                            <span class="modal-type-badge" id="modal-type-badge">Phim</span>
                        </div>
                    </div>
                </div>
                <div class="modal-info-col">
                    <p class="modal-eyebrow" id="modal-eyebrow">Marvel Studios · 2008</p>
                    <h2 class="modal-title" id="modal-title">Iron Man</h2>
                    <p class="modal-tagline" id="modal-tagline"></p>
                    <div class="modal-stats-row">
                        <div class="modal-stat"><span class="modal-stat-icon">⏱</span><div>
                            <span class="modal-stat-val" id="modal-duration">—</span>
                            <span class="modal-stat-lbl">Thời lượng</span></div></div>
                        <div class="modal-stat"><span class="modal-stat-icon">📅</span><div>
                            <span class="modal-stat-val" id="modal-year">—</span>
                            <span class="modal-stat-lbl">Năm ra mắt</span></div></div>
                        <div class="modal-stat"><span class="modal-stat-icon">🎬</span><div>
                            <span class="modal-stat-val" id="modal-order">—</span>
                            <span class="modal-stat-lbl">Thứ tự xem</span></div></div>
                        <div class="modal-stat"><span class="modal-stat-icon">💰</span><div>
                            <span class="modal-stat-val" id="modal-box-office">—</span>
                            <span class="modal-stat-lbl">Doanh thu</span></div></div>
                    </div>
                    <div class="modal-divider"></div>
                    <p class="modal-desc" id="modal-desc"></p>
                    <div class="modal-connections">
                        <h4 class="modal-connections-title">Kết nối với vũ trụ</h4>
                        <div class="modal-connections-list" id="modal-connections"></div>
                    </div>
                    <div class="modal-credits">
                        <div class="modal-credit">
                            <span class="modal-credit-lbl">Đạo diễn</span>
                            <span class="modal-credit-val" id="modal-director">—</span>
                        </div>
                        <div class="modal-credit">
                            <span class="modal-credit-lbl">Diễn viên chính</span>
                            <span class="modal-credit-val" id="modal-cast">—</span>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <a class="btn btn--primary modal-watch-btn" id="modal-watch-btn" href="#">
                            <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="3,2 13,8 3,14" fill="currentColor" /></svg>
                            Xem trên Disney+
                        </a>
                        <button class="btn btn--ghost modal-trailer-btn" id="modal-trailer-btn">
                            <svg width="16" height="16" viewBox="0 0 16 16">
                                <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2" fill="none" />
                                <polygon points="6,5 11,8 6,11" fill="currentColor" />
                            </svg>Trailer
                        </button>
                        <button class="modal-bookmark-btn" id="modal-bookmark-btn" aria-label="Lưu">
                            <svg width="18" height="18" viewBox="0 0 18 18">
                                <path d="M4 2h10a1 1 0 0 1 1 1v13l-6-3.5L3 16V3a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.3" fill="none" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ═══════════════════════════════════════════ NAVBAR ═ -->
    <nav class="navbar" id="navbar">
        <div class="nav-inner">
            <a href="<?= base_url() ?>" class="nav-logo">
                <span class="logo-mark">M</span>
                <span class="logo-text">MCU<em>verse</em></span>
            </a>
            <ul class="nav-links">
                <li><a href="#timeline"    class="nav-link">Lộ trình</a></li>
                <li><a href="#movies"      class="nav-link">Phim</a></li>
                <li><a href="#characters"  class="nav-link">Nhân vật</a></li>
                <li><a href="#phases"      class="nav-link">Phases</a></li>
            </ul>
            <a href="#movies" class="nav-cta">Bắt đầu xem</a>
        </div>
    </nav>

    <!-- ═══════════════════════════════════════════ HERO ═══ -->
    <section class="hero" id="hero">
        <canvas class="hero-stars" id="hero-stars"></canvas>
        <div class="hero-bg-layer hero-bg-nebula" data-parallax="0.15"></div>
        <div class="hero-bg-layer hero-bg-glow"   data-parallax="0.25"></div>
        <div class="hero-orb hero-orb--red"></div>
        <div class="hero-orb hero-orb--blue"></div>
        <div class="hero-inner">
            <p class="hero-eyebrow">
                <span class="eyebrow-line"></span>Bách khoa toàn thư điện ảnh<span class="eyebrow-line"></span>
            </p>
            <div class="hero-title-wrapper" id="hero-title-wrapper">
                <h1 class="hero-title hero-title--clip">MARVEL</h1>
                <div class="hero-title-sub-row">
                    <h1 class="hero-title hero-title--outline">CINEMATIC</h1>
                    <div class="hero-badge">
                        <span class="hero-badge-num" id="hero-badge-num">20</span>
                        <span class="hero-badge-label">bộ phim</span>
                    </div>
                    <h1 class="hero-title hero-title--outline">UNIVERSE</h1>
                </div>
            </div>
            <p class="hero-desc">
                Khám phá toàn bộ vũ trụ điện ảnh Marvel — từ <strong>Phase 1</strong> cho đến <strong>Multiverse Saga</strong>.<br />
                Lộ trình xem phim theo thứ tự thời gian tuyến tính, đầy đủ, không bỏ sót chi tiết nào.
            </p>
            <div class="hero-actions">
                <a href="#timeline" class="btn btn--primary">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
                        <polygon points="6.5,5 11,8 6.5,11" fill="currentColor" />
                    </svg>
                    Bắt đầu lộ trình
                </a>
                <a href="#movies" class="btn btn--ghost">Xem tất cả phim</a>
            </div>
            <div class="hero-stats">
                <div class="hero-stat"><span class="hero-stat-num" data-count="20" id="stat-movies">0</span><span class="hero-stat-label">Bộ phim</span></div>
                <div class="hero-stat-divider"></div>
                <div class="hero-stat"><span class="hero-stat-num" data-count="3" id="stat-series">0</span><span class="hero-stat-label">Series TV</span></div>
                <div class="hero-stat-divider"></div>
                <div class="hero-stat"><span class="hero-stat-num" data-count="6">0</span><span class="hero-stat-label">Phases</span></div>
                <div class="hero-stat-divider"></div>
                <div class="hero-stat"><span class="hero-stat-num" data-count="2008">0</span><span class="hero-stat-label">Từ năm</span></div>
            </div>
        </div>
        <div class="hero-scroll-indicator">
            <span class="scroll-text">Cuộn để khám phá</span>
            <div class="scroll-line"><div class="scroll-dot"></div></div>
        </div>
    </section>



    <!-- ═══════════════════════ PHASES OVERVIEW ══════════════ -->
    <section class="phases-section" id="phases">
        <div class="section-header">
            <p class="section-eyebrow">The Saga</p>
            <h2 class="section-title">6 Phases của MCU</h2>
            <p class="section-desc">Từ Iron Man đầu tiên đến Multiverse Saga vĩ đại nhất</p>
        </div>
        <!-- PHP: foreach ($phases as $phase) — giữ nguyên HTML cứng vì phases ít thay đổi -->
        <div class="phases-grid">
            <div class="phase-card" data-phase-num="1" style="--phase-hue: 0;">
                <div class="phase-card-inner">
                    <div class="phase-card-num">01</div>
                    <div class="phase-card-content">
                        <span class="phase-card-tag">Infinity Saga</span>
                        <h3 class="phase-card-title">The Beginning</h3>
                        <p class="phase-card-years">2008 – 2012</p>
                        <p class="phase-card-desc">Khởi đầu vũ trụ với Iron Man, Thor, Hulk và cuộc hội tụ Avengers đầu tiên.</p>
                        <div class="phase-card-count"><span>6</span> tác phẩm</div>
                    </div>
                    <div class="phase-card-heroes">
                        <div class="phase-hero-dot" style="--c:#E23636" title="Iron Man"></div>
                        <div class="phase-hero-dot" style="--c:#2980B9" title="Thor"></div>
                        <div class="phase-hero-dot" style="--c:#27AE60" title="Hulk"></div>
                        <div class="phase-hero-dot" style="--c:#1ABC9C" title="Cap America"></div>
                        <div class="phase-hero-dot" style="--c:#9B59B6" title="Black Widow"></div>
                    </div>
                </div>
            </div>
            <div class="phase-card" data-phase-num="2" style="--phase-hue: 20;">
                <div class="phase-card-inner">
                    <div class="phase-card-num">02</div>
                    <div class="phase-card-content">
                        <span class="phase-card-tag">Infinity Saga</span>
                        <h3 class="phase-card-title">Expansion</h3>
                        <p class="phase-card-years">2013 – 2015</p>
                        <p class="phase-card-desc">Mở rộng vũ trụ với Guardians of the Galaxy và những mối đe dọa mới.</p>
                        <div class="phase-card-count"><span>6</span> tác phẩm</div>
                    </div>
                    <div class="phase-card-heroes">
                        <div class="phase-hero-dot" style="--c:#E67E22" title="Guardians"></div>
                        <div class="phase-hero-dot" style="--c:#3498DB" title="Winter Soldier"></div>
                        <div class="phase-hero-dot" style="--c:#E74C3C" title="Iron Man 3"></div>
                        <div class="phase-hero-dot" style="--c:#8E44AD" title="Thor 2"></div>
                    </div>
                </div>
            </div>
            <div class="phase-card phase-card--featured" data-phase-num="3" style="--phase-hue: 340;">
                <div class="phase-card-inner">
                    <div class="phase-card-num">03</div>
                    <div class="phase-card-content">
                        <span class="phase-card-tag">Infinity Saga · Đỉnh cao</span>
                        <h3 class="phase-card-title">The Infinity War</h3>
                        <p class="phase-card-years">2016 – 2019</p>
                        <p class="phase-card-desc">Thanos — cuộc chiến Infinity War và Endgame thay đổi vũ trụ mãi mãi.</p>
                        <div class="phase-card-count"><span>11</span> tác phẩm</div>
                    </div>
                    <div class="phase-card-heroes">
                        <div class="phase-hero-dot" style="--c:#6C3483" title="Thanos"></div>
                        <div class="phase-hero-dot" style="--c:#E74C3C" title="Avengers"></div>
                        <div class="phase-hero-dot" style="--c:#1A5276" title="Black Panther"></div>
                        <div class="phase-hero-dot" style="--c:#F39C12" title="Doctor Strange"></div>
                        <div class="phase-hero-dot" style="--c:#117A65" title="Spider-Man"></div>
                    </div>
                </div>
            </div>
            <div class="phase-card" data-phase-num="4" style="--phase-hue: 200;">
                <div class="phase-card-inner">
                    <div class="phase-card-num">04</div>
                    <div class="phase-card-content">
                        <span class="phase-card-tag">Multiverse Saga</span>
                        <h3 class="phase-card-title">New World</h3>
                        <p class="phase-card-years">2021 – 2022</p>
                        <p class="phase-card-desc">Hậu Endgame — multiverse mở ra, những anh hùng mới trỗi dậy.</p>
                        <div class="phase-card-count"><span>10</span> tác phẩm</div>
                    </div>
                    <div class="phase-card-heroes">
                        <div class="phase-hero-dot" style="--c:#1E8449" title="WandaVision"></div>
                        <div class="phase-hero-dot" style="--c:#2471A3" title="Loki"></div>
                        <div class="phase-hero-dot" style="--c:#D4E6F1" title="Moon Knight"></div>
                        <div class="phase-hero-dot" style="--c:#A93226" title="She-Hulk"></div>
                    </div>
                </div>
            </div>
            <div class="phase-card" data-phase-num="5" style="--phase-hue: 260;">
                <div class="phase-card-inner">
                    <div class="phase-card-num">05</div>
                    <div class="phase-card-content">
                        <span class="phase-card-tag">Multiverse Saga</span>
                        <h3 class="phase-card-title">The Kang Dynasty</h3>
                        <p class="phase-card-years">2023 – 2024</p>
                        <p class="phase-card-desc">Kang the Conqueror và mối đe dọa xuyên thời gian.</p>
                        <div class="phase-card-count"><span>8</span> tác phẩm</div>
                    </div>
                    <div class="phase-card-heroes">
                        <div class="phase-hero-dot" style="--c:#7D3C98" title="Kang"></div>
                        <div class="phase-hero-dot" style="--c:#922B21" title="Guardians 3"></div>
                        <div class="phase-hero-dot" style="--c:#1F618D" title="Ant-Man 3"></div>
                    </div>
                </div>
            </div>
            <div class="phase-card phase-card--upcoming" data-phase-num="6" style="--phase-hue: 170;">
                <div class="phase-card-inner">
                    <div class="phase-card-num">06</div>
                    <div class="phase-card-content">
                        <span class="phase-card-tag">Multiverse Saga · Sắp ra mắt</span>
                        <h3 class="phase-card-title">Secret Wars</h3>
                        <p class="phase-card-years">2025 – 2026</p>
                        <p class="phase-card-desc">Avengers: Secret Wars — cuộc hội tụ vĩ đại nhất lịch sử MCU.</p>
                        <div class="phase-card-count"><span>?</span> tác phẩm</div>
                    </div>
                    <div class="phase-card-heroes">
                        <div class="phase-hero-dot phase-hero-dot--unknown"></div>
                        <div class="phase-hero-dot phase-hero-dot--unknown"></div>
                        <div class="phase-hero-dot phase-hero-dot--unknown"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ═══════════════════════════════════════════
       TIMELINE SECTION — DYNAMIC PHP
    ═══════════════════════════════════════════ -->
    <section class="timeline-section" id="timeline">
        <div class="section-header">
            <p class="section-eyebrow">Chronological Order</p>
            <h2 class="section-title">Lộ trình xem phim</h2>
            <p class="section-desc">Theo thứ tự thời gian trong vũ trụ MCU</p>
        </div>

        <div class="timeline-container" id="timeline-container">
            <div class="timeline-spine"><div class="timeline-spine-fill" id="timeline-spine-fill"></div></div>

<?php foreach ($phases as $p): ?>
    <div class="timeline-phase <?= ($p['phase_num'] == 6) ? 'timeline-phase--upcoming' : '' ?>" data-phase="<?= $p['phase_num'] ?>">
        <div class="timeline-phase-label">
            <span class="phase-tag" <?= ($p['phase_num'] == 6) ? 'style="--phase-tag-clr: #00d4ff; --phase-tag-bg: rgba(0,212,255,0.08);"' : '' ?>>Phase 0<?= $p['phase_num'] ?></span>
            <h3 class="phase-name"><?= htmlspecialchars($p['saga'] . ' — ' . $p['ten_phase']) ?></h3>
            <span class="phase-years"><?= htmlspecialchars($p['years']) ?></span>
        </div>

        <?php 
        foreach ($movies as $m): 
            if ($m['phase_id'] == $p['id']): 
                $isUpcoming = ($p['phase_num'] == 6) ? 'timeline-node--upcoming' : '';
                $isUpcomingCard = ($p['phase_num'] == 6) ? 'timeline-card--upcoming' : '';
                
                $isFeatured = (strpos(strtolower($m['title']), 'avengers') !== false) || ($p['phase_num'] == 6);
                $nodeClass = $isFeatured ? 'timeline-node--milestone' : $isUpcoming;
                $cardClass = $isFeatured ? 'timeline-card--featured' : $isUpcomingCard;
                $cardTypeClass = $isFeatured ? 'timeline-card-type--featured' : '';
        ?>
        <div class="timeline-item <?= $isFeatured ? 'timeline-item--milestone' : '' ?>" data-order="<?= $m['view_order'] ?>" data-type="<?= $m['type'] ?>" data-movie-id="<?= htmlspecialchars($m['slug']) ?>">
            <div class="timeline-node <?= $nodeClass ?>">
                <div class="timeline-node-inner"></div>
            </div>
            <div class="timeline-card <?= $cardClass ?>" data-open-modal="<?= htmlspecialchars($m['slug']) ?>">
                <div class="timeline-card-num"><?= sprintf('%02d', $m['view_order']) ?><?= ($p['phase_num'] == 6) ? '+' : '' ?></div>
                <?php if($isFeatured): ?><div class="timeline-card-milestone-badge">⚡ Sự kiện lớn</div><?php endif; ?>
                <div class="timeline-card-body">
                    <span class="timeline-card-type <?= $cardTypeClass ?>"><?= ($p['phase_num'] == 6) ? 'Sắp ra mắt' : 'Phim điện ảnh' ?></span>
                    <h4 class="timeline-card-title"><?= htmlspecialchars($m['title']) ?></h4>
                    <p class="timeline-card-meta"><?= $m['year'] ?> · Phase <?= $p['phase_num'] ?> · <?= htmlspecialchars($m['duration']) ?></p>
                    <p class="timeline-card-desc"><?= htmlspecialchars($m['description']) ?></p>
                    <div class="timeline-card-tags">
                        <?php 
                        $tags = explode(',', $m['cast_list']);
                        foreach (array_slice($tags, 0, 3) as $tag):
                        ?>
                        <span class="tl-tag"><?= htmlspecialchars(trim($tag)) ?></span>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="timeline-card-poster">
                    <div class="poster-placeholder" data-title="<?= htmlspecialchars($m['title']) ?>" style="--ph-color:<?= $m['bg_color'] ?>;"></div>
                </div>
            </div>
        </div>
        <?php 
            endif;
        endforeach; 
        ?>
    </div>
<?php endforeach; ?>

        </div>
    </section>

    <!-- ═══════════════════════ CHARACTERS — JS render ═══════ -->
    <section class="characters-section" id="characters">
        <div class="section-header">
            <p class="section-eyebrow">The Heroes</p>
            <h2 class="section-title">Những nhân vật chủ chốt</h2>
            <p class="section-desc">Các anh hùng định hình vũ trụ MCU qua từng Phase</p>
        </div>
        <!-- JS fetch từ /api/characters và render vào đây -->
        <div class="characters-grid" id="characters-grid">
            <!-- JS fetch từ /api/characters và render vào đây -->
            <div style="grid-column:1/-1;text-align:center;color:var(--clr-text-muted);padding:40px 0;">Đang tải nhân vật...</div>
        </div>
    </section>

    <!-- ═══════════════════════ FILTER BAR ══════════════════ -->
    <section class="filter-section" id="filter-section">
        <div class="filter-glass-bar" id="filter-bar">
            <div class="search-wrapper" id="search-wrapper">
                <label class="search-icon" for="search-input" aria-label="Tìm kiếm">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" stroke-width="1.5" />
                        <line x1="11.5" y1="11.5" x2="16" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                </label>
                <input type="text" id="search-input" class="search-input" placeholder="Tìm tên phim, nhân vật, phase..." autocomplete="off" />
                <button class="search-clear" id="search-clear" aria-label="Xóa">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                </button>
            </div>
            <div class="filter-divider"></div>
            <div class="filter-tabs" role="group">
                <button class="filter-tab filter-tab--active" data-filter="phase" data-value="all">Tất cả</button>
                <button class="filter-tab" data-filter="phase" data-value="1">Phase 1</button>
                <button class="filter-tab" data-filter="phase" data-value="2">Phase 2</button>
                <button class="filter-tab" data-filter="phase" data-value="3">Phase 3</button>
                <button class="filter-tab" data-filter="phase" data-value="4">Phase 4</button>
                <button class="filter-tab" data-filter="phase" data-value="5">Phase 5</button>
                <button class="filter-tab" data-filter="phase" data-value="6">Phase 6</button>
            </div>
            <div class="filter-divider"></div>
            <div class="filter-type-group" role="group">
                <button class="filter-chip filter-chip--active" data-filter="type" data-value="all">
                    <svg width="12" height="12" viewBox="0 0 12 12"><rect width="12" height="12" rx="2" fill="currentColor" opacity="0.7" /></svg>Tất cả
                </button>
                <button class="filter-chip" data-filter="type" data-value="movie">
                    <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="2" width="10" height="8" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none" /><line x1="4" y1="2" x2="4" y2="10" stroke="currentColor" stroke-width="1" /><line x1="8" y1="2" x2="8" y2="10" stroke="currentColor" stroke-width="1" /></svg>Phim
                </button>
                <button class="filter-chip" data-filter="type" data-value="series">
                    <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="7" rx="1" stroke="currentColor" stroke-width="1.2" fill="none" /><line x1="4" y1="11" x2="8" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /><line x1="6" y1="8" x2="6" y2="11" stroke="currentColor" stroke-width="1.2" /></svg>Series
                </button>
            </div>
            <div class="filter-sort">
                <label class="sort-label" for="sort-select">Sắp xếp</label>
                <div class="sort-select-wrapper">
                    <select id="sort-select" class="sort-select">
                        <option value="timeline">Thứ tự thời gian</option>
                        <option value="release">Ngày ra mắt</option>
                        <option value="phase">Theo Phase</option>
                        <option value="rating">Điểm đánh giá</option>
                    </select>
                    <svg class="sort-chevron" width="12" height="12" viewBox="0 0 12 12">
                        <polyline points="2,4 6,8 10,4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="active-filters" id="active-filters">
            <span class="active-filter-label">Đang hiển thị:</span>
            <span class="active-filter-count" id="filter-count">Đang tải...</span>
            <button class="filter-reset" id="filter-reset">Xóa bộ lọc</button>
        </div>
    </section>

    <!-- ═══════════════════════ MOVIES — JS render ══════════ -->
    <section class="movies-section" id="movies">
        <div class="section-header">
            <p class="section-eyebrow">The Collection</p>
            <h2 class="section-title">Toàn bộ vũ trụ MCU</h2>
        </div>
        <!-- JS fetch từ /api/movies và render vào đây -->
        <div class="movies-grid" id="movies-grid">
            <!-- JS fetch từ /api/movies và render vào đây -->
            <div style="grid-column:1/-1;text-align:center;color:var(--clr-text-muted);padding:60px 0;">Đang tải phim...</div>
        </div>
    </section>

    <!-- ═══════════════════════ FOOTER ══════════════════════ -->
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-logo">
                <span class="logo-mark">M</span>
                <span class="logo-text">MCU<em>verse</em></span>
            </div>
            <div class="footer-links">
                <a href="#timeline"   class="footer-link">Lộ trình</a>
                <a href="#movies"     class="footer-link">Phim</a>
                <a href="#characters" class="footer-link">Nhân vật</a>
                <a href="#phases"     class="footer-link">Phases</a>
            </div>
            <p class="footer-copy">Dữ liệu tổng hợp từ Marvel Studios &amp; IMDb. Không phải trang chính thức.</p>
        </div>
    </footer>

    <!-- Truyền base_url vào JS qua biến global -->
    <script>
        window.MCU_BASE_URL = '<?= base_url() ?>';
        window.MCU_API      = '<?= site_url('api') ?>';
    </script>
    <script src="<?= base_url('assets/js/script.js') ?>"></script>
    <script src="<?= base_url('assets/js/script-part2.js') ?>"></script>

</body>
</html>
