import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function GreedyAlgorithmsVisualizer() {
  const [activeTab, setActiveTab] = useState('theory')
  const [selectedProblem, setSelectedProblem] = useState('jump')

  // Jump Game state
  const [jumpArray, setJumpArray] = useState([2, 3, 1, 1, 4])
  const [jumpSteps, setJumpSteps] = useState([])
  const [jumpCurrentStep, setJumpCurrentStep] = useState(0)
  const [jumpCanReach, setJumpCanReach] = useState(null)

  // Gas Station state
  const [gas, setGas] = useState([1, 2, 3, 4, 5])
  const [cost, setCost] = useState([3, 4, 5, 1, 2])
  const [gasSteps, setGasSteps] = useState([])
  const [gasCurrentStep, setGasCurrentStep] = useState(0)
  const [gasStartStation, setGasStartStation] = useState(-1)

  // Meeting Rooms state
  const [intervals, setIntervals] = useState([[0, 30], [5, 10], [15, 20]])
  const [minRooms, setMinRooms] = useState(0)
  const [meetingSteps, setMeetingSteps] = useState([])
  const [meetingCurrentStep, setMeetingCurrentStep] = useState(0)

  // Task Scheduler state
  const [tasks, setTasks] = useState('AAABBB')
  const [cooldown, setCooldown] = useState(2)
  const [schedule, setSchedule] = useState([])
  const [totalTime, setTotalTime] = useState(0)

  // Jump Game solver
  const solveJumpGame = () => {
    const steps = []
    let maxReach = 0
    const n = jumpArray.length

    steps.push({
      index: 0,
      maxReach: 0,
      description: 'Start at index 0. Can we reach the last index?'
    })

    for (let i = 0; i < n; i++) {
      if (i > maxReach) {
        steps.push({
          index: i,
          maxReach,
          description: `❌ Cannot reach index ${i}! Current maxReach is ${maxReach}.`,
          canReach: false
        })
        setJumpCanReach(false)
        setJumpSteps(steps)
        setJumpCurrentStep(0)
        return
      }

      const newReach = i + jumpArray[i]
      const isNewMax = newReach > maxReach

      if (isNewMax) {
        maxReach = newReach
      }

      steps.push({
        index: i,
        maxReach,
        jumpValue: jumpArray[i],
        newReach,
        description: `At index ${i} (value ${jumpArray[i]}): Can jump to ${newReach}. ${isNewMax ? `🎉 New maxReach = ${maxReach}` : `MaxReach stays ${maxReach}`}`,
        isNewMax
      })

      if (maxReach >= n - 1) {
        steps.push({
          index: i,
          maxReach,
          description: `✅ Success! Can reach index ${n - 1}. maxReach = ${maxReach} >= ${n - 1}`,
          canReach: true
        })
        setJumpCanReach(true)
        setJumpSteps(steps)
        setJumpCurrentStep(0)
        return
      }
    }

    setJumpCanReach(maxReach >= n - 1)
    setJumpSteps(steps)
    setJumpCurrentStep(0)
  }

  // Gas Station solver
  const solveGasStation = () => {
    const steps = []
    const n = gas.length
    let totalGas = 0
    let totalCost = 0
    let tank = 0
    let start = 0

    steps.push({
      description: 'Find starting station for complete circuit',
      currentStation: -1,
      tank: 0,
      start: 0
    })

    for (let i = 0; i < n; i++) {
      totalGas += gas[i]
      totalCost += cost[i]
      tank += gas[i] - cost[i]

      const netGain = gas[i] - cost[i]

      steps.push({
        currentStation: i,
        tank,
        start,
        netGain,
        description: `Station ${i}: Gas=${gas[i]}, Cost=${cost[i]}, Net=${netGain}. Tank=${tank}`,
        status: tank >= 0 ? 'ok' : 'reset'
      })

      if (tank < 0) {
        start = i + 1
        tank = 0
        steps.push({
          currentStation: i,
          tank: 0,
          start,
          description: `❌ Tank empty! Reset starting point to station ${start}`,
          status: 'reset'
        })
      }
    }

    if (totalGas < totalCost) {
      steps.push({
        description: `❌ Impossible! Total gas ${totalGas} < Total cost ${totalCost}`,
        currentStation: -1,
        tank: 0,
        start: -1,
        status: 'impossible'
      })
      setGasStartStation(-1)
    } else {
      steps.push({
        description: `✅ Start at station ${start}! Total gas ${totalGas} >= Total cost ${totalCost}`,
        currentStation: -1,
        tank: 0,
        start,
        status: 'success'
      })
      setGasStartStation(start)
    }

    setGasSteps(steps)
    setGasCurrentStep(0)
  }

  // Meeting Rooms II solver
  const solveMeetingRooms = () => {
    const steps = []
    const events = []

    // Create start and end events
    for (let [start, end] of intervals) {
      events.push({ time: start, type: 'start' })
      events.push({ time: end, type: 'end' })
    }

    // Sort by time
    events.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time
      return a.type === 'end' ? -1 : 1 // End events before start events at same time
    })

    steps.push({
      description: 'Process meetings in chronological order',
      events: [...events],
      rooms: 0,
      maxRooms: 0
    })

    let rooms = 0
    let maxRooms = 0

    for (let event of events) {
      if (event.type === 'start') {
        rooms++
        maxRooms = Math.max(maxRooms, rooms)
        steps.push({
          event,
          rooms,
          maxRooms,
          description: `Meeting starts at ${event.time}. Need room. Active rooms: ${rooms} ${rooms > maxRooms - 1 ? '🎉 New max!' : ''}`,
          status: 'start'
        })
      } else {
        rooms--
        steps.push({
          event,
          rooms,
          maxRooms,
          description: `Meeting ends at ${event.time}. Free room. Active rooms: ${rooms}`,
          status: 'end'
        })
      }
    }

    steps.push({
      description: `✅ Minimum rooms needed: ${maxRooms}`,
      rooms: 0,
      maxRooms,
      status: 'result'
    })

    setMinRooms(maxRooms)
    setMeetingSteps(steps)
    setMeetingCurrentStep(0)
  }

  // Task Scheduler solver
  const solveTaskScheduler = () => {
    const freq = {}
    for (let task of tasks) {
      freq[task] = (freq[task] || 0) + 1
    }

    const taskList = Object.entries(freq).map(([task, count]) => ({ task, count }))
    taskList.sort((a, b) => b.count - a.count)

    const maxFreq = taskList[0].count
    const maxCount = taskList.filter(t => t.count === maxFreq).length

    // Formula: max(n, (maxFreq - 1) * (n + 1) + maxCount)
    const formulaResult = (maxFreq - 1) * (cooldown + 1) + maxCount
    const result = Math.max(tasks.length, formulaResult)

    // Build schedule
    const scheduleArray = []
    const available = [...taskList]
    const cooldownQueue = []

    while (available.length > 0 || cooldownQueue.length > 0) {
      // Add task from available
      if (available.length > 0) {
        const task = available.shift()
        scheduleArray.push(task.task)
        task.count--

        if (task.count > 0) {
          cooldownQueue.push({ task, readyAt: scheduleArray.length + cooldown })
        }
      } else {
        scheduleArray.push('idle')
      }

      // Check cooldown queue
      while (cooldownQueue.length > 0 && cooldownQueue[0].readyAt <= scheduleArray.length) {
        const { task } = cooldownQueue.shift()
        available.push(task)
        available.sort((a, b) => b.count - a.count)
      }
    }

    setSchedule(scheduleArray)
    setTotalTime(result)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Greedy Algorithms</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-lime-700 text-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="text-5xl font-bold mb-4">🎯 Greedy Algorithms</h1>
        <p className="text-xl opacity-90 mb-4">
          Make locally optimal choices for globally optimal solutions! Essential for 4-5% of FAANG interviews.
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Local Optimum</div>
          </div>
          <div className="text-xl">→</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Global Optimum</div>
          </div>
          <div className="text-xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Fast & Simple</div>
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
                ? 'bg-green-600 text-white'
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What are Greedy Algorithms?</h2>
            <p className="text-gray-700 mb-4">
              Greedy algorithms make the locally optimal choice at each step, hoping to find a global optimum.
              Unlike dynamic programming which explores all possibilities, greedy makes one choice and never looks back.
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="font-semibold text-green-900 mb-2">🎯 Core Concept</p>
              <p className="text-gray-700">
                At each decision point, choose what seems best RIGHT NOW. If the problem has the "greedy choice property"
                and "optimal substructure," this local optimum leads to the global optimum.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Greedy vs Dynamic Programming</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Greedy</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Dynamic Programming</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Decision</td>
                    <td className="border border-gray-300 px-4 py-2">Make best local choice, never reconsider</td>
                    <td className="border border-gray-300 px-4 py-2">Explore all choices, pick best overall</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Speed</td>
                    <td className="border border-gray-300 px-4 py-2">Usually O(n log n) or O(n)</td>
                    <td className="border border-gray-300 px-4 py-2">Usually O(n²) or worse</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Correctness</td>
                    <td className="border border-gray-300 px-4 py-2">Only works if greedy choice property holds</td>
                    <td className="border border-gray-300 px-4 py-2">Always finds optimal if coded correctly</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Complexity</td>
                    <td className="border border-gray-300 px-4 py-2">Simpler to code</td>
                    <td className="border border-gray-300 px-4 py-2">More complex, needs memoization</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Examples</td>
                    <td className="border border-gray-300 px-4 py-2">Jump Game, Gas Station, Intervals</td>
                    <td className="border border-gray-300 px-4 py-2">Coin Change, Knapsack, LCS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">When to Use Greedy?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">✅ Use Greedy When:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Greedy choice property:</strong> Local optimum → global optimum</li>
                  <li>• <strong>Optimal substructure:</strong> Problem breaks into subproblems</li>
                  <li>• Interval scheduling problems</li>
                  <li>• Minimizing/maximizing with constraints</li>
                  <li>• Huffman coding, Dijkstra's algorithm</li>
                  <li>• Examples: Activity Selection, Jump Game, Gas Station</li>
                </ul>
              </div>

              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">❌ Don't Use Greedy When:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Local optimum ≠ global optimum</li>
                  <li>• Need to explore multiple paths</li>
                  <li>• Problem requires backtracking</li>
                  <li>• Finding ALL solutions (not just optimal)</li>
                  <li>• Example: Coin Change (use DP instead)</li>
                  <li>• Greedy gives [25¢, 10¢, 1¢, 1¢] for 27¢, but DP might find better</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Common Greedy Patterns</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-800 mb-1">Pattern 1: Interval Scheduling</h4>
                <p className="text-sm text-gray-700">
                  <strong>Strategy:</strong> Sort by end time, greedily select non-overlapping intervals.
                  <br/><strong>Examples:</strong> Meeting Rooms, Activity Selection, Minimum Arrows
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-800 mb-1">Pattern 2: Max/Min Reachability</h4>
                <p className="text-sm text-gray-700">
                  <strong>Strategy:</strong> Track maximum reachable position, update greedily.
                  <br/><strong>Examples:</strong> Jump Game, Jump Game II
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-800 mb-1">Pattern 3: Greedy + Heap</h4>
                <p className="text-sm text-gray-700">
                  <strong>Strategy:</strong> Use heap to always pick best available element.
                  <br/><strong>Examples:</strong> Task Scheduler, Meeting Rooms II, IPO
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-800 mb-1">Pattern 4: Two-Pass Greedy</h4>
                <p className="text-sm text-gray-700">
                  <strong>Strategy:</strong> One pass left-to-right, one right-to-left.
                  <br/><strong>Examples:</strong> Candy, Trapping Rain Water, Gas Station
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">💡 Key Insights</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Proof is crucial:</strong> Must prove greedy choice property holds for your problem</li>
              <li>• <strong>Sorting often helps:</strong> Many greedy problems start with sorting</li>
              <li>• <strong>Faster than DP:</strong> Usually O(n log n) vs O(n²)</li>
              <li>• <strong>Exchange argument:</strong> Common proof technique - show swapping choices doesn't improve solution</li>
              <li>• <strong>Stay-ahead argument:</strong> Prove greedy stays ahead of any other solution at every step</li>
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
              onClick={() => setSelectedProblem('jump')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'jump'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Jump Game
            </button>
            <button
              onClick={() => setSelectedProblem('gas')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'gas'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Gas Station
            </button>
            <button
              onClick={() => setSelectedProblem('meeting')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'meeting'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Meeting Rooms
            </button>
            <button
              onClick={() => setSelectedProblem('task')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'task'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Task Scheduler
            </button>
          </div>

          {/* Jump Game Problem */}
          {selectedProblem === 'jump' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Jump Game (LeetCode 55)</h3>
                <p className="text-gray-700 mb-2">
                  Can you reach the last index? Each element represents maximum jump length from that position.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Greedy Strategy:</strong> Track maximum reachable index. If current index exceeds maxReach, impossible.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700">Array: {JSON.stringify(jumpArray)}</label>
                <button
                  onClick={solveJumpGame}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Solve
                </button>
              </div>

              {/* Array Visualization */}
              <div className="flex justify-center space-x-2 py-4">
                {jumpArray.map((num, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-16 h-16 flex items-center justify-center rounded font-bold text-lg border-2 ${
                      idx === jumpArray.length - 1
                        ? 'bg-yellow-400 border-yellow-600 text-yellow-900'
                        : 'bg-blue-100 border-blue-400 text-blue-900'
                    }`}>
                      {num}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Index {idx}</div>
                    {idx === jumpArray.length - 1 && (
                      <div className="text-xs font-bold text-yellow-600 mt-1">🎯 Goal</div>
                    )}
                  </div>
                ))}
              </div>

              {jumpCanReach !== null && (
                <div className={`p-4 rounded border-2 ${
                  jumpCanReach
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className={`font-bold ${jumpCanReach ? 'text-green-800' : 'text-red-800'}`}>
                    {jumpCanReach ? '✅ Can reach the last index!' : '❌ Cannot reach the last index!'}
                  </div>
                </div>
              )}

              {jumpSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setJumpCurrentStep(Math.max(0, jumpCurrentStep - 1))}
                      disabled={jumpCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {jumpCurrentStep + 1} of {jumpSteps.length}
                    </span>
                    <button
                      onClick={() => setJumpCurrentStep(Math.min(jumpSteps.length - 1, jumpCurrentStep + 1))}
                      disabled={jumpCurrentStep === jumpSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded border border-blue-300">
                    <div className="text-gray-800">{jumpSteps[jumpCurrentStep]?.description}</div>
                    {jumpSteps[jumpCurrentStep]?.maxReach !== undefined && (
                      <div className="text-sm text-gray-600 mt-2">
                        Maximum Reachable Index: {jumpSteps[jumpCurrentStep].maxReach}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Gas Station Problem */}
          {selectedProblem === 'gas' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Gas Station (LeetCode 134)</h3>
                <p className="text-gray-700 mb-2">
                  Find starting gas station to complete circular route. If tank becomes negative, reset start point.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Greedy Strategy:</strong> If total gas ≥ total cost, solution exists. Track tank, reset start when negative.
                </p>
              </div>

              <div>
                <div className="mb-2"><strong>Gas:</strong> {JSON.stringify(gas)}</div>
                <div className="mb-4"><strong>Cost:</strong> {JSON.stringify(cost)}</div>
                <button
                  onClick={solveGasStation}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Solve
                </button>
              </div>

              {/* Stations Visualization */}
              <div className="flex justify-center space-x-3 py-4">
                {gas.map((g, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-1">Station {idx}</div>
                    <div className={`w-20 p-3 rounded border-2 ${
                      gasStartStation === idx
                        ? 'bg-green-400 border-green-600'
                        : 'bg-gray-100 border-gray-400'
                    }`}>
                      <div className="text-xs text-gray-600">⛽ Gas: {g}</div>
                      <div className="text-xs text-gray-600">🚗 Cost: {cost[idx]}</div>
                      <div className="text-xs font-bold mt-1">Net: {g - cost[idx]}</div>
                    </div>
                    {gasStartStation === idx && (
                      <div className="text-xs font-bold text-green-600 mt-1">✅ Start</div>
                    )}
                  </div>
                ))}
              </div>

              {gasStartStation !== null && (
                <div className={`p-4 rounded border-2 ${
                  gasStartStation >= 0
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className={`font-bold ${gasStartStation >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {gasStartStation >= 0
                      ? `✅ Start at station ${gasStartStation}`
                      : '❌ No solution - total gas < total cost'}
                  </div>
                </div>
              )}

              {gasSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setGasCurrentStep(Math.max(0, gasCurrentStep - 1))}
                      disabled={gasCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {gasCurrentStep + 1} of {gasSteps.length}
                    </span>
                    <button
                      onClick={() => setGasCurrentStep(Math.min(gasSteps.length - 1, gasCurrentStep + 1))}
                      disabled={gasCurrentStep === gasSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  <div className={`p-4 rounded border-2 ${
                    gasSteps[gasCurrentStep]?.status === 'reset'
                      ? 'bg-orange-50 border-orange-300'
                      : gasSteps[gasCurrentStep]?.status === 'success'
                      ? 'bg-green-50 border-green-300'
                      : 'bg-blue-50 border-blue-300'
                  }`}>
                    <div className="text-gray-800">{gasSteps[gasCurrentStep]?.description}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Meeting Rooms II Problem */}
          {selectedProblem === 'meeting' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Meeting Rooms II (LeetCode 253)</h3>
                <p className="text-gray-700 mb-2">
                  Find minimum conference rooms needed. Use greedy event processing.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Greedy Strategy:</strong> Process start/end events chronologically. Track concurrent meetings.
                </p>
              </div>

              <div>
                <div className="mb-4"><strong>Intervals:</strong> {JSON.stringify(intervals)}</div>
                <button
                  onClick={solveMeetingRooms}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Solve
                </button>
              </div>

              {minRooms > 0 && (
                <div className="bg-green-50 border border-green-300 rounded p-3">
                  <div className="text-green-800 font-bold">
                    ✅ Minimum Rooms Needed: {minRooms}
                  </div>
                </div>
              )}

              {meetingSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setMeetingCurrentStep(Math.max(0, meetingCurrentStep - 1))}
                      disabled={meetingCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {meetingCurrentStep + 1} of {meetingSteps.length}
                    </span>
                    <button
                      onClick={() => setMeetingCurrentStep(Math.min(meetingSteps.length - 1, meetingCurrentStep + 1))}
                      disabled={meetingCurrentStep === meetingSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  <div className={`p-4 rounded border-2 ${
                    meetingSteps[meetingCurrentStep]?.status === 'start'
                      ? 'bg-blue-50 border-blue-300'
                      : meetingSteps[meetingCurrentStep]?.status === 'end'
                      ? 'bg-green-50 border-green-300'
                      : 'bg-purple-50 border-purple-300'
                  }`}>
                    <div className="text-gray-800">{meetingSteps[meetingCurrentStep]?.description}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Task Scheduler Problem */}
          {selectedProblem === 'task' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Task Scheduler (LeetCode 621)</h3>
                <p className="text-gray-700 mb-2">
                  Schedule tasks with cooldown period n between same tasks. Find minimum time units.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Greedy Strategy:</strong> Always schedule most frequent task first. Use formula: max(tasks, (maxFreq-1)×(n+1) + count).
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <label className="font-semibold text-gray-700">Tasks:</label>
                  <input
                    type="text"
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value.toUpperCase())}
                    className="border-2 border-gray-300 rounded px-4 py-2"
                    placeholder="AAABBB"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="font-semibold text-gray-700">Cooldown n:</label>
                  <input
                    type="number"
                    value={cooldown}
                    onChange={(e) => setCooldown(parseInt(e.target.value) || 0)}
                    className="border-2 border-gray-300 rounded px-4 py-2 w-24"
                    min="0"
                  />
                </div>
                <button
                  onClick={solveTaskScheduler}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Solve
                </button>
              </div>

              {totalTime > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-300 rounded p-3">
                    <div className="text-green-800 font-bold">
                      ✅ Minimum Time Units: {totalTime}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Schedule:</h4>
                    <div className="flex flex-wrap gap-2">
                      {schedule.map((task, idx) => (
                        <div key={idx} className={`px-3 py-2 rounded font-mono text-sm ${
                          task === 'idle'
                            ? 'bg-gray-200 text-gray-500'
                            : 'bg-green-500 text-white'
                        }`}>
                          {task === 'idle' ? '—' : task}
                        </div>
                      ))}
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

          {/* Jump Game Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Jump Game (LeetCode 55)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Can reach last index?
public boolean canJump(int[] nums) {
    int maxReach = 0;

    for (int i = 0; i < nums.length; i++) {
        // If current index is beyond maxReach, impossible
        if (i > maxReach) {
            return false;
        }

        // Update maxReach greedily
        maxReach = Math.max(maxReach, i + nums[i]);

        // Early exit if we can already reach the end
        if (maxReach >= nums.length - 1) {
            return true;
        }
    }

    return maxReach >= nums.length - 1;
}

// Time: O(n) - single pass
// Space: O(1)
// Greedy choice: Always track maximum reachable position`}
              </pre>
            </div>
          </div>

          {/* Gas Station Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">2. Gas Station (LeetCode 134)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Find starting station for circular route
public int canCompleteCircuit(int[] gas, int[] cost) {
    int totalGas = 0, totalCost = 0;
    int tank = 0, start = 0;

    for (int i = 0; i < gas.length; i++) {
        totalGas += gas[i];
        totalCost += cost[i];
        tank += gas[i] - cost[i];

        // If tank negative, can't start from any station up to i
        // Greedy: Reset start to i+1
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }

    // Solution exists only if total gas >= total cost
    return totalGas >= totalCost ? start : -1;
}

// Time: O(n) - single pass
// Space: O(1)
// Greedy insight: If can't reach station i from any station before i,
// then none of those stations can be the start`}
              </pre>
            </div>
          </div>

          {/* Meeting Rooms II Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">3. Meeting Rooms II (LeetCode 253)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Minimum conference rooms needed
public int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;

    // Separate start and end times
    int[] starts = new int[intervals.length];
    int[] ends = new int[intervals.length];

    for (int i = 0; i < intervals.length; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }

    // Sort both arrays
    Arrays.sort(starts);
    Arrays.sort(ends);

    int rooms = 0, maxRooms = 0;
    int startPtr = 0, endPtr = 0;

    // Greedy: Process events chronologically
    while (startPtr < starts.length) {
        if (starts[startPtr] < ends[endPtr]) {
            // Meeting starts, need a room
            rooms++;
            maxRooms = Math.max(maxRooms, rooms);
            startPtr++;
        } else {
            // Meeting ends, free a room
            rooms--;
            endPtr++;
        }
    }

    return maxRooms;
}

// Time: O(n log n) - sorting
// Space: O(n) - arrays`}
              </pre>
            </div>
          </div>

          {/* Task Scheduler Code */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">4. Task Scheduler (LeetCode 621)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Minimum time to complete tasks with cooldown
public int leastInterval(char[] tasks, int n) {
    // Count frequency of each task
    int[] freq = new int[26];
    for (char task : tasks) {
        freq[task - 'A']++;
    }

    // Find max frequency
    Arrays.sort(freq);
    int maxFreq = freq[25];

    // Count how many tasks have max frequency
    int maxCount = 0;
    for (int f : freq) {
        if (f == maxFreq) maxCount++;
    }

    // Greedy formula:
    // Imagine maxFreq tasks arranged in blocks separated by n cooldown
    // (maxFreq - 1) blocks × (n + 1) slots + maxCount
    int minTime = (maxFreq - 1) * (n + 1) + maxCount;

    // Answer is max of formula and total tasks
    // (in case cooldown is small, just do all tasks sequentially)
    return Math.max(tasks.length, minTime);
}

// Time: O(n) - n = number of tasks
// Space: O(1) - fixed size frequency array
// Greedy: Always schedule most frequent task to minimize idle time`}
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
            <h3 className="text-2xl font-bold text-gray-800 mb-3">More Classic Greedy Problems</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">🎯 Jump Game II</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find minimum jumps to reach end. Use two pointers tracking current and next reach.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n), Space: O(1)<br/>
                  LeetCode 45
                </div>
              </div>

              <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">🍬 Candy</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Distribute candy based on ratings. Two-pass greedy: left-to-right, then right-to-left.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n), Space: O(n)<br/>
                  LeetCode 135
                </div>
              </div>

              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">🎈 Minimum Arrows to Burst Balloons</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Sort by end point, shoot arrow at earliest ending balloon.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n log n), Space: O(1)<br/>
                  LeetCode 452
                </div>
              </div>

              <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-800 mb-2">📝 Partition Labels</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Partition string so each letter appears in at most one part.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n), Space: O(1)<br/>
                  LeetCode 763
                </div>
              </div>

              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">🏃 Queue Reconstruction by Height</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Sort by height descending, then insert by k value.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n²), Space: O(n)<br/>
                  LeetCode 406
                </div>
              </div>

              <div className="border-2 border-pink-200 bg-pink-50 rounded-lg p-4">
                <h4 className="font-bold text-pink-800 mb-2">💰 IPO (Maximum Capital)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Maximize capital by selecting k projects. Use two heaps (greedy + heap pattern).
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n log n), Space: O(n)<br/>
                  LeetCode 502
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Proving Greedy Correctness</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-800 mb-2">1. Exchange Argument</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Prove that if optimal solution differs from greedy, you can "exchange" choices to match greedy without worsening the solution.
                </p>
                <p className="text-xs text-gray-600">
                  Example: Activity selection - if optimal picks later-ending activity, exchange it for earlier-ending one
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-800 mb-2">2. Stay-Ahead Argument</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Prove greedy solution "stays ahead" of any other solution at every step. Show greedy is at least as good.
                </p>
                <p className="text-xs text-gray-600">
                  Example: Interval scheduling - greedy always finishes current activity at least as early
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-800 mb-2">3. Structural Property</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Show that greedy choice preserves optimal substructure - optimal solution contains greedy choice.
                </p>
                <p className="text-xs text-gray-600">
                  Example: Fractional knapsack - taking max value/weight ratio preserves optimality
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🎯 Interview Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Keywords:</strong> "minimum/maximum", "optimal", "scheduling", "intervals" often hint greedy</li>
              <li>• <strong>Try sorting first:</strong> Many greedy problems benefit from sorted data</li>
              <li>• <strong>Prove correctness:</strong> Interviewer may ask why greedy works - be ready to explain</li>
              <li>• <strong>Compare with DP:</strong> If greedy seems wrong, problem might need DP instead</li>
              <li>• <strong>Common patterns:</strong> Interval scheduling, reachability, heap-based greedy</li>
              <li>• <strong>Edge cases:</strong> Empty array, single element, all same values</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Company Interview Questions</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Google:</strong> Jump Game II, Meeting Rooms II, IPO, Minimum Arrows</li>
                <li>• <strong>Facebook/Meta:</strong> Task Scheduler, Partition Labels, Remove Duplicate Letters</li>
                <li>• <strong>Amazon:</strong> Jump Game, Gas Station, Queue Reconstruction by Height</li>
                <li>• <strong>Microsoft:</strong> Candy, Non-overlapping Intervals, Assign Cookies</li>
                <li>• <strong>Apple:</strong> Minimum Cost to Connect Sticks, Reorganize String</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ Common Mistakes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Using greedy when DP is needed (e.g., Coin Change minimum coins)</li>
              <li>• Not proving why greedy choice property holds</li>
              <li>• Forgetting to sort when problem requires ordered processing</li>
              <li>• Not considering all edge cases (empty, single element)</li>
              <li>• Confusing "locally optimal" with "looks good" - need mathematical proof</li>
              <li>• Not using heap when greedy needs best available element repeatedly</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default GreedyAlgorithmsVisualizer
