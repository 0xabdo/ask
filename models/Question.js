const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  question: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  adminResponse: {
    type: String,
    default: null,
    trim: true,
    maxlength: 2000
  },
  isAnswered: {
    type: Boolean,
    default: false
  },
  // Security fields
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  // Rate limiting fields
  submissionCount: {
    type: Number,
    default: 1
  },
  lastSubmissionTime: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // For efficient querying
  },
  answeredAt: {
    type: Date,
    default: null
  }
});

// Indexes for performance and security
questionSchema.index({ email: 1, createdAt: -1 });
questionSchema.index({ ipAddress: 1, createdAt: -1 });
questionSchema.index({ isAnswered: 1, createdAt: -1 });

// Pre-save middleware for additional validation
questionSchema.pre('save', function(next) {
  // Ensure email is normalized
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  
  // Ensure name is properly formatted
  if (this.name) {
    this.name = this.name.trim();
  }
  
  // Ensure question is properly formatted
  if (this.question) {
    this.question = this.question.trim();
  }
  
  next();
});

// Static method to check for recent submissions
questionSchema.statics.checkRecentSubmission = function(email, ipAddress, timeWindow = 60 * 60 * 1000) {
  const cutoffTime = new Date(Date.now() - timeWindow);
  return this.findOne({
    $or: [
      { email: email.toLowerCase() },
      { ipAddress: ipAddress }
    ],
    createdAt: { $gte: cutoffTime }
  });
};

module.exports = mongoose.model('Question', questionSchema);

