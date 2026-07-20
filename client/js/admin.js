/* ═══════════════════════════════════════════════════════════════════════
   admin.js — Portfolio Admin Panel Logic
   Login → JWT Auth → CRUD for Projects & Skills
═══════════════════════════════════════════════════════════════════════ */

const API_BASE = (() => {
  const { hostname, origin } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : origin;
})();

// ── State ─────────────────────────────────────────────────────────────
let token      = localStorage.getItem('portfolio_admin_token') || null;
let projects   = [];
let skills     = [];
let editingId  = null;

// ── DOM References ────────────────────────────────────────────────────
const loginView      = document.getElementById('login-view');
const dashboardView  = document.getElementById('dashboard-view');
const loginForm      = document.getElementById('login-form');
const logoutBtn      = document.getElementById('logout-btn');
const toast          = document.getElementById('toast');

const projModal      = document.getElementById('project-modal');
const projForm       = document.getElementById('project-form');
const skillModal     = document.getElementById('skill-modal');
const skillForm      = document.getElementById('skill-form');

// ═════════════════════════════════════════════════════════════════════
// AUTH
// ═════════════════════════════════════════════════════════════════════
async function checkAuth() {
  if (!token) { showLogin(); return; }
  try {
    const res = await apiFetch('/api/auth/verify');
    if (res.success) showDashboard();
    else { token = null; localStorage.removeItem('portfolio_admin_token'); showLogin(); }
  } catch {
    showLogin();
  }
}

function showLogin() { 
  loginView.style.display = 'flex'; 
  dashboardView.style.display = 'none'; 
}

function showDashboard() { 
  loginView.style.display = 'none'; 
  dashboardView.style.display = 'flex'; 
  loadProjects(); 
  loadSkills(); 
}

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  if (!username || !password) return showToast('Enter username and password', 'error');

  const btn = loginForm.querySelector('button');
  btn.textContent = 'Logging in...';
  btn.disabled = true;

  try {
    const res = await apiFetch('/api/auth/login', 'POST', { username, password }, false);
    if (res.success) {
      token = res.token;
      localStorage.setItem('portfolio_admin_token', token);
      showDashboard();
    } else {
      showToast(res.message || 'Invalid credentials', 'error');
    }
  } catch (err) {
    showToast('Server error. Check backend.', 'error');
  }

  btn.textContent = 'Login';
  btn.disabled = false;
});

logoutBtn.addEventListener('click', () => {
  token = null;
  localStorage.removeItem('portfolio_admin_token');
  showLogin();
});

// ═════════════════════════════════════════════════════════════════════
// NAVIGATION & SIDEBAR
// ═════════════════════════════════════════════════════════════════════
const navItems = document.querySelectorAll('.nav-item[data-target]');
const viewSections = document.querySelectorAll('.view-section');
const mobileToggle = document.getElementById('mobile-toggle');
const sidebar = document.getElementById('sidebar');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    // UI Update
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    // Switch View
    const target = item.dataset.target;
    viewSections.forEach(section => {
      if (section.id === target) section.classList.add('active');
      else section.classList.remove('active');
    });

    // Close mobile sidebar
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('mobile-open');
    }
  });
});

mobileToggle.addEventListener('click', () => {
  sidebar.classList.toggle('mobile-open');
});

// ═════════════════════════════════════════════════════════════════════
// PROJECTS CRUD
// ═════════════════════════════════════════════════════════════════════
async function loadProjects() {
  try {
    const res = await apiFetch('/api/projects');
    projects = res.data || [];
    renderProjectsList();
  } catch (err) {
    document.getElementById('admin-projects-grid').innerHTML = '<p>Error loading projects</p>';
  }
}

function renderProjectsList() {
  const grid = document.getElementById('admin-projects-grid');
  if (!projects.length) {
    grid.innerHTML = '<p>No projects found.</p>';
    return;
  }

  grid.innerHTML = projects.map(p => `
    <div class="admin-card">
      <div class="admin-card-title">${escapeHTML(p.title)}</div>
      <div class="admin-card-desc">${escapeHTML(p.description)}</div>
      <div style="font-size:0.8rem;color:var(--accent-primary);margin-bottom:16px;">
        Category: ${p.category} ${p.featured ? '| ⭐ Featured' : ''}
      </div>
      <div class="admin-card-actions">
        <button class="btn btn-outline" onclick="editProject('${p._id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteProject('${p._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('btn-add-project').addEventListener('click', () => {
  editingId = null;
  document.getElementById('project-modal-title').textContent = 'Add Project';
  projForm.reset();
  projModal.classList.add('active');
});

function editProject(id) {
  const p = projects.find(x => x._id === id);
  if (!p) return;
  
  editingId = id;
  document.getElementById('project-modal-title').textContent = 'Edit Project';
  
  document.getElementById('pf-title').value = p.title || '';
  document.getElementById('pf-category').value = p.category || 'fullstack';
  document.getElementById('pf-desc').value = p.description || '';
  document.getElementById('pf-tech').value = (p.tech || []).join(', ');
  document.getElementById('pf-github').value = p.githubUrl || '';
  document.getElementById('pf-live').value = p.liveUrl || '';
  
  projModal.classList.add('active');
}
window.editProject = editProject;

projForm.addEventListener('submit', async e => {
  e.preventDefault();
  const tech = document.getElementById('pf-tech').value.split(',').map(t => t.trim()).filter(Boolean);

  const data = {
    title: document.getElementById('pf-title').value.trim(),
    category: document.getElementById('pf-category').value,
    description: document.getElementById('pf-desc').value.trim(),
    tech,
    githubUrl: document.getElementById('pf-github').value.trim(),
    liveUrl: document.getElementById('pf-live').value.trim()
  };

  try {
    const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
    const method = editingId ? 'PUT' : 'POST';
    const res = await apiFetch(url, method, data);
    
    if (res.success) {
      showToast(editingId ? 'Project updated' : 'Project added', 'success');
      projModal.classList.remove('active');
      loadProjects();
    } else {
      showToast(res.message, 'error');
    }
  } catch (err) {
    showToast('Failed to save', 'error');
  }
});

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  try {
    const res = await apiFetch(`/api/projects/${id}`, 'DELETE');
    if (res.success) {
      showToast('Project deleted', 'success');
      loadProjects();
    } else {
      showToast(res.message, 'error');
    }
  } catch (err) {
    showToast('Delete failed', 'error');
  }
}
window.deleteProject = deleteProject;

// ═════════════════════════════════════════════════════════════════════
// SKILLS CRUD
// ═════════════════════════════════════════════════════════════════════
async function loadSkills() {
  try {
    const res = await apiFetch('/api/skills');
    skills = res.data || [];
    renderSkillsList();
  } catch (err) {
    document.getElementById('admin-skills-grid').innerHTML = '<p>Error loading skills</p>';
  }
}

function renderSkillsList() {
  const grid = document.getElementById('admin-skills-grid');
  if (!skills.length) {
    grid.innerHTML = '<p>No skills found.</p>';
    return;
  }

  grid.innerHTML = skills.map(s => `
    <div class="admin-card">
      <div class="admin-card-title">
        <i class="${escapeHTML(s.icon)} colored"></i> ${escapeHTML(s.name)}
      </div>
      <div class="admin-card-desc">Category: ${s.category} | Level: ${s.level}%</div>
      <div class="admin-card-actions">
        <button class="btn btn-outline" onclick="editSkill('${s._id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteSkill('${s._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('btn-add-skill').addEventListener('click', () => {
  editingId = null;
  document.getElementById('skill-modal-title').textContent = 'Add Skill';
  skillForm.reset();
  skillModal.classList.add('active');
});

function editSkill(id) {
  const s = skills.find(x => x._id === id);
  if (!s) return;
  
  editingId = id;
  document.getElementById('skill-modal-title').textContent = 'Edit Skill';
  
  document.getElementById('sf-name').value = s.name || '';
  document.getElementById('sf-category').value = s.category || 'other';
  document.getElementById('sf-level').value = s.level || 80;
  document.getElementById('sf-icon').value = s.icon || '';
  
  skillModal.classList.add('active');
}
window.editSkill = editSkill;

skillForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    name: document.getElementById('sf-name').value.trim(),
    category: document.getElementById('sf-category').value,
    level: parseInt(document.getElementById('sf-level').value) || 0,
    icon: document.getElementById('sf-icon').value.trim()
  };

  try {
    const url = editingId ? `/api/skills/${editingId}` : '/api/skills';
    const method = editingId ? 'PUT' : 'POST';
    const res = await apiFetch(url, method, data);
    
    if (res.success) {
      showToast(editingId ? 'Skill updated' : 'Skill added', 'success');
      skillModal.classList.remove('active');
      loadSkills();
    } else {
      showToast(res.message, 'error');
    }
  } catch (err) {
    showToast('Failed to save', 'error');
  }
});

async function deleteSkill(id) {
  if (!confirm('Are you sure you want to delete this skill?')) return;
  try {
    const res = await apiFetch(`/api/skills/${id}`, 'DELETE');
    if (res.success) {
      showToast('Skill deleted', 'success');
      loadSkills();
    } else {
      showToast(res.message, 'error');
    }
  } catch (err) {
    showToast('Delete failed', 'error');
  }
}
window.deleteSkill = deleteSkill;

// ═════════════════════════════════════════════════════════════════════
// MODAL CLOSERS
// ═════════════════════════════════════════════════════════════════════
document.getElementById('close-project-modal').addEventListener('click', () => {
  projModal.classList.remove('active');
});
document.getElementById('close-skill-modal').addEventListener('click', () => {
  skillModal.classList.remove('active');
});

// Close when clicking outside modal content
[projModal, skillModal].forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });
});

// ═════════════════════════════════════════════════════════════════════
// TOAST
// ═════════════════════════════════════════════════════════════════════
let toastTimer;
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = type === 'error' ? 'error show' : 'show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = ''; }, 3000);
}

// ═════════════════════════════════════════════════════════════════════
// API HELPER
// ═════════════════════════════════════════════════════════════════════
async function apiFetch(path, method = 'GET', body = null, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res  = await fetch(`${API_BASE}${path}`, opts);
  return await res.json();
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// INIT
checkAuth();
