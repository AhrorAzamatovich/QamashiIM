/* ================================================================
   JARVIS CANVAS — Iron Man HUD-style animated background
   ================================================================ */
(function() {
  const canvas = document.getElementById('jarvisCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, animId;
  let mouse = { x: -999, y: -999 };
  let time = 0;

  /* ── Resize ────────────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  /* ── Colors ─────────────────────────────────────────────── */
  const C = {
    cyan:   'rgba(0, 212, 255,',
    gold:   'rgba(255, 165,   0,',
    blue:   'rgba(0, 100, 200,',
    green:  'rgba(0, 255, 136,',
    white:  'rgba(200, 240, 255,',
  };
  function rgba(col, a) { return col + a + ')'; }

  /* ── HUD Rings ──────────────────────────────────────────── */
  const rings = [
    { r: 180, speed: 0.003,  dash: [8, 14],  col: C.cyan,  alpha: 0.18, tick: 16 },
    { r: 280, speed: -0.002, dash: [4, 20],  col: C.blue,  alpha: 0.12, tick: 24 },
    { r: 380, speed: 0.0015, dash: [12, 8],  col: C.cyan,  alpha: 0.10, tick: 32 },
    { r: 480, speed: -0.001, dash: [6, 30],  col: C.gold,  alpha: 0.07, tick: 48 },
    { r: 580, speed: 0.0008, dash: [20, 20], col: C.blue,  alpha: 0.06, tick: 60 },
  ];
  rings.forEach(r => { r.angle = Math.random() * Math.PI * 2; });

  /* ── Particles ──────────────────────────────────────────── */
  const NPART = 80;
  const particles = Array.from({ length: NPART }, () => ({
    x: Math.random() * 2000,
    y: Math.random() * 1200,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.8 + 0.4,
    a: Math.random() * 0.7 + 0.1,
    col: Math.random() > 0.7 ? C.gold : C.cyan,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.02 + Math.random() * 0.04,
  }));

  /* ── Grid nodes ─────────────────────────────────────────── */
  const GRID_COLS = 12;
  const GRID_ROWS = 8;
  const nodes = [];
  for (let i = 0; i <= GRID_COLS; i++) {
    for (let j = 0; j <= GRID_ROWS; j++) {
      nodes.push({
        bx: i / GRID_COLS,
        by: j / GRID_ROWS,
        ox: 0, oy: 0,
        vx: 0, vy: 0,
      });
    }
  }

  /* ── Data streams ────────────────────────────────────────── */
  const streams = Array.from({ length: 20 }, () => ({
    x: Math.random() * 2000,
    y: Math.random() * -600,
    speed: 0.3 + Math.random() * 0.8,
    length: 30 + Math.random() * 80,
    alpha: 0.04 + Math.random() * 0.08,
    col: Math.random() > 0.6 ? C.cyan : C.blue,
  }));

  /* ── Radar sweeps ────────────────────────────────────────── */
  const sweeps = [
    { cx: 0.15, cy: 0.3, r: 90, angle: 0, speed: 0.018, col: C.cyan,  alpha: 0.5 },
    { cx: 0.85, cy: 0.7, r: 70, angle: 2, speed: -0.014, col: C.gold, alpha: 0.4 },
  ];

  /* ── Hex grid ────────────────────────────────────────────── */
  function drawHexGrid() {
    const size = 44;
    const rows = Math.ceil(H / (size * 1.5)) + 1;
    const cols = Math.ceil(W / (size * Math.sqrt(3))) + 1;
    ctx.strokeStyle = rgba(C.cyan, 0.028);
    ctx.lineWidth = 0.5;
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * size * Math.sqrt(3) + (row % 2) * size * Math.sqrt(3) / 2;
        const y = row * size * 1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  /* ── Draw ────────────────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    time += 0.016;

    const cx = W / 2, cy = H / 2;

    /* Hex grid */
    drawHexGrid();

    /* Grid warp nodes + lines */
    nodes.forEach(n => {
      const tx = n.bx * W;
      const ty = n.by * H;
      const dx = tx - mouse.x;
      const dy = ty - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repel = dist < 160 ? (160 - dist) / 160 * 16 : 0;
      const targetOx = repel > 0 ? (dx / dist) * repel : 0;
      const targetOy = repel > 0 ? (dy / dist) * repel : 0;
      n.vx += (targetOx - n.ox) * 0.08;
      n.vy += (targetOy - n.oy) * 0.08;
      n.vx *= 0.92; n.vy *= 0.92;
      n.ox += n.vx; n.oy += n.vy;
    });

    /* Draw grid lines */
    ctx.strokeStyle = rgba(C.cyan, 0.05);
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_COLS; i++) {
      for (let j = 0; j <= GRID_ROWS; j++) {
        const n = nodes[i * (GRID_ROWS + 1) + j];
        if (i < GRID_COLS) {
          const nb = nodes[(i + 1) * (GRID_ROWS + 1) + j];
          ctx.beginPath();
          ctx.moveTo(n.bx * W + n.ox, n.by * H + n.oy);
          ctx.lineTo(nb.bx * W + nb.ox, nb.by * H + nb.oy);
          ctx.stroke();
        }
        if (j < GRID_ROWS) {
          const nb = nodes[i * (GRID_ROWS + 1) + j + 1];
          ctx.beginPath();
          ctx.moveTo(n.bx * W + n.ox, n.by * H + n.oy);
          ctx.lineTo(nb.bx * W + nb.ox, nb.by * H + nb.oy);
          ctx.stroke();
        }
      }
    }

    /* Rings */
    rings.forEach(ring => {
      ring.angle += ring.speed;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ring.angle);
      ctx.setLineDash(ring.dash);
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(ring.col, ring.alpha);
      ctx.beginPath();
      ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.stroke();

      /* Tick marks */
      for (let t = 0; t < ring.tick; t++) {
        const a = (Math.PI * 2 / ring.tick) * t;
        const x1 = Math.cos(a) * (ring.r - 5);
        const y1 = Math.sin(a) * (ring.r - 5);
        const x2 = Math.cos(a) * (ring.r + 5);
        const y2 = Math.sin(a) * (ring.r + 5);
        ctx.setLineDash([]);
        ctx.strokeStyle = rgba(ring.col, ring.alpha * 1.5);
        ctx.lineWidth = t % 4 === 0 ? 2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    });

    /* Radar sweeps */
    sweeps.forEach(sw => {
      sw.angle += sw.speed;
      const x = sw.cx * W, y = sw.cy * H;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(sw.angle);

      /* Draw sweep gradient */
      const grad = ctx.createConicalGradient
        ? null
        : ctx.createRadialGradient(0, 0, 0, 0, 0, sw.r);

      const arc = Math.PI / 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, sw.r, 0, arc);
      ctx.closePath();
      ctx.fillStyle = rgba(sw.col, sw.alpha * 0.15);
      ctx.fill();

      /* Leading edge */
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(sw.r, 0);
      ctx.strokeStyle = rgba(sw.col, sw.alpha);
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.stroke();

      /* Ring */
      ctx.beginPath();
      ctx.arc(0, 0, sw.r, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(sw.col, 0.25);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();

      /* Blip dot */
      const blipA = sw.angle + Math.PI * 0.8;
      ctx.beginPath();
      ctx.arc(x + Math.cos(blipA) * sw.r * 0.6, y + Math.sin(blipA) * sw.r * 0.6, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(sw.col, 0.8);
      ctx.fill();
    });

    /* Data streams (vertical glowing lines) */
    streams.forEach(s => {
      s.y += s.speed;
      if (s.y > H + s.length) { s.y = -s.length; s.x = Math.random() * W; }
      const grad = ctx.createLinearGradient(s.x, s.y - s.length, s.x, s.y);
      grad.addColorStop(0, rgba(s.col, 0));
      grad.addColorStop(0.7, rgba(s.col, s.alpha));
      grad.addColorStop(1, rgba(s.col, 0));
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - s.length);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    });

    /* Particles */
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.twinkle += p.twinkleSpeed;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const a = p.a * (0.5 + 0.5 * Math.sin(p.twinkle));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(p.col, a);
      ctx.fill();
    });

    /* Central orb (subtle) */
    const pulse = 0.5 + 0.5 * Math.sin(time * 1.2);
    const orbGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
    orbGrad.addColorStop(0, rgba(C.cyan, 0.04 * pulse));
    orbGrad.addColorStop(0.5, rgba(C.blue, 0.02 * pulse));
    orbGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 160, 0, Math.PI * 2);
    ctx.fill();

    /* HUD crosshair at center */
    ctx.setLineDash([3, 6]);
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = rgba(C.cyan, 0.08);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.setLineDash([]);

    /* Corner HUD brackets */
    const corners = [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]];
    const bSize = 30;
    corners.forEach(([x, y, sx, sy]) => {
      ctx.strokeStyle = rgba(C.cyan, 0.25);
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x + sx * bSize, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + sy * bSize);
      ctx.stroke();
    });

    /* Scanning horizon line */
    const scanY = ((time * 30) % (H + 40)) - 20;
    const scanGrad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
    scanGrad.addColorStop(0, 'transparent');
    scanGrad.addColorStop(0.5, rgba(C.cyan, 0.06));
    scanGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 15, W, 30);

    animId = requestAnimationFrame(draw);
  }

  /* ── Mouse tracking ──────────────────────────────────────── */
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  /* ── Touch support ───────────────────────────────────────── */
  window.addEventListener('touchmove', e => {
    if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
  }, { passive: true });

  draw();
})();
