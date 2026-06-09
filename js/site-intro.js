(function () {
    var intro = document.getElementById('site-intro');
    if (!intro) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        intro.remove();
        return;
    }
    document.body.classList.add('intro-splash-active');
    var done = false;
    function finalize() {
        if (done) return;
        done = true;
        intro.remove();
        document.body.classList.remove('intro-splash-active');
    }
    intro.addEventListener('transitionend', function (e) {
        if (e.propertyName !== 'opacity') return;
        if (!intro.classList.contains('intro-out')) return;
        finalize();
    });
    window.setTimeout(function () {
        intro.classList.add('intro-out');
    }, 3600);
    window.setTimeout(finalize, 5000);
})();
