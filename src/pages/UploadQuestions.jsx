import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UploadCloud, FileText } from 'lucide-react';

const UploadQuestions = () => {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                await api.post('/questions/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else if (text) {
                await api.post('/questions/upload', { text });
            }
            navigate('/questions');
        } catch (err) {
            console.error(err);
            alert('Failed to upload and process questions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Upload Study Material</h1>

                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UploadCloud /> Upload PDF Document
                    </h2>
                    <div
                        style={{
                            border: '2px dashed var(--border)',
                            borderRadius: '12px',
                            padding: '3rem',
                            textAlign: 'center',
                            backgroundColor: '#F9FAFB',
                            cursor: 'pointer'
                        }}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ marginBottom: '1rem' }}
                        />
                        <p style={{ color: 'var(--text-muted)' }}>Select a PDF containing questions or study material</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: '1rem 0', fontWeight: 'bold' }}>OR</div>

                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText /> Manual Input
                    </h2>
                    <textarea
                        className="form-input"
                        rows={6}
                        placeholder="Type or paste questions here (separated by '?')"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                    onClick={handleUpload}
                    disabled={loading || (!file && !text)}
                >
                    {loading ? 'Processing with AI...' : 'Extract & Analyze Questions'}
                </button>
            </div>
        </div>
    );
};

export default UploadQuestions;
