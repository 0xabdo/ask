import React, { useState } from 'react';
import QuestionItem from './QuestionItem';

const QuestionList = ({ questions, onUpdate }) => {
  const [filter, setFilter] = useState('all');

  // Ensure questions is always an array
  const questionsArray = Array.isArray(questions) ? questions : [];

  const filteredQuestions = questionsArray.filter(question => {
    if (filter === 'all') return true;
    if (filter === 'answered') return question.isAnswered;
    if (filter === 'pending') return !question.isAnswered;
    return true;
  });

  if (questionsArray.length === 0) {
    return (
      <div className="empty-state">
        <h4>No questions yet</h4>
        <p>When users ask questions, they will appear here</p>
      </div>
    );
  }

  return (
    <div className="question-management">
      <h3>Question Management</h3>
      
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'answered' ? 'active' : ''}`}
          onClick={() => setFilter('answered')}
        >
          Answered
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
      </div>

      {filteredQuestions.map(question => (
        <QuestionItem
          key={question._id}
          question={question}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default QuestionList;

