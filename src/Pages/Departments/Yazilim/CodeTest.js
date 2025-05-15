// src/Pages/Departments/Yazilim/CodeTest.js
// AI Kod Testi bileşeni - Yazılım departmanı için özel

import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Row, Col } from 'reactstrap';
import { Play, Download, Code, CheckCircle, AlertCircle } from 'lucide-react';

const CodeTest = () => {
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const handleCodeTest = async () => {
    setIsLoading(true);
    
    // Simulated API call - gerçek implementasyonda API'ye istek atılacak
    setTimeout(() => {
      const mockResults = {
        success: true,
        errors: [],
        warnings: [
          { line: 5, message: 'Kullanılmayan değişken: temp' },
          { line: 12, message: 'Console.log statement found' }
        ],
        performance: 'Güzel',
        suggestions: [
          'Değişken isimlendirmelerini iyileştirin',
          'Error handling ekleyin',
          'Code documentation yazın'
        ]
      };
      setTestResults(mockResults);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="code-test-page">
      <div className="limonian-dashboard-welcome">
        <h1>AI Kod Testi</h1>
        <p>Kodunuzu yapay zeka ile analiz edin, hataları tespit edin ve optimizasyon önerileri alın.</p>
      </div>

      <Row>
        <Col lg={6}>
          <div className="limonian-chart-card">
            <div className="limonian-chart-header">
              <h2>Kod Editörü</h2>
              <div className="language-selector">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="form-select"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="php">PHP</option>
                </select>
              </div>
            </div>
            <div className="limonian-chart-body">
              <textarea
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`${language} kodunuzu buraya yazın...`}
                rows={20}
              />
              <div className="code-actions">
                <Button 
                  color="primary" 
                  onClick={handleCodeTest}
                  disabled={!code.trim() || isLoading}
                >
                  <Play size={16} />
                  {isLoading ? 'Analiz Ediliyor...' : 'Kodu Analiz Et'}
                </Button>
                <Button color="secondary" outline>
                  <Download size={16} />
                  İndir
                </Button>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="limonian-chart-card">
            <div className="limonian-chart-header">
              <h2>Analiz Sonuçları</h2>
            </div>
            <div className="limonian-chart-body">
              {!testResults ? (
                <div className="no-results">
                  <Code size={48} />
                  <p>Analiz sonuçları burada görünecek</p>
                </div>
              ) : (
                <div className="test-results">
                  <div className="result-header">
                    <div className={`status-badge ${testResults.success ? 'success' : 'error'}`}>
                      {testResults.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      {testResults.success ? 'Analiz Tamamlandı' : 'Hatalar Bulundu'}
                    </div>
                  </div>

                  {testResults.errors.length > 0 && (
                    <div className="result-section errors">
                      <h4>Hatalar</h4>
                      {testResults.errors.map((error, index) => (
                        <div key={index} className="result-item error">
                          <span className="line-number">Satır {error.line}:</span>
                          <span className="message">{error.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {testResults.warnings.length > 0 && (
                    <div className="result-section warnings">
                      <h4>Uyarılar</h4>
                      {testResults.warnings.map((warning, index) => (
                        <div key={index} className="result-item warning">
                          <span className="line-number">Satır {warning.line}:</span>
                          <span className="message">{warning.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="result-section performance">
                    <h4>Performans</h4>
                    <div className="performance-badge">{testResults.performance}</div>
                  </div>

                  <div className="result-section suggestions">
                    <h4>Öneriler</h4>
                    <ul>
                      {testResults.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CodeTest;