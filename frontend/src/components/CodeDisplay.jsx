import React, { useState } from 'react'

function CodeDisplay({ title, code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <h3 className="font-bold">{title}</h3>
        <button
          onClick={handleCopy}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm bg-gray-50">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
}

export default CodeDisplay
