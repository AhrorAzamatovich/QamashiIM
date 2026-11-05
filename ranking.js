/**
 * ================================================================
 * EDU PLATFORM — RANKING & FEED ALGORITHM  v1.0
 * ================================================================
 *
 * Asosiy tamoyillar:
 *  1. Yangiliklar faqat "eng yangi" bo'lgani uchun emas —
 *     FAOLLIK, SIFAT va MAKTAB OBRO'SI bilan birga ko'tariladi.
 *  2. Hech bir maktab doim birinchi o'rinda qolmaydi.
 *     Yangi, sifatli post istalgan vaqt "trending" ga chiqishi mumkin.
 *  3. Profil to'ldirilganlik darajasi maktab va foydalanuvchini
 *     organik tarzda ko'taradi — sun'iy "boost" emas.
 *  4. Algoritmning barcha og'irliklari ochiq va o'zgartirilishi mumkin.
 *
 * SIGNAL GURUHLARI (post uchun):
 *  ┌─────────────────────────────┬──────────────────┐
 *  │ Signal                      │ Maksimal og'irlik │
 *  ├─────────────────────────────┼──────────────────┤
 *  │ Engagement (like+view+cmt)  │       40          │
 *  │ Freshness (yangilik)        │       25          │
 *  │ Velocity (tez o'sayotgan)   │       15          │
 *  │ School reputation           │       10          │
 *  │ Content quality             │        5          │
 *  │ Pinned boost                │        5          │
 *  └─────────────────────────────┴──────────────────┘
 *
 * SIGNAL GURUHLARI (maktab uchun):
 *  ┌─────────────────────────────┬──────────────────┐
 *  │ Signal                      │ Maksimal og'irlik │
 *  ├─────────────────────────────┼──────────────────┤
 *  │ Profile completeness        │       30          │
 *  │ Activity (post frequency)   │       25          │
 *  │ Engagement (like+view total)│       25          │
 *  │ Verification bonus          │       10          │
 *  │ Size (students/teachers)    │       10          │
 *  └─────────────────────────────┴──────────────────┘
 * ================================================================
 */

'use strict';

/* ══════════════════════════════════════════════════════════════
   WEIGHTS — algoritmni sozlash uchun faqat shu joyni o'zgartirish kifoya
   ══════════════════════════════════════════════════════════════ */
const WEIGHTS = {
  post: {
    like:         3.0,   // har bir like
    view:         0.5,   // har bir ko'rish
    comment:      5.0,   // har bir izoh
    pinned:       8.0,   // muhim belgi
    hasImage:     4.0,   // rasm borligida bonus
    longBody:     3.0,   // 300+ belgi matn
    freshHour:   25.0,   // 1 soat ichida
    freshDay:    18.0,   // 1 kun ichida
    freshWeek:   10.0,   // 1 hafta ichida
    freshMonth:   4.0,   // 1 oy ichida
    velocityK:   12.0,   // tez o'sayotgan (velocity koeffitsenti)
    schoolRep:    0.12,  // maktab obro'si koeffitsenti (0–100 ball x K)
  },
  school: {
    name:            5,
    shortName:       3,
    about:           8,
    logoUrl:        10,
    email:           5,
    phone:           5,
    address:         5,
    founded:         4,
    students:        5,
    teachers:        5,
    classes:         3,
    verified:       10,
    postFrequency:  25,  // maks — 1 oy ichida qancha post
    engagement:     25,  // maks — jami like+ko'rish
  },
};

/* ══════════════════════════════════════════════════════════════
   SCHOOL PROFILE COMPLETENESS  (0 – 100)
   ══════════════════════════════════════════════════════════════ */

/**
 * Maktab profilining to'ldirilganlik ballini hisoblaydi.
 * @param {object} sc – maktab obyekti
 * @returns {number} 0–100 oraliq'da ball
 */
function schoolCompleteness(sc) {
  if (!sc) return 0;
  const fields = [
    { key: 'name',      w: WEIGHTS.school.name      },
    { key: 'shortName', w: WEIGHTS.school.shortName  },
    { key: 'about',     w: WEIGHTS.school.about      },
    { key: 'logoUrl',   w: WEIGHTS.school.logoUrl    },
    { key: 'email',     w: WEIGHTS.school.email      },
    { key: 'phone',     w: WEIGHTS.school.phone      },
    { key: 'address',   w: WEIGHTS.school.address    },
    { key: 'founded',   w: WEIGHTS.school.founded    },
    { key: 'students',  w: WEIGHTS.school.students   },
    { key: 'teachers',  w: WEIGHTS.school.teachers   },
    { key: 'classes',   w: WEIGHTS.school.classes    },
  ];
  const maxRaw = fields.reduce((s, f) => s + f.w, 0);  // 58
  let raw = 0;
  fields.forEach(f => {
    const v = sc[f.key];
    if (v && v !== '' && v !== 0) raw += f.w;
  });
  if (sc.verified) raw += WEIGHTS.school.verified;
  const maxTotal = maxRaw + WEIGHTS.school.verified;    // 68
  return Math.min(100, Math.round((raw / maxTotal) * 100));
}

/**
 * Profil to'ldirilmagan maydonlar ro'yxatini qaytaradi.
 * Foydalanuvchiga "nima qilish kerak" deb ko'rsatish uchun.
 */
function schoolMissingFields(sc) {
  if (!sc) return [];
  const labels = {
    name:      'Maktab nomi',
    shortName: 'Qisqa nom',
    about:     'Maktab haqida matn',
    logoUrl:   'Logotip yuklash',
    email:     'Email manzil',
    phone:     'Telefon raqam',
    address:   'To\'liq manzil',
    founded:   'Tashkil etilgan yil',
    students:  'O\'quvchilar soni',
    teachers:  'Hodimlar soni',
    classes:   'Sinflar soni',
  };
  const missing = [];
  Object.keys(labels).forEach(key => {
    const v = sc[key];
    if (!v || v === '' || v === 0) missing.push(labels[key]);
  });
  return missing;
}

/* ══════════════════════════════════════════════════════════════
   POST RANKING SCORE
   ══════════════════════════════════════════════════════════════ */

/**
 * Bir post uchun ranking ballini hisoblaydi.
 * @param {object} post
 * @param {number} schoolRepScore – maktabning obro' bali (0–100)
 * @returns {number} float ball
 */
function postScore(post, schoolRepScore) {
  if (!post) return 0;
  const W = WEIGHTS.post;
  let score = 0;

  /* 1. Engagement signals */
  const likes    = post.likes    || 0;
  const views    = post.views    || 0;
  const comments = (post.comments || []).length;
  score += likes    * W.like;
  score += views    * W.view;
  score += comments * W.comment;

  /* 2. Content quality */
  if (post.imageUrl && post.imageUrl.length > 4) score += W.hasImage;
  if ((post.body || '').length >= 300)            score += W.longBody;

  /* 3. Pinned */
  if (post.pinned) score += W.pinned;

  /* 4. Freshness (time decay) */
  const ageMs   = Date.now() - new Date(post.createdAt || 0).getTime();
  const ageHour = ageMs / 3_600_000;
  const ageDay  = ageMs / 86_400_000;
  if (ageHour <= 1)       score += W.freshHour;
  else if (ageDay <= 1)   score += W.freshDay;
  else if (ageDay <= 7)   score += W.freshWeek;
  else if (ageDay <= 30)  score += W.freshMonth;

  /* 5. Velocity (engagement per hour since published — trenddagi tezlik) */
  const hoursAlive = Math.max(ageHour, 1);
  const totalEng   = likes * 2 + comments * 4 + views * 0.3;
  const velocity   = totalEng / hoursAlive;
  // Sigmoid normalizatsiya: tezlikni 0..1 ga siqish (50 ta eng ko'p = 1)
  const normVel    = velocity / (velocity + 50);
  score += normVel * W.velocityK;

  /* 6. School reputation */
  score += (schoolRepScore || 0) * W.schoolRep;

  return score;
}

/* ══════════════════════════════════════════════════════════════
   SCHOOL RANKING SCORE
   ══════════════════════════════════════════════════════════════ */

/**
 * Bir maktabning umumiy obro' ballini hisoblaydi (0–100).
 * @param {object} sc
 * @param {Array}  posts – bu maktabning postlari
 * @returns {number} 0–100
 */
function schoolRepScore(sc, posts) {
  if (!sc) return 0;
  const W = WEIGHTS.school;
  let raw = 0;

  /* 1. Profile completeness (max 68 → normallanamiz) */
  const completeness = schoolCompleteness(sc);  // 0–100
  raw += completeness * 0.3;  // maks 30 ball

  /* 2. Post frequency — so'nggi 30 kun ichida */
  const thirtyDaysAgo = Date.now() - 30 * 86_400_000;
  const recentPosts   = (posts || []).filter(p => new Date(p.createdAt || 0).getTime() > thirtyDaysAgo);
  // 10 ta post = maks: sigmoid normalizatsiya
  const freqScore     = (recentPosts.length / (recentPosts.length + 5)) * W.postFrequency;
  raw += freqScore;

  /* 3. Engagement (jami) */
  const totalLikes   = (posts || []).reduce((s, p) => s + (p.likes || 0), 0);
  const totalViews   = (posts || []).reduce((s, p) => s + (p.views || 0), 0);
  const totalComments= (posts || []).reduce((s, p) => s + (p.comments || []).length, 0);
  const totalEng     = totalLikes * 2 + totalComments * 4 + totalViews * 0.1;
  const engScore     = (totalEng / (totalEng + 500)) * W.engagement;
  raw += engScore;

  return Math.min(100, raw);
}

/* ══════════════════════════════════════════════════════════════
   MAIN SORT FUNCTIONS
   ══════════════════════════════════════════════════════════════ */

/**
 * Postlarni algoritmik tarzda saralaydi (default feed).
 * Pinned postlar har doim birinchi bo'ladi (ular ichida ham score bo'yicha).
 *
 * @param {Array}   posts
 * @param {string}  mode – 'trending' | 'newest' | 'liked' | 'viewed' | 'commented'
 * @returns {Array} tartiblangan postlar
 */
function sortPosts(posts, mode) {
  if (!posts || !posts.length) return [];
  mode = mode || 'trending';

  /* Har bir post uchun maktab obro'sini bir marta hisoblash (cache) */
  const allPosts   = getPosts();
  const repCache   = {};
  function getSchoolRep(schoolId) {
    if (repCache[schoolId] !== undefined) return repCache[schoolId];
    const sc  = getSchoolById(schoolId);
    const scp = allPosts.filter(p => p.schoolId === schoolId);
    repCache[schoolId] = schoolRepScore(sc, scp);
    return repCache[schoolId];
  }

  let sorted;

  if (mode === 'newest') {
    sorted = [...posts].sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  } else if (mode === 'liked') {
    sorted = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (mode === 'viewed') {
    sorted = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (mode === 'commented') {
    sorted = [...posts].sort((a, b) =>
      (b.comments || []).length - (a.comments || []).length
    );
  } else {
    /* ── TRENDING (default) ──────────────────────────────────── */
    sorted = [...posts]
      .map(p => ({
        post:  p,
        score: postScore(p, getSchoolRep(p.schoolId)),
      }))
      .sort((a, b) => b.score - a.score)
      .map(x => x.post);
  }

  /* Pinned postlar her doim tepaga, o'z ichida ham score bo'yicha */
  const pinned   = sorted.filter(p => p.pinned);
  const unpinned = sorted.filter(p => !p.pinned);
  return [...pinned, ...unpinned];
}

/**
 * Maktablarni obro' ballari bo'yicha saralaydi.
 *
 * @param {Array}  schools
 * @param {string} mode – 'reputation' | 'completeness' | 'activity' | 'newest'
 * @returns {Array} tartiblangan maktablar + har birining balllari
 */
function sortSchools(schools, mode) {
  if (!schools || !schools.length) return [];
  mode = mode || 'reputation';
  const allPosts = getPosts();

  if (mode === 'newest') {
    return [...schools].sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }
  if (mode === 'completeness') {
    return [...schools].sort((a, b) =>
      schoolCompleteness(b) - schoolCompleteness(a)
    );
  }
  if (mode === 'activity') {
    const thirtyDaysAgo = Date.now() - 30 * 86_400_000;
    return [...schools].sort((a, b) => {
      const pa = allPosts.filter(p => p.schoolId === a.id && new Date(p.createdAt||0).getTime() > thirtyDaysAgo).length;
      const pb = allPosts.filter(p => p.schoolId === b.id && new Date(p.createdAt||0).getTime() > thirtyDaysAgo).length;
      return pb - pa;
    });
  }

  /* ── REPUTATION (default) ──────────────────────────────────── */
  return [...schools]
    .map(sc => ({
      school: sc,
      score:  schoolRepScore(sc, allPosts.filter(p => p.schoolId === sc.id)),
    }))
    .sort((a, b) => b.score - a.score)
    .map(x => x.school);
}

/* ══════════════════════════════════════════════════════════════
   TRENDING POSTS (mini feed — bosh sahifa uchun)
   Returns top N posts by trending score
   ══════════════════════════════════════════════════════════════ */
function getTrendingPosts(n) {
  n = n || 6;
  return sortPosts(getPosts(), 'trending').slice(0, n);
}

/* ══════════════════════════════════════════════════════════════
   SCHOOL LEADERBOARD
   Returns schools sorted by reputation with completeness info
   ══════════════════════════════════════════════════════════════ */
function getSchoolLeaderboard() {
  const allPosts = getPosts();
  return sortSchools(getSchools(), 'reputation').map((sc, rank) => {
    const posts       = allPosts.filter(p => p.schoolId === sc.id);
    const completeness = schoolCompleteness(sc);
    const repScore    = schoolRepScore(sc, posts);
    const missing     = schoolMissingFields(sc);
    const thirtyDaysAgo = Date.now() - 30 * 86_400_000;
    const recentCount = posts.filter(p => new Date(p.createdAt||0).getTime() > thirtyDaysAgo).length;
    return {
      school:       sc,
      rank:         rank + 1,
      repScore:     Math.round(repScore),
      completeness,
      missing,
      postCount:    posts.length,
      recentPosts:  recentCount,
      totalLikes:   posts.reduce((s, p) => s + (p.likes||0), 0),
      totalViews:   posts.reduce((s, p) => s + (p.views||0), 0),
    };
  });
}

/* ══════════════════════════════════════════════════════════════
   PROFILE COMPLETENESS BAR (UI helper)
   ══════════════════════════════════════════════════════════════ */

/**
 * Maktab profili uchun to'ldirilganlik UI komponentini qaytaradi.
 * Faqat maktab admini ko'radi.
 *
 * @param {object} sc      – maktab
 * @param {boolean} compact – qisqaroq variant
 * @returns {string} HTML
 */
function renderCompletenessBar(sc, compact) {
  const pct     = schoolCompleteness(sc);
  const missing = schoolMissingFields(sc);

  /* Rangni foizga qarab tanlash */
  const color = pct >= 80 ? 'var(--green)' :
                pct >= 50 ? 'var(--gold)'  :
                            'var(--red)';

  /* Qaysi daraja */
  const tier = pct >= 90 ? '🏆 Platinum'  :
               pct >= 75 ? '🥇 Gold'       :
               pct >= 50 ? '🥈 Silver'     :
               pct >= 25 ? '🥉 Bronze'     :
                           '⚙️ Boshlang\'ich';

  const missingHtml = (!compact && missing.length > 0)
    ? `<div style="margin-top:.8rem;padding:.7rem .9rem;background:rgba(255,165,0,.06);border:1px solid rgba(255,165,0,.2);border-radius:var(--r-xs)">
        <div style="font-family:var(--font-hud);font-size:.68rem;color:var(--gold);letter-spacing:.06em;margin-bottom:.4rem">◈ QO'SHILISHI KERAK:</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${missing.map(m => `<span style="font-size:.7rem;background:rgba(255,165,0,.1);border:1px solid rgba(255,165,0,.25);color:var(--gold);padding:2px 8px;border-radius:var(--r-xs)">${m}</span>`).join('')}
        </div>
       </div>`
    : '';

  return `
  <div class="completeness-card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem">
      <div>
        <div style="font-family:var(--font-hud);font-size:.72rem;color:var(--cyan);letter-spacing:.08em;margin-bottom:2px">◈ PROFIL TO'LDIRILGANLIK DARAJASI</div>
        <div style="font-size:.78rem;color:var(--txt3)">Yuqori daraja → Sayt yuqorisida ko'rinasiz</div>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--font-hud);font-size:1.6rem;font-weight:800;color:${color};text-shadow:0 0 12px ${color}60;line-height:1">${pct}%</div>
        <div style="font-size:.72rem;color:var(--txt3);margin-top:2px">${tier}</div>
      </div>
    </div>
    <div class="completeness-bar-outer">
      <div class="completeness-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,${color},${color}aa);box-shadow:0 0 8px ${color}60"></div>
      <!-- Milestone markers -->
      <div class="cb-marker" style="left:25%" title="Bronze (25%)"></div>
      <div class="cb-marker" style="left:50%" title="Silver (50%)"></div>
      <div class="cb-marker" style="left:75%" title="Gold (75%)"></div>
      <div class="cb-marker" style="left:90%" title="Platinum (90%)"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:.4rem">
      <span style="font-size:.64rem;color:var(--txt3)">🥉 25%</span>
      <span style="font-size:.64rem;color:var(--txt3)">🥈 50%</span>
      <span style="font-size:.64rem;color:var(--txt3)">🥇 75%</span>
      <span style="font-size:.64rem;color:var(--txt3)">🏆 90%</span>
    </div>
    ${missingHtml}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   BOOST TIPS (foydalanuvchiga maslahat)
   ══════════════════════════════════════════════════════════════ */
function getBoostTips(sc, posts) {
  const tips = [];
  const pct  = schoolCompleteness(sc);
  const thirtyDaysAgo = Date.now() - 30 * 86_400_000;
  const recent = posts.filter(p => new Date(p.createdAt||0).getTime() > thirtyDaysAgo);
  const withImages  = posts.filter(p => p.imageUrl && p.imageUrl.length > 4);
  const totalLikes  = posts.reduce((s, p) => s + (p.likes||0), 0);

  if (pct < 50)  tips.push({ icon: '📋', text: 'Profilni to\'ldiring (hozir ' + pct + '%) — obro\'ingiz 2x oshadi', priority: 'high' });
  if (!sc.logoUrl) tips.push({ icon: '🖼️', text: 'Maktab logotipini yuklang — ko\'rinish +10 ball', priority: 'high' });
  if (!sc.about)   tips.push({ icon: '📝', text: '"Maktab haqida" bo\'limini to\'ldiring — qidiruv da ko\'rinadi', priority: 'high' });
  if (recent.length < 2)  tips.push({ icon: '📣', text: 'Haftasiga 2+ yangilik joylashtiring — faollik bali +25', priority: 'medium' });
  if (withImages.length / Math.max(posts.length, 1) < 0.4) tips.push({ icon: '📷', text: 'Rasmsiz postlarga rasm qo\'shing — har biri +4 ball', priority: 'medium' });
  if (totalLikes < 10)     tips.push({ icon: '❤️', text: 'Yangilik havolasini ijtimoiy tarmoqlarda ulashing — like bali +3 / ta', priority: 'medium' });
  if (recent.length >= 5 && pct >= 75) tips.push({ icon: '🚀', text: 'Ajoyib! Siz trending pozitsiyangizni mustahkamlashingiz mumkin', priority: 'low' });
  if (posts.some(p => (p.comments||[]).length === 0)) tips.push({ icon: '💬', text: 'Izoh qoldiring — boshqalarning postlariga izoh joylash ham o\'zingizni ko\'rsatadi', priority: 'low' });

  return tips.slice(0, 4);  // faqat eng muhim 4 ta maslahat
}

/* ══════════════════════════════════════════════════════════════
   TRENDING BADGE (post karta uchun)
   ══════════════════════════════════════════════════════════════ */

/**
 * Post trend holat belgisini qaytaradi.
 * @param {object} post
 * @param {number} rank – umumiy reytingdagi o'rin (0-indexed)
 * @returns {string} HTML badge yoki ''
 */
function trendBadge(post, rank) {
  const ageHour = (Date.now() - new Date(post.createdAt || 0).getTime()) / 3_600_000;
  const likes   = post.likes || 0;
  const views   = post.views || 0;

  if (rank === 0)                                   return '<span class="trend-badge hot">🔥 TREND #1</span>';
  if (rank <= 2)                                    return '<span class="trend-badge hot">🔥 TOP 3</span>';
  if (ageHour <= 24 && (likes >= 10 || views >= 50)) return '<span class="trend-badge new">⚡ YUKSALMOQDA</span>';
  if (ageHour <= 6)                                 return '<span class="trend-badge new">🆕 YANGI</span>';
  if (rank <= 9)                                    return '<span class="trend-badge rising">📈 TOP 10</span>';
  return '';
}

/* ══════════════════════════════════════════════════════════════
   MINI LEADERBOARD WIDGET (sidebar / section uchun HTML)
   ══════════════════════════════════════════════════════════════ */
function renderMiniLeaderboard() {
  const board = getSchoolLeaderboard().slice(0, 5);
  if (!board.length) return '';

  const rows = board.map((item, i) => {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    const medal  = medals[i] || `${i+1}.`;
    const bar    = Math.round(item.repScore);
    const color  = item.completeness >= 80 ? 'var(--green)' :
                   item.completeness >= 50 ? 'var(--gold)'  : 'var(--red)';
    return `
    <div class="lb-row" data-school-id="${esc(item.school.id)}">
      <div class="lb-rank">${medal}</div>
      <div class="lb-info">
        <div class="lb-name">${esc(item.school.shortName)}</div>
        <div class="lb-bar-wrap">
          <div class="lb-bar-fill" style="width:${bar}%;background:${color}"></div>
        </div>
      </div>
      <div class="lb-score" style="color:${color}">${bar}</div>
    </div>`;
  }).join('');

  return `
  <div class="leaderboard-widget">
    <div class="lb-header">
      <span class="lb-title">◈ MAKTAB REYTINGI</span>
      <a href="schools.html" class="lb-more">Hammasi →</a>
    </div>
    ${rows}
    <div class="lb-footer">
      <span>Obro' bali = faollik + profil + like + ko'rishlar</span>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   TRENDING FEED SECTION (bosh sahifa uchun HTML block)
   ══════════════════════════════════════════════════════════════ */
function renderTrendingSection(maxPosts) {
  maxPosts = maxPosts || 6;
  const trending = sortPosts(getPosts(), 'trending').slice(0, maxPosts);
  if (!trending.length) return '<div class="empty-state"><div class="empty-icon">📭</div><h3>YANGILIK YO\'Q</h3></div>';

  return trending.map((p, i) => {
    const badge = trendBadge(p, i);
    return renderCardWithBadge(p, i * 0.06, badge);
  }).join('');
}

/* ══════════════════════════════════════════════════════════════
   renderCard WITH TREND BADGE (renderCard extends)
   ══════════════════════════════════════════════════════════════ */
function renderCardWithBadge(p, delay, badge) {
  const liked  = getLiked().includes(p.id);
  const s      = getSession();
  const canEdit= s && (s.role === 'superadmin' || p.authorId === s.id || (s.role === 'school_admin' && p.schoolId === s.schoolId));
  const school = p.schoolId ? getSchoolById(p.schoolId) : null;
  const catMap = {yangilik:'📣',tadbir:'🎉',sport:'⚽',fan:'🔬',madaniyat:'🎭'};
  const catTagMap = {yangilik:'📣 Yangilik',tadbir:'🎉 Tadbir',sport:'⚽ Sport',fan:'🔬 Fan',madaniyat:'🎭 Madaniyat'};

  return `
  <div class="post-card${badge ? ' has-trend' : ''}" style="animation-delay:${delay}s" data-post-id="${esc(p.id)}">
    ${badge ? `<div class="card-trend-ribbon">${badge}</div>` : ''}
    ${p.imageUrl
      ? `<img src="${esc(p.imageUrl)}" class="pc-img" alt="${esc(p.title)}" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="pc-placeholder">${catMap[p.category]||'📰'}</div>`}
    <div class="pc-body">
      <div class="pc-meta">
        <span class="tag tag-${esc(p.category)}">${catTagMap[p.category]||p.category}</span>
        ${school ? `<a href="school.html?id=${encodeURIComponent(school.id)}" class="school-badge-mini" data-prevent-card-click>🏫 ${esc(school.shortName)}</a>` : ''}
        ${p.pinned ? '<span class="pin-badge">📌 MUHIM</span>' : ''}
      </div>
      <div class="pc-title" data-post-id="${esc(p.id)}" role="button" tabindex="0">${esc(p.title)}</div>
      <div class="pc-excerpt">${esc(p.excerpt)}</div>
      <div class="pc-footer">
        <div class="pc-author">
          <div class="avatar-sm">${initials(p.authorName)}</div>
          <div>
            <div style="font-size:.75rem;color:var(--txt2);font-weight:600">${esc(p.authorName)}</div>
            <div style="font-size:.68rem;color:var(--txt3)">${timeAgo(p.createdAt)}</div>
          </div>
        </div>
        <div class="pc-actions">
          <button class="like-btn${liked?' liked':''}" data-like-id="${esc(p.id)}" aria-label="Like" aria-pressed="${liked}">${liked?'❤️':'🤍'} ${p.likes||0}</button>
          <span style="font-size:.7rem;color:var(--txt3)">👁 ${p.views||0}</span>
          <span style="font-size:.7rem;color:var(--txt3)">💬 ${(p.comments||[]).length}</span>
          ${canEdit ? `<button class="icon-btn danger-hover" data-delete-id="${esc(p.id)}" aria-label="O'chirish" title="O'chirish">🗑</button>` : ''}
          <button class="read-btn" data-post-id="${esc(p.id)}">◈ Ko'rish</button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   renderCard (platform.js'dagi renderCard ni almashtiradi)
   ══════════════════════════════════════════════════════════════ */
function renderCard(p, delay) {
  return renderCardWithBadge(p, delay, '');
}

/* ══════════════════════════════════════════════════════════════
   SCHOOL CARD WITH RANK (schools.html uchun)
   ══════════════════════════════════════════════════════════════ */
function renderSchoolCardRanked(sc, rank, delay) {
  const allPosts = getPosts().filter(p => p.schoolId === sc.id);
  const repScore = Math.round(schoolRepScore(sc, allPosts));
  const completeness = schoolCompleteness(sc);
  const color = sc.coverColor || '#00d4ff';
  const repColor = completeness >= 80 ? 'var(--green)' :
                   completeness >= 50 ? 'var(--gold)'  : 'var(--red)';
  const medals = ['🥇','🥈','🥉'];
  const rankBadge = rank < 3
    ? `<span style="font-size:1rem" aria-label="${rank+1}-o'rin">${medals[rank]}</span>`
    : `<span style="font-family:var(--font-hud);font-size:.65rem;color:var(--txt3)">#${rank+1}</span>`;

  const logoHtml = sc.logoUrl
    ? `<img src="${esc(sc.logoUrl)}" class="sc-logo" alt="${esc(sc.shortName)} logotipi" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="sc-logo-fallback" style="display:none">${esc(sc.shortName.slice(0,2).toUpperCase())}</div>`
    : `<div class="sc-logo-fallback">${esc(sc.shortName.slice(0,2).toUpperCase())}</div>`;

  return `
  <div class="school-card" data-school-id="${esc(sc.id)}" style="animation-delay:${delay||0}s;--sc-color:${esc(color)}" role="button" tabindex="0" aria-label="${esc(sc.shortName)} — profil">
    <div class="sc-header">
      <div class="sc-logo-wrap">${logoHtml}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
          ${rankBadge}
          <div class="sc-name">${esc(sc.shortName)}</div>
          ${sc.verified ? '<span title="Tasdiqlangan" style="font-size:.9rem">✅</span>' : ''}
        </div>
        <div class="sc-region">${esc(sc.region)} · ${esc(sc.district||'')}</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:.5rem">
      <div class="sc-type-badge" style="margin-bottom:0">${esc(schoolTypeName(sc.type))}</div>
    </div>

    <!-- Completeness bar mini -->
    <div style="margin-bottom:.8rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
        <span style="font-size:.65rem;color:var(--txt3);font-family:var(--font-hud);letter-spacing:.05em">PROFIL TO'LDIRILGANLIK</span>
        <span style="font-size:.72rem;font-weight:700;color:${repColor}">${completeness}%</span>
      </div>
      <div style="height:3px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${completeness}%;background:linear-gradient(90deg,${repColor},${repColor}aa);border-radius:99px;transition:width .6s var(--ease)"></div>
      </div>
    </div>

    <div class="sc-stats">
      <div class="sc-stat"><div class="sc-stat-n">${sc.students||'—'}</div><div class="sc-stat-l">O'quvchi</div></div>
      <div class="sc-stat"><div class="sc-stat-n">${allPosts.length}</div><div class="sc-stat-l">Yangilik</div></div>
      <div class="sc-stat">
        <div class="sc-stat-n" style="color:${repColor}">${repScore}</div>
        <div class="sc-stat-l">Obro'</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;margin-top:.8rem;padding-top:.8rem;border-top:1px solid var(--border)">
      <button class="btn btn-ghost btn-sm" data-goto-profile="${esc(sc.id)}" style="flex:1;justify-content:center">◈ Profil</button>
      <button class="btn btn-ghost btn-sm" data-goto-news="${esc(sc.id)}" style="flex:1;justify-content:center">◈ Yangiliklar</button>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   EVENT DELEGATION for cards (setupCardDelegation)
   Called after rendering cards into a container
   ══════════════════════════════════════════════════════════════ */
function setupCardDelegation(container) {
  if (!container || container._rankingDelegated) return;
  container._rankingDelegated = true;

  container.addEventListener('click', function(e) {
    /* School badge — navigate to school page */
    const schoolBadge = e.target.closest('[data-prevent-card-click]');
    if (schoolBadge) return;

    /* Like button */
    const likeBtn = e.target.closest('[data-like-id]');
    if (likeBtn) {
      e.stopPropagation();
      toggleLike(likeBtn.dataset.likeId);
      return;
    }

    /* Delete button */
    const delBtn = e.target.closest('[data-delete-id]');
    if (delBtn) {
      e.stopPropagation();
      deletePost(delBtn.dataset.deleteId);
      return;
    }

    /* Read / title click → open post */
    const readBtn   = e.target.closest('.read-btn');
    const titleEl   = e.target.closest('.pc-title[data-post-id]');
    const postId    = (readBtn || titleEl)?.dataset?.postId;
    if (postId) {
      viewPost(postId);
      return;
    }
  });

  /* Keyboard access for title */
  container.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const titleEl = e.target.closest('.pc-title[data-post-id]');
    if (titleEl) { e.preventDefault(); viewPost(titleEl.dataset.postId); }
  });
}

/* ══════════════════════════════════════════════════════════════
   CSS injected for ranking-specific elements (runtime)
   ══════════════════════════════════════════════════════════════ */
(function injectRankingCSS() {
  if (document.getElementById('rankingStyle')) return;
  const style = document.createElement('style');
  style.id = 'rankingStyle';
  style.textContent = `
    /* ── Trend badges ── */
    .trend-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px;
      font-family: var(--font-hud); font-size: .65rem; font-weight: 800;
      letter-spacing: .06em; border-radius: var(--r-xs);
      border: 1px solid;
    }
    .trend-badge.hot {
      color: #ff6b35; border-color: rgba(255,107,53,.4); background: rgba(255,107,53,.1);
      text-shadow: 0 0 8px rgba(255,107,53,.5);
      animation: trendPulse 2s infinite;
    }
    .trend-badge.new {
      color: var(--green); border-color: rgba(0,255,136,.3); background: rgba(0,255,136,.07);
    }
    .trend-badge.rising {
      color: var(--cyan); border-color: var(--border2); background: var(--bg-glass);
    }
    @keyframes trendPulse {
      0%,100% { box-shadow: 0 0 4px rgba(255,107,53,.3); }
      50%      { box-shadow: 0 0 12px rgba(255,107,53,.6); }
    }

    .card-trend-ribbon {
      position: absolute; top: 10px; right: 10px; z-index: 3;
    }
    .post-card.has-trend { overflow: visible; }

    /* ── Completeness bar ── */
    .completeness-card {
      background: rgba(0,212,255,.04); border: 1px solid var(--border2);
      border-radius: var(--r); padding: 1.2rem 1.4rem; margin-bottom: 1.5rem;
      position: relative; overflow: hidden;
    }
    .completeness-card::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
      background: linear-gradient(180deg, var(--cyan), var(--blue));
      box-shadow: 0 0 8px rgba(0,212,255,.4);
    }
    .completeness-bar-outer {
      height: 6px; background: rgba(255,255,255,.07);
      border-radius: 99px; overflow: visible; position: relative; margin: .4rem 0;
    }
    .completeness-bar-fill {
      height: 100%; border-radius: 99px;
      transition: width .8s cubic-bezier(.4,0,.2,1);
      position: relative;
    }
    .completeness-bar-fill::after {
      content: ''; position: absolute; right: -4px; top: -3px;
      width: 12px; height: 12px; border-radius: 50%;
      background: inherit; box-shadow: 0 0 8px currentColor;
    }
    .cb-marker {
      position: absolute; top: -3px; width: 2px; height: 12px;
      background: rgba(255,255,255,.15); border-radius: 1px; transform: translateX(-50%);
    }

    /* ── Boost tips ── */
    .boost-tips { display: flex; flex-direction: column; gap: .6rem; margin-top: 1rem; }
    .boost-tip {
      display: flex; align-items: flex-start; gap: 10px;
      padding: .7rem .9rem;
      background: rgba(0,212,255,.03); border: 1px solid var(--border);
      border-radius: var(--r-xs); transition: all var(--t);
    }
    .boost-tip:hover { border-color: var(--border2); background: rgba(0,212,255,.06); }
    .boost-tip.high   { border-left: 2px solid var(--red);   }
    .boost-tip.medium { border-left: 2px solid var(--gold);  }
    .boost-tip.low    { border-left: 2px solid var(--green); }
    .boost-tip-icon   { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
    .boost-tip-text   { font-size: .8rem; color: var(--txt2); line-height: 1.5; }

    /* ── Mini Leaderboard ── */
    .leaderboard-widget {
      background: var(--bg-card); border: 1px solid var(--border2);
      border-radius: var(--r); overflow: hidden;
    }
    .lb-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: .9rem 1.1rem; border-bottom: 1px solid var(--border);
      background: rgba(0,212,255,.04);
    }
    .lb-title { font-family: var(--font-hud); font-size: .72rem; font-weight: 700; color: var(--cyan); letter-spacing: .08em; }
    .lb-more  { font-family: var(--font-hud); font-size: .65rem; color: var(--txt3); text-decoration: none; transition: color var(--t); }
    .lb-more:hover { color: var(--cyan); }
    .lb-row {
      display: flex; align-items: center; gap: 10px;
      padding: .75rem 1.1rem; border-bottom: 1px solid var(--border);
      cursor: pointer; transition: all var(--t);
    }
    .lb-row:last-of-type { border-bottom: none; }
    .lb-row:hover { background: rgba(0,212,255,.05); }
    .lb-rank  { width: 20px; text-align: center; font-size: .95rem; flex-shrink: 0; }
    .lb-info  { flex: 1; min-width: 0; }
    .lb-name  { font-size: .82rem; font-weight: 700; color: var(--txt); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-hud); letter-spacing: .03em; }
    .lb-bar-wrap { height: 3px; background: rgba(255,255,255,.08); border-radius: 99px; margin-top: 4px; }
    .lb-bar-fill { height: 100%; border-radius: 99px; transition: width .6s var(--ease); }
    .lb-score { font-family: var(--font-hud); font-size: .85rem; font-weight: 800; flex-shrink: 0; }
    .lb-footer { padding: .6rem 1.1rem; font-size: .65rem; color: var(--txt3); background: rgba(0,0,0,.2); text-align: center; }

    /* ── School leaderboard page ── */
    .school-rep-bar {
      height: 4px; background: rgba(255,255,255,.07); border-radius: 99px; overflow: hidden; margin-top: 4px;
    }
    .school-rep-fill { height: 100%; border-radius: 99px; transition: width .8s var(--ease); }

    /* ── Sort bar ── */
    .sort-bar {
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .sort-label { font-family: var(--font-hud); font-size: .65rem; color: var(--txt3); letter-spacing: .08em; white-space: nowrap; }
  `;
  document.head.appendChild(style);
})();
