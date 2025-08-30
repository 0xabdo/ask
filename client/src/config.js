// Frontend configuration
const config = {
  // API configuration
  // For Netlify: use relative URLs (Netlify will proxy to backend)
  // For local development: use 'http://localhost:5000'
  // For production: set REACT_APP_API_URL environment variable
  api: {
    baseURL: process.env.REACT_APP_API_URL || '',
    timeout: 10000
  },
  
  // App configuration
  app: {
    name: 'جوابك',
    version: '1.0.0',
    description: 'منصة الأسئلة والأجوبة الحديثة'
  }
};

export default config;
