const { getCollections } = require('../models/database');

async function signup(req, res) {
  const { usersCol } = getCollections();
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
}

async function login(req, res) {
  const { usersCol } = getCollections();
  const { username, password } = req.body;

  try {
    const user = await usersCol.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({
      message: 'Login successful',
      role: user.role || 'client',
      user_id: user._id.toString()
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  signup,
  login
};