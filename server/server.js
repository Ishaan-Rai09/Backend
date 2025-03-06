const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Import custom middleware
const logger = require('./middleware/logger.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');

// Import routes
const apiRoutes = require('./routes/api.routes');

// Initialize Express app
const app = express();

// Set port
const PORT = process.env.PORT || 3000;

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request logging
app.use(logger);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Compress responses
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 