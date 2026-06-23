import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:2000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #1e40af, #3b82f6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white',
          padding: '50px 30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '800' }}>CEO Factory</h1>
          <p>Opportunity Tracker</p>
        </div>

        {/* Body */}
        <div style={{ padding: '40px 30px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Welcome Back</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px' }}>Sign in to manage opportunities</p>

          {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{
                width: '100%', 
                padding: '16px', 
                margin: '12px 0', 
                border: '2px solid #e2e8f0', 
                borderRadius: '14px', 
                fontSize: '1.05rem'
              }} 
            />
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{
                width: '100%', 
                padding: '16px', 
                margin: '12px 0', 
                border: '2px solid #e2e8f0', 
                borderRadius: '14px', 
                fontSize: '1.05rem'
              }} 
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%', 
                padding: '16px', 
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '14px', 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                marginTop: '15px',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '25px' }}>
            Don't have an account? <a href="/register" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;