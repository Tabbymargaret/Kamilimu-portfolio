(function () {
    var modal = document.getElementById('month-modal');
    if (!modal) return;

    var closeBtn = document.getElementById('month-modal-close');
    var backdrop = modal.querySelector('[data-month-modal-close]');
    var eyebrowEl = document.getElementById('month-modal-eyebrow');
    var titleEl = document.getElementById('month-modal-title');
    var phaseEl = document.getElementById('month-modal-phase');
    var galleryView = document.getElementById('month-modal-gallery-view');
    var galleryEmpty = document.getElementById('month-modal-gallery-empty');
    var galleryMain = document.getElementById('month-gallery-main');
    var galleryPrev = document.getElementById('month-gallery-prev');
    var galleryNext = document.getElementById('month-gallery-next');
    var galleryCount = document.getElementById('month-gallery-count');
    var galleryStrip = document.getElementById('month-gallery-strip');
    var mediumEl = document.getElementById('month-modal-medium');

    var galleryItems = [];
    var galleryIndex = 0;

    var PLACEHOLDER = 'REPLACE_WITH_YOUR_MEDIUM_USERNAME';
    /* Edit per month — gallery[].src paths and medium.url/title/blurb */
    var MONTH_DETAILS = {
        '1': {
            eyebrow: 'April',
            title: 'Month 1',
            phase: 'The Formation Lap',
            locked: false,
            gallery: [
                { src: 'assets/month1.jpg', alt: 'Month 1 — formation lap' }
            ],
            medium: {
                url: 'https://medium.com/@REPLACE_WITH_YOUR_MEDIUM_USERNAME/month-1-formation-lap',
                title: 'Formation lap notes',
                blurb: 'Onboarding, Git mastery, and professional branding — reflections on Kamilimu Month 1.'
            }
        },
        '2': {
            eyebrow: 'May',
            title: 'Month 2',
            phase: 'The Acceleration Phase',
            locked: false,
            gallery: [{ src: 'assets/month2.jpg', alt: 'Month 2 — acceleration stretch' }],
            medium: {
                url: 'https://medium.com/@REPLACE_WITH_YOUR_MEDIUM_USERNAME/month-2-acceleration',
                title: 'Acceleration phase recap',
                blurb: 'Public speaking, hackathon sprint, and advocacy — Month 2 in the cockpit.'
            }
        },
        '3': {
            eyebrow: 'Coming',
            title: 'Month 3',
            phase: 'Pit lane closed',
            locked: true,
            gallery: [],
            medium: null
        },
        '4': {
            eyebrow: 'Coming',
            title: 'Month 4',
            phase: 'Pit lane closed',
            locked: true,
            gallery: [],
            medium: null
        },
        '5': {
            eyebrow: 'Coming',
            title: 'Month 5',
            phase: 'Pit lane closed',
            locked: true,
            gallery: [],
            medium: null
        },
        '6': {
            eyebrow: 'Coming',
            title: 'Month 6',
            phase: 'Pit lane closed',
            locked: true,
            gallery: [],
            medium: null
        },
        '7': {
            eyebrow: 'Coming',
            title: 'Month 7',
            phase: 'Pit lane closed',
            locked: true,
            gallery: [],
            medium: null
        },
        '8': {
            eyebrow: 'Coming',
            title: 'Month 8',
            phase: 'Pit lane closed',
            locked: true,
            gallery: [],
            medium: null
        }
    };

    var modalOpen = false;
    var lastFocus = null;

    function escapeHtml(text) {
        var d = document.createElement('div');
        d.textContent = text == null ? '' : String(text);
        return d.innerHTML;
    }

    function placeholderUrl(url) {
        return !url || url.indexOf(PLACEHOLDER) !== -1;
    }

    function prefMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function setGalleryIndex(idx) {
        if (!galleryItems.length) return;
        var n = galleryItems.length;
        galleryIndex = ((idx % n) + n) % n;
        var cur = galleryItems[galleryIndex];
        if (galleryMain) {
            galleryMain.src = cur.src;
            galleryMain.alt = cur.alt || '';
            if (galleryIndex === 0) galleryMain.loading = 'eager';
        }
        if (galleryCount) {
            galleryCount.textContent = galleryIndex + 1 + ' / ' + n;
        }
        if (galleryPrev) galleryPrev.disabled = n <= 1;
        if (galleryNext) galleryNext.disabled = n <= 1;
        if (galleryStrip) {
            var thumbs = galleryStrip.querySelectorAll('.month-gallery-thumb');
            thumbs.forEach(function (t, i) {
                var on = i === galleryIndex;
                t.classList.toggle('is-current', on);
                t.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            var active = thumbs[galleryIndex];
            if (active && active.scrollIntoView) {
                active.scrollIntoView({
                    inline: 'center',
                    block: 'nearest',
                    behavior: prefMotion() ? 'auto' : 'smooth'
                });
            }
        }
    }

    function initGalleryViewer(items) {
        galleryItems = items.slice();
        galleryIndex = 0;
        if (galleryStrip) {
            galleryStrip.innerHTML = '';
            galleryItems.forEach(function (meta, idx) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'month-gallery-thumb';
                b.setAttribute('data-gallery-idx', String(idx));
                b.setAttribute('aria-pressed', idx === 0 ? 'true' : 'false');
                b.setAttribute('aria-label', 'Show photo ' + (idx + 1) + ' of ' + galleryItems.length);
                var im = document.createElement('img');
                im.src = meta.src;
                im.alt = '';
                im.loading = idx < 4 ? 'eager' : 'lazy';
                im.decoding = 'async';
                b.appendChild(im);
                galleryStrip.appendChild(b);
            });
        }
        if (galleryView) galleryView.classList.remove('hidden');
        if (galleryEmpty) galleryEmpty.classList.add('hidden');
        setGalleryIndex(0);
    }

    function hideGalleryViewer() {
        galleryItems = [];
        if (galleryView) galleryView.classList.add('hidden');
        if (galleryStrip) galleryStrip.innerHTML = '';
        if (galleryMain) {
            galleryMain.removeAttribute('src');
            galleryMain.alt = '';
        }
        if (galleryCount) galleryCount.textContent = '';
    }

    function renderLockedMedium() {
        var box = document.createElement('div');
        box.className = 'rounded-xl border border-white/10 bg-white/[0.025] px-5 py-6 text-neon-white/55 text-sm font-body leading-relaxed';
        box.innerHTML =
            '<p class="font-racing text-xs uppercase tracking-wider text-white/42 mb-2">Medium article</p>' +
            '<p>Open this modal again when the month ships — paste your Medium link and teaser copy inside <strong class="text-white/70 font-normal font-mono text-[11px]">MONTH_DETAILS</strong> for that slot.</p>';
        mediumEl.appendChild(box);
    }

    function renderPlaceholderMedium(m) {
        var box = document.createElement('div');
        box.className = 'rounded-xl border border-dashed border-papaya/30 bg-papaya/[0.05] px-5 py-6 text-neon-white/70 text-sm font-body leading-relaxed';
        box.innerHTML =
            '<p class="font-racing text-xs uppercase tracking-wider text-papaya/90 mb-2">Set your Medium URL</p>' +
            '<p>Replace <code class="font-mono text-[11px] text-white/80">' +
            escapeHtml(PLACEHOLDER) +
            '</code> in <strong class="text-white/80 font-normal">MONTH_DETAILS</strong> with your real Medium username or story link.</p>' +
            '<p class="mt-3 text-white/48 text-xs">Draft title: ‘' +
            escapeHtml(m.title) +
            '’</p>';
        mediumEl.appendChild(box);
    }

    function renderMediumCard(m) {
        var a = document.createElement('a');
        a.href = m.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className =
            'group block rounded-xl overflow-hidden border border-white/14 bg-white/[0.04] backdrop-blur-sm p-6 shadow-none transition-colors hover:border-papaya/45 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-papaya/55';
        var ey = document.createElement('span');
        ey.className = 'inline-block font-telemetry text-[10px] uppercase tracking-[0.35em] text-white/42 mb-2';
        ey.textContent = 'Medium essay';
        var h = document.createElement('p');
        h.className = 'font-racing text-lg sm:text-xl text-white uppercase leading-snug tracking-wide group-hover:text-papaya/90 transition-colors';
        h.textContent = m.title || 'Read on Medium';
        var p = document.createElement('p');
        p.className = 'mt-3 font-body text-sm text-neon-white/75 leading-relaxed';
        p.textContent = m.blurb || '';
        var row = document.createElement('span');
        row.className = 'mt-5 inline-flex items-center gap-2 font-racing text-xs uppercase tracking-[0.2em] text-white/60 group-hover:text-white';
        row.innerHTML =
            'Open on Medium <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7V17"/></svg>';
        a.appendChild(ey);
        a.appendChild(h);
        a.appendChild(p);
        a.appendChild(row);
        mediumEl.appendChild(a);
    }

    function populateMedium(d) {
        mediumEl.innerHTML = '';
        if (d.locked || !d.medium) {
            renderLockedMedium();
            return;
        }
        if (placeholderUrl(d.medium.url)) {
            renderPlaceholderMedium(d.medium);
        } else {
            renderMediumCard(d.medium);
        }
    }

    function openModal(monthKey) {
        var d = MONTH_DETAILS[monthKey];
        if (!d) return;

        lastFocus = document.activeElement;

        eyebrowEl.textContent = d.eyebrow || '';
        titleEl.textContent = d.title || '';
        phaseEl.textContent = d.phase || '';

        hideGalleryViewer();
        if (galleryEmpty) {
            galleryEmpty.classList.add('hidden');
            galleryEmpty.textContent = '';
        }

        if (d.locked) {
            if (galleryEmpty) {
                galleryEmpty.textContent =
                    'This stint is still parked in the paddock — your photo gallery unlocks once you flip the telemetry for Month ' +
                    monthKey +
                    '.';
                galleryEmpty.classList.remove('hidden');
            }
        } else if (!d.gallery || d.gallery.length === 0) {
            if (galleryEmpty) {
                galleryEmpty.textContent =
                    'Drop photos into assets/month' +
                    monthKey +
                    '/gallery/ and list them inside MONTH_DETAILS in js/month-modal.js for this lap.';
                galleryEmpty.classList.remove('hidden');
            }
        } else {
            initGalleryViewer(d.gallery);
        }

        populateMedium(d);

        modalOpen = true;
        modal.classList.add('month-modal--open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('month-modal--scroll-lock');

        window.setTimeout(function () {
            if (closeBtn) closeBtn.focus();
        }, 0);
    }

    function closeModal() {
        modalOpen = false;
        modal.classList.remove('month-modal--open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('month-modal--scroll-lock');
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    document.querySelectorAll('.month-card-trigger').forEach(function (card) {
        card.addEventListener('click', function () {
            openModal(card.getAttribute('data-month'));
        });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card.getAttribute('data-month'));
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    if (galleryPrev) {
        galleryPrev.addEventListener('click', function () {
            setGalleryIndex(galleryIndex - 1);
        });
    }
    if (galleryNext) {
        galleryNext.addEventListener('click', function () {
            setGalleryIndex(galleryIndex + 1);
        });
    }
    if (galleryStrip) {
        galleryStrip.addEventListener('click', function (e) {
            var b = e.target.closest('.month-gallery-thumb');
            if (!b || !galleryStrip.contains(b)) return;
            var i = parseInt(b.getAttribute('data-gallery-idx'), 10);
            if (!isNaN(i)) setGalleryIndex(i);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (!modalOpen) return;
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        if (!galleryItems.length) return;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setGalleryIndex(galleryIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setGalleryIndex(galleryIndex + 1);
        }
    });
})();
