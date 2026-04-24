(function () {
  setTimeout(function () {
    var targets = document.querySelectorAll('.underlined');
    if (!targets.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.4,
      rootMargin: '0px 0px -10% 0px'
    });
    targets.forEach(function (el) {
      if (el.id === 'textSwap') return; // textSwap has its own script
      observer.observe(el);
    });
  }, 100);
})();
