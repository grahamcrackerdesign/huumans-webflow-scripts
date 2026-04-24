(function () {
  var hero = document.getElementById('hero');
  var footer = document.getElementById('footer');
  var logo = document.querySelector('.nav-logo_link img');
  var loginBtn = document.getElementById('login');
  var signupBtn = document.getElementById('signup');
  var menuBtn = document.querySelector('.nav-menu_btn');
  var bars = document.querySelectorAll('.nav-menu_btn-bar');

  if (!hero || !footer || !logo || !loginBtn || !signupBtn || !menuBtn) return;

  var pastHero = false;
  var nearFooter = false;
  var menuOpen = false;

  function update() {
    var onDark = !pastHero || nearFooter;
    var dark = menuOpen || !onDark;

    // Logo — black when scrolled and menu closed, white otherwise
    logo.style.filter = dark ? 'brightness(0)' : '';

    // Bars — black when scrolled and menu closed, white otherwise
    bars.forEach(function(b) {
      b.style.backgroundColor = dark ? '#1a1a1a' : '';
    });

    // Menu button border
    menuBtn.style.borderColor = dark ? '#1a1a1a' : '';
    menuBtn.style.backgroundColor = dark ? 'var(--_color---neutral--white)' : '';

    // Nav buttons (desktop)
    var white = onDark;
    loginBtn.classList.toggle('w-variant-052759b4-b398-e98d-c28c-099b380d4426', !white);
    loginBtn.classList.toggle('w-variant-e77e9b6f-8f2c-79bb-2908-5e14ffb7b110', white);
    signupBtn.classList.toggle('w-variant-0d74589e-6e29-a7bb-5197-70e868053214', white);
  }

  new MutationObserver(function() {
    menuOpen = menuBtn.classList.contains('w--open');
    update();
  }).observe(menuBtn, { attributes: true, attributeFilter: ['class'] });

  new IntersectionObserver(function(entries) {
    pastHero = !entries[0].isIntersecting;
    update();
  }, { threshold: 0 }).observe(hero);

  new IntersectionObserver(function(entries) {
    nearFooter = entries[0].isIntersecting;
    update();
  }, { threshold: 0, rootMargin: '0px 0px -90% 0px' }).observe(footer);
})();
