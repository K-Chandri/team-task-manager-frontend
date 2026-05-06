import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, [token]);

  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <h2>Dashboard</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', minWidth: '150px' }}>
            <h3>Total Tasks</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{tasks.length}</p>
          </div>
          <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', minWidth: '150px' }}>
            <h3>To Do</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{todo}</p>
          </div>
          <div style={{ background: '#cce5ff', padding: '20px', borderRadius: '8px', minWidth: '150px' }}>
            <h3>In Progress</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{inProgress}</p>
          </div>
          <div style={{ background: '#d4edda', padding: '20px', borderRadius: '8px', minWidth: '150px' }}>
            <h3>Done</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{done}</p>
          </div>
          <div style={{ background: '#f8d7da', padding: '20px', borderRadius: '8px', minWidth: '150px' }}>
            <h3>Overdue</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{overdue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;