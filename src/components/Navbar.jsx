import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Upload, List, BarChart2, Brain } from 'lucide-react';
import logo from '../assets/smartprep_logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.4rem 0.75rem',
        borderRadius: '0.5rem',
        backgroundColor: isActive(path) ? '#EEF2FF' : 'transparent',
        color: isActive(path) ? 'var(--primary)' : 'var(--text-muted)',
        fontWeight: isActive(path) ? 600 : 400,
        transition: 'all 0.2s ease',
        fontSize: '0.9rem'
    });

    return (
        <header className="glass-header">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none' }}>
                    <img
                        src={logo}
                        alt="SmartPrep AI Logo"
                        style={{
                            height: '42px',
                            width: 'auto',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                        }}
                    />
                    <span style={{ color: 'var(--text-main)' }}>
                        Smart<span style={{ color: 'var(--primary)' }}>Prep</span>
                        <sup style={{ fontSize: '0.55rem', color: '#D97706', fontWeight: 700, marginLeft: '2px' }}>AI</sup>
                    </span>
                </Link>
                <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Link to="/dashboard" style={navLinkStyle('/dashboard')} id="nav-dashboard">
                        <BarChart2 size={18} /> Dashboard
                    </Link>
                    <Link to="/topic-quiz" style={navLinkStyle('/topic-quiz')} id="nav-topic-quiz">
                        <Brain size={18} /> Topic Quiz
                    </Link>
                    <Link to="/questions" style={navLinkStyle('/questions')} id="nav-questions">
                        <List size={18} /> Questions
                    </Link>
                    <Link to="/upload" style={navLinkStyle('/upload')} id="nav-upload">
                        <Upload size={18} /> Upload
                    </Link>
                    <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
