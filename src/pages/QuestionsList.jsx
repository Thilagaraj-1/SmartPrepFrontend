import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, CheckCircle, Download, ExternalLink } from 'lucide-react';

const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await api.get('/questions');
            setQuestions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markStudied = async (id) => {
        try {
            await api.put(`/questions/${id}/studied`);
            setQuestions(qList => qList.map(q => q._id === id ? { ...q, studied: true } : q));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await api.get('/analysis/pdf', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'SmartPrep_Study_Material.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredQuestions = questions.filter(q => {
        if (filter === 'Studied') return q.studied;
        if (filter === 'Not Studied') return !q.studied;
        return true;
    });

    if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Question Bank</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        className="form-input"
                        style={{ width: 'auto' }}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option>All</option>
                        <option>Studied</option>
                        <option>Not Studied</option>
                    </select>
                    <button className="btn btn-outline" onClick={handleDownload}>
                        <Download size={18} /> Export PDF
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {filteredQuestions.map((q, idx) => (
                    <div key={q._id} className="card" style={{ display: 'flex', flexDirection: 'column', animationDelay: `${idx * 0.1}s` }} >

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span className={`badge badge-${q.marks}m`}>{q.marks} Marks</span>
                            <span className="badge badge-topic">{q.topic}</span>
                        </div>

                        <h3 style={{ marginBottom: '1rem', flex: 1 }}>{q.question}</h3>

                        <div style={{ backgroundColor: '#F3F4F6', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>AI Answer:</strong>
                            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {q.answer?.map((pt, i) => <li key={i}>{pt}</li>)}
                            </ul>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                            {!q.studied ? (
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => markStudied(q._id)}>
                                    <CheckCircle size={18} /> Mark Studied
                                </button>
                            ) : (
                                <>
                                    <button className="btn btn-outline" style={{ flex: 1 }} disabled>
                                        <CheckCircle size={18} /> Studied
                                    </button>
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate(`/quiz/${q._id}`)}>
                                        <ExternalLink size={18} /> Take Quiz
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                ))}
                {filteredQuestions.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <BookOpen size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <p>No questions found. Try uploading some documents!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionsList;
