import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:2000/api/auth/register', formData);
      alert('✅ Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '60px', marginBottom: '10px'}}>🏢</div>
          <h1 style={{fontSize: '2.5rem'}}>CEO Factory</h1>
          <p>Create New Account</p>
        </div>

        <div style={{padding: '40px 30px'}}>
          <h2 style={{textAlign: 'center', marginBottom: '25px', fontSize: '1.8rem'}}>Register</h2>

          {error && <div style={{background: '#fee2e2', color: '#ef4444', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center'}}>{error}</div>}

          <form onSubmit={handleRegister}>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{width: '100%', padding: '15px', margin: '10px 0', border: '2px solid #ddd', borderRadius: '10px', fontSize: '1.1rem'}} />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={{width: '100%', padding: '15px', margin: '10px 0', border: '2px solid #ddd', borderRadius: '10px', fontSize: '1.1rem'}} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{width: '100%', padding: '15px', margin: '10px 0', border: '2px solid #ddd', borderRadius: '10px', fontSize: '1.1rem'}} />

            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: '16px',
              background: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginTop: '15px',
              cursor: 'pointer'
            }}>
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          <p style={{textAlign: 'center', marginTop: '25px'}}>
            Already have an account? <a href="/login" style={{color: '#3b82f6', fontWeight: 'bold'}}>Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;