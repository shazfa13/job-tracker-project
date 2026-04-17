const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDatabase, PORT } = require('./models/database');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');
const portalRoutes = require('./routes/portalRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const allowedOrigins = FRONTEND_ORIGIN
  ? FRONTEND_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(authRoutes);
app.use(resumeRoutes);
app.use(jobRoutes);
app.use(adminRoutes);
app.use(portalRoutes);

const shouldServeFrontend = process.env.SERVE_STATIC_FRONTEND === 'true';
if (process.env.NODE_ENV === 'production' && shouldServeFrontend) {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  const indexPath = path.join(frontendBuildPath, 'index.html');

  if (fs.existsSync(indexPath)) {
    app.use(express.static(frontendBuildPath));
    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });
  }
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
