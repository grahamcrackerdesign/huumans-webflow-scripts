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
    var slide = video.closest('.w-slide');
    if (!slide) return;
    var playIcon = slide.querySelector('.playIcon');
    var pauseIcon = slide.querySelector('.pauseIcon');
    if (playIcon) playIcon.style.display = video.paused ? 'flex' : 'none';
    if (pauseIcon) pauseIcon.style.display = video.paused ? 'none' : 'flex';
  }

  function activateSlideVideo(video) {
    loadVideo(video);
    video.play();
    updateButton(video);
    videos.forEach(function (v) {
      if (v !== video) {
        v.pause();
        updateButton(v);
      }
    });
  }

  // Wire each play/pause button to its slide's video
  videos.forEach(function (video) {
    var slide = video.closest('.w-slide');
    if (!slide) return;
    var btn = slide.querySelector('.playPauseButton');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      updateButton(video);
    });
  });

  // On slide change, auto-play the incoming slide and pause others
  var sliderMask = document.querySelector('.w-slider-mask');
  if (sliderMask) {
    new MutationObserver(function () {
      var activeSlide = sliderMask.querySelector('.w-slide.w-active');
      if (activeSlide) {
        var video = activeSlide.querySelector('.owner-video');
        if (video) activateSlideVideo(video);
      }
    }).observe(sliderMask, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  // Lazy-load and play the first video when the section scrolls into view
  var firstVideo = document.querySelector('.w-slide.w-active .owner-video') || videos[0];
  if (firstVideo) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        activateSlideVideo(firstVideo);
        obs.disconnect();
      }
    }, { rootMargin: '200px' }).observe(firstVideo);
  }
})();
