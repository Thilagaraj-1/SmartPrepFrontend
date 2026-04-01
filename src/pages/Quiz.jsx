import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Target, ChevronRight } from 'lucide-react';

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quiz/${id}`);
                setQuizData(res.data);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.msg || 'Error loading quiz');
                navigate('/questions');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id, navigate]);

    const handleNext = () => {
        setAnswers(prev => [...prev, { index: currentQIndex, givenAnswer: currentAnswer }]);
        setCurrentAnswer('');

        if (currentQIndex < quizData.quizQuestions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            submitQuiz([...answers, { index: currentQIndex, givenAnswer: currentAnswer }]);
        }
    };

    const submitQuiz = async (finalAnswers) => {
        try {
            const res = await api.post('/quiz/submit', {
                quizId: quizData._id,
                answers: finalAnswers
            });
            navigate('/result', { state: { quizResult: res.data } });
        } catch (err) {
            console.error(err);
            alert('Error submitting quiz');
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Generating Quiz...</div>;
    if (!quizData) return null;

    const currentQ = quizData.quizQuestions[currentQIndex];
    const progress = ((currentQIndex) / quizData.quizQuestions.length) * 100;

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '600px', marginTop: '3rem' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                    <span>Question {currentQIndex + 1} of {quizData.quizQuestions.length}</span>
                    <Target />
                </div>

                <div style={{ width: '100%', backgroundColor: 'var(--border)', height: '8px', borderRadius: '4px', marginBottom: '2rem' }}>
                    <div style={{ width: `${progress}%`, backgroundColor: 'var(--primary)', height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
                </div>

                <h2 style={{ marginBottom: '2rem' }}>{currentQ.question}</h2>

                {currentQ.type === 'mcq' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        {currentQ.options?.map((opt, idx) => (
                            <label
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    border: `2px solid ${currentAnswer === opt ? 'var(--primary)' : 'var(--border)'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: currentAnswer === opt ? '#EEF2FF' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <input
                                    type="radio"
                                    name="quiz_option"
                                    value={opt}
                                    checked={currentAnswer === opt}
                                    onChange={(e) => setCurrentAnswer(e.target.value)}
                                    style={{ transform: 'scale(1.2)' }}
                                />
                                <span style={{ fontWeight: '500' }}>{opt}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <div style={{ marginBottom: '2rem' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Type your answer here..."
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            autoFocus
                        />
                    </div>
                )}

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                    onClick={handleNext}
                    disabled={!currentAnswer.trim()}
                >
                    {currentQIndex < quizData.quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ChevronRight size={20} />
                </button>

            </div>
        </div>
    );
};

export default Quiz;
