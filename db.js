// db.js - SQLite database initialization and queries using Node.js built-in node:sqlite
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const crypto = require('node:crypto');

const dbPath = path.join(__dirname, 'jobs.db');
const db = new DatabaseSync(dbPath);

// Initialize tables
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      job_type TEXT NOT NULL,
      category TEXT NOT NULL,
      experience TEXT NOT NULL,
      salary_min INTEGER,
      salary_max INTEGER,
      salary_currency TEXT DEFAULT '$',
      description TEXT NOT NULL,
      requirements TEXT NOT NULL,
      benefits TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      applicant_name TEXT NOT NULL,
      applicant_email TEXT NOT NULL,
      applicant_phone TEXT,
      portfolio_url TEXT,
      experience_years INTEGER DEFAULT 0,
      cover_letter TEXT,
      resume_name TEXT,
      resume_data TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
    CREATE INDEX IF NOT EXISTS idx_apps_job_id ON applications(job_id);
    CREATE INDEX IF NOT EXISTS idx_apps_email ON applications(applicant_email);
  `);

  // Seed sample data if empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM jobs');
  const result = countStmt.get();
  if (result.count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  const sampleJobs = [
    {
      id: crypto.randomUUID(),
      title: 'Senior Full-Stack Engineer',
      company: 'Verdant Technologies',
      location: 'Remote (US / Europe)',
      job_type: 'Full-time',
      category: 'Engineering',
      experience: 'Senior',
      salary_min: 135000,
      salary_max: 175000,
      salary_currency: '$',
      description: 'We are seeking an experienced Senior Full-Stack Engineer to lead the architecture and scaling of our enterprise cloud services. You will collaborate closely with product management and design teams to build high-performance web applications, resilient backend microservices, and elegant developer APIs.',
      requirements: '• 5+ years of experience with modern TypeScript/JavaScript, Node.js, and React.\n• Strong database design skills (PostgreSQL, SQLite, Redis).\n• Experience designing and deploying scalable REST and GraphQL APIs.\n• Proven track record with cloud infrastructure (AWS/GCP, Docker, CI/CD pipelines).\n• Passion for writing clean, tested, and maintainable code.',
      benefits: '• Competitive salary + meaningful equity package\n• 100% remote work flexibility\n• Comprehensive health, dental, and vision coverage\n• $3,000 annual learning and home office stipend\n• Unlimited Paid Time Off (PTO)',
      status: 'active',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Lead Product Designer (UI/UX)',
      company: 'Evergreen Design Studio',
      location: 'New York, NY (Hybrid)',
      job_type: 'Full-time',
      category: 'Design',
      experience: 'Lead / Manager',
      salary_min: 140000,
      salary_max: 180000,
      salary_currency: '$',
      description: 'Evergreen is on a mission to craft sustainable digital experiences. As Lead Product Designer, you will shape our design system, mentor a team of talented designers, and work directly with founders to translate complex business workflows into simple, human-centered interfaces.',
      requirements: '• 6+ years of UX/UI product design experience for web and mobile.\n• Mastery of Figma, design systems, design tokens, and prototyping.\n• Strong portfolio demonstrating end-to-end design thinking and data-driven decisions.\n• Exceptional communication, presentation, and team mentoring skills.\n• Experience conducting user interviews and usability testing.',
      benefits: '• Top-tier health insurance & 401(k) matching\n• Hybrid schedule (2 days in-office, 3 days remote)\n• Annual company retreats in eco-resorts\n• Generous wellness and gym reimbursement',
      status: 'active',
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Growth Marketing Manager',
      company: 'Pinecone Growth Labs',
      location: 'San Francisco, CA / Remote',
      job_type: 'Full-time',
      category: 'Marketing',
      experience: 'Mid-level',
      salary_min: 95000,
      salary_max: 125000,
      salary_currency: '$',
      description: 'Join our marketing squad to drive user acquisition, activation, and retention. You will oversee paid ad campaigns, organic content strategies, email nurturing funnels, and conversion rate optimization (CRO) experiments.',
      requirements: '• 3+ years in growth marketing or performance marketing for B2B/SaaS.\n• Hands-on expertise with Google Ads, Meta Ads, LinkedIn Ads, and SEO tooling.\n• Strong analytical foundation using Google Analytics 4, Mixpanel, and SQL.\n• Creative copywriter with a knack for running A/B landing page tests.',
      benefits: '• Flexible hours and remote-first setup\n• Performance-based quarterly bonuses\n• Healthcare & 401(k) match\n• $1,500 annual conference allowance',
      status: 'active',
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'DevOps & Cloud Infrastructure Engineer',
      company: 'Canopy Networks',
      location: 'Austin, TX (Remote Friendly)',
      job_type: 'Full-time',
      category: 'Engineering',
      experience: 'Senior',
      salary_min: 130000,
      salary_max: 165000,
      salary_currency: '$',
      description: 'Help us maintain 99.99% uptime for critical infrastructure. You will manage our Kubernetes clusters, automate deployment pipelines with GitHub Actions and Terraform, and implement comprehensive monitoring and security guardrails.',
      requirements: '• 4+ years managing production infrastructure on AWS or GCP.\n• Deep knowledge of Kubernetes, Docker, Helm, and container orchestration.\n• Infrastructure as Code (IaC) mastery using Terraform or Pulumi.\n• Experience with Prometheus, Grafana, Datadog, and Incident Response.',
      benefits: '• Remote work stipend\n• Full medical, dental, life, and vision coverage\n• On-call compensation bonus\n• Parental leave up to 16 weeks fully paid',
      status: 'active',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Associate Product Manager',
      company: 'Forest & Oak Software',
      location: 'Chicago, IL (Hybrid)',
      job_type: 'Full-time',
      category: 'Product',
      experience: 'Entry-level',
      salary_min: 75000,
      salary_max: 95000,
      salary_currency: '$',
      description: 'Ideal opportunity for an aspiring product manager! You will collaborate directly with senior PMs and engineering leads to define user stories, analyze customer feedback, track sprint velocity, and launch delightful customer-facing features.',
      requirements: '• 1-2 years of experience in tech, consulting, data analysis, or UX.\n• Curious mindset with strong problem-solving and documentation skills.\n• Familiarity with Agile/Scrum development cycles and Jira/Linear.\n• Strong empathy for end-users and analytical curiosity.',
      benefits: '• Formal PM mentorship program\n• Full medical benefits\n• Commuter transit benefits\n• 401(k) with 5% company match',
      status: 'active',
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Technical Customer Success Specialist',
      company: 'Emerald Cloud Systems',
      location: 'Remote',
      job_type: 'Part-time',
      category: 'Customer Support',
      experience: 'Mid-level',
      salary_min: 45000,
      salary_max: 60000,
      salary_currency: '$',
      description: 'Provide high-touch technical onboarding and troubleshooting for our mid-market clients. You will assist developers with API integration queries, debug webhook issues, and write customer-facing knowledge base documentation.',
      requirements: '• 2+ years in technical support, customer engineering, or QA.\n• Basic proficiency with REST APIs, cURL, JSON, and webhooks.\n• Patient, empathetic communicator with outstanding written English.\n• Ability to work 20-25 hours per week on a flexible schedule.',
      benefits: '• Flexible scheduling\n• Pro-rated health stipend\n• Home office gear kit provided\n• Growth trajectory to full-time support engineer',
      status: 'active',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const insertJob = db.prepare(`
    INSERT INTO jobs (
      id, title, company, location, job_type, category, experience,
      salary_min, salary_max, salary_currency, description, requirements,
      benefits, status, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  for (const job of sampleJobs) {
    insertJob.run(
      job.id, job.title, job.company, job.location, job.job_type,
      job.category, job.experience, job.salary_min, job.salary_max,
      job.salary_currency, job.description, job.requirements, job.benefits,
      job.status, job.created_at, job.updated_at
    );
  }

  // Seed sample applications
  const sampleApps = [
    {
      id: crypto.randomUUID(),
      job_id: sampleJobs[0].id,
      applicant_name: 'Alex Johnson',
      applicant_email: 'alex.johnson@example.com',
      applicant_phone: '+1 (555) 234-5678',
      portfolio_url: 'https://alexjohnson.dev',
      experience_years: 6,
      cover_letter: 'I have spent the past 4 years building high-throughput microservices in Node and React. Verdant Technologies has an incredible mission, and I would love to bring my systems architecture expertise to the team.',
      resume_name: 'Alex_Johnson_Resume.pdf',
      resume_data: 'data:application/pdf;base64,JVBERi0xLjUKJcfsj6IKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCg==',
      status: 'shortlisted',
      notes: 'Strong candidate with extensive TypeScript and distributed systems background.',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: crypto.randomUUID(),
      job_id: sampleJobs[0].id,
      applicant_name: 'Morgan Smith',
      applicant_email: 'morgan.smith@example.com',
      applicant_phone: '+1 (555) 876-5432',
      portfolio_url: 'https://github.com/morgansmith',
      experience_years: 5,
      cover_letter: 'Excited about the Full-Stack role. My background includes full-stack development with React, Node, and AWS with a focus on UI polish and sub-100ms API responses.',
      resume_name: 'Morgan_Smith_Resume.pdf',
      resume_data: 'data:application/pdf;base64,JVBERi0xLjUKJcfsj6IKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCg==',
      status: 'reviewed',
      notes: 'Interview scheduled for Tuesday.',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: crypto.randomUUID(),
      job_id: sampleJobs[1].id,
      applicant_name: 'Elena Rostova',
      applicant_email: 'elena.design@example.com',
      applicant_phone: '+1 (555) 345-9876',
      portfolio_url: 'https://dribbble.com/elenarostova',
      experience_years: 7,
      cover_letter: 'I have led design systems for two venture-backed B2B startups. Crafting clean, cohesive visual languages with deep dark green and nature-inspired aesthetics is my specialty.',
      resume_name: 'Elena_Rostova_Portfolio.pdf',
      resume_data: 'data:application/pdf;base64,JVBERi0xLjUKJcfsj6IKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCg==',
      status: 'pending',
      notes: '',
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ];

  const insertApp = db.prepare(`
    INSERT INTO applications (
      id, job_id, applicant_name, applicant_email, applicant_phone,
      portfolio_url, experience_years, cover_letter, resume_name,
      resume_data, status, notes, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  for (const app of sampleApps) {
    insertApp.run(
      app.id, app.job_id, app.applicant_name, app.applicant_email,
      app.applicant_phone, app.portfolio_url, app.experience_years,
      app.cover_letter, app.resume_name, app.resume_data, app.status,
      app.notes, app.created_at
    );
  }
}

// Jobs Database Operations
function getAllJobs(filters = {}) {
  let sql = `
    SELECT j.*, COUNT(a.id) as application_count 
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE 1=1
  `;
  const params = [];

  if (filters.status && filters.status !== 'all') {
    sql += ' AND j.status = ?';
    params.push(filters.status);
  }

  if (filters.category && filters.category !== 'all') {
    sql += ' AND j.category = ?';
    params.push(filters.category);
  }

  if (filters.job_type && filters.job_type !== 'all') {
    sql += ' AND j.job_type = ?';
    params.push(filters.job_type);
  }

  if (filters.experience && filters.experience !== 'all') {
    sql += ' AND j.experience = ?';
    params.push(filters.experience);
  }

  if (filters.search && filters.search.trim()) {
    const term = `%${filters.search.trim().toLowerCase()}%`;
    sql += ' AND (LOWER(j.title) LIKE ? OR LOWER(j.company) LIKE ? OR LOWER(j.location) LIKE ? OR LOWER(j.description) LIKE ?)';
    params.push(term, term, term, term);
  }

  sql += ' GROUP BY j.id ORDER BY j.created_at DESC';

  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

function getJobById(id) {
  const stmt = db.prepare(`
    SELECT j.*, COUNT(a.id) as application_count 
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE j.id = ?
    GROUP BY j.id
  `);
  return stmt.get(id);
}

function createJob(data) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO jobs (
      id, title, company, location, job_type, category, experience,
      salary_min, salary_max, salary_currency, description, requirements,
      benefits, status, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  stmt.run(
    id,
    data.title || 'Untitled Position',
    data.company || 'Confidential',
    data.location || 'Remote',
    data.job_type || 'Full-time',
    data.category || 'Engineering',
    data.experience || 'Mid-level',
    Number(data.salary_min) || 0,
    Number(data.salary_max) || 0,
    data.salary_currency || '$',
    data.description || '',
    data.requirements || '',
    data.benefits || '',
    data.status || 'active',
    now,
    now
  );

  return getJobById(id);
}

function updateJob(id, data) {
  const existing = getJobById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE jobs SET
      title = ?,
      company = ?,
      location = ?,
      job_type = ?,
      category = ?,
      experience = ?,
      salary_min = ?,
      salary_max = ?,
      salary_currency = ?,
      description = ?,
      requirements = ?,
      benefits = ?,
      status = ?,
      updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    data.title !== undefined ? data.title : existing.title,
    data.company !== undefined ? data.company : existing.company,
    data.location !== undefined ? data.location : existing.location,
    data.job_type !== undefined ? data.job_type : existing.job_type,
    data.category !== undefined ? data.category : existing.category,
    data.experience !== undefined ? data.experience : existing.experience,
    data.salary_min !== undefined ? Number(data.salary_min) : existing.salary_min,
    data.salary_max !== undefined ? Number(data.salary_max) : existing.salary_max,
    data.salary_currency !== undefined ? data.salary_currency : existing.salary_currency,
    data.description !== undefined ? data.description : existing.description,
    data.requirements !== undefined ? data.requirements : existing.requirements,
    data.benefits !== undefined ? data.benefits : existing.benefits,
    data.status !== undefined ? data.status : existing.status,
    now,
    id
  );

  return getJobById(id);
}

function deleteJob(id) {
  const stmt = db.prepare('DELETE FROM jobs WHERE id = ?');
  stmt.run(id);
  return { success: true, id };
}

// Applications Database Operations
function createApplication(data) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO applications (
      id, job_id, applicant_name, applicant_email, applicant_phone,
      portfolio_url, experience_years, cover_letter, resume_name,
      resume_data, status, notes, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  stmt.run(
    id,
    data.job_id,
    data.applicant_name,
    data.applicant_email,
    data.applicant_phone || '',
    data.portfolio_url || '',
    Number(data.experience_years) || 0,
    data.cover_letter || '',
    data.resume_name || '',
    data.resume_data || '',
    'pending',
    '',
    now
  );

  return getApplicationById(id);
}

function getAllApplications(filters = {}) {
  let sql = `
    SELECT a.*, j.title as job_title, j.company as job_company, j.location as job_location
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.job_id) {
    sql += ' AND a.job_id = ?';
    params.push(filters.job_id);
  }

  if (filters.status && filters.status !== 'all') {
    sql += ' AND a.status = ?';
    params.push(filters.status);
  }

  if (filters.applicant_email) {
    sql += ' AND LOWER(a.applicant_email) = ?';
    params.push(filters.applicant_email.trim().toLowerCase());
  }

  if (filters.search && filters.search.trim()) {
    const term = `%${filters.search.trim().toLowerCase()}%`;
    sql += ' AND (LOWER(a.applicant_name) LIKE ? OR LOWER(a.applicant_email) LIKE ? OR LOWER(j.title) LIKE ?)';
    params.push(term, term, term);
  }

  sql += ' ORDER BY a.created_at DESC';

  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

function getApplicationById(id) {
  const stmt = db.prepare(`
    SELECT a.*, j.title as job_title, j.company as job_company, j.location as job_location
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.id = ?
  `);
  return stmt.get(id);
}

function updateApplication(id, data) {
  const existing = getApplicationById(id);
  if (!existing) return null;

  const stmt = db.prepare(`
    UPDATE applications SET
      status = ?,
      notes = ?
    WHERE id = ?
  `);

  stmt.run(
    data.status !== undefined ? data.status : existing.status,
    data.notes !== undefined ? data.notes : existing.notes,
    id
  );

  return getApplicationById(id);
}

function getStats() {
  const totalJobs = db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;
  const activeJobs = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'").get().count;
  const totalApps = db.prepare('SELECT COUNT(*) as count FROM applications').get().count;
  const shortlistedApps = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'shortlisted'").get().count;
  const hiredApps = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'hired'").get().count;

  return {
    totalJobs,
    activeJobs,
    totalApplications: totalApps,
    shortlistedApplications: shortlistedApps,
    hiredApplications: hiredApps
  };
}

module.exports = {
  initDb,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  getStats,
  resetDb: () => {
    db.exec('DROP TABLE IF EXISTS applications; DROP TABLE IF EXISTS jobs;');
    initDb();
  }
};

