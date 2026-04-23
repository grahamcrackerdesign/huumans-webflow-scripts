(function () {
  var video = document.getElementById('owner-video');
  var btn = document.getElementById('muteButton');
  var muteIcon = document.getElementById('muteIcon');
  var unmuteIcon = document.getElementById('unmuteIcon');

  if (!video || !btn) return;

  muteIcon.style.display = 'flex';
  unmuteIcon.style.display = 'none';

  btn.addEventListener('click', function () {
    video.muted = !video.muted;
    muteIcon.style.display = video.muted ? 'flex' : 'none';
    unmuteIcon.style.display = video.muted ? 'none' : 'flex';
  });
})();
