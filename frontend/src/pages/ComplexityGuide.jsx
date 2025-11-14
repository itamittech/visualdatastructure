import React from 'react'
import { Link } from 'react-router-dom'
import ComplexityEducation from '../components/ComplexityEducation'

function ComplexityGuide() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Understanding Complexity</span>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Understanding Time & Space Complexity
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Before diving into data structures, it's crucial to understand how we measure their efficiency.
          This guide will teach you Big O notation, amortized analysis, and how to analyze algorithms.
        </p>
      </div>

      {/* Main Complexity Education */}
      <ComplexityEducation />

      {/* Additional Deep Dive Sections */}
      <div className="mt-8 space-y-6">
        {/* Why Complexity Matters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Why Does Complexity Matter?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-3">In Development</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Predict how code scales with data growth</li>
                <li>✓ Choose optimal data structures</li>
                <li>✓ Identify performance bottlenecks</li>
                <li>✓ Write efficient algorithms</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-800 mb-3">In Interviews</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Analyze your solution's efficiency</li>
                <li>✓ Compare different approaches</li>
                <li>✓ Optimize brute-force solutions</li>
                <li>✓ Demonstrate algorithmic thinking</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Complexities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Common Time Complexities Ranked
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border-l-4 border-green-500 rounded">
              <div>
                <span className="font-bold text-green-700">O(1) - Constant</span>
                <p className="text-sm text-gray-600">Best possible! Array access, hash table lookup</p>
              </div>
              <div className="text-3xl">🚀</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div>
                <span className="font-bold text-blue-700">O(log n) - Logarithmic</span>
                <p className="text-sm text-gray-600">Excellent! Binary search, balanced tree operations</p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <div>
                <span className="font-bold text-yellow-700">O(n) - Linear</span>
                <p className="text-sm text-gray-600">Good. Iterate through array, linked list traversal</p>
              </div>
              <div className="text-3xl">✓</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
              <div>
                <span className="font-bold text-orange-700">O(n log n) - Linearithmic</span>
                <p className="text-sm text-gray-600">Acceptable. Efficient sorting (merge sort, quicksort)</p>
              </div>
              <div className="text-3xl">~</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div>
                <span className="font-bold text-red-700">O(n²) - Quadratic</span>
                <p className="text-sm text-gray-600">Slow! Nested loops, bubble sort. Avoid for large data</p>
              </div>
              <div className="text-3xl">🐌</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-100 border-l-4 border-red-700 rounded">
              <div>
                <span className="font-bold text-red-900">O(2ⁿ) - Exponential</span>
                <p className="text-sm text-gray-600">Very slow! Recursive fibonacci. Only works for tiny inputs</p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </div>
        </div>

        {/* How to Analyze Complexity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            How to Analyze Code Complexity
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Rule 1: Count the loops</h3>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="font-mono text-sm bg-white p-3 rounded border">
                  <div className="text-green-600 mb-1">// O(n) - Single loop</div>
                  <div>for (int i = 0; i &lt; n; i++) &#123;</div>
                  <div className="ml-4">process(arr[i]);</div>
                  <div>&#125;</div>
                </div>
                <div className="font-mono text-sm bg-white p-3 rounded border">
                  <div className="text-red-600 mb-1">// O(n²) - Nested loops</div>
                  <div>for (int i = 0; i &lt; n; i++) &#123;</div>
                  <div className="ml-4">for (int j = 0; j &lt; n; j++) &#123;</div>
                  <div className="ml-8">process(i, j);</div>
                  <div className="ml-4">&#125;</div>
                  <div>&#125;</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Rule 2: Drop constants</h3>
              <div className="text-gray-700">
                <p className="mb-2">O(2n) = O(n), O(500) = O(1), O(n/2) = O(n)</p>
                <p className="text-sm bg-blue-50 p-2 rounded">
                  Why? Big O cares about growth rate, not exact count. 2n and n both grow linearly.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Rule 3: Different inputs = different variables</h3>
              <div className="font-mono text-sm bg-white p-3 rounded border mt-2">
                <div className="text-orange-600 mb-1">// O(a + b) NOT O(n)</div>
                <div>for (int i = 0; i &lt; a.length; i++) &#123; ... &#125;</div>
                <div>for (int j = 0; j &lt; b.length; j++) &#123; ... &#125;</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Rule 4: Drop non-dominant terms</h3>
              <div className="text-gray-700">
                <p className="mb-2">O(n² + n) = O(n²), O(n + log n) = O(n)</p>
                <p className="text-sm bg-blue-50 p-2 rounded">
                  Why? As n grows large, n² dominates n. For n=1000: n²=1,000,000 vs n=1,000.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Questions */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🧠 Test Your Understanding
          </h2>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
              <p className="font-semibold text-gray-800 mb-2">
                Q1: What's the time complexity of finding a specific element in an unsorted array of size n?
              </p>
              <details className="text-gray-600">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                  Click to reveal answer
                </summary>
                <div className="mt-2 p-3 bg-green-50 rounded">
                  <strong>O(n) - Linear time</strong><br/>
                  You must check each element until found. Worst case: element is last or doesn't exist.
                </div>
              </details>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
              <p className="font-semibold text-gray-800 mb-2">
                Q2: If an algorithm runs in O(5n² + 3n + 7), what's the Big O notation?
              </p>
              <details className="text-gray-600">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                  Click to reveal answer
                </summary>
                <div className="mt-2 p-3 bg-green-50 rounded">
                  <strong>O(n²)</strong><br/>
                  Drop constants (5 becomes 1) and drop non-dominant terms (3n and 7 are small compared to n²).
                </div>
              </details>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
              <p className="font-semibold text-gray-800 mb-2">
                Q3: Why is hash table lookup O(1) on average but O(n) worst case?
              </p>
              <details className="text-gray-600">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                  Click to reveal answer
                </summary>
                <div className="mt-2 p-3 bg-green-50 rounded">
                  <strong>O(1) average, O(n) worst case</strong><br/>
                  With a good hash function, elements spread across buckets (O(1)).<br/>
                  Worst case: all elements collide into one bucket, becoming a linear search (O(n)).
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center bg-white rounded-lg shadow-md p-6">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← Back to Learning Path
        </Link>
        <Link
          to="/array"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
        >
          Next: Array Data Structure →
        </Link>
      </div>
    </div>
  )
}

export default ComplexityGuide
