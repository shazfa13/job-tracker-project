const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const PORT = parseInt(process.env.PORT, 10) || 5000;

const client = new MongoClient(MONGO_URI);

let usersCol;
let jobsCol;
let resumesCol;

function toObjectId(id) {
  if (!id) return null;
  try {
    return new ObjectId(id);
  } catch (err) {
    return null;
  }
}

function serializeJob(job) {
  return {
    id: job._id.toString(),
    user_id: job.user_id.toString(),
    company: job.company || '',
    role: job.role || '',
    status: job.status || '',
    notes: job.notes || '',
    deadline: job.deadline || '',
    date_applied: job.date_applied || '',
    followup: job.followup || '',
    url: job.url || ''
  };
}

function serializeResume(resume) {
  return {
    id: resume._id.toString(),
    user_id: resume.user_id.toString(),
    name: resume.name || 'Untitled Resume',
    personalInfo: resume.personalInfo || {},
    summary: resume.summary || '',
    experience: resume.experience || [],
    education: resume.education || [],
    skills: resume.skills || [],
    projects: resume.projects || [],
    created_at: resume.created_at,
    updated_at: resume.updated_at
  };
}

function serializeUser(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    role: user.role || 'client'
  };
}

app.post('/signup', async (req, res) => {
  const { username, password, role = 'client' } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    await usersCol.insertOne({ username, password, role });
    return res.json({ message: 'User created' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User already exists' });
    }
    return res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await usersCol.findOne({ username, password });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return res.json({ message: 'Login successful', role: user.role || 'client', user_id: user._id.toString() });
});

// Resume Management Endpoints
app.post('/resumes', async (req, res) => {
  const { user_id, name = 'Untitled Resume', personalInfo = {}, summary = '', experience = [], education = [], skills = [], projects = [] } = req.body;
  
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const userObjId = toObjectId(user_id);
  if (!userObjId) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const resumeData = {
      user_id: userObjId,
      name,
      personalInfo,
      summary,
      experience,
      education,
      skills,
      projects,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await resumesCol.insertOne(resumeData);
    return res.json({ 
      message: 'Resume created successfully', 
      resume: serializeResume({ ...resumeData, _id: result.insertedId })
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/resumes', async (req, res) => {
  const { user_id, role = 'client' } = req.query;
  
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const userObjId = toObjectId(user_id);
  if (!userObjId) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const resumes = await resumesCol.find({ user_id: userObjId }).sort({ updated_at: -1 }).toArray();
    return res.json(resumes.map(serializeResume));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/resumes/:resumeId', async (req, res) => {
  const { resumeId } = req.params;
  const { user_id, name, personalInfo, summary, experience, education, skills, projects } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const resumeObjId = toObjectId(resumeId);
  const userObjId = toObjectId(user_id);
  
  if (!resumeObjId || !userObjId) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const resume = await resumesCol.findOne({ _id: resumeObjId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (resume.user_id.toString() !== userObjId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateData = {
      name: name || resume.name,
      personalInfo: personalInfo || resume.personalInfo,
      summary: summary !== undefined ? summary : resume.summary,
      experience: experience !== undefined ? experience : resume.experience,
      education: education !== undefined ? education : resume.education,
      skills: skills !== undefined ? skills : resume.skills,
      projects: projects !== undefined ? projects : resume.projects,
      updated_at: new Date()
    };

    await resumesCol.updateOne({ _id: resumeObjId }, { $set: updateData });
    return res.json({ message: 'Resume updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/resumes/:resumeId', async (req, res) => {
  const { resumeId } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const resumeObjId = toObjectId(resumeId);
  const userObjId = toObjectId(user_id);
  
  if (!resumeObjId || !userObjId) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const resume = await resumesCol.findOne({ _id: resumeObjId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (resume.user_id.toString() !== userObjId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await resumesCol.deleteOne({ _id: resumeObjId });
    return res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Job Management Endpoints
app.post('/jobs', async (req, res) => {
  const { user_id, company, role, status, notes = '', deadline = '', date_applied = '', followup = '', url = '' } = req.body;
  if (!user_id || !company || !role || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const userObjId = toObjectId(user_id);
  if (!userObjId) {
    return res.status(400).json({ error: 'Invalid user_id' });
  }
  const result = await jobsCol.insertOne({ user_id: userObjId, company, role, status, notes, deadline, date_applied, followup, url });
  return res.json({ message: 'Job added', id: result.insertedId.toString() });
});

app.get('/jobs', async (req, res) => {
  const { user_id, role = 'client' } = req.query;
  let query = {};
  if (role !== 'admin') {
    const userObjId = toObjectId(user_id);
    if (!userObjId) return res.status(400).json({ error: 'Invalid user_id' });
    query = { user_id: userObjId };
  }
  const jobs = await jobsCol.find(query).toArray();
  return res.json(jobs.map(serializeJob));
});

app.put('/jobs/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const { user_id, user_role = 'client', company, job_role, status, deadline, date_applied, followup, notes, url } = req.body;

  if (!user_id || !company || !job_role || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const jobObjId = toObjectId(jobId);
  const userObjId = toObjectId(user_id);
  if (!jobObjId || !userObjId) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const job = await jobsCol.findOne({ _id: jobObjId });
  if (!job) return res.status(404).json({ error: 'Job not found' });

  if (user_role !== 'admin' && job.user_id.toString() !== userObjId.toString()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updateData = { company, role: job_role, status };
  if (deadline !== undefined) updateData.deadline = deadline;
  if (date_applied !== undefined) updateData.date_applied = date_applied;
  if (followup !== undefined) updateData.followup = followup;
  if (notes !== undefined) updateData.notes = notes;
  if (url !== undefined) updateData.url = url;

  await jobsCol.updateOne({ _id: jobObjId }, { $set: updateData });
  return res.json({ message: 'Job updated' });
});

app.delete('/jobs/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const { user_id, role = 'client' } = req.query;

  const jobObjId = toObjectId(jobId);
  const userObjId = toObjectId(user_id);

  if (!jobObjId || (role !== 'admin' && !userObjId)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const job = await jobsCol.findOne({ _id: jobObjId });
  if (!job) return res.status(404).json({ error: 'Job not found' });

  if (role !== 'admin' && job.user_id.toString() !== userObjId.toString()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await jobsCol.deleteOne({ _id: jobObjId });
  return res.json({ message: 'Deleted' });
});

app.get('/jobs/:jobId/notes', async (req, res) => {
  const { jobId } = req.params;
  const { user_id, role = 'client' } = req.query;

  const jobObjId = toObjectId(jobId);
  const userObjId = toObjectId(user_id);

  if (!jobObjId) {
    return res.status(400).json({ error: 'Invalid job id' });
  }

  const job = await jobsCol.findOne({ _id: jobObjId });
  if (!job) return res.status(404).json({ error: 'Job not found' });

  if (role !== 'admin' && job.user_id.toString() !== userObjId.toString()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  return res.json({ notes: job.notes || '' });
});

app.post('/jobs/:jobId/notes', async (req, res) => {
  const { jobId } = req.params;
  const { user_id, role = 'client', notes = '' } = req.body;

  const jobObjId = toObjectId(jobId);
  const userObjId = toObjectId(user_id);

  if (!jobObjId) {
    return res.status(400).json({ error: 'Invalid job id' });
  }

  const job = await jobsCol.findOne({ _id: jobObjId });
  if (!job) return res.status(404).json({ error: 'Job not found' });

  if (role !== 'admin' && job.user_id.toString() !== userObjId.toString()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await jobsCol.updateOne({ _id: jobObjId }, { $set: { notes } });
  return res.json({ message: 'Notes updated' });
});

app.post('/reset-db', async (req, res) => {
  await usersCol.deleteMany({});
  await jobsCol.deleteMany({});
  return res.json({ message: 'Database reset successfully' });
});

app.get('/admin/jobs', async (req, res) => {
  const { role = 'client' } = req.query;
  if (role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const jobs = await jobsCol.find().toArray();
  return res.json(jobs.map(serializeJob));
});

app.get('/admin/clients', async (req, res) => {
  const { role = 'client' } = req.query;
  if (role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const clients = await usersCol.find({ role: 'client' }).project({ password: 0 }).toArray();
  return res.json(clients.map(serializeUser));
});

app.delete('/admin/clients/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { role = 'client' } = req.query;

  if (role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const clientObjId = toObjectId(clientId);
  if (!clientObjId) return res.status(400).json({ error: 'Invalid client id' });

  await jobsCol.deleteMany({ user_id: clientObjId });
  await usersCol.deleteOne({ _id: clientObjId });
  return res.json({ message: 'Client deleted successfully' });
});

app.post('/analyze-skills', async (req, res) => {
  const { description } = req.body;
  
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    // Simple keyword-based skill extraction (in production, integrate with actual AI service)
    const commonSkills = [
      "JavaScript", "Python", "Java", "React", "Node.js", "Angular", "Vue.js",
      "HTML", "CSS", "TypeScript", "MongoDB", "SQL", "PostgreSQL",
      "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git",
      "Agile", "Scrum", "Project Management", "Communication", "Leadership",
      "Machine Learning", "Data Science", "Analytics", "Marketing", "Sales",
      "Customer Service", "Problem Solving", "Critical Thinking", "Teamwork",
      "REST APIs", "GraphQL", "Microservices", "DevOps", "CI/CD",
      "Testing", "Unit Testing", "Integration Testing", "UI/UX Design",
      "Figma", "Adobe Creative Suite", "Content Writing", "SEO", "SEM"
    ];

    const foundSkills = [];
    const lowerText = description.toLowerCase();
    
    commonSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase()) || 
          lowerText.includes(skill.toLowerCase().replace(/\./g, "")) ||
          lowerText.includes(skill.toLowerCase().replace(/\s/g, ""))) {
        if (!foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      }
    });

    // Add contextual skills based on keywords
    if (lowerText.includes("senior") || lowerText.includes("lead")) {
      foundSkills.push("Leadership", "Mentoring");
    }
    if (lowerText.includes("remote")) {
      foundSkills.push("Remote Collaboration", "Time Management");
    }
    if (lowerText.includes("team")) {
      foundSkills.push("Teamwork", "Collaboration");
    }

    const uniqueSkills = [...new Set(foundSkills)].slice(0, 12);
    
    return res.json({ 
      skills: uniqueSkills,
      count: uniqueSkills.length
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to analyze skills' });
  }
});

app.delete('/admin/jobs/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const { role } = req.query;
  if (role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const jobObjId = toObjectId(jobId);
  if (!jobObjId) return res.status(400).json({ error: 'Invalid job id' });

  await jobsCol.deleteOne({ _id: jobObjId });
  return res.json({ message: 'Job deleted successfully' });
});

async function start() {
  try {
    await client.connect();
    const db = client.db('jobtracker');
    usersCol = db.collection('users');
    jobsCol = db.collection('jobs');
    resumesCol = db.collection('resumes');

    await usersCol.createIndex({ username: 1 }, { unique: true });
    await jobsCol.createIndex({ user_id: 1 });
    await resumesCol.createIndex({ user_id: 1 });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect MongoDB:', err);
    process.exit(1);
  }
}

start();
