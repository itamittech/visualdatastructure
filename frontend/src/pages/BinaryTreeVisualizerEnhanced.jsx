import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'
import JavaTreeImplementations from '../components/JavaTreeImplementations'

function BinaryTreeVisualizerEnhanced() {
  const [tree, setTree] = useState({
    value: 50,
    left: { value: 30, left: { value: 20, left: null, right: null }, right: { value: 40, left: null, right: null } },
    right: { value: 70, left: { value: 60, left: null, right: null }, right: { value: 80, left: null, right: null } }
  })
  const [inputValue, setInputValue] = useState('')
  const [highlightNode, setHighlightNode] = useState(null)
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [traversalResult, setTraversalResult] = useState([])
  const [traversalType, setTraversalType] = useState('')

  // Insert a value into BST
  const handleInsert = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const insertNode = (node, val) => {
      if (node === null) {
        return { value: val, left: null, right: null }
      }

      if (val < node.value) {
        return { ...node, left: insertNode(node.left, val) }
      } else if (val > node.value) {
        return { ...node, right: insertNode(node.right, val) }
      }
      return node // Duplicate
    }

    setTree(insertNode(tree, value))
    setHighlightNode(value)
    setMessage(`Inserted ${value} into BST - O(log n) average, O(n) worst case`)
    setTimeout(() => setHighlightNode(null), 1500)
    setInputValue('')
  }

  // Search for a value
  const handleSearch = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const search = (node, val) => {
      if (node === null) return false
      if (node.value === val) return true
      if (val < node.value) return search(node.left, val)
      return search(node.right, val)
    }

    const found = search(tree, value)
    setHighlightNode(value)
    setMessage(found ? `Found ${value} in tree! O(log n) search` : `${value} not found in tree`)
    setTimeout(() => setHighlightNode(null), 2000)
  }

  // Delete a value
  const handleDelete = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const findMin = (node) => {
      while (node.left !== null) node = node.left
      return node.value
    }

    const deleteNode = (node, val) => {
      if (node === null) return null

      if (val < node.value) {
        return { ...node, left: deleteNode(node.left, val) }
      } else if (val > node.value) {
        return { ...node, right: deleteNode(node.right, val) }
      } else {
        // Found node to delete
        if (node.left === null) return node.right
        if (node.right === null) return node.left

        // Two children: replace with inorder successor
        const minVal = findMin(node.right)
        return { ...node, value: minVal, right: deleteNode(node.right, minVal) }
      }
    }

    setTree(deleteNode(tree, value))
    setMessage(`Deleted ${value} from BST - O(log n) average`)
    setInputValue('')
  }

  // Traversals
  const inorderTraversal = (node, result = []) => {
    if (node !== null) {
      inorderTraversal(node.left, result)
      result.push(node.value)
      inorderTraversal(node.right, result)
    }
    return result
  }

  const preorderTraversal = (node, result = []) => {
    if (node !== null) {
      result.push(node.value)
      preorderTraversal(node.left, result)
      preorderTraversal(node.right, result)
    }
    return result
  }

  const postorderTraversal = (node, result = []) => {
    if (node !== null) {
      postorderTraversal(node.left, result)
      postorderTraversal(node.right, result)
      result.push(node.value)
    }
    return result
  }

  const handleTraversal = (type) => {
    let result = []
    if (type === 'inorder') result = inorderTraversal(tree)
    else if (type === 'preorder') result = preorderTraversal(tree)
    else if (type === 'postorder') result = postorderTraversal(tree)

    setTraversalResult(result)
    setTraversalType(type)
    setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} traversal: ${result.join(' → ')}`)
  }

  // Render tree visually
  const renderTree = (node, x = 400, y = 50, level = 0) => {
    if (node === null) return null

    const horizontalSpacing = 400 / Math.pow(2, level)
    const verticalSpacing = 80

    return (
      <g key={`${node.value}-${x}-${y}`}>
        {/* Lines to children */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={x - horizontalSpacing}
            y2={y + verticalSpacing}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={x + horizontalSpacing}
            y2={y + verticalSpacing}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )}

        {/* Children nodes */}
        {node.left && renderTree(node.left, x - horizontalSpacing, y + verticalSpacing, level + 1)}
        {node.right && renderTree(node.right, x + horizontalSpacing, y + verticalSpacing, level + 1)}

        {/* Current node */}
        <circle
          cx={x}
          cy={y}
          r="25"
          fill={highlightNode === node.value ? '#FCD34D' : '#8B5CF6'}
          stroke="#6D28D9"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dy=".3em"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          {node.value}
        </text>
      </g>
    )
  }

  const complexityData = {
    operations: [
      {
        name: 'Search',
        time: 'O(log n) avg, O(n) worst',
        space: 'O(log n)',
        description: 'Binary search in balanced tree. Degrades to O(n) in skewed tree (like linked list).'
      },
      {
        name: 'Insert',
        time: 'O(log n) avg, O(n) worst',
        space: 'O(log n)',
        description: 'Navigate to insertion point. Balanced: log n height. Skewed: n height.'
      },
      {
        name: 'Delete',
        time: 'O(log n) avg, O(n) worst',
        space: 'O(log n)',
        description: 'Find node + restructure. Three cases: leaf, one child, two children.'
      },
      {
        name: 'Inorder Traversal',
        time: 'O(n)',
        space: 'O(log n)',
        description: 'Visit all n nodes once. Space for recursion stack (tree height).'
      },
      {
        name: 'Find Min/Max',
        time: 'O(log n) avg, O(n) worst',
        space: 'O(1)',
        description: 'Go leftmost for min, rightmost for max. Depends on tree height.'
      },
      {
        name: 'Height',
        time: 'O(n)',
        space: 'O(log n)',
        description: 'Must visit all nodes to find longest path. Recursion stack space.'
      },
    ]
  }

  const scratchCode = `// Binary Search Tree Implementation from Scratch
public class BinarySearchTree<T extends Comparable<T>> {
    private class Node {
        T data;
        Node left;
        Node right;

        Node(T data) {
            this.data = data;
            this.left = null;
            this.right = null;
        }
    }

    private Node root;
    private int size;

    /**
     * BINARY SEARCH TREE (BST) Property:
     * For every node:
     * - All values in LEFT subtree < node value
     * - All values in RIGHT subtree > node value
     * - This property holds recursively for all subtrees!
     *
     * This enables O(log n) operations in balanced trees!
     */

    public BinarySearchTree() {
        this.root = null;
        this.size = 0;
    }

    /**
     * WHY O(log n) AVERAGE?
     *
     * Insert operation:
     * 1. Compare with root: O(1)
     * 2. Go left OR right: O(1)
     * 3. Repeat at next level
     * 4. Continue until null spot found
     *
     * Balanced tree height = log₂(n)
     * Each level eliminates half the tree!
     *
     * Example: n=1000 nodes
     * Height = log₂(1000) ≈ 10
     * Only 10 comparisons needed!
     *
     * WHY O(n) WORST CASE?
     * Inserting sorted data: 1,2,3,4,5...
     * Creates skewed tree (like linked list)
     * Height = n, so n comparisons!
     *
     * Solution: Self-balancing trees (AVL, Red-Black)
     */
    public void insert(T data) {
        root = insertRec(root, data);
        size++;
    }

    private Node insertRec(Node node, T data) {
        // Base case: found insertion point
        if (node == null) {
            return new Node(data);
        }

        // Compare and go left or right
        int cmp = data.compareTo(node.data);

        if (cmp < 0) {
            // data < node.data → go left
            node.left = insertRec(node.left, data);
        } else if (cmp > 0) {
            // data > node.data → go right
            node.right = insertRec(node.right, data);
        }
        // If cmp == 0: duplicate, don't insert

        return node;
    }

    /**
     * WHY O(log n) SEARCH?
     *
     * Binary search property!
     * At each node, eliminate half the remaining tree.
     *
     * Example: Search for 45 in tree
     *           50
     *         /    \\
     *       30      70
     *      /  \\    /  \\
     *    20   40  60  80
     *
     * Step 1: Compare 45 vs 50 → 45 < 50, go left
     * Step 2: Compare 45 vs 30 → 45 > 30, go right
     * Step 3: Compare 45 vs 40 → 45 > 40, go right
     * Step 4: null → not found
     *
     * Only 4 comparisons for tree with 7 nodes!
     * Linear search would need up to 7.
     */
    public boolean search(T data) {
        return searchRec(root, data);
    }

    private boolean searchRec(Node node, T data) {
        // Base cases
        if (node == null) return false;
        if (data.compareTo(node.data) == 0) return true;

        // Recursive cases
        if (data.compareTo(node.data) < 0) {
            return searchRec(node.left, data);  // Search left
        } else {
            return searchRec(node.right, data);  // Search right
        }
    }

    /**
     * DELETE: Three cases to handle!
     *
     * Case 1: Leaf node (no children)
     * - Simply remove it
     * Example: Delete 20
     *     30          30
     *    /    →      /
     *   20          null
     *
     * Case 2: One child
     * - Replace node with its child
     * Example: Delete 30 (has only left child 20)
     *     50          50
     *    /      →    /
     *   30          20
     *  /
     * 20
     *
     * Case 3: Two children (complex!)
     * - Find inorder successor (smallest in right subtree)
     * - Replace node's value with successor's value
     * - Delete the successor
     *
     * Example: Delete 50
     *       50              60
     *      /  \\            /  \\
     *    30    70   →    30    70
     *         /  \\             \\
     *       60    80            80
     *
     * Why inorder successor?
     * - It's the next larger value
     * - Maintains BST property!
     * - Alternative: inorder predecessor (largest in left subtree)
     */
    public void delete(T data) {
        root = deleteRec(root, data);
        size--;
    }

    private Node deleteRec(Node node, T data) {
        if (node == null) return null;

        int cmp = data.compareTo(node.data);

        if (cmp < 0) {
            node.left = deleteRec(node.left, data);
        } else if (cmp > 0) {
            node.right = deleteRec(node.right, data);
        } else {
            // Found node to delete!

            // Case 1 & 2: Zero or one child
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;

            // Case 3: Two children
            // Find inorder successor (min in right subtree)
            node.data = findMin(node.right);
            // Delete the inorder successor
            node.right = deleteRec(node.right, node.data);
        }

        return node;
    }

    /**
     * Find minimum: Go all the way LEFT
     * O(log n) average, O(n) worst
     */
    private T findMin(Node node) {
        while (node.left != null) {
            node = node.left;
        }
        return node.data;
    }

    /**
     * TREE TRAVERSALS - Different visiting orders
     *
     * Given tree:
     *       50
     *      /  \\
     *    30    70
     *   /  \\  /  \\
     *  20 40 60 80
     *
     * Inorder (Left-Root-Right): 20,30,40,50,60,70,80
     * - Gives SORTED order for BST!
     * - Used for sorted traversal
     *
     * Preorder (Root-Left-Right): 50,30,20,40,70,60,80
     * - Used for copying tree structure
     * - Used for prefix expression evaluation
     *
     * Postorder (Left-Right-Root): 20,40,30,60,80,70,50
     * - Used for deleting tree (delete children first!)
     * - Used for postfix expression evaluation
     */

    public void inorderTraversal() {
        inorderRec(root);
    }

    private void inorderRec(Node node) {
        if (node != null) {
            inorderRec(node.left);      // Left
            System.out.print(node.data + " ");  // Root
            inorderRec(node.right);     // Right
        }
    }

    public void preorderTraversal() {
        preorderRec(root);
    }

    private void preorderRec(Node node) {
        if (node != null) {
            System.out.print(node.data + " ");  // Root
            preorderRec(node.left);     // Left
            preorderRec(node.right);    // Right
        }
    }

    public void postorderTraversal() {
        postorderRec(root);
    }

    private void postorderRec(Node node) {
        if (node != null) {
            postorderRec(node.left);    // Left
            postorderRec(node.right);   // Right
            System.out.print(node.data + " ");  // Root
        }
    }

    /**
     * Height of tree: Longest path from root to leaf
     * WHY O(n)? Must visit every node to find longest path!
     */
    public int height() {
        return heightRec(root);
    }

    private int heightRec(Node node) {
        if (node == null) return -1;  // Or 0 depending on definition

        int leftHeight = heightRec(node.left);
        int rightHeight = heightRec(node.right);

        return 1 + Math.max(leftHeight, rightHeight);
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return root == null;
    }
}

/**
 * KEY INSIGHTS:
 *
 * 1. BST Property enables binary search!
 *    - Each comparison eliminates half the tree
 *    - O(log n) vs O(n) for linear search
 *
 * 2. Performance depends on tree balance!
 *    - Balanced: height = log n → O(log n) ops
 *    - Skewed: height = n → O(n) ops
 *
 * 3. Inorder traversal gives sorted order!
 *    - Because of BST property
 *    - Left < Root < Right recursively
 *
 * 4. Deletion is complex (3 cases)
 *    - But still O(log n) average!
 */`

  const libraryCode = `// Using Java's TreeMap and TreeSet
import java.util.*;

/**
 * Java uses Red-Black Trees (self-balancing BST)
 * - TreeMap: Sorted key-value pairs
 * - TreeSet: Sorted unique values
 *
 * Guarantees O(log n) operations (no worst case O(n)!)
 */
public class TreeExample {
    public static void main(String[] args) {

        // ===== TreeSet: Sorted Set =====
        // Backed by Red-Black Tree (self-balancing BST)
        TreeSet<Integer> treeSet = new TreeSet<>();

        // O(log n) - Insert
        treeSet.add(50);
        treeSet.add(30);
        treeSet.add(70);
        treeSet.add(20);
        treeSet.add(40);
        // TreeSet: [20, 30, 40, 50, 70] - automatically sorted!

        // O(log n) - Search
        boolean contains = treeSet.contains(30);  // true
        System.out.println("Contains 30: " + contains);

        // O(log n) - Remove
        treeSet.remove(30);  // [20, 40, 50, 70]

        // O(log n) - Range queries
        SortedSet<Integer> headSet = treeSet.headSet(50);  // [20, 40]
        SortedSet<Integer> tailSet = treeSet.tailSet(50);  // [50, 70]
        SortedSet<Integer> subSet = treeSet.subSet(20, 70);  // [20, 40, 50]

        // O(log n) - Find min/max
        Integer first = treeSet.first();  // 20 (min)
        Integer last = treeSet.last();    // 70 (max)

        // O(log n) - Floor and ceiling
        Integer floor = treeSet.floor(45);    // 40 (largest ≤ 45)
        Integer ceiling = treeSet.ceiling(45); // 50 (smallest ≥ 45)

        // O(log n) - Higher and lower
        Integer higher = treeSet.higher(40);  // 50 (next element)
        Integer lower = treeSet.lower(50);    // 40 (previous element)

        // O(n) - Iterate in sorted order
        for (Integer num : treeSet) {
            System.out.println(num);  // 20, 40, 50, 70 (sorted!)
        }


        // ===== TreeMap: Sorted Key-Value Pairs =====
        TreeMap<String, Integer> treeMap = new TreeMap<>();

        // O(log n) - Put
        treeMap.put("Alice", 90);
        treeMap.put("Bob", 85);
        treeMap.put("Charlie", 95);
        treeMap.put("David", 80);
        // Keys sorted alphabetically: Alice, Bob, Charlie, David

        // O(log n) - Get
        Integer score = treeMap.get("Bob");  // 85

        // O(log n) - Remove
        treeMap.remove("Bob");

        // O(log n) - First and last entries
        Map.Entry<String, Integer> firstEntry = treeMap.firstEntry();  // Alice=90
        Map.Entry<String, Integer> lastEntry = treeMap.lastEntry();    // David=80

        // O(log n) - Floor and ceiling keys
        String floorKey = treeMap.floorKey("Chris");    // "Charlie"
        String ceilingKey = treeMap.ceilingKey("Chris"); // "David"

        // Range views
        SortedMap<String, Integer> headMap = treeMap.headMap("Charlie");  // Alice, Bob
        SortedMap<String, Integer> tailMap = treeMap.tailMap("Charlie");  // Charlie, David
        SortedMap<String, Integer> subMap = treeMap.subMap("Alice", "David");  // Alice, Bob, Charlie

        // O(n) - Iterate in sorted key order
        for (Map.Entry<String, Integer> entry : treeMap.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }


        // ===== Custom Comparator =====
        // Sort in reverse order
        TreeSet<Integer> reverseSet = new TreeSet<>(Collections.reverseOrder());
        reverseSet.addAll(Arrays.asList(5, 2, 8, 1, 9));
        System.out.println(reverseSet);  // [9, 8, 5, 2, 1]

        // Sort strings by length
        TreeSet<String> lengthSet = new TreeSet<>(Comparator.comparingInt(String::length));
        lengthSet.add("apple");
        lengthSet.add("pie");
        lengthSet.add("banana");
        System.out.println(lengthSet);  // [pie, apple, banana] (by length)


        /* WHEN TO USE TreeSet/TreeMap?
         *
         * TreeSet vs HashSet:
         * ✓ Need sorted order
         * ✓ Need range queries (floor, ceiling, subset)
         * ✓ Need min/max quickly
         * ✗ Slower than HashSet: O(log n) vs O(1)
         *
         * TreeMap vs HashMap:
         * ✓ Need sorted keys
         * ✓ Need range queries on keys
         * ✓ Need ordered iteration
         * ✗ Slower than HashMap: O(log n) vs O(1)
         *
         * REAL-WORLD EXAMPLES:
         * - Leaderboard (sorted scores)
         * - Dictionary (sorted words)
         * - Event scheduling (sorted by time)
         * - Database indexes (B-trees)
         * - File systems (B+ trees)
         * - Range queries (stocks in price range)
         */
    }
}`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/queue" className="hover:text-blue-600">Queue</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Binary Tree</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Binary Search Tree - Deep Dive</h1>
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is a Binary Search Tree?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            A <strong>Binary Search Tree (BST)</strong> is a hierarchical data structure where each node has at most two children.
            The BST property: <strong>left child &lt; parent &lt; right child</strong> for all nodes, enabling O(log n) operations!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🔑 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>BST Property:</strong> Left subtree &lt; Node &lt; Right subtree. This enables binary search!</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Hierarchical Structure:</strong> Each node has up to 2 children (left and right).</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>O(log n) Average Operations:</strong> Search, insert, delete in balanced trees.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Sorted Traversal:</strong> Inorder traversal gives elements in sorted order!</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Performance Depends on Balance:</strong> Balanced tree: O(log n). Skewed tree: O(n).</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-100 rounded-lg p-5">
            <h4 className="font-bold text-purple-900 mb-3">🎯 BST Property Example</h4>
            <div className="bg-white rounded p-4">
              <pre className="text-sm font-mono">
{`        50
       /  \\
     30    70
    /  \\  /  \\
  20  40 60 80

BST Property check:
- Node 50: left(30) < 50 < right(70) ✓
- Node 30: left(20) < 30 < right(40) ✓
- Node 70: left(60) < 70 < right(80) ✓

ALL left subtree values < 50 < ALL right subtree values!
This enables binary search: O(log n) instead of O(n)`}
              </pre>
            </div>
          </div>

          <div className="bg-indigo-100 rounded-lg p-5">
            <h4 className="font-bold text-indigo-900 mb-3">📊 Tree Terminology</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded p-4 text-sm">
                <div className="font-bold text-indigo-600 mb-2">Basic Terms</div>
                <div className="space-y-1">
                  <div><strong>Root:</strong> Top node (50 in example)</div>
                  <div><strong>Leaf:</strong> Node with no children (20,40,60,80)</div>
                  <div><strong>Parent:</strong> Node with children (50,30,70)</div>
                  <div><strong>Child:</strong> Node below parent</div>
                  <div><strong>Sibling:</strong> Nodes with same parent (30,70)</div>
                </div>
              </div>
              <div className="bg-white rounded p-4 text-sm">
                <div className="font-bold text-indigo-600 mb-2">Metrics</div>
                <div className="space-y-1">
                  <div><strong>Height:</strong> Longest path from root to leaf</div>
                  <div><strong>Depth:</strong> Distance from root to node</div>
                  <div><strong>Level:</strong> Root at level 0, children at level 1...</div>
                  <div><strong>Size:</strong> Total number of nodes</div>
                  <div><strong>Balanced:</strong> |left_height - right_height| ≤ 1</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">✓ When to Use BST</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need sorted data with fast insertion/deletion</li>
                <li>• Need to find min/max quickly</li>
                <li>• Range queries (values between x and y)</li>
                <li>• Need floor/ceiling operations</li>
                <li>• Successor/predecessor queries</li>
                <li>• Database indexing (B-trees)</li>
                <li>• File systems</li>
                <li>• Priority-based scheduling</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use BST</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need O(1) lookup (use HashMap)</li>
                <li>• Data doesn't need sorting</li>
                <li>• Memory constrained (tree nodes have overhead)</li>
                <li>• Frequent sequential access (use Array)</li>
                <li>• Can't guarantee balance (use AVL/Red-Black)</li>
                <li>• Need LIFO/FIFO (use Stack/Queue)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Database Indexes:</strong>
                <p className="text-gray-600 mt-1">B-trees (variant of BST) for fast lookups. Balance guaranteed!</p>
              </div>
              <div>
                <strong className="text-gray-800">File Systems:</strong>
                <p className="text-gray-600 mt-1">Directory hierarchies use tree structures for organization.</p>
              </div>
              <div>
                <strong className="text-gray-800">Expression Trees:</strong>
                <p className="text-gray-600 mt-1">Represent mathematical expressions for evaluation.</p>
              </div>
              <div>
                <strong className="text-gray-800">Decision Trees:</strong>
                <p className="text-gray-600 mt-1">Machine learning models for classification/regression.</p>
              </div>
              <div>
                <strong className="text-gray-800">Binary Heap:</strong>
                <p className="text-gray-600 mt-1">Priority queues implemented as complete binary trees.</p>
              </div>
              <div>
                <strong className="text-gray-800">Symbol Tables:</strong>
                <p className="text-gray-600 mt-1">Compiler symbol tables for variable lookup.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">🚀 Why Binary Search Trees are Powerful</h4>
            <p className="text-gray-700">
              The <strong>BST property</strong> enables binary search on a dynamic structure!<br/><br/>

              <strong>Search for 45 in example tree:</strong><br/>
              Start at 50: 45 &lt; 50 → go LEFT (eliminated right half!)<br/>
              At 30: 45 &gt; 30 → go RIGHT (eliminated left half!)<br/>
              At 40: 45 &gt; 40 → go RIGHT<br/>
              null → not found<br/><br/>

              Only 4 comparisons for 7 nodes! Linear search would check all 7.<br/>
              For 1000 nodes: BST ≈ 10 comparisons, Array ≈ 1000 comparisons!<br/><br/>

              <strong>Compare to other structures:</strong><br/>
              Array (sorted): Search O(log n) but insert O(n) - must shift!<br/>
              Linked List: Insert O(1) but search O(n) - no random access!<br/>
              BST: Both O(log n) - best of both worlds when balanced!
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
                Try inserting, searching, and deleting values! Notice how the tree maintains the BST property
                (left &lt; parent &lt; right) after each operation. Try traversals to see different visit orders!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Binary Tree Visualization</h2>
        </div>

        {/* Tree Display */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6">
            <svg width="800" height="400" className="mx-auto">
              {renderTree(tree)}
            </svg>
          </div>
          <div className="text-sm text-gray-600 mt-3 bg-purple-50 p-3 rounded border-l-4 border-purple-500">
            <strong>BST Property:</strong> For every node, all values in left subtree are smaller, all values in right subtree are larger.
            This property enables O(log n) search by eliminating half the tree at each step!
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter value"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleInsert}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Insert value into BST - O(log n)"
          >
            Insert → O(log n)
          </button>
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Search for value - O(log n)"
          >
            Search → O(log n)
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Delete value from BST - O(log n)"
          >
            Delete → O(log n)
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Tree Traversals</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTraversal('inorder')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Inorder (Sorted)
            </button>
            <button
              onClick={() => handleTraversal('preorder')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Preorder
            </button>
            <button
              onClick={() => handleTraversal('postorder')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Postorder
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-purple-50 border-l-4 border-purple-500 text-purple-700 px-4 py-3 rounded mb-4">
            <strong>Result:</strong> {message}
          </div>
        )}

        {traversalResult.length > 0 && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700 px-4 py-3 rounded">
            <strong>{traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal:</strong> {traversalResult.join(' → ')}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Try This:</strong> Insert values 55, 65, 75. Notice how the tree grows while maintaining BST property!
          Then try Inorder traversal - it gives sorted order!
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
            title="Binary Search Tree from Scratch"
            code={scratchCode}
            language="java"
          />
          <CodeDisplay
            title="Using Java's TreeMap/TreeSet"
            code={libraryCode}
            language="java"
          />
        </div>
      </div>

      {/* Java Tree Implementations */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Java Tree Implementations - Complete Guide
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Java provides TreeMap and TreeSet backed by Red-Black Trees (self-balancing BST).
          Learn about all tree-based collections and when to use each!
        </p>
        <JavaTreeImplementations />
      </div>

      {/* STEP 4: Advanced Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-lg shadow-md p-8 mb-8 border-l-8 border-slate-500 mt-8">
        <div className="flex items-center mb-4">
          <div className="bg-slate-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">4</div>
          <h2 className="text-3xl font-bold text-gray-800">Advanced: Architect-Level Deep Dive</h2>
        </div>
        <div className="mb-4 text-sm text-gray-600">
          ⚠️ <strong>Complete Steps 1-3 above before diving into this architect-level content</strong>
        </div>

        {/* Prominent Notice */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-6 rounded">
          <div className="flex items-start">
            <div className="text-3xl mr-3">⚠️</div>
            <div>
              <h4 className="font-bold text-yellow-900 text-lg mb-2">Advanced Content - Complete Basic Steps First!</h4>
              <p className="text-yellow-800 mb-3">
                This section contains production-grade, architect-level content. For the best learning experience:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-yellow-900 text-sm">
                <li>Scroll up to <strong>Step 2: Interactive Practice</strong> and try the visualizer</li>
                <li>Review <strong>Step 3: Code Implementation</strong> to understand the basics</li>
                <li>Then return here for deep dives into tree balancing, memory layout, cache behavior, and production patterns</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Memory Layout and Node Overhead */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">💾 Memory Layout: Tree Node Overhead</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">TreeNode Memory Structure</h4>
                <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Binary Tree Node in Java
class TreeNode {
    int value;        // 4 bytes (int)
    TreeNode left;    // 8 bytes (64-bit reference)
    TreeNode right;   // 8 bytes (64-bit reference)
}

// Object overhead:
// - Object header: 12 bytes (mark word + class pointer)
// - Alignment padding: 4 bytes (align to 8-byte boundary)
//
// Total per node: 12 + 4 + 8 + 8 + 4 = 36 bytes
//
// For 1 million integers:
// - Array: 4MB (just data)
// - BST: 36MB (9x more memory!)
//
// Memory amplification factor:
// - TreeNode overhead: 32 bytes per node
// - Actual data: 4 bytes
// - Overhead ratio: 8:1 !`}
                </pre>
              </div>

              <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">Array vs Tree Memory</h4>
                <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// 1000 integers storage comparison

Array (contiguous):
┌─────┬─────┬─────┬─────┬───────┐
│ 10  │ 20  │ 30  │ 40  │  ...  │
└─────┴─────┴─────┴─────┴───────┘
Memory: 4KB (1000 * 4 bytes)
Cache-friendly: YES! Sequential access

BST (scattered nodes):
  Node@0x1000 [value:10, left:0x2000, right:0x3000]
  Node@0x2000 [value:5,  left:null,   right:null]
  Node@0x3000 [value:15, left:0x4000, right:0x5000]
  ...
Memory: 36KB (1000 * 36 bytes)
Cache-friendly: NO! Pointer chasing

Tradeoff:
- Array: Fast sequential, slow insert/delete
- BST: Fast insert/delete, slow sequential`}
                </pre>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-900 mb-2">Cache Behavior in Tree Traversal</h4>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Cache line = 64 bytes (holds ~1.7 TreeNodes)

Array sequential scan (FAST):
Address 0x1000: [1][2][3][4]...[16]  ← One cache line loads 16 ints!
// Next 15 accesses = cache hits ⚡
// Cache hit rate: ~95%

BST traversal (SLOW):
Node 1 @ 0x1000  ← Cache miss, load cache line
Node 2 @ 0x5A20  ← Different cache line! Miss!
Node 3 @ 0x2F10  ← Different cache line! Miss!
// Most accesses = cache misses
// Cache hit rate: ~20% (5x slower!)

Real benchmark (1M nodes):
- Array iteration: 3ms
- BST inorder traversal: 15ms

Why BST is still worth it:
- Dynamic insert/delete: O(log n) vs O(n)
- Sorted order maintained
- Range queries efficient
- When insertion >> iteration, BST wins!`}
              </pre>
            </div>
          </div>

          {/* Tree Balancing - AVL vs Red-Black */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">⚖️ Self-Balancing Trees: AVL vs Red-Black</h3>

            <div className="mb-4 bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">Why Balance Matters</h4>
              <pre className="text-xs bg-white p-3 rounded">
{`// Inserting sorted data: 1,2,3,4,5,6,7

Unbalanced BST (degenerates to linked list!):
1                Height: 7
 \\               Search: O(n) - linear!
  2              Insert: O(n)
   \\             Delete: O(n)
    3            All benefits LOST!
     \\
      4
       \\
        5
         \\
          6
           \\
            7

Balanced BST (AVL or Red-Black):
       4                Height: 3 (log₂7 ≈ 2.8)
      / \\              Search: O(log n) ⚡
     2   6             Insert: O(log n)
    / \\ / \\            Delete: O(log n)
   1  3 5  7           Benefits PRESERVED!

Difference: 7 steps vs 3 steps!
For 1000 nodes: 1000 steps vs 10 steps!`}
              </pre>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">Aspect</th>
                    <th className="px-4 py-3 text-left font-bold">AVL Tree</th>
                    <th className="px-4 py-3 text-left font-bold">Red-Black Tree</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Balance Guarantee</td>
                    <td className="px-4 py-3 text-green-600">Stricter: |h_left - h_right| ≤ 1</td>
                    <td className="px-4 py-3">Relaxed: max_height ≤ 2*min_height</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Tree Height</td>
                    <td className="px-4 py-3 text-green-600">1.44 * log(n) - More shallow</td>
                    <td className="px-4 py-3">2 * log(n) - Slightly taller</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Search Speed</td>
                    <td className="px-4 py-3 text-green-600">Faster (fewer levels)</td>
                    <td className="px-4 py-3">Slightly slower</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Insert Speed</td>
                    <td className="px-4 py-3">Slower (more rotations)</td>
                    <td className="px-4 py-3 text-green-600">Faster (fewer rotations)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Rotations per Insert</td>
                    <td className="px-4 py-3">Up to log(n) - Many!</td>
                    <td className="px-4 py-3 text-green-600">At most 2 - Few!</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Use Case</td>
                    <td className="px-4 py-3">Read-heavy workloads</td>
                    <td className="px-4 py-3 text-green-600">Write-heavy (Java uses this!)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">AVL Tree Rotations</h4>
                <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Single Right Rotation (Left-Left case)
Before:         After:
    30            20
   /             /  \\
  20     →      10   30
 /
10

// Left-Right Rotation (Left-Right case)
Before:         After:
    30            20
   /             /  \\
  10     →      10   30
   \\
    20

// Balance factor = height(left) - height(right)
// AVL requires: -1 ≤ BF ≤ 1 always!`}
                </pre>
              </div>

              <div className="bg-red-50 p-4 rounded">
                <h4 className="font-semibold text-red-900 mb-2">Red-Black Tree Properties</h4>
                <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// 5 properties:
1. Every node is RED or BLACK
2. Root is BLACK
3. All leaves (null) are BLACK
4. RED nodes have BLACK children only
5. All paths from node to leaves have
   same number of BLACK nodes

// Insert: Color new node RED
// Fix violations with recoloring + max 2 rotations

// Used by: Java TreeMap/TreeSet, C++ map/set
// Why? Fewer rotations = faster inserts!`}
                </pre>
              </div>
            </div>
          </div>

          {/* Production Patterns */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🏭 Production Patterns with Trees</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 1: Database B-Trees</h4>
                <div className="bg-slate-50 p-4 rounded border">
                  <p className="text-sm text-gray-700 mb-3">Why databases use B-trees (not binary trees):</p>
                  <pre className="text-xs bg-white p-3 rounded">
{`// Binary tree: Each node has ≤2 children
// B-tree: Each node has ≤M children (M=100s or 1000s!)

Binary Tree (disk access problem):
Height for 1M nodes = log₂(1M) ≈ 20
Each level = 1 disk I/O
Total: 20 disk reads! (20 * 10ms = 200ms)

B-Tree (M=1000):
Height for 1M nodes = log₁₀₀₀(1M) = 2
Each level = 1 disk I/O
Total: 2 disk reads! (2 * 10ms = 20ms)

10x faster! This is why databases use B-trees.

PostgreSQL example:
- Page size: 8KB
- Can fit ~200 keys per node
- 3 levels → 8 million rows!
- Index lookup: 3 disk reads max

MongoDB (B+ tree variant):
- Leaf nodes linked (range scans!)
- Internal nodes: keys only
- Leaf nodes: keys + data pointers`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 2: LRU Cache with TreeMap</h4>
                <pre className="text-xs bg-white p-3 rounded border">
{`// Time-based eviction using TreeMap
class TimestampedLRU<K, V> {
    private TreeMap<Long, K> timeToKey;  // Sorted by timestamp
    private Map<K, CacheEntry<V>> cache;
    private int capacity;

    static class CacheEntry<V> {
        V value;
        long timestamp;
    }

    public V get(K key) {
        CacheEntry<V> entry = cache.get(key);
        if (entry == null) return null;

        // Update timestamp
        timeToKey.remove(entry.timestamp);
        entry.timestamp = System.currentTimeMillis();
        timeToKey.put(entry.timestamp, key);

        return entry.value;
    }

    public void put(K key, V value) {
        // Evict oldest if full
        if (cache.size() >= capacity && !cache.containsKey(key)) {
            // O(log n) - get first entry (oldest)
            Long oldestTime = timeToKey.firstKey();
            K oldestKey = timeToKey.remove(oldestTime);
            cache.remove(oldestKey);
        }

        // Insert with current timestamp
        long now = System.currentTimeMillis();
        cache.put(key, new CacheEntry<>(value, now));
        timeToKey.put(now, key);
    }
}

// Why TreeMap?
// - Sorted by time: O(log n) to find oldest
// - HashMap alone: O(n) to find oldest
// - Used in: Memcached, Redis sorted sets`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 3: Interval Tree (Range Queries)</h4>
                <pre className="text-xs bg-white p-3 rounded border">
{`// Find all overlapping intervals
// Example: Calendar conflicts, IP range matching

class IntervalTree {
    static class Interval {
        int start, end;
        int max;  // Max end in this subtree!
    }

    // Find all intervals overlapping with [low, high]
    List<Interval> findOverlapping(int low, int high) {
        List<Interval> result = new ArrayList<>();
        findOverlappingRec(root, low, high, result);
        return result;
    }

    private void findOverlappingRec(Node node, int low, int high,
                                     List<Interval> result) {
        if (node == null) return;

        // Check current interval
        if (node.interval.start <= high && node.interval.end >= low) {
            result.add(node.interval);
        }

        // Go left if left subtree might overlap
        if (node.left != null && node.left.max >= low) {
            findOverlappingRec(node.left, low, high, result);
        }

        // Always go right
        findOverlappingRec(node.right, low, high, result);
    }
}

// Time: O(log n + k) where k = overlapping intervals
// Used in:
// - Calendar applications (meeting conflicts)
// - Network routing (IP range matching)
// - Genomics (DNA sequence alignment)`}
                </pre>
              </div>
            </div>
          </div>

          {/* Interview Problems */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🎯 Interview-Level Tree Problems</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 1: Validate Binary Search Tree (Medium - Amazon/Facebook)</h4>
                <p className="text-sm text-gray-600 mb-3">Check if a binary tree is a valid BST. Tricky: must check range, not just parent!</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// WRONG approach: Just check parent
boolean isValidBST_WRONG(TreeNode node) {
    if (node == null) return true;
    if (node.left != null && node.left.val >= node.val) return false;
    if (node.right != null && node.right.val <= node.val) return false;
    return isValidBST_WRONG(node.left) && isValidBST_WRONG(node.right);
}
// Fails on:    5
//            /   \\
//           1     6
//                / \\
//               4   7  ← 4 is in right subtree but < 5!

// CORRECT: Track valid range for each node
boolean isValidBST(TreeNode root) {
    return isValidBST(root, null, null);
}

boolean isValidBST(TreeNode node, Integer min, Integer max) {
    if (node == null) return true;

    // Check if current value violates min/max constraints
    if (min != null && node.val <= min) return false;
    if (max != null && node.val >= max) return false;

    // Left subtree: all values must be < node.val
    // Right subtree: all values must be > node.val
    return isValidBST(node.left, min, node.val) &&
           isValidBST(node.right, node.val, max);
}

// Time: O(n) - visit each node once
// Space: O(h) - recursion stack (h = height)
//
// Key insight: Each node has valid RANGE, not just parent!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 2: Lowest Common Ancestor (Medium - Google/Microsoft)</h4>
                <p className="text-sm text-gray-600 mb-3">Find LCA of two nodes in BST. Use BST property for O(log n)!</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Leverage BST property!
TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    // Both in left subtree
    if (p.val < root.val && q.val < root.val) {
        return lowestCommonAncestor(root.left, p, q);
    }

    // Both in right subtree
    if (p.val > root.val && q.val > root.val) {
        return lowestCommonAncestor(root.right, p, q);
    }

    // Split point: one left, one right (or one equals root)
    // This IS the LCA!
    return root;
}

// Example:       6
//              /   \\
//             2     8
//            / \\   / \\
//           0  4  7  9
//             / \\
//            3  5

// LCA(2,8) = 6 (split at root)
// LCA(2,4) = 2 (4 in right, 2 is ancestor)
// LCA(3,5) = 4 (both in left of 6, split at 4)

// Time: O(log n) average, O(n) worst (skewed)
// Space: O(log n) recursion
//
// For general binary tree (not BST): O(n) time required!
// BST property gives us O(log n)!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 3: Kth Smallest Element in BST (Medium - Amazon)</h4>
                <p className="text-sm text-gray-600 mb-3">Find kth smallest element. Inorder traversal gives sorted order!</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Approach 1: Inorder traversal (simple)
int kthSmallest(TreeNode root, int k) {
    List<Integer> sorted = new ArrayList<>();
    inorder(root, sorted);
    return sorted.get(k - 1);  // 1-indexed
}

void inorder(TreeNode node, List<Integer> result) {
    if (node == null) return;
    inorder(node.left, result);
    result.add(node.val);
    inorder(node.right, result);
}
// Time: O(n), Space: O(n)

// Approach 2: Early termination (optimized!)
int kthSmallest(TreeNode root, int k) {
    int[] result = {0};
    int[] count = {0};
    kthSmallestHelper(root, k, count, result);
    return result[0];
}

void kthSmallestHelper(TreeNode node, int k, int[] count, int[] result) {
    if (node == null || count[0] >= k) return;

    // Inorder: left, root, right
    kthSmallestHelper(node.left, k, count, result);

    count[0]++;
    if (count[0] == k) {
        result[0] = node.val;
        return;  // Found! Stop early
    }

    kthSmallestHelper(node.right, k, count, result);
}

// Time: O(k) - stop after k nodes!
// Space: O(h) - recursion stack
//
// Follow-up: What if frequent calls?
// Add rank (size of left subtree) to each node!
// Then O(log n) per query!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 4: Serialize and Deserialize BST (Medium - LinkedIn/Facebook)</h4>
                <pre className="text-xs bg-white p-3 rounded">
{`// Convert tree to string and back
// Preorder works well for BST!

// Serialize: Preorder traversal
String serialize(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    serializeHelper(root, sb);
    return sb.toString();
}

void serializeHelper(TreeNode node, StringBuilder sb) {
    if (node == null) return;  // Don't store nulls!

    sb.append(node.val).append(",");
    serializeHelper(node.left, sb);
    serializeHelper(node.right, sb);
}

// Deserialize: Use BST property!
TreeNode deserialize(String data) {
    if (data.isEmpty()) return null;
    String[] vals = data.split(",");
    return deserializeHelper(vals, new int[]{0}, Integer.MIN_VALUE, Integer.MAX_VALUE);
}

TreeNode deserializeHelper(String[] vals, int[] index, int min, int max) {
    if (index[0] >= vals.length) return null;

    int val = Integer.parseInt(vals[index[0]]);

    // Check if value fits in valid range for this position
    if (val < min || val > max) return null;

    TreeNode node = new TreeNode(val);
    index[0]++;

    // Build left and right with updated ranges
    node.left = deserializeHelper(vals, index, min, val);
    node.right = deserializeHelper(vals, index, val, max);

    return node;
}

// Example:     2
//            /   \\
//           1     3
// Serialize: "2,1,3,"
// Deserialize: Preorder + BST property rebuilds tree!
//
// Time: O(n) for both
// Space: O(n) for string, O(h) recursion
//
// Key: BST property means we don't need to store nulls!
// General tree needs nulls: "2,1,null,null,3,null,null"`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 5: Recover Binary Search Tree (Hard - Google)</h4>
                <p className="text-sm text-gray-600 mb-3">Two nodes swapped by mistake. Find and fix them. O(1) space!</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Key insight: Inorder of BST should be sorted
// Swapped nodes break the sorted order!

void recoverTree(TreeNode root) {
    TreeNode[] first = {null};
    TreeNode[] second = {null};
    TreeNode[] prev = {null};

    // Inorder traversal to find violations
    findSwapped(root, first, second, prev);

    // Swap values back
    int temp = first[0].val;
    first[0].val = second[0].val;
    second[0].val = temp;
}

void findSwapped(TreeNode node, TreeNode[] first,
                 TreeNode[] second, TreeNode[] prev) {
    if (node == null) return;

    findSwapped(node.left, first, second, prev);

    // Check if current violates sorted order
    if (prev[0] != null && prev[0].val > node.val) {
        if (first[0] == null) {
            first[0] = prev[0];  // First violation
        }
        second[0] = node;  // Second violation (or update)
    }
    prev[0] = node;

    findSwapped(node.right, first, second, prev);
}

// Example: Correct tree
//     3
//    / \\
//   1   4
//      /
//     2
// Inorder: 1,3,2,4 (2 and 3 swapped!)
// First violation: 3 > 2
// Fix: Swap 3 and 2

// Time: O(n)
// Space: O(h) recursion - can do O(1) with Morris traversal!
//
// Follow-up: How to do with O(1) space?
// Use Morris Inorder Traversal (threading)`}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Why Trees Are Fundamental */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-purple-600 mb-4">🚀 Why Binary Search Trees Are Fundamental</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-bold text-gray-800 mb-2">O(log n) Operations</div>
            <div className="text-sm text-gray-600">
              Binary search on dynamic data! Insert, delete, search all O(log n) when balanced.
              Best of arrays and linked lists!
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">🔄</div>
            <div className="font-bold text-gray-800 mb-2">Sorted Order Maintained</div>
            <div className="text-sm text-gray-600">
              Inorder traversal gives sorted sequence. Perfect for range queries, min/max, floor/ceiling operations.
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">🏗️</div>
            <div className="font-bold text-gray-800 mb-2">Foundation for Advanced Structures</div>
            <div className="text-sm text-gray-600">
              AVL, Red-Black, B-trees, Splay trees all extend BST. Understanding BST unlocks these!
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg">
          <div className="font-bold text-gray-800 mb-3">Real-World Impact:</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">•</span>
              <span><strong>Databases:</strong> B-trees for indexing (MySQL, PostgreSQL, MongoDB)</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">•</span>
              <span><strong>File Systems:</strong> Directory hierarchies, inode trees</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">•</span>
              <span><strong>Compilers:</strong> Expression trees, syntax trees, symbol tables</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">•</span>
              <span><strong>Java Collections:</strong> TreeMap, TreeSet use Red-Black trees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 flex justify-between items-center border-t pt-6">
        <Link
          to="/hashmap"
          className="flex items-center text-blue-600 hover:text-blue-700 font-semibold"
        >
          <span className="mr-2">←</span> Previous: HashMap
        </Link>
        <Link
          to="/complexity"
          className="text-gray-600 hover:text-gray-700"
        >
          Review Complexity Guide
        </Link>
        <div className="text-gray-400">
          Next: Heap →
        </div>
      </div>
    </div>
  )
}

export default BinaryTreeVisualizerEnhanced
