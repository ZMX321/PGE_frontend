import { useState } from 'react'
import './ReportAnalyse.css'
import API_BASE_URL from '../config'

function ReportAnalyse() {
  const [files, setFiles] = useState([null, null, null]) // Start with 3 slots
  const [showPopup, setShowPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileChange = (index, event) => {
    const newFiles = [...files]
    newFiles[index] = event.target.files[0] || null
    setFiles(newFiles)

    // If the 3rd slot (index 2) is filled and we only have 3 slots, add a 4th slot
    if (index === 2 && newFiles[2] && files.length === 3) {
      setFiles([...newFiles, null])
    }
  }

  const handleRemoveFile = (index) => {
    const newFiles = [...files]
    newFiles[index] = null
    setFiles(newFiles)
  }

  const handleSubmit = async () => {
    const uploadedFiles = files.filter(file => file !== null)
    
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one PGE report')
      return
    }

    // Show popup and start loading
    setShowPopup(true)
    setIsLoading(true)
    setResult(null)

    // Create FormData to send files to backend
    const formData = new FormData()
    uploadedFiles.forEach((file, index) => {
      formData.append(`report_${index + 1}`, file)
    })

    // Send files to backend
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload-reports`, {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      // Stop loading and show result
      setIsLoading(false)
      
      if (data.success) {
        console.log('Upload successful:', data)
        setResult({
          success: true,
          message: data.message || `Successfully uploaded ${data.count} file(s)`,
          report: data.result,
          files: data.files || [],
          count: data.count
        })
      } else {
        setResult({
          success: false,
          message: data.message || `Upload failed: ${data.error || 'Unknown error'}`,
          error: data.error
        })
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      setIsLoading(false)
      setResult({
        success: false,
        message: `Error uploading files. Please make sure the backend server is running on ${API_BASE_URL}`,
        error: error.message
      })
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setIsLoading(false)
    setResult(null)
  }

  return (
    <div className="report-analyse">
      <h2>Upload PGE Reports</h2>
      <p className="description">
        Upload your PGE reports below. You can upload multiple reports for analysis.
      </p>

      <div className="upload-container">
        {files.map((file, index) => (
          <div key={index} className="upload-slot">
            <div className="upload-slot-header">
              <span className="slot-number">Report {index + 1}</span>
              {file && (
                <button
                  className="remove-button"
                  onClick={() => handleRemoveFile(index)}
                  aria-label="Remove file"
                >
                  ×
                </button>
              )}
            </div>
            
            {file ? (
              <div className="file-preview">
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            ) : (
              <label className="upload-area">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(index, e)}
                  accept=".pdf,.txt,.csv,.xlsx,.xls"
                  style={{ display: 'none' }}
                />
                <div className="upload-placeholder">
                  <div className="upload-icon">📤</div>
                  <p>Click to upload or drag and drop</p>
                  <p className="upload-hint">PDF, TXT, CSV, Excel</p>
                </div>
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="submit-container">
        <button className="submit-button" onClick={handleSubmit}>
          Submit Reports
        </button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={handleClosePopup}>×</button>
            
            {isLoading ? (
              <div className="loading-container">
                <h3>Processing Reports...</h3>
                <div className="loading-bar-container">
                  <div className="loading-bar"></div>
                </div>
                <p className="loading-text">Please wait while we process your reports</p>
              </div>
            ) : result ? (
              <div className="result-container">
                <h3 className={result.success ? 'result-success' : 'result-error'}>
                  {result.success ? '✓ Success' : '✗ Error'}
                </h3>
                <div className="result-content">
                  <p className="result-message">{result.message}</p>
                  
                  {result.files && result.files.length > 0 && (
                    <div className="result-files">
                      <h4>Uploaded Files ({result.count || result.files.length}):</h4>
                      <ul>
                        {result.files.map((file, index) => (
                          <li key={index}>
                            {typeof file === 'string' ? file : (file.original_name || file.name || `File ${index + 1}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.report && (
                    <div className="result-report">
                      <h4>Report Analysis:</h4>
                      <div className="report-content">
                        {typeof result.report === 'string' ? (
                          <pre className="report-text">{result.report}</pre>
                        ) : (
                          <pre className="report-json">{JSON.stringify(result.report, null, 2)}</pre>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {result.error && (
                    <div className="result-error-details">
                      <h4>Error Details:</h4>
                      <p>{result.error}</p>
                    </div>
                  )}
                </div>
                <button className="result-close-button" onClick={handleClosePopup}>
                  Close
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportAnalyse

