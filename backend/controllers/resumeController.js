const { getCollections, toObjectId } = require('../models/database');
const { serializeResume } = require('../models/serializers');

async function createResume(req, res) {
  const { resumesCol } = getCollections();
  const {
    user_id,
    name = 'Untitled Resume',
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = []
  } = req.body;

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
}

async function listResumes(req, res) {
  const { resumesCol } = getCollections();
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
}

async function updateResume(req, res) {
  const { resumesCol } = getCollections();
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
}

async function deleteResume(req, res) {
  const { resumesCol } = getCollections();
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
}

async function uploadResume(req, res) {
  const { jobSeekerResumesCol } = getCollections();
  const { user_id, resume_name, resume_file } = req.body;

  if (!user_id || !resume_name || !resume_file) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const userObjId = toObjectId(user_id);
  if (!userObjId) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const resume = {
      user_id: userObjId,
      name: resume_name,
      file_content: resume_file,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await jobSeekerResumesCol.insertOne(resume);
    return res.json({
      message: 'Resume uploaded successfully',
      resume_id: result.insertedId.toString()
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listUserResumes(req, res) {
  const { jobSeekerResumesCol } = getCollections();
  const { userId } = req.params;

  const userObjId = toObjectId(userId);
  if (!userObjId) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const resumes = await jobSeekerResumesCol.find({ user_id: userObjId }).sort({ created_at: -1 }).toArray();
    const serialized = resumes.map((resume) => ({
      id: resume._id.toString(),
      user_id: resume.user_id.toString(),
      name: resume.name,
      file_content: resume.file_content || '',
      created_at: resume.created_at,
      updated_at: resume.updated_at
    }));
    return res.json(serialized);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createResume,
  listResumes,
  updateResume,
  deleteResume,
  uploadResume,
  listUserResumes
};