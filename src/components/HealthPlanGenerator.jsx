import React, { useState } from 'react';
import { aiAPI } from '../utils/api';

export default function HealthPlanGenerator() {
  const [goals, setGoals] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePlan = async () => {
    if (!goals.trim()) {
      setError('Please enter your health goals');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await aiAPI.generateHealthPlan(goals);
      setPlan(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>AI Health Plan Generator</h2>
      <p>Get a personalized health plan based on your goals</p>

      <div style={styles.form}>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="Describe your health goals (e.g., lose weight, reduce stress, improve fitness)..."
          style={styles.textarea}
          disabled={loading}
        />

        <button
          onClick={handleGeneratePlan}
          style={styles.button}
          disabled={loading || !goals.trim()}
        >
          {loading ? 'Generating Plan...' : 'Generate Health Plan'}
        </button>
      </div>

      {error && (
        <div style={styles.error}>Error: {error}</div>
      )}

      {plan && (
        <div style={styles.results}>
          <div style={styles.section}>
            <h3>Your Personalized Health Plan</h3>
          </div>

          {plan.weeklyActions && plan.weeklyActions.length > 0 && (
            <div style={styles.section}>
              <h3>Weekly Actions</h3>
              <ul>
                {plan.weeklyActions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          )}

          {plan.longTermGoals && plan.longTermGoals.length > 0 && (
            <div style={styles.section}>
              <h3>Long-term Goals</h3>
              <ul>
                {plan.longTermGoals.map((goal, idx) => (
                  <li key={idx}>{goal}</li>
                ))}
              </ul>
            </div>
          )}

          {plan.trackingMetrics && plan.trackingMetrics.length > 0 && (
            <div style={styles.section}>
              <h3>Tracking Metrics</h3>
              <ul>
                {plan.trackingMetrics.map((metric, idx) => (
                  <li key={idx}>{metric}</li>
                ))}
              </ul>
            </div>
          )}

          {plan.motivationalTips && plan.motivationalTips.length > 0 && (
            <div style={styles.section}>
              <h3>Motivation Tips</h3>
              <ul>
                {plan.motivationalTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  textarea: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    minHeight: '100px',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#388e3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  error: {
    color: '#d32f2f',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  results: {
    marginTop: '20px',
  },
  section: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '4px',
    marginBottom: '15px',
  },
};
