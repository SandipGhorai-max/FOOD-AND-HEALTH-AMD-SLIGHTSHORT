/**
 * @fileoverview Main Express server configuration.
 * Implements security, efficiency, and routing logic for NourishAI.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. SECURITY & EFFICIENCY MIDDLEWARE
// ==========================================

// Gzip compression for performance
app.use(compression());

// Strict Helmet policies
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline for quick frontend scripts
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://maps.googleapis.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Cross-Origin Resource Sharing
app.use(cors());

// Rate Limiting to prevent DDoS/Brute-force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Standard parsers
app.use(express.json({ limit: '10kb' })); // Limit body payload to 10kb

app.use(morgan('dev'));

// ==========================================
// 2. ROUTING & STATIC FILES
// ==========================================

app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', apiRoutes);

// Fallback route for SPA
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ==========================================
// 3. GLOBAL ERROR HANDLING
// ==========================================

app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  // Do not expose stack traces in production
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running securely on http://localhost:${PORT}`);
  });
}

module.exports = app; // Export for testing
