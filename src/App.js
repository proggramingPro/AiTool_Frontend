import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';

function App() {
  const [prompt, setPrompt] = useState('Create a simple Express endpoint that returns "Hello World"');
  const [filename, setFilename] = useState('generated_code.js');
  const [code, setCode] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDownloadLink(null);
    setCode(null);
    setDescription(null);
    setCopied(false);
    
    try {
      const response = await axios.post('https://codenet-ky3u.onrender.com/api/generate', { 
        prompt,
        filename 
      });
      
      if (response.data.success) {
        setCode(response.data.code);
        setDescription(response.data.description || 'No description available');
        setDownloadLink(response.data.downloadLink);
      } else {
        throw new Error(response.data.error || 'Generation failed');
      }
    } catch (err) {
      setError(err.response?.data?.details || err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadLink) {
      window.open(`http://localhost:5000${downloadLink}`, '_blank');
    }
  };

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Navbar title="CodeNET"/>
      <div className="app-container">
        <h1 className="app-title">CodeNET</h1>
        <p className="app-subtitle">Generate backend code with CodeNet AI.</p>
        
        <form onSubmit={handleSubmit} className="generation-form">
          <div className="form-group">
            <label>Code Prompt:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Filename:</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="generate-button"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Generating...
              </>
            ) : (
              'Generate Code'
            )}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {description && (
          <div className="explanation-box">
            <h3>Explanation</h3>
            <div className="explanation-content">{description}</div>
          </div>
        )}

        {code && (
          <div className="code-container">
            <div className="code-header">
              <h3>Generated Code</h3>
              <div className="code-actions">
                <button 
                  onClick={handleCopy}
                  className={`copy-button ${copied ? 'copied' : ''}`}
                >
                  {copied ? '✓ Copied!' : 'Copy Code'}
                </button>
                {downloadLink && (
                  <button 
                    onClick={handleDownload}
                    className="download-button"
                  >
                    Download File
                  </button>
                )}
              </div>
            </div>

            <pre className="code-display">
              <code>{code}</code>
            </pre>

            {downloadLink && (
              <div className="filename-display">
                File saved as: <strong>{filename}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .app-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial, sans-serif';
          color: #333;
          box-sizing: border-box;
        }
        
        .app-title {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 10px;
          font-size: clamp(1.8rem, 5vw, 2.2rem);
        }
        
        .app-subtitle {
          text-align: center;
          color: #7f8c8d;
          margin-bottom: 30px;
          font-size: clamp(1rem, 3vw, 1.2rem);
        }
        
        .generation-form {
          margin-bottom: 30px;
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
          font-size: clamp(0.9rem, 3vw, 1rem);
        }
        
        .form-group textarea,
        .form-group input {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: clamp(0.9rem, 3vw, 1rem);
          box-sizing: border-box;
        }
        
        .form-group textarea {
          min-height: 120px;
          line-height: 1.5;
          resize: vertical;
        }
        
        .generate-button {
          background-color: #3498db;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: clamp(0.9rem, 3vw, 1rem);
          font-weight: 600;
          width: 100%;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .generate-button:disabled {
          background-color: #95a5a6;
        }
        
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .error-message {
          color: white;
          background-color: #e74c3c;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          font-size: clamp(0.8rem, 3vw, 0.9rem);
        }
        
        .explanation-box {
          background-color: #e8f4f8;
          border-left: 4px solid #3498db;
          padding: 18px;
          border-radius: 4px;
          margin-bottom: 25px;
        }
        
        .explanation-box h3 {
          margin-top: 0;
          margin-bottom: 12px;
          color: #2980b9;
          font-size: clamp(1rem, 3vw, 1.2rem);
        }
        
        .explanation-content {
          white-space: pre-wrap;
          line-height: 1.6;
          font-size: clamp(0.9rem, 3vw, 1rem);
        }
        
        .code-container {
          margin-top: 20px;
        }
        
        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .code-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: clamp(1rem, 3vw, 1.2rem);
        }
        
        .code-actions {
          display: flex;
          gap: 10px;
        }
        
        .copy-button,
        .download-button {
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: clamp(0.8rem, 3vw, 0.9rem);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background-color 0.3s;
        }
        
        .copy-button {
          background-color: #3498db;
        }
        
        .copy-button.copied {
          background-color: #2ecc71;
        }
        
        .download-button {
          background-color: #f39c12;
        }
        
        .code-display {
          background: #2d3436;
          color: #f5f6fa;
          padding: 18px;
          border-radius: 6px;
          overflow-x: auto;
          border: 1px solid #1e272e;
          font-size: clamp(0.8rem, 3vw, 0.9rem);
          line-height: 1.5;
          margin: 0;
        }
        
        .filename-display {
          margin-top: 12px;
          color: #7f8c8d;
          font-size: clamp(0.8rem, 3vw, 0.9rem);
          text-align: right;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 600px) {
          .app-container {
            padding: 15px;
          }
          
          .generation-form {
            padding: 15px;
          }
          
          .code-actions {
            width: 100%;
            justify-content: space-between;
          }
          
          .copy-button,
          .download-button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}

export default App;
