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
        anchor.addEventListener('click', function (e) {
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
                const filterValue = btn.getAttribute('data-filter');
                if (filterValue === 'all') {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    projectCards.forEach(card => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                            card.style.pointerEvents = 'all';
                        }, 10);
                    });
                } else {
                    openHub(filterValue);
                }
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
            if (inlineVideo) {
                inlineVideo.classList.add('active');
                const video = document.getElementById('launcherVideo');
                if (video) {
                    video.currentTime = 0;
                    video.play().catch(e => console.warn("Autoplay blocked or video missing:", e));
                }
            }
        }
    }

    /* =========================================
       Category Hub Data
       ========================================= */
    const HUB_DATA = {
        commercial: {
            label: 'Commercial',
            filters: ['All', 'UGC Ads', 'Product Ads', 'SaaS', 'Corporate Brand Videos', 'Trailers'],
            items: [
                {
                    title: 'Nike Ad',
                    tag: 'Product Ads',
                    bg: 'linear-gradient(45deg, #2b5876, #4e4376)',
                    poster: 'IMG/Media/NikeFastAdVoca.png',
                    video: 'https://youtu.be/9c5RxpXg1H4',
                    versions: ['https://youtu.be/9c5RxpXg1H4']
                },
                {
                    title: 'Nike Ad Reel',
                    tag: 'Product Ads',
                    bg: 'linear-gradient(45deg, #2b5876, #4e4376)',
                    poster: 'IMG/Media/NikeFastAdReelVocal.png',
                    video: 'https://youtube.com/shorts/GXmRoawQMZg',
                    versions: ['https://youtube.com/shorts/GXmRoawQMZg']
                },
                {
                    title: 'AntiGravity SaaS Promo',
                    tag: 'SaaS',
                    bg: 'linear-gradient(45deg, #2b5876, #4e4376)',
                    poster: 'IMG/Media/SaaSAntiGravity.png',
                    video: 'https://youtu.be/UANS2USZfD0',
                    versions: ['https://youtu.be/UANS2USZfD0']
                },
                {
                    title: 'AMP Trailer',
                    tag: 'Trailers',
                    bg: '#111',
                    poster: 'IMG/Media/AMP Trailer.png',
                    video: 'https://youtu.be/eT3_ZUV9TUI',
                    versions: ['https://youtu.be/eT3_ZUV9TUI']
                },
                {
                    title: 'Filmoda Brand Animation',
                    tag: 'Brand Intro',
                    bg: '#111',
                    poster: 'IMG/Logos/Filmoda.jpg',
                    video: 'https://youtu.be/MyT1gnJpnII',
                    versions: ['https://youtu.be/MyT1gnJpnII', 'https://youtu.be/WGPTZSUJABE', 'https://youtu.be/3_czaDVTWLk']
                },
                {
                    title: 'Two Love Intro',
                    tag: 'Brand Intro',
                    bg: '#111',
                    poster: 'IMG/Logos/twolove.jpg',
                    video: 'https://youtu.be/71TBaXYBjYs',
                    versions: ['https://youtu.be/71TBaXYBjYs', 'https://youtu.be/Q6vkRAlyO9s', 'https://youtu.be/xRqQK6Fnzzk']
                }
            ]
        },
        animation: {
            label: 'Animation',
            items: [
                {
                    title: 'AntiGravity Intro (Rework)',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/antigravity.jpg',
                    video: 'https://youtube.com/shorts/adCad0sZMP0',
                    versions: ['https://youtube.com/shorts/adCad0sZMP0']
                },
                {
                    title: 'Filmoda Animation',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/Filmoda.jpg',
                    video: 'https://youtu.be/MyT1gnJpnII',
                    versions: ['https://youtu.be/MyT1gnJpnII', 'https://youtu.be/WGPTZSUJABE', 'https://youtu.be/3_czaDVTWLk']
                },
                {
                    title: 'Number 2 Animate',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/2animate.jpg',
                    video: 'https://youtu.be/zRH8s_viDSs',
                    versions: ['https://youtu.be/zRH8s_viDSs']
                },
                {
                    title: 'ColorfY',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/ColorfY.jpg',
                    video: 'https://youtu.be/H5JBIq2Dae8',
                    versions: ['https://youtu.be/H5JBIq2Dae8', 'https://youtu.be/g30ESQVCtwI']
                },
                {
                    title: 'B Games',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/JujutsuEyeLogo.jpg',
                    video: 'https://youtu.be/IxE3TR7PaZ4',
                    versions: ['https://youtu.be/IxE3TR7PaZ4', 'https://youtu.be/fpxK-nvLZkU']
                },
                {
                    title: 'G-Orgo Logo',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/GO.jpg',
                    video: 'https://youtu.be/Ugulz3-lXJw',
                    versions: ['https://youtu.be/Ugulz3-lXJw']
                },
                {
                    title: 'Two Love Intro',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/twolove.jpg',
                    video: 'https://youtu.be/71TBaXYBjYs',
                    versions: ['https://youtu.be/71TBaXYBjYs', 'https://youtu.be/Q6vkRAlyO9s', 'https://youtu.be/xRqQK6Fnzzk']
                }
            ]
        },
        youtube: {
            label: 'YouTube',
            filters: ['All', 'EDITING', 'Documentary', 'Gaming', 'Explainer', 'Fantasy / Story', 'Commentary', 'Vlog Style'],
            items: [
                {
                    title: 'Editing Lite',
                    tag: 'EDITING',
                    bg: 'linear-gradient(45deg, #232526, #414345)',
                    poster: 'IMG/Media/EditingLite.png',
                    video: 'https://youtu.be/g5OaXoH8uUU'
                },
                {
                    title: 'Aot War Remake',
                    tag: 'Fantasy / Story',
                    bg: 'linear-gradient(45deg, #141e30, #243b55)',
                    poster: 'IMG/Media/WarProjectFinal.png',
                    video: 'https://youtu.be/akFZ3tEj-Fk'
                },
                {
                    title: 'Distort Effects Tutorial',
                    tag: 'Explainer',
                    bg: 'linear-gradient(45deg, #1d1d1d, #e96c4c)',
                    poster: 'IMG/Media/distort.png',
                    video: 'https://youtu.be/ywIvSykoXNY'
                },
                {
                    title: 'Akatsuki Members',
                    tag: 'Fantasy / Story',
                    bg: 'linear-gradient(45deg, #232526, #414345)',
                    poster: 'IMG/Media/ak1.png',
                    video: 'https://youtu.be/U6PNdijVDG8'
                },
                {
                    title: 'Share of Global Births',
                    tag: 'EDITING',
                    bg: 'linear-gradient(45deg, #30cfd0, #330867)',
                    poster: 'IMG/Media/AfriquiaPourcentage.png',
                    video: 'https://youtu.be/hwKcyZzpVJs'
                },
            ]
        },
        logo: {
            label: 'Logo & Brand',
            items: [
                { title: 'Filmoda', tag: 'Logo', bg: 'linear-gradient(45deg, #1d976c, #93f9b9)', poster: 'IMG/Logos/Filmoda.jpg' },
                { title: 'Two Love', tag: 'Logo', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)', poster: 'IMG/Logos/twolove.jpg' },
                { title: 'Counti2', tag: 'Logo', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)', poster: 'IMG/Logos/2animate.jpg' },
                { title: 'ColorfY', tag: 'Logo', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)', poster: 'IMG/Logos/ColorfY.jpg' },
                { title: 'AntiGravity (Rework)', tag: 'Logo', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)', poster: 'IMG/Logos/antigravity.jpg' },
                { title: 'G-Orgo', tag: 'Logo', bg: 'linear-gradient(45deg, #f7971e, #ffd200)', poster: 'IMG/Logos/GO.jpg' },
                { title: 'B Games', tag: 'Logo', bg: 'linear-gradient(45deg, #0f0c29, #302b63)', poster: 'IMG/Logos/JujutsuEyeLogo.jpg' },
            ]
        },
        art: {
            label: 'Visual Art',
            items: [
                {
                    title: 'Morocco x Arcane Intro',
                    tag: 'Art',
                    bg: 'linear-gradient(120deg, #f6d365, #fda085)',
                    poster: 'IMG/Media/MoroccoArcaneIntro.jpg',
                    video: 'https://www.youtube.com/watch?v=2kAwgv1BMv8'
                },
                {
                    title: 'Aot Final Dose',
                    tag: 'Art',
                    bg: 'linear-gradient(120deg, #f6d365, #fda085)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtu.be/pT9IZmD40Sk'
                },
                {
                    title: 'Filmoda Keys',
                    tag: 'Art',
                    bg: 'linear-gradient(120deg, #f6d365, #fda085)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtu.be/W2phw46niOM'
                },
            ]
        },
        reels: {
            label: 'Reels & Shorts',
            filters: ['All'],
            items: [
                {
                    title: 'Lamine Yamal Goal',
                    tag: 'All',
                    bg: 'linear-gradient(45deg, #30cfd0, #330867)',
                    poster: 'IMG/Media/LamineGoalNoBlur.png',
                    video: 'https://youtube.com/shorts/4wPp3IhVHSQ'
                },
                {
                    title: 'Ramadan Kareem',
                    tag: 'All',
                    bg: 'linear-gradient(45deg, #f7797d, #FBD786)',
                    poster: 'IMG/Media/IslamicRamadan.png',
                    video: 'https://youtube.com/shorts/0ud6Y6nFQ7U'
                },
            ]
        },
        music: {
            label: 'Music Videos',
            items: []
        },
        shop: {
            label: 'Shop',
            items: [
                {
                    title: 'BeIn Transition Style',
                    tag: 'Transitions',
                    bg: 'linear-gradient(45deg, #6a11cb, #2575fc)',
                    poster: 'IMG/Media/BeInTranSytleMogrt.png',
                    video: 'https://youtube.com/shorts/uxFOo7gw2ms',
                    href: 'https://www.mediafire.com/file/gsn3i62nbuysedr/beIN_Transition_Style.rar/file'
                },
            ]
        }
    };

    const MOGRTS_DATA = [];

    /* =========================================
       Art Gallery Data & Render
       ========================================= */
    const ART_DATA = [
        {
            title: 'Morocco x Arcane Intro',
            sub: 'Visual Art',
            bg: 'linear-gradient(120deg, #f6d365, #fda085)',
            poster: 'IMG/Media/MoroccoArcaneIntro.jpg',
            video: 'https://www.youtube.com/watch?v=2kAwgv1BMv8',
            size: 'large'
        },
        {
            title: 'Aot Final Dose',
            sub: 'Fantasy Edit',
            bg: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
            video: 'https://youtu.be/pT9IZmD40Sk',
            size: 'large'
        },
        {
            title: 'Filmoda Keys',
            sub: 'Brand Visual',
            bg: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
            poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
            video: 'https://youtu.be/W2phw46niOM',
            size: 'tall'
        }
    ];

    const artGallery = document.getElementById('artGallery');
    if (artGallery) {
        ART_DATA.forEach((piece, i) => {
            const el = document.createElement('div');
            el.className = `art-creative-piece art-creative-${piece.size} fade-in-up`;
            el.style.transitionDelay = `${i * 0.15}s`;
            el.style.background = piece.bg;

            const isYT = piece.video && (piece.video.includes('youtu.be') || piece.video.includes('youtube.com'));
            let thumbHTML = '';
            if (isYT) {
                const ytId = piece.video.includes('youtu.be/')
                    ? piece.video.split('youtu.be/')[1].split('?')[0]
                    : piece.video.split('v=')[1];
                thumbHTML = `<img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" class="art-creative-thumb" alt="${piece.title}">`;
            } else if (piece.poster) {
                thumbHTML = `<img src="${piece.poster}" class="art-creative-thumb" alt="${piece.title}">`;
            }

            el.innerHTML = `
                ${thumbHTML}
                <div class="art-creative-overlay">
                    <div class="art-creative-play">▶</div>
                    <div class="art-creative-meta">
                        <span class="art-creative-tag">${piece.sub}</span>
                        <h3 class="art-creative-title">${piece.title}</h3>
                    </div>
                </div>
            `;

            el.addEventListener('click', () => openArtLightbox(i));
            observer.observe(el);
            artGallery.appendChild(el);
        });
    }

    /* =========================================
       Art Lightbox
       ========================================= */
    const artLightbox = document.getElementById('artLightbox');
    const artLbTrack = document.getElementById('artLbTrack');
    const artLbDots = document.getElementById('artLbDots');
    const artLbCurrent = document.getElementById('artLbCurrent');
    const artLbTotal = document.getElementById('artLbTotal');
    const artLbPrev = document.getElementById('artLbPrev');
    const artLbNext = document.getElementById('artLbNext');
    const artLbClose = document.getElementById('artLightboxClose');
    let artLbIndex = 0;
    let artLbDragging = false;
    let artLbStartX = 0;

    function buildArtLightbox() {
        if (!artLbTrack) return;
        artLbTrack.innerHTML = '';
        artLbDots.innerHTML = '';
        if (artLbTotal) artLbTotal.textContent = ART_DATA.length;

        ART_DATA.forEach((piece, i) => {
            const slide = document.createElement('div');
            slide.className = 'art-lb-slide';

            const isYT = piece.video && (piece.video.includes('youtu.be') || piece.video.includes('youtube.com'));
            let ytId = null;
            if (isYT) {
                if (piece.video.includes('youtu.be/'))
                    ytId = piece.video.split('youtu.be/')[1].split('?')[0];
                else if (piece.video.includes('shorts/'))
                    ytId = piece.video.split('shorts/')[1].split('?')[0];
                else
                    ytId = piece.video.split('v=')[1];
            }

            slide.innerHTML = `
                <div class="art-lb-media">
                    ${isYT && ytId
                        ? `<iframe class="art-lb-iframe" src="" data-src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                        : piece.video
                            ? `<video class="art-lb-video" src="${piece.video}" controls autoplay loop playsinline></video>`
                            : `<img class="art-lb-img" src="${piece.poster}" alt="${piece.title}">`
                    }
                </div>
                <div class="art-lb-info">
                    <span class="art-lb-tag">${piece.sub}</span>
                    <h2 class="art-lb-title">${piece.title}</h2>
                </div>
            `;
            artLbTrack.appendChild(slide);

            const dot = document.createElement('button');
            dot.className = 'art-lb-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToArtSlide(i));
            artLbDots.appendChild(dot);
        });
    }

    function goToArtSlide(index, pauseOld = true) {
        const slides = artLbTrack.querySelectorAll('.art-lb-slide');
        const dots = artLbDots.querySelectorAll('.art-lb-dot');

        if (pauseOld) {
            const old = slides[artLbIndex];
            if (old) {
                const vid = old.querySelector('video');
                if (vid) vid.pause();
                const ifr = old.querySelector('iframe');
                if (ifr) ifr.src = '';
            }
        }

        artLbIndex = Math.max(0, Math.min(index, ART_DATA.length - 1));
        artLbTrack.style.transform = `translateX(-${artLbIndex * 100}%)`;

        if (artLbCurrent) artLbCurrent.textContent = artLbIndex + 1;
        dots.forEach((d, i) => d.classList.toggle('active', i === artLbIndex));

        if (artLbPrev) artLbPrev.style.opacity = artLbIndex === 0 ? '0.2' : '1';
        if (artLbNext) artLbNext.style.opacity = artLbIndex === ART_DATA.length - 1 ? '0.2' : '1';

        const current = slides[artLbIndex];
        if (current) {
            const ifr = current.querySelector('iframe[data-src]');
            if (ifr && !ifr.src.includes('youtube')) {
                ifr.src = ifr.dataset.src;
            }
            const vid = current.querySelector('video');
            if (vid) vid.play().catch(() => { });
        }
    }

    function openArtLightbox(index) {
        if (!artLightbox) return;
        buildArtLightbox();
        artLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => goToArtSlide(index, false), 50);
    }

    function closeArtLightbox() {
        if (!artLightbox) return;
        artLbTrack.querySelectorAll('video').forEach(v => v.pause());
        artLbTrack.querySelectorAll('iframe').forEach(f => { f.src = ''; });
        artLightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (artLbClose) artLbClose.addEventListener('click', closeArtLightbox);
    if (artLbPrev) artLbPrev.addEventListener('click', () => goToArtSlide(artLbIndex - 1));
    if (artLbNext) artLbNext.addEventListener('click', () => goToArtSlide(artLbIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (!artLightbox || !artLightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') goToArtSlide(artLbIndex - 1);
        if (e.key === 'ArrowRight') goToArtSlide(artLbIndex + 1);
        if (e.key === 'Escape') closeArtLightbox();
    });

    if (artLbTrack) {
        artLbTrack.addEventListener('pointerdown', (e) => {
            artLbDragging = true;
            artLbStartX = e.clientX;
            artLbTrack.setPointerCapture(e.pointerId);
        });
        artLbTrack.addEventListener('pointerup', (e) => {
            if (!artLbDragging) return;
            artLbDragging = false;
            const diff = artLbStartX - e.clientX;
            if (Math.abs(diff) > 50) {
                goToArtSlide(artLbIndex + (diff > 0 ? 1 : -1));
            }
        });
    }

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

    let currentCategory = 'logo';

    function openHub(category) {
        if (!hub) return;
        currentCategory = category || 'logo';
        loadHubCategory(currentCategory, 'All');
        hub.classList.add('active');
        document.body.style.overflow = 'hidden';

        hubIcons.forEach(icon => {
            icon.classList.toggle('active', icon.dataset.category === currentCategory);
        });
    }

    function closeHub() {
        hub.classList.remove('active');
        document.body.style.overflow = '';
    }

    function loadHubCategory(category, activeFilter = 'All', animate = true) {
        const data = HUB_DATA[category];
        if (!data) return;

        hubLabel.textContent = data.label;

        const hubFiltersContainer = document.getElementById('hubFilters');
        if (hubFiltersContainer) {
            hubFiltersContainer.innerHTML = '';
            if (data.filters && data.filters.length > 0) {
                data.filters.forEach(filterName => {
                    const btn = document.createElement('button');
                    btn.className = 'hub-filter-btn' + (filterName === activeFilter ? ' active' : '');
                    btn.textContent = filterName;
                    btn.addEventListener('click', () => {
                        loadHubCategory(category, filterName, true);
                    });
                    hubFiltersContainer.appendChild(btn);
                });
                hubFiltersContainer.style.display = 'flex';
            } else {
                hubFiltersContainer.style.display = 'none';
            }
        }

        const isShop = category === 'shop';

        let displayItems = data.items;
        if (activeFilter !== 'All') {
            displayItems = data.items.filter(item => item.tag === activeFilter);
        }

        if (animate) {
            hubGrid.style.opacity = '0';
            hubGrid.style.transform = 'translateY(10px)';
        }

        setTimeout(() => {
            hubGrid.innerHTML = '';
            if (displayItems.length === 0) {
                hubGrid.innerHTML = `<div class="hub-empty-state"><span class="hub-empty-icon">🎬</span><p>0 projects</p><span>Coming soon.</span></div>`;
            }
            displayItems.forEach((item, i) => {
                const card = document.createElement('div');
                card.className = 'hub-card';
                card.style.animationDelay = `${i * 0.06}s`;

                let mediaHTML = '';
                let badgeHTML = '';
                if (item.versions && item.versions.length > 1) {
                    badgeHTML = `<span class="version-badge">${item.versions.length}</span>`;
                }

                const isYouTube = item.video && (item.video.includes('youtu.be') || item.video.includes('youtube.com'));

                if (item.video && !isYouTube) {
                    const posterAttr = item.poster ? `poster="${item.poster}"` : '';
                    mediaHTML = `
                        <video class="hub-thumb-video" muted playsinline preload="metadata" ${posterAttr}>
                            <source src="${item.video}" type="video/mp4">
                        </video>
                        <span class="hub-thumb-tag">${item.tag}</span>
                        ${badgeHTML}
                        <div class="play-overlay">▶</div>
                    `;
                } else if (item.poster) {
                    mediaHTML = `
                        <img src="${item.poster}" class="hub-thumb-img" alt="${item.title}">
                        <span class="hub-thumb-tag">${item.tag}</span>
                        ${badgeHTML}
                        ${item.video ? '<div class="play-overlay">▶</div>' : ''}
                    `;
                } else {
                    mediaHTML = `<span class="hub-thumb-tag">${item.tag}</span>`;
                }

                card.innerHTML = `
                    <div class="hub-thumb" style="background:${item.bg || '#111'};">
                        ${mediaHTML}
                    </div>
                    <div class="hub-card-info">
                        <h4>${item.title}</h4>
                        ${item.price ? `<p class="hub-card-price">${item.price}</p>` : ''}
                        ${item.href ? `<a href="${item.href}" target="_blank" class="mogrt-buy-btn" style="text-decoration:none; display:inline-block; margin-top:10px; padding: 8px 16px; font-size: 14px; text-align: center; width: 100%; box-sizing: border-box;" onclick="event.stopPropagation()">Download / Get</a>` : ''}
                        ${item.file && !item.href ? `<a href="${item.file}" download class="mogrt-buy-btn" style="text-decoration:none; display:inline-block; margin-top:10px; padding: 8px 16px; font-size: 14px; text-align: center; width: 100%; box-sizing: border-box;" onclick="event.stopPropagation()">Download .rar</a>` : ''}
                    </div>
                `;

                if (item.video || item.poster) {
                    card.addEventListener('click', () => openVideoModal(displayItems, i));
                }

                hubGrid.appendChild(card);
            });

            if (isShop) {
                mogrtsSection.style.display = 'block';
                renderMogrts();
                hubCount.textContent = `${displayItems.length} packs + ${MOGRTS_DATA.length} mogrts`;
            } else {
                mogrtsSection.style.display = 'none';
                hubCount.textContent = `${displayItems.length} project${displayItems.length !== 1 ? 's' : ''}`;
            }

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

    hubIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const cat = icon.dataset.category;
            if (cat === currentCategory) return;
            currentCategory = cat;
            hubIcons.forEach(ic => ic.classList.remove('active'));
            icon.classList.add('active');
            loadHubCategory(cat, 'All');
        });
    });

    document.querySelectorAll('.minimal-card[data-open-hub]').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-open-hub');
            openHub(cat);
        });
    });

    if (closeHubBtn) {
        closeHubBtn.addEventListener('click', closeHub);
    }

    /* =========================================
       Unified Project Lightbox
       ========================================= */
    function extractYouTubeId(url) {
        if (!url) return null;
        if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
        if (url.includes('youtube.com/watch?v=')) return url.split('v=')[1].split('&')[0];
        if (url.includes('youtube.com/shorts/')) return url.split('youtube.com/shorts/')[1].split('?')[0];
        return null;
    }

    const plBox = document.getElementById('projectLightbox');
    const plClose = document.getElementById('plClose');
    const plPrev = document.getElementById('plPrev');
    const plNext = document.getElementById('plNext');
    const plCounter = document.getElementById('plCounter');
    const plTotal = document.getElementById('plTotal');
    const plTag = document.getElementById('plTag');
    const plTitle = document.getElementById('plTitle');
    const plMediaWrap = document.getElementById('plMediaWrap');
    const plVersions = document.getElementById('plVersions');

    let plItems = [];
    let plIndex = 0;
    let plVerIndex = 0;
    let plDragStart = 0;
    let plDragging = false;

    function plStopMedia() {
        if (!plMediaWrap) return;
        plMediaWrap.querySelectorAll('video').forEach(v => { v.pause(); v.src = ''; });
        plMediaWrap.querySelectorAll('iframe').forEach(f => { f.src = ''; });
    }

    function plPlaySrc(item, src, verIdx) {
        if (!plMediaWrap) return;
        plStopMedia();
        plMediaWrap.innerHTML = '';

        const isShort = src && src.includes('youtube.com/shorts/');
        const isReel = item.tag === 'Reels' || item.tag === 'Cinematic Shorts' || isShort;
        plMediaWrap.dataset.ratio = isReel ? 'portrait' : 'landscape';

        if (!src) {
            if (item.poster) {
                const img = document.createElement('img');
                img.src = item.poster;
                img.className = 'pl-media-img';
                plMediaWrap.appendChild(img);
            }
            return;
        }

        const isYT = src.includes('youtu.be') || src.includes('youtube.com');
        if (isYT) {
            const ytId = extractYouTubeId(src);
            if (ytId) {
                const ifr = document.createElement('iframe');
                ifr.className = 'pl-media-iframe';
                ifr.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
                ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                ifr.allowFullscreen = true;
                plMediaWrap.appendChild(ifr);
            }
        } else {
            const vid = document.createElement('video');
            vid.className = 'pl-media-video';
            vid.controls = true;
            vid.autoplay = true;
            vid.loop = true;
            vid.playsInline = true;
            if (item.poster) vid.poster = item.poster;
            vid.src = src;
            vid.play().catch(() => { });
            plMediaWrap.appendChild(vid);
        }

        if (plVersions) {
            plVersions.querySelectorAll('.pl-ver-thumb').forEach((t, i) => {
                t.classList.toggle('active', i === verIdx);
            });
        }
    }

    function plBuildVersions(item) {
        if (!plVersions) return;
        plVersions.innerHTML = '';
        const vers = item.versions && item.versions.length > 1 ? item.versions : [];
        plVersions.style.display = vers.length > 0 ? 'flex' : 'none';

        vers.forEach((src, i) => {
            const thumb = document.createElement('div');
            thumb.className = 'pl-ver-thumb' + (i === 0 ? ' active' : '');

            const isYt = src.includes('youtu.be') || src.includes('youtube.com');
            if (isYt) {
                const ytId = extractYouTubeId(src);
                thumb.innerHTML = `
                    <img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" alt="V${i + 1}">
                    <span class="pl-ver-lbl">V${i + 1}</span>
                `;
            } else {
                thumb.innerHTML = `
                    <video muted playsinline preload="metadata" src="${src}"></video>
                    <span class="pl-ver-lbl">V${i + 1}</span>
                `;
            }

            thumb.addEventListener('click', () => {
                plVerIndex = i;
                plPlaySrc(item, src, i);
            });
            plVersions.appendChild(thumb);
        });
    }

    function plLoad(index) {
        if (!plItems.length) return;
        plIndex = Math.max(0, Math.min(index, plItems.length - 1));
        plVerIndex = 0;
        const item = plItems[plIndex];

        if (plCounter) plCounter.textContent = plIndex + 1;
        if (plTotal) plTotal.textContent = plItems.length;

        if (plTag) plTag.textContent = item.tag || '';
        if (plTitle) plTitle.textContent = item.title || '';

        if (plPrev) plPrev.style.opacity = plIndex === 0 ? '0.2' : '1';
        if (plNext) plNext.style.opacity = plIndex === plItems.length - 1 ? '0.2' : '1';

        plBuildVersions(item);

        const mainSrc = item.versions && item.versions.length > 0 ? item.versions[0] : (item.video || null);
        plPlaySrc(item, mainSrc, 0);
    }

    function openVideoModal(items, index) {
        if (!plBox) return;
        plItems = items.filter(it => it.video || it.poster);
        plBox.classList.add('active');
        document.body.style.overflow = 'hidden';
        plLoad(index);
    }

    function closePL() {
        if (!plBox) return;
        plStopMedia();
        plBox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (plClose) plClose.addEventListener('click', closePL);
    if (plPrev) plPrev.addEventListener('click', () => plLoad(plIndex - 1));
    if (plNext) plNext.addEventListener('click', () => plLoad(plIndex + 1));

    if (plBox) {
        plBox.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.pl-ver-thumb, .pl-close-btn, .pl-arrow, video, iframe, img')) return;
            plDragging = true;
            plDragStart = e.clientX;
        });
        plBox.addEventListener('pointerup', (e) => {
            if (!plDragging) return;
            plDragging = false;
            const diff = plDragStart - e.clientX;
            if (Math.abs(diff) > 60) plLoad(plIndex + (diff > 0 ? 1 : -1));
        });
    }

    document.addEventListener('keydown', (e) => {
        if (plBox && plBox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') plLoad(plIndex - 1);
            if (e.key === 'ArrowRight') plLoad(plIndex + 1);
            if (e.key === 'Escape') closePL();
            return;
        }
        if (e.key === 'Escape') {
            if (hub && hub.classList.contains('active')) closeHub();
        }
    });

    /* =========================================
       Contact Form Handling
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = this.querySelector('.magnetic-btn');
            const originalText = btn.innerHTML;

            const name = this.elements[0].value.trim();
            const email = this.elements[1].value.trim();
            const type = this.elements[2].value.trim();
            const message = this.elements[3].value.trim();

            btn.innerHTML = 'Sending… <span class="arrow">⏳</span>';
            btn.disabled = true;

            try {
                const res = await fetch('https://formsubmit.co/ajax/adnanaittaher1@gmail.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        name,
                        email,
                        'Project Type': type,
                        message,
                        _subject: 'New Project Inquiry from ' + name,
                        _captcha: 'false'
                    })
                });
                const data = await res.json();
                if (data.success === 'true' || data.success === true) {
                    btn.innerHTML = '✓ Request Sent! <span class="arrow">→</span>';
                    btn.style.background = '#00c853';
                    btn.style.borderColor = '#00c853';
                    btn.style.color = '#fff';
                    contactForm.reset();
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.style.borderColor = '';
                        btn.style.color = '';
                        btn.disabled = false;
                    }, 4000);
                } else {
                    throw new Error('Form failed');
                }
            } catch (err) {
                btn.innerHTML = '✗ Failed — try email <span class="arrow">→</span>';
                btn.style.borderColor = 'var(--accent)';
                btn.style.color = 'var(--accent)';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 4000);
            }
        });
    }

});
