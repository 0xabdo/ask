import React, { useState, useEffect, useCallback } from 'react';
import DashboardStats from './DashboardStats';
import QuestionList from './QuestionList';
import config from '../config';

const AdminPanel = ({ token, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      console.log('Fetching data with token:', token ? 'Token exists' : 'No token');
      
      const [statsResponse, questionsResponse] = await Promise.all([
        fetch(`${config.api.baseURL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${config.api.baseURL}/api/admin/questions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!statsResponse.ok || !questionsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [statsData, questionsData] = await Promise.all([
        statsResponse.json(),
        questionsResponse.json()
      ]);

      console.log('Stats data:', statsData);
      console.log('Questions data:', questionsData);

      setStats(statsData);
      setQuestions(questionsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <h3>Loading Admin Panel...</h3>
        <p>Please wait while we fetch your data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Admin Panel</h3>
        <p>{error}</p>
        <button className="admin-btn admin-btn-primary" onClick={fetchData}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-layout-no-sidebar">
      <div className="admin-main-full">
        <div className="admin-content">
          <DashboardStats stats={stats} />
          <QuestionList questions={questions} onUpdate={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

