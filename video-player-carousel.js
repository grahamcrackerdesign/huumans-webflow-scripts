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
      video.load();
    }
  }

  function activateSlideVideo(video) {
    console.log('[video] activateSlideVideo called', video);
    document.querySelectorAll('.owner-video').forEach(function (v) {
      if (v !== video) v.pause();
    });
    video.muted = muted;
    loadVideo(video);
    if (video.readyState >= 3) {
      video.play().catch(function (e) { console.log('[video] play() failed', e); });
    } else {
      video.addEventListener('canplay', function handler() {
        video.removeEventListener('canplay', handler);
        video.play().catch(function (e) { console.log('[video] play() failed', e); });
      });
    }
  }

  function setup(swiperEl, swiper) {
    console.log('[video] setup() called, swiper:', swiper);
    var btn = document.getElementById('muteButton');
    if (btn) {
      setMute(true);
      btn.addEventListener('click', function () { setMute(!muted); });
    }

    swiper.on('slideChange', function () {
      console.log('[video] slideChange fired');
      var activeSlide = swiperEl.querySelector('.swiper-slide-active');
      console.log('[video] activeSlide:', activeSlide);
      if (!activeSlide) return;
      var video = activeSlide.querySelector('.owner-video');
      console.log('[video] video found:', video);
      if (video) activateSlideVideo(video);
    });

    new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      console.log('[video] section in view, loading all videos');
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
    console.log('[video] tryInit attempt ' + (21 - attemptsLeft) + ', swiperEl:', swiperEl, 'swiper:', swiper);
    if (swiper) {
      setup(swiperEl, swiper);
    } else if (attemptsLeft > 0) {
      setTimeout(function () { tryInit(attemptsLeft - 1); }, 100);
    } else {
      console.log('[video] failed to find Swiper instance after all attempts');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { tryInit(20); });
  } else {
    tryInit(20);
  }
})();
