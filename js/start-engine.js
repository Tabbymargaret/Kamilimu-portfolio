(function () {
    function playSyntheticEngine() {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        var ctx = new AC();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var now = ctx.currentTime;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(48, now + 0.38);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
    }
    var btn = document.getElementById('btn-start-engine');
    var audio = document.getElementById('hero-engine');
    var launchModal = document.getElementById('launch-modal');
    var launchClose = document.getElementById('launch-modal-close');
    var launchBackdrop = launchModal && launchModal.querySelector('[data-launch-modal-close]');
    var confettiCanvas = document.getElementById('launch-confetti');
    if (!btn) return;

    var launchOpen = false;
    var confettiRaf;
    var confettiParticles = [];
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var confettiColors = ['#FF8700', '#FDE100', '#E10600', '#F8FAFC', '#00A9B5', '#FFFFFF'];

    function resizeConfettiCanvas() {
        if (!confettiCanvas) return;
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    function stopConfetti() {
        if (confettiRaf) {
            cancelAnimationFrame(confettiRaf);
            confettiRaf = null;
        }
        confettiParticles = [];
        if (confettiCanvas) {
            var ctx = confettiCanvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }

    function tickConfetti() {
        if (!confettiCanvas || !launchOpen) return;
        var ctx = confettiCanvas.getContext('2d');
        if (!ctx) return;

        for (var s = 0; s < 6; s++) {
            confettiParticles.push({
                x: Math.random() * confettiCanvas.width,
                y: -12 - Math.random() * 48,
                w: 5 + Math.random() * 7,
                h: 3 + Math.random() * 5,
                vx: -1.2 + Math.random() * 2.4,
                vy: 2.2 + Math.random() * 3.8,
                rot: Math.random() * Math.PI * 2,
                vr: -0.12 + Math.random() * 0.24,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
            });
        }

        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles = confettiParticles.filter(function (p) {
            return p.y < confettiCanvas.height + 24;
        });

        confettiParticles.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        confettiRaf = requestAnimationFrame(tickConfetti);
    }

    function startConfetti() {
        if (prefersReducedMotion || !confettiCanvas) return;
        stopConfetti();
        resizeConfettiCanvas();
        tickConfetti();
    }

    function openLaunchModal() {
        if (!launchModal || launchOpen) return;
        launchOpen = true;
        launchModal.classList.add('launch-modal--open');
        launchModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('month-modal--scroll-lock');
        startConfetti();
        window.setTimeout(function () {
            if (launchClose) launchClose.focus();
        }, 0);
    }

    function closeLaunchModal() {
        if (!launchModal || !launchOpen) return;
        launchOpen = false;
        launchModal.classList.remove('launch-modal--open');
        launchModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('month-modal--scroll-lock');
        stopConfetti();
        btn.focus();
    }

    if (launchClose) launchClose.addEventListener('click', closeLaunchModal);
    if (launchBackdrop) launchBackdrop.addEventListener('click', closeLaunchModal);
    window.addEventListener('resize', function () {
        if (launchOpen) resizeConfettiCanvas();
    });
    document.addEventListener('keydown', function (e) {
        if (launchOpen && e.key === 'Escape') closeLaunchModal();
    });

    btn.addEventListener('click', function () {
        if (audio && audio.querySelector('source')) {
            audio.currentTime = 0;
            var p = audio.play();
            if (p && typeof p.catch === 'function') {
                p.catch(function () {
                    playSyntheticEngine();
                });
            }
        } else {
            playSyntheticEngine();
        }
        openLaunchModal();
    });
})();
