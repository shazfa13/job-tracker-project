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

function serializeJobPosting(job) {
  return {
    _id: job._id.toString(),
    recruiter_id: job.recruiter_id.toString(),
    position: job.position,
    company: job.company,
    description: job.description,
    requirements: job.requirements,
    created_at: job.created_at,
    updated_at: job.updated_at
  };
}

function serializeApplication(application, includeAttachments = false) {
  const serialized = {
    _id: application._id.toString(),
    user_id: application.user_id.toString(),
    job_id: application.job_id.toString(),
    recruiter_id: application.recruiter_id.toString(),
    job_title: application.job_title,
    company_name: application.company_name,
    status: application.status,
    applied_at: application.applied_at,
    updated_at: application.updated_at
  };

  if (includeAttachments) {
    serialized.user_name = application.user_name;
    serialized.resume_attachment = application.resume_attachment || null;
    serialized.cover_page_attachment = application.cover_page_attachment || null;
    serialized.referral = application.referral || '';
  }

  return serialized;
}

module.exports = {
  serializeJob,
  serializeResume,
  serializeUser,
  serializeJobPosting,
  serializeApplication
};