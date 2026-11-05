/* ================================================================
   O'ZBEKISTON MAKTABLARI PLATFORMASI — platform.js
   Multi-school social news platform
   localStorage-based (no backend required)
   ================================================================ */

'use strict';

// ── Storage Keys ────────────────────────────────────────────────
const SK = {
  schools:  'edu_schools',
  users:    'edu_users',
  posts:    'edu_posts',
  session:  'edu_session',
  liked:    'edu_liked',
};

// ── Storage Helpers ─────────────────────────────────────────────
const getSchools  = () => JSON.parse(localStorage.getItem(SK.schools)  || '[]');
const getUsers    = () => JSON.parse(localStorage.getItem(SK.users)    || '[]');
const getPosts    = () => JSON.parse(localStorage.getItem(SK.posts)    || '[]');
const getSession  = () => JSON.parse(localStorage.getItem(SK.session)  || 'null');
const getLiked    = () => JSON.parse(localStorage.getItem(SK.liked)    || '[]');

const saveSchools  = d => localStorage.setItem(SK.schools,  JSON.stringify(d));
const saveUsers    = d => localStorage.setItem(SK.users,    JSON.stringify(d));
const savePosts    = d => localStorage.setItem(SK.posts,    JSON.stringify(d));
const saveSession  = d => localStorage.setItem(SK.session,  JSON.stringify(d));
const saveLiked    = d => localStorage.setItem(SK.liked,    JSON.stringify(d));
const clearSession = () => localStorage.removeItem(SK.session);

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
        name: 'Qamashi Ixtisoslashtirilgan Maktabi',
        shortName: 'Qamashi IM',
        region: 'Qashqadaryo viloyati',
        district: 'Qamashi tumani',
        type: 'ixtisoslashtirilgan',
        students: 264, teachers: 46, classes: 11,
        founded: 2023,
        about: "Qamashi tumani ixtisoslashtirilgan maktabi 2023-yilda tashkil topgan. Matematika, fizika, kimyo va biologiya fanlarini chuqur o'qitish asosiy yo'nalish hisoblanadi.",
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
        name: '1-sonli Toshkent Ixtisoslashtirilgan Maktabi',
        shortName: 'Toshkent IM-1',
        region: 'Toshkent shahri',
        district: 'Mirzo Ulug\'bek tumani',
        type: 'ixtisoslashtirilgan',
        students: 580, teachers: 72, classes: 18,
        founded: 1995,
        about: "Toshkent shahrining eng yirik ixtisoslashtirilgan maktablaridan biri. Fizika va matematika yo'nalishi.",
        email: 'info@tashim1.uz', phone: '+998 71 234 56 78',
        address: 'Toshkent shahri, Mirzo Ulug\'bek tumani',
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
        email: 'info@sampm.uz', phone: '+998 66 345 67 89',
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
        username: 'admin',
        password: 'admin123',
        role: 'school_admin',
        schoolId: 'school_qim',
        joinedAt: '2023-09-01T00:00:00.000Z',
        bio: 'Qamashi IM sayt administratori',
      },
      {
        id: 'u_admin_tash',
        firstName: 'Sardor', lastName: 'Toshmatov',
        username: 'tash_admin',
        password: 'admin123',
        role: 'school_admin',
        schoolId: 'school_tash1',
        joinedAt: '2024-01-15T00:00:00.000Z',
        bio: 'Toshkent IM-1 administratori',
      },
      {
        id: 'u_superadmin',
        firstName: 'Platform', lastName: 'Admin',
        username: 'superadmin',
        password: 'super123',
        role: 'superadmin',
        schoolId: null,
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
        body: "Samarqand Prezident Maktabi o'quvchilari Istanbulda bo'lib o'tgan xalqaro ilmiy konferensiyada ishtirok etdi.\n\n5 nafar o'quvchimiz o'z ilmiy ishlarini taqdim etdi. Ikki nafar o'quvchi maxsus diplom bilan taqdirlandi.\n\nBu tajriba o'quvchilarimizning xalqaro maydonda o'z imkoniyatlarini namoyish etishda muhim qadam bo'ldi.",
        category: 'fan', imageUrl: '',
        schoolId: 'school_sam', schoolName: 'Samarqand PM',
        authorId: 'u_admin_qim', authorName: 'Platform Admin', authorRole: 'superadmin',
        createdAt: '2025-10-05T08:00:00.000Z', likes: 44, views: 287, comments: [], pinned: false,
      },
      {
        id: 'post_t2',
        title: "Yangi o'quv yili — yangi imkoniyatlar!",
        excerpt: "2025-2026 o'quv yilida maktabimizda 50 ta yangi o'quvchi ta'lim olishni boshladi.",
        body: "Yangi o'quv yilining boshlanishi munosabati bilan maktabimizda tantanali marosim o'tkazildi.\n\n50 nafar yangi o'quvchi maktab oilasiga qo'shildi. Ularning barchasi qabul imtihonlaridan a'lo natijalar bilan o'tdi.\n\nMaktab direktorimiz bu yil yana ko'plab yutuqlarni qo'lga kiritishimizga ishonchini bildirdi.",
        category: 'yangilik', imageUrl: '',
        schoolId: 'school_tash1', schoolName: 'Toshkent IM-1',
        authorId: 'u_admin_tash', authorName: 'Sardor Toshmatov', authorRole: 'school_admin',
        createdAt: '2025-09-02T09:00:00.000Z', likes: 35, views: 198, comments: [], pinned: false,
      },
    ]);
  }
})();

// ── Helpers ──────────────────────────────────────────────────────
const esc = s => s ? String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const mo = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
  return `${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const mo = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];
  return `${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()}`;
}
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'Hozirgina';
  if (diff < 3600) return `${Math.floor(diff/60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff/3600)} soat oldin`;
  if (diff < 2592000) return `${Math.floor(diff/86400)} kun oldin`;
  return fmtDateShort(iso);
}
function initials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
}
function roleName(r) {
  return { superadmin: 'Super Admin', school_admin: 'Maktab Admini', teacher: "O'qituvchi", student: "O'quvchi", parent: 'Ota-ona', staff: 'Xodim' }[r] || r;
}
function catLabel(c) {
  return { yangilik:'📣 Yangilik', tadbir:'🎉 Tadbir', sport:'⚽ Sport', fan:'🔬 Fan', madaniyat:'🎭 Madaniyat' }[c] || c;
}
function catClass(c) { return 'tag tag-' + c; }
function schoolTypeName(t) {
  return { umumiy: 'Umumta\'lim', ixtisoslashtirilgan: 'Ixtisoslashtirilgan', prezident: 'Prezident Maktabi', innovatsion: 'Innovatsion' }[t] || t;
}
function schoolTypeColor(t) {
  return { umumiy: '#00d4ff', ixtisoslashtirilgan: '#ffa500', prezident: '#7c3aed', innovatsion: '#10b981' }[t] || '#00d4ff';
}
function getSchoolById(id) { return getSchools().find(s => s.id === id); }

// ── Toast ─────────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  let root = document.getElementById('toastRoot');
  if (!root) { root = document.createElement('div'); root.id = 'toastRoot'; document.body.appendChild(root); }
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span class="toast-msg">${esc(msg)}</span><button class="toast-x" onclick="this.parentElement.remove()">✕</button>`;
  root.prepend(el);
  setTimeout(() => el.remove(), 4500);
}

// ── Overlay helpers ──────────────────────────────────────────────
function showOverlay(id) { const o = document.getElementById(id); if (o) { o.classList.add('show'); document.body.style.overflow = 'hidden'; } }
function hideOverlay(id) { const o = document.getElementById(id); if (o) { o.classList.remove('show'); document.body.style.overflow = ''; } }
function closeAllOverlays() { document.querySelectorAll('.overlay.show').forEach(o => { o.classList.remove('show'); }); document.body.style.overflow = ''; }

document.addEventListener('click', e => { if (e.target.classList.contains('overlay')) closeAllOverlays(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllOverlays(); });

// ── Nav Auth ─────────────────────────────────────────────────────
function buildNavAuth() {
  const wrap = document.getElementById('navAuth');
  if (!wrap) return;
  const s = getSession();
  if (s) {
    const school = s.schoolId ? getSchoolById(s.schoolId) : null;
    const ini = initials(s.firstName + ' ' + s.lastName);
    wrap.innerHTML = `
      <button class="btn btn-success btn-sm" onclick="openPostEditor()">◈ Yangilik yozish</button>
      <div class="dropdown" id="userDd">
        <div class="user-pill" onclick="toggleDd()">
          <div class="avatar">${ini}</div>
          <span class="name">${esc(s.firstName)}</span>
          <span class="chevron">▼</span>
        </div>
        <div class="dropdown-menu">
          <div class="dd-user">
            <div class="dd-user-name">${esc(s.firstName + ' ' + s.lastName)}</div>
            <div class="dd-user-sub">@${esc(s.username)} · ${roleName(s.role)}</div>
            ${school ? `<div class="dd-school-badge">◈ ${esc(school.shortName)}</div>` : ''}
          </div>
          <button class="dropdown-item" onclick="openProfile()"><span class="di-icon">👤</span>Profilim</button>
          <button class="dropdown-item" onclick="openPostEditor()"><span class="di-icon">◈</span>Yangilik yozish</button>
          ${school ? `<button class="dropdown-item" onclick="location.href='school.html?id=${school.id}'"><span class="di-icon">🏫</span>Maktabim</button>` : ''}
          <div class="dropdown-divider"></div>
          <button class="dropdown-item danger" onclick="doLogout()"><span class="di-icon">🚪</span>Chiqish</button>
        </div>
      </div>`;
  } else {
    wrap.innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="openAuth('login')">Kirish</button>
      <button class="btn btn-primary btn-sm" onclick="openAuth('register')">Ro'yxatdan o'tish</button>`;
  }
}

function toggleDd() { document.getElementById('userDd')?.classList.toggle('open'); }
document.addEventListener('click', e => {
  const d = document.getElementById('userDd');
  if (d && !d.contains(e.target)) d.classList.remove('open');
});

// ── Auth Modal ────────────────────────────────────────────────────
function openAuth(tab = 'login') {
  if (getSession()) { toast('Allaqachon tizimdasiz!', 'info'); return; }
  _createAuthModal();
  showOverlay('authOverlay');
  switchAuthTab(tab);
}

function _createAuthModal() {
  if (document.getElementById('authOverlay')) return;
  const o = document.createElement('div');
  o.className = 'overlay'; o.id = 'authOverlay';
  o.innerHTML = `
  <div class="modal" style="max-width:480px">
    <div class="modal-head">
      <h2 id="authTitle">◈ KIRISH</h2>
      <button class="close-btn" onclick="hideOverlay('authOverlay')">✕</button>
    </div>
    <div class="modal-body">
      <div class="auth-tabs">
        <button class="auth-tab active" id="atLogin" onclick="switchAuthTab('login')">Kirish</button>
        <button class="auth-tab" id="atReg" onclick="switchAuthTab('register')">Ro'yxatdan o'tish</button>
        <button class="auth-tab" id="atSchool" onclick="switchAuthTab('school')">Maktab qo'shish</button>
      </div>

      <!-- LOGIN -->
      <div class="tab-pane active" id="paneLogin">
        <div class="form-group"><label class="form-label req">USERNAME</label>
          <input class="form-control" id="liUser" type="text" placeholder="username" autocomplete="username"></div>
        <div class="form-group"><label class="form-label req">PAROL</label>
          <input class="form-control" id="liPass" type="password" placeholder="••••••" onkeydown="if(event.key==='Enter')doLogin()"></div>
        <button class="btn btn-primary btn-block" onclick="doLogin()">◈ KIRISH</button>
        <div class="hint-box" style="margin-top:1rem">
          <p>Test: <code>admin</code> / <code>admin123</code> (Qamashi IM admini)</p>
          <p>Test: <code>tash_admin</code> / <code>admin123</code> (Toshkent IM-1 admini)</p>
        </div>
      </div>

      <!-- REGISTER as user -->
      <div class="tab-pane" id="paneReg">
        <div class="form-row">
          <div class="form-group"><label class="form-label req">ISM</label>
            <input class="form-control" id="rFname" type="text" placeholder="Ismingiz"></div>
          <div class="form-group"><label class="form-label req">FAMILIYA</label>
            <input class="form-control" id="rLname" type="text" placeholder="Familiyangiz"></div>
        </div>
        <div class="form-group"><label class="form-label req">USERNAME</label>
          <input class="form-control" id="rUser" type="text" placeholder="username_99">
          <div class="form-hint">Faqat lotin harflari, raqamlar va _</div></div>
        <div class="form-group"><label class="form-label">MAKTAB (ixtiyoriy)</label>
          <select class="form-control" id="rSchool">
            <option value="">— Maktab tanlang —</option>
          </select></div>
        <div class="form-group"><label class="form-label">ROL</label>
          <select class="form-control" id="rRole">
            <option value="student">🎓 O'quvchi</option>
            <option value="teacher">👨‍🏫 O'qituvchi</option>
            <option value="parent">👨‍👩‍👧 Ota-ona</option>
            <option value="staff">💼 Xodim</option>
          </select></div>
        <div class="form-group"><label class="form-label req">PAROL</label>
          <input class="form-control" id="rPass" type="password" placeholder="Kamida 6 belgi" onkeydown="if(event.key==='Enter')doRegister()"></div>
        <button class="btn btn-success btn-block" onclick="doRegister()">◈ RO'YXATDAN O'TISH</button>
      </div>

      <!-- REGISTER SCHOOL -->
      <div class="tab-pane" id="paneSchool">
        <div class="hint-box" style="margin-bottom:1.2rem">
          <p>◈ Maktabingizni platformaga qo'shing va maktab nomidan yangiliklar joylashtiring</p>
        </div>
        <div class="form-group"><label class="form-label req">MAKTAB NOMI</label>
          <input class="form-control" id="sName" type="text" placeholder="masalan: 45-sonli Umumta'lim Maktabi"></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label req">VILOYAT</label>
            <select class="form-control" id="sRegion">
              <option value="">Tanlang...</option>
              <option>Toshkent shahri</option><option>Toshkent viloyati</option>
              <option>Samarqand viloyati</option><option>Buxoro viloyati</option>
              <option>Qashqadaryo viloyati</option><option>Surxondaryo viloyati</option>
              <option>Farg'ona viloyati</option><option>Andijon viloyati</option>
              <option>Namangan viloyati</option><option>Xorazm viloyati</option>
              <option>Navoiy viloyati</option><option>Jizzax viloyati</option>
              <option>Sirdaryo viloyati</option><option>Qoraqalpog'iston</option>
            </select></div>
          <div class="form-group"><label class="form-label req">TUMAN / SHAHAR</label>
            <input class="form-control" id="sDistrict" type="text" placeholder="Tuman yoki shahar nomi"></div>
        </div>
        <div class="form-group"><label class="form-label">MAKTAB TURI</label>
          <select class="form-control" id="sType">
            <option value="umumiy">Umumta'lim maktabi</option>
            <option value="ixtisoslashtirilgan">Ixtisoslashtirilgan maktab</option>
            <option value="prezident">Prezident Maktabi</option>
            <option value="innovatsion">Innovatsion maktab</option>
          </select></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">O'QUVCHILAR SONI</label>
            <input class="form-control" id="sStudents" type="number" placeholder="500" min="1"></div>
          <div class="form-group"><label class="form-label">HODIMLAR SONI</label>
            <input class="form-control" id="sTeachers" type="number" placeholder="50" min="1"></div>
        </div>
        <div class="form-group"><label class="form-label">TELEFON</label>
          <input class="form-control" id="sPhone" type="text" placeholder="+998 90 000 00 00"></div>
        <div class="form-group"><label class="form-label">EMAIL</label>
          <input class="form-control" id="sEmail" type="email" placeholder="info@maktab.uz"></div>
        <div class="form-group"><label class="form-label req">MANZIL</label>
          <input class="form-control" id="sAddress" type="text" placeholder="To'liq manzil"></div>
        <div class="form-group"><label class="form-label">MAKTAB HAQIDA</label>
          <textarea class="form-control" id="sAbout" placeholder="Maktabingiz haqida qisqacha..." style="min-height:80px"></textarea></div>
        <hr style="border-color:var(--border);margin:1.2rem 0">
        <p style="font-size:.78rem;color:var(--txt3);margin-bottom:1rem;font-family:var(--font-hud);letter-spacing:.04em">ADMIN HISOBI (maktab uchun)</p>
        <div class="form-row">
          <div class="form-group"><label class="form-label req">ADMIN ISMI</label>
            <input class="form-control" id="saFname" type="text" placeholder="Ism"></div>
          <div class="form-group"><label class="form-label req">ADMIN FAMILIYASI</label>
            <input class="form-control" id="saLname" type="text" placeholder="Familiya"></div>
        </div>
        <div class="form-group"><label class="form-label req">USERNAME</label>
          <input class="form-control" id="saUser" type="text" placeholder="maktab_admin">
          <div class="form-hint">Bu username bilan maktab nomidan kirish mumkin</div></div>
        <div class="form-group"><label class="form-label req">PAROL</label>
          <input class="form-control" id="saPass" type="password" placeholder="Kamida 6 belgi"></div>
        <button class="btn btn-gold btn-block" onclick="doRegisterSchool()">◈ MAKTABNI RO'YXATDAN O'TKAZISH</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(o);

  // Populate school select
  const sel = document.getElementById('rSchool');
  if (sel) {
    getSchools().forEach(sc => {
      const opt = document.createElement('option');
      opt.value = sc.id; opt.textContent = sc.shortName;
      sel.appendChild(opt);
    });
  }
}

function switchAuthTab(tab) {
  const map = { login: 'Login', register: 'Reg', school: 'School' };
  const key = map[tab] || 'Login';
  ['Login','Reg','School'].forEach(t => {
    document.getElementById('at'+t)?.classList.toggle('active', t === key);
    document.getElementById('pane'+t)?.classList.toggle('active', t === key);
  });
  const titles = { Login: '◈ KIRISH', Reg: "◈ RO'YXATDAN O'TISH", School: '◈ MAKTAB QO\'SHISH' };
  const el = document.getElementById('authTitle');
  if (el) el.textContent = titles[key];
}

function doLogin() {
  const user = (document.getElementById('liUser')?.value || '').trim();
  const pass = document.getElementById('liPass')?.value || '';
  if (!user || !pass) { toast('Barcha maydonlarni to\'ldiring!', 'error'); return; }
  const found = getUsers().find(u => u.username === user && u.password === pass);
  if (!found) { toast('Username yoki parol noto\'g\'ri!', 'error'); return; }
  saveSession(found);
  hideOverlay('authOverlay');
  toast(`Xush kelibsiz, ${found.firstName}! ◈`, 'success');
  setTimeout(() => location.reload(), 700);
}

function doRegister() {
  const fn = (document.getElementById('rFname')?.value || '').trim();
  const ln = (document.getElementById('rLname')?.value || '').trim();
  const un = (document.getElementById('rUser')?.value || '').trim();
  const ro = document.getElementById('rRole')?.value || 'student';
  const pw = document.getElementById('rPass')?.value || '';
  const sc = document.getElementById('rSchool')?.value || null;
  if (!fn || !ln || !un || !pw) { toast('Barcha majburiy maydonlarni to\'ldiring!', 'error'); return; }
  if (un.length < 3 || !/^[a-zA-Z0-9_]+$/.test(un)) { toast('Username noto\'g\'ri format!', 'error'); return; }
  if (pw.length < 6) { toast('Parol kamida 6 belgi!', 'error'); return; }
  const users = getUsers();
  if (users.find(u => u.username === un)) { toast('Bu username band!', 'error'); return; }
  const nu = { id: genId(), firstName: fn, lastName: ln, username: un, role: ro, schoolId: sc || null, password: pw, joinedAt: new Date().toISOString(), bio: '' };
  users.push(nu); saveUsers(users); saveSession(nu);
  hideOverlay('authOverlay');
  toast(`Xush kelibsiz, ${fn}! Hisob yaratildi ◈`, 'success');
  setTimeout(() => location.reload(), 700);
}

function doRegisterSchool() {
  const name   = (document.getElementById('sName')?.value || '').trim();
  const region = document.getElementById('sRegion')?.value || '';
  const dist   = (document.getElementById('sDistrict')?.value || '').trim();
  const type   = document.getElementById('sType')?.value || 'umumiy';
  const stud   = parseInt(document.getElementById('sStudents')?.value) || 0;
  const teach  = parseInt(document.getElementById('sTeachers')?.value) || 0;
  const phone  = (document.getElementById('sPhone')?.value || '').trim();
  const email  = (document.getElementById('sEmail')?.value || '').trim();
  const addr   = (document.getElementById('sAddress')?.value || '').trim();
  const about  = (document.getElementById('sAbout')?.value || '').trim();
  const afn    = (document.getElementById('saFname')?.value || '').trim();
  const aln    = (document.getElementById('saLname')?.value || '').trim();
  const aun    = (document.getElementById('saUser')?.value || '').trim();
  const apw    = document.getElementById('saPass')?.value || '';

  if (!name || !region || !dist || !addr || !afn || !aln || !aun || !apw) {
    toast('Barcha majburiy maydonlarni to\'ldiring!', 'error'); return;
  }
  if (aun.length < 3 || !/^[a-zA-Z0-9_]+$/.test(aun)) { toast('Admin username noto\'g\'ri!', 'error'); return; }
  if (apw.length < 6) { toast('Parol kamida 6 belgi!', 'error'); return; }

  const users = getUsers();
  if (users.find(u => u.username === aun)) { toast('Bu username allaqachon band!', 'error'); return; }

  const schools = getSchools();
  const schoolId = 'school_' + genId();
  const shortName = name.length > 30 ? name.slice(0, 28) + '…' : name;

  const newSchool = {
    id: schoolId, name, shortName, region, district: dist, type,
    students: stud, teachers: teach, classes: 0, founded: new Date().getFullYear(),
    about, email, phone, address: addr,
    logoUrl: '', coverColor: schoolTypeColor(type),
    verified: false, createdAt: new Date().toISOString(),
  };
  schools.push(newSchool); saveSchools(schools);

  const newAdmin = {
    id: genId(), firstName: afn, lastName: aln,
    username: aun, password: apw,
    role: 'school_admin', schoolId,
    joinedAt: new Date().toISOString(), bio: `${shortName} admini`,
  };
  users.push(newAdmin); saveUsers(users); saveSession(newAdmin);
  hideOverlay('authOverlay');
  toast(`"${name}" platformaga qo'shildi! ◈`, 'success');
  setTimeout(() => { location.href = 'school.html?id=' + schoolId; }, 1000);
}

function doLogout() {
  clearSession();
  toast("Tizimdan chiqdingiz. Ko'rishguncha! ◈", 'info');
  setTimeout(() => location.reload(), 700);
}

// ── Post Editor ──────────────────────────────────────────────────
let _editPostId = null;

function openPostEditor(editId) {
  const s = getSession();
  if (!s) { toast('Avval tizimga kiring!', 'warning'); openAuth('login'); return; }
  _editPostId = editId || null;

  if (!document.getElementById('editorOverlay')) {
    const o = document.createElement('div');
    o.className = 'overlay'; o.id = 'editorOverlay';
    o.innerHTML = `
    <div class="modal modal-xl">
      <div class="modal-head">
        <h2 id="edTitle">◈ YANGILIK YOZISH</h2>
        <button class="close-btn" onclick="hideOverlay('editorOverlay')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label req">SARLAVHA</label>
          <input class="form-control" id="eTitle" type="text" placeholder="Yangilik sarlavhasi..." maxlength="140" style="font-size:1rem;font-weight:700;font-family:var(--font-hud);letter-spacing:.04em">
        </div>
        <div class="form-group">
          <label class="form-label">KATEGORIYA</label>
          <div class="cat-picker">
            <button type="button" class="cat-pill active" data-v="yangilik" onclick="pickCat(this)">◈ Yangilik</button>
            <button type="button" class="cat-pill" data-v="tadbir" onclick="pickCat(this)">◈ Tadbir</button>
            <button type="button" class="cat-pill" data-v="sport" onclick="pickCat(this)">◈ Sport</button>
            <button type="button" class="cat-pill" data-v="fan" onclick="pickCat(this)">◈ Fan</button>
            <button type="button" class="cat-pill" data-v="madaniyat" onclick="pickCat(this)">◈ Madaniyat</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">QISQA MAZMUN <span style="color:var(--txt3);font-weight:400;text-transform:none;font-family:var(--font-body)">(ixtiyoriy)</span></label>
          <input class="form-control" id="eExcerpt" type="text" placeholder="1-2 jumlada qisqacha..." maxlength="280">
        </div>
        <div class="form-group">
          <label class="form-label">MUQOVA RASM</label>
          <div class="img-drop" id="eImgDrop">
            <input type="file" id="eImgFile" accept="image/*" onchange="handleImgPick(this)">
            <div class="drop-icon">🖼️</div>
            <p>Rasm tanlang yoki shu yerga tashlang</p>
            <span class="drop-hint">JPG, PNG — maks 4 MB</span>
            <img id="eImgPreview" class="img-preview-box" src="" alt="">
          </div>
          <button type="button" id="eImgClear" style="display:none;margin-top:6px" class="btn btn-ghost btn-sm" onclick="clearEditorImg()">🗑️ Rasmni olib tashlash</button>
        </div>
        <div class="form-group">
          <label class="form-label req">MAQOLA MATNI</label>
          <div class="editor-toolbar">
            <button type="button" class="tb-btn" onclick="wrapText('**','**')" title="Bold"><b>B</b></button>
            <button type="button" class="tb-btn" onclick="wrapText('_','_')" title="Italic"><i>I</i></button>
            <button type="button" class="tb-btn" onclick="insertLine('• ')" title="List">☰</button>
            <button type="button" class="tb-btn" onclick="insertLine('📌 ')" title="Pin">📌</button>
            <button type="button" class="tb-btn" onclick="insertBreak()" title="Break">↵</button>
          </div>
          <textarea class="form-control editor-body" id="eBody" rows="10" placeholder="Yangilik matnini yozing..."></textarea>
          <div class="form-hint" id="eBodyHint" style="text-align:right;margin-top:4px">0 belgi</div>
        </div>
        <div style="display:flex;gap:.8rem;justify-content:flex-end;padding-top:1rem;border-top:1px solid var(--border)">
          <button class="btn btn-ghost" onclick="hideOverlay('editorOverlay')">Bekor qilish</button>
          <button class="btn btn-success" id="eSubmitBtn" onclick="submitPost()">◈ CHOP ETISH</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(o);
    document.getElementById('eBody').addEventListener('input', function () {
      document.getElementById('eBodyHint').textContent = this.value.length + ' belgi';
    });
    const drop = document.getElementById('eImgDrop');
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.classList.remove('drag');
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith('image/')) {
        const dt = new DataTransfer(); dt.items.add(f);
        document.getElementById('eImgFile').files = dt.files;
        handleImgPick(document.getElementById('eImgFile'));
      }
    });
  }

  // Fill or reset
  if (_editPostId) {
    const p = getPosts().find(x => x.id === _editPostId);
    if (p) {
      document.getElementById('eTitle').value = p.title;
      document.getElementById('eExcerpt').value = p.excerpt || '';
      document.getElementById('eBody').value = p.body;
      document.getElementById('eBodyHint').textContent = p.body.length + ' belgi';
      document.getElementById('edTitle').textContent = '◈ MAQOLANI TAHRIRLASH';
      document.getElementById('eSubmitBtn').textContent = '◈ SAQLASH';
      document.querySelectorAll('.cat-pill').forEach(c => c.classList.toggle('active', c.dataset.v === p.category));
      if (p.imageUrl) {
        const pr = document.getElementById('eImgPreview'); pr.src = p.imageUrl; pr.style.display = 'block';
        document.getElementById('eImgClear').style.display = 'inline-flex';
      } else clearEditorImg(false);
    }
  } else {
    document.getElementById('eTitle').value = '';
    document.getElementById('eExcerpt').value = '';
    document.getElementById('eBody').value = '';
    document.getElementById('eBodyHint').textContent = '0 belgi';
    document.getElementById('edTitle').textContent = '◈ YANGILIK YOZISH';
    document.getElementById('eSubmitBtn').textContent = '◈ CHOP ETISH';
    document.querySelectorAll('.cat-pill').forEach((c, i) => c.classList.toggle('active', i === 0));
    clearEditorImg(false);
  }
  showOverlay('editorOverlay');
}

function pickCat(btn) { document.querySelectorAll('.cat-pill').forEach(c => c.classList.remove('active')); btn.classList.add('active'); }

function handleImgPick(input) {
  const f = input.files[0]; if (!f) return;
  if (f.size > 4 * 1024 * 1024) { toast('Rasm 4 MB dan kichik bo\'lsin!', 'error'); return; }
  const r = new FileReader();
  r.onload = e => {
    const pr = document.getElementById('eImgPreview'); pr.src = e.target.result; pr.style.display = 'block';
    document.getElementById('eImgClear').style.display = 'inline-flex';
  };
  r.readAsDataURL(f);
}
function clearEditorImg(resetInput = true) {
  const pr = document.getElementById('eImgPreview'); if (pr) { pr.src = ''; pr.style.display = 'none'; }
  if (resetInput) { const fi = document.getElementById('eImgFile'); if (fi) fi.value = ''; }
  const cb = document.getElementById('eImgClear'); if (cb) cb.style.display = 'none';
}
function wrapText(b, a) {
  const ta = document.getElementById('eBody'); if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
  const sel = v.slice(s, e) || 'matn';
  ta.value = v.slice(0, s) + b + sel + a + v.slice(e);
  ta.focus(); ta.selectionStart = s + b.length; ta.selectionEnd = s + b.length + sel.length;
  ta.dispatchEvent(new Event('input'));
}
function insertLine(prefix) {
  const ta = document.getElementById('eBody'); if (!ta) return;
  const p = ta.selectionStart, v = ta.value;
  const nl = p > 0 && v[p-1] !== '\n' ? '\n' : '';
  ta.value = v.slice(0, p) + nl + prefix + v.slice(p);
  ta.focus(); const np = p + nl.length + prefix.length; ta.selectionStart = ta.selectionEnd = np;
  ta.dispatchEvent(new Event('input'));
}
function insertBreak() {
  const ta = document.getElementById('eBody'); if (!ta) return;
  const p = ta.selectionStart, v = ta.value;
  ta.value = v.slice(0, p) + '\n\n' + v.slice(p);
  ta.focus(); ta.selectionStart = ta.selectionEnd = p + 2;
  ta.dispatchEvent(new Event('input'));
}

function submitPost() {
  const s = getSession(); if (!s) return;
  const title = (document.getElementById('eTitle')?.value || '').trim();
  const excerpt = (document.getElementById('eExcerpt')?.value || '').trim();
  const body = (document.getElementById('eBody')?.value || '').trim();
  const cat = document.querySelector('.cat-pill.active')?.dataset.v || 'yangilik';
  const imgSrc = document.getElementById('eImgPreview')?.src || '';
  const imageUrl = imgSrc && !imgSrc.endsWith('/') ? imgSrc : '';

  if (!title || title.length < 5) { toast('Sarlavha juda qisqa!', 'error'); return; }
  if (!body || body.length < 20) { toast('Maqola matni juda qisqa (kamida 20 belgi)!', 'error'); return; }

  const school = s.schoolId ? getSchoolById(s.schoolId) : null;
  const finalExcerpt = excerpt || body.slice(0, 180).replace(/\n/g, ' ') + '…';
  const posts = getPosts();

  if (_editPostId) {
    const idx = posts.findIndex(p => p.id === _editPostId);
    if (idx !== -1 && (posts[idx].authorId === s.id || s.role === 'superadmin' || (s.role === 'school_admin' && posts[idx].schoolId === s.schoolId))) {
      posts[idx] = { ...posts[idx], title, excerpt: finalExcerpt, body, category: cat, imageUrl, updatedAt: new Date().toISOString() };
      savePosts(posts); hideOverlay('editorOverlay'); toast('Maqola yangilandi! ◈', 'success');
      setTimeout(() => location.reload(), 700);
    } else toast('Tahrirlash huquqi yo\'q!', 'error');
  } else {
    const np = {
      id: genId(), title, excerpt: finalExcerpt, body, category: cat, imageUrl,
      pinned: false,
      schoolId: s.schoolId || null,
      schoolName: school ? school.shortName : 'Noma\'lum',
      authorId: s.id,
      authorName: s.firstName + ' ' + s.lastName,
      authorRole: s.role,
      createdAt: new Date().toISOString(),
      likes: 0, views: 0, comments: [],
    };
    posts.unshift(np); savePosts(posts);
    hideOverlay('editorOverlay'); toast('Yangilik chop etildi! ◈', 'success');
    setTimeout(() => location.reload(), 700);
  }
}

function deletePost(id) {
  const s = getSession(); if (!s) return;
  if (!confirm('Bu yangilikni o\'chirishni tasdiqlaysizmi?')) return;
  const posts = getPosts(); const idx = posts.findIndex(p => p.id === id); if (idx === -1) return;
  const p = posts[idx];
  const canDel = s.role === 'superadmin' || p.authorId === s.id || (s.role === 'school_admin' && p.schoolId === s.schoolId);
  if (!canDel) { toast('O\'chirish huquqi yo\'q!', 'error'); return; }
  posts.splice(idx, 1); savePosts(posts);
  toast('Yangilik o\'chirildi!', 'info');
  setTimeout(() => location.reload(), 600);
}

// ── Like ─────────────────────────────────────────────────────────
function toggleLike(postId) {
  const liked = getLiked();
  const posts = getPosts(); const p = posts.find(x => x.id === postId); if (!p) return;
  let isLiked;
  if (liked.includes(postId)) {
    liked.splice(liked.indexOf(postId), 1); p.likes = Math.max(0, (p.likes||0) - 1); isLiked = false;
  } else { liked.push(postId); p.likes = (p.likes||0) + 1; isLiked = true; }
  saveLiked(liked); savePosts(posts);
  document.querySelectorAll(`[data-like="${postId}"]`).forEach(btn => {
    btn.classList.toggle('liked', isLiked);
    btn.innerHTML = `${isLiked ? '❤️' : '🤍'} ${p.likes}`;
  });
}

// ── View Post ────────────────────────────────────────────────────
function viewPost(id) {
  const posts = getPosts(); const p = posts.find(x => x.id === id); if (!p) return;
  p.views = (p.views||0) + 1; savePosts(posts);
  const s = getSession();
  const canEdit = s && (s.role === 'superadmin' || p.authorId === s.id || (s.role === 'school_admin' && p.schoolId === s.schoolId));
  const liked = getLiked().includes(id);
  const school = p.schoolId ? getSchoolById(p.schoolId) : null;

  let o = document.getElementById('viewOverlay');
  if (!o) { o = document.createElement('div'); o.className = 'overlay'; o.id = 'viewOverlay'; document.body.appendChild(o); }

  o.innerHTML = `
  <div class="modal modal-xl">
    <div class="modal-head">
      <span class="${'tag ' + 'tag-' + p.category}" style="font-size:.68rem">${catLabel(p.category)}</span>
      <div style="display:flex;gap:6px;align-items:center">
        ${canEdit ? `<button class="btn btn-ghost btn-sm" onclick="hideOverlay('viewOverlay');openPostEditor('${p.id}')">◈ Tahrirlash</button>
        <button class="btn btn-danger btn-sm" onclick="hideOverlay('viewOverlay');deletePost('${p.id}')">🗑</button>` : ''}
        <button class="close-btn" onclick="hideOverlay('viewOverlay')">✕</button>
      </div>
    </div>
    <div class="modal-body">
      ${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="${esc(p.title)}" class="post-hero-img">` : ''}
      <h1 class="post-title-full">${esc(p.title)}</h1>
      <div class="post-meta-row">
        ${school ? `<a href="school.html?id=${school.id}" style="display:flex;align-items:center;gap:6px;padding:4px 10px;border:1px solid var(--border);border-radius:var(--r-xs);text-decoration:none;transition:all var(--t)" onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)'">
          <span style="font-size:.9rem">🏫</span><span style="font-size:.78rem;color:var(--cyan);font-family:var(--font-hud);font-weight:700;letter-spacing:.04em">${esc(school.shortName)}</span>
        </a>` : ''}
        <div style="display:flex;align-items:center;gap:7px">
          <div class="avatar-sm">${initials(p.authorName)}</div>
          <span style="font-size:.82rem;font-weight:600;color:var(--txt)">${esc(p.authorName)}</span>
          <span class="badge-role">${roleName(p.authorRole)}</span>
        </div>
        <span style="font-size:.78rem;color:var(--txt3)">📅 ${fmtDate(p.createdAt)}</span>
        <span style="font-size:.78rem;color:var(--txt3)">👁 ${p.views}</span>
        <button class="like-btn ${liked ? 'liked' : ''}" data-like="${p.id}" onclick="toggleLike('${p.id}')">${liked ? '❤️' : '🤍'} ${p.likes||0}</button>
      </div>
      <div class="post-body-text">${esc(p.body)}</div>
      ${_commentsHtml(p)}
    </div>
  </div>`;
  showOverlay('viewOverlay');
}

function _commentsHtml(p) {
  const s = getSession();
  const comments = p.comments || [];
  const listHtml = !comments.length
    ? `<p style="color:var(--txt3);font-size:.84rem;text-align:center;padding:1rem 0">Hali izoh yo'q. Birinchi bo'ling!</p>`
    : comments.map(c => `
      <div style="display:flex;gap:10px;padding:.85rem 0;border-bottom:1px solid var(--border)">
        <div class="avatar-sm">${initials(c.authorName)}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
            <span style="font-size:.82rem;font-weight:700;color:var(--txt)">${esc(c.authorName)}</span>
            <span style="font-size:.7rem;color:var(--txt3)">${timeAgo(c.createdAt)}</span>
          </div>
          <p style="font-size:.87rem;color:var(--txt2);line-height:1.6">${esc(c.text)}</p>
        </div>
      </div>`).join('');

  const form = s ? `
    <div style="display:flex;gap:10px;margin-top:1rem;align-items:flex-start">
      <div class="avatar-sm">${initials(s.firstName + ' ' + s.lastName)}</div>
      <div style="flex:1">
        <textarea class="form-control" id="cmtInput_${p.id}" rows="2"
          placeholder="Izoh yozing..." style="min-height:56px;resize:none;font-size:.87rem"></textarea>
        <button class="btn btn-primary btn-sm" style="margin-top:6px" onclick="addComment('${p.id}')">◈ Yuborish</button>
      </div>
    </div>`
    : `<div style="text-align:center;padding:.8rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--r-xs);margin-top:.8rem">
        <p style="font-size:.84rem;color:var(--txt3)">Izoh yozish uchun <button onclick="hideOverlay('viewOverlay');openAuth('login')" style="background:none;border:none;color:var(--cyan);font-weight:700;cursor:pointer">tizimga kiring</button></p>
       </div>`;

  return `<div style="margin-top:2rem;padding-top:1.4rem;border-top:2px solid var(--border)">
    <div style="font-family:var(--font-hud);font-size:.78rem;font-weight:700;color:var(--cyan);letter-spacing:.08em;margin-bottom:1rem">◈ IZOHLAR (${comments.length})</div>
    <div id="cmtList_${p.id}">${listHtml}</div>${form}</div>`;
}

function addComment(postId) {
  const s = getSession(); if (!s) { toast('Avval kiring!', 'warning'); return; }
  const ta = document.getElementById(`cmtInput_${postId}`); if (!ta) return;
  const text = ta.value.trim();
  if (!text) { toast('Izoh bo\'sh bo\'lmasin!', 'error'); return; }
  if (text.length > 600) { toast('Izoh juda uzun!', 'error'); return; }
  const posts = getPosts(); const p = posts.find(x => x.id === postId); if (!p) return;
  if (!p.comments) p.comments = [];
  const cmt = { id: genId(), authorId: s.id, authorName: s.firstName + ' ' + s.lastName, text, createdAt: new Date().toISOString() };
  p.comments.push(cmt); savePosts(posts); ta.value = '';
  const listEl = document.getElementById(`cmtList_${postId}`);
  if (listEl) {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;gap:10px;padding:.85rem 0;border-bottom:1px solid var(--border)';
    d.innerHTML = `<div class="avatar-sm">${initials(s.firstName + ' ' + s.lastName)}</div><div style="flex:1"><div style="font-size:.82rem;font-weight:700;color:var(--txt);margin-bottom:3px">${esc(s.firstName + ' ' + s.lastName)} <span style="font-size:.7rem;color:var(--txt3)">Hozirgina</span></div><p style="font-size:.87rem;color:var(--txt2)">${esc(text)}</p></div>`;
    listEl.prepend(d);
  }
  toast('Izoh qo\'shildi! ◈', 'success');
}

// ── Profile Modal ────────────────────────────────────────────────
function openProfile() {
  const s = getSession(); if (!s) return;
  const myPosts = getPosts().filter(p => p.authorId === s.id);
  const school = s.schoolId ? getSchoolById(s.schoolId) : null;

  let o = document.getElementById('profileOverlay');
  if (!o) { o = document.createElement('div'); o.className = 'overlay'; o.id = 'profileOverlay'; document.body.appendChild(o); }

  o.innerHTML = `
  <div class="modal modal-lg">
    <div class="modal-head"><h2>◈ PROFILIM</h2><button class="close-btn" onclick="hideOverlay('profileOverlay')">✕</button></div>
    <div class="profile-banner">
      <div class="profile-av">${initials(s.firstName + ' ' + s.lastName)}</div>
      <h3>${esc(s.firstName + ' ' + s.lastName)}</h3>
      <p class="sub">@${esc(s.username)} · ${roleName(s.role)}</p>
      ${school ? `<a href="school.html?id=${school.id}" style="display:inline-flex;align-items:center;gap:5px;margin-top:.5rem;padding:3px 12px;background:rgba(0,212,255,.1);border:1px solid var(--border2);border-radius:var(--r-xs);color:var(--cyan);font-size:.74rem;font-family:var(--font-hud);text-decoration:none;letter-spacing:.04em">🏫 ${esc(school.shortName)}</a>` : ''}
      <div class="profile-stats-row">
        <div class="ps-item"><div class="ps-n">${myPosts.length}</div><div class="ps-l">Yangiliklar</div></div>
        <div class="ps-item"><div class="ps-n">${myPosts.reduce((a,p)=>a+(p.likes||0),0)}</div><div class="ps-l">Like'lar</div></div>
        <div class="ps-item"><div class="ps-n">${myPosts.reduce((a,p)=>a+(p.views||0),0)}</div><div class="ps-l">Ko'rishlar</div></div>
      </div>
    </div>
    <div class="modal-body">
      <div class="hint-box" style="margin-bottom:1.2rem">A'zo: ${fmtDate(s.joinedAt)}</div>
      ${myPosts.length ? `
        <div style="font-family:var(--font-hud);font-size:.72rem;color:var(--cyan);letter-spacing:.1em;margin-bottom:.9rem">◈ MENING YANGIKLARIM (${myPosts.length})</div>
        <div style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto;padding-right:4px">
          ${myPosts.map(p => `
          <div class="post-list-item">
            <div style="flex:1;min-width:0">
              <div class="pli-title">${esc(p.title)}</div>
              <div class="pli-meta">${fmtDateShort(p.createdAt)} · ❤️${p.likes||0} · 👁${p.views||0}</div>
            </div>
            <div style="display:flex;gap:5px;flex-shrink:0">
              <button class="btn btn-ghost btn-sm" onclick="hideOverlay('profileOverlay');openPostEditor('${p.id}')">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="hideOverlay('profileOverlay');deletePost('${p.id}')">🗑</button>
            </div>
          </div>`).join('')}
        </div>` : `
        <div class="empty-state" style="padding:2rem">
          <div class="empty-icon">📝</div>
          <h3>YANGILIK YO'Q</h3>
          <p>Birinchi yangilikni siz yozing!</p>
          <button class="btn btn-primary btn-sm" onclick="hideOverlay('profileOverlay');openPostEditor()">◈ Yangilik yozish</button>
        </div>`}
    </div>
  </div>`;
  showOverlay('profileOverlay');
}

// ── Render Post Card ──────────────────────────────────────────────
function renderCard(p, delay = 0) {
  const liked = getLiked().includes(p.id);
  const s = getSession();
  const canEdit = s && (s.role === 'superadmin' || p.authorId === s.id || (s.role === 'school_admin' && p.schoolId === s.schoolId));
  const school = p.schoolId ? getSchoolById(p.schoolId) : null;

  return `
  <div class="post-card" style="animation-delay:${delay}s">
    ${p.imageUrl
      ? `<img src="${esc(p.imageUrl)}" class="pc-img" alt="${esc(p.title)}" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="pc-placeholder" style="font-size:3rem">${{yangilik:'📣',tadbir:'🎉',sport:'⚽',fan:'🔬',madaniyat:'🎭'}[p.category]||'📰'}</div>`}
    <div class="pc-body">
      <div class="pc-meta">
        <span class="${'tag tag-' + p.category}" style="font-size:.68rem">${catLabel(p.category)}</span>
        ${school ? `<a href="school.html?id=${school.id}" class="school-badge-mini" onclick="event.stopPropagation()">🏫 ${esc(school.shortName)}</a>` : ''}
        ${p.pinned ? '<span class="pin-badge">📌 MUHIM</span>' : ''}
      </div>
      <div class="pc-title" onclick="viewPost('${p.id}')" style="cursor:pointer">${esc(p.title)}</div>
      <div class="pc-excerpt">${esc(p.excerpt)}</div>
      <div class="pc-footer">
        <div class="pc-author">
          <div class="avatar-sm">${initials(p.authorName)}</div>
          <div>
            <div style="font-size:.75rem;color:var(--txt2);font-weight:600">${esc(p.authorName)}</div>
            <div style="font-size:.68rem;color:var(--txt3)">${fmtDateShort(p.createdAt)}</div>
          </div>
        </div>
        <div class="pc-actions">
          <button class="like-btn ${liked ? 'liked' : ''}" data-like="${p.id}" onclick="toggleLike('${p.id}')">${liked ? '❤️' : '🤍'} ${p.likes||0}</button>
          ${canEdit ? `<button style="background:none;border:none;cursor:pointer;font-size:.78rem;color:var(--txt3);padding:3px 6px;border:1px solid transparent;border-radius:var(--r-xs);transition:all var(--t)" onmouseover="this.style.borderColor='var(--red)';this.style.color='var(--red)'" onmouseout="this.style.borderColor='transparent';this.style.color='var(--txt3)'" onclick="deletePost('${p.id}')">🗑</button>` : ''}
          <button class="read-btn" onclick="viewPost('${p.id}')">◈ Ko'rish</button>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Navbar mobile & scroll ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const hb = document.getElementById('hamburger');
  const nl = document.getElementById('navLinks');
  if (hb && nl) hb.addEventListener('click', () => { hb.classList.toggle('open'); nl.classList.toggle('open'); });
  const nav = document.getElementById('mainNav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
  window.addEventListener('scroll', () => {
    const b = document.getElementById('scrollTopBtn');
    if (b) b.classList.toggle('show', scrollY > 400);
  });
  buildNavAuth();
  // Show write banner
  const wb = document.getElementById('writeBanner');
  if (wb) wb.style.display = getSession() ? 'flex' : 'none';
});

function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
