// ===== QamashiIM App.js =====
// localStorage-based auth + post system

// ===== STORAGE HELPERS =====
const USERS_KEY = 'qamashi_users';
const POSTS_KEY = 'qamashi_posts';
const SESSION_KEY = 'qamashi_session';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getPosts() {
  return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
}
function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}
function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}
function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ===== SEED DATA =====
function seedData() {
  const users = getUsers();
  if (users.length === 0) {
    const admin = {
      id: 'admin_001',
      firstName: 'Admin',
      lastName: 'Qamashi',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      joinedAt: new Date('2023-09-01').toISOString(),
      postsCount: 3
    };
    saveUsers([admin]);
  }

  const posts = getPosts();
  if (posts.length === 0) {
    const seedPosts = [
      {
        id: 'post_001',
        title: 'Maktabimizda Zakovat musobaqasi bo\'lib o\'tdi',
        excerpt: 'O\'quvchilarimiz bilim musobaqasida o\'zlarining iqtidorlarini namoyish etdi va yuqori natijalarni qo\'lga kiritdi.',
        body: `Qamashi tumani ixtisoslashtirilgan maktabida o'tkazilgan Zakovat musobaqasi barcha ishtirokchilarga katta taassurot qoldirdi.\n\nMusobaqada 8-11-sinf o'quvchilari faol ishtirok etdi. Savol-javob tarzida o'tkazilgan bu intellektual musobaqa o'quvchilarning bilim salohiyatini oshirishga xizmat qildi.\n\nG'oliblar taqdirlandi va ularning yutuqlari barcha uchun ibrat bo'ldi. Maktab rahbariyati bunday tadbirlarni muntazam o'tkazib borishni rejalashtiryapti.`,
        category: 'tadbir',
        imageUrl: '',
        authorId: 'admin_001',
        authorName: 'Admin Qamashi',
        authorRole: 'admin',
        createdAt: new Date('2025-01-15').toISOString(),
        likes: 24,
        views: 156
      },
      {
        id: 'post_002',
        title: 'Olimpiada g\'oliblarimiz Viloyat bosqichida ham g\'olib bo\'ldi',
        excerpt: 'Matematika va fizika fanlaridan o\'tkazilgan viloyat olimpiadasida maktabimiz o\'quvchilari yuksak natijalar ko\'rsatdi.',
        body: `Maktabimiz o\'quvchilari viloyat olimpiadasida ishtirok etib, munosib natijalar qo\'lga kiritishdi.\n\nMatematika fanidan 9-sinf o\'quvchisi birinchi o\'rinni egalladi. Fizika fanidan 10-sinf o\'quvchisi ikkinchi o\'ringa sazovor bo\'ldi.\n\nBu natijalar maktabimizning ta\'lim sifati yuqori ekanligini yana bir bor isbotladi. O\'qituvchilarimizning fidokorona mehnati samarasi o\'laroq bu yutuqlarga erishildi.`,
        category: 'fan',
        imageUrl: '',
        authorId: 'admin_001',
        authorName: 'Admin Qamashi',
        authorRole: 'admin',
        createdAt: new Date('2025-02-10').toISOString(),
        likes: 38,
        views: 242
      },
      {
        id: 'post_003',
        title: 'Yangi o\'quv yili munosabati bilan bayram tadbirlar',
        excerpt: '2024-2025 o\'quv yili boshlanishi munosabati bilan maktabimizda tantanali marosim bo\'lib o\'tdi.',
        body: `2024-2025 o'quv yilining boshlanishi munosabati bilan maktabimizda ajoyib bayram kayfiyati hukm surdi.\n\nBirinchi qo'ng'iroq tantanasida o'quvchilar, ota-onalar va o'qituvchilar qatnashdi. 1-sinf o'quvchilari birinchi marta maktab ostonasini hatlab, yangi hayotga qadam qo'ydi.\n\nMaktab direktori so'zga chiqib, barcha o'quvchilarga muvaffaqiyatli o'quv yilini tiladi. Ota-onalar farzandlariga chiroyli guldastalar sovg'a qildi.`,
        category: 'yangilik',
        imageUrl: '',
        authorId: 'admin_001',
        authorName: 'Admin Qamashi',
        authorRole: 'admin',
        createdAt: new Date('2024-09-02').toISOString(),
        likes: 45,
        views: 320
      }
    ];
    savePosts(seedPosts);
  }
}

// Run seed
seedData();

// ===== AUTH UI =====
function updateNavAuth() {
  const session = getSession();
  const navAuth = document.getElementById('navAuth');
  if (!navAuth) return;

  if (session) {
    const initial = (session.firstName[0] + session.lastName[0]).toUpperCase();
    navAuth.innerHTML = `
      <button class="btn btn-success btn-sm" onclick="openPostModal()" id="writeBtn">✏️ Yozish</button>
      <div class="dropdown" id="userDropdown">
        <button class="user-avatar-btn" onclick="toggleDropdown()">
          <div class="avatar-circle">${initial}</div>
          <span>${session.firstName}</span>
          <span style="font-size:0.7rem;margin-left:2px">▼</span>
        </button>
        <div class="dropdown-menu" id="dropdownMenu">
          <div style="padding:10px 14px;border-bottom:1px solid var(--border)">
            <div style="font-weight:700;font-size:0.9rem">${session.firstName} ${session.lastName}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">@${session.username} · ${getRoleName(session.role)}</div>
          </div>
          <button class="dropdown-item" onclick="openProfileModal()">👤 Profil</button>
          <button class="dropdown-item" onclick="openPostModal()">✏️ Yangilik yozish</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item danger" onclick="handleLogout()">🚪 Chiqish</button>
        </div>
      </div>
    `;
  } else {
    navAuth.innerHTML = `
      <button class="btn btn-outline btn-sm" onclick="openAuthModal('login')">Kirish</button>
      <button class="btn btn-primary btn-sm" onclick="openAuthModal('register')">Ro'yxatdan o'tish</button>
    `;
  }
}

function getRoleName(role) {
  const map = { admin: 'Administrator', teacher: 'O\'qituvchi', student: 'O\'quvchi', parent: 'Ota-ona', staff: 'Xodim' };
  return map[role] || role;
}

function toggleDropdown() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.toggle('open');
}

document.addEventListener('click', function(e) {
  const dd = document.getElementById('userDropdown');
  if (dd && !dd.contains(e.target)) dd.classList.remove('open');
});

// ===== MODAL HELPERS =====
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close on overlay click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===== AUTH MODAL =====
function openAuthModal(tab) {
  const session = getSession();
  if (session) {
    showToast('Siz allaqachon tizimga kirgansiz!', 'info');
    return;
  }
  openModal('authModal');
  switchAuthTab(tab);
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginContent = document.getElementById('loginContent');
  const registerContent = document.getElementById('registerContent');
  const title = document.getElementById('authModalTitle');

  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginContent.classList.add('active');
    registerContent.classList.remove('active');
    if (title) title.textContent = 'Tizimga kirish';
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerContent.classList.add('active');
    loginContent.classList.remove('active');
    if (title) title.textContent = 'Ro\'yxatdan o\'tish';
  }
}

function handleLogin() {
  const username = document.getElementById('loginUsername')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;

  if (!username || !password) {
    showToast('Barcha maydonlarni to\'ldiring!', 'error');
    return;
  }

  const users = getUsers();
  const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

  if (!user) {
    showToast('Username yoki parol noto\'g\'ri!', 'error');
    return;
  }

  saveSession(user);
  closeModal('authModal');
  showToast(`Xush kelibsiz, ${user.firstName}! 👋`, 'success');
  updateNavAuth();
  setTimeout(() => location.reload(), 800);
}

function handleRegister() {
  const firstName = document.getElementById('regFirstName')?.value.trim();
  const lastName = document.getElementById('regLastName')?.value.trim();
  const username = document.getElementById('regUsername')?.value.trim();
  const role = document.getElementById('regRole')?.value;
  const password = document.getElementById('regPassword')?.value;

  if (!firstName || !lastName || !username || !password) {
    showToast('Barcha maydonlarni to\'ldiring!', 'error');
    return;
  }

  if (username.length < 3) {
    showToast('Username kamida 3 ta belgi bo\'lishi kerak!', 'error');
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showToast('Username faqat lotin harflari, raqamlar va _ dan iborat bo\'lsin!', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Parol kamida 6 ta belgi bo\'lishi kerak!', 'error');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.username === username)) {
    showToast('Bu username band! Boshqa username tanlang.', 'error');
    return;
  }

  const newUser = {
    id: 'user_' + Date.now(),
    firstName,
    lastName,
    username,
    role: role || 'student',
    password,
    joinedAt: new Date().toISOString(),
    postsCount: 0
  };

  users.push(newUser);
  saveUsers(users);
  saveSession(newUser);
  closeModal('authModal');
  showToast(`Muvaffaqiyatli ro'yxatdan o'tdingiz, ${firstName}! 🎉`, 'success');
  updateNavAuth();
  setTimeout(() => location.reload(), 800);
}

function handleLogout() {
  clearSession();
  showToast('Tizimdan chiqdingiz. Xayr! 👋', 'info');
  updateNavAuth();
  setTimeout(() => location.reload(), 800);
}

// ===== POST MODAL =====
function openPostModal(editId) {
  const session = getSession();
  if (!session) {
    showToast('Yangilik yozish uchun avval tizimga kiring!', 'warning');
    openAuthModal('login');
    return;
  }

  const modal = document.getElementById('postModal');
  if (!modal) {
    createPostModal();
  }

  if (editId) {
    const post = getPosts().find(p => p.id === editId);
    if (post) {
      document.getElementById('postTitle').value = post.title;
      document.getElementById('postBody').value = post.body;
      document.getElementById('postExcerpt').value = post.excerpt;
      document.getElementById('postModalTitle').textContent = 'Maqolani tahrirlash';
      document.getElementById('postSubmitBtn').setAttribute('data-edit-id', editId);
      // Set category
      document.querySelectorAll('.cat-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.value === post.category);
      });
    }
  } else {
    const form = document.getElementById('postFormEl');
    if (form) form.reset();
    const submitBtn = document.getElementById('postSubmitBtn');
    if (submitBtn) submitBtn.removeAttribute('data-edit-id');
    const titleEl = document.getElementById('postModalTitle');
    if (titleEl) titleEl.textContent = 'Yangilik yozish';
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('.cat-chip[data-value="yangilik"]')?.classList.add('active');
  }

  openModal('postModalOverlay');
}

function createPostModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'postModalOverlay';
  overlay.innerHTML = `
    <div class="modal modal-lg" id="postModal">
      <div class="modal-header">
        <h2 id="postModalTitle">✏️ Yangilik yozish</h2>
        <button class="modal-close" onclick="closeModal('postModalOverlay')">✕</button>
      </div>
      <div class="modal-body">
        <form id="postFormEl" onsubmit="return false">
          <div class="form-group">
            <label class="form-label">Sarlavha *</label>
            <input type="text" class="form-control" id="postTitle" placeholder="Yangilik sarlavhasini kiriting..." maxlength="120">
          </div>
          <div class="form-group">
            <label class="form-label">Qisqa mazmun *</label>
            <input type="text" class="form-control" id="postExcerpt" placeholder="Yangilikni qisqacha izohlang..." maxlength="250">
          </div>
          <div class="form-group">
            <label class="form-label">Kategoriya</label>
            <div class="post-categories">
              <button type="button" class="cat-chip active" data-value="yangilik" onclick="selectCat(this)">📣 Yangilik</button>
              <button type="button" class="cat-chip" data-value="tadbir" onclick="selectCat(this)">🎉 Tadbir</button>
              <button type="button" class="cat-chip" data-value="sport" onclick="selectCat(this)">⚽ Sport</button>
              <button type="button" class="cat-chip" data-value="fan" onclick="selectCat(this)">🔬 Fan</button>
              <button type="button" class="cat-chip" data-value="madaniyat" onclick="selectCat(this)">🎭 Madaniyat</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Rasm (ixtiyoriy)</label>
            <div class="img-upload-area" onclick="document.getElementById('postImageInput').click()">
              <div class="upload-icon">🖼️</div>
              <p>Rasm yuklash uchun bosing</p>
              <input type="file" id="postImageInput" accept="image/*" style="display:none" onchange="previewImage(this)">
              <img id="postImgPreview" class="img-preview" src="" alt="preview">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Maqola matni *</label>
            <textarea class="form-control" id="postBody" placeholder="Yangilik matnini bu yerga yozing..." style="min-height:200px"></textarea>
          </div>
          <div style="display:flex;gap:1rem;justify-content:flex-end">
            <button type="button" class="btn btn-outline" onclick="closeModal('postModalOverlay')">Bekor qilish</button>
            <button type="button" class="btn btn-success" id="postSubmitBtn" onclick="submitPost()">🚀 Chop etish</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function selectCat(chip) {
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
}

function previewImage(input) {
  const file = input.files[0];
  const preview = document.getElementById('postImgPreview');
  if (file && preview) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function submitPost() {
  const session = getSession();
  if (!session) return;

  const title = document.getElementById('postTitle')?.value.trim();
  const excerpt = document.getElementById('postExcerpt')?.value.trim();
  const body = document.getElementById('postBody')?.value.trim();
  const category = document.querySelector('.cat-chip.active')?.dataset.value || 'yangilik';
  const editId = document.getElementById('postSubmitBtn')?.getAttribute('data-edit-id');
  const imgInput = document.getElementById('postImageInput');

  if (!title) { showToast('Sarlavha kiritish shart!', 'error'); return; }
  if (!body) { showToast('Maqola matni kiritish shart!', 'error'); return; }

  const finalExcerpt = excerpt || body.substring(0, 160) + '...';

  const saveWithImage = (imageUrl) => {
    const posts = getPosts();

    if (editId) {
      // Edit existing
      const idx = posts.findIndex(p => p.id === editId);
      if (idx !== -1 && (posts[idx].authorId === session.id || session.role === 'admin')) {
        posts[idx] = { ...posts[idx], title, excerpt: finalExcerpt, body, category, imageUrl: imageUrl || posts[idx].imageUrl, updatedAt: new Date().toISOString() };
        savePosts(posts);
        closeModal('postModalOverlay');
        showToast('Maqola yangilandi! ✅', 'success');
        setTimeout(() => location.reload(), 700);
      } else {
        showToast('Bu maqolani tahrirlash huquqi yo\'q!', 'error');
      }
    } else {
      // New post
      const newPost = {
        id: 'post_' + Date.now(),
        title,
        excerpt: finalExcerpt,
        body,
        category,
        imageUrl: imageUrl || '',
        authorId: session.id,
        authorName: session.firstName + ' ' + session.lastName,
        authorRole: session.role,
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0
      };

      posts.unshift(newPost);
      savePosts(posts);

      // Update user post count
      const users = getUsers();
      const uIdx = users.findIndex(u => u.id === session.id);
      if (uIdx !== -1) { users[uIdx].postsCount = (users[uIdx].postsCount || 0) + 1; saveUsers(users); }

      closeModal('postModalOverlay');
      showToast('Yangilik muvaffaqiyatli chop etildi! 🎉', 'success');
      setTimeout(() => location.reload(), 700);
    }
  };

  // Handle image
  if (imgInput && imgInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => saveWithImage(e.target.result);
    reader.readAsDataURL(imgInput.files[0]);
  } else {
    saveWithImage('');
  }
}

function deletePost(id) {
  const session = getSession();
  if (!session) return;

  if (!confirm('Bu yangilikni o\'chirishni istaysizmi?')) return;

  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return;

  if (posts[idx].authorId !== session.id && session.role !== 'admin') {
    showToast('Bu amalni bajarishga huquq yo\'q!', 'error');
    return;
  }

  posts.splice(idx, 1);
  savePosts(posts);
  showToast('Yangilik o\'chirildi!', 'success');
  setTimeout(() => location.reload(), 600);
}

function likePost(id) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    post.likes = (post.likes || 0) + 1;
    savePosts(posts);
    const likeEl = document.querySelector(`[data-like="${id}"]`);
    if (likeEl) likeEl.textContent = '❤️ ' + post.likes;
  }
}

function viewPost(id) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (!post) return;

  post.views = (post.views || 0) + 1;
  savePosts(posts);

  const session = getSession();
  const isOwner = session && (session.id === post.authorId || session.role === 'admin');

  const modalId = 'viewPostModal';
  let overlay = document.getElementById(modalId);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = modalId;
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal modal-lg">
      <div class="modal-header">
        <h2 style="font-size:1rem;color:var(--text-muted)">📰 Yangilik</h2>
        <div style="display:flex;gap:8px;align-items:center">
          ${isOwner ? `<button class="btn btn-outline btn-sm" onclick="closeModal('${modalId}');openPostModal('${post.id}')">✏️ Tahrirlash</button>
          <button class="btn btn-danger btn-sm" onclick="closeModal('${modalId}');deletePost('${post.id}')">🗑️</button>` : ''}
          <button class="modal-close" onclick="closeModal('${modalId}')">✕</button>
        </div>
      </div>
      <div class="modal-body">
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="post-full-img">` : ''}
        <div class="news-tag ${post.category}" style="margin-bottom:1rem">${getCatLabel(post.category)}</div>
        <h2 class="post-full-title">${escHtml(post.title)}</h2>
        <div class="post-full-meta">
          <div class="news-author">
            <div class="author-avatar">${getInitials(post.authorName)}</div>
            <span>${escHtml(post.authorName)}</span>
            ${post.authorRole === 'admin' ? '<span class="admin-badge">Admin</span>' : ''}
          </div>
          <span class="news-date">📅 ${formatDate(post.createdAt)}</span>
          <span class="news-date">👁️ ${post.views} ko'rilgan</span>
          <button onclick="likePost('${post.id}')" data-like="${post.id}" style="background:none;border:none;cursor:pointer;font-size:0.9rem;color:var(--danger)">❤️ ${post.likes || 0}</button>
        </div>
        <div class="post-full-body">${escHtml(post.body)}</div>
      </div>
    </div>
  `;

  openModal(modalId);
}

// ===== PROFILE MODAL =====
function openProfileModal() {
  const session = getSession();
  if (!session) return;

  const posts = getPosts().filter(p => p.authorId === session.id);
  const initial = (session.firstName[0] + session.lastName[0]).toUpperCase();

  let overlay = document.getElementById('profileModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'profileModal';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>👤 Profil</h2>
        <button class="modal-close" onclick="closeModal('profileModal')">✕</button>
      </div>
      <div class="profile-header">
        <div class="profile-avatar-lg">${initial}</div>
        <h3>${escHtml(session.firstName + ' ' + session.lastName)}</h3>
        <p>@${session.username} · ${getRoleName(session.role)}</p>
        <div class="profile-stats">
          <div class="profile-stat">
            <div class="num">${posts.length}</div>
            <div class="lbl">Maqolalar</div>
          </div>
          <div class="profile-stat">
            <div class="num">${posts.reduce((a,p) => a + (p.likes||0), 0)}</div>
            <div class="lbl">Like'lar</div>
          </div>
          <div class="profile-stat">
            <div class="num">${posts.reduce((a,p) => a + (p.views||0), 0)}</div>
            <div class="lbl">Ko'rishlar</div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div style="margin-bottom:1.2rem">
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px">A'zo bo'lgan sana</div>
          <div style="font-weight:600">${formatDate(session.joinedAt)}</div>
        </div>
        ${posts.length > 0 ? `
          <div style="font-size:0.9rem;font-weight:700;margin-bottom:1rem">Mening maqolalarim</div>
          <div style="display:flex;flex-direction:column;gap:10px;max-height:260px;overflow-y:auto">
            ${posts.map(p => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface2);border-radius:10px;gap:10px">
                <div style="flex:1;min-width:0">
                  <div style="font-size:0.88rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(p.title)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted)">${formatDate(p.createdAt)} · ❤️${p.likes||0} · 👁️${p.views||0}</div>
                </div>
                <div style="display:flex;gap:6px;flex-shrink:0">
                  <button class="btn btn-outline btn-sm" onclick="closeModal('profileModal');openPostModal('${p.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="closeModal('profileModal');deletePost('${p.id}')">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `<div class="empty-state" style="padding:2rem">
          <div class="empty-icon">📝</div>
          <p>Hali maqola yozmagansiz</p>
          <button class="btn btn-primary btn-sm" onclick="closeModal('profileModal');openPostModal()">Birinchi maqola yozish</button>
        </div>`}
      </div>
    </div>
  `;

  openModal('profileModal');
}

// ===== NEWS CARD RENDERER =====
function renderNewsCard(post, idx) {
  const session = getSession();
  const isOwner = session && (session.id === post.authorId || session.role === 'admin');
  const delay = (idx % 6) * 0.08;

  return `
    <div class="news-card" style="animation-delay:${delay}s">
      ${post.imageUrl
        ? `<img src="${post.imageUrl}" alt="${escHtml(post.title)}" class="news-card-img" onerror="this.style.display='none'">`
        : `<div class="news-card-img-placeholder">${getCatEmoji(post.category)}</div>`}
      <div class="news-card-body">
        <div class="news-card-meta">
          <span class="news-tag ${post.category}">${getCatLabel(post.category)}</span>
          <span class="news-date">📅 ${formatDate(post.createdAt)}</span>
        </div>
        <div class="news-card-title">${escHtml(post.title)}</div>
        <div class="news-card-excerpt">${escHtml(post.excerpt)}</div>
        <div class="news-card-footer">
          <div class="news-author">
            <div class="author-avatar">${getInitials(post.authorName)}</div>
            <span>${escHtml(post.authorName)}</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <button onclick="likePost('${post.id}')" data-like="${post.id}" style="background:none;border:none;cursor:pointer;font-size:0.82rem;color:var(--danger)">❤️ ${post.likes||0}</button>
            ${isOwner ? `<button onclick="deletePost('${post.id}')" style="background:none;border:none;cursor:pointer;font-size:0.82rem;color:var(--text-muted)" title="O'chirish">🗑️</button>` : ''}
            <button class="news-read-btn" onclick="viewPost('${post.id}')">Batafsil →</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== TOAST =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-text">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ===== HELPERS =====
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function getCatLabel(cat) {
  const map = { yangilik: '📣 Yangilik', tadbir: '🎉 Tadbir', sport: '⚽ Sport', fan: '🔬 Fan', madaniyat: '🎭 Madaniyat' };
  return map[cat] || cat;
}

function getCatEmoji(cat) {
  const map = { yangilik: '📣', tadbir: '🎉', sport: '⚽', fan: '🔬', madaniyat: '🎭' };
  return map[cat] || '📰';
}

// ===== NAVBAR MOBILE =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ===== SCROLL TOP =====
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  updateNavAuth();
  createPostModal();
});
