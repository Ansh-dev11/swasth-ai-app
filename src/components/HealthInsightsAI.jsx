import React, { useState, useEffect } from 'react';
import { aiAPI } from '../utils/api';

export default function HealthInsightsAI() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiAPI.getHealthInsights();
      setInsights(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.container}>Loading insights...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!insights) return <div style={styles.container}>No insights available</div>;

  return (
    <div style={styles.container}>
      <h2>AI Health Insights</h2>

      <div style={styles.section}>
        <h3>Summary</h3>
        <p>{insights.summary}</p>
      </div>

      {insights.trends && insights.trends.length > 0 && (
        <div style={styles.section}>
          <h3>Trends</h3>
          <ul>
            {insights.trends.map((trend, idx) => (
              <li key={idx}>{trend}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.recommendations && insights.recommendations.length > 0 && (
        <div style={styles.section}>
          <h3>Recommendations</h3>
          <ul>
            {insights.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.alerts && insights.alerts.length > 0 && (
        <div style={styles.alertSection}>
          <h3>Important Alerts</h3>
          <ul>
            {insights.alerts.map((alert, idx) => (
              <li key={idx} style={styles.alertItem}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={fetchInsights} style={styles.refreshButton}>
        Refresh Insights
      </button>
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
  section: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  alertSection: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '4px',
    border: '1px solid #ffc107',
  },
  alertItem: {
    color: '#856404',
  },
  error: {
    color: '#d32f2f',
    padding: '20px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
