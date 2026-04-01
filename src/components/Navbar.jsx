import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, Upload, List, BarChart2 } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <header className="glass-header">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <BookOpen color="var(--primary)" size={28} />
                    Smart<span style={{ color: 'var(--primary)' }}>Prep</span>
                </Link>
                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <BarChart2 size={18} /> Dashboard
                    </Link>
                    <Link to="/questions" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <List size={18} /> My Questions
                    </Link>
                    <Link to="/upload" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Upload size={18} /> Upload
                    </Link>
                    <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
