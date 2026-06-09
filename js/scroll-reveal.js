(function () {
    var reveals = document.querySelectorAll('.reveal');
    var bentos = document.querySelectorAll('.bento-enter');
    function activate(el) {
        if (el.classList.contains('bento-enter')) el.classList.add('bento-visible');
        else el.classList.add('reveal-visible');
    }
    if (!('IntersectionObserver' in window)) {
        reveals.forEach(function (el) { el.classList.add('reveal-visible'); });
        bentos.forEach(function (el) { el.classList.add('bento-visible'); });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                activate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    reveals.forEach(function (el) { observer.observe(el); });
    bentos.forEach(function (el) { observer.observe(el); });
})();
