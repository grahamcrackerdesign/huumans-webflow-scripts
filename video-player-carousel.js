(function () {
  var btn = document.getElementById('muteButton');
  var muteIcon = document.getElementById('muteIcon');
  var unmuteIcon = document.getElementById('unmuteIcon');
  var videos = Array.from(document.querySelectorAll('.owner-video'));
  var muted = true;

  if (!videos.length || !btn) return;

  function setMute(state) {
    muted = state;
    videos.forEach(function (v) { v.muted = state; });
    muteIcon.style.display = state ? 'flex' : 'none';
    unmuteIcon.style.display = state ? 'none' : 'flex';
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
    videos.forEach(function (v) {
      if (v !== video) v.pause();
    });
  }

  setMute(true);

  btn.addEventListener('click', function () {
    setMute(!muted);
  });

  // Watch for Swiper slide changes — fires when swiper-slide-active moves to a new slide
  var swiperWrapper = document.querySelector('.swiper-wrapper');
  if (swiperWrapper) {
    new MutationObserver(function () {
      var activeSlide = swiperWrapper.querySelector('.swiper-slide-active');
      if (activeSlide) {
        var video = activeSlide.querySelector('.owner-video');
        if (video) activateSlideVideo(video);
      }
    }).observe(swiperWrapper, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  // Lazy-load and play the first active video when the section scrolls into view
  var firstVideo = document.querySelector('.swiper-slide-active .owner-video') || videos[0];
  if (firstVideo) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        activateSlideVideo(firstVideo);
        obs.disconnect();
      }
    }, { rootMargin: '200px' }).observe(firstVideo);
  }
})();
