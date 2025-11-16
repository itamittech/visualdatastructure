import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function UnionFindVisualizer() {
  const [activeTab, setActiveTab] = useState('theory')
  const [selectedProblem, setSelectedProblem] = useState('basic')

  // Basic Union-Find state
  const [numNodes, setNumNodes] = useState(6)
  const [parent, setParent] = useState([0, 1, 2, 3, 4, 5])
  const [rank, setRank] = useState([0, 0, 0, 0, 0, 0])
  const [operations, setOperations] = useState([])
  const [currentOp, setCurrentOp] = useState(0)

  // Number of Islands state
  const [grid, setGrid] = useState([
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1]
  ])
  const [islandCount, setIslandCount] = useState(0)
  const [islandSteps, setIslandSteps] = useState([])
  const [islandCurrentStep, setIslandCurrentStep] = useState(0)

  // Redundant Connection state
  const [edges, setEdges] = useState([[1, 2], [1, 3], [2, 3]])
  const [redundantEdge, setRedundantEdge] = useState(null)
  const [edgeSteps, setEdgeSteps] = useState([])
  const [edgeCurrentStep, setEdgeCurrentStep] = useState(0)

  // Initialize Union-Find
  const initializeUF = (n) => {
    const newParent = Array.from({ length: n }, (_, i) => i)
    const newRank = Array(n).fill(0)
    setParent(newParent)
    setRank(newRank)
    setOperations([{
      type: 'init',
      parent: [...newParent],
      rank: [...newRank],
      description: `Initialized ${n} disjoint sets. Each element is its own parent.`
    }])
    setCurrentOp(0)
  }

  // Find with path compression
  const find = (parentArray, x, steps = null) => {
    const path = []
    let current = x

    // Find root
    while (parentArray[current] !== current) {
      path.push(current)
      current = parentArray[current]
    }
    const root = current

    if (steps) {
      steps.push({
        type: 'find',
        element: x,
        root: root,
        path: [...path, root],
        description: `Find(${x}): Path to root ${root}: ${[x, ...path.slice(1), root].join(' → ')}`
      })
    }

    // Path compression
    for (let node of path) {
      parentArray[node] = root
    }

    return root
  }

  // Union by rank
  const union = (x, y) => {
    const newParent = [...parent]
    const newRank = [...rank]
    const steps = [...operations]

    const rootX = find(newParent, x, steps)
    const rootY = find(newParent, y, steps)

    if (rootX === rootY) {
      steps.push({
        type: 'union-same',
        x, y,
        parent: [...newParent],
        rank: [...newRank],
        description: `Union(${x}, ${y}): Already in same set (root ${rootX}). No action needed.`
      })
    } else {
      // Union by rank
      if (newRank[rootX] < newRank[rootY]) {
        newParent[rootX] = rootY
        steps.push({
          type: 'union',
          x, y,
          parent: [...newParent],
          rank: [...newRank],
          description: `Union(${x}, ${y}): Attach tree ${rootX} under ${rootY} (rank ${newRank[rootX]} < ${newRank[rootY]})`
        })
      } else if (newRank[rootX] > newRank[rootY]) {
        newParent[rootY] = rootX
        steps.push({
          type: 'union',
          x, y,
          parent: [...newParent],
          rank: [...newRank],
          description: `Union(${x}, ${y}): Attach tree ${rootY} under ${rootX} (rank ${newRank[rootY]} < ${newRank[rootX]})`
        })
      } else {
        newParent[rootY] = rootX
        newRank[rootX]++
        steps.push({
          type: 'union',
          x, y,
          parent: [...newParent],
          rank: [...newRank],
          description: `Union(${x}, ${y}): Attach ${rootY} under ${rootX} and increase rank[${rootX}] to ${newRank[rootX]}`
        })
      }
    }

    setParent(newParent)
    setRank(newRank)
    setOperations(steps)
    setCurrentOp(steps.length - 1)
  }

  // Count components
  const countComponents = () => {
    const roots = new Set()
    const tempParent = [...parent]

    for (let i = 0; i < parent.length; i++) {
      const root = find(tempParent, i)
      roots.add(root)
    }

    return roots.size
  }

  // Number of Islands solver
  const solveNumberOfIslands = () => {
    const rows = grid.length
    const cols = grid[0].length
    const steps = []

    // Create UF with all cells
    const size = rows * cols
    const ufParent = Array.from({ length: size }, (_, i) => i)
    const ufRank = Array(size).fill(0)

    const getIndex = (r, c) => r * cols + c

    const ufFind = (p, x) => {
      if (p[x] !== x) {
        p[x] = ufFind(p, p[x])
      }
      return p[x]
    }

    const ufUnion = (p, r, x, y) => {
      const rootX = ufFind(p, x)
      const rootY = ufFind(p, y)

      if (rootX !== rootY) {
        if (r[rootX] < r[rootY]) {
          p[rootX] = rootY
        } else if (r[rootX] > r[rootY]) {
          p[rootY] = rootX
        } else {
          p[rootY] = rootX
          r[rootX]++
        }
        return true
      }
      return false
    }

    steps.push({
      description: 'Initialize: Each land cell is its own component',
      parent: [...ufParent],
      processedCells: []
    })

    // Process each cell
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1) {
          const current = getIndex(r, c)
          const processedCells = []

          // Check right neighbor
          if (c + 1 < cols && grid[r][c + 1] === 1) {
            const right = getIndex(r, c + 1)
            if (ufUnion(ufParent, ufRank, current, right)) {
              processedCells.push({ from: [r, c], to: [r, c + 1] })
            }
          }

          // Check down neighbor
          if (r + 1 < rows && grid[r + 1][c] === 1) {
            const down = getIndex(r + 1, c)
            if (ufUnion(ufParent, ufRank, current, down)) {
              processedCells.push({ from: [r, c], to: [r + 1, c] })
            }
          }

          if (processedCells.length > 0) {
            steps.push({
              description: `Cell (${r},${c}): Union with adjacent land cells`,
              parent: [...ufParent],
              processedCells
            })
          }
        }
      }
    }

    // Count islands
    const islands = new Set()
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1) {
          islands.add(ufFind(ufParent, getIndex(r, c)))
        }
      }
    }

    steps.push({
      description: `Found ${islands.size} island(s)`,
      parent: [...ufParent],
      processedCells: [],
      islandCount: islands.size
    })

    setIslandCount(islands.size)
    setIslandSteps(steps)
    setIslandCurrentStep(0)
  }

  // Redundant Connection solver
  const solveRedundantConnection = () => {
    const n = Math.max(...edges.flat())
    const ufParent = Array.from({ length: n + 1 }, (_, i) => i)
    const steps = []
    let redundant = null

    const ufFind = (p, x) => {
      if (p[x] !== x) {
        p[x] = ufFind(p, p[x])
      }
      return p[x]
    }

    steps.push({
      description: `Initialize ${n} nodes`,
      parent: [...ufParent],
      currentEdge: null,
      status: 'init'
    })

    for (let [u, v] of edges) {
      const rootU = ufFind(ufParent, u)
      const rootV = ufFind(ufParent, v)

      if (rootU === rootV) {
        redundant = [u, v]
        steps.push({
          description: `Edge [${u}, ${v}] creates a cycle! Both nodes have same root ${rootU}. This is the redundant edge.`,
          parent: [...ufParent],
          currentEdge: [u, v],
          status: 'redundant'
        })
        break
      } else {
        ufParent[rootU] = rootV
        steps.push({
          description: `Edge [${u}, ${v}]: Union successful. Connect ${rootU} → ${rootV}`,
          parent: [...ufParent],
          currentEdge: [u, v],
          status: 'union'
        })
      }
    }

    setRedundantEdge(redundant)
    setEdgeSteps(steps)
    setEdgeCurrentStep(0)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Union-Find (Disjoint Set)</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="text-5xl font-bold mb-4">🔗 Union-Find (Disjoint Set)</h1>
        <p className="text-xl opacity-90 mb-4">
          Master dynamic connectivity! Essential for 5-8% of FAANG interviews, especially graph problems.
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Union O(α(n)) ≈ O(1)</div>
          </div>
          <div className="text-xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Find O(α(n)) ≈ O(1)</div>
          </div>
          <div className="text-xl">+</div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="font-bold">Path Compression</div>
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
                ? 'bg-emerald-600 text-white'
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What is Union-Find?</h2>
            <p className="text-gray-700 mb-4">
              Union-Find (also called Disjoint Set Union, DSU) is a data structure that tracks elements partitioned into
              non-overlapping sets. It provides near-constant-time operations to:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li><strong>Find:</strong> Determine which set an element belongs to (find its root/representative)</li>
              <li><strong>Union:</strong> Merge two sets into one</li>
              <li><strong>Connected:</strong> Check if two elements are in the same set</li>
            </ul>
          </div>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4">
            <p className="font-semibold text-emerald-900 mb-2">🎯 Core Concept</p>
            <p className="text-gray-700">
              Think of it as managing groups of friends. Initially, everyone is alone. When two people become friends (union),
              their groups merge. You can quickly check if two people are in the same friend circle (find).
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Key Operations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">🔍 Find(x)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find the root (representative) of the set containing x. Uses path compression to optimize future queries.
                </p>
                <div className="bg-white p-2 rounded font-mono text-xs">
                  find(x):<br/>
                  &nbsp;&nbsp;if parent[x] ≠ x:<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;parent[x] = find(parent[x])<br/>
                  &nbsp;&nbsp;return parent[x]
                </div>
              </div>

              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">🔗 Union(x, y)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Merge the sets containing x and y. Uses union by rank to keep trees shallow.
                </p>
                <div className="bg-white p-2 rounded font-mono text-xs">
                  union(x, y):<br/>
                  &nbsp;&nbsp;rootX = find(x)<br/>
                  &nbsp;&nbsp;rootY = find(y)<br/>
                  &nbsp;&nbsp;if rank[rootX] &lt; rank[rootY]:<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;parent[rootX] = rootY
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Optimizations</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                <h4 className="font-bold text-purple-800 mb-2">1. Path Compression</h4>
                <p className="text-gray-700 mb-2">
                  During find(x), make all nodes on the path point directly to the root. This flattens the tree structure.
                </p>
                <p className="text-sm text-gray-600">
                  Example: If path is 5 → 3 → 1 → 0 (root), after find(5), all point to 0: parent[5]=0, parent[3]=0, parent[1]=0
                </p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                <h4 className="font-bold text-orange-800 mb-2">2. Union by Rank (or Size)</h4>
                <p className="text-gray-700 mb-2">
                  Always attach the smaller tree under the larger tree's root. This keeps trees shallow.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Rank:</strong> Upper bound on tree height. <strong>Size:</strong> Number of elements in set.
                  Both work, rank is slightly more common.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Time & Space Complexity</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Operation</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Without Optimization</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">With Path Compression + Union by Rank</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Find</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(α(n)) ≈ O(1)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Union</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">O(α(n)) ≈ O(1)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Space</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm" colSpan="2">O(n) for parent and rank arrays</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-2">
                * α(n) is the inverse Ackermann function, which grows extremely slowly. For all practical values of n, α(n) ≤ 5.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">When to Use Union-Find?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">✅ Perfect For:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Dynamic connectivity queries</li>
                  <li>• Detecting cycles in undirected graphs</li>
                  <li>• Finding connected components</li>
                  <li>• Kruskal's MST algorithm</li>
                  <li>• Network connectivity problems</li>
                  <li>• Percolation problems</li>
                  <li>• Examples: Number of Islands, Redundant Connection</li>
                </ul>
              </div>

              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">❌ Not Suitable For:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Finding paths between nodes (use BFS/DFS)</li>
                  <li>• Directed graphs (Union-Find is for undirected)</li>
                  <li>• Removing edges (Union-Find doesn't support deletion)</li>
                  <li>• When you need to iterate over set members</li>
                  <li>• Shortest path problems (use Dijkstra/BFS)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">💡 Key Insights</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Nearly Constant Time:</strong> With optimizations, operations are practically O(1)</li>
              <li>• <strong>Simple Implementation:</strong> Just two arrays (parent and rank) and two functions</li>
              <li>• <strong>Graph Alternative:</strong> Often simpler than DFS/BFS for connectivity problems</li>
              <li>• <strong>No Deletion:</strong> Can't remove edges or separate sets (limitation)</li>
              <li>• <strong>Interview Favorite:</strong> Common at Google, Facebook for graph problems</li>
            </ul>
          </div>
        </div>
      )}

      {/* Practice Tab */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Interactive Problems</h2>

          {/* Problem Selector */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedProblem('basic')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'basic'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Basic Operations
            </button>
            <button
              onClick={() => setSelectedProblem('islands')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'islands'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Number of Islands
            </button>
            <button
              onClick={() => setSelectedProblem('redundant')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedProblem === 'redundant'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Redundant Connection
            </button>
          </div>

          {/* Basic Operations */}
          {selectedProblem === 'basic' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Basic Union-Find Operations</h3>
                <p className="text-gray-700">
                  Experiment with union and find operations. See how path compression and union by rank optimize the structure.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700">Number of elements:</label>
                <input
                  type="number"
                  value={numNodes}
                  onChange={(e) => {
                    const n = Math.min(10, Math.max(2, parseInt(e.target.value) || 2))
                    setNumNodes(n)
                    initializeUF(n)
                  }}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-24"
                  min="2"
                  max="10"
                />
                <button
                  onClick={() => initializeUF(numNodes)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Reset
                </button>
              </div>

              {/* Parent Array Visualization */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Parent Array:</h4>
                <div className="flex space-x-2 mb-2">
                  {parent.map((p, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">Index</div>
                      <div className="w-12 h-12 bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center font-bold">
                        {i}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  {parent.map((p, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-100 border-2 border-green-400 rounded flex items-center justify-center font-bold">
                        {p}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Parent</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rank Array */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Rank Array (tree height):</h4>
                <div className="flex space-x-2">
                  {rank.map((r, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-purple-100 border-2 border-purple-400 rounded flex items-center justify-center font-bold">
                        {r}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">[{i}]</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Union Controls */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Perform Operations:</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: numNodes }, (_, i) => i).map(i =>
                    Array.from({ length: numNodes }, (_, j) => j)
                      .filter(j => j > i)
                      .map(j => (
                        <button
                          key={`${i}-${j}`}
                          onClick={() => union(i, j)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Union({i}, {j})
                        </button>
                      ))
                  )}
                </div>
              </div>

              {/* Components Count */}
              <div className="bg-green-50 border border-green-300 rounded p-3">
                <div className="text-green-800 font-bold">
                  Number of Components: {countComponents()}
                </div>
              </div>

              {/* Operation History */}
              {operations.length > 1 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Operation History:</h4>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => {
                        const newOp = Math.max(0, currentOp - 1)
                        setCurrentOp(newOp)
                        setParent(operations[newOp].parent)
                        setRank(operations[newOp].rank)
                      }}
                      disabled={currentOp === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {currentOp + 1} of {operations.length}
                    </span>
                    <button
                      onClick={() => {
                        const newOp = Math.min(operations.length - 1, currentOp + 1)
                        setCurrentOp(newOp)
                        setParent(operations[newOp].parent)
                        setRank(operations[newOp].rank)
                      }}
                      disabled={currentOp === operations.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded border border-blue-300">
                    <div className="text-gray-800">{operations[currentOp]?.description}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Number of Islands */}
          {selectedProblem === 'islands' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Number of Islands</h3>
                <p className="text-gray-700 mb-2">
                  Count the number of islands in a 2D grid. An island is surrounded by water and formed by connecting adjacent lands
                  horizontally or vertically.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Approach:</strong> Use Union-Find to merge adjacent land cells. Final component count = number of islands.
                </p>
              </div>

              <button
                onClick={solveNumberOfIslands}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-semibold"
              >
                Solve
              </button>

              {/* Grid Visualization */}
              <div className="flex justify-center">
                <div className="inline-block border-4 border-gray-800 rounded">
                  {grid.map((row, r) => (
                    <div key={r} className="flex">
                      {row.map((cell, c) => (
                        <div
                          key={c}
                          className={`w-14 h-14 flex items-center justify-center border border-gray-300 font-bold ${
                            cell === 1 ? 'bg-green-400 text-white' : 'bg-blue-300 text-blue-700'
                          }`}
                        >
                          {cell === 1 ? '🏝️' : '🌊'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {islandSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-300 rounded p-3">
                    <div className="text-green-800 font-bold">
                      Number of Islands: {islandCount}
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setIslandCurrentStep(Math.max(0, islandCurrentStep - 1))}
                      disabled={islandCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {islandCurrentStep + 1} of {islandSteps.length}
                    </span>
                    <button
                      onClick={() => setIslandCurrentStep(Math.min(islandSteps.length - 1, islandCurrentStep + 1))}
                      disabled={islandCurrentStep === islandSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded border border-blue-300">
                    <div className="text-gray-800">{islandSteps[islandCurrentStep]?.description}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Redundant Connection */}
          {selectedProblem === 'redundant' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-bold text-blue-900 mb-2">Problem: Redundant Connection</h3>
                <p className="text-gray-700 mb-2">
                  Find the edge that, when removed, makes the graph a tree (no cycles). Return the edge that appears last in the input.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Approach:</strong> Process edges one by one. The first edge where both nodes are already connected creates a cycle.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Edges: {JSON.stringify(edges)}</h4>
                <button
                  onClick={solveRedundantConnection}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Find Redundant Edge
                </button>
              </div>

              {redundantEdge && (
                <div className="bg-red-50 border border-red-300 rounded p-3">
                  <div className="text-red-800 font-bold">
                    Redundant Edge: [{redundantEdge[0]}, {redundantEdge[1]}]
                  </div>
                </div>
              )}

              {edgeSteps.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setEdgeCurrentStep(Math.max(0, edgeCurrentStep - 1))}
                      disabled={edgeCurrentStep === 0}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-700 font-semibold">
                      Step {edgeCurrentStep + 1} of {edgeSteps.length}
                    </span>
                    <button
                      onClick={() => setEdgeCurrentStep(Math.min(edgeSteps.length - 1, edgeCurrentStep + 1))}
                      disabled={edgeCurrentStep === edgeSteps.length - 1}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  <div className={`p-4 rounded border-2 ${
                    edgeSteps[edgeCurrentStep]?.status === 'redundant'
                      ? 'bg-red-50 border-red-300'
                      : edgeSteps[edgeCurrentStep]?.status === 'union'
                      ? 'bg-green-50 border-green-300'
                      : 'bg-blue-50 border-blue-300'
                  }`}>
                    <div className="text-gray-800">{edgeSteps[edgeCurrentStep]?.description}</div>
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

          {/* Basic Union-Find */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">1. Union-Find with Path Compression & Union by Rank</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Optimized Union-Find
class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;  // Each element is its own parent initially
            rank[i] = 0;    // Initial rank is 0
        }
    }

    // Find with path compression
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression: point directly to root
        }
        return parent[x];
    }

    // Union by rank
    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) {
            return false;  // Already in same set
        }

        // Attach smaller rank tree under larger rank tree
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;  // Increase rank only when equal
        }

        return true;
    }

    // Check if connected
    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}

// Time: O(α(n)) ≈ O(1) for both find and union
// Space: O(n) for parent and rank arrays`}
              </pre>
            </div>
          </div>

          {/* Number of Islands */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">2. Number of Islands (LeetCode 200)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Number of Islands using Union-Find
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;

    int rows = grid.length;
    int cols = grid[0].length;
    UnionFind uf = new UnionFind(rows * cols);
    int waterCount = 0;

    // Convert 2D coordinates to 1D index
    int getIndex(int r, int c) {
        return r * cols + c;
    }

    // Process each cell
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '0') {
                waterCount++;
                continue;
            }

            int current = getIndex(r, c);

            // Union with right neighbor if it's land
            if (c + 1 < cols && grid[r][c + 1] == '1') {
                uf.union(current, getIndex(r, c + 1));
            }

            // Union with down neighbor if it's land
            if (r + 1 < rows && grid[r + 1][c] == '1') {
                uf.union(current, getIndex(r + 1, c));
            }
        }
    }

    // Count unique roots for land cells
    Set<Integer> islands = new HashSet<>();
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                islands.add(uf.find(getIndex(r, c)));
            }
        }
    }

    return islands.size();
}

// Time: O(m × n × α(m×n)) ≈ O(m × n)
// Space: O(m × n) for Union-Find structure`}
              </pre>
            </div>
          </div>

          {/* Redundant Connection */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">3. Redundant Connection (LeetCode 684)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Find redundant edge that creates a cycle
public int[] findRedundantConnection(int[][] edges) {
    int n = edges.length;
    UnionFind uf = new UnionFind(n + 1);  // Nodes are 1-indexed

    for (int[] edge : edges) {
        int u = edge[0];
        int v = edge[1];

        // If already connected, this edge creates a cycle
        if (!uf.union(u, v)) {
            return edge;  // This is the redundant edge
        }
    }

    return new int[]{};  // Should never reach here
}

// Time: O(n × α(n)) ≈ O(n)
// Space: O(n)
// Key insight: In a tree with n nodes, there are n-1 edges.
// The n-th edge creates a cycle.`}
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
                <h4 className="font-bold text-blue-800 mb-2">🏝️ Number of Islands II</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Dynamic version: Add islands one by one, report count after each addition. Perfect for Union-Find!
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(k × α(m×n)) where k = operations<br/>
                  LeetCode 305 (Premium)
                </div>
              </div>

              <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">👥 Friend Circles</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find number of friend circles given friendship matrix. Each circle is a connected component.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n² × α(n))<br/>
                  LeetCode 547 (Now called "Number of Provinces")
                </div>
              </div>

              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">📧 Accounts Merge</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Merge accounts belonging to same person based on shared emails. Union emails, group by person.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n × k × α(n×k))<br/>
                  LeetCode 721
                </div>
              </div>

              <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-800 mb-2">🌳 Minimum Spanning Tree (Kruskal's)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Find MST using Kruskal's algorithm. Sort edges, use Union-Find to detect cycles.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(E log E) for sorting<br/>
                  Classic algorithm using Union-Find
                </div>
              </div>

              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">🔗 Graph Valid Tree</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Check if n nodes and given edges form a valid tree. Must be connected and have n-1 edges.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n × α(n))<br/>
                  LeetCode 261 (Premium)
                </div>
              </div>

              <div className="border-2 border-pink-200 bg-pink-50 rounded-lg p-4">
                <h4 className="font-bold text-pink-800 mb-2">🎯 Satisfiability of Equality Equations</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Given equations like "a==b", "b!=c", determine if all can be satisfied simultaneously.
                </p>
                <div className="text-xs font-mono text-gray-600">
                  Time: O(n × α(26)) ≈ O(n)<br/>
                  LeetCode 990
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Union by Size (Alternative to Union by Rank)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
{`// Java - Union-Find with Union by Size
class UnionFindBySize {
    private int[] parent;
    private int[] size;  // Size instead of rank

    public UnionFindBySize(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;  // Each set has 1 element initially
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return false;

        // Attach smaller set under larger set
        if (size[rootX] < size[rootY]) {
            parent[rootX] = rootY;
            size[rootY] += size[rootX];
        } else {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }

        return true;
    }

    // Get size of set containing x
    public int getSize(int x) {
        return size[find(x)];
    }
}

// Both union by rank and union by size work well.
// Size is useful when you need to know component sizes.`}
              </pre>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🎯 Interview Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Recognition:</strong> Keywords "connected components", "dynamic connectivity", "cycle detection"</li>
              <li>• <strong>Template:</strong> Memorize the basic Union-Find class - it's short and reusable</li>
              <li>• <strong>Optimizations:</strong> Always implement both path compression and union by rank/size</li>
              <li>• <strong>Edge cases:</strong> Single element, all disconnected, all connected</li>
              <li>• <strong>Alternatives:</strong> For static graphs, DFS/BFS might be simpler. Union-Find shines for dynamic updates</li>
              <li>• <strong>Common variations:</strong> Counting components, checking connectivity, finding redundant edges</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Company Interview Questions</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Google:</strong> Number of Islands II, Accounts Merge, Smallest String With Swaps</li>
                <li>• <strong>Facebook/Meta:</strong> Friend Circles, Redundant Connection, Evaluate Division</li>
                <li>• <strong>Amazon:</strong> Number of Islands, Graph Valid Tree, Most Stones Removed</li>
                <li>• <strong>Microsoft:</strong> Satisfiability of Equality Equations, Minimize Malware Spread</li>
                <li>• <strong>Apple:</strong> Connecting Cities With Minimum Cost (MST with Kruskal)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ Common Mistakes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Forgetting path compression in find() - loses nearly all optimization</li>
              <li>• Not implementing union by rank/size - can lead to O(n) operations</li>
              <li>• Using Union-Find for directed graphs (it only works for undirected)</li>
              <li>• Trying to remove edges (Union-Find doesn't support deletion)</li>
              <li>• Off-by-one errors when nodes are 1-indexed vs 0-indexed</li>
              <li>• Not handling the case where sets are already connected in union()</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default UnionFindVisualizer
