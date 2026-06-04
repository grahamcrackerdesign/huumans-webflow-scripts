(function () {
  var videos = Array.from(document.querySelectorAll('.owner-video'));

  if (!videos.length) return;

  function loadVideo(video) {
    var source = video.querySelector('source');
    if (source && source.dataset.src && !source.dataset.loaded) {
      source.src = source.dataset.src;
      source.dataset.loaded = '1';
      video.load();
    }
  }

  function updateButton(video) {
    var wrapper = video.closest('.video-wrapper');
    if (!wrapper) return;
    var playIcon = wrapper.querySelector('#playIcon');
    var pauseIcon = wrapper.querySelector('#pauseIcon');
    if (playIcon) playIcon.style.display = video.paused ? 'flex' : 'none';
    if (pauseIcon) pauseIcon.style.display = video.paused ? 'none' : 'flex';
  }

  function activateSlideVideo(video) {
    loadVideo(video);
    video.muted = true;
    video.play().catch(function () {});
    updateButton(video);
    videos.forEach(function (v) {
      if (v !== video) {
        v.pause();
        updateButton(v);
      }
    });
  }

  // Initialize all buttons to play icon
  videos.forEach(function (video) {
    var wrapper = video.closest('.video-wrapper');
    if (!wrapper) return;
    var playIcon = wrapper.querySelector('#playIcon');
    var pauseIcon = wrapper.querySelector('#pauseIcon');
    if (playIcon) playIcon.style.display = 'flex';
    if (pauseIcon) pauseIcon.style.display = 'none';

    // Wire play/pause button
    var btn = wrapper.querySelector('#playButton');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (video.paused) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
      updateButton(video);
    });
  });

  // Watch for slide changes — Swiper uses swiper-slide-active
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

  // Lazy-load and play the first active video when it scrolls into view
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
