(function(){
  var canvas = document.getElementById('gameCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  var startOverlay = document.getElementById('startOverlay');
  var overOverlay = document.getElementById('overOverlay');
  var overTitle = document.getElementById('overTitle');
  var overScore = document.getElementById('overScore');
  var startBtn = document.getElementById('startBtn');
  var restartBtn = document.getElementById('restartBtn');
  var hudScore = document.getElementById('hudScore');
  var hudWave = document.getElementById('hudWave');
  var hudLives = document.getElementById('hudLives');

  var COLORS = { player:'#4ade80', bullet:'#4ade80', enemy:'#22d3ee', enemyAlt:'#f0b429', enemyBullet:'#ef4444', text:'#d3f5df' };

  var player, bullets, enemyBullets, enemies, keys, score, lives, wave;
  var running = false, lastShot = 0, enemyDir = 1, enemyStepDown = false, rafId = null, lastShotEnemy = 0;

  // ---- Web Audio API Arcade Sound Engine ----
  var audioCtx = null;
  var masterGain = null;
  var soundEnabled = true;
  var SOUND_STORAGE_KEY = '404-game-sound';
  var lastSfxTime = { shoot: 0, hit: 0 };
  var soundToggleBtn = document.getElementById('soundToggle');

  function loadSoundPref(){
    try {
      var val = localStorage.getItem(SOUND_STORAGE_KEY);
      if(val !== null){ soundEnabled = (val === 'on'); }
    } catch(e){}
    updateSoundBtnUI();
  }

  function saveSoundPref(val){
    soundEnabled = val;
    try { localStorage.setItem(SOUND_STORAGE_KEY, val ? 'on' : 'off'); } catch(e){}
    updateSoundBtnUI();
  }

  function updateSoundBtnUI(){
    if(!soundToggleBtn) return;
    soundToggleBtn.textContent = soundEnabled ? '🔊 SOUND ON' : '🔇 SOUND OFF';
    soundToggleBtn.classList.toggle('is-muted', !soundEnabled);
  }

  function initAudio(){
    if(!soundEnabled) return false;
    if(!audioCtx){
      var AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if(!AudioCtxClass) return false;
      try {
        audioCtx = new AudioCtxClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.12; // comfortable, quiet master volume
        masterGain.connect(audioCtx.destination);
      } catch(e){
        audioCtx = null;
        return false;
      }
    }
    if(audioCtx && audioCtx.state === 'suspended'){
      audioCtx.resume().catch(function(){});
    }
    return true;
  }

  if(soundToggleBtn){
    soundToggleBtn.addEventListener('click', function(e){
      e.stopPropagation();
      saveSoundPref(!soundEnabled);
      if(soundEnabled) initAudio();
    });
  }

  window.addEventListener('click', initAudio, { once: false });
  window.addEventListener('keydown', initAudio, { once: false });
  window.addEventListener('touchstart', initAudio, { once: false });

  function sfxShoot(){
    if(!soundEnabled || !initAudio()) return;
    var now = performance.now();
    if(now - lastSfxTime.shoot < 60) return;
    lastSfxTime.shoot = now;
    try {
      var t = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.07);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.07);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch(e){}
  }

  function sfxHit(){
    if(!soundEnabled || !initAudio()) return;
    var now = performance.now();
    if(now - lastSfxTime.hit < 35) return;
    lastSfxTime.hit = now;
    try {
      var t = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.11);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.11);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.11);
    } catch(e){}
  }

  function sfxLifeLost(){
    if(!soundEnabled || !initAudio()) return;
    try {
      var t = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.setValueAtTime(220, t + 0.08);
      osc.frequency.setValueAtTime(130, t + 0.16);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.25);
    } catch(e){}
  }

  function sfxWaveStart(){
    if(!soundEnabled || !initAudio()) return;
    try {
      var t = audioCtx.currentTime;
      [330, 440, 660].forEach(function(freq, i){
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        var noteT = t + i * 0.09;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, noteT);
        gain.gain.setValueAtTime(0.09, noteT);
        gain.gain.linearRampToValueAtTime(0.001, noteT + 0.08);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(noteT);
        osc.stop(noteT + 0.08);
      });
    } catch(e){}
  }

  function sfxGameOver(){
    if(!soundEnabled || !initAudio()) return;
    try {
      var t = audioCtx.currentTime;
      [400, 320, 250, 180].forEach(function(freq, i){
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        var noteT = t + i * 0.12;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, noteT);
        gain.gain.setValueAtTime(0.12, noteT);
        gain.gain.linearRampToValueAtTime(0.001, noteT + 0.11);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(noteT);
        osc.stop(noteT + 0.11);
      });
    } catch(e){}
  }

  function sfxGameStart(){
    if(!soundEnabled || !initAudio()) return;
    try {
      var t = audioCtx.currentTime;
      [220, 440, 880].forEach(function(freq, i){
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        var noteT = t + i * 0.07;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteT);
        gain.gain.setValueAtTime(0.1, noteT);
        gain.gain.linearRampToValueAtTime(0.001, noteT + 0.06);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(noteT);
        osc.stop(noteT + 0.06);
      });
    } catch(e){}
  }

  function resetGame(){
    player = { x: W/2 - 14, y: H - 30, w: 28, h: 14, speed: 4.2 };
    bullets = [];
    enemyBullets = [];
    keys = { left:false, right:false };
    score = 0;
    lives = 3;
    wave = 1;
    spawnWave();
    updateHud();
  }

  function spawnWave(){
    enemies = [];
    var cols = 7, rows = 3;
    var ew = 28, eh = 16, gapX = 10, gapY = 14;
    var totalW = cols * ew + (cols - 1) * gapX;
    var startX = (W - totalW) / 2;
    var startY = 40;
    for(var r = 0; r < rows; r++){
      for(var c = 0; c < cols; c++){
        enemies.push({
          x: startX + c * (ew + gapX),
          y: startY + r * (eh + gapY),
          w: ew, h: eh,
          alive: true,
          alt: (r % 2 === 0)
        });
      }
    }
    enemyDir = 1;
    if(wave > 1) sfxWaveStart();
  }

  function updateHud(){
    hudScore.textContent = score;
    hudWave.textContent = wave;
    var tri = '';
    for(var i = 0; i < lives; i++){ tri += '▲ '; }
    hudLives.textContent = tri.trim() || '—';
  }

  function rectsOverlap(a, b){
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function shoot(){
    var now = performance.now();
    if(now - lastShot < 260) return;
    lastShot = now;
    bullets.push({ x: player.x + player.w/2 - 2, y: player.y - 8, w: 4, h: 10, vy: -6 });
    sfxShoot();
  }

  function update(){
    if(keys.left) player.x -= player.speed;
    if(keys.right) player.x += player.speed;
    player.x = Math.max(4, Math.min(W - player.w - 4, player.x));

    bullets.forEach(function(b){ b.y += b.vy; });
    bullets = bullets.filter(function(b){ return b.y + b.h > 0; });

    enemyBullets.forEach(function(b){ b.y += b.vy; });
    enemyBullets = enemyBullets.filter(function(b){ return b.y < H; });

    var alive = enemies.filter(function(e){ return e.alive; });
    var speed = 0.5 + (wave * 0.15) + (1 - alive.length / enemies.length) * 1.2;
    var hitEdge = false;
    alive.forEach(function(e){
      e.x += enemyDir * speed;
      if(e.x <= 4 || e.x + e.w >= W - 4) hitEdge = true;
    });
    if(hitEdge){
      enemyDir *= -1;
      alive.forEach(function(e){ e.y += 10; });
    }

    var now = performance.now();
    if(alive.length && now - lastShotEnemy > Math.max(500, 1200 - wave * 80)){
      lastShotEnemy = now;
      var shooter = alive[Math.floor(Math.random() * alive.length)];
      enemyBullets.push({ x: shooter.x + shooter.w/2 - 2, y: shooter.y + shooter.h, w: 4, h: 10, vy: 3.4 });
    }

    bullets.forEach(function(b){
      enemies.forEach(function(e){
        if(e.alive && rectsOverlap(b, e)){
          e.alive = false;
          b.y = -999;
          score += 10;
          sfxHit();
        }
      });
    });

    enemyBullets.forEach(function(b){
      if(rectsOverlap(b, player)){
        b.y = H + 999;
        lives -= 1;
        sfxLifeLost();
        if(lives <= 0){ endGame(false); }
      }
    });

    alive.forEach(function(e){
      if(e.y + e.h >= player.y){ endGame(false); }
    });

    if(enemies.every(function(e){ return !e.alive; })){
      wave += 1;
      spawnWave();
    }

    updateHud();
  }

  function drawInvader(e){
    ctx.fillStyle = e.alt ? COLORS.enemyAlt : COLORS.enemy;
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = '#04140a';
    ctx.fillRect(e.x + 5, e.y + 4, 4, 4);
    ctx.fillRect(e.x + e.w - 9, e.y + 4, 4, 4);
  }

  function render(){
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#04140a';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = COLORS.player;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillRect(player.x + player.w/2 - 3, player.y - 6, 6, 6);

    ctx.fillStyle = COLORS.bullet;
    bullets.forEach(function(b){ ctx.fillRect(b.x, b.y, b.w, b.h); });

    ctx.fillStyle = COLORS.enemyBullet;
    enemyBullets.forEach(function(b){ ctx.fillRect(b.x, b.y, b.w, b.h); });

    enemies.forEach(function(e){ if(e.alive) drawInvader(e); });
  }

  function loop(){
    if(!running) return;
    update();
    render();
    rafId = requestAnimationFrame(loop);
  }

  function startGame(){
    resetGame();
    startOverlay.hidden = true;
    overOverlay.hidden = true;
    running = true;
    lastShotEnemy = performance.now();
    if(rafId) cancelAnimationFrame(rafId);
    sfxGameStart();
    loop();
  }

  function endGame(won){
    running = false;
    if(rafId) cancelAnimationFrame(rafId);
    overTitle.textContent = won ? 'YOU WIN' : 'GAME OVER';
    overScore.textContent = 'score: ' + score + ' — wave ' + wave;
    overOverlay.hidden = false;
    if(!won) sfxGameOver(); else sfxWaveStart();
  }

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  window.addEventListener('keydown', function(e){
    if(['ArrowLeft','ArrowRight','a','A','d','D',' '].indexOf(e.key) !== -1){ e.preventDefault(); }
    if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if(e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    if(e.key === ' ' && running) shoot();
  });
  window.addEventListener('keyup', function(e){
    if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if(e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
  });

  // touch controls
  var btnLeft = document.getElementById('btnLeft');
  var btnRight = document.getElementById('btnRight');
  var btnShoot = document.getElementById('btnShoot');

  function bindHold(btn, onDown, onUp){
    if(!btn) return;
    btn.addEventListener('touchstart', function(e){ e.preventDefault(); onDown(); }, { passive:false });
    btn.addEventListener('touchend', function(e){ e.preventDefault(); onUp(); }, { passive:false });
    btn.addEventListener('mousedown', onDown);
    btn.addEventListener('mouseup', onUp);
    btn.addEventListener('mouseleave', onUp);
  }
  bindHold(btnLeft, function(){ keys.left = true; }, function(){ keys.left = false; });
  bindHold(btnRight, function(){ keys.right = true; }, function(){ keys.right = false; });
  if(btnShoot){
    btnShoot.addEventListener('touchstart', function(e){ e.preventDefault(); if(running) shoot(); }, { passive:false });
    btnShoot.addEventListener('click', function(){ if(running) shoot(); });
  }

  // load saved sound preference & init idle state
  loadSoundPref();
  player = { x: W/2 - 14, y: H - 30, w: 28, h: 14, speed: 4.2 };
  bullets = []; enemyBullets = []; keys = { left:false, right:false };
  wave = 1; spawnWave();
  render();
})();
