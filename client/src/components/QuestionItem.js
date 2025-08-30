import React, { useState } from 'react';
import config from '../config';

const QuestionItem = ({ question, onUpdate }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${config.api.baseURL}/api/admin/questions/${question._id}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminResponse: answer })
      });

      if (response.ok) {
        setAnswer('');
        setShowSuccess(true);
        // Call onUpdate to refresh the data
        onUpdate();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit answer. Please try again.');
      }
    } catch (error) {
      console.error('Error answering question:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="question-item">
      {showSuccess && (
        <div className="success-message">
          ✅ Answer submitted successfully! Email notification sent to user.
        </div>
      )}

      {error && (
        <div className="error-message" style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ❌ {error}
          <button 
            onClick={() => setError('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#991b1b',
              cursor: 'pointer',
              marginLeft: 'auto',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className="question-header">
        <div>
          <h4 className="question-title comfortaa-font comfortaa-bold">
            Question from {question.name}
          </h4>
          <div className="question-meta">
            <span className="comfortaa-font comfortaa-medium">
              📧 {question.email}
            </span>
            <span className="comfortaa-font comfortaa-medium">
              📅 {new Date(question.createdAt).toLocaleDateString()}
            </span>
            <span className={`question-status ${question.isAnswered ? 'answered' : 'pending'}`}>
              {question.isAnswered ? '✅ Answered' : '⏳ Pending'}
            </span>
          </div>
        </div>
      </div>

      <div className="question-content">
        <p className="comfortaa-font comfortaa-light">
          {question.question}
        </p>
      </div>

      {question.isAnswered && (
        <div className="answer-section">
          <h5 className="comfortaa-font comfortaa-bold answer-title">
            📝 Admin Answer:
          </h5>
          <p className="comfortaa-font comfortaa-light answer-text">
            {question.adminResponse}
          </p>
          <div className="answer-meta comfortaa-font comfortaa-light">
            Answered on: {new Date(question.answeredAt).toLocaleDateString()}
          </div>
        </div>
      )}

      {!question.isAnswered && (
        <form onSubmit={handleSubmit} className="answer-form">
          <div className="form-group">
            <label className="comfortaa-font comfortaa-medium">
              Add Answer:
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              placeholder="Write your answer here..."
              rows="4"
              required
            />
          </div>
          <div className="question-actions">
            <button
              type="submit"
              className="btn"
              disabled={isSubmitting || !answer.trim()}
            >
              {isSubmitting ? (
                <span className="comfortaa-font comfortaa-medium">
                  📤 Sending...
                </span>
              ) : (
                <span className="comfortaa-font comfortaa-medium">
                  📤 Send Answer
                </span>
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setAnswer('')}
            >
              <span className="comfortaa-font comfortaa-medium">
                ❌ Cancel
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuestionItem;

