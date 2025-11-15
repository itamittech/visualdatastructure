import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ArrayVisualizerEnhanced from './pages/ArrayVisualizerEnhanced'
import LinkedListVisualizerEnhanced from './pages/LinkedListVisualizerEnhanced'
import SetVisualizerEnhanced from './pages/SetVisualizerEnhanced'
import StackVisualizerEnhanced from './pages/StackVisualizerEnhanced'
import QueueVisualizerEnhanced from './pages/QueueVisualizerEnhanced'
import HashMapVisualizerEnhanced from './pages/HashMapVisualizerEnhanced'
import Home from './pages/Home'
import Introduction from './pages/Introduction'
import ComplexityGuide from './pages/ComplexityGuide'

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
                <Link to="/introduction" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Introduction
                </Link>
                <Link to="/complexity" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Complexity
                </Link>
                <Link to="/array" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Array
                </Link>
                <Link to="/linkedlist" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Linked List
                </Link>
                <Link to="/set" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Set
                </Link>
                <Link to="/stack" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Stack
                </Link>
                <Link to="/queue" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Queue
                </Link>
                <Link to="/hashmap" className="hover:bg-blue-700 px-3 py-2 rounded">
                  HashMap
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/complexity" element={<ComplexityGuide />} />
            <Route path="/array" element={<ArrayVisualizerEnhanced />} />
            <Route path="/linkedlist" element={<LinkedListVisualizerEnhanced />} />
            <Route path="/set" element={<SetVisualizerEnhanced />} />
            <Route path="/stack" element={<StackVisualizerEnhanced />} />
            <Route path="/queue" element={<QueueVisualizerEnhanced />} />
            <Route path="/hashmap" element={<HashMapVisualizerEnhanced />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
