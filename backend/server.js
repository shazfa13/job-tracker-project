const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDatabase, PORT } = require('./models/database');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');
const portalRoutes = require('./routes/portalRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(authRoutes);
app.use(resumeRoutes);
app.use(jobRoutes);
app.use(adminRoutes);
app.use(portalRoutes);

if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

app.use(errorHandler);

async function start() {
  try {
    await connectDatabase();
    console.log('MongoDB Connected ✅');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect MongoDB:', err);
    process.exit(1);
  }
}

start();
