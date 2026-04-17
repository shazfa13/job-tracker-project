const { getCollections, toObjectId } = require('../models/database');
const { serializeJob } = require('../models/serializers');

async function createJob(req, res) {
  const { jobsCol } = getCollections();
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
}

async function listJobs(req, res) {
  const { jobsCol } = getCollections();
  const { user_id, role = 'client' } = req.query;
  let query = {};

  if (role !== 'admin') {
    const userObjId = toObjectId(user_id);
    if (!userObjId) return res.status(400).json({ error: 'Invalid user_id' });
    query = { user_id: userObjId };
  }

  const jobs = await jobsCol.find(query).toArray();
  return res.json(jobs.map(serializeJob));
}

async function updateJob(req, res) {
  const { jobsCol } = getCollections();
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
}

async function deleteJob(req, res) {
  const { jobsCol } = getCollections();
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
}

async function getJobNotes(req, res) {
  const { jobsCol } = getCollections();
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
}

async function updateJobNotes(req, res) {
  const { jobsCol } = getCollections();
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
}

async function resetDatabase(req, res) {
  const { usersCol, jobsCol } = getCollections();

  await usersCol.deleteMany({});
  await jobsCol.deleteMany({});
  return res.json({ message: 'Database reset successfully' });
}

async function analyzeSkills(req, res) {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'HTML', 'CSS', 'TypeScript', 'MongoDB', 'SQL', 'PostgreSQL',
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Git',
      'Agile', 'Scrum', 'Project Management', 'Communication', 'Leadership',
      'Machine Learning', 'Data Science', 'Analytics', 'Marketing', 'Sales',
      'Customer Service', 'Problem Solving', 'Critical Thinking', 'Teamwork',
      'REST APIs', 'GraphQL', 'Microservices', 'DevOps', 'CI/CD',
      'Testing', 'Unit Testing', 'Integration Testing', 'UI/UX Design',
      'Figma', 'Adobe Creative Suite', 'Content Writing', 'SEO', 'SEM'
    ];

    const foundSkills = [];
    const lowerText = description.toLowerCase();

    commonSkills.forEach((skill) => {
      if (
        lowerText.includes(skill.toLowerCase()) ||
        lowerText.includes(skill.toLowerCase().replace(/\./g, '')) ||
        lowerText.includes(skill.toLowerCase().replace(/\s/g, ''))
      ) {
        if (!foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      }
    });

    if (lowerText.includes('senior') || lowerText.includes('lead')) {
      foundSkills.push('Leadership', 'Mentoring');
    }

    if (lowerText.includes('remote')) {
      foundSkills.push('Remote Collaboration', 'Time Management');
    }

    if (lowerText.includes('team')) {
      foundSkills.push('Teamwork', 'Collaboration');
    }

    const uniqueSkills = [...new Set(foundSkills)].slice(0, 12);

    return res.json({
      skills: uniqueSkills,
      count: uniqueSkills.length
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to analyze skills' });
  }
}

module.exports = {
  createJob,
  listJobs,
  updateJob,
  deleteJob,
  getJobNotes,
  updateJobNotes,
  resetDatabase,
  analyzeSkills
};