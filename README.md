# جوابك - Ask Questions Platform

A modern React-based question and answer platform where users can submit questions and admins can provide answers.

## 🚀 Features

- **User-friendly interface** with Arabic and English support
- **Question submission form** with validation
- **Admin dashboard** for managing questions and answers
- **Email notifications** when questions are answered
- **Responsive design** for all devices
- **Security features** including rate limiting and validation

## 📦 Project Structure

```
ask/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── public/            # Static files
├── server.js              # Express backend
├── routes/                # API routes
├── models/                # Database models
├── middleware/            # Security middleware
└── netlify.toml          # Netlify configuration
```

## 🛠️ Technologies Used

- **Frontend**: React.js, CSS3, HTML5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Security**: JWT, rate limiting, input validation
- **Email**: Nodemailer
- **Deployment**: Netlify (frontend)

## 🚀 Deployment

### Frontend (Netlify)

1. **Build the React app:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `client/build` folder
   - Your site will be live instantly!

### Backend (Optional)

For full functionality, deploy the backend to:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Frontend URL
FRONTEND_URL=https://your-netlify-app.netlify.app
```

## 🗄️ Database Integration

The application now uses **real database connections**:
- Form submissions are saved to MongoDB
- Admin login validates against database
- Real questions and answers are displayed
- Email notifications are sent when questions are answered
- Full CRUD operations supported
- Requires backend server deployment

## 🔒 Security Features

- Rate limiting to prevent spam
- Input validation and sanitization
- JWT authentication for admin access
- CORS protection
- Security headers with Helmet
- NoSQL injection prevention

## 🎨 UI/UX Features

- Modern gradient design
- Smooth animations and transitions
- Responsive layout for all devices
- Arabic language support
- Loading states and error handling
- Success/error notifications

## 📞 Support

For questions or support, please contact the development team.

---

**Note**: The frontend is deployed on Netlify. You need to deploy the backend to a cloud service (Railway, Render, Heroku) and configure the environment variables for full functionality. See `DEPLOYMENT_GUIDE.md` for detailed instructions.
