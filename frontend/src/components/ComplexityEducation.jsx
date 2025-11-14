import React from 'react'

/**
 * Educational component that explains complexity with visual demonstrations
 */
function ComplexityEducation() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Understanding Time Complexity
      </h2>

      <div className="space-y-6">
        {/* Big O Explanation */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-blue-600 mb-3">What is Big O Notation?</h3>
          <p className="text-gray-700 mb-3">
            Big O notation describes how the runtime of an algorithm grows as the input size increases.
            It helps us understand the efficiency and scalability of our code.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-3">
              <div className="font-bold text-green-700">O(1) - Constant</div>
              <div className="text-sm text-gray-600 mt-1">
                Always takes the same time, regardless of input size.
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Example: Accessing array[5]
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
              <div className="font-bold text-yellow-700">O(n) - Linear</div>
              <div className="text-sm text-gray-600 mt-1">
                Time grows linearly with input size.
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Example: Searching unsorted array
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-3">
              <div className="font-bold text-red-700">O(n²) - Quadratic</div>
              <div className="text-sm text-gray-600 mt-1">
                Time grows quadratically (nested loops).
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Example: Bubble sort
              </div>
            </div>
          </div>
        </div>

        {/* Amortized Complexity */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-purple-600 mb-3">
            What is Amortized Complexity?
          </h3>
          <p className="text-gray-700 mb-3">
            Amortized analysis averages the cost of operations over a sequence. Some operations
            might be expensive occasionally, but most are cheap, making the average cost low.
          </p>

          <div className="bg-purple-50 rounded p-4 mt-3">
            <div className="font-semibold text-purple-800 mb-2">
              Real-World Example: Dynamic Array Growth
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <strong>Most insertions:</strong> O(1) - Just add to next available slot
              </div>
              <div>
                <strong>Occasional resize:</strong> O(n) - When array is full, create larger array and copy all elements
              </div>
              <div className="bg-white p-2 rounded mt-2 border border-purple-200">
                <strong className="text-purple-700">Amortized O(1):</strong> Even though occasional
                resize is O(n), it happens so rarely that the average cost per insertion is O(1).
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded border border-purple-200">
              <div className="font-semibold mb-2">Visual Example:</div>
              <div className="text-xs text-gray-600 space-y-1 font-mono">
                <div>Insert 1-4: [1][2][3][4] ✓✓✓✓ (4 O(1) operations)</div>
                <div>Insert 5: Need resize! Copy 4 items + insert = 5 operations ⚠️</div>
                <div>Insert 6-8: [1][2][3][4][5][6][7][8] ✓✓✓ (3 O(1) operations)</div>
                <div className="text-purple-700 font-semibold mt-2">
                  Total: 12 operations for 8 insertions = Average 1.5 per insertion ≈ O(1)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Space Complexity */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-green-600 mb-3">Space Complexity</h3>
          <p className="text-gray-700 mb-3">
            Space complexity measures the amount of memory an algorithm uses relative to input size.
          </p>
          <div className="bg-green-50 rounded p-3 text-sm text-gray-700">
            <div><strong>O(1) Space:</strong> Uses fixed amount of extra memory (few variables)</div>
            <div className="mt-2"><strong>O(n) Space:</strong> Needs memory proportional to input size (copy array)</div>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-orange-600 mb-3">Why Does This Matter?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-700 mb-1">Small Data (n = 100)</div>
              <div className="text-gray-600">O(n) and O(n²) seem similar</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Large Data (n = 1,000,000)</div>
              <div className="text-gray-600">O(n) = 1M operations, O(n²) = 1 trillion! 🔥</div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-white rounded text-gray-700">
            <strong>Real Impact:</strong> O(n²) algorithm on 1M records could take days,
            while O(n) takes seconds. Choosing the right data structure matters!
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplexityEducation
