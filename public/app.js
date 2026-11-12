// public/app.js - Enterprise Controller for Verdant
(function () {
  'use strict';

  // SVG Icon Templates
  const icons = {
    location: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    briefcase: `<svg class="svg-icon" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    tag: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
    clock: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    users: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    check: `<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    alert: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    edit: `<svg class="svg-icon" viewBox="0 0 24 24" style="width: 0.9em; height: 0.9em;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    pause: `<svg class="svg-icon" viewBox="0 0 24 24" style="width: 0.9em; height: 0.9em;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    play: `<svg class="svg-icon" viewBox="0 0 24 24" style="width: 0.9em; height: 0.9em;"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    trash: `<svg class="svg-icon" viewBox="0 0 24 24" style="width: 0.9em; height: 0.9em;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    download: `<svg class="svg-icon" viewBox="0 0 24 24" style="width: 0.9em; height: 0.9em;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
  };

  // State Management
  const state = {
    currentRole: 'candidate',
    currentView: 'jobs',
    adminTab: 'jobs',
    jobs: [],
    applications: [],
    myAppIds: JSON.parse(localStorage.getItem('verdant_my_app_ids') || '[]'),
    myEmail: localStorage.getItem('verdant_my_email') || '',
    stats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      shortlistedApplications: 0
    },
    filters: {
      search: '',
      location: '',
      category: 'all',
      jobTypes: [],
      experience: [],
      sort: 'newest'
    },
    activeJob: null,
    resumeData: null,
    resumeName: ''
  };

  // DOM Elements
  const els = {
    // Nav & Roles
    roleCandidateBtn: document.getElementById('roleCandidateBtn'),
    roleAdminBtn: document.getElementById('roleAdminBtn'),
    navBrowseJobs: document.getElementById('navBrowseJobs'),
    navMyApps: document.getElementById('navMyApps'),
    navAdminPortal: document.getElementById('navAdminPortal'),
    myAppsBadge: document.getElementById('myAppsBadge'),
    headerPostJobBtn: document.getElementById('headerPostJobBtn'),
    logoBtn: document.getElementById('logoBtn'),

    // Hero & Stats
    heroSection: document.getElementById('heroSection'),
    heroSearchInput: document.getElementById('heroSearchInput'),
    heroLocationInput: document.getElementById('heroLocationInput'),
    heroCategorySelect: document.getElementById('heroCategorySelect'),
    heroSearchSubmitBtn: document.getElementById('heroSearchSubmitBtn'),
    heroActiveJobCount: document.getElementById('heroActiveJobCount'),
    categoryChips: document.querySelectorAll('.category-chip'),
    statActiveJobs: document.getElementById('statActiveJobs'),
    statTotalJobs: document.getElementById('statTotalJobs'),
    statTotalApps: document.getElementById('statTotalApps'),
    statShortlistedApps: document.getElementById('statShortlistedApps'),

    // Main Views
    candidateJobBoardView: document.getElementById('candidateJobBoardView'),
    myApplicationsView: document.getElementById('myApplicationsView'),
    adminPortalView: document.getElementById('adminPortalView'),
    adminHeaderBar: document.getElementById('adminHeaderBar'),

    // Candidate Job Board
    jobsListContainer: document.getElementById('jobsListContainer'),
    jobResultsCount: document.getElementById('jobResultsCount'),
    sortSelector: document.getElementById('sortSelector'),
    noJobsFound: document.getElementById('noJobsFound'),
    filterResetBtn: document.getElementById('filterResetBtn'),
    btnResetFiltersEmpty: document.getElementById('btnResetFiltersEmpty'),
    categoryRadios: document.querySelectorAll('input[name="filterCategory"]'),
    jobTypeCheckboxes: document.querySelectorAll('input[name="filterJobType"]'),
    expCheckboxes: document.querySelectorAll('input[name="filterExp"]'),

    // My Applications
    myAppsTableBody: document.getElementById('myAppsTableBody'),
    noMyApps: document.getElementById('noMyApps'),
    btnBrowseJobsFromEmpty: document.getElementById('btnBrowseJobsFromEmpty'),

    // Admin Panel
    tabAdminJobs: document.getElementById('tabAdminJobs'),
    tabAdminApps: document.getElementById('tabAdminApps'),
    adminJobsPanel: document.getElementById('adminJobsPanel'),
    adminAppsPanel: document.getElementById('adminAppsPanel'),
    adminJobTabCount: document.getElementById('adminJobTabCount'),
    adminAppTabCount: document.getElementById('adminAppTabCount'),
    adminJobsTableBody: document.getElementById('adminJobsTableBody'),
    adminAppsTableBody: document.getElementById('adminAppsTableBody'),
    adminJobSearchInput: document.getElementById('adminJobSearchInput'),
    adminAppStatusFilter: document.getElementById('adminAppStatusFilter'),
    adminPostJobBtn: document.getElementById('adminPostJobBtn'),
    btnAdminCreateJob: document.getElementById('btnAdminCreateJob'),
    btnResetData: document.getElementById('btnResetData'),
    noAdminApps: document.getElementById('noAdminApps'),

    // Modals
    jobDetailModal: document.getElementById('jobDetailModal'),
    modalJobTitle: document.getElementById('modalJobTitle'),
    modalJobCompany: document.getElementById('modalJobCompany'),
    modalJobLocation: document.getElementById('modalJobLocation'),
    modalJobType: document.getElementById('modalJobType'),
    modalJobCategory: document.getElementById('modalJobCategory'),
    modalJobExp: document.getElementById('modalJobExp'),
    modalJobSalary: document.getElementById('modalJobSalary'),
    modalJobStatus: document.getElementById('modalJobStatus'),
    modalJobDescription: document.getElementById('modalJobDescription'),
    modalJobRequirements: document.getElementById('modalJobRequirements'),
    modalJobBenefits: document.getElementById('modalJobBenefits'),
    modalApplyBtn: document.getElementById('modalApplyBtn'),

    // Application Modal
    applyModal: document.getElementById('applyModal'),
    applyModalSubtitle: document.getElementById('applyModalSubtitle'),
    applicationForm: document.getElementById('applicationForm'),
    applyJobId: document.getElementById('applyJobId'),
    applicantName: document.getElementById('applicantName'),
    applicantEmail: document.getElementById('applicantEmail'),
    applicantPhone: document.getElementById('applicantPhone'),
    applicantExp: document.getElementById('applicantExp'),
    applicantPortfolio: document.getElementById('applicantPortfolio'),
    applicantCoverLetter: document.getElementById('applicantCoverLetter'),
    resumeUploadBox: document.getElementById('resumeUploadBox'),
    resumeFileInput: document.getElementById('resumeFileInput'),
    resumeFilePreview: document.getElementById('resumeFilePreview'),
    resumeFileName: document.getElementById('resumeFileName'),
    removeResumeBtn: document.getElementById('removeResumeBtn'),
    btnSubmitApplication: document.getElementById('btnSubmitApplication'),

    // Job Form Modal (Create / Edit)
    jobFormModal: document.getElementById('jobFormModal'),
    jobFormModalTitle: document.getElementById('jobFormModalTitle'),
    jobCreateOrEditForm: document.getElementById('jobCreateOrEditForm'),
    editJobId: document.getElementById('editJobId'),
    jobFormTitle: document.getElementById('jobFormTitle'),
    jobFormCompany: document.getElementById('jobFormCompany'),
    jobFormLocation: document.getElementById('jobFormLocation'),
    jobFormCategory: document.getElementById('jobFormCategory'),
    jobFormType: document.getElementById('jobFormType'),
    jobFormExperience: document.getElementById('jobFormExperience'),
    jobFormSalaryMin: document.getElementById('jobFormSalaryMin'),
    jobFormSalaryMax: document.getElementById('jobFormSalaryMax'),
    jobFormStatus: document.getElementById('jobFormStatus'),
    jobFormDescription: document.getElementById('jobFormDescription'),
    jobFormRequirements: document.getElementById('jobFormRequirements'),
    jobFormBenefits: document.getElementById('jobFormBenefits'),
    btnSaveJobForm: document.getElementById('btnSaveJobForm'),

    // Application Detail Modal (Admin)
    appDetailModal: document.getElementById('appDetailModal'),
    appDetailApplicantName: document.getElementById('appDetailApplicantName'),
    appDetailJobTitle: document.getElementById('appDetailJobTitle'),
    appDetailEmail: document.getElementById('appDetailEmail'),
    appDetailPhone: document.getElementById('appDetailPhone'),
    appDetailExp: document.getElementById('appDetailExp'),
    appDetailPortfolio: document.getElementById('appDetailPortfolio'),
    appDetailCoverLetter: document.getElementById('appDetailCoverLetter'),
    appDetailResumeName: document.getElementById('appDetailResumeName'),
    appDetailResumeDownloadBtn: document.getElementById('appDetailResumeDownloadBtn'),
    appDetailStatusSelect: document.getElementById('appDetailStatusSelect'),
    btnUpdateAppDetailStatus: document.getElementById('btnUpdateAppDetailStatus'),

    // Toasts
    toastContainer: document.getElementById('toastContainer')
  };

  let activeAppDetailId = null;

  // =========================================================================
  // API Fetch Utility
  // =========================================================================
  async function fetchJson(endpoint, options = {}) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server responded with status ' + res.status);
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' toast-error' : '');
    toast.innerHTML = `
      <span>${type === 'error' ? icons.alert : icons.check}</span>
      <div>${message}</div>
    `;
    els.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3800);
  }

  // =========================================================================
  // Initialization & Data Loading
  // =========================================================================
  async function init() {
    setupEventListeners();
    await reloadAllData();
    updateMyAppsBadge();
  }

  async function reloadAllData() {
    await Promise.all([
      loadJobs(),
      loadApplications(),
      loadStats()
    ]);
  }

  async function loadJobs() {
    try {
      const queryParams = new URLSearchParams();
      if (state.filters.category && state.filters.category !== 'all') {
        queryParams.set('category', state.filters.category);
      }
      if (state.filters.search) {
        queryParams.set('search', state.filters.search);
      }

      const res = await fetchJson('/api/jobs?' + queryParams.toString());
      state.jobs = res.jobs || [];
      renderCandidateJobs();
      renderAdminJobs();
      updateHeroJobCount();
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  }

  async function loadApplications() {
    try {
      const res = await fetchJson('/api/applications');
      state.applications = res.applications || [];
      renderAdminApplications();
      renderMyApplications();
      updateMyAppsBadge();
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  }

  async function loadStats() {
    try {
      const res = await fetchJson('/api/stats');
      if (res.stats) {
        state.stats = res.stats;
        els.statActiveJobs.textContent = res.stats.activeJobs;
        els.statTotalJobs.textContent = res.stats.totalJobs;
        els.statTotalApps.textContent = res.stats.totalApplications;
        els.statShortlistedApps.textContent = res.stats.shortlistedApplications;
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }

  function updateHeroJobCount() {
    const activeCount = state.jobs.filter(j => j.status === 'active').length;
    els.heroActiveJobCount.textContent = activeCount + '+';
  }

  function updateMyAppsBadge() {
    const myApps = getMySubmittedApps();
    if (myApps.length > 0) {
      els.myAppsBadge.textContent = myApps.length;
      els.myAppsBadge.style.display = 'inline-block';
    } else {
      els.myAppsBadge.style.display = 'none';
    }
  }

  function getMySubmittedApps() {
    return state.applications.filter(app => {
      return state.myAppIds.includes(app.id) ||
        (state.myEmail && app.applicant_email.toLowerCase() === state.myEmail.toLowerCase());
    });
  }

  // =========================================================================
  // Candidate Jobs Feed Rendering
  // =========================================================================
  function renderCandidateJobs() {
    const container = els.jobsListContainer;
    container.innerHTML = '';

    let filtered = state.jobs.filter(j => j.status === 'active');

    if (state.filters.search) {
      const term = state.filters.search.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(term) ||
        j.company.toLowerCase().includes(term) ||
        j.description.toLowerCase().includes(term) ||
        j.location.toLowerCase().includes(term)
      );
    }

    if (state.filters.location) {
      const loc = state.filters.location.toLowerCase();
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
    }

    if (state.filters.category && state.filters.category !== 'all') {
      filtered = filtered.filter(j => j.category === state.filters.category);
    }

    if (state.filters.jobTypes.length > 0) {
      filtered = filtered.filter(j => state.filters.jobTypes.includes(j.job_type));
    }

    if (state.filters.experience.length > 0) {
      filtered = filtered.filter(j => state.filters.experience.includes(j.experience));
    }

    if (state.filters.sort === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (state.filters.sort === 'salary') {
      filtered.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    } else if (state.filters.sort === 'company') {
      filtered.sort((a, b) => a.company.localeCompare(b.company));
    }

    els.jobResultsCount.textContent = `(${filtered.length})`;

    if (filtered.length === 0) {
      els.noJobsFound.style.display = 'block';
      return;
    } else {
      els.noJobsFound.style.display = 'none';
    }

    filtered.forEach(job => {
      const card = createJobCardElement(job);
      container.appendChild(card);
    });
  }

  function createJobCardElement(job) {
    const card = document.createElement('div');
    card.className = 'job-card';

    const companyInitials = job.company
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase() || 'VJ';

    const formattedSalary = job.salary_min && job.salary_max
      ? `${job.salary_currency}${job.salary_min.toLocaleString()} – ${job.salary_currency}${job.salary_max.toLocaleString()}`
      : 'Competitive';

    const postedTimeAgo = getTimeAgo(job.created_at);

    card.innerHTML = `
      <div class="job-card-top">
        <div class="job-card-main">
          <div class="company-avatar">${companyInitials}</div>
          <div class="job-info">
            <h3>${escapeHtml(job.title)}</h3>
            <span class="company-name">${escapeHtml(job.company)}</span>
            <div class="job-meta-badges">
              <span class="badge badge-dark-green">${icons.location} ${escapeHtml(job.location)}</span>
              <span class="badge badge-gray">${escapeHtml(job.job_type)}</span>
              <span class="badge badge-gray">${escapeHtml(job.category)}</span>
              <span class="badge badge-gray">${escapeHtml(job.experience)}</span>
              <span class="badge badge-salary">${formattedSalary}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="job-description-preview">
        ${escapeHtml(job.description)}
      </div>

      <div class="job-card-footer">
        <div class="job-card-meta">
          <span>${icons.clock} ${postedTimeAgo}</span>
          <span>&bull;</span>
          <span>${icons.users} ${job.application_count || 0} applicants</span>
        </div>
        <div class="job-card-actions">
          <button class="btn btn-outline-green btn-sm btn-view-job" data-id="${job.id}">
            View Details
          </button>
          <button class="btn btn-primary btn-sm btn-quick-apply" data-id="${job.id}">
            Apply Now
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-view-job').addEventListener('click', () => openJobDetailModal(job));
    card.querySelector('.btn-quick-apply').addEventListener('click', () => openApplicationModal(job));

    return card;
  }

  // =========================================================================
  // Admin Tables & Management
  // =========================================================================
  function renderAdminJobs() {
    const tbody = els.adminJobsTableBody;
    tbody.innerHTML = '';

    let jobs = [...state.jobs];
    const searchTerm = (els.adminJobSearchInput.value || '').trim().toLowerCase();
    if (searchTerm) {
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(searchTerm) ||
        j.company.toLowerCase().includes(searchTerm) ||
        j.category.toLowerCase().includes(searchTerm)
      );
    }

    els.adminJobTabCount.textContent = jobs.length;

    if (jobs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--neutral-500);">No job postings match your filter.</td></tr>`;
      return;
    }

    jobs.forEach(job => {
      const tr = document.createElement('tr');
      const salaryText = job.salary_min && job.salary_max
        ? `$${job.salary_min.toLocaleString()} – $${job.salary_max.toLocaleString()}`
        : 'Competitive';

      const statusBadgeClass = job.status === 'active' ? 'badge-status-active' : 'badge-status-closed';

      tr.innerHTML = `
        <td>
          <strong style="color: var(--neutral-900); font-size: 0.9rem;">${escapeHtml(job.title)}</strong><br>
          <span style="font-size: 0.78rem; color: var(--neutral-500);">${escapeHtml(job.company)}</span>
        </td>
        <td><span class="badge badge-gray">${escapeHtml(job.category)}</span></td>
        <td>
          <span style="font-size: 0.8rem;">${escapeHtml(job.location)}</span><br>
          <span style="font-size: 0.72rem; color: var(--neutral-500);">${escapeHtml(job.job_type)}</span>
        </td>
        <td><span style="font-size: 0.8rem; font-weight: 600; font-family: var(--font-mono); color: #065f46;">${salaryText}</span></td>
        <td>
          <button class="btn btn-outline btn-sm btn-view-job-apps" data-id="${job.id}" style="padding: 0.2rem 0.55rem; font-size: 0.72rem;">
            ${job.application_count || 0} applicants
          </button>
        </td>
        <td>
          <span class="badge ${statusBadgeClass}">${escapeHtml(job.status.toUpperCase())}</span>
        </td>
        <td>
          <div style="display: flex; gap: 0.35rem; align-items: center;">
            <button class="btn btn-outline-green btn-sm btn-edit-job" data-id="${job.id}" title="Edit listing">
              ${icons.edit} Edit
            </button>
            <button class="btn btn-outline btn-sm btn-toggle-status" data-id="${job.id}" title="Toggle Active / Closed">
              ${job.status === 'active' ? icons.pause : icons.play}
            </button>
            <button class="btn btn-danger btn-sm btn-delete-job" data-id="${job.id}" title="Delete listing">
              ${icons.trash}
            </button>
          </div>
        </td>
      `;

      tr.querySelector('.btn-edit-job').addEventListener('click', () => openJobFormModal(job));
      tr.querySelector('.btn-toggle-status').addEventListener('click', () => toggleJobStatus(job));
      tr.querySelector('.btn-delete-job').addEventListener('click', () => confirmDeleteJob(job));
      tr.querySelector('.btn-view-job-apps').addEventListener('click', () => {
        switchAdminTab('apps');
      });

      tbody.appendChild(tr);
    });
  }

  function renderAdminApplications() {
    const tbody = els.adminAppsTableBody;
    tbody.innerHTML = '';

    let apps = [...state.applications];
    const statusFilter = els.adminAppStatusFilter.value;
    if (statusFilter !== 'all') {
      apps = apps.filter(a => a.status === statusFilter);
    }

    els.adminAppTabCount.textContent = apps.length;

    if (apps.length === 0) {
      els.noAdminApps.style.display = 'block';
      return;
    } else {
      els.noAdminApps.style.display = 'none';
    }

    apps.forEach(app => {
      const tr = document.createElement('tr');

      const statusStyles = {
        pending: 'background-color: var(--status-pending-bg); color: var(--status-pending-fg); border-color: var(--status-pending-border);',
        reviewed: 'background-color: var(--status-reviewed-bg); color: var(--status-reviewed-fg); border-color: var(--status-reviewed-border);',
        shortlisted: 'background-color: var(--status-shortlisted-bg); color: var(--status-shortlisted-fg); border-color: var(--status-shortlisted-border);',
        rejected: 'background-color: var(--status-rejected-bg); color: var(--status-rejected-fg); border-color: var(--status-rejected-border);',
        hired: 'background-color: var(--status-hired-bg); color: var(--status-hired-fg); border-color: var(--status-hired-border);'
      };

      tr.innerHTML = `
        <td>
          <strong style="color: var(--neutral-900); font-size: 0.88rem;">${escapeHtml(app.applicant_name)}</strong><br>
          <span style="font-size: 0.76rem; color: var(--neutral-500);">${escapeHtml(app.applicant_email)}</span>
          ${app.applicant_phone ? `<br><span style="font-size: 0.72rem; color: var(--neutral-400);">${escapeHtml(app.applicant_phone)}</span>` : ''}
        </td>
        <td>
          <strong style="font-size: 0.84rem;">${escapeHtml(app.job_title || 'Position')}</strong><br>
          <span style="font-size: 0.76rem; color: var(--primary-700);">${escapeHtml(app.job_company || '')}</span>
        </td>
        <td>${app.experience_years} yrs</td>
        <td style="font-size: 0.78rem; color: var(--neutral-500);">${formatDate(app.created_at)}</td>
        <td>
          ${app.resume_data ? `
            <a href="/api/applications/${app.id}/resume" download="${escapeHtml(app.resume_name || 'resume.pdf')}" class="btn btn-outline-green btn-sm" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;">
              ${icons.download} ${escapeHtml(app.resume_name || 'Resume')}
            </a>
          ` : '<span style="color: var(--neutral-400); font-size: 0.75rem;">None</span>'}
        </td>
        <td>
          <select class="status-select" data-id="${app.id}" style="${statusStyles[app.status] || ''}">
            <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="reviewed" ${app.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
            <option value="shortlisted" ${app.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
            <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
            <option value="hired" ${app.status === 'hired' ? 'selected' : ''}>Hired</option>
          </select>
        </td>
        <td>
          <button class="btn btn-primary btn-sm btn-view-app-detail" data-id="${app.id}" style="font-size: 0.72rem; padding: 0.25rem 0.6rem;">
            Review
          </button>
        </td>
      `;

      const select = tr.querySelector('.status-select');
      select.addEventListener('change', async (e) => {
        await updateApplicationStatus(app.id, e.target.value);
      });

      tr.querySelector('.btn-view-app-detail').addEventListener('click', () => {
        openAppDetailModal(app);
      });

      tbody.appendChild(tr);
    });
  }

  // =========================================================================
  // Candidate "My Applications"
  // =========================================================================
  function renderMyApplications() {
    const tbody = els.myAppsTableBody;
    tbody.innerHTML = '';

    const myApps = getMySubmittedApps();

    if (myApps.length === 0) {
      els.noMyApps.style.display = 'block';
      return;
    } else {
      els.noMyApps.style.display = 'none';
    }

    myApps.forEach(app => {
      const tr = document.createElement('tr');

      const badgeStatusMap = {
        pending: { text: 'Under Review', bg: 'var(--status-pending-bg)', color: 'var(--status-pending-fg)', border: 'var(--status-pending-border)' },
        reviewed: { text: 'Application Reviewed', bg: 'var(--status-reviewed-bg)', color: 'var(--status-reviewed-fg)', border: 'var(--status-reviewed-border)' },
        shortlisted: { text: 'Shortlisted for Interview', bg: 'var(--status-shortlisted-bg)', color: 'var(--status-shortlisted-fg)', border: 'var(--status-shortlisted-border)' },
        rejected: { text: 'Not Selected', bg: 'var(--status-rejected-bg)', color: 'var(--status-rejected-fg)', border: 'var(--status-rejected-border)' },
        hired: { text: 'Offer Extended', bg: 'var(--status-hired-bg)', color: 'var(--status-hired-fg)', border: 'var(--status-hired-border)' }
      };

      const s = badgeStatusMap[app.status] || { text: app.status, bg: 'var(--neutral-100)', color: 'var(--neutral-700)', border: 'var(--neutral-200)' };

      tr.innerHTML = `
        <td>
          <strong style="color: var(--neutral-900); font-size: 0.9rem;">${escapeHtml(app.job_title || 'Position')}</strong><br>
          <span style="font-size: 0.78rem; color: var(--neutral-500);">${escapeHtml(app.job_company || 'Company')}</span>
        </td>
        <td>
          <span style="font-size: 0.84rem;">${escapeHtml(app.applicant_name)}</span><br>
          <span style="font-size: 0.74rem; color: var(--neutral-500);">${escapeHtml(app.applicant_email)}</span>
        </td>
        <td style="font-size: 0.8rem; color: var(--neutral-500);">${formatDate(app.created_at)}</td>
        <td>
          <span class="badge" style="background-color: ${s.bg}; color: ${s.color}; border: 1px solid ${s.border}; font-weight: 600;">
            ${s.text}
          </span>
        </td>
        <td>
          <button class="btn btn-outline-green btn-sm btn-view-job-from-app" data-jobid="${app.job_id}">
            View Job
          </button>
        </td>
      `;

      tr.querySelector('.btn-view-job-from-app').addEventListener('click', () => {
        const job = state.jobs.find(j => j.id === app.job_id);
        if (job) openJobDetailModal(job);
        else showToast('Job listing is no longer active', 'error');
      });

      tbody.appendChild(tr);
    });
  }

  // =========================================================================
  // Modals & User Actions
  // =========================================================================

  // 1. Job Detail Modal
  function openJobDetailModal(job) {
    state.activeJob = job;
    els.modalJobTitle.textContent = job.title;
    els.modalJobCompany.textContent = `${job.company} • ${job.location}`;
    els.modalJobLocation.textContent = job.location;
    els.modalJobType.textContent = job.job_type;
    els.modalJobCategory.textContent = job.category;
    els.modalJobExp.textContent = job.experience;

    const formattedSalary = job.salary_min && job.salary_max
      ? `${job.salary_currency}${job.salary_min.toLocaleString()} – ${job.salary_currency}${job.salary_max.toLocaleString()}`
      : 'Competitive Salary';
    els.modalJobSalary.textContent = formattedSalary;

    els.modalJobStatus.textContent = job.status.toUpperCase();
    els.modalJobStatus.className = 'badge ' + (job.status === 'active' ? 'badge-status-active' : 'badge-status-closed');

    els.modalJobDescription.textContent = job.description;
    els.modalJobRequirements.textContent = job.requirements || 'No specific requirements listed.';
    els.modalJobBenefits.textContent = job.benefits || 'Standard health, PTO, and compensation package.';

    if (job.status !== 'active') {
      els.modalApplyBtn.style.display = 'none';
    } else {
      els.modalApplyBtn.style.display = 'inline-flex';
    }

    openModal('jobDetailModal');
  }

  // 2. Application Modal
  function openApplicationModal(job) {
    closeModal('jobDetailModal');
    state.activeJob = job;
    els.applyJobId.value = job.id;
    els.applyModalSubtitle.textContent = `Applying for: ${job.title} at ${job.company}`;

    if (state.myEmail) {
      els.applicantEmail.value = state.myEmail;
    }

    state.resumeData = null;
    state.resumeName = '';
    els.resumeFileInput.value = '';
    els.resumeFilePreview.style.display = 'none';

    openModal('applyModal');
  }

  async function submitApplication(e) {
    if (e) e.preventDefault();

    const jobId = els.applyJobId.value;
    const name = els.applicantName.value.trim();
    const email = els.applicantEmail.value.trim();

    if (!name || !email) {
      showToast('Please enter your full name and email address.', 'error');
      return;
    }

    const payload = {
      applicant_name: name,
      applicant_email: email,
      applicant_phone: els.applicantPhone.value.trim(),
      experience_years: parseInt(els.applicantExp.value, 10) || 0,
      portfolio_url: els.applicantPortfolio.value.trim(),
      cover_letter: els.applicantCoverLetter.value.trim(),
      resume_name: state.resumeName || (state.resumeData ? 'Resume.pdf' : ''),
      resume_data: state.resumeData || ''
    };

    try {
      els.btnSubmitApplication.disabled = true;
      els.btnSubmitApplication.textContent = 'Submitting...';

      const res = await fetchJson(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      state.myAppIds.push(res.application.id);
      localStorage.setItem('verdant_my_app_ids', JSON.stringify(state.myAppIds));
      state.myEmail = email;
      localStorage.setItem('verdant_my_email', email);

      closeModal('applyModal');
      showToast(res.message || 'Application submitted successfully.', 'success');

      await reloadAllData();

      setTimeout(() => {
        switchView('my-apps');
      }, 500);
    } catch (err) {
      // Handled
    } finally {
      els.btnSubmitApplication.disabled = false;
      els.btnSubmitApplication.textContent = 'Submit Application';
    }
  }

  // 3. Admin Job Create / Edit Modal
  function openJobFormModal(jobToEdit = null) {
    if (jobToEdit) {
      els.jobFormModalTitle.textContent = 'Edit Position';
      els.editJobId.value = jobToEdit.id;
      els.jobFormTitle.value = jobToEdit.title;
      els.jobFormCompany.value = jobToEdit.company;
      els.jobFormLocation.value = jobToEdit.location;
      els.jobFormCategory.value = jobToEdit.category;
      els.jobFormType.value = jobToEdit.job_type;
      els.jobFormExperience.value = jobToEdit.experience;
      els.jobFormSalaryMin.value = jobToEdit.salary_min || '';
      els.jobFormSalaryMax.value = jobToEdit.salary_max || '';
      els.jobFormStatus.value = jobToEdit.status;
      els.jobFormDescription.value = jobToEdit.description;
      els.jobFormRequirements.value = jobToEdit.requirements;
      els.jobFormBenefits.value = jobToEdit.benefits;
      els.btnSaveJobForm.textContent = 'Update Listing';
    } else {
      els.jobFormModalTitle.textContent = 'Publish Position';
      els.editJobId.value = '';
      els.jobCreateOrEditForm.reset();
      els.jobFormStatus.value = 'active';
      els.btnSaveJobForm.textContent = 'Publish Position';
    }

    openModal('jobFormModal');
  }

  async function saveJobForm(e) {
    if (e) e.preventDefault();

    const title = els.jobFormTitle.value.trim();
    const company = els.jobFormCompany.value.trim();
    const location = els.jobFormLocation.value.trim();
    const description = els.jobFormDescription.value.trim();

    if (!title || !company || !description) {
      showToast('Title, Company, and Description are required.', 'error');
      return;
    }

    const payload = {
      title,
      company,
      location,
      category: els.jobFormCategory.value,
      job_type: els.jobFormType.value,
      experience: els.jobFormExperience.value,
      salary_min: parseInt(els.jobFormSalaryMin.value, 10) || 0,
      salary_max: parseInt(els.jobFormSalaryMax.value, 10) || 0,
      status: els.jobFormStatus.value,
      description,
      requirements: els.jobFormRequirements.value.trim(),
      benefits: els.jobFormBenefits.value.trim()
    };

    const isEdit = !!els.editJobId.value;
    const url = isEdit ? `/api/jobs/${els.editJobId.value}` : '/api/jobs';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      els.btnSaveJobForm.disabled = true;
      els.btnSaveJobForm.textContent = isEdit ? 'Updating...' : 'Publishing...';

      const res = await fetchJson(url, {
        method,
        body: JSON.stringify(payload)
      });

      closeModal('jobFormModal');
      showToast(res.message || (isEdit ? 'Listing updated.' : 'Position published.'), 'success');
      await reloadAllData();
    } catch (err) {
      // Handled
    } finally {
      els.btnSaveJobForm.disabled = false;
      els.btnSaveJobForm.textContent = isEdit ? 'Update Listing' : 'Publish Position';
    }
  }

  async function toggleJobStatus(job) {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      await fetchJson(`/api/jobs/${job.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`Position status changed to ${newStatus.toUpperCase()}`, 'success');
      await reloadAllData();
    } catch (err) {
      console.error(err);
    }
  }

  async function confirmDeleteJob(job) {
    const confirmed = confirm(`Delete position "${job.title}" at ${job.company}? This action is irreversible.`);
    if (!confirmed) return;

    try {
      await fetchJson(`/api/jobs/${job.id}`, { method: 'DELETE' });
      showToast('Listing removed successfully.', 'success');
      await reloadAllData();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateApplicationStatus(appId, newStatus) {
    try {
      const res = await fetchJson(`/api/applications/${appId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      showToast(res.message || `Status updated to ${newStatus}`, 'success');
      await reloadAllData();
    } catch (err) {
      console.error(err);
    }
  }

  function openAppDetailModal(app) {
    activeAppDetailId = app.id;
    els.appDetailApplicantName.textContent = app.applicant_name;
    els.appDetailJobTitle.textContent = `${app.job_title} at ${app.job_company}`;
    els.appDetailEmail.textContent = app.applicant_email;
    els.appDetailPhone.textContent = app.applicant_phone || 'None on record';
    els.appDetailExp.textContent = `${app.experience_years} years`;

    if (app.portfolio_url) {
      els.appDetailPortfolio.innerHTML = `<a href="${escapeHtml(app.portfolio_url)}" target="_blank" rel="noopener" style="color: var(--primary-700); text-decoration: underline;">${escapeHtml(app.portfolio_url)}</a>`;
    } else {
      els.appDetailPortfolio.textContent = 'None on record';
    }

    els.appDetailCoverLetter.textContent = app.cover_letter || 'No cover letter attached.';

    if (app.resume_data) {
      els.appDetailResumeName.textContent = app.resume_name || 'Resume.pdf';
      els.appDetailResumeDownloadBtn.href = `/api/applications/${app.id}/resume`;
      els.appDetailResumeDownloadBtn.download = app.resume_name || 'Resume.pdf';
      els.appDetailResumeDownloadBtn.style.display = 'inline-flex';
    } else {
      els.appDetailResumeName.textContent = 'No file attached';
      els.appDetailResumeDownloadBtn.style.display = 'none';
    }

    els.appDetailStatusSelect.value = app.status;
    openModal('appDetailModal');
  }

  // =========================================================================
  // Resume File Upload (Base64)
  // =========================================================================
  function handleResumeFileSelect(file) {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must not exceed 5MB', 'error');
      return;
    }

    state.resumeName = file.name;
    els.resumeFileName.textContent = file.name;
    els.resumeFilePreview.style.display = 'inline-flex';

    const reader = new FileReader();
    reader.onload = function (e) {
      state.resumeData = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // =========================================================================
  // View & Role Switching
  // =========================================================================
  function setRole(role) {
    state.currentRole = role;
    if (role === 'admin') {
      els.roleAdminBtn.classList.add('active');
      els.roleCandidateBtn.classList.remove('active');
      switchView('admin');
    } else {
      els.roleCandidateBtn.classList.add('active');
      els.roleAdminBtn.classList.remove('active');
      switchView('jobs');
    }
  }

  function switchView(viewName) {
    state.currentView = viewName;

    els.navBrowseJobs.classList.toggle('active', viewName === 'jobs');
    els.navMyApps.classList.toggle('active', viewName === 'my-apps');
    els.navAdminPortal.classList.toggle('active', viewName === 'admin');

    els.candidateJobBoardView.style.display = viewName === 'jobs' ? 'grid' : 'none';
    els.myApplicationsView.style.display = viewName === 'my-apps' ? 'block' : 'none';
    els.adminPortalView.style.display = viewName === 'admin' ? 'block' : 'none';

    els.heroSection.style.display = viewName === 'jobs' ? 'block' : 'none';
    els.adminHeaderBar.style.display = viewName === 'admin' ? 'block' : 'none';

    if (viewName === 'jobs') renderCandidateJobs();
    if (viewName === 'my-apps') renderMyApplications();
    if (viewName === 'admin') {
      renderAdminJobs();
      renderAdminApplications();
    }
  }

  function switchAdminTab(tabName) {
    state.adminTab = tabName;
    els.tabAdminJobs.classList.toggle('active', tabName === 'jobs');
    els.tabAdminApps.classList.toggle('active', tabName === 'apps');
    els.adminJobsPanel.style.display = tabName === 'jobs' ? 'block' : 'none';
    els.adminAppsPanel.style.display = tabName === 'apps' ? 'block' : 'none';
  }

  // =========================================================================
  // Modal Helpers
  // =========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================
  function setupEventListeners() {
    els.roleCandidateBtn.addEventListener('click', () => setRole('candidate'));
    els.roleAdminBtn.addEventListener('click', () => setRole('admin'));

    els.navBrowseJobs.addEventListener('click', () => {
      setRole('candidate');
      switchView('jobs');
    });
    els.navMyApps.addEventListener('click', () => {
      setRole('candidate');
      switchView('my-apps');
    });
    els.navAdminPortal.addEventListener('click', () => {
      setRole('admin');
    });
    els.logoBtn.addEventListener('click', () => {
      setRole('candidate');
      switchView('jobs');
    });

    els.headerPostJobBtn.addEventListener('click', () => {
      setRole('admin');
      openJobFormModal();
    });
    els.adminPostJobBtn.addEventListener('click', () => openJobFormModal());
    els.btnAdminCreateJob.addEventListener('click', () => openJobFormModal());

    els.tabAdminJobs.addEventListener('click', () => switchAdminTab('jobs'));
    els.tabAdminApps.addEventListener('click', () => switchAdminTab('apps'));

    els.adminAppStatusFilter.addEventListener('change', renderAdminApplications);
    els.adminJobSearchInput.addEventListener('input', renderAdminJobs);

    els.btnResetData.addEventListener('click', async () => {
      if (confirm('Reset database with fresh sample positions and applications?')) {
        await fetchJson('/api/reset', { method: 'POST' });
        showToast('Sample data reset successfully.', 'success');
        await reloadAllData();
      }
    });

    els.heroSearchSubmitBtn.addEventListener('click', () => {
      state.filters.search = els.heroSearchInput.value.trim();
      state.filters.location = els.heroLocationInput.value.trim();
      state.filters.category = els.heroCategorySelect.value;
      renderCandidateJobs();
    });

    els.heroSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') els.heroSearchSubmitBtn.click();
    });

    els.categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        els.categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.cat;
        state.filters.category = cat;

        const radio = document.querySelector(`input[name="filterCategory"][value="${cat}"]`);
        if (radio) radio.checked = true;

        renderCandidateJobs();
      });
    });

    els.categoryRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.filters.category = e.target.value;
        els.categoryChips.forEach(c => {
          c.classList.toggle('active', c.dataset.cat === e.target.value);
        });
        renderCandidateJobs();
      });
    });

    els.jobTypeCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        state.filters.jobTypes = Array.from(els.jobTypeCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        renderCandidateJobs();
      });
    });

    els.expCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        state.filters.experience = Array.from(els.expCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        renderCandidateJobs();
      });
    });

    els.sortSelector.addEventListener('change', (e) => {
      state.filters.sort = e.target.value;
      renderCandidateJobs();
    });

    function resetFilters() {
      state.filters.search = '';
      state.filters.location = '';
      state.filters.category = 'all';
      state.filters.jobTypes = [];
      state.filters.experience = [];
      state.filters.sort = 'newest';

      els.heroSearchInput.value = '';
      els.heroLocationInput.value = '';
      els.heroCategorySelect.value = 'all';

      els.categoryChips.forEach(c => c.classList.toggle('active', c.dataset.cat === 'all'));
      const allRadio = document.querySelector('input[name="filterCategory"][value="all"]');
      if (allRadio) allRadio.checked = true;

      els.jobTypeCheckboxes.forEach(c => c.checked = false);
      els.expCheckboxes.forEach(c => c.checked = false);
      els.sortSelector.value = 'newest';

      renderCandidateJobs();
    }

    els.filterResetBtn.addEventListener('click', resetFilters);
    els.btnResetFiltersEmpty.addEventListener('click', resetFilters);
    els.btnBrowseJobsFromEmpty.addEventListener('click', () => switchView('jobs'));

    els.modalApplyBtn.addEventListener('click', () => {
      if (state.activeJob) openApplicationModal(state.activeJob);
    });

    els.btnSubmitApplication.addEventListener('click', submitApplication);
    els.btnSaveJobForm.addEventListener('click', saveJobForm);

    els.btnUpdateAppDetailStatus.addEventListener('click', async () => {
      if (!activeAppDetailId) return;
      const status = els.appDetailStatusSelect.value;
      await updateApplicationStatus(activeAppDetailId, status);
      closeModal('appDetailModal');
    });

    els.resumeUploadBox.addEventListener('click', (e) => {
      if (e.target.id !== 'removeResumeBtn') {
        els.resumeFileInput.click();
      }
    });

    els.resumeFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleResumeFileSelect(e.target.files[0]);
      }
    });

    els.removeResumeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.resumeData = null;
      state.resumeName = '';
      els.resumeFileInput.value = '';
      els.resumeFilePreview.style.display = 'none';
    });

    els.resumeUploadBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      els.resumeUploadBox.style.borderColor = 'var(--primary-700)';
    });

    els.resumeUploadBox.addEventListener('dragleave', () => {
      els.resumeUploadBox.style.borderColor = 'var(--primary-400)';
    });

    els.resumeUploadBox.addEventListener('drop', (e) => {
      e.preventDefault();
      els.resumeUploadBox.style.borderColor = 'var(--primary-400)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleResumeFileSelect(e.dataTransfer.files[0]);
      }
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        closeModal(btn.dataset.closeModal);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      }
    });
  }

  // =========================================================================
  // Helpers
  // =========================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getTimeAgo(dateString) {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
