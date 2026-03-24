import React, { useState } from 'react';
import { aiAPI } from '../utils/api';

export default function HealthRiskPredictor() {
  const [risks, setRisks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiAPI.predictHealthRisks();
      setRisks(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return '#d32f2f';
      case 'moderate':
        return '#f57c00';
      case 'low':
        return '#388e3c';
      default:
        return '#666';
    }
  };

  return (
    <div style={styles.container}>
      <h2>AI Health Risk Prediction</h2>
      <p>Get personalized health risk assessments based on your data</p>

      <button
        onClick={handlePredict}
        style={styles.button}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze My Health Risks'}
      </button>

      {error && (
        <div style={styles.error}>Error: {error}</div>
      )}

      {risks && (
        <div style={styles.results}>
          <div style={styles.riskLevel}>
            <h3>Overall Risk Level</h3>
            <div style={{
              ...styles.riskBadge,
              backgroundColor: getRiskColor(risks.riskLevel),
            }}>
              {risks.riskLevel?.toUpperCase() || 'UNKNOWN'}
            </div>
          </div>

          {risks.risks && risks.risks.length > 0 && (
            <div style={styles.section}>
              <h3>Identified Risks</h3>
              <ul>
                {risks.risks.map((risk, idx) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>
          )}

          {risks.recommendations && risks.recommendations.length > 0 && (
            <div style={styles.section}>
              <h3>Recommendations</h3>
              <ul>
                {risks.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={styles.section}>
            <h3>Next Checkup</h3>
            <p>
              {risks.followUpTimeline
                ? new Date(risks.followUpTimeline).toLocaleDateString()
                : risks.next_checkup
                ? new Date(risks.next_checkup).toLocaleDateString()
                : 'Consult with healthcare provider'}
            </p>
          </div>
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
  button: {
    padding: '12px 24px',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
    width: '100%',
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
  riskLevel: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  riskBadge: {
    display: 'inline-block',
    padding: '15px 30px',
    color: 'white',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  section: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '4px',
    marginBottom: '15px',
  },
};
