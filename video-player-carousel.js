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
    video.play();
    videos.forEach(function (v) {
      if (v !== video) v.pause();
    });
  }

  setMute(true);

  btn.addEventListener('click', function () {
    setMute(!muted);
  });

  // On slide change, load and play the incoming slide's video, pause others.
  // Webflow toggles the w-active class on slides during transitions.
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

  // Lazy-load the first video when the section scrolls into view.
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
