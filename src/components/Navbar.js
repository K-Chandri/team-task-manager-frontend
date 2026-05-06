import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#333', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ color: 'white', margin: 0 }}>Task Manager</h2>
      <div>
        <Link to="/dashboard" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/projects" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Projects</Link>
        <Link to="/tasks" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Tasks</Link>
        {user && <span style={{ color: '#aaa', marginRight: '15px' }}>Hi, {user.name} ({user.role})</span>}
        <button onClick={handleLogout} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;