(function() {
  'use strict';

  const tip = ((target) => {
    const notes = document.querySelector('.notes').children;
    const setCSS = target.style.setProperty.bind(target.style);
    const getClientWidth = () => document.documentElement.clientWidth;

    function onTipFocus(e) {
      const elem = getSupElem(e.target);
      if (!elem) return this.hide();
      this.render(elem.textContent - 1).move(elem.getBoundingClientRect());
    }

    function getSupElem(elem) {
      if (elem.hasOwnProperty('__sup')) return elem.__sup;
      if (!elem.matches('.item *')) return elem.__sup = null;

      elem.__sup = elem.matches('sup') ? elem : elem.querySelector('sup');
      return elem.__sup;
    }

    return {
      __init__() {
        onTipFocus = onTipFocus.bind(this);
        this.hide = this.hide.bind(this);

        document.addEventListener('mouseover', onTipFocus);
        document.addEventListener('click', onTipFocus);
        document.addEventListener('scroll', this.hide);

        target.id = 'tip';
        document.body.appendChild(target);
      },
      move({left, top, right, bottom}) {
        const offset = 4;
        const w = target.offsetWidth;
        const h = target.offsetHeight + offset;
        const x = left + w >= getClientWidth() ? Math.max(2, right - w) : left;
        const y = bottom + h >= window.innerHeight
          ? Math.max(2, top - h)
          : bottom + offset;
        setCSS('--x', `${~~x}px`);
        setCSS('--y', `${y + window.scrollY >> 0}px`);
      },
      render(ind) {
        const note = notes[ind] || { innerHTML: '' };
        target.innerHTML = note.innerHTML;
        return this;
      },
      hide() {
        if (this.hidden) return;
        target.innerHTML = '';
      },
      get hidden() {
        return !target.offsetWidth;
      }
    };
  })(document.createElement('div'));

  tip.__init__();

  // ====================

  let lastAudio = null;

  document.addEventListener('click', (e) => {
    const trg = e.target;

    if (!trg.matches('.play')) return;

    const audio = getAudio(trg);

    if (lastAudio && !lastAudio.paused) {
      lastAudio.pause();
      if (audio === lastAudio) return;
    }

    lastAudio = audio;
    audio.currentTime = 0;
    audio.play();
  });

  function getAudio(elem) {
    if (elem.hasOwnProperty('__audio')) return elem.__audio;

    const text = elem.parentNode.previousElementSibling.textContent;
    const name = text.match(/[a-z]+/)[0];
    const path = `./audio/${name}.mp3`;

    function onPlayStateChange() {
      return elem.classList.toggle('__active', !this.paused);
    }

    return elem.__audio = Object.assign(new Audio(path), {
      volume: 0.75,
      onplay: onPlayStateChange,
      onpause: onPlayStateChange
    });
  }
})();
