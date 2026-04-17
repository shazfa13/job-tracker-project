const { getCollections, toObjectId } = require('../models/database');
const { serializeJob, serializeUser } = require('../models/serializers');

async function listAdminJobs(req, res) {
  const { jobsCol } = getCollections();
  const { role = 'client' } = req.query;

  if (role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const jobs = await jobsCol.find().toArray();
  return res.json(jobs.map(serializeJob));
}

async function listAdminClients(req, res) {
  const { usersCol } = getCollections();
  const { role = 'client' } = req.query;

  if (role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const clients = await usersCol.find({ role: 'client' }).project({ password: 0 }).toArray();
  return res.json(clients.map(serializeUser));
}

async function deleteClient(req, res) {
  const { usersCol, jobsCol } = getCollections();
  const { clientId } = req.params;
  const { role = 'client' } = req.query;

  if (role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const clientObjId = toObjectId(clientId);
  if (!clientObjId) {
    return res.status(400).json({ error: 'Invalid client id' });
  }

  await jobsCol.deleteMany({ user_id: clientObjId });
  await usersCol.deleteOne({ _id: clientObjId });
  return res.json({ message: 'Client deleted successfully' });
}

async function deleteAdminJob(req, res) {
  const { jobsCol } = getCollections();
  const { jobId } = req.params;
  const { role } = req.query;

  if (role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const jobObjId = toObjectId(jobId);
  if (!jobObjId) {
    return res.status(400).json({ error: 'Invalid job id' });
  }

  await jobsCol.deleteOne({ _id: jobObjId });
  return res.json({ message: 'Job deleted successfully' });
}

module.exports = {
  listAdminJobs,
  listAdminClients,
  deleteClient,
  deleteAdminJob
};