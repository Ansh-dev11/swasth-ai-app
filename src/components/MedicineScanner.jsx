import React, { useState } from 'react';
import '../styles/MedicineScanner.css';

export default function MedicineScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Determine API URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/medicines/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data.analysis);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze image');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="medicine-scanner">
      <div className="scanner-header">
        <h2>Medicine Package Scanner</h2>
        <p>Upload a medicine package image to verify authenticity and extract information</p>
      </div>

      <div className="scanner-container">
        {/* Upload Section */}
        <div className="upload-section">
          <div className="file-input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="medicine-image"
              className="file-input"
            />
            <label htmlFor="medicine-image" className="file-label">
              <span className="upload-icon">📸</span>
              <span className="upload-text">
                {selectedFile ? selectedFile.name : 'Click or drag to upload image'}
              </span>
            </label>
          </div>

          {preview && (
            <div className="preview-section">
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          )}

          {error && (
            <div className="error-message">
              <span>❌ {error}</span>
            </div>
          )}

          <div className="button-group">
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className="analyze-btn"
            >
              {loading ? 'Analyzing...' : 'Analyze Package'}
            </button>
            <button
              onClick={handleClear}
              disabled={!selectedFile && !result}
              className="clear-btn"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="results-section">
            <h3>Analysis Results</h3>

            {result.error && !result.medicine_name && (
              <div className="error-badge">
                <span>⚠️ {result.error}</span>
              </div>
            )}

            <div className="extraction-results">
              <div className="result-group">
                <h4>Extracted Information</h4>
                <div className="result-field">
                  <label>Medicine Name:</label>
                  <span className={!result.medicine_name ? 'null-value' : ''}>
                    {result.medicine_name || 'Not detected'}
                  </span>
                </div>
                <div className="result-field">
                  <label>Dosage:</label>
                  <span className={!result.dosage ? 'null-value' : ''}>
                    {result.dosage || 'Not detected'}
                  </span>
                </div>
                <div className="result-field">
                  <label>Batch Number:</label>
                  <span className={!result.batch_number ? 'null-value' : ''}>
                    {result.batch_number || 'Not detected'}
                  </span>
                </div>
                <div className="result-field">
                  <label>Expiry Date:</label>
                  <span className={!result.expiry_date ? 'null-value' : ''}>
                    {result.expiry_date || 'Not detected'}
                  </span>
                </div>
                <div className="result-field">
                  <label>Manufacturing Date:</label>
                  <span className={!result.manufacturing_date ? 'null-value' : ''}>
                    {result.manufacturing_date || 'Not detected'}
                  </span>
                </div>
                <div className="result-field">
                  <label>Manufacturer:</label>
                  <span className={!result.manufacturer_name ? 'null-value' : ''}>
                    {result.manufacturer_name || 'Not detected'}
                  </span>
                </div>
              </div>

              <div className="result-group">
                <h4>Authenticity Assessment</h4>
                <div className="authenticity-check">
                  <span className={result.spelling_errors ? 'warning' : 'ok'}>
                    {result.spelling_errors ? '⚠️' : '✓'} Spelling
                  </span>
                  <span className={result.packaging_damage ? 'warning' : 'ok'}>
                    {result.packaging_damage ? '⚠️' : '✓'} Packaging
                  </span>
                  <span className={result.suspicious_print_quality ? 'warning' : 'ok'}>
                    {result.suspicious_print_quality ? '⚠️' : '✓'} Print Quality
                  </span>
                </div>
              </div>

              {result.notes && (
                <div className="result-group">
                  <h4>Notes</h4>
                  <p className="notes">{result.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
