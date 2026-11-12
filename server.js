// server.js - Zero-dependency, high-performance Node.js HTTP Server for Job Portal
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const db = require('./db');

// Initialize database
db.initDb();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) { // 10MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

function serveStaticFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing if available
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (indexErr, indexData) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexData);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = reqUrl.pathname;
  const method = req.method.toUpperCase();

  try {
    // -------------------------------------------------------------
    // API ROUTES
    // -------------------------------------------------------------
    if (pathname.startsWith('/api/')) {
      // GET /api/stats
      if (pathname === '/api/stats' && method === 'GET') {
        const stats = db.getStats();
        return sendJson(res, 200, { success: true, stats });
      }

      // POST /api/reset
      if (pathname === '/api/reset' && method === 'POST') {
        db.resetDb();
        return sendJson(res, 200, { success: true, message: 'Database reset to sample state' });
      }

      // GET /api/jobs
      if (pathname === '/api/jobs' && method === 'GET') {
        const filters = {
          search: reqUrl.searchParams.get('search'),
          category: reqUrl.searchParams.get('category'),
          job_type: reqUrl.searchParams.get('job_type'),
          experience: reqUrl.searchParams.get('experience'),
          status: reqUrl.searchParams.get('status')
        };
        const jobs = db.getAllJobs(filters);
        return sendJson(res, 200, { success: true, count: jobs.length, jobs });
      }

      // POST /api/jobs (Admin post job)
      if (pathname === '/api/jobs' && method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.title || !body.company || !body.description) {
          return sendJson(res, 400, {
            success: false,
            error: 'Title, Company, and Description are required fields.'
          });
        }
        const createdJob = db.createJob(body);
        return sendJson(res, 201, { success: true, job: createdJob, message: 'Job posted successfully!' });
      }

      // GET /api/jobs/:id
      const jobMatch = pathname.match(/^\/api\/jobs\/([a-zA-Z0-9-]+)$/);
      if (jobMatch) {
        const jobId = jobMatch[1];

        if (method === 'GET') {
          const job = db.getJobById(jobId);
          if (!job) return sendJson(res, 400, { success: false, error: 'Job not found' });
          return sendJson(res, 200, { success: true, job });
        }

        // PUT /api/jobs/:id (Admin update job)
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          const updatedJob = db.updateJob(jobId, body);
          if (!updatedJob) return sendJson(res, 404, { success: false, error: 'Job not found' });
          return sendJson(res, 200, { success: true, job: updatedJob, message: 'Job updated successfully!' });
        }

        // DELETE /api/jobs/:id (Admin delete job)
        if (method === 'DELETE') {
          const result = db.deleteJob(jobId);
          return sendJson(res, 200, { success: true, message: 'Job deleted successfully!', id: jobId });
        }
      }

      // POST /api/jobs/:id/apply (Candidate apply for job)
      const applyMatch = pathname.match(/^\/api\/jobs\/([a-zA-Z0-9-]+)\/apply$/);
      if (applyMatch && method === 'POST') {
        const jobId = applyMatch[1];
        const job = db.getJobById(jobId);
        if (!job) return sendJson(res, 404, { success: false, error: 'Job position does not exist' });
        if (job.status !== 'active') {
          return sendJson(res, 400, { success: false, error: 'This job listing is no longer accepting applications' });
        }

        const body = await parseJsonBody(req);
        if (!body.applicant_name || !body.applicant_email) {
          return sendJson(res, 400, { success: false, error: 'Full Name and Email Address are required' });
        }

        const appData = {
          job_id: jobId,
          applicant_name: body.applicant_name,
          applicant_email: body.applicant_email,
          applicant_phone: body.applicant_phone || '',
          portfolio_url: body.portfolio_url || '',
          experience_years: body.experience_years || 0,
          cover_letter: body.cover_letter || '',
          resume_name: body.resume_name || 'Resume.pdf',
          resume_data: body.resume_data || ''
        };

        const newApp = db.createApplication(appData);
        return sendJson(res, 201, {
          success: true,
          application: newApp,
          message: 'Your application has been submitted successfully! The hiring team has been notified.'
        });
      }

      // GET /api/applications (Admin view applications, or candidate view own applications)
      if (pathname === '/api/applications' && method === 'GET') {
        const filters = {
          job_id: reqUrl.searchParams.get('job_id'),
          status: reqUrl.searchParams.get('status'),
          applicant_email: reqUrl.searchParams.get('applicant_email'),
          search: reqUrl.searchParams.get('search')
        };
        const applications = db.getAllApplications(filters);
        return sendJson(res, 200, { success: true, count: applications.length, applications });
      }

      // Single application endpoints
      const appMatch = pathname.match(/^\/api\/applications\/([a-zA-Z0-9-]+)$/);
      if (appMatch) {
        const appId = appMatch[1];

        if (method === 'GET') {
          const application = db.getApplicationById(appId);
          if (!application) return sendJson(res, 404, { success: false, error: 'Application not found' });
          return sendJson(res, 200, { success: true, application });
        }

        // PATCH /api/applications/:id (Update status or notes)
        if (method === 'PATCH' || method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateApplication(appId, body);
          if (!updated) return sendJson(res, 404, { success: false, error: 'Application not found' });
          return sendJson(res, 200, {
            success: true,
            application: updated,
            message: `Application marked as ${updated.status}`
          });
        }
      }

      // Resume download / preview
      const resumeMatch = pathname.match(/^\/api\/applications\/([a-zA-Z0-9-]+)\/resume$/);
      if (resumeMatch && method === 'GET') {
        const appId = resumeMatch[1];
        const app = db.getApplicationById(appId);
        if (!app || !app.resume_data) {
          return sendJson(res, 404, { success: false, error: 'Resume not found' });
        }

        // If resume is stored as base64 data URL
        const dataUrlMatch = app.resume_data.match(/^data:([^;]+);base64,(.+)$/);
        if (dataUrlMatch) {
          const mime = dataUrlMatch[1];
          const buffer = Buffer.from(dataUrlMatch[2], 'base64');
          res.writeHead(200, {
            'Content-Type': mime,
            'Content-Disposition': `attachment; filename="${app.resume_name || 'resume.pdf'}"`,
            'Content-Length': buffer.length
          });
          res.end(buffer);
          return;
        } else {
          // Plain text fallback
          res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `inline; filename="${app.resume_name || 'resume.txt'}"`
          });
          res.end(app.resume_data);
          return;
        }
      }

      // Fallback for unmatched API routes
      return sendJson(res, 404, { success: false, error: 'API route not found' });
    }

    // -------------------------------------------------------------
    // STATIC ASSETS
    // -------------------------------------------------------------
    let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    // Prevent path traversal
    const safePath = path.normalize(path.join(PUBLIC_DIR, relativePath));
    if (!safePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access Denied');
      return;
    }

    serveStaticFile(req, res, safePath);
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { success: false, error: 'Internal Server Error: ' + err.message });
  }
});

server.listen(PORT, () => {
  console.log(`VerdantJobs Server is running at http://localhost:${PORT}`);
  console.log(`Database connected successfully with SQLite.`);
});

