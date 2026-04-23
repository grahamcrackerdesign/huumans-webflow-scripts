  (function () {
    function init() {
      document.querySelectorAll('[data-feature-sync]').forEach(function (scope) {
        var accs = Array.from(scope.querySelectorAll('details'));

        var cardCol = scope.querySelector('.col-lg-6');
        if (!cardCol) return;
        var cards = Array.from(cardCol.children).filter(function (el) {
          return el.classList.contains('colored-card');
        });

        if (!accs.length || !cards.length) return;

        var st = document.createElement('style');
        st.textContent = '[data-feature-sync] .col-lg-6 { position: relative; }' + '[data-feature-sync] .col-lg-6 > .colored-card {' + 'position: absolute; top: 0; left: 0; width: 100%;' + 'opacity: 0; visibility: hidden;' + 'transition: opacity .3s ease, visibility .3s ease;' + '}' + '[data-feature-sync] .col-lg-6 > .colored-card.is-active {' + 'opacity: 1; visibility: visible;' + '}';
        document.head.appendChild(st);

        function syncCards(i) {
          cards.forEach(function (c, j) {
            c.classList.toggle('is-active', i === j);
          });
        }

        function closeOthers(i) {
          accs.forEach(function (a, j) {
            if (j !== i && a.open) {
              var s = a.querySelector('summary');
              if (s) s.click();
            }
          });
        }

        accs.forEach(function (a, i) {
          a.addEventListener('toggle', function () {
            if (a.open) {
              syncCards(i);
              closeOthers(i);
            }
          });
        });

        var openIdx = accs.findIndex(function (a) {
          return a.open;
        });
        syncCards(openIdx >= 0 ? openIdx : 0);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
