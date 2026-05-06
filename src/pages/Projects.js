import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Projects = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchProjects(); }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/projects', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Project created!');
      setForm({ title: '', description: '' });
      fetchProjects();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <h2>Projects</h2>
        {user?.role === 'admin' && (
          <form onSubmit={handleCreate} style={{ marginBottom: '20px' }}>
            <input type="text" placeholder="Project Title" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              style={{ padding: '8px', marginRight: '10px' }} required />
            <input type="text" placeholder="Description" value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              style={{ padding: '8px', marginRight: '10px' }} />
            <button type="submit" style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>Create Project</button>
            {message && <span style={{ marginLeft: '10px', color: 'green' }}>{message}</span>}
          </form>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Created By</th>
              {user?.role === 'admin' && <th style={{ padding: '10px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{p.title}</td>
                <td style={{ padding: '10px' }}>{p.description}</td>
                <td style={{ padding: '10px' }}>{p.createdBy?.name}</td>
                {user?.role === 'admin' && (
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button onClick={() => handleDelete(p._id)}
                      style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;