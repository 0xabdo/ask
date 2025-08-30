const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { body, validationResult } = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Rate limiting configurations
const createRateLimiters = () => {
  // General API rate limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  });

  // Strict rate limiter for question submission
  const questionSubmissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 questions per hour
    message: {
      error: 'Too many question submissions from this IP, please try again later.',
      retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many question submissions from this IP, please try again later.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  });

  // Admin login rate limiter
  const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per 15 minutes
    message: {
      error: 'Too many login attempts from this IP, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many login attempts from this IP, please try again later.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  });

  // IP-based spam prevention
  const spamPreventionLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 20, // limit each IP to 20 total requests per day
    message: {
      error: 'Daily request limit exceeded for this IP.',
      retryAfter: '24 hours'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Daily request limit exceeded for this IP.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  });

  return {
    generalLimiter,
    questionSubmissionLimiter,
    adminLoginLimiter,
    spamPreventionLimiter
  };
};

// Speed limiting (slows down requests instead of blocking)
const createSpeedLimiters = () => {
  const generalSpeedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per 15 minutes, then...
    delayMs: (used, req) => {
      const delayAfter = req.slowDown.limit;
      return (used - delayAfter) * 500;
    }
  });

  const questionSpeedLimiter = slowDown({
    windowMs: 60 * 60 * 1000, // 1 hour
    delayAfter: 2, // allow 2 requests per hour, then...
    delayMs: (used, req) => {
      const delayAfter = req.slowDown.limit;
      return (used - delayAfter) * 2000;
    }
  });

  return {
    generalSpeedLimiter,
    questionSpeedLimiter
  };
};

// Input validation middleware
const validateQuestionSubmission = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('question')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Question must be between 10 and 1000 characters')
    .escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

const validateAdminLogin = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('accessCode')
    .trim()
    .isLength({ min: 8, max: 100 })
    .withMessage('Access code must be between 8 and 100 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

// Spam detection middleware
const spamDetection = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip;
  
  // Check for bot user agents
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
    'python', 'java', 'perl', 'ruby', 'php', 'go-http-client'
  ];
  
  const isBot = botPatterns.some(pattern => 
    userAgent.toLowerCase().includes(pattern)
  );
  
  if (isBot) {
    return res.status(403).json({
      error: 'Access denied for automated requests'
    });
  }
  
  // Check for suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-for', 'x-real-ip', 'x-client-ip',
    'cf-connecting-ip', 'x-forwarded', 'forwarded-for'
  ];
  
  const hasSuspiciousHeaders = suspiciousHeaders.some(header => 
    req.headers[header] && req.headers[header] !== ip
  );
  
  if (hasSuspiciousHeaders) {
    console.warn(`Suspicious headers detected from IP: ${ip}`);
  }
  
  next();
};

// Content security middleware
const contentSecurity = (req, res, next) => {
  // Remove potentially dangerous headers
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0
    };
    
    // Log suspicious activities
    if (res.statusCode === 429 || res.statusCode === 403) {
      console.warn('Suspicious activity detected:', logData);
    } else {
      console.log('Request:', logData);
    }
  });
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't expose internal errors to client
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: isDevelopment ? err.message : 'Invalid input data'
    });
  }
  
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate entry detected'
    });
  }
  
  res.status(500).json({
    error: isDevelopment ? err.message : 'Internal server error'
  });
};

// Apply security middleware
const applySecurityMiddleware = (app) => {
  const limiters = createRateLimiters();
  const speedLimiters = createSpeedLimiters();
  
  // Apply general security middleware
  app.use(mongoSanitize()); // Prevent NoSQL injection
  app.use(hpp()); // Prevent HTTP Parameter Pollution
  app.use(contentSecurity);
  app.use(requestLogger);
  
  // Apply rate limiters
  app.use('/api/', limiters.generalLimiter);
  app.use('/api/questions', limiters.questionSubmissionLimiter);
  app.use('/api/admin/login', limiters.adminLoginLimiter);
  app.use('/api/', limiters.spamPreventionLimiter);
  
  // Apply speed limiters
  app.use('/api/', speedLimiters.generalSpeedLimiter);
  app.use('/api/questions', speedLimiters.questionSpeedLimiter);
  
  // Apply spam detection
  app.use('/api/', spamDetection);
  
  // Error handling
  app.use(errorHandler);
};

module.exports = {
  createRateLimiters,
  createSpeedLimiters,
  validateQuestionSubmission,
  validateAdminLogin,
  spamDetection,
  contentSecurity,
  requestLogger,
  errorHandler,
  applySecurityMiddleware
};
