import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function BitManipulationVisualizer() {
  const [activeTab, setActiveTab] = useState('theory')
  const [selectedProblem, setSelectedProblem] = useState('single')

  // Single Number state
  const [singleArray, setSingleArray] = useState([4, 1, 2, 1, 2])
  const [singleSteps, setSingleSteps] = useState([])
  const [singleCurrentStep, setSingleCurrentStep] = useState(0)
  const [singleResult, setSingleResult] = useState(null)

  // Power of Two state
  const [powerNum, setPowerNum] = useState(16)
  const [isPowerOfTwo, setIsPowerOfTwo] = useState(null)
  const [powerExplanation, setPowerExplanation] = useState('')

  // Counting Bits state
  const [countingN, setCountingN] = useState(5)
  const [countingBits, setCountingBits] = useState([])

  // Reverse Bits state
  const [reverseNum, setReverseNum] = useState(43261596)
  const [reversedNum, setReversedNum] = useState(null)

  // Helper: Convert number to binary string (32-bit)
  const toBinary = (num, bits = 32) => {
    return (num >>> 0).toString(2).padStart(bits, '0')
  }

  // Helper: Highlight bits
  const renderBinaryWithHighlight = (binary, highlightIndices = []) => {
    return (
      <div className="flex font-mono text-sm">
        {binary.split('').map((bit, idx) => (
          <span
            key={idx}
            className={`px-1 ${
              highlightIndices.includes(idx)
                ? 'bg-yellow-300 font-bold'
                : bit === '1'
                ? 'text-blue-600 font-semibold'
                : 'text-gray-400'
            }`}
          >
            {bit}
          </span>
        ))}
      </div>
    )
  }

  // Single Number solver (XOR all elements)
  const solveSingleNumber = () => {
    const steps = []
    let result = 0

    steps.push({
      current: 0,
      binary: toBinary(0, 8),
      description: 'Start with result = 0'
    })

    for (let i = 0; i < singleArray.length; i++) {
      const num = singleArray[i]
      const prevResult = result
      result ^= num

      steps.push({
        current: num,
        prevResult,
        result,
        binaryNum: toBinary(num, 8),
        binaryPrev: toBinary(prevResult, 8),
        binaryResult: toBinary(result, 8),
        description: `XOR with ${num}: ${prevResult} ^ ${num} = ${result}`
      })
    }

    steps.push({
      result,
      binary: toBinary(result, 8),
      description: `✅ Single number is ${result}! (All pairs cancelled out via XOR)`
    })

    setSingleResult(result)
    setSingleSteps(steps)
    setSingleCurrentStep(0)
  }

  // Power of Two checker
  const checkPowerOfTwo = () => {
    const isPower = powerNum > 0 && (powerNum & (powerNum - 1)) === 0
    setIsPowerOfTwo(isPower)

    const binary = toBinary(powerNum, 8)
    const binaryMinus1 = toBinary(powerNum - 1, 8)
    const andResult = toBinary(powerNum & (powerNum - 1), 8)

    const explanation = `
n = ${powerNum}: ${binary}
n - 1 = ${powerNum - 1}: ${binaryMinus1}
n & (n - 1) = ${andResult}

${isPower
  ? `✅ Power of 2! Notice: n has only ONE bit set, n-1 flips all bits after that bit. AND gives 0.`
  : `❌ Not power of 2! n has multiple bits set, so n & (n-1) ≠ 0.`
}
    `
    setPowerExplanation(explanation)
  }

  // Counting Bits (0 to n)
  const solveCountingBits = () => {
    const result = []
    for (let i = 0; i <= countingN; i++) {
      const count = i.toString(2).split('1').length - 1
      result.push({
        num: i,
        binary: toBinary(i, 8),
        count
      })
    }
    setCountingBits(result)
  }

  // Reverse Bits
  const solveReverseBits = () => {
    let result = 0
    let n = reverseNum

    for (let i = 0; i < 32; i++) {
      result = (result << 1) | (n & 1)
      n >>>= 1
    }

    setReversedNum(result >>> 0)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Bit Manipulation</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="text-5xl font-bold mb-4">⚡ Bit Manipulation</h1>
        <p className="text-xl opacity-90 mb-4">
          Master low-level bitwise operations! Essential for 2-3% of FAANG interviews and optimization problems.
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">AND &</div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">OR |</div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">XOR ^</div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">NOT ~</div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Shifts {'<<'}  {'>>'}</div>
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
                ? 'bg-indigo-600 text-white'
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What is Bit Manipulation?</h2>
            <p className="text-gray-700 mb-4">
              Bit manipulation involves directly working with individual bits in binary representations of numbers.
              It's used for optimization, low-level programming, and clever algorithmic tricks.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Basic Bitwise Operations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Operation</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Symbol</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">AND</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono">&</td>
                    <td className="border border-gray-300 px-4 py-2">Both bits must be 1</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 & 1100 = 1000</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">OR</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono">|</td>
                    <td className="border border-gray-300 px-4 py-2">At least one bit is 1</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 | 1100 = 1110</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">XOR</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono">^</td>
                    <td className="border border-gray-300 px-4 py-2">Bits are different</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 ^ 1100 = 0110</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">NOT</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono">~</td>
                    <td className="border border-gray-300 px-4 py-2">Flip all bits</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">~1010 = 0101 (in 4-bit)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Left Shift</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono">{'<<'}</td>
                    <td className="border border-gray-300 px-4 py-2">Shift bits left, multiply by 2</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 {'<<'} 1 = 10100</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Right Shift</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono">{'>>'}</td>
                    <td className="border border-gray-300 px-4 py-2">Shift bits right, divide by 2</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 {'>> '}1 = 0101</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Common Bit Tricks</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-800 mb-1">Check if i-th bit is set</h4>
                <p className="font-mono text-sm text-gray-700">if (n & (1 {'<<'} i)) != 0</p>
                <p className="text-xs text-gray-600 mt-1">Create mask with 1 at position i, AND with n</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-800 mb-1">Set i-th bit to 1</h4>
                <p className="font-mono text-sm text-gray-700">n | (1 {'<<'} i)</p>
                <p className="text-xs text-gray-600 mt-1">OR with mask to set bit</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-800 mb-1">Clear i-th bit (set to 0)</h4>
                <p className="font-mono text-sm text-gray-700">n & ~(1 {'<<'} i)</p>
                <p className="text-xs text-gray-600 mt-1">AND with inverted mask</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-800 mb-1">Toggle i-th bit</h4>
                <p className="font-mono text-sm text-gray-700">n ^ (1 {'<<'} i)</p>
                <p className="text-xs text-gray-600 mt-1">XOR with mask to flip bit</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-bold text-red-800 mb-1">Clear rightmost 1 bit</h4>
                <p className="font-mono text-sm text-gray-700">n & (n - 1)</p>
                <p className="text-xs text-gray-600 mt-1">Used for counting bits, power of 2 check</p>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
                <h4 className="font-bold text-pink-800 mb-1">Get rightmost 1 bit</h4>
                <p className="font-mono text-sm text-gray-700">n & (-n)</p>
                <p className="text-xs text-gray-600 mt-1">Isolate the rightmost set bit</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">XOR Properties (Magic!)</h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>a ^ a = 0</strong> (number XOR itself is 0)</li>
                <li>• <strong>a ^ 0 = a</strong> (number XOR 0 is itself)</li>
                <li>• <strong>a ^ b ^ a = b</strong> (commutative and associative)</li>
                <li>• <strong>XOR all duplicates → 0</strong> (pairs cancel out)</li>
                <li>• Perfect for finding single number in array of duplicates!</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">💡 Key Insights</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Space efficient:</strong> Use bits instead of boolean arrays (32x smaller!)</li>
              <li>• <strong>Fast operations:</strong> Bitwise ops are CPU-level, extremely fast</li>
              <li>• <strong>Power of 2:</strong> Only one bit set. Check: n & (n-1) == 0</li>
              <li>• <strong>Counting bits:</strong> Brian Kernighan's algorithm: n & (n-1) until 0</li>
              <li>• <strong>Sign bit:</strong> MSB is 1 for negative numbers (two's complement)</li>
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
              onClick={() => setSelectedProblem('single')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'single'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Single Number
            </button>
            <button
              onClick={() => setSelectedProblem('power')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'power'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Power of Two
            </button>
            <button
              onClick={() => setSelectedProblem('counting')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'counting'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Counting Bits
            </button>
            <button
              onClick={() => setSelectedProblem('reverse')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'reverse'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Reverse Bits
            </button>
          </div>

          {/* Single Number Problem */}
          {selectedProblem === 'single' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Single Number (LeetCode 136)</h3>
                <p className="text-gray-700 mb-2">
                  Given array where every element appears twice except one. Find the single element.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Bit Trick:</strong> XOR all numbers. Duplicates cancel out (a ^ a = 0), leaving single number!
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700">Array: {JSON.stringify(singleArray)}</label>
                <button
                  onClick={solveSingleNumber}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Solve
                </button>
              </div>

              {singleResult !== null && (
                <div className="bg-green-50 border border-green-300 rounded p-3">
                  <div className="text-green-800 font-bold">
                    ✅ Single Number: {singleResult}
                  </div>
                </div>
              )}

              {singleSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setSingleCurrentStep(Math.max(0, singleCurrentStep - 1))}
                      disabled={singleCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {singleCurrentStep + 1} of {singleSteps.length}
                    </span>
                    <button
                      onClick={() => setSingleCurrentStep(Math.min(singleSteps.length - 1, singleCurrentStep + 1))}
                      disabled={singleCurrentStep === singleSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-300">
                    <div className="text-gray-800 mb-3">{singleSteps[singleCurrentStep]?.description}</div>
                    {singleSteps[singleCurrentStep]?.binaryResult && (
                      <div className="space-y-2 text-sm">
                        <div>Previous: {renderBinaryWithHighlight(singleSteps[singleCurrentStep].binaryPrev)}</div>
                        <div>Current:  {renderBinaryWithHighlight(singleSteps[singleCurrentStep].binaryNum)}</div>
                        <div className="font-bold">Result:   {renderBinaryWithHighlight(singleSteps[singleCurrentStep].binaryResult)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Power of Two Problem */}
          {selectedProblem === 'power' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Power of Two (LeetCode 231)</h3>
                <p className="text-gray-700 mb-2">
                  Check if a number is a power of 2.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Bit Trick:</strong> Power of 2 has exactly ONE bit set. Check: n & (n-1) == 0
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700">Number:</label>
                <input
                  type="number"
                  value={powerNum}
                  onChange={(e) => setPowerNum(parseInt(e.target.value) || 0)}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-32"
                />
                <button
                  onClick={checkPowerOfTwo}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Check
                </button>
              </div>

              {isPowerOfTwo !== null && (
                <div>
                  <div className={`p-4 rounded border-2 mb-4 ${
                    isPowerOfTwo
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                  }`}>
                    <div className={`font-bold ${isPowerOfTwo ? 'text-green-800' : 'text-red-800'}`}>
                      {isPowerOfTwo ? '✅ Yes, power of 2!' : '❌ No, not a power of 2'}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-300">
                    <pre className="text-sm whitespace-pre-wrap">{powerExplanation}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Counting Bits Problem */}
          {selectedProblem === 'counting' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Counting Bits (LeetCode 338)</h3>
                <p className="text-gray-700 mb-2">
                  For every number from 0 to n, count number of 1s in binary representation.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Bit Trick:</strong> count[i] = count[i {'>> '}1] + (i & 1) - use previous results!
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700">n:</label>
                <input
                  type="number"
                  value={countingN}
                  onChange={(e) => setCountingN(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-24"
                  min="0"
                  max="15"
                />
                <button
                  onClick={solveCountingBits}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Count
                </button>
              </div>

              {countingBits.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">Number</th>
                        <th className="border border-gray-300 px-4 py-2">Binary</th>
                        <th className="border border-gray-300 px-4 py-2">Count of 1s</th>
                      </tr>
                    </thead>
                    <tbody>
                      {countingBits.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{item.num}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-mono text-sm">
                            {item.binary}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold text-blue-600">
                            {item.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Reverse Bits Problem */}
          {selectedProblem === 'reverse' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Reverse Bits (LeetCode 190)</h3>
                <p className="text-gray-700 mb-2">
                  Reverse bits of a 32-bit unsigned integer.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Bit Trick:</strong> Extract LSB, shift result left, OR with extracted bit. Repeat 32 times.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700">Number:</label>
                <input
                  type="number"
                  value={reverseNum}
                  onChange={(e) => setReverseNum(parseInt(e.target.value) || 0)}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-40"
                />
                <button
                  onClick={solveReverseBits}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Reverse
                </button>
              </div>

              {reversedNum !== null && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-300 rounded p-3">
                    <div className="text-green-800 font-bold">
                      ✅ Reversed: {reversedNum}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-300">
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Original ({reverseNum}):</div>
                        {renderBinaryWithHighlight(toBinary(reverseNum, 32))}
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Reversed ({reversedNum}):</div>
                        {renderBinaryWithHighlight(toBinary(reversedNum, 32))}
                      </div>
                    </div>
                  </div>
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

          {/* Single Number Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Single Number (LeetCode 136)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Find single number using XOR
public int singleNumber(int[] nums) {
    int result = 0;

    // XOR all numbers
    for (int num : nums) {
        result ^= num;
    }

    return result;
}

// Why it works:
// - a ^ a = 0 (number XOR itself is 0)
// - a ^ 0 = a (number XOR 0 is itself)
// - XOR is commutative and associative
// - All pairs cancel out: [4,1,2,1,2] -> 4^1^2^1^2 -> 4^(1^1)^(2^2) -> 4^0^0 -> 4

// Time: O(n) - single pass
// Space: O(1)`}
              </pre>
            </div>
          </div>

          {/* Power of Two Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">2. Power of Two (LeetCode 231)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Check if power of 2
public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

// Why it works:
// Power of 2 has exactly ONE bit set:
//   16 = 10000
//   15 = 01111
//   16 & 15 = 00000
//
// Non-power has multiple bits:
//   12 = 1100
//   11 = 1011
//   12 & 11 = 1000 (not 0!)

// Time: O(1)
// Space: O(1)`}
              </pre>
            </div>
          </div>

          {/* Counting Bits Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">3. Counting Bits (LeetCode 338)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Count bits from 0 to n
public int[] countBits(int n) {
    int[] result = new int[n + 1];

    for (int i = 1; i <= n; i++) {
        // DP: count[i] = count[i >> 1] + (i & 1)
        // i >> 1 removes rightmost bit
        // i & 1 checks if rightmost bit is 1
        result[i] = result[i >> 1] + (i & 1);
    }

    return result;
}

// Alternative: Brian Kernighan's algorithm
public int countOnes(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);  // Clear rightmost 1 bit
        count++;
    }
    return count;
}

// Time: O(n) for array, O(k) for single number (k = bits set)
// Space: O(1) auxiliary`}
              </pre>
            </div>
          </div>

          {/* Number of 1 Bits Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">4. Number of 1 Bits (Hamming Weight)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Count 1 bits in integer
public int hammingWeight(int n) {
    int count = 0;

    while (n != 0) {
        count += (n & 1);  // Check if LSB is 1
        n >>>= 1;          // Unsigned right shift
    }

    return count;
}

// Alternative: Brian Kernighan's (faster)
public int hammingWeightFast(int n) {
    int count = 0;

    while (n != 0) {
        n &= (n - 1);  // Clear rightmost 1 bit
        count++;
    }

    return count;
}

// Time: O(32) = O(1) for first, O(k) for second (k = bits set)
// Space: O(1)`}
              </pre>
            </div>
          </div>

          {/* Reverse Bits Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">5. Reverse Bits (LeetCode 190)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Reverse bits of 32-bit integer
public int reverseBits(int n) {
    int result = 0;

    for (int i = 0; i < 32; i++) {
        result <<= 1;       // Shift result left
        result |= (n & 1);  // Add LSB of n
        n >>>= 1;           // Shift n right
    }

    return result;
}

// Step-by-step for n=5 (00000101):
// i=0: result=0, add 1 -> result=1
// i=1: result=2, add 0 -> result=2
// i=2: result=4, add 1 -> result=5
// ...continue for 32 bits

// Time: O(1) - fixed 32 iterations
// Space: O(1)`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Advanced Bit Manipulation</h2>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">More Classic Problems</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">🔢 Single Number II</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Every element appears 3 times except one. Use bit counting mod 3.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n), Space: O(1)<br/>
                  LeetCode 137
                </div>
              </div>

              <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">📊 Single Number III</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Two elements appear once, rest twice. Use XOR then partition by different bit.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n), Space: O(1)<br/>
                  LeetCode 260
                </div>
              </div>

              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">🎭 Missing Number</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find missing number in [0, n]. XOR all indices and values.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n), Space: O(1)<br/>
                  LeetCode 268
                </div>
              </div>

              <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-800 mb-2">🔄 Bitwise AND of Range</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find AND of all numbers in [left, right]. Find common prefix.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(log n), Space: O(1)<br/>
                  LeetCode 201
                </div>
              </div>

              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">💎 Maximum XOR</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find maximum XOR of two numbers in array. Use Trie or greedy bit selection.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n), Space: O(1)<br/>
                  LeetCode 421
                </div>
              </div>

              <div className="border-2 border-pink-200 bg-pink-50 rounded-lg p-4">
                <h4 className="font-bold text-pink-800 mb-2">🎲 Gray Code</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Generate n-bit Gray code sequence. Use formula: i ^ (i {'>> '}1).
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(2ⁿ), Space: O(1) auxiliary<br/>
                  LeetCode 89
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Bit Manipulation Cheat Sheet</h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
              <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
                <div>
                  <div className="font-bold mb-2">Basic Operations:</div>
                  <div>Set bit: n | (1 {'<<'} i)</div>
                  <div>Clear bit: n & ~(1 {'<<'} i)</div>
                  <div>Toggle bit: n ^ (1 {'<<'} i)</div>
                  <div>Check bit: (n & (1 {'<<'} i)) != 0</div>
                </div>
                <div>
                  <div className="font-bold mb-2">Tricks:</div>
                  <div>Power of 2: n & (n-1) == 0</div>
                  <div>Count bits: n &= (n-1) in loop</div>
                  <div>Rightmost 1: n & (-n)</div>
                  <div>Swap: a^=b; b^=a; a^=b</div>
                </div>
                <div>
                  <div className="font-bold mb-2">Shifts:</div>
                  <div>Multiply by 2: n {'<<'} 1</div>
                  <div>Divide by 2: n {'>> '}1</div>
                  <div>Multiply by 2^k: n {'<<'} k</div>
                  <div>Divide by 2^k: n {'>> '}k</div>
                </div>
                <div>
                  <div className="font-bold mb-2">Masks:</div>
                  <div>Low k bits: (1 {'<<'} k) - 1</div>
                  <div>All 1s: ~0</div>
                  <div>MSB: 1 {'<<'} 31</div>
                  <div>Sign: n & (1 {'<<'} 31)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🎯 Interview Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Recognize patterns:</strong> "Find single element", "count bits", "check power of 2"</li>
              <li>• <strong>XOR for duplicates:</strong> Perfect for finding odd-one-out in pairs</li>
              <li>• <strong>n & (n-1) magic:</strong> Clears rightmost 1 bit - many uses!</li>
              <li>• <strong>Mask creation:</strong> (1 {'<<'} k) creates mask with bit k set</li>
              <li>• <strong>Watch for overflow:</strong> Use long if needed, {'>>>'} for unsigned shift</li>
              <li>• <strong>Practice conversions:</strong> Be fluent with binary ↔ decimal</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Company Interview Questions</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Google:</strong> Maximum XOR, Bitwise AND of Range, Gray Code</li>
                <li>• <strong>Facebook/Meta:</strong> Single Number variations, Missing Number</li>
                <li>• <strong>Amazon:</strong> Power of Two, Counting Bits, Reverse Bits</li>
                <li>• <strong>Microsoft:</strong> Number of 1 Bits, UTF-8 Validation</li>
                <li>• <strong>Apple:</strong> Sum of Two Integers (without + operator)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ Common Mistakes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Confusing {'>> '}(signed) with {'>>>'} (unsigned) shift - use {'>>>'} for positive results</li>
              <li>• Forgetting n {'>'} 0 check for power of 2 (0 and negatives fail)</li>
              <li>• Not using parentheses: (n & 1) == 0 not n & 1 == 0 (precedence!)</li>
              <li>• Assuming 32-bit when problem might need 64-bit (use long)</li>
              <li>• Not considering negative numbers and two's complement representation</li>
              <li>• Overcomplica ting - many bit problems have elegant one-line solutions!</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default BitManipulationVisualizer
