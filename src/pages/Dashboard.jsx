import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Target, AlertCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ topicsMastered: [], weakTopics: [], accuracyPercentage: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const res = await api.get('/analysis/performance');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformance();
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>Loading...</div>;

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Your Preparation Dashboard</h1>
                <Link to="/upload" className="btn btn-primary">Add More Content</Link>
            </div>

            <div className="dashboard-grid delay-1">
                <div className="stat-card">
                    <Award size={40} color="white" style={{ marginBottom: '1rem' }} />
                    <div className="stat-card-number">{stats.accuracyPercentage}%</div>
                    <div className="stat-card-label">Overall Accuracy</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--secondary), #059669)' }}>
                    <Target size={40} color="white" style={{ marginBottom: '1rem' }} />
                    <div className="stat-card-number">{stats.topicsMastered.length}</div>
                    <div className="stat-card-label">Topics Mastered</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--warning), #D97706)' }}>
                    <AlertCircle size={40} color="white" style={{ marginBottom: '1rem' }} />
                    <div className="stat-card-number">{stats.weakTopics.length}</div>
                    <div className="stat-card-label">Topics to Improve</div>
                </div>
            </div>

            <div className="dashboard-grid delay-2" style={{ marginTop: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award color="var(--secondary)" /> Strong Areas
                    </h3>
                    {stats.topicsMastered.length > 0 ? (
                        <ul style={{ listStylePosition: 'inside', color: 'var(--text-muted)' }}>
                            {stats.topicsMastered.map((t, idx) => <li key={idx} style={{ marginBottom: '0.5rem' }}>{t}</li>)}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>Attempt more quizzes to see mastered topics.</p>
                    )}
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle color="var(--warning)" /> Areas for Improvement
                    </h3>
                    {stats.weakTopics.length > 0 ? (
                        <ul style={{ listStylePosition: 'inside', color: 'var(--text-muted)' }}>
                            {stats.weakTopics.map((t, idx) => <li key={idx} style={{ marginBottom: '0.5rem' }}>{t}</li>)}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>Great job! No weak areas detected yet.</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
