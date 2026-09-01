// ---- theme toggle (dark / light) ----
  (function(){
    var root = document.documentElement;
    var toggle = document.getElementById('themeToggle');
    var STORAGE_KEY = 'portfolio-theme';

    function getStored(){
      try { return localStorage.getItem(STORAGE_KEY); } catch(e){ return null; }
    }
    function setStored(value){
      try { localStorage.setItem(STORAGE_KEY, value); } catch(e){ /* storage unavailable, ignore */ }
    }

    var stored = getStored();
    var systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    var initial = stored || (systemPrefersLight ? 'light' : 'dark');
    if(initial === 'light'){ root.setAttribute('data-theme', 'light'); }

    if(toggle){
      toggle.addEventListener('click', function(){
        var isLight = root.getAttribute('data-theme') === 'light';
        if(isLight){
          root.removeAttribute('data-theme');
          setStored('dark');
        } else {
          root.setAttribute('data-theme', 'light');
          setStored('light');
        }
      });
    }
  })();

  // ---- hero typewriter ----
  (function(){
    var roles = ["Frontend Developer", "UI/UX Designer", "Web Developer", "Creative Developer"];
    var el = document.getElementById('roleText');
    if(!el) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced){ el.textContent = roles[0]; return; }

    var ri = 0, ci = 0, deleting = false;

    function tick(){
      var word = roles[ri];
      if(!deleting){
        ci++;
        el.textContent = word.slice(0, ci);
        if(ci === word.length){
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if(ci === 0){
          deleting = false;
          ri = (ri + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    setTimeout(tick, 500);
  })();

  // ---- scroll reveal ----
  (function(){
    var items = document.querySelectorAll('.reveal');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced){ items.forEach(function(i){ i.classList.add('in'); }); return; }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function(i){ io.observe(i); });
  })();

  // ---- active tab tracking + sliding indicator + progress rail ----
  (function(){
    var sections = ['work','what-i-do','experience','skills','about','contact'].map(function(id){
      return document.getElementById(id);
    });
    var tabs = document.querySelectorAll('.tab');
    var tabsWrap = document.getElementById('tabs');
    var indicator = document.getElementById('tabIndicator');
    var progressDots = document.querySelectorAll('.progress-dot');

    var titleMap = {
      work: 'Work', 'what-i-do': 'What I Do', experience: 'Experience', skills: 'Skills',
      about: 'About', contact: 'Contact'
    };
    var baseTitle = 'Gautham K K';

    function moveIndicator(tabEl){
      if(!tabEl || !indicator) return;
      indicator.style.opacity = '1';
      indicator.style.transform = 'translateX(' + tabEl.offsetLeft + 'px)';
      indicator.style.width = tabEl.offsetWidth + 'px';
    }

    function setActive(id){
      var activeTab = null;
      tabs.forEach(function(t){
        var isActive = t.dataset.target === id;
        t.classList.toggle('active', isActive);
        if(isActive) activeTab = t;
      });
      if(activeTab) moveIndicator(activeTab);
      progressDots.forEach(function(d){ d.classList.toggle('active', d.dataset.target === id); });
      document.title = titleMap[id] ? baseTitle + ' — ' + titleMap[id] : baseTitle + ' — Portfolio';
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ setActive(entry.target.id); }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -30% 0px' });

    sections.forEach(function(s){ if(s) io.observe(s); });

    window.addEventListener('resize', function(){
      var current = document.querySelector('.tab.active');
      if(current) moveIndicator(current);
    });
  })();

  // ---- contact terminal ----
  (function(){
    var input = document.getElementById('termInput');
    var out = document.getElementById('termOut');
    if(!input || !out) return;
    var responses = {
      email: { text: 'opening mailto:kkgautham28@gmail.com ...', url: 'mailto:kkgautham28@gmail.com' },
      github: { text: 'opening github.com/Gautkk30 ...', url: 'https://github.com/Gautkk30' },
      linkedin: { text: 'opening linkedin.com/in/gautham-kk ...', url: 'https://www.linkedin.com/in/gautham-kk' },
      instagram: { text: 'opening instagram.com/kk.gautham ...', url: 'https://www.instagram.com/kk.gautham' },
      devdrop: { text: 'opening https://devdrop-a4c.pages.dev/ ...', url: 'https://devdrop-a4c.pages.dev/' }
    };
    input.addEventListener('keydown', function(e){
      if(e.key !== 'Enter') return;
      var cmd = input.value.trim().toLowerCase();
      if(cmd === 'sudo hire me'){
        out.innerHTML =
          '<div class="term-block">' +
          '<div>[sudo] password for recruiter: ********</div>' +
          '<div class="ok">Access granted.</div>' +
          '<div style="margin-top:6px;">' +
            '<div class="ok">✓ Frontend Development</div>' +
            '<div class="ok">✓ UI/UX Design</div>' +
            '<div class="ok">✓ Full-stack Projects</div>' +
            '<div class="ok">✓ Creative Development</div>' +
          '</div>' +
          '<div style="margin-top:6px;">STATUS: <span class="ok">Open to Software Development Internships</span></div>' +
          '<div style="margin-top:6px;">&gt; Let\'s build something. Try: <span class="ok">contact</span></div>' +
          '</div>';
      } else if(cmd === 'sudo hire gautham'){
        out.innerHTML =
          '<div class="term-block">' +
          '<div>[sudo] password for recruiter: ********</div>' +
          '<div class="ok">Access granted.</div>' +
          '<div style="margin-top:6px;">' +
            '<div class="ok">✓ Frontend Development</div>' +
            '<div class="ok">✓ UI/UX Design</div>' +
            '<div class="ok">✓ Full-stack Projects</div>' +
            '<div class="ok">✓ Creative Development</div>' +
          '</div>' +
          '<div style="margin-top:6px;">STATUS: <span class="ok">Open to Software Development Internships</span></div>' +
          '<div style="margin-top:6px;">&gt; Let\'s build something. Try: <span class="ok">contact</span></div>' +
          '</div>';
      } else if(cmd === 'sudo hire-me'){
        out.innerHTML = '<span class="ok">$</span> sudo hire-me → [sudo] password for recruiter: ******** <span class="ok">✓ access granted.</span> scroll down, the contact form is right there.';
      } else if(cmd === 'resume'){
        out.innerHTML = '<span class="ok">$</span> resume → downloading Gautham_KK_resume.pdf ...';
        var a = document.createElement('a');
        a.href = 'assets/Gautham_KK_resume.pdf';
        a.download = 'Gautham_KK_resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if(cmd === 'contact'){
        var contactEl = document.getElementById('contact');
        if(contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
        out.innerHTML = '<span class="ok">$</span> contact → scrolling down.';
      } else if(responses[cmd]){
        out.innerHTML = '<span class="ok">$</span> ' + cmd + ' → ' + responses[cmd].text;
        window.open(responses[cmd].url, cmd === 'email' ? '_self' : '_blank', 'noopener');
      } else if(cmd){
        out.textContent = 'command not found: ' + cmd + ' (try email, github, linkedin, instagram, resume)';
      }
      input.value = '';
    });
  })();

  // ---- case study modal ----
  (function(){
    var projectData = {
      devdrop: {
        filename: 'devdrop.md',
        title: 'DevDrop',
        tagline: 'Browser-native P2P file sharing built with WebRTC DataChannels, chunked streaming, adaptive backpressure, and SHA-256 integrity verification.',
        problem: 'Sharing large files between devices usually requires uploading them to a third-party server.',
        approach: 'DevDrop establishes a WebRTC peer connection and transfers files directly between browsers while the backend handles signaling and ephemeral room state.',
        gallery: [],
        features: [
          'Direct WebRTC DataChannel browser-to-browser binary transfer',
          'Chunked file streaming with adaptive backpressure handling',
          'Web Crypto SHA-256 integrity verification on both peers',
          'WebSocket-based SDP offer/answer signaling and ICE candidate discovery',
          'Redis-backed ephemeral room state with automated TTL expiration',
          'Instant device pairing via 6-character room codes and QR scanning',
          'End-to-end DTLS-SRTP encryption with zero server-side file storage'
        ],
        stack: [
          ['Frontend', 'React, TypeScript, Tailwind CSS, Vite'],
          ['P2P Protocol', 'WebRTC DataChannels, DTLS-SRTP, Web Crypto API'],
          ['Signaling Server', 'Node.js, Express, WebSocket (ws)'],
          ['State / Store', 'Redis (ephemeral room & TTL management)'],
          ['Repository', 'github.com/Gautkk30/DevDrop']
        ],
        roadmap: [
          'Multi-peer mesh transfers',
          'Folder / directory tree streaming',
          'Automatic TURN relay fallback diagnostics',
          'Mobile PWA share target API integration'
        ],
        github: 'https://github.com/Gautkk30/DevDrop',
        demo: 'https://devdrop-a4c.pages.dev/'
      },
      spendly: {
        filename: 'spendly.md',
        title: 'Spendly',
        tagline: 'A modern full-stack personal finance platform built with a premium dark UI, secure Google authentication, and MongoDB Atlas cloud persistence. Manage accounts, track income and expenses, organize categories, monitor budgets, and visualize financial insights through interactive analytics.',
        gallery: [
          { src: 'https://raw.githubusercontent.com/Gautkk30/Spendly/main/Spendly_GitHub_Assets/assets/dashboard.png', alt: 'Spendly dashboard' },
          { src: 'https://raw.githubusercontent.com/Gautkk30/Spendly/main/Spendly_GitHub_Assets/assets/analytics.png', alt: 'Spendly analytics' },
          { src: 'https://raw.githubusercontent.com/Gautkk30/Spendly/main/Spendly_GitHub_Assets/assets/accounts.png', alt: 'Spendly accounts' },
          { src: 'https://raw.githubusercontent.com/Gautkk30/Spendly/main/Spendly_GitHub_Assets/assets/transactions.png', alt: 'Spendly transactions' },
          { src: 'https://raw.githubusercontent.com/Gautkk30/Spendly/main/Spendly_GitHub_Assets/assets/categories.png', alt: 'Spendly categories' },
          { src: 'https://raw.githubusercontent.com/Gautkk30/Spendly/main/Spendly_GitHub_Assets/assets/settings.png', alt: 'Spendly settings' }
        ],
        features: [
          'Google OAuth authentication', 'Multi-account / wallet management',
          'Income & expense tracking', 'Interactive analytics dashboard',
          'Savings goals', 'Budget planning',
          'Custom categories', 'Receipt scanner',
          'MongoDB Atlas cloud database', 'Installable as a PWA'
        ],
        stack: [
          ['Frontend', 'React, TypeScript, Tailwind CSS'],
          ['Backend', 'Node.js, Express.js, REST API'],
          ['Database', 'MongoDB Atlas'],
          ['Auth', 'Google OAuth 2.0, JWT'],
          ['Deployment', 'Google Cloud Run, PWA']
        ],
        roadmap: [
          'AI spending insights', 'Recurring transactions', 'PDF reports',
          'Family accounts', 'Shared wallets', 'Investment tracking', 'Bill reminders'
        ],
        github: 'https://github.com/Gautkk30/Spendly',
        demo: 'https://spendly-107229934573.asia-southeast1.run.app/'
      },
      musi: {
        filename: 'musi.md',
        title: 'Musi',
        tagline: 'A modern music player web app with local audio playback, iTunes API search with 30-second previews, a customizable equalizer, and multiple themes.',
        gallery: [
          { src: 'https://raw.githubusercontent.com/Gautkk30/Musi/main/screenshots/hero.png', alt: 'Musi home screen' },
          { src: 'https://raw.githubusercontent.com/Gautkk30/Musi/main/screenshots/player.png', alt: 'Musi player' },
          { src: 'https://raw.githubusercontent.com/Gautkk30/Musi/main/screenshots/playlist.png', alt: 'Musi playlist' },
          { src: 'https://raw.githubusercontent.com/Gautkk30/Musi/main/screenshots/dark-theme.png', alt: 'Musi dark theme' },
          { src: 'https://raw.githubusercontent.com/Gautkk30/Musi/main/screenshots/light-theme.png', alt: 'Musi light theme' }
        ],
        features: [
          'Local audio file playback', 'iTunes API search with 30s previews',
          'Playlist management', 'Customizable equalizer',
          'Multiple themes', 'Fully responsive design'
        ],
        stack: [
          ['Frontend', 'HTML, CSS, JavaScript'],
          ['Backend', 'Java, Firebase'],
          ['Data', 'iTunes Search API']
        ],
        roadmap: [
          'User authentication', 'Favorite songs', 'Lyrics support',
          'Offline playback', 'PWA support'
        ],
        github: 'https://github.com/Gautkk30/Musi',
        demo: 'https://musi-6ak0.onrender.com/'
      }
    };

    var overlay = document.getElementById('modalOverlay');
    var modalFilename = document.getElementById('modalFilename');
    var modalBody = document.getElementById('modalBody');
    var closeBtn = document.getElementById('modalClose');
    var lastFocused = null;
    if(!overlay || !modalBody || !closeBtn) return;

    function renderModal(key){
      var d = projectData[key];
      if(!d) return;

      modalFilename.textContent = d.filename;

      var galleryHtml = (d.gallery && d.gallery.length) ?
        '<div class="cs-section-label">Screenshots</div>' +
        '<div class="cs-gallery">' + d.gallery.map(function(g){
          return '<img src="' + g.src + '" alt="' + g.alt + '" loading="lazy">';
        }).join('') + '</div>' : '';

      var problemApproachHtml = (d.problem && d.approach) ?
        '<div class="cs-section-label">The Problem &amp; Approach</div>' +
        '<div class="cs-overview-box" style="background:var(--bg-panel-2); border:1px solid var(--border); border-radius:6px; padding:14px 16px; margin-bottom:18px; font-size:13.5px; line-height:1.6; color:var(--text-dim);">' +
          '<div style="margin-bottom:8px;"><strong style="color:var(--text); font-family:var(--mono); font-size:11.5px; text-transform:uppercase; letter-spacing:.06em;">The Problem:</strong> ' + d.problem + '</div>' +
          '<div><strong style="color:var(--text); font-family:var(--mono); font-size:11.5px; text-transform:uppercase; letter-spacing:.06em;">The Approach:</strong> ' + d.approach + '</div>' +
        '</div>' : '';

      var features = d.features.map(function(f){ return '<li>' + f + '</li>'; }).join('');

      var stackRows = d.stack.map(function(row){
        return '<tr><th style="text-align:left; border-bottom:none; padding-top:6px;">' + row[0] + '</th><td>' + row[1] + '</td></tr>';
      }).join('');

      var roadmap = d.roadmap.map(function(r){ return '<li>' + r + '</li>'; }).join('');

      modalBody.innerHTML =
        '<h3 class="cs-title">' + d.title + '</h3>' +
        '<p class="cs-tagline">' + d.tagline + '</p>' +
        problemApproachHtml +
        galleryHtml +
        '<div class="cs-section-label">Engineering Highlights</div>' +
        '<ul class="cs-features">' + features + '</ul>' +
        '<div class="cs-section-label">Tech stack</div>' +
        '<table class="cs-stack-table"><tbody>' + stackRows + '</tbody></table>' +
        '<div class="cs-section-label">Roadmap</div>' +
        '<ul class="cs-roadmap">' + roadmap + '</ul>' +
        '<div class="cs-links">' +
          '<a class="btn" href="' + d.github + '" target="_blank" rel="noopener">github</a>' +
          '<a class="btn primary" href="' + d.demo + '" target="_blank" rel="noopener">' + (d.demo === d.github ? 'view repository ↗' : 'live demo') + '</a>' +
        '</div>';
    }

    function openModal(key){
      renderModal(key);
      lastFocused = document.activeElement;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal(){
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if(lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.proj-more').forEach(function(link){
      link.addEventListener('click', function(e){
        e.preventDefault();
        openModal(link.dataset.project);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    window.__openCaseStudy = openModal;
  })();

  // ---- time-aware terminal greeting ----
  (function(){
    var el = document.getElementById('greetingText');
    if(!el) return;
    var hour = new Date().getHours();
    var greeting;
    if(hour < 5) greeting = '// still up? good night';
    else if(hour < 12) greeting = '// good morning';
    else if(hour < 17) greeting = '// good afternoon';
    else if(hour < 21) greeting = '// good evening';
    else greeting = '// good night';
    el.textContent = greeting;
  })();

  // ---- contact form (Formspree) ----
  (function(){
    var form = document.getElementById('contactForm');
    if(!form) return;
    var status = document.getElementById('cfStatus');
    var submitBtn = document.getElementById('cfSubmit');
    var placeholderAction = 'https://formspree.io/f/YOUR_FORM_ID';

    form.addEventListener('submit', function(e){
      e.preventDefault();

      if(form.getAttribute('action') === placeholderAction){
        status.textContent = 'form not connected yet — email me directly for now.';
        status.className = 'cf-status err';
        return;
      }

      status.textContent = 'sending...';
      status.className = 'cf-status pending';
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function(response){
        if(response.ok){
          status.textContent = 'message sent — thanks, I\'ll get back to you soon.';
          status.className = 'cf-status ok';
          form.reset();
        } else {
          status.textContent = 'something went wrong — try emailing me directly.';
          status.className = 'cf-status err';
        }
      }).catch(function(){
        status.textContent = 'network error — try emailing me directly.';
        status.className = 'cf-status err';
      }).finally(function(){
        submitBtn.disabled = false;
      });
    });
  })();

  // ---- command palette ----
  (function(){
    var overlay = document.getElementById('cmdkOverlay');
    var input = document.getElementById('cmdkInput');
    var list = document.getElementById('cmdkList');
    var trigger = document.getElementById('cmdkTrigger');
    if(!overlay || !input || !list) return;

    function scrollToSection(id){
      var el = document.getElementById(id);
      if(el) el.scrollIntoView({ behavior: 'smooth' });
    }

    var commands = [
      { label: 'Go to Work', hint: 'section', action: function(){ scrollToSection('work'); } },
      { label: 'Go to What I Do', hint: 'section', action: function(){ scrollToSection('what-i-do'); } },
      { label: 'Go to Experience', hint: 'section', action: function(){ scrollToSection('experience'); } },
      { label: 'Go to Skills', hint: 'section', action: function(){ scrollToSection('skills'); } },
      { label: 'Go to About', hint: 'section', action: function(){ scrollToSection('about'); } },
      { label: 'Go to Contact', hint: 'section', action: function(){ scrollToSection('contact'); } },
      { label: 'View DevDrop case study', hint: 'featured project', action: function(){ if(window.__openCaseStudy) window.__openCaseStudy('devdrop'); } },
      { label: 'View Spendly case study', hint: 'project', action: function(){ if(window.__openCaseStudy) window.__openCaseStudy('spendly'); } },
      { label: 'View Musi case study', hint: 'project', action: function(){ if(window.__openCaseStudy) window.__openCaseStudy('musi'); } },
      { label: 'Send a message', hint: 'contact form', action: function(){ scrollToSection('contact'); var el = document.getElementById('cfName'); if(el) setTimeout(function(){ el.focus(); }, 500); } },
      { label: 'Download Resume', hint: 'PDF download', action: function(){ var a = document.createElement('a'); a.href = 'assets/Gautham_KK_resume.pdf'; a.download = 'Gautham_KK_resume.pdf'; document.body.appendChild(a); a.click(); document.body.removeChild(a); } },
      { label: 'Email me directly', hint: 'mailto', action: function(){ window.location.href = 'mailto:kkgautham28@gmail.com'; } },
      { label: 'Open GitHub', hint: 'external ↗', action: function(){ window.open('https://github.com/Gautkk30', '_blank', 'noopener'); } },
      { label: 'Open LinkedIn', hint: 'external ↗', action: function(){ window.open('https://www.linkedin.com/in/gautham-kk', '_blank', 'noopener'); } },
      { label: 'Open Instagram', hint: 'external ↗', action: function(){ window.open('https://www.instagram.com/kk.gautham', '_blank', 'noopener'); } },
      { label: 'Toggle light / dark theme', hint: 'preference', action: function(){ var t = document.getElementById('themeToggle'); if(t) t.click(); } },
      { label: 'Play the hidden 404 game', hint: 'easter egg', action: function(){ window.location.href = '404.html'; } },
      { label: 'Back to top', hint: 'navigate', action: function(){ scrollToSection('top'); } }
    ];

    var filtered = commands.slice();
    var activeIndex = 0;

    function render(){
      list.innerHTML = '';
      if(!filtered.length){
        list.innerHTML = '<div class="cmdk-empty">no matching commands</div>';
        return;
      }
      filtered.forEach(function(cmd, i){
        var item = document.createElement('div');
        item.className = 'cmdk-item' + (i === activeIndex ? ' active' : '');
        item.innerHTML = '<span class="cmdk-item-label">' + cmd.label + '</span><span class="cmdk-item-hint">' + cmd.hint + '</span>';
        item.addEventListener('mouseenter', function(){ activeIndex = i; render(); });
        item.addEventListener('click', function(){ runActive(); });
        list.appendChild(item);
      });
    }

    function filterCommands(query){
      var q = query.trim().toLowerCase();
      filtered = !q ? commands.slice() : commands.filter(function(c){
        return c.label.toLowerCase().indexOf(q) !== -1 || c.hint.toLowerCase().indexOf(q) !== -1;
      });
      activeIndex = 0;
      render();
    }

    function runActive(){
      var cmd = filtered[activeIndex];
      if(cmd){ cmd.action(); closePalette(); }
    }

    function openPalette(){
      input.value = '';
      filterCommands('');
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(function(){ input.focus(); }, 30);
    }

    function closePalette(){
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if(trigger) trigger.addEventListener('click', openPalette);

    document.addEventListener('keydown', function(e){
      if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
        e.preventDefault();
        overlay.classList.contains('open') ? closePalette() : openPalette();
      } else if(e.key === 'Escape' && overlay.classList.contains('open')){
        closePalette();
      }
    });

    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closePalette();
    });

    input.addEventListener('input', function(){ filterCommands(input.value); });

    input.addEventListener('keydown', function(e){
      if(e.key === 'ArrowDown'){
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
        render();
      } else if(e.key === 'ArrowUp'){
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        render();
      } else if(e.key === 'Enter'){
        e.preventDefault();
        runActive();
      }
    });
  })();

  // ---- achievement toast: explored every section ----
  (function(){
    var sectionIds = ['work', 'experience', 'skills', 'about', 'contact'];
    var sections = sectionIds.map(function(id){ return document.getElementById(id); });
    if(sections.every(function(s){ return !s; })) return;

    var STORAGE_KEY = 'portfolio-achievement-shown';
    function alreadyShown(){
      try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch(e){ return false; }
    }
    function markShown(){
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch(e){ /* ignore */ }
    }

    if(alreadyShown()) return;

    var visited = new Set();

    function showToast(){
      var toast = document.createElement('div');
      toast.className = 'achievement-toast';
      toast.innerHTML =
        '<span class="achievement-star">★</span>' +
        '<div>' +
          '<div class="achievement-title">ACHIEVEMENT UNLOCKED</div>' +
          '<div class="achievement-sub">You explored the entire site. Nice.</div>' +
        '</div>' +
        '<button class="achievement-close" aria-label="Dismiss">✕</button>';
      document.body.appendChild(toast);
      requestAnimationFrame(function(){ toast.classList.add('show'); });

      function dismiss(){
        toast.classList.remove('show');
        setTimeout(function(){ toast.remove(); }, 400);
      }
      toast.querySelector('.achievement-close').addEventListener('click', dismiss);
      setTimeout(dismiss, 6000);
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting) visited.add(entry.target.id);
      });
      if(visited.size === sectionIds.length){
        markShown();
        showToast();
        io.disconnect();
      }
    }, { threshold: 0.5 });

    sections.forEach(function(s){ if(s) io.observe(s); });
  })();

  // ---- now playing / device now-playing panel ----
  //
  // IMPORTANT — read before "fixing" this:
  // There is no web-standard API that lets a webpage read what is playing
  // in OTHER applications (Spotify desktop, Apple Music, VLC, etc.) or even
  // other browser tabs. The Media Session API only works in one direction:
  // a page can SET metadata/controls for its OWN audio, which the OS then
  // surfaces on lock screens and hardware media keys. It cannot READ another
  // app's now-playing state — that boundary is intentional, for privacy.
  //
  // So this panel does exactly what's legitimately possible and nothing
  // more: it shows "Nothing is currently playing" until the visitor presses
  // play on the portfolio's own demo playlist, at which point it shows real
  // track info and wires up navigator.mediaSession so OS media keys / lock
  // screen controls work too. No login, no fake detection, no external
  // app polling.
  (function(){
    var root = document.getElementById('musicPlayer');
    var audio = document.getElementById('playerAudio');
    if(!root || !audio) return;

    var idlePanel = document.getElementById('playerIdle');
    var idleStartBtn = document.getElementById('playerIdleStart');
    var trackEl = document.getElementById('playerTrack');
    var artistEl = document.getElementById('playerArtist');
    var playBtn = document.getElementById('playerPlay');
    var prevBtn = document.getElementById('playerPrev');
    var nextBtn = document.getElementById('playerNext');
    var seek = document.getElementById('playerSeek');
    var volume = document.getElementById('playerVolume');
    var curTimeEl = document.getElementById('playerCurrent');
    var durTimeEl = document.getElementById('playerDuration');

    var playlist = [
      { title: 'Late Night Refactor', artist: 'lofi build playlist', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { title: 'Focus Flow', artist: 'lofi build playlist', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { title: 'Deploy on Friday', artist: 'lofi build playlist', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
    ];
    var index = 0;
    var isSeeking = false;
    var hasEngaged = false; // true once the visitor has pressed play at least once

    // small generated placeholder icon for OS-level media art — not real
    // album artwork, just a lightweight generic marker (no network request)
    var artworkSvg = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
      '<rect width="256" height="256" fill="#0f1712"/>' +
      '<circle cx="128" cy="128" r="60" fill="none" stroke="#4ade80" stroke-width="8"/>' +
      '<circle cx="128" cy="128" r="14" fill="#4ade80"/>' +
      '</svg>'
    );

    function formatTime(s){
      if(!isFinite(s)) return '0:00';
      var m = Math.floor(s / 60);
      var sec = Math.floor(s % 60);
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function updateMediaSession(t){
      if(!('mediaSession' in navigator)) return;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t.title,
        artist: t.artist,
        album: 'Portfolio demo playlist',
        artwork: [{ src: artworkSvg, sizes: '256x256', type: 'image/svg+xml' }]
      });
      navigator.mediaSession.setActionHandler('play', function(){ audio.play().catch(function(){}); });
      navigator.mediaSession.setActionHandler('pause', function(){ audio.pause(); });
      navigator.mediaSession.setActionHandler('previoustrack', function(){ loadTrack(index - 1, true); });
      navigator.mediaSession.setActionHandler('nexttrack', function(){ loadTrack(index + 1, true); });
      try {
        navigator.mediaSession.setActionHandler('seekto', function(details){
          if(details && typeof details.seekTime === 'number'){ audio.currentTime = details.seekTime; }
        });
      } catch(e){ /* not supported in this browser, ignore */ }
    }

    function loadTrack(i, autoplay){
      index = (i + playlist.length) % playlist.length;
      var t = playlist[index];
      trackEl.textContent = t.title;
      artistEl.textContent = t.artist;
      audio.src = t.src;
      seek.value = 0;
      curTimeEl.textContent = '0:00';
      durTimeEl.textContent = '0:00';
      updateMediaSession(t);
      if(autoplay){
        audio.play().catch(function(){ /* autoplay blocked, ignore */ });
      }
    }

    function enterActiveState(){
      if(hasEngaged) return;
      hasEngaged = true;
      root.classList.add('is-active');
    }

    function setPlayingUI(playing){
      playBtn.classList.toggle('is-playing', playing);
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      root.classList.toggle('playing', playing);
      if('mediaSession' in navigator){
        navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
      }
    }

    idleStartBtn.addEventListener('click', function(){
      enterActiveState();
      if(!audio.src) loadTrack(0, true);
      else audio.play().catch(function(){});
    });

    playBtn.addEventListener('click', function(){
      enterActiveState();
      if(!audio.src){ loadTrack(0, true); return; }
      if(audio.paused){
        audio.play().catch(function(){ /* ignore */ });
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', function(){ enterActiveState(); setPlayingUI(true); });
    audio.addEventListener('pause', function(){ setPlayingUI(false); });

    prevBtn.addEventListener('click', function(){ loadTrack(index - 1, !audio.paused || !hasEngaged); });
    nextBtn.addEventListener('click', function(){ loadTrack(index + 1, !audio.paused || !hasEngaged); });
    audio.addEventListener('ended', function(){ loadTrack(index + 1, true); });

    audio.addEventListener('loadedmetadata', function(){
      seek.max = audio.duration || 0;
      durTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', function(){
      if(isSeeking) return;
      seek.value = audio.currentTime;
      curTimeEl.textContent = formatTime(audio.currentTime);
    });

    seek.addEventListener('input', function(){ isSeeking = true; curTimeEl.textContent = formatTime(Number(seek.value)); });
    seek.addEventListener('change', function(){
      audio.currentTime = Number(seek.value);
      isSeeking = false;
    });

    volume.addEventListener('input', function(){
      audio.volume = Number(volume.value) / 100;
    });
    audio.volume = Number(volume.value) / 100;

    // idle by default — nothing plays until the visitor presses play;
    // we never claim to detect Spotify, VLC, or any other app.
  })();

  // ---- github activity graph (real public data fetch + graceful fallback) ----
  (function(){
    var container = document.getElementById('ghActivityGrid');
    if(!container) return;

    fetch('https://api.github.com/users/Gautkk30/events/public', {
      headers: { 'Accept': 'application/json' }
    })
    .then(function(res){
      if(!res.ok) throw new Error('API response not ok');
      return res.json();
    })
    .then(function(events){
      if(!Array.isArray(events) || !events.length) return;

      var countsByDate = {};
      events.forEach(function(ev){
        if(ev.created_at){
          var d = ev.created_at.substring(0, 10);
          countsByDate[d] = (countsByDate[d] || 0) + 1;
        }
      });

      var days = [];
      var now = new Date();
      for(var i = 83; i >= 0; i--){
        var dateObj = new Date(now.getTime() - i * 86400000);
        var dateKey = dateObj.toISOString().substring(0, 10);
        days.push({
          date: dateKey,
          count: countsByDate[dateKey] || 0
        });
      }

      var html = '<div class="gh-grid-wrap">' +
        '<div class="gh-grid-header"><span>recent public activity</span><span>@Gautkk30</span></div>' +
        '<div class="gh-grid-cols">';

      for(var w = 0; w < 12; w++){
        html += '<div class="gh-grid-col">';
        for(var r = 0; r < 7; r++){
          var idx = w * 7 + r;
          var item = days[idx] || { count: 0, date: '' };
          var lvl = item.count === 0 ? 0 : (item.count === 1 ? 1 : (item.count <= 3 ? 2 : 3));
          var titleText = item.count > 0 ? item.count + ' public event' + (item.count > 1 ? 's' : '') + ' on ' + item.date : 'No public activity on ' + item.date;
          html += '<div class="gh-grid-sq lvl-' + lvl + '" title="' + titleText + '" aria-label="' + titleText + '"></div>';
        }
        html += '</div>';
      }
      html += '</div></div>';

      container.innerHTML = html;
      container.style.display = 'block';
    })
    .catch(function(){
      // Safe fallback: if network/rate-limit occurs, graph remains hidden cleanly
      container.style.display = 'none';
    });
  })();

  // ---- interactive tech chips/tags: click/tap popover with real project data ----
  // Only real, established associations — nothing invented. Skills without a
  // specific project tie (e.g. general programming languages, creative
  // tools) show a purpose description but no fabricated "Used in" project.
  (function(){
    var popover = document.getElementById('techPopover');
    var titleEl = document.getElementById('tpTitle');
    var usedRow = document.getElementById('tpUsedRow');
    var usedEl = document.getElementById('tpUsed');
    var purposeEl = document.getElementById('tpPurpose');
    var triggers = document.querySelectorAll('.chip[data-tech], .tag[data-tech]');
    if(!popover || !triggers.length) return;

    var techInfo = {
      'HTML': { usedIn: ['Spendly', 'Musi', 'Portfolio'], purpose: 'Page structure and markup.' },
      'CSS': { usedIn: ['Spendly', 'Musi', 'Portfolio'], purpose: 'Styling, layout, and responsive design.' },
      'JavaScript': { usedIn: ['Musi', 'Portfolio'], purpose: 'Interactivity and application logic.' },
      'React': { usedIn: ['DevDrop', 'Spendly'], purpose: 'Frontend application and interactive user interface.' },
      'TypeScript': { usedIn: ['DevDrop', 'Spendly'], purpose: 'Type-safe frontend development.' },
      'Bootstrap': { usedIn: [], purpose: 'Responsive UI components and layout utilities.' },
      'Node.js': { usedIn: ['DevDrop', 'Spendly'], purpose: 'Backend REST API, signaling, and server logic.' },
      'MongoDB': { usedIn: ['Spendly'], purpose: 'Cloud database persistence — wallets, transactions, budgets, and user data.' },
      'SQL': { usedIn: [], purpose: 'Relational database querying.' },
      'C': { usedIn: [], purpose: 'Core programming and systems fundamentals.' },
      'C++': { usedIn: [], purpose: 'Core programming and systems fundamentals.' },
      'Python': { usedIn: [], purpose: 'General-purpose programming.' },
      'Photoshop': { usedIn: [], purpose: 'Photo editing and visual design.' },
      'Lightroom': { usedIn: [], purpose: 'Photography editing and color grading.' },
      'DaVinci Resolve': { usedIn: [], purpose: 'Video editing and color grading.' },
      'Photography': { usedIn: [], purpose: 'Creative and visual work.' },
      'Photo Editing': { usedIn: [], purpose: 'Creative and visual work.' },
      'Video Editing': { usedIn: [], purpose: 'Creative and visual work.' },
      'Google OAuth': { usedIn: ['Spendly'], purpose: 'Secure user authentication.' },
      'iTunes API': { usedIn: ['Musi'], purpose: 'Music search with 30-second previews.' },
      'Java': { usedIn: ['Musi'], purpose: 'Backend logic.' },
      'Firebase': { usedIn: ['Musi'], purpose: 'Backend services.' },
      'WebRTC': { usedIn: ['DevDrop'], purpose: 'Direct browser-to-browser peer connections and chunked binary streaming.' },
      'WebSocket': { usedIn: ['DevDrop'], purpose: 'Real-time signaling for SDP offer/answer exchange and ICE candidate discovery.' },
      'Redis': { usedIn: ['DevDrop'], purpose: 'In-memory ephemeral room and session state management with TTL expiration.' }
    };

    var openTrigger = null;

    function closePopover(){
      popover.classList.remove('open');
      if(openTrigger){ openTrigger.setAttribute('aria-expanded', 'false'); }
      openTrigger = null;
    }

    function positionPopover(trigger){
      popover.style.visibility = 'hidden';
      popover.style.display = 'block';
      popover.classList.add('open');

      var r = trigger.getBoundingClientRect();
      var pw = popover.offsetWidth || 240;
      var ph = popover.offsetHeight || 120;
      var left = r.left;
      var top = r.bottom + 8;
      var vw = window.innerWidth;
      var vh = window.innerHeight;

      if(left + pw > vw - 12) left = vw - pw - 12;
      if(left < 12) left = 12;

      if(top + ph > vh - 12){
        top = r.top - ph - 8;
        if(top < 12) top = 12;
      }

      popover.style.left = left + 'px';
      popover.style.top = top + 'px';
      popover.style.visibility = '';
      popover.style.display = '';
    }

    function openPopover(trigger){
      if(openTrigger && openTrigger !== trigger){
        openTrigger.setAttribute('aria-expanded', 'false');
      }

      var name = trigger.dataset.tech;
      var info = techInfo[name];
      if(!info) return;

      titleEl.textContent = name.toUpperCase();
      if(info.usedIn && info.usedIn.length){
        usedRow.style.display = '';
        usedEl.innerHTML = '<div class="tp-used-list">' +
          info.usedIn.map(function(p){
            return '<div class="tp-used-item"><span class="tp-bullet">•</span> ' + p + '</div>';
          }).join('') +
        '</div>';
      } else {
        usedRow.style.display = 'none';
        usedEl.innerHTML = '';
      }
      purposeEl.textContent = info.purpose;

      positionPopover(trigger);
      popover.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      openTrigger = trigger;
    }

    triggers.forEach(function(t){
      t.setAttribute('aria-expanded', 'false');
      t.setAttribute('aria-haspopup', 'true');
      t.addEventListener('click', function(e){
        e.stopPropagation();
        if(openTrigger === t){ closePopover(); return; }
        openPopover(t);
      });
    });

    document.addEventListener('click', function(e){
      if(popover.contains(e.target)) return;
      closePopover();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closePopover();
    });
    window.addEventListener('scroll', closePopover, { passive: true });
    window.addEventListener('resize', closePopover);
  })();

  // ---- keyboard shortcuts (desktop, developer-terminal identity) ----
  // Disabled entirely when the page doesn't have the expected section
  // structure (e.g. the 404 game page, which already uses A/D for movement).
  (function(){
    if(!document.getElementById('work')) return;

    function isTypingContext(el){
      if(!el) return false;
      var tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
    }
    function scrollToId(id){
      var el = document.getElementById(id);
      if(el) el.scrollIntoView({ behavior: 'smooth' });
    }

    var shortcuts = {
      'g': function(){ scrollToId('work'); },
      'a': function(){ scrollToId('about'); },
      'e': function(){ scrollToId('experience'); },
      's': function(){ scrollToId('skills'); },
      'c': function(){ scrollToId('contact'); },
      't': function(){ var t = document.getElementById('themeToggle'); if(t) t.click(); }
    };

    document.addEventListener('keydown', function(e){
      if(e.metaKey || e.ctrlKey || e.altKey) return;
      if(isTypingContext(document.activeElement)) return;

      var cmdk = document.getElementById('cmdkOverlay');
      var modal = document.getElementById('modalOverlay');
      if(cmdk && cmdk.classList.contains('open')) return;
      if(modal && modal.classList.contains('open')) return;

      if(e.key === '/'){
        e.preventDefault();
        var trigger = document.getElementById('cmdkTrigger');
        if(trigger) trigger.click();
        return;
      }

      var handler = shortcuts[e.key.toLowerCase()];
      if(handler){
        e.preventDefault();
        handler();
      }
    });
  })();

  // ---- last updated (single source of truth) ----
  (function(){
    var LAST_UPDATED = 'August 2026';
    var el = document.getElementById('footerMeta');
    if(el) el.textContent = 'Last updated · ' + LAST_UPDATED;
  })();
