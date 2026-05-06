import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Tasks = () => {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', project: '', dueDate: '' });
  const [message, setMessage] = useState('');

  const fetchAll = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        axios.get('https://team-task-manager-production-a801.up.railway.app/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('https://team-task-manager-production-a801.up.railway.app/api/projects', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchAll(); }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: form.title,
        description: form.description,
        project: form.project,
      };
      if (form.dueDate) taskData.dueDate = form.dueDate;
      await axios.post('https://team-task-manager-production-a801.up.railway.app/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Task created!');
      setForm({ title: '', description: '', project: '', dueDate: '' });
      fetchAll();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`https://team-task-manager-production-a801.up.railway.app/api/tasks/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAll();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://team-task-manager-production-a801.up.railway.app/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAll();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <h2>Tasks</h2>
        {user?.role === 'admin' && (
          <form onSubmit={handleCreate} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Task Title" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              style={{ padding: '8px' }} required />
            <input type="text" placeholder="Description" value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              style={{ padding: '8px' }} />
            <select value={form.project} onChange={e => setForm({...form, project: e.target.value})}
              style={{ padding: '8px' }} required>
              <option value="">Select Project</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
            <input type="date" value={form.dueDate}
              onChange={e => setForm({...form, dueDate: e.target.value})}
              style={{ padding: '8px' }} />
            <button type="submit" style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>Create Task</button>
            {message && <span style={{ color: 'green' }}>{message}</span>}
          </form>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Project</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Assigned To</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Due Date</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
              {user?.role === 'admin' && <th style={{ padding: '10px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{t.title}</td>
                <td style={{ padding: '10px' }}>{t.project?.title}</td>
                <td style={{ padding: '10px' }}>{t.assignedTo?.name || 'Unassigned'}</td>
                <td style={{ padding: '10px' }}>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '10px' }}>
                  <select value={t.status} onChange={e => handleStatusChange(t._id, e.target.value)}
                    style={{ padding: '5px' }}>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                {user?.role === 'admin' && (
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button onClick={() => handleDelete(t._id)}
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

export default Tasks;