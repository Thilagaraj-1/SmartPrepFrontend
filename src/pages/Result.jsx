import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw, BarChart2 } from 'lucide-react';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resultData = location.state?.quizResult;

    if (!resultData) {
        navigate('/questions');
        return null;
    }

    const { quiz, incorrectIndexes } = resultData;
    const total = quiz.quizQuestions.length;
    const incorrect = incorrectIndexes.length;
    const correct = total - incorrect;
    const score = (correct / total) * 100;

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px', marginTop: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>

                {score === 100 ? (
                    <CheckCircle color="var(--secondary)" size={64} style={{ display: 'inline-block', marginBottom: '1rem' }} />
                ) : (
                    <BarChart2 color="var(--primary)" size={64} style={{ display: 'inline-block', marginBottom: '1rem' }} />
                )}

                <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: score >= 80 ? 'var(--secondary)' : 'inherit' }}>
                    {score.toFixed(0)}% Score
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>
                    You answered {correct} out of {total} questions correctly.
                </p>

                {incorrect > 0 && (
                    <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
                            <XCircle color="var(--danger)" /> Areas to Review
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {quiz.quizQuestions.map(q => {
                                const isIncorrect = incorrectIndexes.includes(q._id);
                                if (!isIncorrect) return null;
                                return (
                                    <div key={q._id} style={{ padding: '1.5rem', backgroundColor: '#FEF2F2', borderLeft: '4px solid var(--danger)', borderRadius: '4px' }}>
                                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{q.question}</h3>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                            <strong style={{ color: 'var(--text-main)' }}>Correct Answer:</strong> {q.answer}
                                        </div>
                                        {q.explanation && (
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#991B1B' }}>
                                                💡 {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    {incorrect > 0 && (
                        <button
                            className="btn btn-primary"
                            style={{ padding: '1rem 2rem' }}
                            onClick={() => navigate(`/quiz/${quiz.originalQuestionId}`)}
                        >
                            <RefreshCw size={18} /> Reattempt Mistakes
                        </button>
                    )}
                    <Link to="/questions" className="btn btn-outline" style={{ padding: '1rem 2rem' }}>
                        Back to Questions
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Result;
