import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} required />
        <input type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} required />
        <input type="password" placeholder="Password" value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} required />
        <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;