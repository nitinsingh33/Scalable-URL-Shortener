import { useState } from 'react'

const API_URL = 'http://localhost:3000'

export default function URLShortenerForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [shortUrl, setShortUrl] = useState('')

  // URL validation regex
  const validateURL = (urlString) => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validate input
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!validateURL(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setShortUrl(data.shortUrl)
      setUrl('')
      setSuccess(true)
    } catch (err) {
      setError(
        err.message.includes('fetch')
          ? 'Cannot connect to server. Is it running on port 3000?'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-slate-200 mb-2">
            Enter URL to Shorten
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Shortening...
            </>
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>

      {/* Success Message with Result */}
      {success && (
        <div className="mt-6 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
          <p className="text-green-300 text-sm font-medium mb-3">✓ URL shortened successfully!</p>
          <div className="bg-slate-700 p-3 rounded-lg flex items-center justify-between">
            <code className="text-blue-300 text-sm break-all">{shortUrl}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shortUrl)
                // Optional: Show toast notification
              }}
              className="ml-2 px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg whitespace-nowrap transition-colors flex-shrink-0"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
