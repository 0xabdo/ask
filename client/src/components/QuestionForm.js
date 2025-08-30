import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${config.api.baseURL}/api/questions`, formData);

      // Clear form
      setFormData({
        name: '',
        email: '',
        question: ''
      });
      
      setMessage('Question submitted successfully! We will get back to you soon.');

    } catch (error) {
      console.error('Error submitting question:', error);
      
      // Show detailed error message
      if (error.response?.data?.details) {
        const errorDetails = error.response.data.details;
        const errorMessages = errorDetails.map(detail => detail.msg).join(', ');
        setMessage(`Validation error: ${errorMessages}`);
      } else if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Error submitting question. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="question">Your Question *</label>
        <textarea
          id="question"
          name="question"
          className="form-control"
          value={formData.question}
          onChange={handleChange}
          required
          placeholder="Type your question here..."
          rows="6"
        />
      </div>

      {message && (
        <div className="alert" style={{ 
          color: message.includes('successfully') ? 'green' : 'red', 
          marginBottom: '16px' 
        }}>
          {message}
        </div>
      )}

      <button
        type="submit"
        className="btn"
        disabled={loading}
        style={{ width: '100%', fontSize: '18px', padding: '16px 32px' }}
      >
        {loading ? 'Submitting...' : 'Submit Question'}
      </button>
    </form>
  );
};

export default QuestionForm;

