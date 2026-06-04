(function () {
  var muted = true;

  function setMute(state) {
    muted = state;
    document.querySelectorAll('.owner-video').forEach(function (v) { v.muted = state; });
    var muteIcon = document.getElementById('muteIcon');
    var unmuteIcon = document.getElementById('unmuteIcon');
    if (muteIcon) muteIcon.style.display = state ? 'flex' : 'none';
    if (unmuteIcon) unmuteIcon.style.display = state ? 'none' : 'flex';
  }

  function loadVideo(video) {
    var source = video.querySelector('source');
    if (source && source.dataset.src && !source.dataset.loaded) {
      source.src = source.dataset.src;
      source.dataset.loaded = '1';
      video.load();
    }
  }

  function activateSlideVideo(video) {
    loadVideo(video);
    video.muted = muted;
    video.play().catch(function () {});
    document.querySelectorAll('.owner-video').forEach(function (v) {
      if (v !== video) v.pause();
    });
  }

  function preloadAdjacent(swiperEl) {
    ['.swiper-slide-next', '.swiper-slide-prev'].forEach(function (cls) {
      var slide = swiperEl.querySelector(cls);
      if (slide) {
        var video = slide.querySelector('.owner-video');
        if (video) loadVideo(video);
      }
    });
  }

  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () {
    var swiperEl = document.querySelector('.swiper');
    if (!swiperEl) return;

    var btn = document.getElementById('muteButton');
    if (btn) {
      setMute(true);
      btn.addEventListener('click', function () { setMute(!muted); });
    }

    // Track the last active slide index to avoid firing multiple times per transition
    var lastActiveIndex = -1;

    function onSlideChange() {
      var activeSlide = swiperEl.querySelector('.swiper-slide-active');
      if (!activeSlide) return;
      var idx = activeSlide.getAttribute('data-swiper-slide-index');
      if (idx === lastActiveIndex) return;
      lastActiveIndex = idx;
      var video = activeSlide.querySelector('.owner-video');
      if (video) {
        activateSlideVideo(video);
        preloadAdjacent(swiperEl);
      }
    }

    // Use Swiper's native API if available, otherwise MutationObserver
    var swiper = swiperEl.swiper;
    if (swiper) {
      swiper.on('slideChange', onSlideChange);
    } else {
      new MutationObserver(onSlideChange).observe(swiperEl, {
        subtree: true, attributes: true, attributeFilter: ['class']
      });
    }

    // Lazy-load first video when section scrolls into view
    var firstVideo = swiperEl.querySelector('.swiper-slide-active .owner-video');
    if (firstVideo) {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) {
          activateSlideVideo(firstVideo);
          preloadAdjacent(swiperEl);
          obs.disconnect();
        }
      }, { rootMargin: '200px' }).observe(firstVideo);
    }
  });
})();
