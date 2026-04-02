import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Brain, Sparkles, Target, ChevronRight, RotateCcw,
    TrendingUp, TrendingDown, Minus, Trophy, AlertTriangle,
    CheckCircle, XCircle, Clock, BarChart2, BookOpen, Zap,
    ArrowRight, RefreshCw, Award, Lightbulb, Play
} from 'lucide-react';
import logo from '../assets/smartprep_logo.png';

const TopicQuiz = () => {
    const navigate = useNavigate();

    // States
    const [phase, setPhase] = useState('input'); // input, loading, quiz, result, history
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(10);
    const [quizData, setQuizData] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [topicsList, setTopicsList] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('');
    const timerRef = useRef(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    // Timer
    useEffect(() => {
        if (phase === 'quiz' && startTime) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase, startTime]);

    // Load topics on mount
    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const res = await api.get('/topic-quiz/topics');
            setTopicsList(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHistory = async (topicName) => {
        try {
            const res = await api.get(`/topic-quiz/history/${encodeURIComponent(topicName)}`);
            setHistory(res.data);
            const predRes = await api.get(`/topic-quiz/predict/${encodeURIComponent(topicName)}`);
            setPrediction(predRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartQuiz = async (e) => {
        e?.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setPhase('loading');
        try {
            const res = await api.post('/topic-quiz/generate', {
                topic: topic.trim(),
                questionCount
            });
            setQuizData(res.data);
            setCurrentQIndex(0);
            setAnswers([]);
            setCurrentAnswer('');
            setStartTime(Date.now());
            setElapsedSeconds(0);
            setPhase('quiz');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error generating quiz');
            setPhase('input');
        } finally {
            setLoading(false);
        }
    };

    const handleReattempt = async (attemptId) => {
        setLoading(true);
        setPhase('loading');
        try {
            const res = await api.get(`/topic-quiz/reattempt/${attemptId}`);
            if (res.data.isPerfect) {
                alert('Perfect score! No questions to reattempt.');
                setPhase('result');
                setLoading(false);
                return;
            }
            setQuizData(res.data);
            setCurrentQIndex(0);
            setAnswers([]);
            setCurrentAnswer('');
            setStartTime(Date.now());
            setElapsedSeconds(0);
            setPhase('quiz');
        } catch (err) {
            console.error(err);
            setPhase('result');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = () => {
        const newAnswers = [...answers, currentAnswer];
        setAnswers(newAnswers);
        setCurrentAnswer('');
        setShowExplanation(false);

        if (currentQIndex < quizData.questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            submitQuiz(newAnswers);
        }
    };

    const submitQuiz = async (finalAnswers) => {
        clearInterval(timerRef.current);
        setLoading(true);
        try {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            const res = await api.post('/topic-quiz/submit', {
                topic: quizData.topic,
                questions: quizData.questions,
                answers: finalAnswers,
                timeSpentSeconds: timeSpent
            });
            setResult(res.data.attempt);
            setPrediction(res.data.prediction);
            setPhase('result');
            fetchTopics();
        } catch (err) {
            console.error(err);
            alert('Error submitting quiz');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTrendIcon = (trend) => {
        if (trend === 'improving') return <TrendingUp size={20} color="#10B981" />;
        if (trend === 'declining') return <TrendingDown size={20} color="#EF4444" />;
        return <Minus size={20} color="#6B7280" />;
    };

    const getGradeColor = (grade) => {
        if (grade === 'A+' || grade === 'A') return '#10B981';
        if (grade === 'B+' || grade === 'B') return '#3B82F6';
        if (grade === 'C') return '#F59E0B';
        if (grade === 'D') return '#EF4444';
        return '#6B7280';
    };

    // ===== RENDER PHASES =====

    // INPUT PHASE - Topic Selection
    if (phase === 'input') {
        return (
            <div className="container animate-fade-in" style={{ maxWidth: '900px', marginTop: '2rem' }}>
                {/* Hero Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    padding: '3rem 2rem',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
                    borderRadius: '1.5rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.5
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <img src={logo} alt="SmartPrep AI" style={{ height: '72px', marginBottom: '1rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))', borderRadius: '12px' }} />
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                            AI-Powered Topic Quiz
                        </h1>
                        <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '500px', margin: '0 auto' }}>
                            Enter any topic, take adaptive quizzes, and get ML-predicted exam scores
                        </p>
                    </div>
                </div>

                {/* Quiz Generator */}
                <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sparkles color="var(--primary)" size={24} />
                        Generate New Quiz
                    </h2>

                    <form onSubmit={handleStartQuiz}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '1rem' }}>Topic / Subject</label>
                            <input
                                type="text"
                                id="topic-input"
                                className="form-input"
                                placeholder="e.g., Computer Networks, Data Structures, Machine Learning..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                style={{ fontSize: '1.05rem', padding: '0.9rem 1.2rem' }}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '1rem' }}>Number of Questions</label>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {[5, 10, 15, 20].map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        id={`question-count-${n}`}
                                        onClick={() => setQuestionCount(n)}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '0.5rem',
                                            border: `2px solid ${questionCount === n ? 'var(--primary)' : 'var(--border)'}`,
                                            backgroundColor: questionCount === n ? '#EEF2FF' : 'transparent',
                                            color: questionCount === n ? 'var(--primary)' : 'var(--text-muted)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {n} Qs
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            id="start-quiz-btn"
                            className="btn btn-primary"
                            style={{
                                width: '100%', padding: '1rem', fontSize: '1.15rem', marginTop: '0.5rem',
                                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
                            }}
                            disabled={!topic.trim()}
                        >
                            <Zap size={22} /> Start Quiz <ArrowRight size={20} />
                        </button>
                    </form>

                    {/* Quick topic suggestions */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Quick picks:</span>
                        {['Computer Networks', 'Operating Systems', 'Data Structures', 'Database Management', 'Machine Learning', 'Probability and Statistics'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTopic(t)}
                                style={{
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: '9999px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: topic === t ? '#EEF2FF' : '#F9FAFB',
                                    color: topic === t ? 'var(--primary)' : 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontWeight: 500
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Previous Topics */}
                {topicsList.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <BarChart2 color="var(--primary)" size={24} />
                            Your Practice History
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {topicsList.map((t, idx) => (
                                <div
                                    key={idx}
                                    className="card"
                                    id={`topic-card-${idx}`}
                                    style={{
                                        cursor: 'pointer',
                                        borderLeft: `4px solid ${t.bestScore >= 80 ? '#10B981' : t.bestScore >= 50 ? '#F59E0B' : '#EF4444'}`,
                                        animationDelay: `${idx * 0.1}s`
                                    }}
                                    onClick={() => {
                                        setSelectedTopic(t.topic);
                                        fetchHistory(t.topic);
                                        setPhase('history');
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t.topic}</h3>
                                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                <span>{t.totalAttempts} attempt{t.totalAttempts > 1 ? 's' : ''}</span>
                                                <span>Avg: {t.avgScore}%</span>
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif",
                                            color: t.bestScore >= 80 ? '#10B981' : t.bestScore >= 50 ? '#F59E0B' : '#EF4444'
                                        }}>
                                            {t.bestScore}%
                                        </div>
                                    </div>
                                    {/* Mini score bar */}
                                    <div style={{ marginTop: '0.75rem', height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${t.bestScore}%`, height: '100%', borderRadius: '3px',
                                            background: t.bestScore >= 80
                                                ? 'linear-gradient(90deg, #10B981, #34D399)'
                                                : t.bestScore >= 50
                                                    ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                                                    : 'linear-gradient(90deg, #EF4444, #F87171)',
                                            transition: 'width 0.6s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // LOADING PHASE
    if (phase === 'loading') {
        return (
            <div className="container animate-fade-in" style={{ maxWidth: '600px', marginTop: '6rem', textAlign: 'center' }}>
                <div className="card" style={{ padding: '4rem 2rem' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 2rem',
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}>
                        <Brain size={40} color="white" />
                    </div>
                    <h2 style={{ marginBottom: '0.75rem' }}>Generating Your Quiz...</h2>
                    <p style={{ color: 'var(--text-muted)' }}>AI is crafting questions tailored to your level</p>

                    <style>{`
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.1); opacity: 0.8; }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    // QUIZ PHASE
    if (phase === 'quiz' && quizData) {
        const currentQ = quizData.questions[currentQIndex];
        const progress = ((currentQIndex) / quizData.questions.length) * 100;

        return (
            <div className="container animate-fade-in" style={{ maxWidth: '700px', marginTop: '2rem' }}>
                {/* Quiz Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '1.5rem', padding: '1rem 1.5rem',
                    background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
                    borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            {quizData.topic}
                        </span>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            Question {currentQIndex + 1} / {quizData.questions.length}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.4rem 0.8rem', borderRadius: '0.5rem',
                            backgroundColor: '#F3F4F6', fontWeight: 600, fontSize: '0.9rem'
                        }}>
                            <Clock size={16} color="var(--text-muted)" />
                            {formatTime(elapsedSeconds)}
                        </div>
                        {quizData.difficulty && (
                            <span style={{
                                padding: '0.3rem 0.7rem', borderRadius: '9999px', fontSize: '0.75rem',
                                fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                                backgroundColor: quizData.difficulty === 'hard' ? '#FEE2E2' : quizData.difficulty === 'easy' ? '#D1FAE5' : '#DBEAFE',
                                color: quizData.difficulty === 'hard' ? '#991B1B' : quizData.difficulty === 'easy' ? '#065F46' : '#1E40AF'
                            }}>
                                {quizData.isReattempt ? '🔄 Review' : quizData.difficulty}
                            </span>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', backgroundColor: '#E5E7EB', height: '8px', borderRadius: '4px', marginBottom: '2rem', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`, height: '100%', borderRadius: '4px',
                        background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                        transition: 'width 0.4s ease', boxShadow: '0 0 8px rgba(79, 70, 229, 0.3)'
                    }} />
                </div>

                {/* Question Card */}
                <div className="card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ marginBottom: '2rem', fontSize: '1.3rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
                        {currentQ.question}
                    </h2>

                    {currentQ.type === 'mcq' && currentQ.options ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {currentQ.options.map((opt, idx) => (
                                <label
                                    key={idx}
                                    id={`option-${idx}`}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '1rem 1.25rem',
                                        border: `2px solid ${currentAnswer === opt ? '#4F46E5' : '#E5E7EB'}`,
                                        borderRadius: '12px', cursor: 'pointer',
                                        backgroundColor: currentAnswer === opt ? '#EEF2FF' : 'transparent',
                                        transition: 'all 0.2s ease', fontWeight: currentAnswer === opt ? 600 : 400
                                    }}
                                >
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                                        border: `2px solid ${currentAnswer === opt ? '#4F46E5' : '#D1D5DB'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: currentAnswer === opt ? '#4F46E5' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}>
                                        {currentAnswer === opt && (
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                                        )}
                                    </div>
                                    <input
                                        type="radio" name="quiz_option" value={opt}
                                        checked={currentAnswer === opt}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        style={{ display: 'none' }}
                                    />
                                    <span style={{ fontSize: '1rem' }}>{opt}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <input
                                type="text"
                                id="answer-input"
                                className="form-input"
                                placeholder="Type your answer here..."
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && currentAnswer.trim() && handleAnswer()}
                                style={{ fontSize: '1.1rem', padding: '1rem 1.25rem' }}
                                autoFocus
                            />
                        </div>
                    )}

                    <button
                        id="next-question-btn"
                        className="btn btn-primary"
                        style={{
                            width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1.5rem',
                            background: currentAnswer.trim()
                                ? 'linear-gradient(135deg, #4F46E5, #7C3AED)'
                                : '#D1D5DB',
                            boxShadow: currentAnswer.trim() ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
                        }}
                        onClick={handleAnswer}
                        disabled={!currentAnswer.trim()}
                    >
                        {currentQIndex < quizData.questions.length - 1
                            ? <><span>Next Question</span> <ChevronRight size={20} /></>
                            : <><span>Finish Quiz</span> <Trophy size={20} /></>
                        }
                    </button>
                </div>
            </div>
        );
    }

    // RESULT PHASE
    if (phase === 'result' && result && prediction) {
        const score = result.scorePercent;
        const circumference = 2 * Math.PI * 70;
        const dashoffset = circumference - (circumference * score / 100);

        return (
            <div className="container animate-fade-in" style={{ maxWidth: '900px', marginTop: '2rem' }}>
                {/* Score Hero */}
                <div style={{
                    textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem',
                    background: score >= 80
                        ? 'linear-gradient(135deg, #059669, #10B981)'
                        : score >= 50
                            ? 'linear-gradient(135deg, #4F46E5, #7C3AED)'
                            : 'linear-gradient(135deg, #DC2626, #EF4444)',
                    borderRadius: '1.5rem', color: 'white', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', top: '-50px', right: '-50px',
                        width: '200px', height: '200px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-30px', left: '-30px',
                        width: '150px', height: '150px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)'
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Circular Score */}
                        <div style={{ display: 'inline-block', position: 'relative', marginBottom: '1.5rem' }}>
                            <svg width="160" height="160" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                                <circle cx="80" cy="80" r="70" fill="none" stroke="white" strokeWidth="8"
                                    strokeDasharray={circumference} strokeDashoffset={dashoffset}
                                    strokeLinecap="round"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s ease' }}
                                />
                            </svg>
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)', textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                                    {score}%
                                </div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Score</div>
                            </div>
                        </div>

                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            {score >= 80 ? '🌟 Excellent Performance!' : score >= 50 ? '💪 Good Effort!' : '📚 Keep Practicing!'}
                        </h1>
                        <p style={{ opacity: 0.9, fontSize: '1.05rem' }}>
                            {result.correctAnswers} / {result.totalQuestions} correct · Attempt #{result.attemptNumber}
                        </p>
                    </div>
                </div>

                {/* Prediction Card */}
                <div className="card" style={{
                    padding: '2rem', marginBottom: '2rem',
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #4F46E5, #7C3AED, #EC4899)',
                    backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Brain size={22} color="white" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>ML Exam Score Prediction</h2>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Based on {prediction.attemptCount} attempt{prediction.attemptCount > 1 ? 's' : ''} · {prediction.confidence}% confidence
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        {/* Predicted Score */}
                        <div style={{
                            padding: '1.25rem', borderRadius: '12px', textAlign: 'center',
                            background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.3rem' }}>
                                Predicted Exam Score
                            </div>
                            <div style={{
                                fontSize: '2.2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif",
                                color: 'var(--primary)'
                            }}>
                                {prediction.predictedScore}%
                            </div>
                        </div>
                        {/* Grade */}
                        <div style={{
                            padding: '1.25rem', borderRadius: '12px', textAlign: 'center',
                            background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.3rem' }}>
                                Expected Grade
                            </div>
                            <div style={{
                                fontSize: '2.2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif",
                                color: getGradeColor(prediction.grade)
                            }}>
                                {prediction.grade}
                            </div>
                        </div>
                        {/* Trend */}
                        <div style={{
                            padding: '1.25rem', borderRadius: '12px', textAlign: 'center',
                            background: 'linear-gradient(135deg, #FFF7ED, #FED7AA)'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.3rem' }}>
                                Performance Trend
                            </div>
                            <div style={{
                                fontSize: '1.5rem', fontWeight: 700, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                textTransform: 'capitalize'
                            }}>
                                {getTrendIcon(prediction.trend)}
                                {prediction.trend}
                            </div>
                        </div>
                    </div>

                    {/* Insights */}
                    <div style={{
                        padding: '1.25rem', borderRadius: '12px', backgroundColor: '#FAFBFF',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Lightbulb size={18} color="#F59E0B" />
                            <strong style={{ fontSize: '0.95rem' }}>AI Insights</strong>
                        </div>
                        {prediction.insights.map((insight, i) => (
                            <p key={i} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.4rem', lineHeight: 1.6 }}>
                                {insight}
                            </p>
                        ))}
                        <div style={{
                            marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px',
                            backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE'
                        }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--primary-dark)' }}>💡 Recommendation: </strong>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{prediction.recommendation}</span>
                        </div>
                    </div>

                    {/* Score History Chart */}
                    {prediction.history.length > 1 && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Score History</strong>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginTop: '0.75rem', height: '100px' }}>
                                {prediction.history.map((h, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                            {h.score}%
                                        </span>
                                        <div style={{
                                            width: '100%', minHeight: '8px',
                                            height: `${Math.max(h.score, 8)}%`,
                                            borderRadius: '4px 4px 0 0',
                                            background: i === prediction.history.length - 1
                                                ? 'linear-gradient(180deg, #4F46E5, #7C3AED)'
                                                : 'linear-gradient(180deg, #C7D2FE, #A5B4FC)',
                                            transition: 'height 0.5s ease'
                                        }} />
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>#{h.attempt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Question Review */}
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen color="var(--primary)" size={22} />
                        Question Review — Study Material
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {result.questions.map((q, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '1.25rem', borderRadius: '12px',
                                    borderLeft: `4px solid ${q.isCorrect ? '#10B981' : '#EF4444'}`,
                                    backgroundColor: q.isCorrect ? '#F0FDF4' : '#FEF2F2',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', flex: 1 }}>
                                        Q{idx + 1}. {q.question}
                                    </h4>
                                    {q.isCorrect
                                        ? <CheckCircle size={22} color="#10B981" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
                                        : <XCircle size={22} color="#EF4444" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
                                    }
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Your answer: </span>
                                    <span style={{
                                        fontWeight: 600,
                                        color: q.isCorrect ? '#059669' : '#DC2626'
                                    }}>
                                        {q.givenAnswer || '(no answer)'}
                                    </span>
                                </div>
                                {!q.isCorrect && (
                                    <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Correct answer: </span>
                                        <span style={{ fontWeight: 600, color: '#059669' }}>{q.correctAnswer}</span>
                                    </div>
                                )}
                                {q.explanation && (
                                    <div style={{
                                        marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px',
                                        backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.85rem',
                                        color: '#4B5563', lineHeight: 1.6
                                    }}>
                                        💡 <strong>Explanation:</strong> {q.explanation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                    {result.questions.some(q => !q.isCorrect) && (
                        <button
                            id="reattempt-btn"
                            className="btn btn-primary"
                            style={{
                                flex: 1, padding: '1rem', fontSize: '1rem',
                                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                                minWidth: '200px'
                            }}
                            onClick={() => handleReattempt(result._id)}
                        >
                            <RefreshCw size={20} /> Reattempt Mistakes ({result.questions.filter(q => !q.isCorrect).length})
                        </button>
                    )}
                    <button
                        id="new-quiz-btn"
                        className="btn btn-outline"
                        style={{ flex: 1, padding: '1rem', fontSize: '1rem', minWidth: '200px' }}
                        onClick={() => {
                            setPhase('input');
                            setResult(null);
                            setPrediction(null);
                        }}
                    >
                        <Play size={20} /> New Quiz
                    </button>
                </div>
            </div>
        );
    }

    // HISTORY PHASE
    if (phase === 'history') {
        return (
            <div className="container animate-fade-in" style={{ maxWidth: '900px', marginTop: '2rem' }}>
                <button
                    className="btn btn-outline"
                    style={{ marginBottom: '1.5rem' }}
                    onClick={() => {
                        setPhase('input');
                        setHistory([]);
                        setPrediction(null);
                    }}
                >
                    ← Back to Topics
                </button>

                <h1 style={{ marginBottom: '0.5rem' }}>{selectedTopic}</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    {history.length} total attempt{history.length !== 1 ? 's' : ''}
                </p>

                {/* Prediction Summary */}
                {prediction && prediction.attemptCount > 0 && (
                    <div className="card" style={{
                        padding: '2rem', marginBottom: '2rem',
                        background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF, #FDF2F8)',
                        border: '1px solid #E0E7FF'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <Brain size={22} color="var(--primary)" />
                            <h3 style={{ margin: 0 }}>ML Score Prediction</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: "'Outfit', sans-serif" }}>
                                    {prediction.predictedScore}%
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Predicted Score</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: getGradeColor(prediction.grade), fontFamily: "'Outfit', sans-serif" }}>
                                    {prediction.grade}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expected Grade</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                                    {getTrendIcon(prediction.trend)}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{prediction.trend}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', fontFamily: "'Outfit', sans-serif" }}>
                                    {prediction.confidence}%
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence</div>
                            </div>
                        </div>

                        {prediction.insights.length > 0 && (
                            <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '8px' }}>
                                {prediction.insights.map((insight, i) => (
                                    <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{insight}</p>
                                ))}
                            </div>
                        )}

                        <button
                            className="btn btn-primary"
                            style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                            onClick={() => {
                                setTopic(selectedTopic);
                                setPhase('input');
                            }}
                        >
                            <Play size={18} /> Take Another Quiz
                        </button>
                    </div>
                )}

                {/* Attempt History */}
                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={22} color="var(--primary)" /> Attempt History
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {history.map((attempt, idx) => (
                        <div key={attempt._id} className="card" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: '#EEF2FF', color: 'var(--primary)'
                                        }}>
                                            Attempt #{attempt.attemptNumber}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {new Date(attempt.createdAt).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {attempt.correctAnswers}/{attempt.totalQuestions} correct
                                        {attempt.timeSpentSeconds > 0 && ` · ${formatTime(attempt.timeSpentSeconds)}`}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        fontSize: '1.8rem', fontWeight: 800,
                                        fontFamily: "'Outfit', sans-serif",
                                        color: attempt.scorePercent >= 80 ? '#10B981' : attempt.scorePercent >= 50 ? '#4F46E5' : '#EF4444'
                                    }}>
                                        {attempt.scorePercent}%
                                    </div>
                                    {attempt.incorrectQuestions?.length > 0 || attempt.questions?.some(q => !q.isCorrect) ? (
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                            onClick={() => handleReattempt(attempt._id)}
                                        >
                                            <RotateCcw size={14} /> Retry
                                        </button>
                                    ) : (
                                        <Award size={22} color="#10B981" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

export default TopicQuiz;
