import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  // Set default credentials
  const [email, setEmail] = useState('riya038@driveeasy.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to fleet
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/fleet');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if password matches the default/correct password
    const DEFAULT_CORRECT_PASSWORD = 'password123';

    if (password !== DEFAULT_CORRECT_PASSWORD) {
      setError('❌ Invalid password! The password you entered is incorrect. (Default is: password123)');
      return;
    }

    try {
      // Attempt backend API login if available
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        login(data.customer, data.token);
        navigate('/fleet');
        return;
      }
    } catch {
      // Fallback if backend is starting or offline
    }

    // Local authentication fallback
    const customer = {
      id: '66c8b1a20000000000000001',
      name: email.split('@')[0].toUpperCase(),
      email: email,
      phone: '9876543210',
      licenseNumber: 'GJ-06-2026-24IT037'
    };
    const token = 'jwt_token_24it037_driveeasy_auth';
    login(customer, token);
    navigate('/fleet');
  };

  const handleQuickLogin = () => {
    const customer = {
      id: '66c8b1a20000000000000001',
      name: 'Riya Patel',
      email: 'riya038@driveeasy.com',
      phone: '9876543210',
      licenseNumber: 'GJ-06-2026-24IT037'
    };
    const token = 'jwt_token_24it037_driveeasy_auth';
    login(customer, token);
    navigate('/fleet');
  };

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '4rem' }}>
      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚗</div>
          <h1 className="page-title" style={{ fontSize: '1.6rem' }}>DriveEasy Login</h1>
          <p className="page-subtitle">Access your protected fleet reservations</p>
        </div>

        {/* Error message displayed if wrong password is typed */}
        {error && (
          <div className="error-banner" style={{ fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              className="form-input"
              placeholder="e.g. riya038@driveeasy.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
              Default Password: <code>password123</code>
            </small>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Sign In with Email
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1.5rem 0',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
          <span style={{ padding: '0 0.75rem' }}>OR DEMO ACCESS</span>
          <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
        </div>

        <button
          type="button"
          onClick={handleQuickLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: '1px solid #c7d2fe',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ⚡ Quick 1-Click Customer Login
        </button>
      </div>
    </div>
  );
}
