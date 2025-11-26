import { useState } from 'react'
import ReportAnalyse from './components/ReportAnalyse'
import ComparePlan from './components/ComparePlan'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('report-analyse')

  return (
    <div className="app">
      <header className="app-header">
        <h1>PGE Analyse</h1>
      </header>
      
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'report-analyse' ? 'active' : ''}`}
            onClick={() => setActiveTab('report-analyse')}
          >
            Report Analyse
          </button>
          <button
            className={`tab ${activeTab === 'compare-plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('compare-plan')}
          >
            Compare Plan
          </button>
        </div>
      </div>

      <main className="main-content">
        {activeTab === 'report-analyse' && <ReportAnalyse />}
        {activeTab === 'compare-plan' && <ComparePlan />}
      </main>
    </div>
  )
}

export default App

