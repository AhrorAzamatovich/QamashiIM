/* ================================================================
   O'ZBEKISTON MAKTABLARI PLATFORMASI — platform.js v5
   Multi-school social news platform
   localStorage-based (no backend required)
   Bugs fixed:
     - Auth tabs 3-col layout conflict resolved
     - renderCard() uses data-attributes, no inline onclick injections
     - XSS-safe: all user data escaped via esc()
     - doRegisterSchool() updates school select after creation
     - updateSession() for live session refresh
     - No loading state stuck on empty data
     - buildNavAuth() always runs after DOM ready
     - 404 redirect on unknown school IDs handled here + school.html
   ================================================================ */
'use strict';

// ── Storage Keys ────────────────────────────────────────────────
const SK = {
  schools: 'edu_schools',
  users:   'edu_users',
  posts:   'edu_posts',
  session: 'edu_session',
  liked:   'edu_liked',
};

// ── Storage Helpers ─────────────────────────────────────────────
function getSchools()  { try { return JSON.parse(localStorage.getItem(SK.schools)  || '[]'); } catch { return []; } }
function getUsers()    { try { return JSON.parse(localStorage.getItem(SK.users)    || '[]'); } catch { return []; } }
function getPosts()    { try { return JSON.parse(localStorage.getItem(SK.posts)    || '[]'); } catch { return []; } }
function getSession()  { try { return JSON.parse(localStorage.getItem(SK.session)  || 'null'); } catch { return null; } }
function getLiked()    { try { return JSON.parse(localStorage.getItem(SK.liked)    || '[]'); } catch { return []; } }

function saveSchools(d) { localStorage.setItem(SK.schools, JSON.stringify(d)); }
function saveUsers(d)   { localStorage.setItem(SK.users,   JSON.stringify(d)); }
function savePosts(d)   { localStorage.setItem(SK.posts,   JSON.stringify(d)); }
function saveSession(d) { localStorage.setItem(SK.session, JSON.stringify(d)); }
function saveLiked(d)   { localStorage.setItem(SK.liked,   JSON.stringify(d)); }
function clearSession() { localStorage.removeItem(SK.session); }

/** Re-read current session from users store and save updated copy. */
function updateSession() {
  const s = getSession();
  if (!s) return;
  const found = getUsers().find(u => u.id === s.id);
  if (found) saveSession(found);
}

// ── ID generator ────────────────────────────────────────────────
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Seed: Initial Data ──────────────────────────────────────────
(function seedAll() {
  if (!getSchools().length) {
    saveSchools([
      {
        id: 'school_qim',
        name: "Qamashi Ixtisoslashtirilgan Maktabi",
        shortName: 'Qamashi IM',
        region: 'Qashqadaryo viloyati',
        district: 'Qamashi tumani',
        type: 'ixtisoslashtirilgan',
        students: 264, teachers: 46, classes: 11,
        founded: 2023,
        about: "Qamashi tumani ixtisoslashtirilgan maktabi 2023-yilda tashkil topgan. Matematika, fizika, kimyo va biologiya fanlarini chuqur o'qitish asosiy yo'nalish.",
        email: 'info@qamashiim.uz',
        phone: '+998 90 123 45 67',
        address: 'Qashqadaryo viloyati, Qamashi tumani',
        logoUrl: 'images/logo.jpg',
        coverColor: '#00d4ff',
        verified: true,
        createdAt: '2023-09-01T00:00:00.000Z',
      },
      {
        id: 'school_tash1',
        name: "1-sonli Toshkent Ixtisoslashtirilgan Maktabi",
        shortName: 'Toshkent IM-1',
        region: 'Toshkent shahri',
        district: "Mirzo Ulug'bek tumani",
        type: 'ixtisoslashtirilgan',
        students: 580, teachers: 72, classes: 18,
        founded: 1995,
        about: "Toshkent shahrining eng yirik ixtisoslashtirilgan maktablaridan biri. Fizika va matematika yo'nalishi.",
        email: 'info@tashim1.uz',
        phone: '+998 71 234 56 78',
        address: "Toshkent shahri, Mirzo Ulug'bek tumani",
        logoUrl: '', coverColor: '#7c3aed', verified: true,
        createdAt: '2024-01-15T00:00:00.000Z',
      },
      {
        id: 'school_sam',
        name: 'Samarqand Prezident Maktabi',
        shortName: 'Samarqand PM',
        region: 'Samarqand viloyati',
        district: 'Samarqand shahri',
        type: 'prezident',
        students: 320, teachers: 58, classes: 14,
        founded: 2020,
        about: "Samarqand viloyatidagi Prezident maktabi. Chuqurlashtirilgan ta'lim va zamonaviy yondashuv.",
        email: 'info@sampm.uz',
        phone: '+998 66 345 67 89',
        address: 'Samarqand shahri, Markaz',
        logoUrl: '', coverColor: '#10b981', verified: true,
        createdAt: '2024-03-10T00:00:00.000Z',
      },
    ]);
  }

  if (!getUsers().length) {
    saveUsers([
      {
        id: 'u_admin_qim',
        firstName: 'Ahror', lastName: 'Azamatov',
        username: 'admin', password: 'admin123',
        role: 'school_admin', schoolId: 'school_qim',
        joinedAt: '2023-09-01T00:00:00.000Z',
        bio: 'Qamashi IM sayt administratori',
      },
      {
        id: 'u_admin_tash',
        firstName: 'Sardor', lastName: 'Toshmatov',
        username: 'tash_admin', password: 'admin123',
        role: 'school_admin', schoolId: 'school_tash1',
        joinedAt: '2024-01-15T00:00:00.000Z',
        bio: 'Toshkent IM-1 administratori',
      },
      {
        id: 'u_superadmin',
        firstName: 'Platform', lastName: 'Admin',
        username: 'superadmin', password: 'super123',
        role: 'superadmin', schoolId: null,
        joinedAt: '2023-01-01T00:00:00.000Z',
        bio: "O'zbekiston Maktablari Platformasi bosh admini",
      },
    ]);
  }

  if (!getPosts().length) {
    savePosts([
      {
        id: 'post_q1',
        title: "Zakovat intellektual musobaqasi g'oliblar bilan yakunlandi",
        excerpt: "Maktabimizda bo'lib o'tgan Zakovat musobaqasida 8-11-sinf o'quvchilari o'z bilimlarini sinab ko'rdi.",
        body: "Qamashi tumani ixtisoslashtirilgan maktabida an'anaviy Zakovat intellektual musobaqasi bo'lib o'tdi.\n\nMusobaqada 8-, 9-, 10- va 11-sinf jamoalari ishtirok etdi. Har bir sinf 4 nafar eng bilimli o'quvchisini sahna sari jo'natdi.\n\nMusobaqa 3 bosqichdan iborat bo'lib, oxirgi savolga 11-sinf jamoasi to'g'ri javob berib birinchi o'ringa chiqdi.\n\nG'olib jamoa va alohida faol ishtirokchilar diplom va sovg'alar bilan taqdirlandi.",
        category: 'tadbir', imageUrl: '',
        schoolId: 'school_qim', schoolName: 'Qamashi IM',
        authorId: 'u_admin_qim', authorName: 'Ahror Azamatov', authorRole: 'school_admin',
        createdAt: '2025-10-15T09:00:00.000Z', likes: 31, views: 204, comments: [], pinned: true,
      },
      {
        id: 'post_q2',
        title: "Viloyat matematika olimpiadasida g'olib bo'ldik",
        excerpt: "O'quvchilarimiz viloyat matematika olimpiadasida 1- va 2-o'rinlarni qo'lga kiritdi.",
        body: "Qashqadaryo viloyati bo'yicha o'tkazilgan matematika olimpiadasida maktabimiz o'quvchilari yuqori natijalarni qo'lga kiritdi.\n\n9-sinf o'quvchisi Sardor Yusupov I-o'rinni, 10-sinf o'quvchisi Dildora Toshmatova II-o'rinni egalladi.\n\nIkkala o'quvchi respublika bosqichiga tavsiya etildi.",
        category: 'fan', imageUrl: '',
        schoolId: 'school_qim', schoolName: 'Qamashi IM',
        authorId: 'u_admin_qim', authorName: 'Ahror Azamatov', authorRole: 'school_admin',
        createdAt: '2025-09-28T10:30:00.000Z', likes: 52, views: 318, comments: [], pinned: false,
      },
      {
        id: 'post_t1',
        title: "Fizika fanidan respublika olimpiadasi g'olibi",
        excerpt: "Maktabimiz o'quvchisi respublika fizika olimpiadasida oltin medal qo'lga kiritdi.",
        body: "Toshkent shahrida bo'lib o'tgan respublika fizika olimpiadasida 11-sinf o'quvchimiz Asilbek Normatov oltin medal qo'lga kiritdi.\n\nUning natijasi respublika bo'yicha eng yuqori ball bo'ldi. Bu maktabimiz uchun tarixiy yutuq hisoblanadi.\n\nAsilbek xalqaro olimpiadaga tavsiya etildi.",
        category: 'fan', imageUrl: '',
        schoolId: 'school_tash1', schoolName: 'Toshkent IM-1',
        authorId: 'u_admin_tash', authorName: 'Sardor Toshmatov', authorRole: 'school_admin',
        createdAt: '2025-10-20T11:00:00.000Z', likes: 89, views: 542, comments: [], pinned: true,
      },
      {
        id: 'post_q3',
        title: "Maktablararo futbol turniri: g'olib bizning jamoamiz!",
        excerpt: "Qamashi tumanidagi maktablararo futbol turnirida o'quvchilarimiz birinchi o'rinni qo'lga kiritdi.",
        body: "Qamashi tumanidagi o'rta maktablar o'rtasida o'tkazilgan futbol turniriga maktabimiz ham jamoasi bilan qatnashdi.\n\nFinal o'yinida 3:1 hisobida g'alaba qozonib, birinchi o'rinni egalladi.\n\nJamoa kapitani Jasur Xolmatov musobaqa eng yaxshi o'yinchisi deb topildi.",
        category: 'sport', imageUrl: '',
        schoolId: 'school_qim', schoolName: 'Qamashi IM',
        authorId: 'u_admin_qim', authorName: 'Ahror Azamatov', authorRole: 'school_admin',
        createdAt: '2025-09-20T14:00:00.000Z', likes: 67, views: 421, comments: [], pinned: false,
      },
      {
        id: 'post_s1',
        title: "Samarqand PM o'quvchilari xalqaro konferensiyada",
        excerpt: "Maktabimiz o'quvchilari Turkiyadagi xalqaro ilmiy konferensiyada ishtirok etdi.",
        body: "Samarqand Prezident Maktabi o'quvchilari Istanbulda bo'lib o'tgan xalqaro ilmiy konferensiyada ishtirok etdi.\n\n5 nafar o'quvchimiz o'z ilmiy ishlarini taqdim etdi. Ikki nafar o'quvchi maxsus diplom bilan taqdirlandi.",
        category: 'fan', imageUrl: '',
        schoolId: 'school_sam', schoolName: 'Samarqand PM',
        authorId: 'u_superadmin', authorName: 'Platform Admin', authorRole: 'superadmin',
        createdAt: '2025-10-05T08:00:00.000Z', likes: 44, views: 287, comments: [], pinned: false,
      },
      {
        id: 'post_t2',
        title: "Yangi o'quv yili — yangi imkoniyatlar!",
        excerpt: "2025-2026 o'quv yilida maktabimizda 50 ta yangi o'quvchi ta'lim olishni boshladi.",
        body: "Yangi o'quv yilining boshlanishi munosabati bilan maktabimizda tantanali marosim o'tkazildi.\n\n50 nafar yangi o'quvchi maktab oilasiga qo'shildi. Ularning barchasi qabul imtihonlaridan a'lo natijalar bilan o'tdi.",
        category: 'yangilik', imageUrl: '',
        schoolId: 'school_tash1', schoolName: 'Toshkent IM-1',
        authorId: 'u_admin_tash', authorName: 'Sardor Toshmatov', authorRole: 'school_admin',
        createdAt: '2025-09-02T09:00:00.000Z', likes: 35, views: 198, comments: [], pinned: false,
      },
    ]);
  }
})();

// ── Helpers ──────────────────────────────────────────────────────

/** HTML-escape user-supplied text. Always returns a string. */
function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function fmtDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const mo = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
    return `${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()}`;
  } catch { return ''; }
}

function fmtDateShort(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const mo = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];
    return `${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()}`;
  } catch { return ''; }
}

function timeAgo(iso) {
  try {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return 'Hozirgina';
    if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} kun oldin`;
    return fmtDateShort(iso);
  } catch { return ''; }
}

function initials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '')).toUpperCase() || '?';
}

function roleName(r) {
  const map = {
    superadmin: 'Super Admin',
    school_admin: 'Maktab Admini',
    teacher: "O'qituvchi",
    student: "O'quvchi",
    parent: 'Ota-ona',
    staff: 'Xodim',
  };
  return map[r] || r || '';
}

function catLabel(c) {
  const map = { yangilik: '📣 Yangilik', tadbir: '🎉 Tadbir', sport: '⚽ Sport', fan: '🔬 Fan', madaniyat: '🎭 Madaniyat' };
  return map[c] || c || '';
}

function schoolTypeName(t) {
  const map = { umumiy: "Umumta'lim", ixtisoslashtirilgan: 'Ixtisoslashtirilgan', prezident: 'Prezident Maktabi', innovatsion: 'Innovatsion' };
  return map[t] || t || '';
}

function schoolTypeColor(t) {
  const map = { umumiy: '#00d4ff', ixtisoslashtirilgan: '#ffa500', prezident: '#7c3aed', innovatsion: '#10b981' };
  return map[t] || '#00d4ff';
}

function getSchoolById(id) {
  if (!id) return null;
  return getSchools().find(s => s.id === id) || null;
}

// ── Toast ─────────────────────────────────────────────────────────
function toast(msg, type) {
  type = type || 'info';
  let root = document.getElementById('toastRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toastRoot';
    document.body.appendChild(root);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.setAttribute('role', 'alert');
  el.setAttribute('aria-live', 'polite');
  // Use textContent for message to prevent XSS
  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast-icon';
  iconSpan.textContent = icons[type] || 'ℹ️';
  const msgSpan = document.createElement('span');
  msgSpan.className = 'toast-msg';
  msgSpan.textContent = msg;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-x';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Yopish');
  closeBtn.addEventListener('click', () => el.remove());
  el.appendChild(iconSpan);
  el.appendChild(msgSpan);
  el.appendChild(closeBtn);
  root.prepend(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 4500);
}

// ── Overlay helpers ──────────────────────────────────────────────
function showOverlay(id) {
  const o = document.getElementById(id);
  if (o) { o.classList.add('show'); document.body.style.overflow = 'hidden'; }
}
function hideOverlay(id) {
  const o = document.getElementById(id);
  if (o) { o.classList.remove('show'); document.body.style.overflow = ''; }
}
function closeAllOverlays() {
  document.querySelectorAll('.overlay.show').forEach(o => o.classList.remove('show'));
  document.body.style.overflow = '';
}

// Close overlay on backdrop click
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('overlay')) closeAllOverlays();
});
// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeAllOverlays();
});

// ── Nav Auth ─────────────────────────────────────────────────────
function buildNavAuth() {
  const wrap = document.getElementById('navAuth');
  if (!wrap) return;
  const s = getSession();
  if (s) {
    const school = s.schoolId ? getSchoolById(s.schoolId) : null;
    const ini = initials(s.firstName + ' ' + s.lastName);
    wrap.innerHTML = `
      <button class="btn btn-success btn-sm" id="writePostBtn">◈ Yangilik yozish</button>
      <div class="dropdown" id="userDd">
        <div class="user-pill" id="userPillBtn" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">
          <div class="avatar" aria-hidden="true">${esc(ini)}</div>
          <span class="name">${esc(s.firstName)}</span>
          <span class="chevron" aria-hidden="true">▼</span>
        </div>
        <div class="dropdown-menu" role="menu">
          <div class="dd-user">
            <div class="dd-user-name">${esc(s.firstName + ' ' + s.lastName)}</div>
            <div class="dd-user-sub">@${esc(s.username)} · ${esc(roleName(s.role))}</div>
            ${school ? `<div class="dd-school-badge">◈ ${esc(school.shortName)}</div>` : ''}
          </div>
          <button class="dropdown-item" id="ddProfileBtn" role="menuitem"><span class="di-icon" aria-hidden="true">👤</span>Profilim</button>
          <button class="dropdown-item" id="ddWriteBtn" role="menuitem"><span class="di-icon" aria-hidden="true">◈</span>Yangilik yozish</button>
          ${school ? `<button class="dropdown-item" id="ddSchoolBtn" role="menuitem" data-school-id="${esc(school.id)}"><span class="di-icon" aria-hidden="true">🏫</span>Maktabim</button>` : ''}
          <div class="dropdown-divider" role="separator"></div>
          <button class="dropdown-item danger" id="ddLogoutBtn" role="menuitem"><span class="di-icon" aria-hidden="true">🚪</span>Chiqish</button>
        </div>
      </div>`;

    // Event listeners — no inline onclick
    document.getElementById('writePostBtn')?.addEventListener('click', () => openPostEditor());
    document.getElementById('userPillBtn')?.addEventListener('click', toggleDd);
    document.getElementById('userPillBtn')?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDd(); } });
    document.getElementById('ddProfileBtn')?.addEventListener('click', () => { closeDd(); openProfile(); });
    document.getElementById('ddWriteBtn')?.addEventListener('click', () => { closeDd(); openPostEditor(); });
    document.getElementById('ddSchoolBtn')?.addEventListener('click', function() {
      closeDd();
      const id = this.dataset.schoolId;
      if (id) location.href = 'school.html?id=' + encodeURIComponent(id);
    });
    document.getElementById('ddLogoutBtn')?.addEventListener('click', () => { closeDd(); doLogout(); });
  } else {
    wrap.innerHTML = `
      <button class="btn btn-ghost btn-sm" id="navLoginBtn">Kirish</button>
      <button class="btn btn-primary btn-sm" id="navRegBtn">Ro'yxatdan o'tish</button>`;
    document.getElementById('navLoginBtn')?.addEventListener('click', () => openAuth('login'));
    document.getElementById('navRegBtn')?.addEventListener('click', () => openAuth('register'));
  }

  // Update write banner (safe: run after navAuth is built)
  const wb = document.getElementById('writeBanner');
  if (wb) wb.style.display = s ? 'flex' : 'none';
}

function toggleDd() {
  const d = document.getElementById('userDd');
  if (!d) return;
  const isOpen = d.classList.toggle('open');
  const pill = document.getElementById('userPillBtn');
  if (pill) pill.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
function closeDd() {
  const d = document.getElementById('userDd');
  if (d) { d.classList.remove('open'); }
  const pill = document.getElementById('userPillBtn');
  if (pill) pill.setAttribute('aria-expanded', 'false');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const d = document.getElementById('userDd');
  if (d && !d.contains(e.target)) closeDd();
});

// ── Auth Modal ────────────────────────────────────────────────────
function openAuth(tab) {
  tab = tab || 'login';
  if (getSession()) { toast('Allaqachon tizimdasiz!', 'info'); return; }
  _createAuthModal();
  showOverlay('authOverlay');
  switchAuthTab(tab);
}

function _createAuthModal() {
  if (document.getElementById('authOverlay')) return;
  const o = document.createElement('div');
  o.className = 'overlay';
  o.id = 'authOverlay';
  o.setAttribute('role', 'dialog');
  o.setAttribute('aria-modal', 'true');
  o.setAttribute('aria-labelledby', 'authTitle');
  o.innerHTML = `
  <div class="modal auth-modal">
    <div class="modal-head">
      <h2 id="authTitle">◈ KIRISH</h2>
      <button class="close-btn" id="authCloseBtn" aria-label="Yopish">✕</button>
    </div>
    <div class="modal-body">
      <div class="auth-tabs" role="tablist" aria-label="Kirish usuli">
        <button class="auth-tab active" id="atLogin" role="tab" aria-selected="true" aria-controls="paneLogin">Kirish</button>
        <button class="auth-tab" id="atReg" role="tab" aria-selected="false" aria-controls="paneReg">Ro'yxat</button>
        <button class="auth-tab" id="atSchool" role="tab" aria-selected="false" aria-controls="paneSchool">Maktab</button>
      </div>

      <!-- LOGIN -->
      <div class="tab-pane active" id="paneLogin" role="tabpanel" aria-labelledby="atLogin">
        <div class="form-group">
          <label class="form-label req" for="liUser">USERNAME</label>
          <input class="form-control" id="liUser" type="text" placeholder="username" autocomplete="username">
        </div>
        <div class="form-group">
          <label class="form-label req" for="liPass">PAROL</label>
          <input class="form-control" id="liPass" type="password" placeholder="••••••" autocomplete="current-password">
        </div>
        <button class="btn btn-primary btn-block" id="doLoginBtn">◈ KIRISH</button>
        <div class="hint-box" style="margin-top:1rem">
          <p>Test: <code>admin</code> / <code>admin123</code> (Qamashi IM admini)</p>
          <p>Test: <code>tash_admin</code> / <code>admin123</code> (Toshkent IM-1 admini)</p>
          <p>Test: <code>superadmin</code> / <code>super123</code> (Platform admini)</p>
        </div>
      </div>

      <!-- REGISTER -->
      <div class="tab-pane" id="paneReg" role="tabpanel" aria-labelledby="atReg">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label req" for="rFname">ISM</label>
            <input class="form-control" id="rFname" type="text" placeholder="Ismingiz" autocomplete="given-name">
          </div>
          <div class="form-group">
            <label class="form-label req" for="rLname">FAMILIYA</label>
            <input class="form-control" id="rLname" type="text" placeholder="Familiyangiz" autocomplete="family-name">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label req" for="rUser">USERNAME</label>
          <input class="form-control" id="rUser" type="text" placeholder="username_99" autocomplete="username">
          <div class="form-hint">Faqat lotin harflari, raqamlar va _</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="rSchool">MAKTAB <span style="color:var(--txt3);font-weight:400;text-transform:none">(ixtiyoriy)</span></label>
          <select class="form-control" id="rSchool">
            <option value="">— Maktab tanlang —</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="rRole">ROL</label>
          <select class="form-control" id="rRole">
            <option value="student">🎓 O'quvchi</option>
            <option value="teacher">👨‍🏫 O'qituvchi</option>
            <option value="parent">👨‍👩‍👧 Ota-ona</option>
            <option value="staff">💼 Xodim</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label req" for="rPass">PAROL</label>
          <input class="form-control" id="rPass" type="password" placeholder="Kamida 6 belgi" autocomplete="new-password">
        </div>
        <button class="btn btn-success btn-block" id="doRegBtn">◈ RO'YXATDAN O'TISH</button>
      </div>

      <!-- REGISTER SCHOOL -->
      <div class="tab-pane" id="paneSchool" role="tabpanel" aria-labelledby="atSchool">
        <div class="hint-box" style="margin-bottom:1.2rem">
          <p>◈ Maktabingizni platformaga qo'shing va maktab nomidan yangiliklar joylashtiring</p>
        </div>
        <div class="form-group">
          <label class="form-label req" for="sName">MAKTAB NOMI</label>
          <input class="form-control" id="sName" type="text" placeholder="masalan: 45-sonli Umumta'lim Maktabi">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label req" for="sRegion">VILOYAT</label>
            <select class="form-control" id="sRegion">
              <option value="">Tanlang...</option>
              <option>Toshkent shahri</option><option>Toshkent viloyati</option>
              <option>Samarqand viloyati</option><option>Buxoro viloyati</option>
              <option>Qashqadaryo viloyati</option><option>Surxondaryo viloyati</option>
              <option>Farg'ona viloyati</option><option>Andijon viloyati</option>
              <option>Namangan viloyati</option><option>Xorazm viloyati</option>
              <option>Navoiy viloyati</option><option>Jizzax viloyati</option>
              <option>Sirdaryo viloyati</option><option>Qoraqalpog'iston</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label req" for="sDistrict">TUMAN / SHAHAR</label>
            <input class="form-control" id="sDistrict" type="text" placeholder="Tuman yoki shahar nomi">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="sType">MAKTAB TURI</label>
          <select class="form-control" id="sType">
            <option value="umumiy">Umumta'lim maktabi</option>
            <option value="ixtisoslashtirilgan">Ixtisoslashtirilgan maktab</option>
            <option value="prezident">Prezident Maktabi</option>
            <option value="innovatsion">Innovatsion maktab</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="sStudents">O'QUVCHILAR SONI</label>
            <input class="form-control" id="sStudents" type="number" placeholder="500" min="1">
          </div>
          <div class="form-group">
            <label class="form-label" for="sTeachers">HODIMLAR SONI</label>
            <input class="form-control" id="sTeachers" type="number" placeholder="50" min="1">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="sPhone">TELEFON</label>
          <input class="form-control" id="sPhone" type="tel" placeholder="+998 90 000 00 00">
        </div>
        <div class="form-group">
          <label class="form-label" for="sEmail">EMAIL</label>
          <input class="form-control" id="sEmail" type="email" placeholder="info@maktab.uz">
        </div>
        <div class="form-group">
          <label class="form-label req" for="sAddress">MANZIL</label>
          <input class="form-control" id="sAddress" type="text" placeholder="To'liq manzil">
        </div>
        <div class="form-group">
          <label class="form-label" for="sAbout">MAKTAB HAQIDA</label>
          <textarea class="form-control" id="sAbout" placeholder="Maktabingiz haqida qisqacha..." style="min-height:80px"></textarea>
        </div>
        <hr style="border-color:var(--border);margin:1.2rem 0">
        <p style="font-size:.78rem;color:var(--txt3);margin-bottom:1rem;font-family:var(--font-hud);letter-spacing:.04em">ADMIN HISOBI</p>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label req" for="saFname">ADMIN ISMI</label>
            <input class="form-control" id="saFname" type="text" placeholder="Ism">
          </div>
          <div class="form-group">
            <label class="form-label req" for="saLname">ADMIN FAMILIYASI</label>
            <input class="form-control" id="saLname" type="text" placeholder="Familiya">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label req" for="saUser">USERNAME</label>
          <input class="form-control" id="saUser" type="text" placeholder="maktab_admin" autocomplete="username">
          <div class="form-hint">Bu username bilan maktab nomidan kirish mumkin</div>
        </div>
        <div class="form-group">
          <label class="form-label req" for="saPass">PAROL</label>
          <input class="form-control" id="saPass" type="password" placeholder="Kamida 6 belgi" autocomplete="new-password">
        </div>
        <button class="btn btn-gold btn-block" id="doRegSchoolBtn">◈ MAKTABNI RO'YXATDAN O'TKAZISH</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(o);

  // Populate school select in register pane
  _fillSchoolSelect('rSchool');

  // Bind auth events
  document.getElementById('authCloseBtn')?.addEventListener('click', () => hideOverlay('authOverlay'));
  document.getElementById('atLogin')?.addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('atReg')?.addEventListener('click', () => switchAuthTab('register'));
  document.getElementById('atSchool')?.addEventListener('click', () => switchAuthTab('school'));
  document.getElementById('doLoginBtn')?.addEventListener('click', doLogin);
  document.getElementById('doRegBtn')?.addEventListener('click', doRegister);
  document.getElementById('doRegSchoolBtn')?.addEventListener('click', doRegisterSchool);

  // Enter key on login
  document.getElementById('liPass')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('rPass')?.addEventListener('keydown', e => { if (e.key === 'Enter') doRegister(); });
}

/** Populate a <select> by id with current schools list. */
function _fillSchoolSelect(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  // Remove all non-placeholder options
  while (sel.options.length > 1) sel.remove(1);
  getSchools().forEach(function(sc) {
    const opt = document.createElement('option');
    opt.value = sc.id;
    opt.textContent = sc.shortName;
    sel.appendChild(opt);
  });
}

function switchAuthTab(tab) {
  const map = { login: 'Login', register: 'Reg', school: 'School' };
  const key = map[tab] || 'Login';
  const tabs = ['Login', 'Reg', 'School'];
  tabs.forEach(function(t) {
    const tabEl = document.getElementById('at' + t);
    const paneEl = document.getElementById('pane' + t);
    const isActive = t === key;
    if (tabEl) {
      tabEl.classList.toggle('active', isActive);
      tabEl.setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
    if (paneEl) paneEl.classList.toggle('active', isActive);
  });
  const titles = { Login: '◈ KIRISH', Reg: "◈ RO'YXATDAN O'TISH", School: "◈ MAKTAB QO'SHISH" };
  const el = document.getElementById('authTitle');
  if (el) el.textContent = titles[key];
}

function _setFieldError(id, hasError) {
  const el = document.getElementById(id);
  if (el) el.style.borderColor = hasError ? 'var(--red)' : '';
}
function _clearFieldErrors(ids) {
  ids.forEach(function(id) { _setFieldError(id, false); });
}

function doLogin() {
  const user = (document.getElementById('liUser')?.value || '').trim();
  const pass = document.getElementById('liPass')?.value || '';
  _clearFieldErrors(['liUser', 'liPass']);
  if (!user) { _setFieldError('liUser', true); toast('Username kiritish shart!', 'error'); return; }
  if (!pass) { _setFieldError('liPass', true); toast('Parol kiritish shart!', 'error'); return; }
  const found = getUsers().find(function(u) { return u.username === user && u.password === pass; });
  if (!found) {
    _setFieldError('liUser', true);
    _setFieldError('liPass', true);
    toast("Username yoki parol noto'g'ri!", 'error');
    return;
  }
  saveSession(found);
  hideOverlay('authOverlay');
  toast('Xush kelibsiz, ' + found.firstName + '! ◈', 'success');
  setTimeout(function() { location.reload(); }, 700);
}

function doRegister() {
  const fn = (document.getElementById('rFname')?.value || '').trim();
  const ln = (document.getElementById('rLname')?.value || '').trim();
  const un = (document.getElementById('rUser')?.value || '').trim();
  const ro = document.getElementById('rRole')?.value || 'student';
  const pw = document.getElementById('rPass')?.value || '';
  const sc = document.getElementById('rSchool')?.value || null;
  _clearFieldErrors(['rFname', 'rLname', 'rUser', 'rPass']);
  let valid = true;
  if (!fn) { _setFieldError('rFname', true); valid = false; }
  if (!ln) { _setFieldError('rLname', true); valid = false; }
  if (!un) { _setFieldError('rUser', true); valid = false; }
  if (!pw) { _setFieldError('rPass', true); valid = false; }
  if (!valid) { toast('Barcha majburiy maydonlarni to\'ldiring!', 'error'); return; }
  if (un.length < 3 || !/^[a-zA-Z0-9_]+$/.test(un)) {
    _setFieldError('rUser', true);
    toast("Username noto'g'ri format (kamida 3 belgi, faqat a-z 0-9 _)!", 'error');
    return;
  }
  if (pw.length < 6) { _setFieldError('rPass', true); toast('Parol kamida 6 belgi!', 'error'); return; }
  const users = getUsers();
  if (users.find(function(u) { return u.username === un; })) {
    _setFieldError('rUser', true);
    toast('Bu username allaqachon band!', 'error');
    return;
  }
  const nu = {
    id: genId(), firstName: fn, lastName: ln,
    username: un, role: ro, schoolId: sc || null,
    password: pw, joinedAt: new Date().toISOString(), bio: '',
  };
  users.push(nu);
  saveUsers(users);
  saveSession(nu);
  hideOverlay('authOverlay');
  toast('Xush kelibsiz, ' + fn + '! Hisob yaratildi ◈', 'success');
  setTimeout(function() { location.reload(); }, 700);
}

function doRegisterSchool() {
  const name    = (document.getElementById('sName')?.value    || '').trim();
  const region  = document.getElementById('sRegion')?.value   || '';
  const dist    = (document.getElementById('sDistrict')?.value || '').trim();
  const type    = document.getElementById('sType')?.value     || 'umumiy';
  const stud    = parseInt(document.getElementById('sStudents')?.value) || 0;
  const teach   = parseInt(document.getElementById('sTeachers')?.value) || 0;
  const phone   = (document.getElementById('sPhone')?.value   || '').trim();
  const email   = (document.getElementById('sEmail')?.value   || '').trim();
  const addr    = (document.getElementById('sAddress')?.value  || '').trim();
  const about   = (document.getElementById('sAbout')?.value   || '').trim();
  const afn     = (document.getElementById('saFname')?.value  || '').trim();
  const aln     = (document.getElementById('saLname')?.value  || '').trim();
  const aun     = (document.getElementById('saUser')?.value   || '').trim();
  const apw     = document.getElementById('saPass')?.value    || '';

  const reqFields = [
    ['sName', name], ['sRegion', region], ['sDistrict', dist],
    ['sAddress', addr], ['saFname', afn], ['saLname', aln],
    ['saUser', aun], ['saPass', apw],
  ];
  const allIds = reqFields.map(function(f) { return f[0]; });
  _clearFieldErrors(allIds);
  let valid = true;
  reqFields.forEach(function(pair) {
    if (!pair[1]) { _setFieldError(pair[0], true); valid = false; }
  });
  if (!valid) { toast('Barcha majburiy maydonlarni to\'ldiring!', 'error'); return; }
  if (aun.length < 3 || !/^[a-zA-Z0-9_]+$/.test(aun)) {
    _setFieldError('saUser', true);
    toast("Admin username noto'g'ri (kamida 3 belgi, faqat a-z 0-9 _)!", 'error');
    return;
  }
  if (apw.length < 6) { _setFieldError('saPass', true); toast('Parol kamida 6 belgi!', 'error'); return; }

  const users = getUsers();
  if (users.find(function(u) { return u.username === aun; })) {
    _setFieldError('saUser', true);
    toast('Bu username allaqachon band!', 'error');
    return;
  }

  const schools = getSchools();
  const schoolId = 'school_' + genId();
  const shortName = name.length > 30 ? name.slice(0, 28) + '\u2026' : name;

  const newSchool = {
    id: schoolId, name: name, shortName: shortName,
    region: region, district: dist, type: type,
    students: stud, teachers: teach, classes: 0,
    founded: new Date().getFullYear(),
    about: about, email: email, phone: phone, address: addr,
    logoUrl: '', coverColor: schoolTypeColor(type),
    verified: false, createdAt: new Date().toISOString(),
  };
  schools.push(newSchool);
  saveSchools(schools);

  const newAdmin = {
    id: genId(), firstName: afn, lastName: aln,
    username: aun, password: apw,
    role: 'school_admin', schoolId: schoolId,
    joinedAt: new Date().toISOString(), bio: shortName + ' admini',
  };
  users.push(newAdmin);
  saveUsers(users);
  saveSession(newAdmin);

  // Update school select in modal if still open
  _fillSchoolSelect('rSchool');

  hideOverlay('authOverlay');
  toast('"' + name + '" platformaga qo\'shildi! ◈', 'success');
  setTimeout(function() { location.href = 'school.html?id=' + encodeURIComponent(schoolId); }, 1000);
}

function doLogout() {
  clearSession();
  toast("Tizimdan chiqdingiz. Ko'rishguncha! ◈", 'info');
  setTimeout(function() { location.reload(); }, 700);
}

// ── Post Editor ──────────────────────────────────────────────────
let _editPostId = null;

function openPostEditor(editId) {
  const s = getSession();
  if (!s) { toast('Avval tizimga kiring!', 'warning'); openAuth('login'); return; }
  _editPostId = editId || null;

  if (!document.getElementById('editorOverlay')) {
    const o = document.createElement('div');
    o.className = 'overlay';
    o.id = 'editorOverlay';
    o.setAttribute('role', 'dialog');
    o.setAttribute('aria-modal', 'true');
    o.setAttribute('aria-labelledby', 'edTitle');
    o.innerHTML = `
    <div class="modal modal-xl">
      <div class="modal-head">
        <h2 id="edTitle">◈ YANGILIK YOZISH</h2>
        <button class="close-btn" id="edCloseBtn" aria-label="Yopish">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label req" for="eTitle">SARLAVHA</label>
          <input class="form-control" id="eTitle" type="text" placeholder="Yangilik sarlavhasi..." maxlength="140" style="font-size:1rem;font-weight:700;font-family:var(--font-hud);letter-spacing:.04em">
        </div>
        <div class="form-group">
          <label class="form-label">KATEGORIYA</label>
          <div class="cat-picker" role="group" aria-label="Kategoriya tanlash">
            <button type="button" class="cat-pill active" data-v="yangilik">◈ Yangilik</button>
            <button type="button" class="cat-pill" data-v="tadbir">◈ Tadbir</button>
            <button type="button" class="cat-pill" data-v="sport">◈ Sport</button>
            <button type="button" class="cat-pill" data-v="fan">◈ Fan</button>
            <button type="button" class="cat-pill" data-v="madaniyat">◈ Madaniyat</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="eExcerpt">QISQA MAZMUN <span style="color:var(--txt3);font-weight:400;text-transform:none;font-family:var(--font-body)">(ixtiyoriy)</span></label>
          <input class="form-control" id="eExcerpt" type="text" placeholder="1-2 jumlada qisqacha..." maxlength="280">
        </div>
        <div class="form-group">
          <label class="form-label" for="eImgFile">MUQOVA RASM</label>
          <div class="img-drop" id="eImgDrop">
            <input type="file" id="eImgFile" accept="image/*" aria-label="Rasm yuklash">
            <div class="drop-icon" aria-hidden="true">🖼️</div>
            <p>Rasm tanlang yoki shu yerga tashlang</p>
            <span class="drop-hint">JPG, PNG — maks 4 MB</span>
            <img id="eImgPreview" class="img-preview-box" src="" alt="Muqova rasm ko'rinishi">
          </div>
          <button type="button" id="eImgClear" style="display:none;margin-top:6px" class="btn btn-ghost btn-sm">🗑️ Rasmni olib tashlash</button>
        </div>
        <div class="form-group">
          <label class="form-label req" for="eBody">MAQOLA MATNI</label>
          <div class="editor-toolbar" role="toolbar" aria-label="Matn formatlash">
            <button type="button" class="tb-btn" data-wrap-b="**" data-wrap-a="**" title="Bold"><b>B</b></button>
            <button type="button" class="tb-btn" data-wrap-b="_" data-wrap-a="_" title="Italic"><i>I</i></button>
            <button type="button" class="tb-btn" data-line="• " title="List">☰</button>
            <button type="button" class="tb-btn" data-line="📌 " title="Pin">📌</button>
            <button type="button" class="tb-btn" data-break="true" title="Yangi qator">↵</button>
          </div>
          <textarea class="form-control editor-body" id="eBody" rows="10" placeholder="Yangilik matnini yozing..."></textarea>
          <div class="form-hint" id="eBodyHint" style="text-align:right;margin-top:4px" aria-live="polite">0 belgi</div>
        </div>
        <div style="display:flex;gap:.8rem;justify-content:flex-end;padding-top:1rem;border-top:1px solid var(--border)">
          <button class="btn btn-ghost" id="edCancelBtn">Bekor qilish</button>
          <button class="btn btn-success" id="eSubmitBtn">◈ CHOP ETISH</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(o);

    // Editor events
    document.getElementById('edCloseBtn')?.addEventListener('click', () => hideOverlay('editorOverlay'));
    document.getElementById('edCancelBtn')?.addEventListener('click', () => hideOverlay('editorOverlay'));
    document.getElementById('eSubmitBtn')?.addEventListener('click', submitPost);

    // Cat pills via delegation
    document.querySelector('#editorOverlay .cat-picker')?.addEventListener('click', function(e) {
      const pill = e.target.closest('.cat-pill');
      if (pill) {
        document.querySelectorAll('#editorOverlay .cat-pill').forEach(function(c) { c.classList.remove('active'); });
        pill.classList.add('active');
      }
    });

    // Toolbar via delegation
    document.querySelector('#editorOverlay .editor-toolbar')?.addEventListener('click', function(e) {
      const btn = e.target.closest('.tb-btn');
      if (!btn) return;
      if (btn.dataset.wrapB) {
        _wrapText(btn.dataset.wrapB, btn.dataset.wrapA);
      } else if (btn.dataset.line) {
        _insertLine(btn.dataset.line);
      } else if (btn.dataset.break) {
        _insertBreak();
      }
    });

    // Body char count
    document.getElementById('eBody')?.addEventListener('input', function() {
      const hint = document.getElementById('eBodyHint');
      if (hint) hint.textContent = this.value.length + ' belgi';
    });

    // Image pick
    document.getElementById('eImgFile')?.addEventListener('change', function() { _handleImgPick(this); });
    document.getElementById('eImgClear')?.addEventListener('click', function() { _clearEditorImg(true); });

    // Drag and drop
    const drop = document.getElementById('eImgDrop');
    if (drop) {
      drop.addEventListener('dragover', function(e) { e.preventDefault(); drop.classList.add('drag'); });
      drop.addEventListener('dragleave', function() { drop.classList.remove('drag'); });
      drop.addEventListener('drop', function(e) {
        e.preventDefault();
        drop.classList.remove('drag');
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith('image/')) {
          try {
            const dt = new DataTransfer();
            dt.items.add(f);
            document.getElementById('eImgFile').files = dt.files;
            _handleImgPick(document.getElementById('eImgFile'));
          } catch(err) {
            toast('Rasm yuklanmadi, qayta urinib ko\'ring', 'error');
          }
        }
      });
    }
  }

  // Fill / reset
  const bodyEl = document.getElementById('eBody');
  const hintEl = document.getElementById('eBodyHint');
  const submitBtn = document.getElementById('eSubmitBtn');
  const titleEl = document.getElementById('edTitle');

  if (_editPostId) {
    const p = getPosts().find(function(x) { return x.id === _editPostId; });
    if (p) {
      document.getElementById('eTitle').value = p.title || '';
      document.getElementById('eExcerpt').value = p.excerpt || '';
      if (bodyEl) bodyEl.value = p.body || '';
      if (hintEl) hintEl.textContent = (p.body || '').length + ' belgi';
      if (titleEl) titleEl.textContent = '◈ MAQOLANI TAHRIRLASH';
      if (submitBtn) submitBtn.textContent = '◈ SAQLASH';
      document.querySelectorAll('#editorOverlay .cat-pill').forEach(function(c) {
        c.classList.toggle('active', c.dataset.v === p.category);
      });
      if (p.imageUrl) {
        const pr = document.getElementById('eImgPreview');
        if (pr) { pr.src = p.imageUrl; pr.style.display = 'block'; }
        const cb = document.getElementById('eImgClear');
        if (cb) cb.style.display = 'inline-flex';
      } else {
        _clearEditorImg(false);
      }
    }
  } else {
    document.getElementById('eTitle').value = '';
    document.getElementById('eExcerpt').value = '';
    if (bodyEl) bodyEl.value = '';
    if (hintEl) hintEl.textContent = '0 belgi';
    if (titleEl) titleEl.textContent = '◈ YANGILIK YOZISH';
    if (submitBtn) submitBtn.textContent = '◈ CHOP ETISH';
    document.querySelectorAll('#editorOverlay .cat-pill').forEach(function(c, i) {
      c.classList.toggle('active', i === 0);
    });
    _clearEditorImg(false);
  }
  showOverlay('editorOverlay');
}

function _handleImgPick(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  if (f.size > 4 * 1024 * 1024) { toast('Rasm 4 MB dan kichik bo\'lsin!', 'error'); return; }
  const r = new FileReader();
  r.onload = function(e) {
    const pr = document.getElementById('eImgPreview');
    if (pr) { pr.src = e.target.result; pr.style.display = 'block'; }
    const cb = document.getElementById('eImgClear');
    if (cb) cb.style.display = 'inline-flex';
  };
  r.readAsDataURL(f);
}

function _clearEditorImg(resetInput) {
  const pr = document.getElementById('eImgPreview');
  if (pr) { pr.src = ''; pr.style.display = 'none'; }
  if (resetInput) {
    const fi = document.getElementById('eImgFile');
    if (fi) fi.value = '';
  }
  const cb = document.getElementById('eImgClear');
  if (cb) cb.style.display = 'none';
}

function _wrapText(before, after) {
  const ta = document.getElementById('eBody');
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
  const sel = v.slice(s, e) || 'matn';
  ta.value = v.slice(0, s) + before + sel + after + v.slice(e);
  ta.focus();
  ta.selectionStart = s + before.length;
  ta.selectionEnd = s + before.length + sel.length;
  ta.dispatchEvent(new Event('input'));
}

function _insertLine(prefix) {
  const ta = document.getElementById('eBody');
  if (!ta) return;
  const p = ta.selectionStart, v = ta.value;
  const nl = p > 0 && v[p - 1] !== '\n' ? '\n' : '';
  ta.value = v.slice(0, p) + nl + prefix + v.slice(p);
  ta.focus();
  const np = p + nl.length + prefix.length;
  ta.selectionStart = ta.selectionEnd = np;
  ta.dispatchEvent(new Event('input'));
}

function _insertBreak() {
  const ta = document.getElementById('eBody');
  if (!ta) return;
  const p = ta.selectionStart, v = ta.value;
  ta.value = v.slice(0, p) + '\n\n' + v.slice(p);
  ta.focus();
  ta.selectionStart = ta.selectionEnd = p + 2;
  ta.dispatchEvent(new Event('input'));
}

function submitPost() {
  const s = getSession();
  if (!s) { toast('Avval tizimga kiring!', 'warning'); return; }
  const title    = (document.getElementById('eTitle')?.value   || '').trim();
  const excerpt  = (document.getElementById('eExcerpt')?.value || '').trim();
  const body     = (document.getElementById('eBody')?.value    || '').trim();
  const cat      = document.querySelector('#editorOverlay .cat-pill.active')?.dataset.v || 'yangilik';
  const imgSrc   = document.getElementById('eImgPreview')?.src || '';
  const imageUrl = (imgSrc && !imgSrc.endsWith('/') && imgSrc.startsWith('data:')) ? imgSrc : '';

  _setFieldError('eTitle', false);
  _setFieldError('eBody', false);
  if (!title || title.length < 5) {
    _setFieldError('eTitle', true);
    toast('Sarlavha kamida 5 belgi bo\'lsin!', 'error');
    return;
  }
  if (!body || body.length < 20) {
    _setFieldError('eBody', true);
    toast('Maqola matni kamida 20 belgi bo\'lsin!', 'error');
    return;
  }

  const school = s.schoolId ? getSchoolById(s.schoolId) : null;
  const finalExcerpt = excerpt || body.slice(0, 180).replace(/\n/g, ' ') + '\u2026';
  const posts = getPosts();

  if (_editPostId) {
    const idx = posts.findIndex(function(p) { return p.id === _editPostId; });
    if (idx !== -1) {
      const p = posts[idx];
      const canEdit = s.role === 'superadmin' || p.authorId === s.id ||
        (s.role === 'school_admin' && p.schoolId === s.schoolId);
      if (!canEdit) { toast("Tahrirlash huquqi yo'q!", 'error'); return; }
      posts[idx] = Object.assign({}, p, {
        title: title, excerpt: finalExcerpt, body: body,
        category: cat, imageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
      });
      savePosts(posts);
      hideOverlay('editorOverlay');
      toast('Maqola yangilandi! ◈', 'success');
      setTimeout(function() { location.reload(); }, 700);
    } else {
      toast("Maqola topilmadi!", 'error');
    }
  } else {
    const np = {
      id: genId(), title: title, excerpt: finalExcerpt,
      body: body, category: cat, imageUrl: imageUrl,
      pinned: false,
      schoolId: s.schoolId || null,
      schoolName: school ? school.shortName : "Noma'lum",
      authorId: s.id,
      authorName: (s.firstName + ' ' + s.lastName).trim(),
      authorRole: s.role,
      createdAt: new Date().toISOString(),
      likes: 0, views: 0, comments: [],
    };
    posts.unshift(np);
    savePosts(posts);
    hideOverlay('editorOverlay');
    toast('Yangilik chop etildi! ◈', 'success');
    setTimeout(function() { location.reload(); }, 700);
  }
}

function deletePost(id) {
  const s = getSession();
  if (!s) { toast('Avval tizimga kiring!', 'warning'); return; }
  if (!id) return;
  if (!window.confirm("Bu yangilikni o'chirishni tasdiqlaysizmi?")) return;
  const posts = getPosts();
  const idx = posts.findIndex(function(p) { return p.id === id; });
  if (idx === -1) { toast("Yangilik topilmadi!", 'error'); return; }
  const p = posts[idx];
  const canDel = s.role === 'superadmin' || p.authorId === s.id ||
    (s.role === 'school_admin' && p.schoolId === s.schoolId);
  if (!canDel) { toast("O'chirish huquqi yo'q!", 'error'); return; }
  posts.splice(idx, 1);
  savePosts(posts);
  toast("Yangilik o'chirildi!", 'info');
  setTimeout(function() { location.reload(); }, 600);
}

// ── Like ─────────────────────────────────────────────────────────
function toggleLike(postId) {
  if (!postId) return;
  const liked = getLiked();
  const posts = getPosts();
  const p = posts.find(function(x) { return x.id === postId; });
  if (!p) return;
  let isLiked;
  const idx = liked.indexOf(postId);
  if (idx > -1) {
    liked.splice(idx, 1);
    p.likes = Math.max(0, (p.likes || 0) - 1);
    isLiked = false;
  } else {
    liked.push(postId);
    p.likes = (p.likes || 0) + 1;
    isLiked = true;
  }
  saveLiked(liked);
  savePosts(posts);
  document.querySelectorAll('[data-like="' + postId + '"]').forEach(function(btn) {
    btn.classList.toggle('liked', isLiked);
    btn.textContent = (isLiked ? '❤️' : '🤍') + ' ' + p.likes;
  });
}

// ── View Post ────────────────────────────────────────────────────
function viewPost(id) {
  if (!id) return;
  const posts = getPosts();
  const p = posts.find(function(x) { return x.id === id; });
  if (!p) { toast("Yangilik topilmadi!", 'error'); return; }
  p.views = (p.views || 0) + 1;
  savePosts(posts);

  const s = getSession();
  const canEdit = s && (s.role === 'superadmin' || p.authorId === s.id ||
    (s.role === 'school_admin' && p.schoolId === s.schoolId));
  const liked = getLiked().includes(id);
  const school = p.schoolId ? getSchoolById(p.schoolId) : null;

  let o = document.getElementById('viewOverlay');
  if (!o) {
    o = document.createElement('div');
    o.className = 'overlay';
    o.id = 'viewOverlay';
    o.setAttribute('role', 'dialog');
    o.setAttribute('aria-modal', 'true');
    document.body.appendChild(o);
  }

  let editDeleteBtns = '';
  if (canEdit) {
    editDeleteBtns = `
      <button class="btn btn-ghost btn-sm" id="vEditBtn" data-post-id="${esc(p.id)}">◈ Tahrirlash</button>
      <button class="btn btn-danger btn-sm" id="vDelBtn" data-post-id="${esc(p.id)}">🗑</button>`;
  }

  let schoolBadge = '';
  if (school) {
    schoolBadge = `
      <a href="school.html?id=${encodeURIComponent(school.id)}" class="school-badge-mini" style="padding:4px 10px;border:1px solid var(--border);border-radius:var(--r-xs)">
        <span aria-hidden="true">🏫</span> ${esc(school.shortName)}
      </a>`;
  }

  o.innerHTML = `
  <div class="modal modal-xl">
    <div class="modal-head">
      <span class="tag tag-${esc(p.category)}" style="font-size:.68rem">${esc(catLabel(p.category))}</span>
      <div style="display:flex;gap:6px;align-items:center">
        ${editDeleteBtns}
        <button class="close-btn" id="vCloseBtn" aria-label="Yopish">✕</button>
      </div>
    </div>
    <div class="modal-body">
      ${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="${esc(p.title)}" class="post-hero-img">` : ''}
      <h1 class="post-title-full">${esc(p.title)}</h1>
      <div class="post-meta-row">
        ${schoolBadge}
        <div style="display:flex;align-items:center;gap:7px">
          <div class="avatar-sm" aria-hidden="true">${esc(initials(p.authorName))}</div>
          <span style="font-size:.82rem;font-weight:600;color:var(--txt)">${esc(p.authorName)}</span>
          <span class="badge-role">${esc(roleName(p.authorRole))}</span>
        </div>
        <span style="font-size:.78rem;color:var(--txt3)">📅 ${esc(fmtDate(p.createdAt))}</span>
        <span style="font-size:.78rem;color:var(--txt3)">👁 ${p.views || 0}</span>
        <button class="like-btn ${liked ? 'liked' : ''}" data-like="${esc(p.id)}" aria-label="Like" aria-pressed="${liked}">${liked ? '❤️' : '🤍'} ${p.likes || 0}</button>
      </div>
      <div class="post-body-text">${esc(p.body)}</div>
      <div id="commentsSection">${_buildCommentsHtml(p)}</div>
    </div>
  </div>`;

  showOverlay('viewOverlay');

  // Bind events
  document.getElementById('vCloseBtn')?.addEventListener('click', () => hideOverlay('viewOverlay'));
  document.getElementById('vEditBtn')?.addEventListener('click', function() {
    const pid = this.dataset.postId;
    hideOverlay('viewOverlay');
    openPostEditor(pid);
  });
  document.getElementById('vDelBtn')?.addEventListener('click', function() {
    const pid = this.dataset.postId;
    hideOverlay('viewOverlay');
    deletePost(pid);
  });
  // Like
  o.querySelector('[data-like]')?.addEventListener('click', function() {
    toggleLike(this.dataset.like);
  });
  // Comment submit
  const cmtBtn = o.querySelector('[data-cmt-submit]');
  if (cmtBtn) {
    cmtBtn.addEventListener('click', function() { addComment(this.dataset.cmtSubmit); });
  }
}

function _buildCommentsHtml(p) {
  const s = getSession();
  const comments = p.comments || [];
  const listHtml = !comments.length
    ? `<p style="color:var(--txt3);font-size:.84rem;text-align:center;padding:1rem 0">Hali izoh yo'q. Birinchi bo'ling!</p>`
    : comments.map(function(c) {
        return `<div style="display:flex;gap:10px;padding:.85rem 0;border-bottom:1px solid var(--border)">
          <div class="avatar-sm" aria-hidden="true">${esc(initials(c.authorName))}</div>
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
              <span style="font-size:.82rem;font-weight:700;color:var(--txt)">${esc(c.authorName)}</span>
              <span style="font-size:.7rem;color:var(--txt3)">${esc(timeAgo(c.createdAt))}</span>
            </div>
            <p style="font-size:.87rem;color:var(--txt2);line-height:1.6">${esc(c.text)}</p>
          </div>
        </div>`;
      }).join('');

  const formHtml = s
    ? `<div style="display:flex;gap:10px;margin-top:1rem;align-items:flex-start">
        <div class="avatar-sm" aria-hidden="true">${esc(initials(s.firstName + ' ' + s.lastName))}</div>
        <div style="flex:1">
          <label class="sr-only" for="cmtInput_${esc(p.id)}">Izoh yozing</label>
          <textarea class="form-control" id="cmtInput_${esc(p.id)}" rows="2"
            placeholder="Izoh yozing..." style="min-height:56px;resize:none;font-size:.87rem"
            maxlength="600" aria-label="Izoh maydoni"></textarea>
          <button class="btn btn-primary btn-sm" style="margin-top:6px"
            data-cmt-submit="${esc(p.id)}" aria-label="Izoh yuborish">◈ Yuborish</button>
        </div>
      </div>`
    : `<div style="text-align:center;padding:.8rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--r-xs);margin-top:.8rem">
        <p style="font-size:.84rem;color:var(--txt3)">Izoh yozish uchun <button id="cmtLoginBtn" style="background:none;border:none;color:var(--cyan);font-weight:700;cursor:pointer;text-decoration:underline">tizimga kiring</button></p>
      </div>`;

  return `<div style="margin-top:2rem;padding-top:1.4rem;border-top:2px solid var(--border)">
    <div style="font-family:var(--font-hud);font-size:.78rem;font-weight:700;color:var(--cyan);letter-spacing:.08em;margin-bottom:1rem">◈ IZOHLAR (${comments.length})</div>
    <div id="cmtList_${esc(p.id)}">${listHtml}</div>
    ${formHtml}
  </div>`;
}

function addComment(postId) {
  const s = getSession();
  if (!s) { toast('Avval tizimga kiring!', 'warning'); return; }
  if (!postId) return;
  const ta = document.getElementById('cmtInput_' + postId);
  if (!ta) return;
  const text = ta.value.trim();
  if (!text) { ta.style.borderColor = 'var(--red)'; toast("Izoh bo'sh bo'lmasin!", 'error'); return; }
  if (text.length > 600) { toast('Izoh juda uzun (maks 600 belgi)!', 'error'); return; }
  ta.style.borderColor = '';
  const posts = getPosts();
  const p = posts.find(function(x) { return x.id === postId; });
  if (!p) return;
  if (!p.comments) p.comments = [];
  const cmt = {
    id: genId(),
    authorId: s.id,
    authorName: (s.firstName + ' ' + s.lastName).trim(),
    text: text,
    createdAt: new Date().toISOString(),
  };
  p.comments.push(cmt);
  savePosts(posts);
  ta.value = '';

  const listEl = document.getElementById('cmtList_' + postId);
  if (listEl) {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;gap:10px;padding:.85rem 0;border-bottom:1px solid var(--border)';
    const av = document.createElement('div');
    av.className = 'avatar-sm';
    av.setAttribute('aria-hidden', 'true');
    av.textContent = initials(s.firstName + ' ' + s.lastName);
    const body = document.createElement('div');
    body.style.flex = '1';
    const meta = document.createElement('div');
    meta.style.cssText = 'font-size:.82rem;font-weight:700;color:var(--txt);margin-bottom:3px';
    meta.textContent = (s.firstName + ' ' + s.lastName).trim() + ' — Hozirgina';
    const txt = document.createElement('p');
    txt.style.cssText = 'font-size:.87rem;color:var(--txt2);line-height:1.6';
    txt.textContent = text;
    body.appendChild(meta);
    body.appendChild(txt);
    d.appendChild(av);
    d.appendChild(body);
    // Remove "no comments" placeholder if present
    const noComments = listEl.querySelector('p');
    if (noComments && noComments.textContent.includes('Hali izoh')) noComments.remove();
    listEl.prepend(d);
  }
  toast("Izoh qo'shildi! ◈", 'success');
}

// ── Profile Modal ────────────────────────────────────────────────
function openProfile() {
  const s = getSession();
  if (!s) { toast('Avval tizimga kiring!', 'warning'); return; }
  const myPosts = getPosts().filter(function(p) { return p.authorId === s.id; });
  const school = s.schoolId ? getSchoolById(s.schoolId) : null;

  let o = document.getElementById('profileOverlay');
  if (!o) {
    o = document.createElement('div');
    o.className = 'overlay';
    o.id = 'profileOverlay';
    o.setAttribute('role', 'dialog');
    o.setAttribute('aria-modal', 'true');
    o.setAttribute('aria-label', 'Profil');
    document.body.appendChild(o);
  }

  const schoolLink = school
    ? `<a href="school.html?id=${encodeURIComponent(school.id)}" style="display:inline-flex;align-items:center;gap:5px;margin-top:.5rem;padding:3px 12px;background:rgba(0,212,255,.1);border:1px solid var(--border2);border-radius:var(--r-xs);color:var(--cyan);font-size:.74rem;font-family:var(--font-hud);text-decoration:none;letter-spacing:.04em">🏫 ${esc(school.shortName)}</a>`
    : '';

  const postListHtml = myPosts.length
    ? `<div style="font-family:var(--font-hud);font-size:.72rem;color:var(--cyan);letter-spacing:.1em;margin-bottom:.9rem">◈ MENING YANGIKLARIM (${myPosts.length})</div>
       <div style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto;padding-right:4px">
         ${myPosts.map(function(p) {
           return `<div class="post-list-item">
             <div style="flex:1;min-width:0">
               <div class="pli-title">${esc(p.title)}</div>
               <div class="pli-meta">${esc(fmtDateShort(p.createdAt))} · ❤️${p.likes||0} · 👁${p.views||0}</div>
             </div>
             <div style="display:flex;gap:5px;flex-shrink:0">
               <button class="btn btn-ghost btn-sm pli-edit" data-id="${esc(p.id)}" aria-label="Tahrirlash">✏️</button>
               <button class="btn btn-danger btn-sm pli-del" data-id="${esc(p.id)}" aria-label="O'chirish">🗑</button>
             </div>
           </div>`;
         }).join('')}
       </div>`
    : `<div class="empty-state" style="padding:2rem">
        <div class="empty-icon" aria-hidden="true">📝</div>
        <h3>YANGILIK YO'Q</h3>
        <p>Birinchi yangilikni siz yozing!</p>
        <button class="btn btn-primary btn-sm" id="profWriteBtn">◈ Yangilik yozish</button>
      </div>`;

  o.innerHTML = `
  <div class="modal modal-lg">
    <div class="modal-head">
      <h2>◈ PROFILIM</h2>
      <button class="close-btn" id="profCloseBtn" aria-label="Yopish">✕</button>
    </div>
    <div class="profile-banner">
      <div class="profile-av" aria-hidden="true">${esc(initials(s.firstName + ' ' + s.lastName))}</div>
      <h3>${esc(s.firstName + ' ' + s.lastName)}</h3>
      <p class="sub">@${esc(s.username)} · ${esc(roleName(s.role))}</p>
      ${schoolLink}
      <div class="profile-stats-row" aria-label="Statistika">
        <div class="ps-item"><div class="ps-n">${myPosts.length}</div><div class="ps-l">Yangiliklar</div></div>
        <div class="ps-item"><div class="ps-n">${myPosts.reduce(function(a,p){return a+(p.likes||0);},0)}</div><div class="ps-l">Likelar</div></div>
        <div class="ps-item"><div class="ps-n">${myPosts.reduce(function(a,p){return a+(p.views||0);},0)}</div><div class="ps-l">Ko'rishlar</div></div>
      </div>
    </div>
    <div class="modal-body">
      <div class="hint-box" style="margin-bottom:1.2rem">A'zo bo'lgan: ${esc(fmtDate(s.joinedAt))}</div>
      ${postListHtml}
    </div>
  </div>`;

  showOverlay('profileOverlay');

  document.getElementById('profCloseBtn')?.addEventListener('click', () => hideOverlay('profileOverlay'));
  document.getElementById('profWriteBtn')?.addEventListener('click', () => {
    hideOverlay('profileOverlay');
    openPostEditor();
  });
  // Edit / delete from profile list
  o.querySelectorAll('.pli-edit').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      hideOverlay('profileOverlay');
      openPostEditor(id);
    });
  });
  o.querySelectorAll('.pli-del').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      hideOverlay('profileOverlay');
      deletePost(id);
    });
  });
}

// ── Render Post Card ──────────────────────────────────────────────
/**
 * Returns HTML string for a post card.
 * All user data is escaped. No inline event handlers — uses data-* attributes.
 * Event delegation is set up by setupCardDelegation().
 */
function renderCard(p, delay) {
  if (!p) return '';
  delay = delay || 0;
  const liked = getLiked().includes(p.id);
  const s = getSession();
  const canEdit = s && (s.role === 'superadmin' || p.authorId === s.id ||
    (s.role === 'school_admin' && p.schoolId === s.schoolId));
  const school = p.schoolId ? getSchoolById(p.schoolId) : null;
  const catIcons = { yangilik:'📣', tadbir:'🎉', sport:'⚽', fan:'🔬', madaniyat:'🎭' };
  const icon = catIcons[p.category] || '📰';

  const imgHtml = p.imageUrl
    ? `<img src="${esc(p.imageUrl)}" class="pc-img" alt="${esc(p.title)}" loading="lazy">`
    : `<div class="pc-placeholder" aria-hidden="true" style="font-size:3rem">${icon}</div>`;

  const schoolBadge = school
    ? `<a href="school.html?id=${encodeURIComponent(school.id)}" class="school-badge-mini" onclick="event.stopPropagation()">🏫 ${esc(school.shortName)}</a>`
    : '';
  const pinnedBadge = p.pinned ? '<span class="pin-badge">📌 MUHIM</span>' : '';

  const delBtn = canEdit
    ? `<button class="icon-btn danger-hover" data-action="delete" data-id="${esc(p.id)}" aria-label="O'chirish" title="O'chirish">🗑</button>`
    : '';

  return `
  <article class="post-card" style="animation-delay:${delay}s" role="article">
    ${imgHtml}
    <div class="pc-body">
      <div class="pc-meta">
        <span class="tag tag-${esc(p.category)}" style="font-size:.68rem">${esc(catLabel(p.category))}</span>
        ${schoolBadge}
        ${pinnedBadge}
      </div>
      <h3 class="pc-title" data-action="view" data-id="${esc(p.id)}" role="button" tabindex="0"
          style="cursor:pointer" aria-label="${esc(p.title)} — batafsil ko'rish">${esc(p.title)}</h3>
      <p class="pc-excerpt">${esc(p.excerpt || '')}</p>
      <div class="pc-footer">
        <div class="pc-author">
          <div class="avatar-sm" aria-hidden="true">${esc(initials(p.authorName))}</div>
          <div>
            <div style="font-size:.75rem;color:var(--txt2);font-weight:600">${esc(p.authorName)}</div>
            <div style="font-size:.68rem;color:var(--txt3)">${esc(fmtDateShort(p.createdAt))}</div>
          </div>
        </div>
        <div class="pc-actions">
          <button class="like-btn ${liked ? 'liked' : ''}" data-like="${esc(p.id)}"
            aria-label="Like" aria-pressed="${liked}">${liked ? '❤️' : '🤍'} ${p.likes || 0}</button>
          ${delBtn}
          <button class="read-btn" data-action="view" data-id="${esc(p.id)}"
            aria-label="${esc(p.title)} — o'qish">◈ Ko'rish</button>
        </div>
      </div>
    </div>
  </article>`;
}

/**
 * Set up event delegation for post cards in a container.
 * Call this after rendering cards into a grid element.
 */
function setupCardDelegation(container) {
  if (!container) return;
  // Remove old listener if re-rendering
  if (container._cardDelegate) {
    container.removeEventListener('click', container._cardDelegate);
    container.removeEventListener('keydown', container._keyDelegate);
  }
  container._cardDelegate = function(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!id) return;
    if (action === 'view') viewPost(id);
    else if (action === 'delete') deletePost(id);
  };
  container._keyDelegate = function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest('[data-action="view"]');
      if (target) { e.preventDefault(); viewPost(target.dataset.id); }
    }
  };
  // Like delegation (data-like, not data-action)
  container._likeDelegate = function(e) {
    const btn = e.target.closest('[data-like]');
    if (btn && !btn.closest('[data-action]')) toggleLike(btn.dataset.like);
  };
  container.addEventListener('click', container._cardDelegate);
  container.addEventListener('click', container._likeDelegate);
  container.addEventListener('keydown', container._keyDelegate);
}

// ── Navbar mobile & scroll ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  const hb = document.getElementById('hamburger');
  const nl = document.getElementById('navLinks');
  if (hb && nl) {
    hb.addEventListener('click', function() {
      const open = nl.classList.toggle('open');
      hb.classList.toggle('open', open);
      hb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  window.addEventListener('scroll', function() {
    const b = document.getElementById('scrollTopBtn');
    if (b) b.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  buildNavAuth();
});

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
