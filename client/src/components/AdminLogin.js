import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    accessCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.api.baseURL}/api/admin/login`, formData);
      if (response.data.token) {
        onLogin(response.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '60px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 className="comfortaa-font comfortaa-bold" style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '16px' }}>
          Admin Dashboard
        </h2>
        <p className="comfortaa-font comfortaa-light" style={{ color: '#64748b', fontSize: '1.125rem' }}>
          Login to access the control panel
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="comfortaa-font comfortaa-medium">
            Admin Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter admin name"
            required
          />
        </div>

        <div className="form-group">
          <label className="comfortaa-font comfortaa-medium">
            Access Code
          </label>
          <input
            type="text"
            name="accessCode"
            value={formData.accessCode}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter access code"
            required
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{ width: '100%', fontSize: '1.125rem', padding: '16px' }}
        >
          {loading ? (
            <span className="comfortaa-font comfortaa-medium">
              Loading...
            </span>
          ) : (
            <span className="comfortaa-font comfortaa-medium">
              Login
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

