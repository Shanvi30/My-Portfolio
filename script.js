
    // Make --vh (mobile) accurate for 100vh usage
    (function setVh() {
      function update() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      update();
      window.addEventListener('resize', update);
    })();

    // NAVBAR - shrink effect and active link
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('header, section');

    function onScroll() {
      const sc = window.scrollY;
      if (sc > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');

      // active link
      const pos = sc + 120;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const id = sec.id || 'home';
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (!link) return;
        if (pos >= top && pos < bottom) {
          navLinks.forEach(l=>l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll);
    onScroll();

    // Reveal on scroll for elements
    const revealSelectors = '.skill-card, .project-card, .edu-item, .about-img, .contact-card';
    const revealEls = document.querySelectorAll(revealSelectors);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'all 0.6s cubic-bezier(.16,.9,.3,1)';
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});

    revealEls.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      observer.observe(el);
    });

    // Smooth scroll for nav links, account for nav height offset
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const href = a.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;
        const navHeight = document.querySelector('nav').offsetHeight + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    // ensure sections snap-like feel when scrolling (optional subtle)
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
      // only on desktop, when large vertical delta and not on small screens
      if (window.innerWidth > 900) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          // find section nearest to top and snap to it
          const navHeight = document.querySelector('nav').offsetHeight + 12;
          const y = window.scrollY + navHeight + 10;
          let nearest;
          let minDist = Infinity;
          const secs = document.querySelectorAll('header.full-frame, section.full-frame');
          secs.forEach(s => {
            const d = Math.abs(s.offsetTop - y);
            if (d < minDist) { minDist = d; nearest = s; }
          });
          if (nearest) window.scrollTo({ top: nearest.offsetTop - navHeight, behavior: 'smooth' });
        }, 160);
      }
    }, {passive:true});

    // small helper: if user resizes to mobile keep layout natural
    window.addEventListener('resize', () => {
      // remove any inline transforms added by reveal code (keeps layout consistent)
      revealEls.forEach(el => { el.style.transition = ''; });
    });