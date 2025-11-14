import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ArrayVisualizerEnhanced from './pages/ArrayVisualizerEnhanced'
import LinkedListVisualizerEnhanced from './pages/LinkedListVisualizerEnhanced'
import SetVisualizerEnhanced from './pages/SetVisualizerEnhanced'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-2xl font-bold">
                Visual Data Structure
              </Link>
              <div className="flex space-x-4">
                <Link to="/array" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Array
                </Link>
                <Link to="/linkedlist" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Linked List
                </Link>
                <Link to="/set" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Set
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/array" element={<ArrayVisualizerEnhanced />} />
            <Route path="/linkedlist" element={<LinkedListVisualizerEnhanced />} />
            <Route path="/set" element={<SetVisualizerEnhanced />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
