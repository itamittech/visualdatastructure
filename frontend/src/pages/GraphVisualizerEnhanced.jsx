import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function GraphVisualizerEnhanced() {
  // Graph represented as adjacency list
  const [graph, setGraph] = useState({
    0: [1, 2],
    1: [0, 2, 3],
    2: [0, 1, 3],
    3: [1, 2, 4],
    4: [3]
  })
  const [numVertices, setNumVertices] = useState(5)
  const [fromVertex, setFromVertex] = useState('')
  const [toVertex, setToVertex] = useState('')
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [traversalResult, setTraversalResult] = useState([])
  const [traversalType, setTraversalType] = useState('')
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [isDirected, setIsDirected] = useState(false)

  const handleAddEdge = () => {
    const from = parseInt(fromVertex)
    const to = parseInt(toVertex)

    if (isNaN(from) || isNaN(to) || from < 0 || to < 0 || from >= numVertices || to >= numVertices) {
      setMessage('Invalid vertices. Enter numbers between 0 and ' + (numVertices - 1))
      return
    }

    if (from === to) {
      setMessage('Self-loops not allowed in this visualization')
      return
    }

    const newGraph = { ...graph }

    // Ensure vertices exist
    if (!newGraph[from]) newGraph[from] = []
    if (!newGraph[to]) newGraph[to] = []

    // Add edge
    if (!newGraph[from].includes(to)) {
      newGraph[from] = [...newGraph[from], to]
      if (!isDirected && !newGraph[to].includes(from)) {
        newGraph[to] = [...newGraph[to], from]
      }
      setGraph(newGraph)
      setMessage(`Added edge ${from} → ${to}${isDirected ? '' : ' (bidirectional)'}`)
    } else {
      setMessage(`Edge ${from} → ${to} already exists`)
    }

    setFromVertex('')
    setToVertex('')
  }

  const handleRemoveEdge = () => {
    const from = parseInt(fromVertex)
    const to = parseInt(toVertex)

    if (isNaN(from) || isNaN(to)) {
      setMessage('Invalid vertices')
      return
    }

    const newGraph = { ...graph }
    if (newGraph[from]) {
      newGraph[from] = newGraph[from].filter(v => v !== to)
    }
    if (!isDirected && newGraph[to]) {
      newGraph[to] = newGraph[to].filter(v => v !== from)
    }

    setGraph(newGraph)
    setMessage(`Removed edge ${from} → ${to}`)
    setFromVertex('')
    setToVertex('')
  }

  // BFS traversal
  const bfs = (start) => {
    const visited = new Set()
    const queue = [start]
    const result = []

    visited.add(start)

    while (queue.length > 0) {
      const vertex = queue.shift()
      result.push(vertex)

      const neighbors = graph[vertex] || []
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    return result
  }

  // DFS traversal
  const dfs = (start, visited = new Set(), result = []) => {
    visited.add(start)
    result.push(start)

    const neighbors = graph[start] || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, visited, result)
      }
    }

    return result
  }

  const handleBFS = () => {
    const result = bfs(0)
    setTraversalResult(result)
    setTraversalType('BFS')
    setHighlightedNodes(new Set(result))
    setMessage(`BFS from vertex 0: ${result.join(' → ')}`)

    setTimeout(() => setHighlightedNodes(new Set()), 3000)
  }

  const handleDFS = () => {
    const result = dfs(0)
    setTraversalResult(result)
    setTraversalType('DFS')
    setHighlightedNodes(new Set(result))
    setMessage(`DFS from vertex 0: ${result.join(' → ')}`)

    setTimeout(() => setHighlightedNodes(new Set()), 3000)
  }

  // Render graph visualization
  const renderGraph = () => {
    const positions = {
      0: { x: 200, y: 100 },
      1: { x: 400, y: 100 },
      2: { x: 100, y: 250 },
      3: { x: 300, y: 250 },
      4: { x: 500, y: 250 },
    }

    const elements = []

    // Draw edges
    Object.keys(graph).forEach(from => {
      const fromNum = parseInt(from)
      if (positions[fromNum]) {
        graph[from].forEach(to => {
          if (positions[to]) {
            const x1 = positions[fromNum].x
            const y1 = positions[fromNum].y
            const x2 = positions[to].x
            const y2 = positions[to].y

            elements.push(
              <line
                key={`edge-${from}-${to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#9CA3AF"
                strokeWidth="2"
                markerEnd={isDirected ? "url(#arrowhead)" : ""}
              />
            )
          }
        })
      }
    })

    // Draw vertices
    for (let i = 0; i < Math.min(numVertices, 5); i++) {
      if (positions[i]) {
        const isHighlighted = highlightedNodes.has(i)
        elements.push(
          <g key={`vertex-${i}`}>
            <circle
              cx={positions[i].x}
              cy={positions[i].y}
              r="30"
              fill={isHighlighted ? '#FCD34D' : '#3B82F6'}
              stroke="#1E40AF"
              strokeWidth="2"
            />
            <text
              x={positions[i].x}
              y={positions[i].y}
              textAnchor="middle"
              dy=".3em"
              fill="white"
              fontSize="20"
              fontWeight="bold"
            >
              {i}
            </text>
          </g>
        )
      }
    }

    return elements
  }

  const complexityData = {
    operations: [
      {
        name: 'Add Vertex',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Add vertex to adjacency list. Just create new list entry - constant time!'
      },
      {
        name: 'Add Edge',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Add edge to adjacency list. Append to list - amortized O(1).'
      },
      {
        name: 'Remove Edge',
        time: 'O(E)',
        space: 'O(1)',
        description: 'Find and remove edge from list. Must search through adjacency list.'
      },
      {
        name: 'BFS Traversal',
        time: 'O(V + E)',
        space: 'O(V)',
        description: 'Visit all vertices and edges once. Queue space for vertices.'
      },
      {
        name: 'DFS Traversal',
        time: 'O(V + E)',
        space: 'O(V)',
        description: 'Visit all vertices and edges once. Recursion stack space.'
      },
      {
        name: 'Check Adjacent',
        time: 'O(V) list, O(1) matrix',
        space: 'O(1)',
        description: 'List: scan neighbors. Matrix: direct array access.'
      },
    ]
  }

  const scratchCode = `// Graph Implementation from Scratch
import java.util.*;

/**
 * GRAPH: Collection of vertices (nodes) connected by edges
 *
 * Types:
 * - Directed: Edges have direction (A → B ≠ B → A)
 * - Undirected: Edges bidirectional (A—B means both A→B and B→A)
 * - Weighted: Edges have weights/costs
 * - Unweighted: All edges equal weight
 *
 * Two main representations:
 * 1. Adjacency List: HashMap of vertex → list of neighbors
 * 2. Adjacency Matrix: 2D array[i][j] = edge from i to j
 */

// Adjacency List Representation (RECOMMENDED for sparse graphs!)
public class Graph {
    private Map<Integer, List<Integer>> adjList;
    private int numVertices;
    private boolean isDirected;

    /**
     * WHY Adjacency List?
     *
     * Space: O(V + E)
     * - Stores only existing edges
     * - Perfect for sparse graphs (few edges)
     *
     * Example: 1000 vertices, 2000 edges
     * - Matrix: 1000 × 1000 = 1M entries! (999,998 wasted)
     * - List: 1000 + 2000 = 3000 entries ✓
     *
     * Use when: Most vertices not connected
     * Social network: billions of users, ~150 friends each
     */
    public Graph(int numVertices, boolean isDirected) {
        this.numVertices = numVertices;
        this.isDirected = isDirected;
        this.adjList = new HashMap<>();

        // Initialize all vertices
        for (int i = 0; i < numVertices; i++) {
            adjList.put(i, new ArrayList<>());
        }
    }

    /**
     * WHY O(1) ADD EDGE?
     * Just append to ArrayList!
     * Amortized O(1) due to dynamic resizing
     */
    public void addEdge(int from, int to) {
        adjList.get(from).add(to);

        if (!isDirected) {
            adjList.get(to).add(from);  // Bidirectional
        }
    }

    /**
     * BFS (Breadth-First Search) - Level-by-level exploration
     *
     * WHY O(V + E)?
     * - Visit each vertex once: O(V)
     * - Check each edge once: O(E)
     * - Total: O(V + E)
     *
     * Use BFS for:
     * - Shortest path in unweighted graph
     * - Level-order traversal
     * - Finding connected components
     * - Testing bipartiteness
     *
     * Example: Social network "degrees of separation"
     * BFS finds shortest friend chain!
     */
    public List<Integer> bfs(int start) {
        List<Integer> result = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();

        visited.add(start);
        queue.offer(start);

        while (!queue.isEmpty()) {
            int vertex = queue.poll();
            result.add(vertex);

            // Visit all unvisited neighbors
            for (int neighbor : adjList.get(vertex)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }

        return result;
    }

    /**
     * DFS (Depth-First Search) - Go deep before wide
     *
     * WHY O(V + E)?
     * - Visit each vertex once: O(V)
     * - Check each edge once: O(E)
     * - Total: O(V + E)
     *
     * Use DFS for:
     * - Topological sort
     * - Detecting cycles
     * - Finding strongly connected components
     * - Maze solving
     * - Backtracking problems
     *
     * Example: Maze solving
     * DFS explores one path completely before backtracking
     */
    public List<Integer> dfs(int start) {
        List<Integer> result = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        dfsHelper(start, visited, result);
        return result;
    }

    private void dfsHelper(int vertex, Set<Integer> visited, List<Integer> result) {
        visited.add(vertex);
        result.add(vertex);

        for (int neighbor : adjList.get(vertex)) {
            if (!visited.contains(neighbor)) {
                dfsHelper(neighbor, visited, result);
            }
        }
    }

    /**
     * Detect Cycle in Undirected Graph
     *
     * Use DFS with parent tracking
     * If we visit a node that's already visited
     * AND it's not our parent → cycle found!
     */
    public boolean hasCycle() {
        Set<Integer> visited = new HashSet<>();

        // Check all components
        for (int i = 0; i < numVertices; i++) {
            if (!visited.contains(i)) {
                if (hasCycleUtil(i, -1, visited)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean hasCycleUtil(int v, int parent, Set<Integer> visited) {
        visited.add(v);

        for (int neighbor : adjList.get(v)) {
            if (!visited.contains(neighbor)) {
                if (hasCycleUtil(neighbor, v, visited)) {
                    return true;
                }
            } else if (neighbor != parent) {
                return true;  // Visited non-parent = cycle!
            }
        }
        return false;
    }
}

/**
 * Adjacency Matrix Representation
 *
 * WHY Matrix?
 * - O(1) edge lookup: matrix[i][j]
 * - Simple for dense graphs
 * - Better cache locality for dense graphs
 *
 * Space: O(V²)
 * - Always V² space, even with few edges!
 *
 * Use when: Most vertices connected (dense graph)
 * Example: Complete graph (every vertex connected to all others)
 */
class GraphMatrix {
    private int[][] matrix;
    private int numVertices;

    public GraphMatrix(int numVertices) {
        this.numVertices = numVertices;
        this.matrix = new int[numVertices][numVertices];
    }

    // O(1) - Direct array access!
    public void addEdge(int from, int to, int weight) {
        matrix[from][to] = weight;
    }

    // O(1) - Check if edge exists
    public boolean hasEdge(int from, int to) {
        return matrix[from][to] != 0;
    }

    // O(V) - Get all neighbors
    public List<Integer> getNeighbors(int vertex) {
        List<Integer> neighbors = new ArrayList<>();
        for (int i = 0; i < numVertices; i++) {
            if (matrix[vertex][i] != 0) {
                neighbors.add(i);
            }
        }
        return neighbors;
    }
}

/**
 * KEY INSIGHTS:
 *
 * 1. Choose representation based on density:
 *    - Sparse (E ≈ V): Adjacency List
 *    - Dense (E ≈ V²): Adjacency Matrix
 *    - Most real graphs: SPARSE → use list!
 *
 * 2. BFS vs DFS:
 *    - BFS: Shortest path, level-order
 *    - DFS: Topological sort, cycle detection
 *    - Both: O(V + E) time
 *
 * 3. Graph algorithms are about traversal patterns!
 *    - Understanding BFS/DFS unlocks everything else
 */`

  const libraryCode = `// Graph Operations in Java
import java.util.*;

/**
 * Java doesn't have built-in Graph class
 * But we can use existing collections!
 */
public class GraphExample {
    public static void main(String[] args) {

        // ===== Adjacency List using HashMap =====
        Map<Integer, List<Integer>> graph = new HashMap<>();

        // Add vertices
        for (int i = 0; i < 5; i++) {
            graph.put(i, new ArrayList<>());
        }

        // Add edges
        addEdge(graph, 0, 1);
        addEdge(graph, 0, 2);
        addEdge(graph, 1, 3);
        addEdge(graph, 2, 3);
        addEdge(graph, 3, 4);

        // Graph: 0 → [1,2], 1 → [3], 2 → [3], 3 → [4], 4 → []

        // BFS traversal
        List<Integer> bfsResult = bfs(graph, 0);
        System.out.println("BFS: " + bfsResult);  // [0, 1, 2, 3, 4]

        // DFS traversal
        List<Integer> dfsResult = dfs(graph, 0);
        System.out.println("DFS: " + dfsResult);  // [0, 1, 3, 4, 2]


        // ===== Weighted Graph (Dijkstra's Algorithm) =====
        Map<Integer, Map<Integer, Integer>> weightedGraph = new HashMap<>();
        // vertex → (neighbor → weight)

        // Initialize
        for (int i = 0; i < 5; i++) {
            weightedGraph.put(i, new HashMap<>());
        }

        // Add weighted edges
        addWeightedEdge(weightedGraph, 0, 1, 4);
        addWeightedEdge(weightedGraph, 0, 2, 1);
        addWeightedEdge(weightedGraph, 1, 3, 1);
        addWeightedEdge(weightedGraph, 2, 1, 2);
        addWeightedEdge(weightedGraph, 2, 3, 5);
        addWeightedEdge(weightedGraph, 3, 4, 3);

        // Find shortest paths from vertex 0
        int[] distances = dijkstra(weightedGraph, 0, 5);
        System.out.println("Shortest distances: " + Arrays.toString(distances));
        // [0, 3, 1, 4, 7] - distance from 0 to each vertex


        /* WHEN TO USE WHICH GRAPH REPRESENTATION?
         *
         * Adjacency List (HashMap + ArrayList):
         * ✓ Sparse graphs (most real-world graphs!)
         * ✓ Need to iterate neighbors often
         * ✓ Space efficient: O(V + E)
         * ✗ Slower edge existence check: O(V) worst case
         *
         * Adjacency Matrix (2D array):
         * ✓ Dense graphs (E close to V²)
         * ✓ Need O(1) edge lookup
         * ✓ Simple implementation
         * ✗ Always O(V²) space, even sparse graphs
         *
         * REAL-WORLD EXAMPLES:
         * - Social networks (sparse): Adjacency list
         * - Road networks (sparse): Adjacency list
         * - Complete graphs: Adjacency matrix
         * - Small dense graphs: Adjacency matrix
         */
    }

    static void addEdge(Map<Integer, List<Integer>> graph, int from, int to) {
        graph.get(from).add(to);
    }

    static void addWeightedEdge(Map<Integer, Map<Integer, Integer>> graph,
                                 int from, int to, int weight) {
        graph.get(from).put(to, weight);
    }

    // BFS implementation
    static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
        List<Integer> result = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();

        visited.add(start);
        queue.offer(start);

        while (!queue.isEmpty()) {
            int vertex = queue.poll();
            result.add(vertex);

            for (int neighbor : graph.get(vertex)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }

        return result;
    }

    // DFS implementation
    static List<Integer> dfs(Map<Integer, List<Integer>> graph, int start) {
        List<Integer> result = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        dfsHelper(graph, start, visited, result);
        return result;
    }

    static void dfsHelper(Map<Integer, List<Integer>> graph, int vertex,
                          Set<Integer> visited, List<Integer> result) {
        visited.add(vertex);
        result.add(vertex);

        for (int neighbor : graph.get(vertex)) {
            if (!visited.contains(neighbor)) {
                dfsHelper(graph, neighbor, visited, result);
            }
        }
    }

    // Dijkstra's shortest path algorithm
    static int[] dijkstra(Map<Integer, Map<Integer, Integer>> graph,
                          int start, int numVertices) {
        int[] dist = new int[numVertices];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[start] = 0;

        // Min-heap: (distance, vertex)
        PriorityQueue<int[]> pq = new PriorityQueue<>(
            Comparator.comparingInt(a -> a[0])
        );
        pq.offer(new int[]{0, start});

        Set<Integer> visited = new HashSet<>();

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0];
            int u = curr[1];

            if (visited.contains(u)) continue;
            visited.add(u);

            // Relax edges
            for (Map.Entry<Integer, Integer> edge : graph.get(u).entrySet()) {
                int v = edge.getKey();
                int weight = edge.getValue();

                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }

        return dist;
    }
}`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/heap" className="hover:text-blue-600">Heap</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Graph</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Graph - Deep Dive</h1>
        <button
          onClick={() => setShowLearningMode(!showLearningMode)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            showLearningMode
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showLearningMode ? '✓ Learning Mode ON' : 'Enable Learning Mode'}
        </button>
      </div>

      {/* Learning Path Progress Indicator */}
      <div className="mb-8 bg-gradient-to-r from-blue-100 via-green-100 to-purple-100 rounded-lg shadow-md p-6 border-2 border-blue-300">
        <div className="flex items-center justify-center">
          <div className="text-2xl mr-3">🎯</div>
          <h3 className="font-bold text-lg text-gray-800 mr-6">Learning Path:</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow font-bold">
              <span className="mr-2">1</span> Theory
            </div>
            <span className="text-gray-400 text-2xl">→</span>
            <div className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow font-bold">
              <span className="mr-2">2</span> Practice
            </div>
            <span className="text-gray-400 text-2xl">→</span>
            <div className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow font-bold">
              <span className="mr-2">3</span> Code
            </div>
            <span className="text-gray-400 text-2xl">→</span>
            <div className="flex items-center bg-slate-500 text-white px-4 py-2 rounded-lg shadow font-bold">
              <span className="mr-2">4</span> Advanced
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 mt-3">Follow this path from basic concepts to production-grade knowledge</p>
      </div>

      {/* STEP 1: Theory Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-blue-500">
        <div className="flex items-center mb-4">
          <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">1</div>
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is a Graph?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            A <strong>Graph</strong> is a non-linear data structure consisting of <strong>vertices (nodes)</strong> connected by <strong>edges (links)</strong>.
            Graphs model relationships: social networks, road maps, dependencies, and more!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🔑 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Vertices (V):</strong> Nodes representing entities. Example: cities, people, web pages.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Edges (E):</strong> Connections between vertices. Example: roads, friendships, hyperlinks.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Directed vs Undirected:</strong> Edges can be one-way (→) or bidirectional (↔).</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Weighted vs Unweighted:</strong> Edges can have costs/distances or be equal.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Two Main Representations:</strong> Adjacency List (sparse) or Matrix (dense).</span>
              </li>
            </ul>
          </div>

          {/* Graph Types */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">Undirected Graph</h4>
              <pre className="text-sm font-mono bg-white p-3 rounded">
{`    A --- B
    |     |
    C --- D

Edges: {A-B, A-C, B-D, C-D}
A-B means A↔B (bidirectional)

Examples:
- Friendship network
- Co-authorship
- Undirected roads`}
              </pre>
            </div>

            <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-2">Directed Graph (Digraph)</h4>
              <pre className="text-sm font-mono bg-white p-3 rounded">
{`    A --> B
    ↓     ↓
    C --> D

Edges: {A→B, A→C, B→D, C→D}
A→B ≠ B→A (one direction)

Examples:
- Twitter followers
- Web page links
- Task dependencies`}
              </pre>
            </div>

            <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
              <h4 className="font-bold text-yellow-800 mb-2">Weighted Graph</h4>
              <pre className="text-sm font-mono bg-white p-3 rounded">
{`    A --5-- B
    |2      |3
    C --1-- D

Edge weights represent costs
Example: A-B has weight 5

Examples:
- Road network (distances)
- Flight routes (costs)
- Network latency`}
              </pre>
            </div>

            <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-800 mb-2">Cyclic vs Acyclic</h4>
              <pre className="text-sm font-mono bg-white p-3 rounded">
{`Cyclic: A→B→C→A (cycle!)
Acyclic: A→B→C (no cycles)

DAG (Directed Acyclic Graph):
- Directed + No cycles
- Used: Task scheduling
- Example: Build dependencies`}
              </pre>
            </div>
          </div>

          {/* Adjacency representations */}
          <div className="bg-indigo-100 rounded-lg p-5">
            <h4 className="font-bold text-indigo-900 mb-3">📊 Graph Representations</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded p-4">
                <div className="font-bold text-green-600 mb-2">Adjacency List (Sparse ✓)</div>
                <pre className="text-xs font-mono">
{`Graph: 0--1, 0--2, 1--3, 2--3

List representation:
0 → [1, 2]
1 → [0, 3]
2 → [0, 3]
3 → [1, 2]

Space: O(V + E)
Use: Sparse graphs (E ≈ V)
Example: Social network`}
                </pre>
              </div>
              <div className="bg-white rounded p-4">
                <div className="font-bold text-red-600 mb-2">Adjacency Matrix (Dense)</div>
                <pre className="text-xs font-mono">
{`Graph: 0--1, 0--2, 1--3, 2--3

Matrix representation:
    0 1 2 3
0 [ 0 1 1 0 ]
1 [ 1 0 0 1 ]
2 [ 1 0 0 1 ]
3 [ 0 1 1 0 ]

Space: O(V²)
Use: Dense graphs (E ≈ V²)
Example: Complete graph`}
                </pre>
              </div>
            </div>
          </div>

          {/* When to use graphs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">✓ When to Use Graphs</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Model relationships between entities</li>
                <li>• Find shortest paths (GPS, network routing)</li>
                <li>• Detect cycles (deadlock, circular dependencies)</li>
                <li>• Connected components (social groups)</li>
                <li>• Topological sorting (task scheduling)</li>
                <li>• Network flow problems</li>
                <li>• Recommendation systems</li>
                <li>• Dependency resolution</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use Graphs</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• No relationships between data (use array)</li>
                <li>• Hierarchical data only (use tree)</li>
                <li>• Simple key-value lookup (use HashMap)</li>
                <li>• Sequential access only (use List)</li>
                <li>• Ordered collection (use sorted structure)</li>
              </ul>
            </div>
          </div>

          {/* Real-world examples */}
          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Social Networks:</strong>
                <p className="text-gray-600 mt-1">Facebook: vertices=people, edges=friendships. Find mutual friends, suggest connections.</p>
              </div>
              <div>
                <strong className="text-gray-800">GPS Navigation:</strong>
                <p className="text-gray-600 mt-1">Vertices=intersections, edges=roads (weighted by distance). Dijkstra finds shortest route!</p>
              </div>
              <div>
                <strong className="text-gray-800">Web Crawling:</strong>
                <p className="text-gray-600 mt-1">Vertices=pages, edges=hyperlinks. PageRank uses graph structure for search ranking.</p>
              </div>
              <div>
                <strong className="text-gray-800">Dependency Management:</strong>
                <p className="text-gray-600 mt-1">Vertices=packages, edges=dependencies. Topological sort determines install order.</p>
              </div>
              <div>
                <strong className="text-gray-800">Circuit Design:</strong>
                <p className="text-gray-600 mt-1">Vertices=components, edges=wires. Find optimal connections, detect shorts.</p>
              </div>
              <div>
                <strong className="text-gray-800">Network Routing:</strong>
                <p className="text-gray-600 mt-1">Vertices=routers, edges=connections (weighted by latency). Route packets efficiently.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">🚀 Why Graphs Are Powerful</h4>
            <p className="text-gray-700">
              <strong>1. Model Complex Relationships:</strong> Trees only model hierarchies. Graphs model ANY relationship!<br/><br/>

              <strong>2. Rich Algorithms:</strong> BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal's MST, Prim's MST, etc.<br/><br/>

              <strong>3. O(V + E) Traversal:</strong> Visit all vertices and edges efficiently with BFS/DFS.<br/><br/>

              <strong>4. Shortest Path Algorithms:</strong> Find optimal routes in polynomial time!<br/>
              - Unweighted: BFS in O(V + E)<br/>
              - Weighted: Dijkstra in O((V + E) log V)<br/><br/>

              <strong>5. Real-World Impact:</strong> Google Maps, Facebook, LinkedIn, package managers, circuit design, network protocols - all use graphs!
            </p>
          </div>
        </div>
      </div>

      {showLearningMode && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="text-3xl mr-3">🎓</div>
            <div>
              <div className="font-bold text-green-800 text-lg mb-1">
                Learning Mode Active!
              </div>
              <div className="text-green-700">
                Try adding and removing edges! Run BFS (breadth-first) and DFS (depth-first) traversals to see
                how different algorithms explore the graph. Toggle directed/undirected mode to see how edges behave.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section - continuing in next part */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Graph Visualization</h2>
        </div>

        {/* Graph Display */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold">
              Graph Type: <span className={isDirected ? 'text-blue-600' : 'text-green-600'}>
                {isDirected ? 'Directed' : 'Undirected'}
              </span>
            </div>
            <button
              onClick={() => setIsDirected(!isDirected)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors"
            >
              Toggle to {isDirected ? 'Undirected' : 'Directed'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
            <svg width="600" height="350" className="mx-auto">
              {isDirected && (
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
                  </marker>
                </defs>
              )}
              {renderGraph()}
            </svg>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Vertices:</strong> {numVertices}
            </div>
            <div className="bg-green-50 p-3 rounded">
              <strong>Edges:</strong> {Object.values(graph).reduce((sum, neighbors) => sum + neighbors.length, 0) / (isDirected ? 1 : 2)}
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <strong>Type:</strong> {isDirected ? 'Directed' : 'Undirected'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Vertex</label>
            <input
              type="text"
              value={fromVertex}
              onChange={(e) => setFromVertex(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter vertex (0-4)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Vertex</label>
            <input
              type="text"
              value={toVertex}
              onChange={(e) => setToVertex(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter vertex (0-4)"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleAddEdge}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Add Edge → O(1)
          </button>
          <button
            onClick={handleRemoveEdge}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Remove Edge
          </button>
          <button
            onClick={handleBFS}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            BFS Traversal → O(V+E)
          </button>
          <button
            onClick={handleDFS}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            DFS Traversal → O(V+E)
          </button>
        </div>

        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded mb-4">
            <strong>Result:</strong> {message}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Try This:</strong> Add edges to form a cycle, then run BFS and DFS to see different traversal orders.
          Toggle between directed/undirected to see how edges behave!
        </div>
      </div>

      <ComplexityInfo data={complexityData} />

      {/* STEP 3: Code Implementation Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-purple-500">
        <div className="flex items-center mb-6">
          <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">3</div>
          <h2 className="text-3xl font-bold text-gray-800">Code: Implementation Details</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <CodeDisplay
            title="Graph from Scratch"
            code={scratchCode}
            language="java"
          />
          <CodeDisplay
            title="Graph Operations in Java"
            code={libraryCode}
            language="java"
          />
        </div>
      </div>

      {/* STEP 4: Advanced Section - Architect Level */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-slate-500">
        <div className="flex items-center mb-6">
          <div className="bg-slate-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">4</div>
          <h2 className="text-3xl font-bold text-gray-800">Advanced: Production-Grade Graph Knowledge</h2>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 mb-6 rounded">
          <div className="flex items-start">
            <div className="text-2xl mr-3">⚠️</div>
            <div>
              <div className="font-bold text-lg mb-1">Senior Engineer Territory Ahead</div>
              <div className="text-red-700">
                This section covers architect-level insights: memory layout, cache optimization, advanced algorithms,
                concurrency patterns, and production graph systems. Perfect for senior roles and system design interviews!
              </div>
            </div>
          </div>
        </div>

        {/* Memory Analysis */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">💾</span>
            Memory Layout: Adjacency List vs Matrix
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
              <h4 className="font-bold text-green-800 text-lg mb-3">Adjacency List (HashMap + ArrayList)</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-gray-800">Memory Layout:</strong>
                  <pre className="bg-white p-3 rounded mt-1 text-xs font-mono overflow-x-auto">
{`Vertex 0: HashMap Entry (32 bytes)
  └─→ ArrayList [1,2] (40 bytes)
      - Header: 16 bytes
      - Array reference: 8 bytes
      - Capacity 10: 40 bytes (int[])
      - Elements: 2 ints
Total per vertex: ~72 bytes + neighbors`}
                  </pre>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Space Complexity:</strong> O(V + E)
                  <div className="mt-2 text-xs">
                    Example: 1,000 vertices, 5,000 edges<br/>
                    ≈ 1,000 × 72 + 5,000 × 4 = 92 KB ✓
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Cache Behavior:</strong>
                  <div className="text-xs mt-1">
                    ✓ Good for sparse graphs<br/>
                    ✓ Iterating neighbors: sequential access<br/>
                    ✗ HashMap lookup: random memory access<br/>
                    ✗ Pointer chasing degrades with graph size
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-300">
              <h4 className="font-bold text-red-800 text-lg mb-3">Adjacency Matrix (2D Array)</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-gray-800">Memory Layout:</strong>
                  <pre className="bg-white p-3 rounded mt-1 text-xs font-mono overflow-x-auto">
{`int[1000][1000] matrix
- Array object header: 16 bytes
- 1000 row references: 8KB
- Each row array: 16 bytes header
- Each row data: 1000 × 4 = 4KB
Total: 16 + 8KB + 1000×(16 + 4KB)
     ≈ 4 MB! (Most zeros for sparse)`}
                  </pre>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Space Complexity:</strong> O(V²)
                  <div className="mt-2 text-xs">
                    Example: 1,000 vertices, 5,000 edges<br/>
                    ≈ 1,000 × 1,000 × 4 = 4 MB ✗<br/>
                    (995,000 wasted zeros!)
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Cache Behavior:</strong>
                  <div className="text-xs mt-1">
                    ✓ Excellent for dense graphs<br/>
                    ✓ O(1) edge lookup: matrix[i][j]<br/>
                    ✓ Sequential row access: cache-friendly<br/>
                    ✗ Wastes memory on sparse graphs
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-900 mb-2">🎯 Choosing Representation: The Engineering Decision</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <strong>Sparse Graph (E ≈ V):</strong> Use Adjacency List
                <div className="ml-4 mt-1 text-xs">
                  • Social networks: 1B users, ~150 friends each → E/V ≈ 150 (sparse!)<br/>
                  • Web graph: billions of pages, average 10 links → sparse<br/>
                  • Road networks: intersections have 3-4 roads → sparse
                </div>
              </div>
              <div>
                <strong>Dense Graph (E ≈ V²):</strong> Use Adjacency Matrix
                <div className="ml-4 mt-1 text-xs">
                  • Complete graph: every vertex connected to all others<br/>
                  • Small graphs (&lt;1000 vertices) where edge lookup is critical<br/>
                  • Floyd-Warshall all-pairs shortest path (needs matrix)
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded">
                <strong>Real Production Systems:</strong>
                <div className="text-xs mt-1">
                  Facebook: Adjacency list (TAO - distributed graph store)<br/>
                  Google Maps: Adjacency list with spatial indexing<br/>
                  LinkedIn: Adjacency list with sharding by user ID<br/>
                  Chess engines: Adjacency matrix for small game trees
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Graph Algorithms */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">🧮</span>
            Advanced Graph Algorithms
          </h3>

          <div className="space-y-6">
            {/* Topological Sort */}
            <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-300">
              <h4 className="font-bold text-purple-800 text-lg mb-3">1. Topological Sort (DAG Only)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`// DFS-based Topological Sort
// O(V + E) time, O(V) space

List<Integer> topoSort(Graph g) {
    Stack<Integer> stack = new Stack<>();
    Set<Integer> visited = new HashSet<>();

    // DFS from each unvisited vertex
    for (int v : g.vertices()) {
        if (!visited.contains(v)) {
            topoSortDFS(g, v, visited, stack);
        }
    }

    // Stack contains reverse topological order
    List<Integer> result = new ArrayList<>();
    while (!stack.isEmpty()) {
        result.add(stack.pop());
    }
    return result;
}

void topoSortDFS(Graph g, int v,
                 Set<Integer> visited,
                 Stack<Integer> stack) {
    visited.add(v);

    for (int neighbor : g.neighbors(v)) {
        if (!visited.contains(neighbor)) {
            topoSortDFS(g, neighbor,
                        visited, stack);
        }
    }

    // Push AFTER visiting all descendants
    stack.push(v);  // Key insight!
}`}
                  </pre>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded text-sm">
                    <strong>Why It Works:</strong>
                    <div className="text-xs mt-1">
                      DFS explores deepest dependencies first.<br/>
                      Push to stack AFTER visiting children.<br/>
                      Stack reversal gives dependency order!
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded text-sm">
                    <strong>Use Cases:</strong>
                    <div className="text-xs mt-1">
                      • Build systems (Maven, Gradle)<br/>
                      • Task scheduling<br/>
                      • Course prerequisites<br/>
                      • Package dependency resolution<br/>
                      • Spreadsheet formula evaluation
                    </div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded text-sm">
                    <strong>Production Example:</strong>
                    <div className="text-xs mt-1">
                      Linux kernel modules: modprobe uses<br/>
                      topological sort to load dependencies<br/>
                      in correct order. A→B→C loaded as C,B,A.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dijkstra's Algorithm */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
              <h4 className="font-bold text-green-800 text-lg mb-3">2. Dijkstra's Shortest Path (Non-negative weights)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`// Dijkstra with Min-Heap (PriorityQueue)
// O((V + E) log V) time

int[] dijkstra(Graph g, int start) {
    int[] dist = new int[g.V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;

    // Min-heap: (distance, vertex)
    PriorityQueue<int[]> pq =
        new PriorityQueue<>(
            Comparator.comparingInt(a -> a[0])
        );
    pq.offer(new int[]{0, start});

    Set<Integer> visited = new HashSet<>();

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0];
        int u = curr[1];

        if (visited.contains(u)) continue;
        visited.add(u);

        // Relax edges
        for (Edge e : g.neighbors(u)) {
            int v = e.to;
            int weight = e.weight;

            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }

    return dist;  // Shortest distances
}`}
                  </pre>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded text-sm">
                    <strong>Key Insight:</strong>
                    <div className="text-xs mt-1">
                      Greedy algorithm: always process<br/>
                      closest unvisited vertex first.<br/>
                      Relaxation: update if shorter path found.
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded text-sm">
                    <strong>Complexity Breakdown:</strong>
                    <div className="text-xs mt-1">
                      • V inserts into heap: O(V log V)<br/>
                      • E edge relaxations: O(E log V)<br/>
                      • Total: O((V + E) log V)<br/>
                      • With Fibonacci heap: O(E + V log V)
                    </div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded text-sm">
                    <strong>Production Systems:</strong>
                    <div className="text-xs mt-1">
                      • Google Maps: road network routing<br/>
                      • Network protocols: OSPF routing<br/>
                      • Game pathfinding (A* uses Dijkstra)<br/>
                      • Uber: optimal driver-rider matching
                    </div>
                  </div>
                  <div className="bg-red-100 p-3 rounded text-sm">
                    <strong>Limitation:</strong>
                    <div className="text-xs mt-1">
                      Fails with negative weights!<br/>
                      Use Bellman-Ford for negative weights.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strongly Connected Components */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
              <h4 className="font-bold text-blue-800 text-lg mb-3">3. Kosaraju's SCC (Strongly Connected Components)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`// Find SCCs in directed graph
// O(V + E) time - Two DFS passes!

List<Set<Integer>> findSCCs(Graph g) {
    // Step 1: Fill order by finish times
    Stack<Integer> stack = new Stack<>();
    Set<Integer> visited = new HashSet<>();

    for (int v : g.vertices()) {
        if (!visited.contains(v)) {
            fillOrder(g, v, visited, stack);
        }
    }

    // Step 2: Get transpose graph
    Graph gT = g.transpose();

    // Step 3: DFS on transpose in
    //         reverse finish order
    visited.clear();
    List<Set<Integer>> sccs =
        new ArrayList<>();

    while (!stack.isEmpty()) {
        int v = stack.pop();
        if (!visited.contains(v)) {
            Set<Integer> scc = new HashSet<>();
            dfsCollect(gT, v, visited, scc);
            sccs.add(scc);
        }
    }

    return sccs;
}

void fillOrder(Graph g, int v,
               Set<Integer> visited,
               Stack<Integer> stack) {
    visited.add(v);
    for (int neighbor : g.neighbors(v)) {
        if (!visited.contains(neighbor)) {
            fillOrder(g, neighbor,
                      visited, stack);
        }
    }
    stack.push(v);  // Push after children
}`}
                  </pre>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded text-sm">
                    <strong>What are SCCs?</strong>
                    <div className="text-xs mt-1">
                      In directed graph, SCC is a maximal<br/>
                      set of vertices where every vertex<br/>
                      can reach every other vertex.
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded text-sm">
                    <strong>Algorithm Steps:</strong>
                    <div className="text-xs mt-1">
                      1. DFS to get finish times<br/>
                      2. Reverse all edges (transpose)<br/>
                      3. DFS on transpose in reverse order<br/>
                      Each DFS tree = one SCC!
                    </div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded text-sm">
                    <strong>Production Use Cases:</strong>
                    <div className="text-xs mt-1">
                      • Deadlock detection in databases<br/>
                      • Finding mutually reachable pages<br/>
                      • Social network analysis (cliques)<br/>
                      • Circuit design verification
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Minimum Spanning Tree */}
            <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-300">
              <h4 className="font-bold text-orange-800 text-lg mb-3">4. Kruskal's MST (Minimum Spanning Tree)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`// Find MST using Union-Find
// O(E log E) time

class Edge implements Comparable<Edge> {
    int u, v, weight;

    public int compareTo(Edge other) {
        return this.weight - other.weight;
    }
}

List<Edge> kruskalMST(Graph g) {
    List<Edge> mst = new ArrayList<>();
    List<Edge> edges = g.getAllEdges();

    // Sort edges by weight
    Collections.sort(edges);  // O(E log E)

    UnionFind uf = new UnionFind(g.V);

    for (Edge e : edges) {
        // Add edge if doesn't create cycle
        if (uf.find(e.u) != uf.find(e.v)) {
            mst.add(e);
            uf.union(e.u, e.v);

            if (mst.size() == g.V - 1) {
                break;  // MST complete!
            }
        }
    }

    return mst;
}

// Union-Find with path compression
class UnionFind {
    int[] parent, rank;

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    void union(int x, int y) {
        int px = find(x), py = find(y);
        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
    }
}`}
                  </pre>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded text-sm">
                    <strong>What is MST?</strong>
                    <div className="text-xs mt-1">
                      Minimum-weight subset of edges that<br/>
                      connects all vertices (no cycles).<br/>
                      Exactly V-1 edges in MST.
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded text-sm">
                    <strong>Why Kruskal Works:</strong>
                    <div className="text-xs mt-1">
                      Greedy: add cheapest edge that<br/>
                      doesn't create cycle. Union-Find<br/>
                      detects cycles in O(α(n)) ≈ O(1)!
                    </div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded text-sm">
                    <strong>Real Applications:</strong>
                    <div className="text-xs mt-1">
                      • Network design (min cable cost)<br/>
                      • Clustering algorithms<br/>
                      • Image segmentation<br/>
                      • Approximation for TSP
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded text-sm">
                    <strong>Alternatives:</strong>
                    <div className="text-xs mt-1">
                      Prim's: O(E log V) with heap<br/>
                      Better for dense graphs (E ≈ V²)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Production Patterns */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">🏭</span>
            Production Graph Systems
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-300">
              <h4 className="font-bold text-blue-800 mb-3">Social Network Graph (Facebook TAO)</h4>
              <div className="text-sm space-y-2">
                <div className="bg-white p-3 rounded">
                  <strong>Architecture:</strong>
                  <div className="text-xs mt-1">
                    • Distributed adjacency list (billions of vertices)<br/>
                    • Sharded by user ID across servers<br/>
                    • Cache-aside pattern with memcached<br/>
                    • Read-heavy: 99.9% reads, 0.1% writes
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Operations:</strong>
                  <div className="text-xs mt-1">
                    • <code>assoc_get(id1, atype, id2set)</code>: Get edges<br/>
                    • <code>assoc_count(id, atype)</code>: Count friends<br/>
                    • <code>assoc_range(id, atype, pos, limit)</code>: Paginate<br/>
                    • <code>assoc_add(id1, atype, id2, time)</code>: Add edge
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <strong>Scale:</strong>
                  <div className="text-xs mt-1">
                    3B+ vertices (users, pages, photos)<br/>
                    1T+ edges (friendships, likes, tags)<br/>
                    Millions of queries per second!
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-5 border-2 border-green-300">
              <h4 className="font-bold text-green-800 mb-3">Road Network Routing (Google Maps)</h4>
              <div className="text-sm space-y-2">
                <div className="bg-white p-3 rounded">
                  <strong>Graph Structure:</strong>
                  <div className="text-xs mt-1">
                    • Vertices: intersections (~500M globally)<br/>
                    • Edges: road segments (weighted by time/distance)<br/>
                    • Hierarchical: highway, arterial, local roads<br/>
                    • Contraction hierarchies for speedup
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Algorithm Stack:</strong>
                  <div className="text-xs mt-1">
                    • Bidirectional Dijkstra (meet in middle)<br/>
                    • A* heuristic (straight-line distance)<br/>
                    • Contraction hierarchies (preprocessing)<br/>
                    • Real-time traffic updates (dynamic weights)
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <strong>Optimizations:</strong>
                  <div className="text-xs mt-1">
                    • Spatial indexing (quadtree/geohash)<br/>
                    • Edge caching for popular routes<br/>
                    • Query latency: &lt;100ms for cross-country!
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-300">
              <h4 className="font-bold text-purple-800 mb-3">Dependency Graph (Maven/Gradle)</h4>
              <div className="text-sm space-y-2">
                <div className="bg-white p-3 rounded">
                  <strong>DAG Structure:</strong>
                  <div className="text-xs mt-1">
                    • Vertices: packages/modules<br/>
                    • Directed edges: A depends on B<br/>
                    • Must be acyclic (DAG) - no circular deps!<br/>
                    • Version conflicts: complex resolution
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Resolution Algorithm:</strong>
                  <div className="text-xs mt-1">
                    1. Topological sort for build order<br/>
                    2. Conflict resolution (nearest definition wins)<br/>
                    3. Transitive dependency pruning<br/>
                    4. Parallel builds (independent components)
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <strong>Production Challenge:</strong>
                  <div className="text-xs mt-1">
                    Diamond dependency problem:<br/>
                    A→B→D(v1), A→C→D(v2). Which D version?<br/>
                    Maven: nearest definition. Gradle: newest.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-5 border-2 border-orange-300">
              <h4 className="font-bold text-orange-800 mb-3">Recommendation Engine (LinkedIn)</h4>
              <div className="text-sm space-y-2">
                <div className="bg-white p-3 rounded">
                  <strong>Graph Structure:</strong>
                  <div className="text-xs mt-1">
                    • Vertices: users, jobs, companies, skills<br/>
                    • Edges: connections, applications, endorsements<br/>
                    • Multi-modal graph (different vertex types)<br/>
                    • Weighted edges (connection strength)
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Recommendation Algorithm:</strong>
                  <div className="text-xs mt-1">
                    • "People You May Know": 2-hop BFS<br/>
                    • Collaborative filtering on connection graph<br/>
                    • Graph neural networks (GNN) for embeddings<br/>
                    • PageRank variants for relevance scoring
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <strong>Scale:</strong>
                  <div className="text-xs mt-1">
                    900M+ vertices (users)<br/>
                    Billions of edges (connections)<br/>
                    Real-time updates with graph streaming
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Problems */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">💼</span>
            Common Graph Interview Problems
          </h3>

          <div className="space-y-6">
            {/* Problem 1: Number of Islands */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-blue-900 text-lg">1. Number of Islands (DFS/BFS)</h4>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Medium</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Given a 2D grid of '1's (land) and '0's (water), count the number of islands.
                An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-blue-800 hover:text-blue-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int count = 0;
        int rows = grid.length;
        int cols = grid[0].length;

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == '1') {
                    count++;  // Found new island
                    dfs(grid, i, j);  // Mark all connected land
                }
            }
        }

        return count;
    }

    private void dfs(char[][] grid, int i, int j) {
        // Boundary check
        if (i < 0 || i >= grid.length ||
            j < 0 || j >= grid[0].length ||
            grid[i][j] != '1') {
            return;
        }

        grid[i][j] = '0';  // Mark as visited (sink the land!)

        // Explore 4 directions
        dfs(grid, i + 1, j);  // Down
        dfs(grid, i - 1, j);  // Up
        dfs(grid, i, j + 1);  // Right
        dfs(grid, i, j - 1);  // Left
    }
}

// Time: O(M × N) - visit each cell once
// Space: O(M × N) - recursion stack worst case (entire grid is land)

// KEY INSIGHT: Each DFS/BFS explores one connected component (island).
// Implicit graph: cells are vertices, adjacency = horizontal/vertical neighbors.`}
                  </pre>
                </div>
              </details>
              <div className="bg-blue-50 p-3 rounded">
                <strong className="text-sm">Variations:</strong>
                <div className="text-xs mt-1">
                  • Max area of island (return size of largest island)<br/>
                  • Number of closed islands (surrounded by water on all sides)<br/>
                  • Number of distinct islands (consider shape uniqueness)
                </div>
              </div>
            </div>

            {/* Problem 2: Clone Graph */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-green-900 text-lg">2. Clone Graph (DFS/BFS)</h4>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Medium</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph.
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-green-800 hover:text-green-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class Node {
    public int val;
    public List<Node> neighbors;
}

class Solution {
    private Map<Node, Node> visited = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;

        // If already cloned, return cloned node
        if (visited.containsKey(node)) {
            return visited.get(node);
        }

        // Create clone of current node
        Node clone = new Node(node.val, new ArrayList<>());
        visited.put(node, clone);  // Mark as visited

        // Clone all neighbors recursively
        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(cloneGraph(neighbor));
        }

        return clone;
    }
}

// Time: O(V + E) - visit each vertex and edge once
// Space: O(V) - HashMap stores all vertices

// KEY INSIGHT: HashMap tracks original→clone mapping.
// Prevents infinite loops in cyclic graphs!
// DFS naturally handles cloning connected components.

// BFS Alternative:
public Node cloneGraphBFS(Node node) {
    if (node == null) return null;

    Map<Node, Node> map = new HashMap<>();
    Queue<Node> queue = new LinkedList<>();

    // Clone starting node
    Node clone = new Node(node.val, new ArrayList<>());
    map.put(node, clone);
    queue.offer(node);

    while (!queue.isEmpty()) {
        Node curr = queue.poll();

        for (Node neighbor : curr.neighbors) {
            if (!map.containsKey(neighbor)) {
                // Clone neighbor
                Node neighborClone = new Node(neighbor.val,
                                              new ArrayList<>());
                map.put(neighbor, neighborClone);
                queue.offer(neighbor);
            }
            // Add cloned neighbor to cloned current
            map.get(curr).neighbors.add(map.get(neighbor));
        }
    }

    return clone;
}`}
                  </pre>
                </div>
              </details>
            </div>

            {/* Problem 3: Course Schedule */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-purple-900 text-lg">3. Course Schedule (Cycle Detection in DAG)</h4>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Medium</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Given numCourses and prerequisites (e.g., [0,1] means course 0 requires course 1),
                determine if you can finish all courses (i.e., no circular dependencies).
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-purple-800 hover:text-purple-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }

        for (int[] prereq : prerequisites) {
            int course = prereq[0];
            int dependency = prereq[1];
            graph.get(course).add(dependency);
        }

        // 0 = unvisited, 1 = visiting, 2 = visited
        int[] state = new int[numCourses];

        // Check for cycles using DFS
        for (int i = 0; i < numCourses; i++) {
            if (state[i] == 0) {
                if (hasCycle(graph, i, state)) {
                    return false;  // Cycle found!
                }
            }
        }

        return true;  // No cycles
    }

    private boolean hasCycle(List<List<Integer>> graph,
                              int course, int[] state) {
        if (state[course] == 1) {
            return true;  // Back edge = cycle!
        }
        if (state[course] == 2) {
            return false;  // Already processed
        }

        state[course] = 1;  // Mark as visiting

        // Check all dependencies
        for (int dep : graph.get(course)) {
            if (hasCycle(graph, dep, state)) {
                return true;
            }
        }

        state[course] = 2;  // Mark as visited
        return false;
    }
}

// Time: O(V + E) - DFS traversal
// Space: O(V + E) - graph + recursion stack

// KEY INSIGHT: Three-color DFS for cycle detection!
// - White (0): unvisited
// - Gray (1): visiting (in current DFS path)
// - Black (2): visited (fully explored)
// If we encounter Gray node → cycle (back edge)!

// Course Schedule II variation: return topological order
// Just add course to result when marking as visited (state=2)`}
                  </pre>
                </div>
              </details>
              <div className="bg-purple-50 p-3 rounded">
                <strong className="text-sm">Follow-up:</strong>
                <div className="text-xs mt-1">
                  Course Schedule II: Return actual course order (topological sort)<br/>
                  Course Schedule IV: Check if prerequisite relationship exists (transitive closure)
                </div>
              </div>
            </div>

            {/* Problem 4: Network Delay Time */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-orange-900 text-lg">4. Network Delay Time (Dijkstra's Algorithm)</h4>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Medium</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Given a network of n nodes (1 to n) and travel times as directed edges [u, v, w],
                find the time it takes for all nodes to receive signal sent from node k.
                If impossible, return -1.
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-orange-800 hover:text-orange-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        // Build adjacency list: node → [(neighbor, weight)]
        Map<Integer, List<int[]>> graph = new HashMap<>();
        for (int i = 1; i <= n; i++) {
            graph.put(i, new ArrayList<>());
        }

        for (int[] edge : times) {
            int u = edge[0], v = edge[1], w = edge[2];
            graph.get(u).add(new int[]{v, w});
        }

        // Dijkstra's algorithm
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;

        // Min-heap: (distance, node)
        PriorityQueue<int[]> pq = new PriorityQueue<>(
            Comparator.comparingInt(a -> a[0])
        );
        pq.offer(new int[]{0, k});

        Set<Integer> visited = new HashSet<>();

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0];
            int node = curr[1];

            if (visited.contains(node)) continue;
            visited.add(node);

            // Relax edges
            for (int[] neighbor : graph.get(node)) {
                int next = neighbor[0];
                int weight = neighbor[1];

                if (dist[node] + weight < dist[next]) {
                    dist[next] = dist[node] + weight;
                    pq.offer(new int[]{dist[next], next});
                }
            }
        }

        // Find max distance (time for all nodes to receive)
        int maxTime = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) {
                return -1;  // Unreachable node
            }
            maxTime = Math.max(maxTime, dist[i]);
        }

        return maxTime;
    }
}

// Time: O((V + E) log V) - Dijkstra with min-heap
// Space: O(V + E) - graph + distances + heap

// KEY INSIGHT: Shortest path to farthest node = total delay.
// Classic single-source shortest path problem!`}
                  </pre>
                </div>
              </details>
            </div>

            {/* Problem 5: Word Ladder */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-red-900 text-lg">5. Word Ladder (BFS on Implicit Graph)</h4>
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">Hard</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Given beginWord, endWord, and wordList, find the shortest transformation sequence
                from beginWord to endWord where each transformed word must exist in wordList and
                only one letter can be changed at a time. Return the length of shortest sequence (0 if impossible).
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-red-800 hover:text-red-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class Solution {
    public int ladderLength(String beginWord, String endWord,
                            List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;

        Queue<String> queue = new LinkedList<>();
        queue.offer(beginWord);

        Set<String> visited = new HashSet<>();
        visited.add(beginWord);

        int level = 1;  // Start at length 1

        while (!queue.isEmpty()) {
            int size = queue.size();
            level++;

            for (int i = 0; i < size; i++) {
                String word = queue.poll();

                // Try changing each character
                char[] chars = word.toCharArray();
                for (int j = 0; j < chars.length; j++) {
                    char original = chars[j];

                    // Try all 26 letters
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) continue;

                        chars[j] = c;
                        String newWord = new String(chars);

                        if (newWord.equals(endWord)) {
                            return level;  // Found!
                        }

                        if (wordSet.contains(newWord) &&
                            !visited.contains(newWord)) {
                            visited.add(newWord);
                            queue.offer(newWord);
                        }
                    }

                    chars[j] = original;  // Restore
                }
            }
        }

        return 0;  // No path found
    }
}

// Time: O(M² × N) where M = word length, N = wordList size
//       - For each word, try M positions × 26 letters
//       - Check if word exists in set: O(M)
// Space: O(M × N) - queue + visited set

// KEY INSIGHT: Implicit graph! Words are vertices,
// edges connect words differing by 1 letter.
// BFS finds shortest path (fewest transformations).

// Optimization: Bidirectional BFS (search from both ends)
// reduces search space from O(b^d) to O(b^(d/2))!`}
                  </pre>
                </div>
              </details>
              <div className="bg-red-50 p-3 rounded">
                <strong className="text-sm">Advanced:</strong>
                <div className="text-xs mt-1">
                  Word Ladder II: Return ALL shortest transformation sequences (backtracking + BFS)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Impact */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6 border-2 border-indigo-400">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">🌍</span>
            Real-World Impact: Why Graphs Matter
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-indigo-800 mb-2">🚗 Transportation & Logistics</h4>
              <p className="text-gray-700 text-xs">
                <strong>Google Maps:</strong> 220B+ routes calculated daily using Dijkstra/A* on road graphs.
                Saves billions of hours in travel time annually. Dynamic edge weights from real-time traffic data.<br/><br/>

                <strong>Uber/Lyft:</strong> Bipartite matching on rider-driver graph. Optimal assignments using
                Hungarian algorithm. Handles millions of matches per day across 10,000+ cities.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">👥 Social Networks</h4>
              <p className="text-gray-700 text-xs">
                <strong>Facebook:</strong> 3 billion vertices (users), 1 trillion+ edges (connections).
                "People You May Know" uses 2-3 hop BFS on connection graph. Friendship suggestions
                drive 15% of new connections.<br/><br/>

                <strong>LinkedIn:</strong> Professional graph powers job recommendations, skill endorsements,
                and network insights. Graph neural networks predict job transitions.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-2">🌐 Internet Infrastructure</h4>
              <p className="text-gray-700 text-xs">
                <strong>BGP Routing:</strong> Internet backbone uses graph algorithms to route packets
                between 100,000+ autonomous systems. Bellman-Ford variants handle path selection.<br/><br/>

                <strong>CDN Edge Selection:</strong> Akamai/Cloudflare use graph algorithms to route
                requests to nearest edge server. Reduces latency by 50-90% globally.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-purple-800 mb-2">🔬 Science & Research</h4>
              <p className="text-gray-700 text-xs">
                <strong>Protein Interaction Networks:</strong> Graph analysis reveals disease pathways.
                Community detection identifies protein complexes. Leads to drug discovery.<br/><br/>

                <strong>Citation Networks:</strong> PageRank variants rank scientific papers by impact.
                Google Scholar uses graph centrality to measure researcher influence.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-orange-800 mb-2">💰 Financial Systems</h4>
              <p className="text-gray-700 text-xs">
                <strong>Fraud Detection:</strong> Transaction graphs reveal fraud rings. Strongly connected
                components identify coordinated attacks. Banks save billions annually.<br/><br/>

                <strong>Risk Assessment:</strong> Counterparty risk modeled as graph. Centrality metrics
                identify systemically important institutions ("too big to fail").
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2">🎮 Gaming & AI</h4>
              <p className="text-gray-700 text-xs">
                <strong>Game Pathfinding:</strong> A* on navigation meshes. Powers NPC movement in
                every modern game. Optimized with jump point search for grid graphs.<br/><br/>

                <strong>AlphaGo:</strong> Monte Carlo tree search on game graph. Defeated world champion.
                Graph neural networks learn board patterns.
              </p>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <p className="text-sm text-gray-800">
              <strong>💡 Bottom Line:</strong> Graphs are the backbone of modern computing. From social networks
              to search engines, from GPS navigation to fraud detection, graph algorithms power the digital world.
              Mastering graphs opens doors to senior engineering roles and enables you to build systems that
              impact billions of users!
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
        <Link
          to="/heap"
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          <span className="mr-2">←</span> Previous: Heap
        </Link>
        <Link
          to="/"
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default GraphVisualizerEnhanced
