import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function TwoPointersVisualizer() {
  const [activeTab, setActiveTab] = useState('theory')
  const [selectedProblem, setSelectedProblem] = useState('twosum')

  // Two Sum state
  const [twoSumArray, setTwoSumArray] = useState([2, 7, 11, 15, 20])
  const [twoSumTarget, setTwoSumTarget] = useState(9)
  const [twoSumLeft, setTwoSumLeft] = useState(-1)
  const [twoSumRight, setTwoSumRight] = useState(-1)
  const [twoSumResult, setTwoSumResult] = useState(null)
  const [twoSumSteps, setTwoSumSteps] = useState([])
  const [twoSumCurrentStep, setTwoSumCurrentStep] = useState(0)

  // Container With Most Water state
  const [waterHeights, setWaterHeights] = useState([1, 8, 6, 2, 5, 4, 8, 3, 7])
  const [waterLeft, setWaterLeft] = useState(-1)
  const [waterRight, setWaterRight] = useState(-1)
  const [waterMaxArea, setWaterMaxArea] = useState(0)
  const [waterSteps, setWaterSteps] = useState([])
  const [waterCurrentStep, setWaterCurrentStep] = useState(0)

  // Sliding Window - Max Sum state
  const [maxSumArray, setMaxSumArray] = useState([2, 1, 5, 1, 3, 2, 7, 4])
  const [windowSize, setWindowSize] = useState(3)
  const [maxSumWindowStart, setMaxSumWindowStart] = useState(-1)
  const [maxSumResult, setMaxSumResult] = useState(0)
  const [maxSumSteps, setMaxSumSteps] = useState([])
  const [maxSumCurrentStep, setMaxSumCurrentStep] = useState(0)

  // Sliding Window - Longest Substring state
  const [substringInput, setSubstringInput] = useState('abcabcbb')
  const [substringWindowStart, setSubstringWindowStart] = useState(-1)
  const [substringWindowEnd, setSubstringWindowEnd] = useState(-1)
  const [substringMaxLength, setSubstringMaxLength] = useState(0)
  const [substringSteps, setSubstringSteps] = useState([])
  const [substringCurrentStep, setSubstringCurrentStep] = useState(0)

  // Two Sum (Sorted Array) - Two Pointers
  const solveTwoSum = () => {
    const steps = []
    let left = 0
    let right = twoSumArray.length - 1
    let found = false

    steps.push({
      left,
      right,
      sum: twoSumArray[left] + twoSumArray[right],
      description: `Initialize: left=0 (${twoSumArray[left]}), right=${right} (${twoSumArray[right]}), sum=${twoSumArray[left] + twoSumArray[right]}`,
      status: 'exploring'
    })

    while (left < right) {
      const currentSum = twoSumArray[left] + twoSumArray[right]

      if (currentSum === twoSumTarget) {
        steps.push({
          left,
          right,
          sum: currentSum,
          description: `✅ Found! ${twoSumArray[left]} + ${twoSumArray[right]} = ${twoSumTarget}`,
          status: 'found'
        })
        found = true
        setTwoSumResult([left, right])
        break
      } else if (currentSum < twoSumTarget) {
        steps.push({
          left,
          right,
          sum: currentSum,
          description: `Sum ${currentSum} < target ${twoSumTarget}. Move left pointer right to increase sum.`,
          status: 'too-small'
        })
        left++
        if (left < right) {
          steps.push({
            left,
            right,
            sum: twoSumArray[left] + twoSumArray[right],
            description: `Left moved to index ${left} (${twoSumArray[left]}). New sum = ${twoSumArray[left] + twoSumArray[right]}`,
            status: 'exploring'
          })
        }
      } else {
        steps.push({
          left,
          right,
          sum: currentSum,
          description: `Sum ${currentSum} > target ${twoSumTarget}. Move right pointer left to decrease sum.`,
          status: 'too-large'
        })
        right--
        if (left < right) {
          steps.push({
            left,
            right,
            sum: twoSumArray[left] + twoSumArray[right],
            description: `Right moved to index ${right} (${twoSumArray[right]}). New sum = ${twoSumArray[left] + twoSumArray[right]}`,
            status: 'exploring'
          })
        }
      }
    }

    if (!found) {
      steps.push({
        left,
        right,
        sum: 0,
        description: '❌ No solution found.',
        status: 'not-found'
      })
      setTwoSumResult(null)
    }

    setTwoSumSteps(steps)
    setTwoSumCurrentStep(0)
    if (steps.length > 0) {
      setTwoSumLeft(steps[0].left)
      setTwoSumRight(steps[0].right)
    }
  }

  // Container With Most Water
  const solveContainerWithMostWater = () => {
    const steps = []
    let left = 0
    let right = waterHeights.length - 1
    let maxArea = 0

    while (left < right) {
      const height = Math.min(waterHeights[left], waterHeights[right])
      const width = right - left
      const area = height * width

      const isNewMax = area > maxArea
      if (isNewMax) {
        maxArea = area
      }

      steps.push({
        left,
        right,
        height,
        width,
        area,
        maxArea,
        description: `Left=${left} (h=${waterHeights[left]}), Right=${right} (h=${waterHeights[right]}). Area = min(${waterHeights[left]},${waterHeights[right]}) × ${width} = ${area}${isNewMax ? ' 🎉 New max!' : ''}`,
        status: isNewMax ? 'new-max' : 'exploring'
      })

      // Move the pointer with smaller height
      if (waterHeights[left] < waterHeights[right]) {
        left++
      } else {
        right--
      }
    }

    setWaterMaxArea(maxArea)
    setWaterSteps(steps)
    setWaterCurrentStep(0)
    if (steps.length > 0) {
      setWaterLeft(steps[0].left)
      setWaterRight(steps[0].right)
    }
  }

  // Sliding Window - Maximum Sum of Size K
  const solveMaxSumWindow = () => {
    if (windowSize > maxSumArray.length) {
      alert('Window size cannot be larger than array length')
      return
    }

    const steps = []
    let windowSum = 0
    let maxSum = 0

    // Calculate first window
    for (let i = 0; i < windowSize; i++) {
      windowSum += maxSumArray[i]
    }
    maxSum = windowSum

    steps.push({
      windowStart: 0,
      windowEnd: windowSize - 1,
      windowSum,
      maxSum,
      description: `Initial window [0 to ${windowSize - 1}]. Sum = ${windowSum}`,
      status: 'initial'
    })

    // Slide the window
    for (let i = windowSize; i < maxSumArray.length; i++) {
      const removed = maxSumArray[i - windowSize]
      const added = maxSumArray[i]
      windowSum = windowSum - removed + added

      const isNewMax = windowSum > maxSum
      if (isNewMax) {
        maxSum = windowSum
      }

      steps.push({
        windowStart: i - windowSize + 1,
        windowEnd: i,
        windowSum,
        maxSum,
        removed,
        added,
        description: `Remove ${removed}, Add ${added}. Window [${i - windowSize + 1} to ${i}]. Sum = ${windowSum}${isNewMax ? ' 🎉 New max!' : ''}`,
        status: isNewMax ? 'new-max' : 'sliding'
      })
    }

    setMaxSumResult(maxSum)
    setMaxSumSteps(steps)
    setMaxSumCurrentStep(0)
    if (steps.length > 0) {
      setMaxSumWindowStart(steps[0].windowStart)
    }
  }

  // Sliding Window - Longest Substring Without Repeating Characters
  const solveLongestSubstring = () => {
    const steps = []
    const charSet = new Set()
    let left = 0
    let maxLength = 0

    for (let right = 0; right < substringInput.length; right++) {
      const char = substringInput[right]

      // Shrink window while we have duplicate
      while (charSet.has(char)) {
        const removedChar = substringInput[left]
        charSet.delete(removedChar)
        steps.push({
          left,
          right,
          currentChar: char,
          removedChar,
          windowSize: right - left,
          maxLength,
          description: `Duplicate '${char}' found! Remove '${removedChar}' from left. Shrink window.`,
          status: 'shrinking',
          currentSet: new Set(charSet)
        })
        left++
      }

      // Add current character
      charSet.add(char)
      const currentLength = right - left + 1
      const isNewMax = currentLength > maxLength
      if (isNewMax) {
        maxLength = currentLength
      }

      steps.push({
        left,
        right,
        currentChar: char,
        windowSize: currentLength,
        maxLength,
        description: `Add '${char}'. Window: "${substringInput.substring(left, right + 1)}" (length ${currentLength})${isNewMax ? ' 🎉 New max!' : ''}`,
        status: isNewMax ? 'new-max' : 'expanding',
        currentSet: new Set(charSet)
      })
    }

    setSubstringMaxLength(maxLength)
    setSubstringSteps(steps)
    setSubstringCurrentStep(0)
    if (steps.length > 0) {
      setSubstringWindowStart(steps[0].left)
      setSubstringWindowEnd(steps[0].right)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Two Pointers & Sliding Window</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="text-5xl font-bold mb-4">👈👉 Two Pointers & Sliding Window</h1>
        <p className="text-xl opacity-90 mb-4">
          Master the art of optimizing O(n²) solutions to O(n). Essential for 10-15% of FAANG interviews!
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Two Pointers</div>
          </div>
          <div className="text-xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Fixed Window</div>
          </div>
          <div className="text-xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Variable Window</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-6 bg-white rounded-lg shadow p-2">
        {['theory', 'practice', 'code', 'advanced'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab === 'theory' && '📚 Theory'}
            {tab === 'practice' && '🎮 Practice'}
            {tab === 'code' && '💻 Code'}
            {tab === 'advanced' && '🚀 Advanced'}
          </button>
        ))}
      </div>

      {/* Theory Tab */}
      {activeTab === 'theory' && (
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Are Two Pointers & Sliding Window?</h2>
            <p className="text-gray-700 mb-4">
              These are algorithmic patterns that use two pointers to traverse data structures, typically arrays or strings,
              to solve problems in linear time O(n) instead of nested loops O(n²).
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Pattern 1: Two Pointers</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="font-semibold text-blue-900 mb-2">🎯 Core Concept</p>
              <p className="text-gray-700">
                Use two pointers that move through the data structure from different positions. Pointers can move:
                <ul className="list-disc ml-6 mt-2">
                  <li><strong>Opposite directions:</strong> One from start, one from end (Two Sum, Container With Water)</li>
                  <li><strong>Same direction:</strong> Both move forward, often at different speeds (Remove Duplicates, Fast & Slow)</li>
                </ul>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Pattern 2: Sliding Window</h3>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="font-semibold text-green-900 mb-2">🎯 Core Concept</p>
              <p className="text-gray-700">
                Maintain a "window" (subarray/substring) that slides through the data. Two types:
                <ul className="list-disc ml-6 mt-2">
                  <li><strong>Fixed Size:</strong> Window size stays constant, slide by adding right and removing left</li>
                  <li><strong>Variable Size:</strong> Window expands/contracts based on conditions</li>
                </ul>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">When to Use Each Pattern?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">👈👉 Two Pointers (Opposite)</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Sorted array</strong> and finding pairs/triplets</li>
                  <li>• Comparing elements from both ends</li>
                  <li>• Palindrome checking</li>
                  <li>• Container/area problems</li>
                  <li>• Examples: Two Sum, 3Sum, Trapping Rain Water</li>
                </ul>
              </div>

              <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">→→ Two Pointers (Same Direction)</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• In-place array modifications</li>
                  <li>• Removing duplicates</li>
                  <li>• Partitioning arrays</li>
                  <li>• Fast & slow pointer (cycle detection)</li>
                  <li>• Examples: Remove Duplicates, Move Zeros</li>
                </ul>
              </div>

              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">🪟 Sliding Window (Fixed)</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Fixed-size subarray/substring problems</li>
                  <li>• "Maximum/minimum sum of K elements"</li>
                  <li>• "Average of all subarrays of size K"</li>
                  <li>• Window slides one position at a time</li>
                  <li>• Examples: Max Sum Subarray, Moving Average</li>
                </ul>
              </div>

              <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-800 mb-2">🪟 Sliding Window (Variable)</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• "Longest/shortest substring with condition"</li>
                  <li>• Dynamic window size based on constraints</li>
                  <li>• Often uses HashMap/Set for tracking</li>
                  <li>• Expand window (right++), contract when needed (left++)</li>
                  <li>• Examples: Longest Substring, Minimum Window</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Time & Space Complexity</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Pattern</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Space</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Why?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Two Pointers (Opposite)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(1)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">One pass, pointers meet in middle</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Two Pointers (Same)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(1)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">One pass, each element visited once</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Sliding Window (Fixed)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(1)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">Slide window n-k times</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Sliding Window (Variable)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(k)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">O(k) for HashMap/Set, k = unique chars</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">💡 Key Insights</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>The Magic:</strong> Reduces O(n²) brute force to O(n) by avoiding nested loops</li>
              <li>• <strong>Two Pointers:</strong> Works best on sorted data or when comparing from both ends</li>
              <li>• <strong>Sliding Window:</strong> Perfect for contiguous subarray/substring problems</li>
              <li>• <strong>Space Efficiency:</strong> Usually O(1) space, sometimes O(k) for tracking window contents</li>
              <li>• <strong>Recognition:</strong> Keywords like "subarray", "substring", "pairs", "palindrome" are hints</li>
            </ul>
          </div>
        </div>
      )}

      {/* Practice Tab */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Interactive Problems</h2>

          {/* Problem Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => setSelectedProblem('twosum')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'twosum'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Two Sum
            </button>
            <button
              onClick={() => setSelectedProblem('container')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'container'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Container
            </button>
            <button
              onClick={() => setSelectedProblem('maxsum')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'maxsum'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Max Sum
            </button>
            <button
              onClick={() => setSelectedProblem('substring')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'substring'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Longest Substring
            </button>
          </div>

          {/* Two Sum Problem */}
          {selectedProblem === 'twosum' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Two Sum (Sorted Array)</h3>
                <p className="text-gray-700 mb-2">
                  Given a sorted array, find two numbers that add up to a target value.
                  Use two pointers from opposite ends.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Pattern:</strong> Two Pointers (Opposite Direction) • <strong>Time:</strong> O(n) • <strong>Space:</strong> O(1)
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700">Target:</label>
                <input
                  type="number"
                  value={twoSumTarget}
                  onChange={(e) => setTwoSumTarget(parseInt(e.target.value) || 0)}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-24"
                />
                <button
                  onClick={solveTwoSum}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Solve
                </button>
              </div>

              {/* Array Visualization */}
              <div className="flex justify-center items-end space-x-2 py-4">
                {twoSumArray.map((num, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded font-bold text-lg border-2 ${
                        idx === twoSumLeft && idx === twoSumRight
                          ? 'bg-purple-500 text-white border-purple-700'
                          : idx === twoSumLeft
                          ? 'bg-blue-500 text-white border-blue-700'
                          : idx === twoSumRight
                          ? 'bg-green-500 text-white border-green-700'
                          : 'bg-gray-200 text-gray-700 border-gray-400'
                      }`}
                    >
                      {num}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{idx}</div>
                    {idx === twoSumLeft && (
                      <div className="text-xs font-bold text-blue-600 mt-1">👈 L</div>
                    )}
                    {idx === twoSumRight && (
                      <div className="text-xs font-bold text-green-600 mt-1">R 👉</div>
                    )}
                  </div>
                ))}
              </div>

              {twoSumSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => {
                        const newStep = Math.max(0, twoSumCurrentStep - 1)
                        setTwoSumCurrentStep(newStep)
                        setTwoSumLeft(twoSumSteps[newStep].left)
                        setTwoSumRight(twoSumSteps[newStep].right)
                      }}
                      disabled={twoSumCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {twoSumCurrentStep + 1} of {twoSumSteps.length}
                    </span>
                    <button
                      onClick={() => {
                        const newStep = Math.min(twoSumSteps.length - 1, twoSumCurrentStep + 1)
                        setTwoSumCurrentStep(newStep)
                        setTwoSumLeft(twoSumSteps[newStep].left)
                        setTwoSumRight(twoSumSteps[newStep].right)
                      }}
                      disabled={twoSumCurrentStep === twoSumSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  {twoSumSteps[twoSumCurrentStep] && (
                    <div className={`p-4 rounded border-2 ${
                      twoSumSteps[twoSumCurrentStep].status === 'found'
                        ? 'bg-green-50 border-green-300'
                        : twoSumSteps[twoSumCurrentStep].status === 'too-small'
                        ? 'bg-yellow-50 border-yellow-300'
                        : twoSumSteps[twoSumCurrentStep].status === 'too-large'
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}>
                      <div className="text-gray-800">{twoSumSteps[twoSumCurrentStep].description}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Container With Most Water Problem */}
          {selectedProblem === 'container' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Container With Most Water</h3>
                <p className="text-gray-700 mb-2">
                  Find two lines that together with the x-axis form a container with the maximum water area.
                  Area = min(height[left], height[right]) × (right - left).
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Pattern:</strong> Two Pointers (Opposite Direction) • <strong>Time:</strong> O(n) • <strong>Space:</strong> O(1)
                </p>
              </div>

              <button
                onClick={solveContainerWithMostWater}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
              >
                Solve
              </button>

              {/* Heights Visualization */}
              <div className="flex justify-center items-end space-x-2 py-4" style={{minHeight: '250px'}}>
                {waterHeights.map((height, idx) => (
                  <div key={idx} className="flex flex-col items-end justify-end">
                    <div
                      className={`w-12 flex items-end justify-center border-2 transition-all ${
                        idx === waterLeft || idx === waterRight
                          ? 'bg-blue-400 border-blue-700'
                          : 'bg-gray-300 border-gray-500'
                      }`}
                      style={{height: `${height * 25}px`}}
                    >
                      <span className="text-xs font-bold pb-1">{height}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{idx}</div>
                  </div>
                ))}
              </div>

              {waterSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-300 rounded p-3">
                    <div className="text-green-800 font-bold">Max Area: {waterMaxArea}</div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => {
                        const newStep = Math.max(0, waterCurrentStep - 1)
                        setWaterCurrentStep(newStep)
                        setWaterLeft(waterSteps[newStep].left)
                        setWaterRight(waterSteps[newStep].right)
                      }}
                      disabled={waterCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {waterCurrentStep + 1} of {waterSteps.length}
                    </span>
                    <button
                      onClick={() => {
                        const newStep = Math.min(waterSteps.length - 1, waterCurrentStep + 1)
                        setWaterCurrentStep(newStep)
                        setWaterLeft(waterSteps[newStep].left)
                        setWaterRight(waterSteps[newStep].right)
                      }}
                      disabled={waterCurrentStep === waterSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  {waterSteps[waterCurrentStep] && (
                    <div className={`p-4 rounded border-2 ${
                      waterSteps[waterCurrentStep].status === 'new-max'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}>
                      <div className="text-gray-800">{waterSteps[waterCurrentStep].description}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Maximum Sum Subarray (Fixed Window) */}
          {selectedProblem === 'maxsum' && (
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h3 className="font-bold text-green-900 mb-2">Problem: Maximum Sum Subarray of Size K</h3>
                <p className="text-gray-700 mb-2">
                  Find the maximum sum of any contiguous subarray of size K. Use a sliding window of fixed size.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Pattern:</strong> Sliding Window (Fixed Size) • <strong>Time:</strong> O(n) • <strong>Space:</strong> O(1)
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700">Window Size K:</label>
                <input
                  type="number"
                  value={windowSize}
                  onChange={(e) => setWindowSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-24"
                  min="1"
                  max={maxSumArray.length}
                />
                <button
                  onClick={solveMaxSumWindow}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Solve
                </button>
              </div>

              {/* Array Visualization */}
              <div className="flex justify-center items-end space-x-2 py-4">
                {maxSumArray.map((num, idx) => {
                  const isInWindow = maxSumWindowStart !== -1 && idx >= maxSumWindowStart && idx < maxSumWindowStart + windowSize
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-14 h-14 flex items-center justify-center rounded font-bold text-lg border-2 ${
                          isInWindow
                            ? 'bg-green-500 text-white border-green-700'
                            : 'bg-gray-200 text-gray-700 border-gray-400'
                        }`}
                      >
                        {num}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{idx}</div>
                    </div>
                  )
                })}
              </div>

              {maxSumSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-300 rounded p-3">
                    <div className="text-green-800 font-bold">Maximum Sum: {maxSumResult}</div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => {
                        const newStep = Math.max(0, maxSumCurrentStep - 1)
                        setMaxSumCurrentStep(newStep)
                        setMaxSumWindowStart(maxSumSteps[newStep].windowStart)
                      }}
                      disabled={maxSumCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {maxSumCurrentStep + 1} of {maxSumSteps.length}
                    </span>
                    <button
                      onClick={() => {
                        const newStep = Math.min(maxSumSteps.length - 1, maxSumCurrentStep + 1)
                        setMaxSumCurrentStep(newStep)
                        setMaxSumWindowStart(maxSumSteps[newStep].windowStart)
                      }}
                      disabled={maxSumCurrentStep === maxSumSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  {maxSumSteps[maxSumCurrentStep] && (
                    <div className={`p-4 rounded border-2 ${
                      maxSumSteps[maxSumCurrentStep].status === 'new-max'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}>
                      <div className="text-gray-800">{maxSumSteps[maxSumCurrentStep].description}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Longest Substring Without Repeating Characters */}
          {selectedProblem === 'substring' && (
            <div className="space-y-6">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                <h3 className="font-bold text-orange-900 mb-2">Problem: Longest Substring Without Repeating Characters</h3>
                <p className="text-gray-700 mb-2">
                  Find the length of the longest substring without repeating characters. Use a variable-size sliding window.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Pattern:</strong> Sliding Window (Variable Size) • <strong>Time:</strong> O(n) • <strong>Space:</strong> O(k) for HashSet
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={substringInput}
                  onChange={(e) => setSubstringInput(e.target.value)}
                  className="border-2 border-gray-300 rounded px-4 py-2 flex-1"
                  placeholder="Enter string..."
                />
                <button
                  onClick={solveLongestSubstring}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Solve
                </button>
              </div>

              {/* String Visualization */}
              <div className="flex justify-center items-center space-x-1 py-4 flex-wrap">
                {substringInput.split('').map((char, idx) => {
                  const isInWindow = substringWindowStart !== -1 && substringWindowEnd !== -1 &&
                                    idx >= substringWindowStart && idx <= substringWindowEnd
                  return (
                    <div key={idx} className="flex flex-col items-center m-1">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded font-bold text-lg border-2 ${
                          isInWindow
                            ? 'bg-orange-500 text-white border-orange-700'
                            : 'bg-gray-200 text-gray-700 border-gray-400'
                        }`}
                      >
                        {char}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{idx}</div>
                    </div>
                  )
                })}
              </div>

              {substringSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-300 rounded p-3">
                    <div className="text-green-800 font-bold">Maximum Length: {substringMaxLength}</div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => {
                        const newStep = Math.max(0, substringCurrentStep - 1)
                        setSubstringCurrentStep(newStep)
                        setSubstringWindowStart(substringSteps[newStep].left)
                        setSubstringWindowEnd(substringSteps[newStep].right)
                      }}
                      disabled={substringCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {substringCurrentStep + 1} of {substringSteps.length}
                    </span>
                    <button
                      onClick={() => {
                        const newStep = Math.min(substringSteps.length - 1, substringCurrentStep + 1)
                        setSubstringCurrentStep(newStep)
                        setSubstringWindowStart(substringSteps[newStep].left)
                        setSubstringWindowEnd(substringSteps[newStep].right)
                      }}
                      disabled={substringCurrentStep === substringSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  {substringSteps[substringCurrentStep] && (
                    <div className={`p-4 rounded border-2 ${
                      substringSteps[substringCurrentStep].status === 'new-max'
                        ? 'bg-green-50 border-green-300'
                        : substringSteps[substringCurrentStep].status === 'shrinking'
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}>
                      <div className="text-gray-800">{substringSteps[substringCurrentStep].description}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Code Tab */}
      {activeTab === 'code' && (
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Code Implementations</h2>

          {/* Two Sum Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Two Sum (Two Pointers - Opposite)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Two Sum on sorted array using two pointers
public int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;

    while (left < right) {
        int sum = numbers[left] + numbers[right];

        if (sum == target) {
            return new int[]{left, right};  // Found!
        } else if (sum < target) {
            left++;   // Need larger sum, move left pointer right
        } else {
            right--;  // Need smaller sum, move right pointer left
        }
    }

    return new int[]{-1, -1};  // No solution
}

// Time: O(n) - single pass, pointers meet in middle
// Space: O(1) - only two pointers`}
              </pre>
            </div>
          </div>

          {/* Container With Most Water Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">2. Container With Most Water</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Container with most water
public int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int maxArea = 0;

    while (left < right) {
        // Area = min height × width
        int h = Math.min(height[left], height[right]);
        int width = right - left;
        int area = h * width;

        maxArea = Math.max(maxArea, area);

        // Move the pointer with smaller height
        // (moving the taller one won't increase area)
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
}

// Time: O(n) - single pass
// Space: O(1)
// Key insight: Always move the shorter line inward`}
              </pre>
            </div>
          </div>

          {/* Sliding Window - Fixed Size */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">3. Maximum Sum Subarray of Size K (Fixed Window)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Sliding window with fixed size
public int maxSumSubarray(int[] arr, int k) {
    if (arr.length < k) return -1;

    // Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    int maxSum = windowSum;

    // Slide the window: remove left, add right
    for (int i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
}

// Time: O(n) - one pass through array
// Space: O(1)
// Pattern: Remove left element, add right element, update max`}
              </pre>
            </div>
          </div>

          {/* Sliding Window - Variable Size */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">4. Longest Substring Without Repeating (Variable Window)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Sliding window with variable size
public int lengthOfLongestSubstring(String s) {
    Set<Character> window = new HashSet<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        char currentChar = s.charAt(right);

        // Shrink window while we have duplicate
        while (window.contains(currentChar)) {
            window.remove(s.charAt(left));
            left++;
        }

        // Add current character to window
        window.add(currentChar);

        // Update max length
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// Time: O(n) - each char visited at most twice (once by right, once by left)
// Space: O(k) - k = size of character set in window
// Pattern: Expand window (right++), shrink when constraint violated (left++)`}
              </pre>
            </div>
          </div>

          {/* Remove Duplicates - Same Direction */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">5. Remove Duplicates (Two Pointers - Same Direction)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Two pointers moving in same direction
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;

    int slow = 0;  // Position for next unique element

    for (int fast = 1; fast < nums.length; fast++) {
        // Found a new unique element
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }

    return slow + 1;  // Length of unique elements
}

// Time: O(n) - single pass
// Space: O(1) - in-place modification
// Pattern: Slow pointer tracks write position, fast pointer explores`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Advanced Concepts</h2>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">More Classic Problems</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">🎯 3Sum / 4Sum</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find triplets/quadruplets that sum to target. Use two pointers inside outer loop(s).
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Pattern: Sort + Two Pointers<br/>
                  Time: O(n²) for 3Sum, O(n³) for 4Sum
                </div>
              </div>

              <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">💧 Trapping Rain Water</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Calculate water trapped between bars using two pointers from both ends.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Pattern: Two Pointers (Opposite)<br/>
                  Time: O(n), Space: O(1)
                </div>
              </div>

              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">🪟 Minimum Window Substring</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find smallest substring containing all characters of target string.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Pattern: Sliding Window (Variable)<br/>
                  Time: O(m + n), Space: O(k) HashMap
                </div>
              </div>

              <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-800 mb-2">📊 Sliding Window Maximum</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find maximum in each sliding window of size K. Use deque for O(n) solution.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Pattern: Sliding Window + Deque<br/>
                  Time: O(n), Space: O(k)
                </div>
              </div>

              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">🔤 Permutation in String</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Check if one string contains permutation of another using fixed window.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Pattern: Sliding Window (Fixed) + HashMap<br/>
                  Time: O(n), Space: O(26) = O(1)
                </div>
              </div>

              <div className="border-2 border-pink-200 bg-pink-50 rounded-lg p-4">
                <h4 className="font-bold text-pink-800 mb-2">🎯 Subarray Sum Equals K</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Count subarrays with sum K. Use prefix sum with HashMap (not pure sliding window).
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Pattern: Prefix Sum + HashMap<br/>
                  Time: O(n), Space: O(n)
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Decision Tree: Which Pattern to Use?</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-300">
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="font-bold text-blue-700 w-32">Is array sorted?</div>
                  <div className="text-gray-700">
                    <strong>YES →</strong> Two Pointers (Opposite) for pair/triplet problems<br/>
                    <strong>NO →</strong> Consider sorting first, or use Sliding Window
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="font-bold text-green-700 w-32">Fixed size?</div>
                  <div className="text-gray-700">
                    <strong>YES →</strong> Sliding Window (Fixed) - Max/min sum of K elements<br/>
                    <strong>NO →</strong> Sliding Window (Variable) - Longest/shortest with condition
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="font-bold text-purple-700 w-32">In-place modify?</div>
                  <div className="text-gray-700">
                    <strong>YES →</strong> Two Pointers (Same Direction) - Remove duplicates, move zeros
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="font-bold text-orange-700 w-32">Substring problem?</div>
                  <div className="text-gray-700">
                    <strong>Longest/shortest →</strong> Sliding Window (Variable) + HashMap/Set<br/>
                    <strong>Contains permutation →</strong> Sliding Window (Fixed) + character frequency
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🎯 Interview Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Keywords to recognize:</strong> "subarray", "substring", "pairs", "contiguous", "window"</li>
              <li>• <strong>Brute force first:</strong> Explain O(n²) nested loop solution, then optimize to O(n)</li>
              <li>• <strong>Two Pointers:</strong> When to move left vs right? Think about what you're trying to achieve</li>
              <li>• <strong>Sliding Window:</strong> Always clarify if window size is fixed or variable</li>
              <li>• <strong>Edge cases:</strong> Empty array, single element, all same elements, window larger than array</li>
              <li>• <strong>Practice pattern recognition:</strong> After solving, identify which pattern you used</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Common Interview Questions by Company</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Google:</strong> Container With Most Water, Minimum Window Substring, Longest Substring Without Repeating</li>
                <li>• <strong>Facebook/Meta:</strong> 3Sum, Subarray Sum Equals K, Longest Repeating Character Replacement</li>
                <li>• <strong>Amazon:</strong> Two Sum variants, Fruit Into Baskets, Max Consecutive Ones</li>
                <li>• <strong>Microsoft:</strong> Sliding Window Maximum, Permutation in String, Longest Substring with K Distinct</li>
                <li>• <strong>Apple:</strong> Trapping Rain Water, Move Zeros, Remove Duplicates from Sorted Array</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ Common Mistakes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Forgetting to check if array is sorted before using two pointers (opposite direction)</li>
              <li>• Moving both pointers simultaneously instead of based on condition</li>
              <li>• Not handling edge case when window size &gt; array length</li>
              <li>• Forgetting to update max/min after expanding or shrinking window</li>
              <li>• Using nested loops when a single pass with two pointers/window would work</li>
              <li>• Not tracking window contents properly in variable-size window (use HashMap/Set!)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default TwoPointersVisualizer
