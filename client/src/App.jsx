import { useState, useEffect } from 'react'
import URLShortenerForm from './components/URLShortenerForm'
import HistoryPanel from './components/HistoryPanel'

export default function App() {
  const [history, setHistory] = useState([])

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('urlHistory')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (err) {
        console.error('Failed to load history:', err)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('urlHistory', JSON.stringify(history))
  }, [history])

  const handleURLShortened = (shortUrlData) => {
    setHistory([shortUrlData, ...history])
  }

  const handleDeleteHistory = (index) => {
    setHistory(history.filter((_, i) => i !== index))
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white">URL Shortener</h1>
          <p className="text-slate-400 text-sm mt-2">Fast, scalable URL shortening with Redis</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <URLShortenerForm onURLShortened={handleURLShortened} />
        <HistoryPanel 
          history={history} 
          onDelete={handleDeleteHistory}
          onClearAll={handleClearAll}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p>Powered by Node.js + Redis</p>
        </div>
      </footer>
    </div>
  )
}