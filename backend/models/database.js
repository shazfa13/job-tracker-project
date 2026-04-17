const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const PORT = parseInt(process.env.PORT, 10) || 5000;
const DB_NAME = process.env.DB_NAME || 'jobtracker';

const client = new MongoClient(MONGO_URI);

let collections = null;

function toObjectId(id) {
  if (!id) return null;

  try {
    return new ObjectId(id);
  } catch (err) {
    return null;
  }
}

function getCollections() {
  if (!collections) {
    throw new Error('Database has not been initialized');
  }

  return collections;
}

async function connectDatabase() {
  await client.connect();

  const db = client.db(DB_NAME);
  collections = {
    usersCol: db.collection('users'),
    jobsCol: db.collection('jobs'),
    resumesCol: db.collection('resumes'),
    jobPostingsCol: db.collection('job_postings'),
    jobApplicationsCol: db.collection('job_applications'),
    jobSeekerResumesCol: db.collection('job_seeker_resumes')
  };

  await Promise.all([
    collections.usersCol.createIndex({ username: 1 }, { unique: true }),
    collections.jobsCol.createIndex({ user_id: 1 }),
    collections.resumesCol.createIndex({ user_id: 1 }),
    collections.jobPostingsCol.createIndex({ recruiter_id: 1 }),
    collections.jobApplicationsCol.createIndex({ user_id: 1 }),
    collections.jobApplicationsCol.createIndex({ job_id: 1 }),
    collections.jobSeekerResumesCol.createIndex({ user_id: 1 })
  ]);

  return collections;
}

module.exports = {
  client,
  connectDatabase,
  getCollections,
  toObjectId,
  PORT,
  DB_NAME,
  MONGO_URI
};