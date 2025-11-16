import React from 'react'
import { Link } from 'react-router-dom'

function Introduction() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Introduction</span>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Visual Data Structures
        </h1>
        <p className="text-xl mb-6 opacity-90">
          Master data structures through interactive visualizations and step-by-step learning
        </p>
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="text-sm opacity-80">Learn By</div>
            <div className="font-bold">Seeing</div>
          </div>
          <div className="text-2xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="text-sm opacity-80">Learn By</div>
            <div className="font-bold">Doing</div>
          </div>
          <div className="text-2xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="text-sm opacity-80">Learn By</div>
            <div className="font-bold">Understanding</div>
          </div>
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">What You'll Learn</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">📊</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Comprehensive Data Structures</h3>
              <p className="text-gray-600 mb-3">
                Master 10+ essential data structures with interactive visualizations and architect-level insights:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 px-3 py-2 rounded">
                  <Link to="/array" className="text-blue-700 hover:text-blue-900 font-semibold">Arrays</Link>
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded">
                  <Link to="/linkedlist" className="text-blue-700 hover:text-blue-900 font-semibold">Linked Lists</Link>
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded">
                  <Link to="/set" className="text-blue-700 hover:text-blue-900 font-semibold">Sets (HashSet)</Link>
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded">
                  <Link to="/stack" className="text-blue-700 hover:text-blue-900 font-semibold">Stacks</Link>
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded">
                  <Link to="/queue" className="text-blue-700 hover:text-blue-900 font-semibold">Queues</Link>
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded">
                  <Link to="/hashmap" className="text-blue-700 hover:text-blue-900 font-semibold">HashMaps</Link>
                </div>
                <div className="bg-green-50 px-3 py-2 rounded">
                  <Link to="/tree" className="text-green-700 hover:text-green-900 font-semibold">Binary Trees</Link>
                </div>
                <div className="bg-green-50 px-3 py-2 rounded">
                  <Link to="/heap" className="text-green-700 hover:text-green-900 font-semibold">Heaps (Priority Queue)</Link>
                </div>
                <div className="bg-green-50 px-3 py-2 rounded">
                  <Link to="/graph" className="text-green-700 hover:text-green-900 font-semibold">Graphs</Link>
                </div>
                <div className="bg-green-50 px-3 py-2 rounded">
                  <Link to="/trie" className="text-green-700 hover:text-green-900 font-semibold">Tries (Prefix Tree)</Link>
                </div>
                <div className="bg-purple-50 px-3 py-2 rounded">
                  <Link to="/sorting" className="text-purple-700 hover:text-purple-900 font-semibold">Sorting Algorithms</Link>
                </div>
                <div className="bg-rose-50 px-3 py-2 rounded">
                  <Link to="/searching" className="text-rose-700 hover:text-rose-900 font-semibold">Searching Algorithms</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-4xl">⚡</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Time & Space Complexity</h3>
              <p className="text-gray-600 mb-3">
                Understand Big O notation through visual proofs and real-world examples:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Why ArrayList add is O(1) amortized</li>
                <li>• Why HashMap lookup is O(1) average</li>
                <li>• Why Binary Search is O(log n)</li>
                <li>• Why Graph BFS/DFS is O(V + E)</li>
                <li>• Memory layout analysis per structure</li>
                <li>• Cache locality and performance impact</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-4xl">💻</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Scratch & Library Implementations</h3>
              <p className="text-gray-600 mb-3">
                Learn both approaches with detailed explanations:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Build data structures from scratch</li>
                <li>• Use Java Collections Framework</li>
                <li>• Understand internal mechanisms</li>
                <li>• Compare implementation trade-offs</li>
                <li>• Production-grade code patterns</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Real-World Applications</h3>
              <p className="text-gray-600 mb-3">
                See how tech giants use these structures:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Google Search autocomplete (Tries)</li>
                <li>• Facebook social graph (Graphs)</li>
                <li>• Dijkstra in Google Maps (Heaps)</li>
                <li>• LRU Cache implementation (Trees)</li>
                <li>• Production patterns and optimizations</li>
                <li>• Interview problem solutions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="font-bold text-lg text-gray-800 mb-3">🎓 Four-Step Learning Path</h3>
          <p className="text-gray-600 mb-3">
            Every data structure follows our proven architect-level pattern:
          </p>
          <div className="grid md:grid-cols-4 gap-3 text-sm">
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="font-bold text-blue-600 mb-1">1. Theory</div>
              <div className="text-gray-600">Concepts, characteristics, when to use</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="font-bold text-green-600 mb-1">2. Practice</div>
              <div className="text-gray-600">Interactive visualization and operations</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="font-bold text-purple-600 mb-1">3. Code</div>
              <div className="text-gray-600">Scratch + library implementations</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="font-bold text-slate-600 mb-1">4. Advanced</div>
              <div className="text-gray-600">Production patterns, memory analysis, interviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">How This Works</h2>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
              1
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Interactive Visualizations</h3>
              <p className="text-gray-600">
                Click buttons to perform operations. See exactly what happens to the data structure
                in real-time with animations and highlights.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-green-100 text-green-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
              2
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Learning Mode</h3>
              <p className="text-gray-600">
                Enable "Learning Mode" to see step-by-step execution. Watch operations happen one
                step at a time with explanations and operation counts.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
              3
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Code Examples</h3>
              <p className="text-gray-600">
                Study implementations side-by-side: scratch implementation with detailed comments
                vs Java library usage. Understand both the theory and practice.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 text-orange-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
              4
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Complexity Analysis</h3>
              <p className="text-gray-600">
                See detailed complexity tables with explanations. Understand not just "what"
                the complexity is, but "why" it has that complexity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Special Features</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="font-bold text-gray-800 mb-2">Step-by-Step Animations</h3>
            <p className="text-sm text-gray-600">
              Play, pause, and step through operations. See each iteration with operation counting.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-bold text-gray-800 mb-2">Amortized Analysis</h3>
            <p className="text-sm text-gray-600">
              Unique feature! Visual proof of why array insertion is O(1) amortized with resize demonstration.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-800 mb-2">Real-Time Feedback</h3>
            <p className="text-sm text-gray-600">
              Every operation explains what happened, how many steps it took, and why it has that complexity.
            </p>
          </div>
        </div>
      </div>

      {/* Who This Is For */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Who This Is For</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Students</h3>
            <p className="text-gray-600">
              Learning data structures for the first time? Start with our guided path
              and build understanding through interactive exploration.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Interview Prep</h3>
            <p className="text-gray-600">
              Preparing for technical interviews? Refresh your knowledge and see
              complexity analysis in action.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Developers</h3>
            <p className="text-gray-600">
              Building applications? Learn when to use which data structure and
              understand performance implications.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Educators</h3>
            <p className="text-gray-600">
              Teaching data structures? Use our visualizations in lectures and
              assignments for better student engagement.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
        <p className="text-xl mb-6 opacity-90">
          Follow our guided learning path or jump directly to any topic
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Back to Learning Path
          </Link>
          <Link
            to="/complexity"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Start Learning →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Introduction
