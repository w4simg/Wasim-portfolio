/* ═══════════════════════════════════════════════════════════════════════
   main.js — Portfolio Data Fetching & Rendering (Professional Theme)
   Wasim Akram — Python Developer
═══════════════════════════════════════════════════════════════════════ */

const API_BASE = (() => {
  const { hostname, origin } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1'
    ? `http://localhost:5000`
    : origin;
})();

const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ═════════════════════════════════════════════════════════════════════
// PROJECTS RENDERER
// ═════════════════════════════════════════════════════════════════════
const projectsGrid = document.getElementById('projectsGrid');

async function fetchProjects() {
  try {
    const res  = await fetch(`${API_BASE}/api/projects`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    renderProjects(json.data);
  } catch (err) {
    if (projectsGrid) {
      projectsGrid.innerHTML = `<div class="loading-state" style="color:#ef4444;">Error loading projects. Check server connection.</div>`;
    }
  }
}

function renderProjects(projects) {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = '';

  if (!projects.length) {
    projectsGrid.innerHTML = `<div class="loading-state">No projects yet.</div>`;
    return;
  }

  projects.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.style.animationDelay = `${i * 100}ms`;

    const techTags = (proj.tech || []).map(t => `<span>${escapeHTML(t)}</span>`).join('');

    const githubLink = proj.githubUrl 
      ? `<a href="${escapeHTML(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-icon" aria-label="GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>` : '';

    const liveLink = proj.liveUrl
      ? `<a href="${escapeHTML(proj.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-icon" aria-label="Live Demo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>` : '';

    card.innerHTML = `
      <div class="project-card-header">
        <svg class="project-folder-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <div class="project-links">
          ${githubLink}
          ${liveLink}
        </div>
      </div>
      <h3 class="project-title">${escapeHTML(proj.title)}</h3>
      <div class="project-desc">
        <p>${escapeHTML(proj.description)}</p>
      </div>
      <div class="project-tech-list">${techTags}</div>
    `;
    projectsGrid.appendChild(card);
  });

  observeNewReveals(projectsGrid.querySelectorAll('.reveal'));
}

// ═════════════════════════════════════════════════════════════════════
// SKILLS RENDERER
// ═════════════════════════════════════════════════════════════════════
const skillsGrid = document.getElementById('skillsGrid');

async function fetchSkills() {
  try {
    const res  = await fetch(`${API_BASE}/api/skills`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    renderSkills(json.data);
  } catch (err) {
    if (skillsGrid) {
      skillsGrid.innerHTML = `<div class="loading-state" style="color:#ef4444;">Error loading skills.</div>`;
    }
  }
}

function renderSkills(skills) {
  if (!skillsGrid) return;
  skillsGrid.innerHTML = '';

  if (!skills.length) {
    skillsGrid.innerHTML = `<div class="loading-state">No skills yet.</div>`;
    return;
  }

  // Group by category
  const grouped = {
    backend: [],
    frontend: [],
    database: [],
    tools: [],
    other: []
  };

  skills.forEach(s => {
    if (grouped[s.category]) grouped[s.category].push(s);
    else grouped.other.push(s);
  });

  const categoryTitles = {
    backend: 'Backend & APIs',
    frontend: 'Frontend Development',
    database: 'Databases',
    tools: 'Tools & DevOps',
    other: 'Other Skills'
  };

  ['backend', 'database', 'frontend', 'tools', 'other'].forEach((cat, idx) => {
    if (grouped[cat].length === 0) return;

    const catDiv = document.createElement('div');
    catDiv.className = 'skills-category reveal';
    catDiv.style.animationDelay = `${idx * 150}ms`;

    const title = document.createElement('h3');
    title.className = 'skills-category-title';
    title.textContent = categoryTitles[cat];
    catDiv.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'skills-grid';

    grouped[cat].forEach(skill => {
      const item = document.createElement('div');
      item.className = 'skill-item';
      item.innerHTML = `
        <div class="skill-icon"><i class="${escapeHTML(skill.icon)} colored"></i></div>
        <div class="skill-name">${escapeHTML(skill.name)}</div>
      `;
      grid.appendChild(item);
    });

    catDiv.appendChild(grid);
    skillsGrid.appendChild(catDiv);
  });

  observeNewReveals(skillsGrid.querySelectorAll('.reveal'));
}

// ═════════════════════════════════════════════════════════════════════
// UTILITIES
// ═════════════════════════════════════════════════════════════════════
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function observeNewReveals(elements) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  elements.forEach(el => observer.observe(el));
}

// ═════════════════════════════════════════════════════════════════════
// INIT
// ═════════════════════════════════════════════════════════════════════
(function init() {
  fetchSkills();
  fetchProjects();
})();
