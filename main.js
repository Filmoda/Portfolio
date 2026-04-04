document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       Intersection Observer for Animations
       ========================================= */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('appear');
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
    setTimeout(() => {
        document.querySelectorAll('.hero-minimal .fade-in-up').forEach(el => el.classList.add('appear'));
    }, 100);

    /* =========================================
       Smooth Scrolling
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 100;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    /* =========================================
       Project Filtering
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.minimal-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                            card.style.pointerEvents = 'all';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        card.style.pointerEvents = 'none';
                        setTimeout(() => { card.style.display = 'none'; }, 400);
                    }
                });
            });
        });
    }

    /* =========================================
       Custom Cursor
       ========================================= */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.style.left = `${e.clientX}px`;
            cursorOutline.style.top = `${e.clientY}px`;
        });
        document.querySelectorAll('a, button, input, textarea, .art-piece, .minimal-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });
    }

    /* =========================================
       Spotlight Hover on Titles
       ========================================= */
    document.querySelectorAll('.minimal-title').forEach(title => {
        title.addEventListener('mousemove', (e) => {
            const rect = title.getBoundingClientRect();
            title.style.setProperty('--x', `${e.clientX - rect.left}px`);
            title.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
        title.addEventListener('mouseleave', () => {
            title.style.setProperty('--x', `-100px`);
            title.style.setProperty('--y', `-100px`);
        });
    });

    /* =========================================
       Video Launcher Drag
       ========================================= */
    const dragBall = document.getElementById('dragBall');
    const dragFill = document.getElementById('dragFill');
    const counterValue = document.getElementById('counterValue');
    const inlineVideo = document.getElementById('inlineVideo');
    const track = document.querySelector('.launcher-track');

    if (dragBall && track) {
        let isDragging = false, startY, startBottom;
        const maxTravel = track.offsetHeight;

        dragBall.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startBottom = parseFloat(window.getComputedStyle(dragBall).bottom) || -15;
            dragBall.setPointerCapture(e.pointerId);
            dragBall.style.transition = 'none';
            if (dragFill) dragFill.style.transition = 'none';
        });

        dragBall.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            let newBottom = startBottom + (startY - e.clientY);
            const minB = -15, maxB = maxTravel - 15;
            newBottom = Math.min(Math.max(newBottom, minB), maxB);
            dragBall.style.bottom = `${newBottom}px`;
            const pct = Math.round(((newBottom - minB) / (maxB - minB)) * 100);
            if (dragFill) dragFill.style.height = `${pct}%`;
            if (counterValue) counterValue.innerText = pct;
            if (pct >= 100) { isDragging = false; triggerVideo(); setTimeout(resetLauncher, 500); }
        });

        dragBall.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            dragBall.releasePointerCapture(e.pointerId);
            resetLauncher();
        });

        function resetLauncher() {
            dragBall.style.transition = 'bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            if (dragFill) dragFill.style.transition = 'height 0.5s ease';
            dragBall.style.bottom = '-15px';
            if (dragFill) dragFill.style.height = '0%';
            if (counterValue) counterValue.innerText = '0';
        }

        function triggerVideo() {
            if (inlineVideo) inlineVideo.classList.add('active');
        }
    }

    /* =========================================
       Category Hub Data
       ========================================= */
    const HUB_DATA = {
        animation: {
            label: 'Animation',
            items: [
                { title: 'Cinematic Channel Intro', tag: 'Animation', bg: 'linear-gradient(45deg, #4b6cb7, #182848)' },
                { title: 'Logo Reveal Loop', tag: 'Animation', bg: 'linear-gradient(45deg, #1a1a2e, #16213e)' },
                { title: 'Particle Burst Outro', tag: 'Animation', bg: 'linear-gradient(45deg, #0f3443, #34e89e)' },
                { title: 'Glitch Title Sequence', tag: 'Animation', bg: 'linear-gradient(45deg, #200122, #6f0000)' },
                { title: '3D Product Spin', tag: 'Animation', bg: 'linear-gradient(45deg, #1a1a1a, #4b4b4b)' },
            ]
        },
        youtube: {
            label: 'YouTube',
            items: [
                { title: 'Tech Unboxed S3', tag: 'YouTube', bg: 'linear-gradient(45deg, #141e30, #243b55)' },
                { title: 'Vlog — Japan 2024', tag: 'YouTube', bg: 'linear-gradient(45deg, #1d1d1d, #e96c4c)' },
                { title: 'Game Dev Devlog', tag: 'YouTube', bg: 'linear-gradient(45deg, #232526, #414345)' },
                { title: 'Podcast Highlight Reel', tag: 'YouTube', bg: 'linear-gradient(45deg, #0f2027, #203a43)' },
            ]
        },
        logo: {
            label: 'Logo & Brand',
            items: [
                { title: 'Vortex Esports Identity', tag: 'Logo', bg: 'linear-gradient(45deg, #1d976c, #93f9b9)' },
                { title: 'NeonCraft Studio', tag: 'Logo', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)' },
                { title: 'Apex Fitness', tag: 'Logo', bg: 'linear-gradient(45deg, #f7971e, #ffd200)' },
                { title: 'Void Records', tag: 'Logo', bg: 'linear-gradient(45deg, #0f0c29, #302b63)' },
            ]
        },
        art: {
            label: 'Visual Art',
            items: [
                { title: 'Dusk Gradient Series', tag: 'Art', bg: 'linear-gradient(120deg, #f6d365, #fda085)' },
                { title: 'Aqua Forms', tag: 'Art', bg: 'linear-gradient(120deg, #84fab0, #8fd3f4)' },
                { title: 'Neon Bloom', tag: 'Art', bg: 'linear-gradient(120deg, #fccb90, #d57eeb)' },
                { title: 'Cloud Pastel', tag: 'Art', bg: 'linear-gradient(120deg, #e0c3fc, #8ec5fc)' },
                { title: 'Crimson Abstract', tag: 'Art', bg: 'linear-gradient(120deg, #f093fb, #f5576c)' },
            ]
        },
        reels: {
            label: 'Reels & Shorts',
            items: [
                { title: 'Gaming Reel 2024', tag: 'Reels', bg: 'linear-gradient(45deg, #30cfd0, #330867)' },
                { title: 'Fashion Week Edit', tag: 'Reels', bg: 'linear-gradient(45deg, #f7797d, #FBD786)' },
                { title: 'Sports Highlights', tag: 'Reels', bg: 'linear-gradient(45deg, #134E5E, #71B280)' },
                { title: 'Travel Montage', tag: 'Reels', bg: 'linear-gradient(45deg, #5614B0, #DBD65C)' },
            ]
        },
        music: {
            label: 'Music Videos',
            items: [
                { title: 'Neon Souls', tag: 'Music Video', bg: 'linear-gradient(45deg, #fc4a1a, #f7b733)' },
                { title: 'Midnight Drive', tag: 'Music Video', bg: 'linear-gradient(45deg, #1a1a2e, #e94560)' },
                { title: 'Echo Chamber', tag: 'Music Video', bg: 'linear-gradient(45deg, #0d0d0d, #0047ab)' },
                { title: 'Ultraviolet', tag: 'Music Video', bg: 'linear-gradient(45deg, #3d0066, #ff00cc)' },
            ]
        },
        shop: {
            label: 'Shop',
            items: [
                { title: 'Transitions Pack V1', tag: 'Pack', bg: 'linear-gradient(45deg, #ff9966, #ff5e62)', price: '$19.99' },
                { title: 'Cyberpunk Titles', tag: 'Pack', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)', price: '$14.99' },
            ]
        }
    };

    const MOGRTS_DATA = [
        { title: 'Smooth Zoom Transitions', price: '$12.99', compat: 'Pr Pro CC+', bg: 'linear-gradient(135deg,#1a1a2e,#16213e)', icon: '⚡' },
        { title: 'Glitch Text Titles', price: '$9.99', compat: 'Pr Pro CC+', bg: 'linear-gradient(135deg,#200122,#6f0000)', icon: '💥' },
        { title: 'Cinematic Bars Pack', price: '$7.99', compat: 'Pr Pro CC+', bg: 'linear-gradient(135deg,#0f2027,#203a43)', icon: '🎬' },
        { title: 'Social Media Lower Thirds', price: '$14.99', compat: 'Pr Pro CC+', bg: 'linear-gradient(135deg,#1d976c,#93f9b9)', icon: '📱' },
        { title: 'Neon Glow Overlays', price: '$11.99', compat: 'AE + Pr Pro', bg: 'linear-gradient(135deg,#3d0066,#ff00cc)', icon: '✨' },
        { title: 'Typewriter Captions', price: '$6.99', compat: 'Pr Pro CC+', bg: 'linear-gradient(135deg,#134E5E,#71B280)', icon: '⌨️' },
        { title: 'Liquid Motion Pack', price: '$16.99', compat: 'AE + Pr Pro', bg: 'linear-gradient(135deg,#f7797d,#FBD786)', icon: '🌊' },
        { title: 'VHS Retro Effects', price: '$8.99', compat: 'Pr Pro CC+', bg: 'linear-gradient(135deg,#232526,#ff6b6b)', icon: '📼' },
    ];

    /* =========================================
       Category Hub Logic
       ========================================= */
    const hub = document.getElementById('categoryHub');
    const hubGrid = document.getElementById('hubGrid');
    const hubLabel = document.getElementById('hubCategoryLabel');
    const hubCount = document.getElementById('hubItemCount');
    const mogrtsSection = document.getElementById('mogrtsSection');
    const mogrtsGrid = document.getElementById('mogrtsGrid');
    const closeHubBtn = document.getElementById('closeHub');
    const hubIcons = document.querySelectorAll('.hub-icon');

    let currentCategory = 'animation';

    function openHub(category) {
        if (!hub) return;
        currentCategory = category || 'animation';
        loadHubCategory(currentCategory);
        hub.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Sync sidebar icon
        hubIcons.forEach(icon => {
            icon.classList.toggle('active', icon.dataset.category === currentCategory);
        });
    }

    function closeHub() {
        hub.classList.remove('active');
        document.body.style.overflow = '';
    }

    function loadHubCategory(category, animate = true) {
        const data = HUB_DATA[category];
        if (!data) return;

        // Update header
        hubLabel.textContent = data.label;

        const isShop = category === 'shop';

        // Transition grid out
        if (animate) {
            hubGrid.style.opacity = '0';
            hubGrid.style.transform = 'translateY(10px)';
        }

        setTimeout(() => {
            // Render project cards
            hubGrid.innerHTML = '';
            data.items.forEach((item, i) => {
                const card = document.createElement('div');
                card.className = 'hub-card';
                card.style.animationDelay = `${i * 0.06}s`;
                card.innerHTML = `
                    <div class="hub-thumb" style="background:${item.bg};">
                        <span class="hub-thumb-tag">${item.tag}</span>
                    </div>
                    <div class="hub-card-info">
                        <h4>${item.title}</h4>
                        ${item.price ? `<p class="hub-card-price">${item.price}</p>` : ''}
                    </div>
                `;
                hubGrid.appendChild(card);
            });

            // Show / hide Mogrts section
            if (isShop) {
                mogrtsSection.style.display = 'block';
                renderMogrts();
                hubCount.textContent = `${data.items.length} packs + ${MOGRTS_DATA.length} mogrts`;
            } else {
                mogrtsSection.style.display = 'none';
                hubCount.textContent = `${data.items.length} project${data.items.length !== 1 ? 's' : ''}`;
            }

            // Animate grid in
            hubGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            hubGrid.style.opacity = '1';
            hubGrid.style.transform = 'translateY(0)';
        }, animate ? 200 : 0);
    }

    function renderMogrts() {
        mogrtsGrid.innerHTML = '';
        MOGRTS_DATA.forEach((m, i) => {
            const card = document.createElement('div');
            card.className = 'mogrt-card';
            card.style.animationDelay = `${i * 0.05}s`;
            card.innerHTML = `
                <div class="mogrt-preview" style="background:${m.bg};">
                    <div class="mogrt-preview-icon">${m.icon}</div>
                </div>
                <div class="mogrt-info">
                    <h4>${m.title}</h4>
                    <div class="mogrt-meta">
                        <span class="mogrt-price">${m.price}</span>
                        <span class="mogrt-compat">${m.compat}</span>
                    </div>
                </div>
                <button class="mogrt-buy-btn">Buy Template</button>
            `;
            mogrtsGrid.appendChild(card);
        });
    }

    // Sidebar icon clicks → switch category
    hubIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const cat = icon.dataset.category;
            if (cat === currentCategory) return;
            currentCategory = cat;
            hubIcons.forEach(ic => ic.classList.remove('active'));
            icon.classList.add('active');
            loadHubCategory(cat);
        });
    });

    // Open hub from main grid cards
    document.querySelectorAll('.minimal-card[data-open-hub]').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-open-hub');
            openHub(cat);
        });
    });

    // Close button
    if (closeHubBtn) {
        closeHubBtn.addEventListener('click', closeHub);
    }

    // ESC key closes hub
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hub.classList.contains('active')) closeHub();
    });

});
