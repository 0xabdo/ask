const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function setup() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asking-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('Admin already exists. Setup not needed.');
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin({
      name: process.env.ADMIN_NAME || 'admin',
      accessCode: process.env.ADMIN_ACCESS_CODE || 'admin123'
    });

    await admin.save();
    console.log('Default admin created successfully!');
    console.log('Name:', admin.name);
    console.log('Access Code:', admin.accessCode);
    console.log('\n⚠️  IMPORTANT: Keep these credentials secure!');

  } catch (error) {
    console.error('Setup error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

setup();
