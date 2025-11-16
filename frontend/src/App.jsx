import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ArrayVisualizerEnhanced from './pages/ArrayVisualizerEnhanced'
import LinkedListVisualizerEnhanced from './pages/LinkedListVisualizerEnhanced'
import SetVisualizerEnhanced from './pages/SetVisualizerEnhanced'
import StackVisualizerEnhanced from './pages/StackVisualizerEnhanced'
import QueueVisualizerEnhanced from './pages/QueueVisualizerEnhanced'
import HashMapVisualizerEnhanced from './pages/HashMapVisualizerEnhanced'
import BinaryTreeVisualizerEnhanced from './pages/BinaryTreeVisualizerEnhanced'
import HeapVisualizerEnhanced from './pages/HeapVisualizerEnhanced'
import GraphVisualizerEnhanced from './pages/GraphVisualizerEnhanced'
import TrieVisualizerEnhanced from './pages/TrieVisualizerEnhanced'
import SortingVisualizerEnhanced from './pages/SortingVisualizerEnhanced'
import SearchingVisualizerEnhanced from './pages/SearchingVisualizerEnhanced'
import LRUCacheVisualizerEnhanced from './pages/LRUCacheVisualizerEnhanced'
import DynamicProgrammingVisualizer from './pages/DynamicProgrammingVisualizer'
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
              <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
                Visual Data Structure
              </Link>
              <div className="flex items-center space-x-6">
                <Link to="/" className="hover:bg-blue-700 px-4 py-2 rounded font-semibold transition-colors">
                  🏠 Browse Topics
                </Link>
                <Link to="/introduction" className="hover:bg-blue-700 px-4 py-2 rounded transition-colors">
                  Introduction
                </Link>
                <Link to="/complexity" className="hover:bg-blue-700 px-4 py-2 rounded transition-colors">
                  Complexity Guide
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
            <Route path="/tree" element={<BinaryTreeVisualizerEnhanced />} />
            <Route path="/heap" element={<HeapVisualizerEnhanced />} />
            <Route path="/graph" element={<GraphVisualizerEnhanced />} />
            <Route path="/trie" element={<TrieVisualizerEnhanced />} />
            <Route path="/sorting" element={<SortingVisualizerEnhanced />} />
            <Route path="/searching" element={<SearchingVisualizerEnhanced />} />
            <Route path="/lru-cache" element={<LRUCacheVisualizerEnhanced />} />
            <Route path="/dynamic-programming" element={<DynamicProgrammingVisualizer />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
