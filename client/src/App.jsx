import { useState } from 'react'
import URLShortenerForm from './components/URLShortenerForm'

export default function App() {
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
      <main className="max-w-2xl mx-auto px-4 py-12">
        <URLShortenerForm />
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