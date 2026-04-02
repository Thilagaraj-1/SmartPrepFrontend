import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Target, AlertCircle, Award, Brain, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ topicsMastered: [], weakTopics: [], accuracyPercentage: 0 });
    const [topicStats, setTopicStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [perfRes, topicsRes] = await Promise.all([
                    api.get('/analysis/performance'),
                    api.get('/topic-quiz/topics').catch(() => ({ data: [] }))
                ]);
                setStats(perfRes.data);
                setTopicStats(topicsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>Loading...</div>;

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1>Your Preparation Dashboard</h1>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to="/topic-quiz" className="btn btn-primary" id="dashboard-topic-quiz-btn" style={{
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
                    }}>
                        <Brain size={20} /> Topic Quiz
                    </Link>
                    <Link to="/upload" className="btn btn-outline" id="dashboard-upload-btn">Add Content</Link>
                </div>
            </div>

            {/* Topic Quiz Promo Card */}
            <div style={{
                padding: '2rem', borderRadius: '1.5rem', marginBottom: '2rem',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
                color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'relative', overflow: 'hidden', flexWrap: 'wrap', gap: '1.5rem'
            }}>
                <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '150px', height: '150px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Zap size={24} />
                        <h2 style={{ margin: 0, color: 'white' }}>AI-Powered Topic Quizzes</h2>
                    </div>
                    <p style={{ opacity: 0.9, maxWidth: '400px', margin: 0 }}>
                        Take adaptive quizzes on any topic and get ML-predicted exam scores with study recommendations.
                    </p>
                </div>
                <Link to="/topic-quiz" className="btn" id="promo-topic-quiz-btn" style={{
                    backgroundColor: 'white', color: 'var(--primary)', fontWeight: 700,
                    padding: '0.75rem 1.5rem', position: 'relative', zIndex: 1,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}>
                    Start Quiz <ArrowRight size={18} />
                </Link>
            </div>

            {/* Stats Grid */}
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

            {/* Topic Quiz Stats */}
            {topicStats.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp color="var(--primary)" size={24} /> Quiz Performance by Topic
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                        {topicStats.map((t, idx) => (
                            <Link
                                to="/topic-quiz"
                                key={idx}
                                className="card"
                                style={{
                                    textDecoration: 'none', color: 'inherit',
                                    borderLeft: `4px solid ${t.bestScore >= 80 ? '#10B981' : t.bestScore >= 50 ? '#F59E0B' : '#EF4444'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.3rem', fontSize: '1rem' }}>{t.topic}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {t.totalAttempts} attempts · Avg {t.avgScore}%
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif",
                                        color: t.bestScore >= 80 ? '#10B981' : t.bestScore >= 50 ? '#F59E0B' : '#EF4444'
                                    }}>
                                        {t.bestScore}%
                                    </div>
                                </div>
                                <div style={{ marginTop: '0.5rem', height: '5px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${t.bestScore}%`, height: '100%', borderRadius: '3px',
                                        background: t.bestScore >= 80
                                            ? 'linear-gradient(90deg, #10B981, #34D399)'
                                            : t.bestScore >= 50
                                                ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                                                : 'linear-gradient(90deg, #EF4444, #F87171)'
                                    }} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Strong & Weak Areas */}
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
