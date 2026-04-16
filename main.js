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
        animation: {
            label: 'Animation',
            items: [
                {
                    title: 'Antigravity Intro',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/AntiGravity.jpg',
                    video: 'https://youtube.com/shorts/adCad0sZMP0',
                    versions: ['https://youtube.com/shorts/adCad0sZMP0']
                },
                {
                    title: 'Filmoda Animation',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/Filmoda.jpg',
                    video: 'https://youtu.be/MyT1gnJpnII',
                    versions: ['https://youtu.be/MyT1gnJpnII',
                        'https://youtu.be/WGPTZSUJABE',
                        'https://youtu.be/3_czaDVTWLk'
                    ]
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
                    versions: ['https://youtu.be/H5JBIq2Dae8',
                        'https://youtu.be/g30ESQVCtwI'
                    ]
                },
                {
                    title: 'B Games',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/JujutsuEyeLogo.jpg',
                    video: 'https://youtu.be/IxE3TR7PaZ4',
                    versions: ['https://youtu.be/IxE3TR7PaZ4',
                        'https://youtu.be/fpxK-nvLZkU']
                },
                {
                    title: 'WheelOtto',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/wheelbarrow.jpg',
                    video: 'videos/Animations/Filmoda Animation/FilmodaAnimation.mp4',
                    versions: ['videos/Animations/Filmoda Animation/FilmodaAnimation.mp4']
                },
                {
                    title: 'Two Love Intro',
                    tag: 'Animation',
                    bg: '#111',
                    poster: 'IMG/Logos/twolove.jpg',
                    video: 'https://youtu.be/71TBaXYBjYs',
                    versions: [
                        'https://youtu.be/71TBaXYBjYs',
                        'https://youtu.be/Q6vkRAlyO9s',
                        'https://youtu.be/xRqQK6Fnzzk'
                    ]
                }
            ]
        },
        youtube: {
            label: 'YouTube',
            items: [
                {
                    title: 'Aot War Remake', tag: 'YouTube', bg: 'linear-gradient(45deg, #141e30, #243b55)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtu.be/akFZ3tEj-Fk'
                },
                {
                    title: 'Distort Effects Tutorial', tag: 'YouTube', bg: 'linear-gradient(45deg, #1d1d1d, #e96c4c)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtu.be/ywIvSykoXNY'
                },
                {
                    title: 'Akatsuki Members', tag: 'YouTube', bg: 'linear-gradient(45deg, #232526, #414345)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtu.be/U6PNdijVDG8'
                }
            ]
        },
        logo: {
            label: 'Logo & Brand',
            items: [
                { title: 'Filmoda', tag: 'Logo', bg: 'linear-gradient(45deg, #1d976c, #93f9b9)', poster: 'IMG/Logos/Filmoda.jpg', },
                { title: 'Two Love', tag: 'Logo', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)', poster: 'IMG/Logos/twolove.jpg', },
                { title: 'Number 2', tag: 'Logo', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)', poster: 'IMG/Logos/2animate.jpg', },
                { title: 'ColorfY', tag: 'Logo', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)', poster: 'IMG/Logos/ColorfY.jpg', },
                { title: 'Antigravity', tag: 'Logo', bg: 'linear-gradient(45deg, #6a11cb, #2575fc)', poster: 'IMG/Logos/AntiGravity.jpg', },
                { title: 'wheelbarrow', tag: 'Logo', bg: 'linear-gradient(45deg, #f7971e, #ffd200)', poster: 'IMG/Logos/wheelbarrow.jpg', },
                { title: 'JujutsuEyeLogo', tag: 'Logo', bg: 'linear-gradient(45deg, #0f0c29, #302b63)', poster: 'IMG/Logos/JujutsuEyeLogo.jpg', },
            ]
        },
        art: {
            label: 'Visual Art',
            items: [
                {
                    title: 'Aot Final Dose',
                    tag: 'Art', bg: 'linear-gradient(120deg, #f6d365, #fda085)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtu.be/pT9IZmD40Sk'
                },
                {
                    title: 'Filmoda Keys',
                    tag: 'Art', bg: 'linear-gradient(120deg, #f6d365, #fda085)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtu.be/W2phw46niOM'
                },

            ]
        },
        reels: {
            label: 'Reels & Shorts',
            items: [
                {
                    title: 'Lamine Yamal Goal', tag: 'Reels', bg: 'linear-gradient(45deg, #30cfd0, #330867)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtube.com/shorts/4wPp3IhVHSQ'
                },
                {
                    title: 'Share of Global Births', tag: 'Reels', bg: 'linear-gradient(45deg, #30cfd0, #330867)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtu.be/hwKcyZzpVJs'
                },
                {
                    title: 'AlJazzira Under Pressure', tag: 'Reels', bg: 'linear-gradient(45deg, #30cfd0, #330867)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtube.com/shorts/EaoAagVVSy8'
                },
                {
                    title: 'Ramadan Kareem', tag: 'Reels', bg: 'linear-gradient(45deg, #f7797d, #FBD786)',
                    poster: 'videos/Animations/Filmoda Animation/Filmoda.jpg',
                    video: 'https://youtube.com/shorts/0ud6Y6nFQ7U'
                }
            ]
        },
        music: {
            label: 'Music Videos',
            items: [

            ]
        },
        shop: {
            label: 'Shop',
            items: [

            ]
        }
    };

    const MOGRTS_DATA = [

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

    let currentCategory = 'logo';

    function openHub(category) {
        if (!hub) return;
        currentCategory = category || 'logo';
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
                    </div>
                `;

                if (item.video || item.poster) {
                    card.addEventListener('click', () => openVideoModal(data.items, i));
                }

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

    // ESC key closes hub or video modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (videoModal && videoModal.classList.contains('active')) {
                closeVideoDetails();
            } else if (hub.classList.contains('active')) {
                closeHub();
            }
        }
    });

    /* =========================================
       Video Modal Logic
       ========================================= */
    const videoModal = document.getElementById('videoModal');
    const videoModalContent = document.getElementById('videoModalContent');
    const closeVideoBtn = document.getElementById('closeVideoModal');
    const mainModalVideo = document.getElementById('mainModalVideo');
    const youtubeIframe = document.getElementById('youtubeIframe');
    const mainModalImg = document.getElementById('mainModalImg');
    const versionsContainer = document.getElementById('versionsContainer');
    const prevVideoBtn = document.getElementById('prevVideoModal');
    const nextVideoBtn = document.getElementById('nextVideoModal');

    let currentModalItems = [];
    let currentModalIndex = 0;

    function extractYouTubeId(url) {
        if (!url) return null;
        if (url.includes('youtu.be/')) {
            return url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch?v=')) {
            return url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtube.com/shorts/')) {
            return url.split('youtube.com/shorts/')[1].split('?')[0];
        }
        return null;
    }

    function playModalSource(item, src) {
        // Reset displays
        mainModalVideo.style.display = 'none';
        mainModalVideo.pause();
        if (youtubeIframe) {
            youtubeIframe.style.display = 'none';
            youtubeIframe.src = '';
        }
        if (mainModalImg) {
            mainModalImg.style.display = 'none';
            mainModalImg.src = '';
        }

        // Adjust aspect ratio based on category/tag/src
        const isReel = item.tag === 'Reels' || (src && src.includes('youtube.com/shorts/'));
        if (videoModalContent) {
            if (isReel) {
                videoModalContent.classList.remove('landscape');
            } else {
                videoModalContent.classList.add('landscape');
            }
        }

        if (!src) {
            // It's an image only (e.g. Logo without video)
            if (mainModalImg && item.poster) {
                mainModalImg.src = item.poster;
                mainModalImg.style.display = 'block';
            }
            return;
        }

        const isYouTube = src && (src.includes('youtu.be') || src.includes('youtube.com'));
        if (isYouTube) {
            const ytId = extractYouTubeId(src);
            if (youtubeIframe && ytId) {
                youtubeIframe.style.display = 'block';
                youtubeIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
            }
        } else {
            mainModalVideo.style.display = 'block';
            mainModalVideo.src = src;
            mainModalVideo.play().catch(e => console.warn("Auto-play prevented", e));
        }
    }

    function openVideoModal(items, index) {
        if (!videoModal) return;
        currentModalItems = items;
        currentModalIndex = index;
        const item = items[index];

        videoModal.classList.add('active');

        // Allow navigation
        if (prevVideoBtn) prevVideoBtn.style.display = index > 0 ? 'flex' : 'none';
        if (nextVideoBtn) nextVideoBtn.style.display = index < items.length - 1 ? 'flex' : 'none';

        // Find main source from versions or fallback to video
        let mainSrc = item.versions && item.versions.length > 0 ? item.versions[0] : item.video;
        playModalSource(item, mainSrc || null);

        versionsContainer.innerHTML = '';
        if (item.versions && item.versions.length > 1) {
            item.versions.forEach((verSrc, idx) => {
                const thumb = document.createElement('div');
                thumb.className = 'version-thumb' + (idx === 0 ? ' active' : '');

                const isYt = verSrc.includes('youtu.be') || verSrc.includes('youtube.com');
                if (!isYt) {
                    thumb.innerHTML = `
                        <video muted playsinline preload="metadata">
                            <source src="${verSrc}" type="video/mp4">
                        </video>
                        <span class="version-lbl">V${idx + 1}</span>
                    `;
                } else {
                    const ytId = extractYouTubeId(verSrc);
                    if (ytId) {
                        thumb.innerHTML = `
                            <img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;" />
                            <span class="version-lbl">V${idx + 1}</span>
                        `;
                    }
                }

                thumb.addEventListener('click', () => {
                    document.querySelectorAll('.version-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    playModalSource(item, verSrc);
                });
                versionsContainer.appendChild(thumb);
            });
        }
    }

    if (prevVideoBtn) {
        prevVideoBtn.addEventListener('click', () => {
            if (currentModalIndex > 0) openVideoModal(currentModalItems, currentModalIndex - 1);
        });
    }

    if (nextVideoBtn) {
        nextVideoBtn.addEventListener('click', () => {
            if (currentModalIndex < currentModalItems.length - 1) openVideoModal(currentModalItems, currentModalIndex + 1);
        });
    }

    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', closeVideoDetails);
    }

    function closeVideoDetails() {
        if (!videoModal) return;
        videoModal.classList.remove('active');
        if (mainModalVideo) {
            mainModalVideo.pause();
            mainModalVideo.src = '';
        }
        if (youtubeIframe) {
            youtubeIframe.src = '';
        }
        if (mainModalImg) {
            mainModalImg.src = '';
        }
    }

});
