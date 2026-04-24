(function () {
  setTimeout(function () {
    var outer = document.getElementById('textSwap');
    if (!outer) return;
    var words = ['Owners', 'Plumbers', 'Restaurants', 'Contractors', 'Retailers', 'Freelancers'];
    var current = 0;
    var inner = document.createElement('span');
    inner.textContent = outer.textContent;
    inner.style.display = 'inline-block';
    inner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    outer.textContent = '';
    outer.appendChild(inner);
    outer.style.display = 'inline-block';
    outer.style.verticalAlign = 'bottom';
    outer.style.width = outer.offsetWidth + 'px';
    var measurer = document.createElement('span');
    measurer.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;white-space:nowrap;';
    measurer.style.font = getComputedStyle(inner).font;
    document.body.appendChild(measurer);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        outer.classList.add('is-drawn');
      });
    });

    setInterval(function () {
      inner.style.opacity = '0';
      inner.style.transform = 'translateY(-10px)';
      outer.classList.remove('is-drawn');

      setTimeout(function () {
        current = (current + 1) % words.length;
        var nextWord = words[current];
        measurer.textContent = nextWord;
        var newWidth = measurer.offsetWidth;
        inner.textContent = nextWord;
        outer.style.transition = 'width 0.4s ease';
        outer.style.width = newWidth + 'px';
        inner.style.transition = 'none';
        inner.style.transform = 'translateY(10px)';
        inner.style.opacity = '0';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            inner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            inner.style.opacity = '1';
            inner.style.transform = 'translateY(0)';
            outer.classList.add('is-drawn');
          });
        });
      }, 300);
    }, 5000);
  }, 100);
})();
