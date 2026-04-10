export default function HistoryPanel({ history = [], onDelete, onClearAll }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (history.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700 text-center">
        <p className="text-slate-400 text-sm">No URLs shortened yet. Start by entering a URL above!</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Recent History</h2>
        <button
          onClick={onClearAll}
          className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-sm rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* History List */}
      <div className="max-h-96 overflow-y-auto">
        {history.map((item, index) => (
          <div
            key={index}
            className="px-6 py-4 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50 transition-colors"
          >
            {/* Row 1: Short URL */}
            <div className="flex items-center justify-between mb-2">
              <a
                href={item.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium truncate flex-1"
              >
                {item.shortUrl}
              </a>
              <button
                onClick={() => copyToClipboard(item.shortUrl)}
                className="ml-2 px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors flex-shrink-0"
              >
                Copy
              </button>
            </div>

            {/* Row 2: Original URL */}
            <p className="text-slate-400 text-xs truncate mb-2" title={item.originalUrl}>
              {item.originalUrl}
            </p>

            {/* Row 3: Metadata */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs">{formatTime(item.createdAt)}</span>
              <button
                onClick={() => onDelete(index)}
                className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
