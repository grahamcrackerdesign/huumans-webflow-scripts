(function () {
  if (window._ownerVideoInit) return;
  window._ownerVideoInit = true;
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
      video.preload = 'auto';
      video.load();
    }
  }

  function activateSlideVideo(video) {
    document.querySelectorAll('.owner-video').forEach(function (v) {
      if (v !== video) v.pause();
    });
    video.muted = muted;
    loadVideo(video);
    video.play().catch(function () {});
  }

  function setup(swiperEl, swiper) {
    var btn = document.getElementById('muteButton');
    if (btn) {
      setMute(true);
      btn.addEventListener('click', function () { setMute(!muted); });
    }

    swiper.on('slideChange', function () {
      var activeSlide = swiper.slides[swiper.activeIndex];
      if (!activeSlide) return;
      var video = activeSlide.querySelector('.owner-video');
      if (video) activateSlideVideo(video);
    });

    new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      swiperEl.querySelectorAll('.owner-video').forEach(loadVideo);
      var activeSlide = swiperEl.querySelector('.swiper-slide-active');
      if (activeSlide) {
        var video = activeSlide.querySelector('.owner-video');
        if (video) activateSlideVideo(video);
      }
    }, { rootMargin: '200px' }).observe(swiperEl);
  }

  function tryInit(attemptsLeft) {
    var swiperEl = document.querySelector('[data-slider="slider"]');
    var swiper = swiperEl && (swiperEl.swiperInstance || (window.AttributesSwiper && window.AttributesSwiper.getInstance(0)));
    if (swiper) {
      setup(swiperEl, swiper);
    } else if (attemptsLeft > 0) {
      setTimeout(function () { tryInit(attemptsLeft - 1); }, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { tryInit(20); });
  } else {
    tryInit(20);
  }
})();
