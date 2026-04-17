const { getCollections, toObjectId } = require('../models/database');
const { serializeApplication, serializeJobPosting } = require('../models/serializers');

async function createJobPosting(req, res) {
  const { jobPostingsCol } = getCollections();
  const { recruiter_id, position, company, description, requirements } = req.body;

  if (!recruiter_id || !position || !description || !requirements) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const recruiterObjId = toObjectId(recruiter_id);
  if (!recruiterObjId) {
    return res.status(400).json({ error: 'Invalid recruiter ID' });
  }

  try {
    const jobPosting = {
      recruiter_id: recruiterObjId,
      position,
      company: company || '',
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await jobPostingsCol.insertOne(jobPosting);
    return res.json({
      message: 'Job posting created successfully',
      job_id: result.insertedId.toString()
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listJobPostings(req, res) {
  const { jobPostingsCol } = getCollections();

  try {
    const jobs = await jobPostingsCol.find({}).sort({ created_at: -1 }).toArray();
    return res.json(jobs.map(serializeJobPosting));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getRecruiterJobs(req, res) {
  const { jobPostingsCol } = getCollections();
  const { recruiterId } = req.params;

  const recruiterObjId = toObjectId(recruiterId);
  if (!recruiterObjId) {
    return res.status(400).json({ error: 'Invalid recruiter ID' });
  }

  try {
    const jobs = await jobPostingsCol.find({ recruiter_id: recruiterObjId }).sort({ created_at: -1 }).toArray();
    return res.json(jobs.map(serializeJobPosting));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteJobPosting(req, res) {
  const { jobPostingsCol, jobApplicationsCol } = getCollections();
  const { jobId } = req.params;

  const jobObjId = toObjectId(jobId);
  if (!jobObjId) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  try {
    await jobPostingsCol.deleteOne({ _id: jobObjId });
    await jobApplicationsCol.deleteMany({ job_id: jobObjId });
    return res.json({ message: 'Job posting deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function applyJob(req, res) {
  const { usersCol, jobPostingsCol, jobApplicationsCol } = getCollections();
  const { user_id, job_id, resume_attachment, cover_page_attachment, referral = '' } = req.body;

  if (!user_id || !job_id || !resume_attachment || !cover_page_attachment) {
    return res.status(400).json({ error: 'Resume and cover page are required' });
  }

  if (!resume_attachment?.name || !resume_attachment?.data || !cover_page_attachment?.name || !cover_page_attachment?.data) {
    return res.status(400).json({ error: 'Invalid attachment payload' });
  }

  const userObjId = toObjectId(user_id);
  const jobObjId = toObjectId(job_id);

  if (!userObjId || !jobObjId) {
    return res.status(400).json({ error: 'Invalid user or job ID' });
  }

  try {
    const existing = await jobApplicationsCol.findOne({ user_id: userObjId, job_id: jobObjId });
    if (existing) {
      return res.status(409).json({ error: 'You have already applied for this job' });
    }

    const jobPosting = await jobPostingsCol.findOne({ _id: jobObjId });
    if (!jobPosting) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    const user = await usersCol.findOne({ _id: userObjId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const application = {
      user_id: userObjId,
      job_id: jobObjId,
      recruiter_id: jobPosting.recruiter_id,
      job_title: jobPosting.position,
      company_name: jobPosting.company,
      user_name: user.username,
      resume_attachment,
      cover_page_attachment,
      referral,
      status: 'pending',
      applied_at: new Date(),
      updated_at: new Date()
    };

    const result = await jobApplicationsCol.insertOne(application);
    return res.json({
      message: 'Applied successfully',
      application_id: result.insertedId.toString()
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listUserApplications(req, res) {
  const { jobApplicationsCol } = getCollections();
  const { userId } = req.params;

  const userObjId = toObjectId(userId);
  if (!userObjId) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const applications = await jobApplicationsCol.find({ user_id: userObjId }).sort({ applied_at: -1 }).toArray();
    return res.json(applications.map((application) => serializeApplication(application)));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function withdrawApplication(req, res) {
  const { jobApplicationsCol } = getCollections();
  const { applicationId } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const applicationObjId = toObjectId(applicationId);
  const userObjId = toObjectId(user_id);

  if (!applicationObjId || !userObjId) {
    return res.status(400).json({ error: 'Invalid application or user ID' });
  }

  try {
    const application = await jobApplicationsCol.findOne({ _id: applicationObjId });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.user_id.toString() !== userObjId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await jobApplicationsCol.deleteOne({ _id: applicationObjId });
    return res.json({ message: 'Application withdrawn successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateApplicationStatus(req, res) {
  const { jobApplicationsCol } = getCollections();
  const { applicationId } = req.params;
  const { recruiter_id, status } = req.body;

  if (!recruiter_id || !status) {
    return res.status(400).json({ error: 'Recruiter ID and status are required' });
  }

  const normalizedStatus = String(status).toLowerCase();
  if (!['accepted', 'rejected'].includes(normalizedStatus)) {
    return res.status(400).json({ error: 'Status must be accepted or rejected' });
  }

  const applicationObjId = toObjectId(applicationId);
  const recruiterObjId = toObjectId(recruiter_id);

  if (!applicationObjId || !recruiterObjId) {
    return res.status(400).json({ error: 'Invalid application or recruiter ID' });
  }

  try {
    const application = await jobApplicationsCol.findOne({ _id: applicationObjId });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.recruiter_id.toString() !== recruiterObjId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await jobApplicationsCol.updateOne(
      { _id: applicationObjId },
      { $set: { status: normalizedStatus, updated_at: new Date() } }
    );

    return res.json({ message: 'Application status updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function recruiterAnalytics(req, res) {
  const { jobPostingsCol, jobApplicationsCol } = getCollections();
  const { recruiterId } = req.params;

  const recruiterObjId = toObjectId(recruiterId);
  if (!recruiterObjId) {
    return res.status(400).json({ error: 'Invalid recruiter ID' });
  }

  try {
    const jobs = await jobPostingsCol.find({ recruiter_id: recruiterObjId }).sort({ created_at: -1 }).toArray();
    const applications = await jobApplicationsCol.find({ recruiter_id: recruiterObjId }).toArray();

    const jobStatsMap = jobs.reduce((acc, job) => {
      acc[job._id.toString()] = {
        job_id: job._id.toString(),
        position: job.position,
        company: job.company,
        totalApplicants: 0,
        accepted: 0,
        rejected: 0,
        pending: 0
      };
      return acc;
    }, {});

    applications.forEach((application) => {
      const key = application.job_id.toString();
      if (!jobStatsMap[key]) return;

      jobStatsMap[key].totalApplicants += 1;
      const statusValue = String(application.status || 'pending').toLowerCase();
      if (statusValue === 'accepted') {
        jobStatsMap[key].accepted += 1;
      } else if (statusValue === 'rejected') {
        jobStatsMap[key].rejected += 1;
      } else {
        jobStatsMap[key].pending += 1;
      }
    });

    const jobsAnalytics = Object.values(jobStatsMap);
    const summary = jobsAnalytics.reduce(
      (acc, item) => {
        acc.totalApplicants += item.totalApplicants;
        acc.totalAccepted += item.accepted;
        acc.totalRejected += item.rejected;
        acc.totalPending += item.pending;
        return acc;
      },
      {
        totalJobs: jobs.length,
        totalApplicants: 0,
        totalAccepted: 0,
        totalRejected: 0,
        totalPending: 0
      }
    );

    return res.json({ summary, jobs: jobsAnalytics });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getJobApplicants(req, res) {
  const { jobApplicationsCol } = getCollections();
  const { jobId } = req.params;

  const jobObjId = toObjectId(jobId);
  if (!jobObjId) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  try {
    const applicants = await jobApplicationsCol.find({ job_id: jobObjId }).sort({ applied_at: -1 }).toArray();
    const serialized = applicants.map((application) => serializeApplication(application, true));
    return res.json(serialized);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createJobPosting,
  listJobPostings,
  getRecruiterJobs,
  deleteJobPosting,
  applyJob,
  listUserApplications,
  withdrawApplication,
  updateApplicationStatus,
  recruiterAnalytics,
  getJobApplicants
};