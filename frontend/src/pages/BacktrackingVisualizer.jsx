import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function BacktrackingVisualizer() {
  const [activeTab, setActiveTab] = useState('theory')
  const [selectedProblem, setSelectedProblem] = useState('permutations')

  // Permutations state
  const [permInput, setPermInput] = useState('ABC')
  const [permutations, setPermutations] = useState([])
  const [permSteps, setPermSteps] = useState([])
  const [permCurrentStep, setPermCurrentStep] = useState(0)

  // N-Queens state
  const [queensN, setQueensN] = useState(4)
  const [queensBoard, setQueensBoard] = useState([])
  const [queensSolutions, setQueensSolutions] = useState([])
  const [queensCurrentSolution, setQueensCurrentSolution] = useState(0)

  // Subsets state
  const [subsetsInput, setSubsetsInput] = useState('1,2,3')
  const [subsets, setSubsets] = useState([])
  const [subsetsSteps, setSubsetsSteps] = useState([])
  const [subsetsCurrentStep, setSubsetsCurrentStep] = useState(0)

  // Permutations Algorithm
  const generatePermutations = () => {
    const arr = permInput.split('')
    const result = []
    const steps = []

    const backtrack = (current, remaining, depth = 0) => {
      steps.push({
        current: [...current],
        remaining: [...remaining],
        depth,
        description: current.length === arr.length
          ? `✅ Found permutation: ${current.join('')}`
          : `Exploring with current = [${current.join(', ')}], remaining = [${remaining.join(', ')}]`
      })

      if (current.length === arr.length) {
        result.push(current.join(''))
        return
      }

      for (let i = 0; i < remaining.length; i++) {
        const char = remaining[i]
        const newCurrent = [...current, char]
        const newRemaining = remaining.filter((_, idx) => idx !== i)
        backtrack(newCurrent, newRemaining, depth + 1)

        steps.push({
          current: [...current],
          remaining: [...remaining],
          depth,
          description: `⬅️ Backtracking from [${newCurrent.join(', ')}] to [${current.join(', ')}]`
        })
      }
    }

    backtrack([], arr, 0)
    setPermutations(result)
    setPermSteps(steps)
    setPermCurrentStep(0)
  }

  // N-Queens Algorithm
  const solveNQueens = () => {
    const solutions = []
    const board = Array(queensN).fill(null).map(() => Array(queensN).fill(false))

    const isSafe = (board, row, col) => {
      // Check column
      for (let i = 0; i < row; i++) {
        if (board[i][col]) return false
      }

      // Check upper left diagonal
      for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j]) return false
      }

      // Check upper right diagonal
      for (let i = row - 1, j = col + 1; i >= 0 && j < queensN; i--, j++) {
        if (board[i][j]) return false
      }

      return true
    }

    const solve = (board, row) => {
      if (row === queensN) {
        solutions.push(board.map(r => [...r]))
        return
      }

      for (let col = 0; col < queensN; col++) {
        if (isSafe(board, row, col)) {
          board[row][col] = true
          solve(board, row + 1)
          board[row][col] = false // Backtrack
        }
      }
    }

    solve(board, 0)
    setQueensSolutions(solutions)
    setQueensCurrentSolution(0)
    if (solutions.length > 0) {
      setQueensBoard(solutions[0])
    }
  }

  // Subsets Algorithm
  const generateSubsets = () => {
    const nums = subsetsInput.split(',').map(n => n.trim()).filter(n => n)
    const result = []
    const steps = []

    const backtrack = (index, current, depth = 0) => {
      steps.push({
        current: [...current],
        index,
        depth,
        description: `At index ${index}: current subset = [${current.join(', ')}]`
      })

      result.push([...current])

      for (let i = index; i < nums.length; i++) {
        current.push(nums[i])
        steps.push({
          current: [...current],
          index: i,
          depth: depth + 1,
          description: `➕ Include ${nums[i]}: subset = [${current.join(', ')}]`
        })

        backtrack(i + 1, current, depth + 1)

        const removed = current.pop()
        steps.push({
          current: [...current],
          index: i,
          depth,
          description: `⬅️ Backtrack: remove ${removed}, back to [${current.join(', ')}]`
        })
      }
    }

    backtrack(0, [], 0)
    setSubsets(result)
    setSubsetsSteps(steps)
    setSubsetsCurrentStep(0)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Backtracking</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="text-5xl font-bold mb-4">🔄 Backtracking</h1>
        <p className="text-xl opacity-90 mb-4">
          Master the art of exploring all possibilities and backtracking when stuck. Essential for 15-20% of FAANG interviews!
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Permutations</div>
          </div>
          <div className="text-xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">N-Queens</div>
          </div>
          <div className="text-xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Subsets</div>
          </div>
          <div className="text-xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">More...</div>
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
                ? 'bg-purple-600 text-white'
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What is Backtracking?</h2>
            <p className="text-gray-700 mb-4">
              Backtracking is an algorithmic technique for solving problems by exploring all possible solutions
              and abandoning ("backtracking" from) paths that don't lead to valid solutions. Think of it as
              navigating a maze: you try a path, and if you hit a dead end, you go back to the last decision
              point and try a different path.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
              <p className="font-semibold text-purple-900 mb-2">🎯 Core Concept</p>
              <p className="text-gray-700">
                Backtracking = Recursion + Pruning. You recursively explore the solution space, but intelligently
                prune branches that cannot possibly lead to a valid solution.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">When to Use Backtracking?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">✅ Use Backtracking When:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• You need to find ALL solutions (not just one)</li>
                  <li>• Problem has constraints to check at each step</li>
                  <li>• Solution is built incrementally (piece by piece)</li>
                  <li>• Problem asks for permutations, combinations, or subsets</li>
                  <li>• Constraints eliminate many invalid paths early</li>
                  <li>• Examples: N-Queens, Sudoku, Rat in Maze</li>
                </ul>
              </div>
              <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">❌ Don't Use When:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• You only need ONE solution (use greedy or DP)</li>
                  <li>• No constraints to prune invalid paths</li>
                  <li>• Solution space is too large (exponential)</li>
                  <li>• Problem has optimal substructure (use DP instead)</li>
                  <li>• Can be solved in polynomial time</li>
                  <li>• Examples: Shortest path, Min/Max problems</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Backtracking Template</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="text-sm text-gray-800 overflow-x-auto">
{`function backtrack(current, choices):
    # Base case: found a solution
    if is_solution(current):
        add current to results
        return

    # Explore all choices
    for choice in choices:
        # 1. Make choice (choose)
        if is_valid(current, choice):
            current.add(choice)

            # 2. Explore recursively
            backtrack(current, remaining_choices)

            # 3. Undo choice (backtrack)
            current.remove(choice)
`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Time & Space Complexity</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Problem</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Time Complexity</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Space Complexity</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Permutations</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n! × n)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">n! permutations, each takes O(n) to build</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">N-Queens</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n!)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">Pruning reduces from n^n to ~n!</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Subsets</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(2ⁿ × n)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">2^n subsets, each takes O(n) to build</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Sudoku Solver</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(9^m)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(1)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">m = empty cells, 9 choices per cell</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Combinations</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(C(n,k) × k)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(k)</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">C(n,k) combinations, each size k</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">💡 Key Insights</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Backtracking ≠ Brute Force:</strong> Pruning eliminates invalid paths early, making it much faster than trying every possibility</li>
              <li>• <strong>State Space Tree:</strong> Visualize the problem as a tree where each node is a state and edges are choices</li>
              <li>• <strong>Three Steps:</strong> Choose → Explore → Un-choose (this is the backtracking step!)</li>
              <li>• <strong>Optimization:</strong> Better constraint checking = more pruning = faster execution</li>
            </ul>
          </div>
        </div>
      )}

      {/* Practice Tab */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Interactive Backtracking Problems</h2>

          {/* Problem Selector */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedProblem('permutations')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'permutations'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Permutations
            </button>
            <button
              onClick={() => setSelectedProblem('nqueens')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'nqueens'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              N-Queens
            </button>
            <button
              onClick={() => setSelectedProblem('subsets')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'subsets'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Subsets
            </button>
          </div>

          {/* Permutations Problem */}
          {selectedProblem === 'permutations' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Generate All Permutations</h3>
                <p className="text-gray-700">
                  Given a string, generate all possible permutations. For example, "ABC" has 6 permutations:
                  ABC, ACB, BAC, BCA, CAB, CBA.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={permInput}
                  onChange={(e) => setPermInput(e.target.value.toUpperCase())}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-40"
                  placeholder="ABC"
                  maxLength="5"
                />
                <button
                  onClick={generatePermutations}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Generate Permutations
                </button>
              </div>

              {permutations.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">
                      Found {permutations.length} permutations for "{permInput}":
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {permutations.map((perm, idx) => (
                        <span key={idx} className="bg-green-600 text-white px-3 py-1 rounded font-mono">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3">Step-by-Step Execution:</h4>
                    <div className="flex items-center space-x-4 mb-4">
                      <button
                        onClick={() => setPermCurrentStep(Math.max(0, permCurrentStep - 1))}
                        disabled={permCurrentStep === 0}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>
                      <span className="text-gray-700 font-semibold">
                        Step {permCurrentStep + 1} of {permSteps.length}
                      </span>
                      <button
                        onClick={() => setPermCurrentStep(Math.min(permSteps.length - 1, permCurrentStep + 1))}
                        disabled={permCurrentStep === permSteps.length - 1}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>

                    {permSteps[permCurrentStep] && (
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded border border-gray-300">
                          <div className="text-sm text-gray-600 mb-1">Current Path (depth {permSteps[permCurrentStep].depth}):</div>
                          <div className="font-mono text-lg font-bold text-purple-700">
                            [{permSteps[permCurrentStep].current.join(', ')}]
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-300">
                          <div className="text-sm text-gray-600 mb-1">Remaining Choices:</div>
                          <div className="font-mono text-lg text-blue-700">
                            [{permSteps[permCurrentStep].remaining.join(', ')}]
                          </div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
                          <div className="text-sm text-gray-600 mb-1">Action:</div>
                          <div className="text-gray-800">{permSteps[permCurrentStep].description}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* N-Queens Problem */}
          {selectedProblem === 'nqueens' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: N-Queens</h3>
                <p className="text-gray-700 mb-2">
                  Place N queens on an N×N chessboard such that no two queens attack each other.
                  Queens can attack horizontally, vertically, and diagonally.
                </p>
                <p className="text-sm text-gray-600">
                  This is one of the most famous backtracking problems! It demonstrates how constraint
                  checking dramatically reduces the search space.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700">Board Size:</label>
                <input
                  type="number"
                  value={queensN}
                  onChange={(e) => setQueensN(Math.min(8, Math.max(4, parseInt(e.target.value) || 4)))}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-20"
                  min="4"
                  max="8"
                />
                <button
                  onClick={solveNQueens}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Solve N-Queens
                </button>
              </div>

              {queensSolutions.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">
                      Found {queensSolutions.length} solution{queensSolutions.length > 1 ? 's' : ''}!
                    </h4>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          const prev = Math.max(0, queensCurrentSolution - 1)
                          setQueensCurrentSolution(prev)
                          setQueensBoard(queensSolutions[prev])
                        }}
                        disabled={queensCurrentSolution === 0}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Previous Solution
                      </button>
                      <span className="text-gray-700 font-semibold">
                        Solution {queensCurrentSolution + 1} of {queensSolutions.length}
                      </span>
                      <button
                        onClick={() => {
                          const next = Math.min(queensSolutions.length - 1, queensCurrentSolution + 1)
                          setQueensCurrentSolution(next)
                          setQueensBoard(queensSolutions[next])
                        }}
                        disabled={queensCurrentSolution === queensSolutions.length - 1}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next Solution →
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="inline-block border-4 border-gray-800 rounded">
                      {queensBoard.map((row, i) => (
                        <div key={i} className="flex">
                          {row.map((hasQueen, j) => (
                            <div
                              key={j}
                              className={`w-12 h-12 flex items-center justify-center text-2xl ${
                                (i + j) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-700'
                              }`}
                            >
                              {hasQueen && '♛'}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subsets Problem */}
          {selectedProblem === 'subsets' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Generate All Subsets (Power Set)</h3>
                <p className="text-gray-700">
                  Given a set of distinct numbers, generate all possible subsets (the power set).
                  For example, [1,2,3] has 8 subsets: [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3].
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={subsetsInput}
                  onChange={(e) => setSubsetsInput(e.target.value)}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-60"
                  placeholder="1,2,3"
                />
                <button
                  onClick={generateSubsets}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Generate Subsets
                </button>
              </div>

              {subsets.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">
                      Found {subsets.length} subsets:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {subsets.map((subset, idx) => (
                        <span key={idx} className="bg-green-600 text-white px-3 py-1 rounded font-mono">
                          [{subset.join(', ')}]
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3">Step-by-Step Execution:</h4>
                    <div className="flex items-center space-x-4 mb-4">
                      <button
                        onClick={() => setSubsetsCurrentStep(Math.max(0, subsetsCurrentStep - 1))}
                        disabled={subsetsCurrentStep === 0}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>
                      <span className="text-gray-700 font-semibold">
                        Step {subsetsCurrentStep + 1} of {subsetsSteps.length}
                      </span>
                      <button
                        onClick={() => setSubsetsCurrentStep(Math.min(subsetsSteps.length - 1, subsetsCurrentStep + 1))}
                        disabled={subsetsCurrentStep === subsetsSteps.length - 1}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>

                    {subsetsSteps[subsetsCurrentStep] && (
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded border border-gray-300">
                          <div className="text-sm text-gray-600 mb-1">Current Subset (depth {subsetsSteps[subsetsCurrentStep].depth}):</div>
                          <div className="font-mono text-lg font-bold text-purple-700">
                            [{subsetsSteps[subsetsCurrentStep].current.join(', ')}]
                          </div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
                          <div className="text-sm text-gray-600 mb-1">Action:</div>
                          <div className="text-gray-800">{subsetsSteps[subsetsCurrentStep].description}</div>
                        </div>
                      </div>
                    )}
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
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Code Implementations</h2>

            {/* Permutations Code */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Permutations</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm">
{`// Java - Generate all permutations of a string
public class Permutations {
    public List<String> permute(String str) {
        List<String> result = new ArrayList<>();
        backtrack(result, new StringBuilder(), str.toCharArray(), new boolean[str.length()]);
        return result;
    }

    private void backtrack(List<String> result, StringBuilder current,
                          char[] chars, boolean[] used) {
        // Base case: found a complete permutation
        if (current.length() == chars.length) {
            result.add(current.toString());
            return;
        }

        // Try each unused character
        for (int i = 0; i < chars.length; i++) {
            if (used[i]) continue;  // Skip if already used

            // 1. CHOOSE: add character to current permutation
            current.append(chars[i]);
            used[i] = true;

            // 2. EXPLORE: recurse with updated state
            backtrack(result, current, chars, used);

            // 3. UN-CHOOSE (BACKTRACK): remove character
            current.deleteCharAt(current.length() - 1);
            used[i] = false;
        }
    }
}

// Time: O(n! × n) - n! permutations, each takes O(n) to build
// Space: O(n) - recursion depth + current permutation`}
                </pre>
              </div>
            </div>

            {/* N-Queens Code */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">2. N-Queens</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm">
{`// Java - Solve N-Queens problem
public class NQueens {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> solutions = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');

        backtrack(solutions, board, 0);
        return solutions;
    }

    private void backtrack(List<List<String>> solutions, char[][] board, int row) {
        // Base case: placed all queens successfully
        if (row == board.length) {
            solutions.add(construct(board));
            return;
        }

        // Try placing queen in each column of current row
        for (int col = 0; col < board.length; col++) {
            if (!isSafe(board, row, col)) continue;

            // 1. CHOOSE: place queen
            board[row][col] = 'Q';

            // 2. EXPLORE: move to next row
            backtrack(solutions, board, row + 1);

            // 3. UN-CHOOSE (BACKTRACK): remove queen
            board[row][col] = '.';
        }
    }

    private boolean isSafe(char[][] board, int row, int col) {
        int n = board.length;

        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }

        // Check upper-left diagonal
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }

        // Check upper-right diagonal
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }

        return true;
    }

    private List<String> construct(char[][] board) {
        List<String> result = new ArrayList<>();
        for (char[] row : board) {
            result.add(new String(row));
        }
        return result;
    }
}

// Time: O(n!) - much better than brute force O(n^n) due to pruning
// Space: O(n²) - board storage`}
                </pre>
              </div>
            </div>

            {/* Subsets Code */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">3. Subsets (Power Set)</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm">
{`// Java - Generate all subsets
public class Subsets {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(result, new ArrayList<>(), nums, 0);
        return result;
    }

    private void backtrack(List<List<Integer>> result, List<Integer> current,
                          int[] nums, int start) {
        // Add current subset to result (including empty set)
        result.add(new ArrayList<>(current));

        // Try adding each remaining number
        for (int i = start; i < nums.length; i++) {
            // 1. CHOOSE: include nums[i]
            current.add(nums[i]);

            // 2. EXPLORE: recurse with remaining elements
            backtrack(result, current, nums, i + 1);

            // 3. UN-CHOOSE (BACKTRACK): exclude nums[i]
            current.remove(current.size() - 1);
        }
    }
}

// Alternative: Iterative bit manipulation approach
public List<List<Integer>> subsetsIterative(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    int totalSubsets = 1 << n;  // 2^n subsets

    for (int mask = 0; mask < totalSubsets; mask++) {
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            // Check if i-th bit is set
            if ((mask & (1 << i)) != 0) {
                subset.add(nums[i]);
            }
        }
        result.add(subset);
    }
    return result;
}

// Time: O(2ⁿ × n) - 2^n subsets, each takes O(n) to build
// Space: O(n) - recursion depth`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Advanced Backtracking Concepts</h2>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">More Classic Backtracking Problems</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">🎯 Combination Sum</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find all combinations that sum to a target. Can reuse elements unlimited times.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Input: [2,3,6,7], target=7<br/>
                  Output: [[2,2,3], [7]]
                </div>
              </div>

              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">🗺️ Word Search</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find if a word exists in a 2D board by connecting adjacent cells.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Board: [['A','B'],['C','D']]<br/>
                  Word: "ABCD" → true
                </div>
              </div>

              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">🧩 Sudoku Solver</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Fill a 9×9 grid following Sudoku rules. Classic constraint satisfaction problem.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(9^m) where m = empty cells
                </div>
              </div>

              <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-800 mb-2">📱 Letter Combinations</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Generate all letter combinations from a phone number (like old T9 keyboards).
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Input: "23"<br/>
                  Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
                </div>
              </div>

              <div className="border-2 border-pink-200 bg-pink-50 rounded-lg p-4">
                <h4 className="font-bold text-pink-800 mb-2">🔢 Palindrome Partitioning</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Partition a string into all possible palindrome substrings.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Input: "aab"<br/>
                  Output: [["a","a","b"], ["aa","b"]]
                </div>
              </div>

              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">🐀 Rat in a Maze</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find all paths from top-left to bottom-right in a maze with obstacles.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Directions: Down, Up, Left, Right<br/>
                  Classic maze navigation problem
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Optimization Techniques</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h4 className="font-bold text-green-800 mb-2">1. Early Termination</h4>
                <p className="text-gray-700 mb-2">
                  Stop exploring as soon as you know a path won't work. Check constraints BEFORE recursing, not after.
                </p>
                <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm font-mono">
{`// Bad: Check after recursing
backtrack(current);
if (!isValid(current)) return;

// Good: Check before recursing
if (!isValid(current)) return;
backtrack(current);`}
                </div>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h4 className="font-bold text-blue-800 mb-2">2. Constraint Propagation</h4>
                <p className="text-gray-700 mb-2">
                  In Sudoku, after placing a number, immediately eliminate it from row/column/box. This reduces the search space dramatically.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                <h4 className="font-bold text-purple-800 mb-2">3. Memoization (Rare in Backtracking)</h4>
                <p className="text-gray-700 mb-2">
                  Usually not applicable since we need ALL solutions, but can work for counting problems where you don't need to construct solutions.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                <h4 className="font-bold text-orange-800 mb-2">4. Symmetry Breaking</h4>
                <p className="text-gray-700 mb-2">
                  In N-Queens, you can place first queen in first N/2 columns and mirror solutions, cutting work in half.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🎯 Interview Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Recognize the pattern:</strong> Look for "find all solutions", "permutations", "combinations", "subsets"</li>
              <li>• <strong>Draw the decision tree:</strong> Before coding, sketch the state space tree to understand recursion</li>
              <li>• <strong>Start with base case:</strong> When is the solution complete? Code that first</li>
              <li>• <strong>Three steps mantra:</strong> Choose → Explore → Un-choose. Make this muscle memory</li>
              <li>• <strong>Optimize constraints:</strong> The more you can prune early, the better performance</li>
              <li>• <strong>Practice variations:</strong> Permutations I, II (with duplicates), Combinations, Combination Sum, etc.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Common Interview Questions</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Easy:</strong> Subsets, Letter Combinations of a Phone Number</li>
                <li>• <strong>Medium:</strong> Permutations, Combination Sum, Palindrome Partitioning, Word Search</li>
                <li>• <strong>Hard:</strong> N-Queens, Sudoku Solver, Word Search II, Regular Expression Matching</li>
                <li>• <strong>Companies:</strong> Google, Facebook, Amazon, Microsoft frequently ask backtracking in phone screens and onsite rounds</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ Common Mistakes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Forgetting to backtrack (un-choose) - leads to wrong results</li>
              <li>• Modifying global state without restoring it</li>
              <li>• Not creating a copy when adding to result list</li>
              <li>• Checking constraints after recursing instead of before (inefficient)</li>
              <li>• Confusing backtracking with dynamic programming (different use cases!)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default BacktrackingVisualizer
