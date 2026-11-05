/* ============================================================
   QamashiIM — app.js  (shared across all pages)
   ============================================================ */

// ── Storage keys ──────────────────────────────────────────────
const SK = { users:'qi_users', posts:'qi_posts', session:'qi_session', likes:'qi_liked' };

const getUsers   = () => JSON.parse(localStorage.getItem(SK.users)   || '[]');
const getPosts   = () => JSON.parse(localStorage.getItem(SK.posts)   || '[]');
const getSession = () => JSON.parse(localStorage.getItem(SK.session) || 'null');
const getLiked   = () => JSON.parse(localStorage.getItem(SK.likes)   || '[]');

const saveUsers   = d => localStorage.setItem(SK.users,   JSON.stringify(d));
const savePosts   = d => localStorage.setItem(SK.posts,   JSON.stringify(d));
const saveSession = d => localStorage.setItem(SK.session, JSON.stringify(d));
const saveLiked   = d => localStorage.setItem(SK.likes,   JSON.stringify(d));
const clearSession  = () => localStorage.removeItem(SK.session);

// ── Seed ──────────────────────────────────────────────────────
(function seed(){
  if(!getUsers().length){
    saveUsers([{
      id:'admin_1', firstName:'Admin', lastName:'Qamashi',
      username:'admin', password:'admin123', role:'admin',
      joinedAt:'2023-09-01T00:00:00.000Z', bio:'Qamashi IM administratori'
    }]);
  }
  if(!getPosts().length){
    savePosts([
      { id:'p1', title:"Zakovat intellektual musobaqasi g'oliblar bilan yakunlandi",
        excerpt:"Maktabimizda bo'lib o'tgan Zakovat musobaqasida 8-11-sinf o'quvchilari o'z bilimlarini sinab ko'rdi.",
        body:"Qamashi tumani ixtisoslashtirilgan maktabida an'anaviy Zakovat intellektual musobaqasi bo'lib o'tdi.\n\nMusobaqada 8-, 9-, 10- va 11-sinf jamoalari ishtirok etdi. Har bir sinf 4 nafar eng bilimli o'quvchisini sahna sari jo'natdi. Musobaqa 3 bosqichdan iborat bo'lib, oxirgi savolga 11-sinf jamoasi to'g'ri javob berib, birinchi o'ringa chiqdi.\n\nG'olib jamoa va alohida faol ishtirokchilar maktab ma'muriyati tomonidan diplom va sovg'alar bilan taqdirlandi. Bunday tadbirlar o'quvchilarning erkin fikrlash, tez qaror qabul qilish va jamoada ishlash ko'nikmalarini rivojlantiradi.\n\nKeyingi bosqich — tumanlar o'rtasidagi musobaqa mart oyida o'tkazilishi rejalashtirilgan.",
        category:'tadbir', imageUrl:'', pinned:true,
        authorId:'admin_1', authorName:'Admin Qamashi', authorRole:'admin',
        createdAt:'2025-10-15T09:00:00.000Z', likes:31, views:204, comments:[] },
      { id:'p2', title:"Viloyat matematika olimpiadasida g'olib bo'ldik",
        excerpt:"O'quvchilarimiz viloyat matematika olimpiadasida 1-va 2-o'rinlarni qo'lga kiritdi.",
        body:"Qashqadaryo viloyati bo'yicha o'tkazilgan matematika olimpiadasida maktabimiz o'quvchilari yuqori natijalarni qo'lga kiritdi.\n\n9-sinf o'quvchisi Sardor Yusupov I-o'rinni, 10-sinf o'quvchisi Dildora Toshmatova II-o'rinni egalladi. Bu natijalar maktabimizning ta'lim sifati yuksak ekanligini yana bir bor tasdiqladi.\n\nIkkala o'quvchi ham respublika bosqichiga tavsiya etildi. Matematika o'qituvchimiz Bobur Hamidov o'z shogirdlarining bu yutuqlarini kattagina mehnat samarasi, deb baholadi.\n\nMaktab rahbariyati g'oliblar va ularning ustozlarini tabrik qildi.",
        category:'fan', imageUrl:'', pinned:false,
        authorId:'admin_1', authorName:'Admin Qamashi', authorRole:'admin',
        createdAt:'2025-09-28T10:30:00.000Z', likes:52, views:318, comments:[] },
      { id:'p3', title:"2025-2026 o'quv yiliga tantanali kirish marosimi bo'lib o'tdi",
        excerpt:"Yangi o'quv yilini kutib olish tantanasida o'quvchilar, ota-onalar va pedagoglar ishtirok etdi.",
        body:"2025-2026 o'quv yilining ochilish marosimi maktabimiz hovlisida katta shov-shuv bilan nishonlandi.\n\nBirinchi qo'ng'iroq tantanasida 264 nafar o'quvchi, ularning ota-onalari va butun pedagogik jamoa ishtirok etdi. 1-sinf o'quvchilari o'zlarining birinchi maktab kunlarini doimo yodda saqlab qolishdi.\n\nMaktab direktori yangi o'quv yilida rejalashtirilgan yangiliklar va loyihalar haqida so'zladi. Xususan, yangi kompyuter laboratoriyasi va kutubxona kengayishi e'lon qilindi.\n\nTantanadan so'ng o'quvchilar sinflarga yo'naltirildi va darslar boshlandi.",
        category:'yangilik', imageUrl:'', pinned:false,
        authorId:'admin_1', authorName:'Admin Qamashi', authorRole:'admin',
        createdAt:'2025-09-02T08:00:00.000Z', likes:44, views:276, comments:[] },
      { id:'p4', title:"Maktablararo futbol turniri: g'olib bizning jamoamiz!",
        excerpt:"Qamashi tumanidagi maktablararo futbol turnirida o'quvchilarimiz birinchi o'rinni qo'lga kiritdi.",
        body:"Qamashi tumanidagi o'rta maktablar o'rtasida o'tkazilgan futbol turniriga maktabimiz ham jamoasi bilan qatnashdi.\n\nGroup bosqichida 3 ta o'yinda g'alaba qozongan jamoamiz final bosqichiga chiqdi. Final o'yinida 3:1 hisobida g'alaba qozonib, birinchi o'rinni egalladi.\n\nJamoa kapitani 11-sinf o'quvchisi Jasur Xolmatov musobaqa eng yaxshi o'yinchisi deb topildi. Jamoaning murabbiysi Ahmad Karimov yillar davomidagi mashaqqatli mashg'ulotlar natijasi bo'lgan bu g'alabadan g'oyatda mamnun ekanini aytdi.\n\nG'oliblar kuboklar va maxsus sovg'alar bilan mukofotlandi.",
        category:'sport', imageUrl:'', pinned:false,
        authorId:'admin_1', authorName:'Admin Qamashi', authorRole:'admin',
        createdAt:'2025-09-20T14:00:00.000Z', likes:67, views:421, comments:[] },
      { id:'p5', title:"Navro'z bayrami: an'anaviy milliy bayram sho'lasi",
        excerpt:"Navro'z munosabati bilan maktabimizda milliy ruhda bezatilgan bayram dasturi o'tkazildi.",
        body:"Bahor va yangilanish bayramini nishonlash maqsadida maktabimizda Navro'z sho'lasi o'tkazildi.\n\nO'quvchilar milliy kiyimlarda kelib, turli milliy o'yinlar va tomoshalar namoyish etdi. Alohida qism sifatida milliy taomlar ko'rgazmasi tashkil etildi — ota-onalar ham o'z hissalarini qo'shdi.\n\nSho'lada maktab qizlari zarbulmasal va laparlarni ijro etdi. O'quvchilar tomonidan tayyorlangan ko'rgazma ishlari mehmonlarda katta taassurot qoldirdi.\n\nBayramga maktab jamoasi, ota-onalar va mahalla vakillari taklif etildi.",
        category:'madaniyat', imageUrl:'', pinned:false,
        authorId:'admin_1', authorName:'Admin Qamashi', authorRole:'admin',
        createdAt:'2025-03-21T11:00:00.000Z', likes:38, views:193, comments:[] },
      { id:'p6', title:"Kimyo fanidan tuman olimpiadasi g'olibi sifatida tabriklaymiz",
        excerpt:"10-sinf o'quvchimiz kimyo olimpiadasida g'olib bo'lib, viloyat bosqichiga yo'llanma oldi.",
        body:"Qamashi tumani bo'yicha o'tkazilgan kimyo olimpiadasida maktabimizning 10-sinf o'quvchisi Malika Normatova I-o'rinni egalladi.\n\nMalika 5 soatlik musobaqa davomida barcha nazariy va amaliy topshiriqlarni a'lo darajada bajardi. Uning kimyo faniga bo'lgan ishtiyoqi va o'qituvchi Nodira Mamatovaning puxta tayyorgarligi bu natijaning asosiy omillari bo'ldi.\n\nEndi u mart oyida viloyat bosqichida ishtirok etadi. Maktabimiz jamoasi Malikaga katta muvaffaqiyatlar tilaydi va g'alabasiga ishonadi.",
        category:'fan', imageUrl:'', pinned:false,
        authorId:'admin_1', authorName:'Admin Qamashi', authorRole:'admin',
        createdAt:'2025-11-01T09:30:00.000Z', likes:29, views:142, comments:[] }
    ]);
  }
})();

// ── Helpers ───────────────────────────────────────────────────
const esc = s => s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';

function fmtDate(iso){
  if(!iso) return '';
  const d = new Date(iso);
  const mo = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
  return `${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtDateShort(iso){
  if(!iso) return '';
  const d = new Date(iso);
  const mo = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];
  return `${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()}`;
}
function timeAgo(iso){
  const diff = (Date.now() - new Date(iso)) / 1000;
  if(diff < 60) return 'Hozirgina';
  if(diff < 3600) return `${Math.floor(diff/60)} daqiqa oldin`;
  if(diff < 86400) return `${Math.floor(diff/3600)} soat oldin`;
  if(diff < 2592000) return `${Math.floor(diff/86400)} kun oldin`;
  return fmtDateShort(iso);
}
function initials(name){ if(!name) return '?'; const p=name.trim().split(' '); return (p[0][0]+(p[1]?p[1][0]:'')).toUpperCase(); }
function roleName(r){ return {admin:'Administrator',teacher:"O'qituvchi",student:"O'quvchi",parent:'Ota-ona',staff:'Xodim'}[r]||r; }
function catLabel(c){ return {yangilik:'📣 Yangilik',tadbir:'🎉 Tadbir',sport:'⚽ Sport',fan:'🔬 Fan',madaniyat:'🎭 Madaniyat'}[c]||c; }
function catEmoji(c){ return {yangilik:'📣',tadbir:'🎉',sport:'⚽',fan:'🔬',madaniyat:'🎭'}[c]||'📰'; }
function catClass(c){ return 'tag tag-'+c; }
function genId(){ return '_'+(Date.now().toString(36)+Math.random().toString(36).slice(2)); }

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type='info'){
  let root = document.getElementById('toastRoot');
  if(!root){ root=document.createElement('div'); root.id='toastRoot'; document.body.appendChild(root); }
  const icons={success:'✅',error:'❌',warning:'⚠️',info:'ℹ️'};
  const el = document.createElement('div');
  el.className=`toast ${type}`;
  el.innerHTML=`<span class="toast-icon">${icons[type]||'ℹ️'}</span><span class="toast-msg">${esc(msg)}</span><button class="toast-x" onclick="this.parentElement.remove()">✕</button>`;
  root.prepend(el);
  setTimeout(()=>el.remove(), 4200);
}

// ── Modal ─────────────────────────────────────────────────────
function showOverlay(id){ const o=document.getElementById(id); if(o){o.classList.add('show');document.body.style.overflow='hidden'; } }
function hideOverlay(id){ const o=document.getElementById(id); if(o){o.classList.remove('show');document.body.style.overflow=''; } }
function closeAllOverlays(){ document.querySelectorAll('.overlay.show').forEach(o=>{ o.classList.remove('show'); document.body.style.overflow=''; }); }

document.addEventListener('click', e=>{ if(e.target.classList.contains('overlay')) closeAllOverlays(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeAllOverlays(); });

// ── Auth UI ───────────────────────────────────────────────────
function buildNavAuth(){
  const wrap = document.getElementById('navAuth');
  if(!wrap) return;
  const s = getSession();
  if(s){
    const ini = initials(s.firstName+' '+s.lastName);
    wrap.innerHTML=`
      <button class="btn btn-success btn-sm" onclick="openPostEditor()">✏️ Yozish</button>
      <div class="dropdown" id="userDd">
        <div class="user-pill" onclick="toggleDd()">
          <div class="avatar">${ini}</div>
          <span class="name">${esc(s.firstName)}</span>
          <span class="chevron">▼</span>
        </div>
        <div class="dropdown-menu">
          <div class="dd-user">
            <div class="dd-user-name">${esc(s.firstName+' '+s.lastName)}</div>
            <div class="dd-user-sub">@${esc(s.username)} · ${roleName(s.role)}</div>
          </div>
          <button class="dropdown-item" onclick="openProfile()"><span class="di-icon">👤</span>Profilim</button>
          <button class="dropdown-item" onclick="openPostEditor()"><span class="di-icon">✏️</span>Yangilik yozish</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item danger" onclick="doLogout()"><span class="di-icon">🚪</span>Chiqish</button>
        </div>
      </div>`;
  } else {
    wrap.innerHTML=`
      <button class="btn btn-ghost btn-sm" onclick="openAuth('login')">Kirish</button>
      <button class="btn btn-primary btn-sm" onclick="openAuth('register')">Ro'yxatdan o'tish</button>`;
  }
}

function toggleDd(){ document.getElementById('userDd')?.classList.toggle('open'); }
document.addEventListener('click', e=>{ const d=document.getElementById('userDd'); if(d&&!d.contains(e.target)) d.classList.remove('open'); });

// ── Auth Modal ────────────────────────────────────────────────
function openAuth(tab='login'){
  if(getSession()){ toast('Allaqachon tizimdasiz!','info'); return; }
  const overlay = _getOrCreateAuthOverlay();
  showOverlay(overlay.id);
  switchAuthTab(tab);
}

function _getOrCreateAuthOverlay(){
  let o = document.getElementById('authOverlay');
  if(o) return o;
  o = document.createElement('div');
  o.className='overlay'; o.id='authOverlay';
  o.innerHTML=`
  <div class="modal" style="max-width:440px">
    <div class="modal-head">
      <h2 id="authTitle">Kirish</h2>
      <button class="close-btn" onclick="hideOverlay('authOverlay')">✕</button>
    </div>
    <div class="modal-body">
      <div class="auth-tabs">
        <button class="auth-tab active" id="atLogin" onclick="switchAuthTab('login')">Kirish</button>
        <button class="auth-tab" id="atReg" onclick="switchAuthTab('register')">Ro'yxatdan o'tish</button>
      </div>
      <!-- LOGIN -->
      <div class="tab-pane active" id="paneLogin">
        <div class="form-group">
          <label class="form-label req">Username</label>
          <input class="form-control" id="liUser" type="text" placeholder="username" autocomplete="username">
        </div>
        <div class="form-group">
          <label class="form-label req">Parol</label>
          <input class="form-control" id="liPass" type="password" placeholder="••••••" autocomplete="current-password"
            onkeydown="if(event.key==='Enter')doLogin()">
        </div>
        <button class="btn btn-primary btn-block" onclick="doLogin()">🔐 Kirish</button>
        <p style="text-align:center;margin-top:1rem;font-size:.82rem;color:var(--text-muted)">
          Hisob yo'qmi? <button style="background:none;border:none;color:var(--brand);font-weight:600;cursor:pointer;font-size:.82rem" onclick="switchAuthTab('register')">Ro'yxatdan o'ting</button>
        </p>
        <div style="margin-top:1.2rem;padding:10px 14px;background:var(--surface3);border-radius:var(--radius-sm);border:1px solid var(--border)">
          <p style="font-size:.75rem;color:var(--text-muted);margin-bottom:3px"><strong>Test akkaunt (admin):</strong></p>
          <p style="font-size:.75rem;color:var(--text-muted)">Username: <code>admin</code> &nbsp;|&nbsp; Parol: <code>admin123</code></p>
        </div>
      </div>
      <!-- REGISTER -->
      <div class="tab-pane" id="paneReg">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label req">Ism</label>
            <input class="form-control" id="rFname" type="text" placeholder="Ismingiz">
          </div>
          <div class="form-group">
            <label class="form-label req">Familiya</label>
            <input class="form-control" id="rLname" type="text" placeholder="Familiyangiz">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label req">Username</label>
          <input class="form-control" id="rUser" type="text" placeholder="falonchi_99">
          <div class="form-hint">Lotin harflari, raqamlar va _ belgisi</div>
        </div>
        <div class="form-group">
          <label class="form-label">Kim siz?</label>
          <select class="form-control" id="rRole">
            <option value="student">🎓 O'quvchi</option>
            <option value="teacher">👨‍🏫 O'qituvchi</option>
            <option value="parent">👨‍👩‍👧 Ota-ona</option>
            <option value="staff">💼 Xodim</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label req">Parol</label>
          <input class="form-control" id="rPass" type="password" placeholder="Kamida 6 belgi"
            onkeydown="if(event.key==='Enter')doRegister()">
        </div>
        <button class="btn btn-success btn-block" onclick="doRegister()">✅ Ro'yxatdan o'tish</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(o);
  return o;
}

function switchAuthTab(tab){
  ['Login','Reg'].forEach(t=>{
    document.getElementById('at'+t)?.classList.toggle('active', (tab==='login'?'Login':'Reg')===t);
    document.getElementById('pane'+t)?.classList.toggle('active', (tab==='login'?'Login':'Reg')===t);
  });
  const t=document.getElementById('authTitle');
  if(t) t.textContent = tab==='login' ? 'Tizimga kirish' : "Ro'yxatdan o'tish";
}

function doLogin(){
  const user = (document.getElementById('liUser')?.value||'').trim();
  const pass = document.getElementById('liPass')?.value||'';
  if(!user||!pass){ toast('Barcha maydonlarni to\'ldiring!','error'); return; }
  const found = getUsers().find(u=>(u.username===user)&&u.password===pass);
  if(!found){ toast('Username yoki parol noto\'g\'ri!','error'); return; }
  saveSession(found);
  hideOverlay('authOverlay');
  toast(`Xush kelibsiz, ${found.firstName}! 👋`,'success');
  setTimeout(()=>location.reload(), 700);
}

function doRegister(){
  const fn = (document.getElementById('rFname')?.value||'').trim();
  const ln = (document.getElementById('rLname')?.value||'').trim();
  const un = (document.getElementById('rUser')?.value||'').trim();
  const ro = document.getElementById('rRole')?.value||'student';
  const pw = document.getElementById('rPass')?.value||'';
  if(!fn||!ln||!un||!pw){ toast('Barcha maydonlarni to\'ldiring!','error'); return; }
  if(un.length<3){ toast('Username kamida 3 belgi!','error'); return; }
  if(!/^[a-zA-Z0-9_]+$/.test(un)){ toast('Username faqat a-z, 0-9, _ bo\'lishi kerak!','error'); return; }
  if(pw.length<6){ toast('Parol kamida 6 belgi!','error'); return; }
  const users = getUsers();
  if(users.find(u=>u.username===un)){ toast("Bu username band! Boshqa tanlang.",'error'); return; }
  const nu={id:genId(),firstName:fn,lastName:ln,username:un,role:ro,password:pw,joinedAt:new Date().toISOString(),bio:''};
  users.push(nu); saveUsers(users); saveSession(nu);
  hideOverlay('authOverlay');
  toast(`Xush kelibsiz, ${fn}! Hisob yaratildi 🎉`,'success');
  setTimeout(()=>location.reload(), 700);
}

function doLogout(){
  clearSession();
  toast("Tizimdan chiqdingiz. Ko'rishguncha! 👋",'info');
  setTimeout(()=>location.reload(), 700);
}

// ── Post Editor ───────────────────────────────────────────────
let _editId = null;

function openPostEditor(editId){
  const s = getSession();
  if(!s){ toast('Avval tizimga kiring!','warning'); openAuth('login'); return; }
  _editId = editId||null;

  let o = document.getElementById('editorOverlay');
  if(!o){
    o = document.createElement('div');
    o.className='overlay'; o.id='editorOverlay';
    o.innerHTML=`
    <div class="modal modal-xl">
      <div class="modal-head">
        <h2 id="editorTitle">✏️ Yangilik yozish</h2>
        <button class="close-btn" onclick="hideOverlay('editorOverlay')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label req">Sarlavha</label>
          <input class="form-control" id="eTitle" type="text" placeholder="Sarlavhani kiriting..." maxlength="140" style="font-size:1.05rem;font-weight:600">
        </div>
        <div class="form-row" style="gap:.8rem">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Kategoriya</label>
            <div class="cat-picker" id="eCatPicker">
              <button type="button" class="cat-pill active" data-v="yangilik" onclick="pickCat(this)">📣 Yangilik</button>
              <button type="button" class="cat-pill" data-v="tadbir"   onclick="pickCat(this)">🎉 Tadbir</button>
              <button type="button" class="cat-pill" data-v="sport"    onclick="pickCat(this)">⚽ Sport</button>
              <button type="button" class="cat-pill" data-v="fan"      onclick="pickCat(this)">🔬 Fan</button>
              <button type="button" class="cat-pill" data-v="madaniyat" onclick="pickCat(this)">🎭 Madaniyat</button>
            </div>
          </div>
        </div>
        <div class="form-group" style="margin-top:1rem">
          <label class="form-label">Qisqa mazmun <span style="color:var(--text-faint);font-weight:400">(ixtiyoriy — bo'sh qoldirsangiz avtomatik to'ldiriladi)</span></label>
          <input class="form-control" id="eExcerpt" type="text" placeholder="Yangilikni 1-2 jumlada qisqacha ifodalang..." maxlength="280">
        </div>
        <div class="form-group">
          <label class="form-label">Muqova rasm <span style="color:var(--text-faint);font-weight:400">(ixtiyoriy)</span></label>
          <div class="img-drop" id="eImgDrop">
            <input type="file" id="eImgFile" accept="image/*" onchange="handleImgPick(this)">
            <div class="drop-icon">🖼️</div>
            <p>Rasm tanlash uchun bosing</p>
            <span class="drop-hint">JPG, PNG — maks 4 MB</span>
            <img id="eImgPreview" class="img-preview-box" src="" alt="">
          </div>
          <button type="button" id="eImgClear" style="display:none;margin-top:6px" class="btn btn-ghost btn-sm" onclick="clearImg()">🗑️ Rasmni olib tashlash</button>
        </div>
        <div class="form-group">
          <label class="form-label req">Maqola matni</label>
          <div class="editor-toolbar">
            <button type="button" class="tb-btn" onclick="wrapText('**','**')" title="Bold"><b>B</b></button>
            <button type="button" class="tb-btn" onclick="wrapText('_','_')" title="Italic"><i>I</i></button>
            <button type="button" class="tb-btn" onclick="insertLine('• ')" title="Ro'yxat">☰</button>
            <button type="button" class="tb-btn" onclick="insertLine('📌 ')" title="Muhim">📌</button>
            <button type="button" class="tb-btn" onclick="insertBreak()" title="Satr">↵</button>
          </div>
          <textarea class="form-control editor-body" id="eBody" rows="10"
            placeholder="Yangilik matnini bu yerga yozing...

Parchalar:
• Birinchi fikr
• Ikkinchi fikr"></textarea>
          <div class="form-hint" id="eBodyHint" style="text-align:right">0 / — belgi</div>
        </div>
        <div style="display:flex;gap:.8rem;justify-content:flex-end;padding-top:1rem;border-top:1px solid var(--border)">
          <button class="btn btn-ghost" onclick="hideOverlay('editorOverlay')">Bekor qilish</button>
          <button class="btn btn-success" id="eSubmitBtn" onclick="submitPost()">🚀 Chop etish</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(o);

    document.getElementById('eBody').addEventListener('input', function(){
      document.getElementById('eBodyHint').textContent = this.value.length+' belgi';
    });

    // drag & drop
    const drop = document.getElementById('eImgDrop');
    drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag')});
    drop.addEventListener('dragleave',()=>drop.classList.remove('drag'));
    drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag');
      const f=e.dataTransfer.files[0]; if(f&&f.type.startsWith('image/')){ const dt=new DataTransfer(); dt.items.add(f); document.getElementById('eImgFile').files=dt.files; handleImgPick(document.getElementById('eImgFile')); }});
  }

  // Fill form
  if(_editId){
    const p=getPosts().find(x=>x.id===_editId);
    if(p){
      document.getElementById('eTitle').value=p.title;
      document.getElementById('eExcerpt').value=p.excerpt||'';
      document.getElementById('eBody').value=p.body;
      document.getElementById('eBodyHint').textContent=p.body.length+' belgi';
      document.getElementById('editorTitle').textContent='✏️ Maqolani tahrirlash';
      document.getElementById('eSubmitBtn').textContent='💾 Saqlash';
      document.querySelectorAll('.cat-pill').forEach(c=>c.classList.toggle('active',c.dataset.v===p.category));
      if(p.imageUrl){ const pr=document.getElementById('eImgPreview'); pr.src=p.imageUrl; pr.style.display='block'; document.getElementById('eImgClear').style.display='inline-flex'; }
      else { clearImg(false); }
    }
  } else {
    document.getElementById('eTitle').value='';
    document.getElementById('eExcerpt').value='';
    document.getElementById('eBody').value='';
    document.getElementById('eBodyHint').textContent='0 belgi';
    document.getElementById('editorTitle').textContent='✏️ Yangilik yozish';
    document.getElementById('eSubmitBtn').textContent='🚀 Chop etish';
    document.querySelectorAll('.cat-pill').forEach((c,i)=>c.classList.toggle('active',i===0));
    clearImg(false);
  }

  showOverlay('editorOverlay');
}

function pickCat(btn){ document.querySelectorAll('.cat-pill').forEach(c=>c.classList.remove('active')); btn.classList.add('active'); }

function handleImgPick(input){
  const f=input.files[0]; if(!f) return;
  if(f.size>4*1024*1024){ toast('Rasm 4 MB dan kichik bo\'lsin!','error'); return; }
  const r=new FileReader();
  r.onload=e=>{
    const pr=document.getElementById('eImgPreview'); pr.src=e.target.result; pr.style.display='block';
    document.getElementById('eImgClear').style.display='inline-flex';
  };
  r.readAsDataURL(f);
}

function clearImg(resetInput=true){
  const pr=document.getElementById('eImgPreview'); if(pr){pr.src='';pr.style.display='none';}
  if(resetInput){ const fi=document.getElementById('eImgFile'); if(fi) fi.value=''; }
  const cb=document.getElementById('eImgClear'); if(cb) cb.style.display='none';
}

function wrapText(before,after){
  const ta=document.getElementById('eBody'); if(!ta) return;
  const s=ta.selectionStart,e=ta.selectionEnd,v=ta.value;
  const sel=v.slice(s,e)||'matn';
  ta.value=v.slice(0,s)+before+sel+after+v.slice(e);
  ta.focus(); ta.selectionStart=s+before.length; ta.selectionEnd=s+before.length+sel.length;
  ta.dispatchEvent(new Event('input'));
}
function insertLine(prefix){
  const ta=document.getElementById('eBody'); if(!ta) return;
  const p=ta.selectionStart,v=ta.value;
  const nl=p>0&&v[p-1]!=='\n'?'\n':'';
  ta.value=v.slice(0,p)+nl+prefix+v.slice(p);
  ta.focus(); const np=p+nl.length+prefix.length; ta.selectionStart=ta.selectionEnd=np;
  ta.dispatchEvent(new Event('input'));
}
function insertBreak(){
  const ta=document.getElementById('eBody'); if(!ta) return;
  const p=ta.selectionStart,v=ta.value;
  ta.value=v.slice(0,p)+'\n\n'+v.slice(p);
  ta.focus(); ta.selectionStart=ta.selectionEnd=p+2;
  ta.dispatchEvent(new Event('input'));
}

function submitPost(){
  const s=getSession(); if(!s) return;
  const title=(document.getElementById('eTitle')?.value||'').trim();
  const excerpt=(document.getElementById('eExcerpt')?.value||'').trim();
  const body=(document.getElementById('eBody')?.value||'').trim();
  const cat=document.querySelector('.cat-pill.active')?.dataset.v||'yangilik';
  const imgSrc=document.getElementById('eImgPreview')?.src||'';
  const imageUrl=(imgSrc&&!imgSrc.endsWith('/')?imgSrc:'');

  if(!title){ toast('Sarlavha kiritish shart!','error'); return; }
  if(title.length<5){ toast('Sarlavha juda qisqa!','error'); return; }
  if(!body){ toast('Maqola matni kiritish shart!','error'); return; }
  if(body.length<30){ toast('Maqola matni juda qisqa (kamida 30 belgi)!','error'); return; }

  const finalExcerpt = excerpt || body.slice(0,180).replace(/\n/g,' ')+'…';
  const posts=getPosts();

  if(_editId){
    const idx=posts.findIndex(p=>p.id===_editId);
    if(idx!==-1&&(posts[idx].authorId===s.id||s.role==='admin')){
      posts[idx]={...posts[idx],title,excerpt:finalExcerpt,body,category:cat,imageUrl,updatedAt:new Date().toISOString()};
      savePosts(posts); hideOverlay('editorOverlay'); toast('Maqola yangilandi! ✅','success');
      setTimeout(()=>location.reload(),700);
    } else { toast("Tahrirlash huquqi yo'q!",'error'); }
  } else {
    const np={
      id:genId(),title,excerpt:finalExcerpt,body,category:cat,imageUrl,
      pinned:false,authorId:s.id,authorName:s.firstName+' '+s.lastName,
      authorRole:s.role,createdAt:new Date().toISOString(),
      likes:0,views:0,comments:[]
    };
    posts.unshift(np); savePosts(posts);
    const users=getUsers(); const ui=users.findIndex(u=>u.id===s.id);
    if(ui!==-1){ users[ui].postsCount=(users[ui].postsCount||0)+1; saveUsers(users); }
    hideOverlay('editorOverlay'); toast('Yangilik chop etildi! 🎉','success');
    setTimeout(()=>location.reload(),700);
  }
}

function deletePost(id){
  const s=getSession(); if(!s) return;
  if(!confirm("Bu yangilikni o'chirishni tasdiqlaysizmi?")) return;
  const posts=getPosts(); const idx=posts.findIndex(p=>p.id===id); if(idx===-1) return;
  if(posts[idx].authorId!==s.id&&s.role!=='admin'){ toast("O'chirish huquqi yo'q!",'error'); return; }
  posts.splice(idx,1); savePosts(posts); toast("Yangilik o'chirildi!",'info');
  setTimeout(()=>location.reload(),600);
}

// ── Like ──────────────────────────────────────────────────────
function toggleLike(postId){
  const liked=getLiked();
  const posts=getPosts(); const p=posts.find(x=>x.id===postId); if(!p) return;
  let isLiked;
  if(liked.includes(postId)){
    const i=liked.indexOf(postId); liked.splice(i,1); p.likes=Math.max(0,(p.likes||0)-1); isLiked=false;
  } else {
    liked.push(postId); p.likes=(p.likes||0)+1; isLiked=true;
  }
  saveLiked(liked); savePosts(posts);
  document.querySelectorAll(`[data-like="${postId}"]`).forEach(btn=>{
    btn.classList.toggle('liked',isLiked);
    btn.innerHTML=`${isLiked?'❤️':'🤍'} ${p.likes}`;
  });
}

// ── View Post ─────────────────────────────────────────────────
function viewPost(id){
  const posts=getPosts(); const p=posts.find(x=>x.id===id); if(!p) return;
  p.views=(p.views||0)+1; savePosts(posts);

  const s=getSession();
  const canEdit=s&&(s.id===p.authorId||s.role==='admin');
  const liked=getLiked().includes(id);

  let o=document.getElementById('viewOverlay');
  if(!o){ o=document.createElement('div'); o.className='overlay'; o.id='viewOverlay'; document.body.appendChild(o); }

  o.innerHTML=`
  <div class="modal modal-xl">
    <div class="modal-head">
      <span class="${catClass(p.category)}" style="font-size:.75rem">${catLabel(p.category)}</span>
      <div style="display:flex;gap:6px;align-items:center">
        ${canEdit?`<button class="btn btn-ghost btn-sm" onclick="hideOverlay('viewOverlay');openPostEditor('${p.id}')">✏️ Tahrirlash</button>
        <button class="btn btn-danger btn-sm" onclick="hideOverlay('viewOverlay');deletePost('${p.id}')">🗑️</button>`:''}
        <button class="close-btn" onclick="hideOverlay('viewOverlay')">✕</button>
      </div>
    </div>
    <div class="modal-body">
      ${p.imageUrl?`<img src="${esc(p.imageUrl)}" alt="${esc(p.title)}" class="post-hero-img">`:''}
      <h1 class="post-title-full">${esc(p.title)}</h1>
      <div class="post-meta-row">
        <div style="display:flex;align-items:center;gap:7px">
          <div class="avatar-sm">${initials(p.authorName)}</div>
          <span style="font-size:.84rem;font-weight:600">${esc(p.authorName)}</span>
          ${p.authorRole==='admin'?'<span class="badge-admin">Admin</span>':'<span class="badge-role">'+roleName(p.authorRole)+'</span>'}
        </div>
        <span style="font-size:.8rem;color:var(--text-faint)">📅 ${fmtDate(p.createdAt)}</span>
        <span style="font-size:.8rem;color:var(--text-faint)">👁 ${p.views} ko'rildi</span>
        <button class="like-btn ${liked?'liked':''}" data-like="${p.id}" onclick="toggleLike('${p.id}')">
          ${liked?'❤️':'🤍'} ${p.likes||0}
        </button>
      </div>
      <div class="post-body-text">${esc(p.body)}</div>
      ${_buildComments(p)}
    </div>
  </div>`;
  showOverlay('viewOverlay');
}

function _buildComments(p){
  const s=getSession();
  const comments=(p.comments||[]);
  const listHtml=comments.length===0
    ? `<p style="color:var(--text-faint);font-size:.85rem;text-align:center;padding:1rem 0">Hali izoh yo'q. Birinchi bo'ling!</p>`
    : comments.map(c=>`
      <div style="display:flex;gap:10px;padding:.9rem 0;border-bottom:1px solid var(--border)">
        <div class="avatar-sm">${initials(c.authorName)}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
            <span style="font-size:.84rem;font-weight:700">${esc(c.authorName)}</span>
            <span style="font-size:.73rem;color:var(--text-faint)">${timeAgo(c.createdAt)}</span>
          </div>
          <p style="font-size:.875rem;color:var(--text-2);line-height:1.6">${esc(c.text)}</p>
        </div>
      </div>`).join('');

  const form=s?`
    <div style="display:flex;gap:10px;margin-top:1rem;align-items:flex-start">
      <div class="avatar-sm">${initials(s.firstName+' '+s.lastName)}</div>
      <div style="flex:1">
        <textarea class="form-control" id="cmtInput_${p.id}" rows="2"
          placeholder="Izoh yozing..." style="min-height:60px;resize:none;font-size:.875rem"></textarea>
        <button class="btn btn-primary btn-sm" style="margin-top:6px" onclick="addComment('${p.id}')">Yuborish</button>
      </div>
    </div>`
    :`<div style="text-align:center;padding:1rem;background:var(--surface3);border-radius:var(--radius-sm);margin-top:1rem">
      <p style="font-size:.85rem;color:var(--text-muted)">Izoh yozish uchun <button style="background:none;border:none;color:var(--brand);font-weight:600;cursor:pointer" onclick="hideOverlay('viewOverlay');openAuth('login')">tizimga kiring</button></p>
    </div>`;

  return `<div style="margin-top:2rem;padding-top:1.5rem;border-top:2px solid var(--border)">
    <h4 style="font-size:1rem;font-weight:700;margin-bottom:1rem">💬 Izohlar (${comments.length})</h4>
    <div id="cmtList_${p.id}">${listHtml}</div>
    ${form}
  </div>`;
}

function addComment(postId){
  const s=getSession(); if(!s){ toast('Avval kiring!','warning'); return; }
  const ta=document.getElementById(`cmtInput_${postId}`); if(!ta) return;
  const text=ta.value.trim();
  if(!text){ toast('Izoh bo\'sh bo\'lmasin!','error'); return; }
  if(text.length>600){ toast('Izoh juda uzun (maks 600 belgi)!','error'); return; }
  const posts=getPosts(); const p=posts.find(x=>x.id===postId); if(!p) return;
  if(!p.comments) p.comments=[];
  p.comments.push({ id:genId(), authorId:s.id, authorName:s.firstName+' '+s.lastName, text, createdAt:new Date().toISOString() });
  savePosts(posts); ta.value='';
  const listEl=document.getElementById(`cmtList_${postId}`);
  if(listEl) listEl.innerHTML=`<div style="display:flex;gap:10px;padding:.9rem 0">${'<div class="avatar-sm">'+initials(s.firstName+' '+s.lastName)+'</div>'}<div style="flex:1"><div style="font-size:.84rem;font-weight:700;margin-bottom:3px">${esc(s.firstName+' '+s.lastName)} <span style="font-size:.73rem;color:var(--text-faint)">Hozirgina</span></div><p style="font-size:.875rem;color:var(--text-2)">${esc(text)}</p></div></div>`+listEl.innerHTML;
  toast('Izoh qo\'shildi! ✅','success');
}

// ── Profile ───────────────────────────────────────────────────
function openProfile(){
  const s=getSession(); if(!s) return;
  const posts=getPosts().filter(p=>p.authorId===s.id);
  const totalLikes=posts.reduce((a,p)=>a+(p.likes||0),0);
  const totalViews=posts.reduce((a,p)=>a+(p.views||0),0);

  let o=document.getElementById('profileOverlay');
  if(!o){ o=document.createElement('div'); o.className='overlay'; o.id='profileOverlay'; document.body.appendChild(o); }
  o.innerHTML=`
  <div class="modal modal-lg">
    <div class="modal-head">
      <h2>👤 Profilim</h2>
      <button class="close-btn" onclick="hideOverlay('profileOverlay')">✕</button>
    </div>
    <div class="profile-banner">
      <div class="profile-av">${initials(s.firstName+' '+s.lastName)}</div>
      <h3>${esc(s.firstName+' '+s.lastName)}</h3>
      <p class="sub">@${esc(s.username)} · ${roleName(s.role)}</p>
      ${s.bio?`<p style="font-size:.82rem;color:rgba(255,255,255,.6);margin-top:6px;max-width:320px;margin-inline:auto">${esc(s.bio)}</p>`:''}
      <div class="profile-stats-row">
        <div class="ps-item"><div class="ps-n">${posts.length}</div><div class="ps-l">Maqolalar</div></div>
        <div class="ps-item"><div class="ps-n">${totalLikes}</div><div class="ps-l">Like'lar</div></div>
        <div class="ps-item"><div class="ps-n">${totalViews}</div><div class="ps-l">Ko'rishlar</div></div>
      </div>
    </div>
    <div class="modal-body">
      <div style="padding:.8rem 1rem;background:var(--surface3);border-radius:var(--radius-sm);margin-bottom:1.5rem;font-size:.82rem;color:var(--text-muted)">
        📅 A'zo bo'lgan: <strong>${fmtDate(s.joinedAt)}</strong>
      </div>
      ${posts.length>0?`
      <div style="font-size:.92rem;font-weight:700;margin-bottom:.9rem">Mening maqolalarim (${posts.length})</div>
      <div style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto;padding-right:4px">
        ${posts.map(p=>`
        <div class="post-list-item">
          <div style="flex:1;min-width:0">
            <div class="pli-title">${esc(p.title)}</div>
            <div class="pli-meta">${fmtDateShort(p.createdAt)} · ❤️${p.likes||0} · 👁${p.views||0} ko'rildi</div>
          </div>
          <div style="display:flex;gap:5px;flex-shrink:0">
            <button class="btn btn-ghost btn-sm" onclick="hideOverlay('profileOverlay');openPostEditor('${p.id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="hideOverlay('profileOverlay');deletePost('${p.id}')">🗑️</button>
          </div>
        </div>`).join('')}
      </div>`:`
      <div class="empty-state" style="padding:2rem">
        <div class="empty-icon">📝</div>
        <h3>Hali maqola yo'q</h3>
        <p>Birinchi yangilikni siz yozing!</p>
        <button class="btn btn-primary btn-sm" onclick="hideOverlay('profileOverlay');openPostEditor()">Maqola yozish</button>
      </div>`}
    </div>
  </div>`;
  showOverlay('profileOverlay');
}

// ── Post Card ─────────────────────────────────────────────────
function renderCard(p, delay=0){
  const liked=getLiked().includes(p.id);
  const s=getSession();
  const canEdit=s&&(s.id===p.authorId||s.role==='admin');

  return `
  <div class="post-card" style="animation-delay:${delay}s">
    ${p.imageUrl
      ?`<img src="${esc(p.imageUrl)}" class="pc-img" alt="${esc(p.title)}" loading="lazy" onerror="this.style.display='none'">`
      :`<div class="pc-placeholder">${catEmoji(p.category)}</div>`}
    <div class="pc-body">
      <div class="pc-meta">
        <span class="${catClass(p.category)}">${catLabel(p.category)}</span>
        <span class="pc-date">📅 ${fmtDateShort(p.createdAt)}</span>
        ${p.pinned?'<span style="font-size:.7rem;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:99px;font-weight:700">📌 Muhim</span>':''}
      </div>
      <div class="pc-title">${esc(p.title)}</div>
      <div class="pc-excerpt">${esc(p.excerpt)}</div>
      <div class="pc-footer">
        <div class="pc-author">
          <div class="avatar-sm">${initials(p.authorName)}</div>
          <span>${esc(p.authorName)}</span>
          ${p.authorRole==='admin'?'<span class="badge-admin">Admin</span>':''}
        </div>
        <div class="pc-actions">
          <button class="like-btn ${liked?'liked':''}" data-like="${p.id}" onclick="toggleLike('${p.id}')">${liked?'❤️':'🤍'} ${p.likes||0}</button>
          ${canEdit?`<button class="btn-icon btn btn-ghost btn-sm" onclick="deletePost('${p.id}')" title="O'chirish" style="width:28px;height:28px;font-size:.8rem">🗑️</button>`:''}
          <button class="read-btn" onclick="viewPost('${p.id}')">Ko'rish →</button>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Navbar mobile ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  const hb=document.getElementById('hamburger');
  const nl=document.getElementById('navLinks');
  if(hb&&nl){ hb.addEventListener('click',()=>{ hb.classList.toggle('open'); nl.classList.toggle('open'); }); }

  // scroll effects
  const nav=document.getElementById('mainNav');
  if(nav){
    window.addEventListener('scroll',()=>{ nav.classList.toggle('scrolled',scrollY>40); });
  }

  // scroll-top btn
  window.addEventListener('scroll',()=>{
    const b=document.getElementById('scrollTopBtn');
    if(b) b.classList.toggle('show',scrollY>400);
  });

  buildNavAuth();

  // write section
  const ws=document.getElementById('writeBanner');
  if(ws) ws.style.display=getSession()?'flex':'none';
});

// ── scroll top ────────────────────────────────────────────────
function scrollTop(){ window.scrollTo({top:0,behavior:'smooth'}); }
