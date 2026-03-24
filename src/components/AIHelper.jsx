import React, { useState } from 'react';
import { useAI } from '../utils/api';

export default function AIHelper() {
  const { askQuestion, isLoading, error } = useAI();
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);
  const [category, setCategory] = useState('general');

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      const response = await askQuestion(question, category);
      setResponses([...responses, { question, answer: response.answer, confidence: response.confidence }]);
      setQuestion('');
    } catch (err) {
      console.error('Error asking question:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Health AI Assistant</h2>
      <p style={styles.subtitle}>Ask any health-related questions and get AI-powered responses</p>

      <form onSubmit={handleAsk} style={styles.form}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="general">General Health</option>
          <option value="nutrition">Nutrition</option>
          <option value="exercise">Exercise</option>
          <option value="mental-health">Mental Health</option>
          <option value="diseases">Diseases & Conditions</option>
          <option value="medications">Medications</option>
        </select>

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your health question here..."
          style={styles.input}
          disabled={isLoading}
        />

        <button
          type="submit"
          style={styles.button}
          disabled={isLoading || !question.trim()}
        >
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div style={styles.error}>
          Error: {error}
        </div>
      )}

      <div style={styles.responses}>
        {responses.map((resp, idx) => (
          <div key={idx} style={styles.responseItem}>
            <div style={styles.questionText}>
              <strong>Q:</strong> {resp.question}
            </div>
            <div style={styles.answerText}>
              <strong>A:</strong> {resp.answer}
            </div>
            <div style={styles.confidence}>
              Confidence: {(resp.confidence * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  input: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  error: {
    color: '#d32f2f',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  responses: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  responseItem: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '4px',
    borderLeft: '4px solid #007bff',
  },
  questionText: {
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#333',
  },
  answerText: {
    marginBottom: '10px',
    color: '#555',
    lineHeight: '1.6',
  },
  confidence: {
    fontSize: '12px',
    color: '#999',
  },
};
