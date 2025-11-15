import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function HeapVisualizerEnhanced() {
  // Min-heap by default
  const [heap, setHeap] = useState([10, 20, 15, 30, 40])
  const [inputValue, setInputValue] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(null)
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [heapType, setHeapType] = useState('min') // 'min' or 'max'

  // Helper functions
  const parent = (i) => Math.floor((i - 1) / 2)
  const leftChild = (i) => 2 * i + 1
  const rightChild = (i) => 2 * i + 2

  const compare = (a, b) => {
    return heapType === 'min' ? a < b : a > b
  }

  // Heapify up (after insert)
  const heapifyUp = (arr, index) => {
    let current = index
    while (current > 0 && compare(arr[current], arr[parent(current)])) {
      [arr[current], arr[parent(current)]] = [arr[parent(current)], arr[current]]
      current = parent(current)
    }
    return arr
  }

  // Heapify down (after extract)
  const heapifyDown = (arr, index) => {
    let current = index
    const size = arr.length

    while (true) {
      let target = current
      const left = leftChild(current)
      const right = rightChild(current)

      if (left < size && compare(arr[left], arr[target])) {
        target = left
      }
      if (right < size && compare(arr[right], arr[target])) {
        target = right
      }

      if (target === current) break

      [arr[current], arr[target]] = [arr[target], arr[current]]
      current = target
    }
    return arr
  }

  const handleInsert = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const newHeap = [...heap, value]
    heapifyUp(newHeap, newHeap.length - 1)
    setHeap(newHeap)
    setHighlightIndex(newHeap.length - 1)
    setMessage(`Inserted ${value} - Heapified up! O(log n) operation`)
    setTimeout(() => setHighlightIndex(null), 1500)
    setInputValue('')
  }

  const handleExtract = () => {
    if (heap.length === 0) {
      setMessage('Heap is empty!')
      return
    }

    const extracted = heap[0]
    const newHeap = [...heap]
    newHeap[0] = newHeap[newHeap.length - 1]
    newHeap.pop()

    if (newHeap.length > 0) {
      heapifyDown(newHeap, 0)
    }

    setHeap(newHeap)
    setMessage(`Extracted ${heapType === 'min' ? 'minimum' : 'maximum'}: ${extracted} - O(log n) operation`)
  }

  const handlePeek = () => {
    if (heap.length === 0) {
      setMessage('Heap is empty!')
      return
    }

    setHighlightIndex(0)
    setMessage(`Peek: ${heap[0]} is the ${heapType === 'min' ? 'minimum' : 'maximum'} - O(1) operation`)
    setTimeout(() => setHighlightIndex(null), 2000)
  }

  const handleToggleHeapType = () => {
    const newType = heapType === 'min' ? 'max' : 'min'
    setHeapType(newType)
    // Rebuild heap with new type
    const newHeap = [...heap]
    for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
      heapifyDown(newHeap, i)
    }
    setHeap(newHeap)
    setMessage(`Switched to ${newType}-heap and rebuilt`)
  }

  // Render heap as tree
  const renderHeap = () => {
    const levels = Math.ceil(Math.log2(heap.length + 1))
    const nodes = []

    for (let i = 0; i < heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1))
      const posInLevel = i - (Math.pow(2, level) - 1)
      const totalInLevel = Math.pow(2, level)

      const x = (posInLevel + 0.5) * (800 / totalInLevel)
      const y = level * 80 + 50

      // Draw lines to children
      const left = leftChild(i)
      const right = rightChild(i)

      if (left < heap.length) {
        const leftLevel = Math.floor(Math.log2(left + 1))
        const leftPosInLevel = left - (Math.pow(2, leftLevel) - 1)
        const leftX = (leftPosInLevel + 0.5) * (800 / Math.pow(2, leftLevel))
        const leftY = leftLevel * 80 + 50

        nodes.push(
          <line
            key={`line-left-${i}`}
            x1={x}
            y1={y}
            x2={leftX}
            y2={leftY}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )
      }

      if (right < heap.length) {
        const rightLevel = Math.floor(Math.log2(right + 1))
        const rightPosInLevel = right - (Math.pow(2, rightLevel) - 1)
        const rightX = (rightPosInLevel + 0.5) * (800 / Math.pow(2, rightLevel))
        const rightY = rightLevel * 80 + 50

        nodes.push(
          <line
            key={`line-right-${i}`}
            x1={x}
            y1={y}
            x2={rightX}
            y2={rightY}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )
      }
    }

    // Draw nodes
    for (let i = 0; i < heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1))
      const posInLevel = i - (Math.pow(2, level) - 1)
      const x = (posInLevel + 0.5) * (800 / Math.pow(2, level))
      const y = level * 80 + 50

      nodes.push(
        <g key={`node-${i}`}>
          <circle
            cx={x}
            cy={y}
            r="25"
            fill={highlightIndex === i ? '#FCD34D' : i === 0 ? '#EF4444' : '#10B981'}
            stroke={i === 0 ? '#DC2626' : '#059669'}
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
            {heap[i]}
          </text>
        </g>
      )
    }

    return nodes
  }

  const complexityData = {
    operations: [
      {
        name: 'Insert',
        time: 'O(log n)',
        space: 'O(1)',
        description: 'Add element at end, heapify up. At most log n swaps (tree height).'
      },
      {
        name: 'Extract Min/Max',
        time: 'O(log n)',
        space: 'O(1)',
        description: 'Remove root, move last to root, heapify down. At most log n swaps.'
      },
      {
        name: 'Peek Min/Max',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Just return root element. No modifications needed!'
      },
      {
        name: 'Build Heap',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Build heap from array. Surprisingly O(n), not O(n log n)! (Floyd\'s algorithm)'
      },
      {
        name: 'Heapify',
        time: 'O(log n)',
        space: 'O(1)',
        description: 'Restore heap property at a node. Bubble up or down (tree height).'
      },
      {
        name: 'Heap Sort',
        time: 'O(n log n)',
        space: 'O(1)',
        description: 'Extract max n times. n * log n = O(n log n). In-place sorting!'
      },
    ]
  }

  const scratchCode = `// Min-Heap Implementation from Scratch (Array-Based)
public class MinHeap {
    private int[] heap;
    private int size;
    private int capacity;

    /**
     * HEAP: Complete Binary Tree with Heap Property
     *
     * Min-Heap Property:
     * - Parent ≤ Children (every parent smaller than its children)
     * - Root is minimum element
     *
     * Max-Heap Property:
     * - Parent ≥ Children (every parent larger than its children)
     * - Root is maximum element
     *
     * Complete Binary Tree:
     * - All levels filled except possibly last
     * - Last level filled left to right
     * - Perfect for array representation!
     *
     * Array Indexing (0-based):
     * - Parent of i: (i-1)/2
     * - Left child of i: 2*i + 1
     * - Right child of i: 2*i + 2
     *
     * Example: [10, 20, 15, 30, 40]
     *        10         Index 0
     *       /  \\
     *     20    15      Indices 1, 2
     *    /  \\
     *  30   40         Indices 3, 4
     */

    public MinHeap(int capacity) {
        this.capacity = capacity;
        this.size = 0;
        this.heap = new int[capacity];
    }

    private int parent(int i) { return (i - 1) / 2; }
    private int leftChild(int i) { return 2 * i + 1; }
    private int rightChild(int i) { return 2 * i + 2; }

    /**
     * WHY O(log n) INSERT?
     *
     * Insert operation:
     * 1. Add element at end (next available position): O(1)
     * 2. Heapify up (bubble up): O(log n)
     *    - Compare with parent
     *    - Swap if violates heap property
     *    - Repeat until root or property satisfied
     *
     * Example: Insert 5 into [10, 20, 15, 30, 40]
     *
     * Step 1: Add at end
     *        10
     *       /  \\
     *     20    15
     *    /  \\  /
     *  30  40  5  ← Added here (index 5)
     *
     * Step 2: Heapify up
     *  5 < 15 → swap
     *        10
     *       /  \\
     *     20    5   ← Swapped
     *    /  \\  /
     *  30  40 15
     *
     *  5 < 10 → swap
     *        5     ← Final position!
     *       /  \\
     *     20    10
     *    /  \\  /
     *  30  40 15
     *
     * Swaps = height of tree = log₂(n)
     * Hence O(log n)!
     */
    public void insert(int value) {
        if (size >= capacity) {
            throw new IllegalStateException("Heap is full");
        }

        // Add at end
        heap[size] = value;
        size++;

        // Heapify up
        heapifyUp(size - 1);
    }

    private void heapifyUp(int index) {
        int current = index;

        // Bubble up while parent is larger
        while (current > 0 && heap[current] < heap[parent(current)]) {
            swap(current, parent(current));
            current = parent(current);
        }
    }

    /**
     * WHY O(log n) EXTRACT MIN?
     *
     * Extract min operation:
     * 1. Save root (minimum element): O(1)
     * 2. Move last element to root: O(1)
     * 3. Decrease size: O(1)
     * 4. Heapify down (bubble down): O(log n)
     *    - Find smaller child
     *    - Swap if violates heap property
     *    - Repeat until leaf or property satisfied
     *
     * Example: Extract min from [10, 20, 15, 30, 40]
     *
     * Step 1: Remove 10, move 40 to root
     *        40    ← Last element moved here
     *       /  \\
     *     20    15
     *    /
     *  30
     *
     * Step 2: Heapify down
     *  40 > min(20,15)=15 → swap with 15
     *        15
     *       /  \\
     *     20    40  ← Swapped
     *    /
     *  30
     *
     *  40 > 30 → swap
     *        15
     *       /  \\
     *     20    30
     *    /
     *  40        ← Final position (leaf)
     *
     * Result: [15, 20, 30, 40]
     *
     * Swaps = height = log₂(n)
     * Hence O(log n)!
     */
    public int extractMin() {
        if (size == 0) {
            throw new IllegalStateException("Heap is empty");
        }

        int min = heap[0];  // Root is minimum

        // Move last element to root
        heap[0] = heap[size - 1];
        size--;

        // Heapify down from root
        if (size > 0) {
            heapifyDown(0);
        }

        return min;
    }

    private void heapifyDown(int index) {
        int current = index;

        while (true) {
            int smallest = current;
            int left = leftChild(current);
            int right = rightChild(current);

            // Find smallest among current, left, right
            if (left < size && heap[left] < heap[smallest]) {
                smallest = left;
            }
            if (right < size && heap[right] < heap[smallest]) {
                smallest = right;
            }

            // If current is smallest, we're done
            if (smallest == current) {
                break;
            }

            // Otherwise, swap and continue
            swap(current, smallest);
            current = smallest;
        }
    }

    /**
     * WHY O(1) PEEK?
     * Min element is always at root (index 0)!
     * Just return it without modifications.
     */
    public int peek() {
        if (size == 0) {
            throw new IllegalStateException("Heap is empty");
        }
        return heap[0];
    }

    /**
     * BUILD HEAP: WHY O(n)?
     *
     * Build heap from unsorted array.
     *
     * Naive approach: Insert n elements → O(n log n)
     *
     * Floyd's algorithm: Bottom-up heapify → O(n) ⚡
     *
     * Algorithm:
     * 1. Start from last non-leaf node: (n/2 - 1)
     * 2. Heapify down for each node going backwards
     * 3. Work bottom-up, not top-down!
     *
     * Why O(n)?
     * - Leaves: n/2 nodes, 0 swaps (already heaps!)
     * - Level above leaves: n/4 nodes, 1 swap max
     * - Level above that: n/8 nodes, 2 swaps max
     * - Root: 1 node, log n swaps max
     *
     * Total: n/2*0 + n/4*1 + n/8*2 + ... + 1*log(n)
     *      = n * (1/2 + 2/4 + 3/8 + ...)
     *      = n * 2  (converges to 2)
     *      = O(n) ✓
     *
     * This is FASTER than inserting n elements!
     */
    public static MinHeap buildHeap(int[] arr) {
        MinHeap heap = new MinHeap(arr.length);
        heap.size = arr.length;
        System.arraycopy(arr, 0, heap.heap, 0, arr.length);

        // Heapify from last non-leaf to root
        for (int i = heap.size / 2 - 1; i >= 0; i--) {
            heap.heapifyDown(i);
        }

        return heap;
    }

    /**
     * HEAP SORT: O(n log n) IN-PLACE SORTING
     *
     * Algorithm:
     * 1. Build max-heap: O(n)
     * 2. Extract max n times: n * O(log n) = O(n log n)
     *    - Swap root with last element
     *    - Decrease heap size
     *    - Heapify down
     * 3. Array is now sorted!
     *
     * Space: O(1) - sorts in place!
     * Not stable (relative order may change)
     * Not adaptive (always O(n log n), even if sorted)
     *
     * Comparison:
     * - Quick sort: O(n log n) avg, O(n²) worst
     * - Merge sort: O(n log n) always, O(n) space
     * - Heap sort: O(n log n) always, O(1) space ✓
     */
    public static void heapSort(int[] arr) {
        int n = arr.length;

        // Build max-heap
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapifyDownMaxHeap(arr, n, i);
        }

        // Extract max one by one
        for (int i = n - 1; i > 0; i--) {
            // Move current max to end
            swap(arr, 0, i);

            // Heapify reduced heap
            heapifyDownMaxHeap(arr, i, 0);
        }
    }

    private static void heapifyDownMaxHeap(int[] arr, int heapSize, int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        if (left < heapSize && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right < heapSize && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest != index) {
            swap(arr, index, largest);
            heapifyDownMaxHeap(arr, heapSize, largest);
        }
    }

    private void swap(int i, int j) {
        int temp = heap[i];
        heap[i] = heap[j];
        heap[j] = temp;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }
}

/**
 * KEY INSIGHTS:
 *
 * 1. Array representation is PERFECT for heaps!
 *    - Complete tree property
 *    - No pointer overhead
 *    - Cache-friendly sequential access
 *
 * 2. Heap vs BST:
 *    - Heap: O(1) min/max, O(log n) insert/extract
 *    - BST: O(log n) search, insert, delete
 *    - Heap: Finding min/max FAST
 *    - BST: Finding any element FAST
 *
 * 3. Build heap is O(n), not O(n log n)!
 *    - Bottom-up heapify is magical!
 *
 * 4. Heap sort: O(n log n) time, O(1) space
 *    - Guaranteed performance
 *    - In-place sorting
 */`

  const libraryCode = `// Using Java's PriorityQueue
import java.util.*;

/**
 * Java PriorityQueue: Min-Heap by default
 * - Backed by array (dynamic resizing)
 * - Not thread-safe
 * - O(log n) insert/remove, O(1) peek
 */
public class HeapExample {
    public static void main(String[] args) {

        // ===== Min-Heap (default) =====
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        // O(log n) - Insert
        minHeap.offer(30);
        minHeap.offer(10);
        minHeap.offer(20);
        minHeap.offer(40);
        // Heap: [10, 30, 20, 40] (internal array, not sorted!)

        // O(1) - Peek at minimum
        int min = minHeap.peek();  // 10
        System.out.println("Min: " + min);

        // O(log n) - Extract minimum
        int extracted = minHeap.poll();  // 10
        // Heap: [20, 30, 40]

        // O(1) - Check size
        int size = minHeap.size();  // 3


        // ===== Max-Heap (custom comparator) =====
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

        maxHeap.offer(30);
        maxHeap.offer(10);
        maxHeap.offer(20);
        maxHeap.offer(40);
        // Heap maintains max at root: [40, 30, 20, 10]

        int max = maxHeap.poll();  // 40 (maximum)
        System.out.println("Max: " + max);


        // ===== Custom Objects with Comparator =====
        class Task {
            String name;
            int priority;  // Lower number = higher priority

            Task(String name, int priority) {
                this.name = name;
                this.priority = priority;
            }
        }

        // Min-heap by priority
        PriorityQueue<Task> taskQueue = new PriorityQueue<>(
            Comparator.comparingInt(t -> t.priority)
        );

        taskQueue.offer(new Task("Write code", 2));
        taskQueue.offer(new Task("Fix bug", 1));     // Highest priority!
        taskQueue.offer(new Task("Write docs", 3));

        Task urgent = taskQueue.poll();  // "Fix bug" (priority 1)
        System.out.println("Urgent task: " + urgent.name);


        // ===== Build heap from collection - O(n) =====
        List<Integer> numbers = Arrays.asList(50, 30, 20, 40, 10);
        PriorityQueue<Integer> heapFromList = new PriorityQueue<>(numbers);
        // Built in O(n) using Floyd's algorithm!
        // Faster than inserting one by one (which is O(n log n))


        // ===== Common operations =====
        PriorityQueue<Integer> pq = new PriorityQueue<>();

        pq.add(10);      // Same as offer, but throws exception if full
        pq.offer(20);    // Returns false if full (better!)

        pq.peek();       // O(1) - view min, returns null if empty
        pq.element();    // O(1) - view min, throws exception if empty

        pq.poll();       // O(log n) - remove min, returns null if empty
        pq.remove();     // O(log n) - remove min, throws exception if empty

        pq.contains(10); // O(n) - linear search! (heap is NOT for search)
        pq.remove(10);   // O(n) - find and remove specific element

        pq.clear();      // O(n) - remove all elements


        /* WHEN TO USE PriorityQueue?
         *
         * PriorityQueue (Heap) vs TreeSet:
         * ✓ Need min/max quickly (O(1) vs O(log n))
         * ✓ Only care about min/max, not sorted order
         * ✓ Task scheduling with priorities
         * ✗ Need to search for elements (O(n) vs O(log n))
         * ✗ Need sorted iteration (heap is not sorted!)
         *
         * REAL-WORLD EXAMPLES:
         * - Task scheduler (priority-based)
         * - Dijkstra's shortest path (next closest node)
         * - Huffman coding (build optimal tree)
         * - Merge K sorted lists
         * - Find Kth largest element
         * - Median of data stream
         * - Event-driven simulation
         * - Load balancing (process least loaded server)
         *
         * ADVANCED: PriorityBlockingQueue
         * - Thread-safe version
         * - Blocking operations for producer-consumer
         * - Used in concurrent task processing
         */

        // Example: Top K frequent elements
        Map<Integer, Integer> freqMap = new HashMap<>();
        int[] nums = {1,1,1,2,2,3};
        for (int num : nums) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }

        // Min-heap of size K (keep K most frequent)
        PriorityQueue<Map.Entry<Integer, Integer>> minHeap =
            new PriorityQueue<>(Comparator.comparingInt(Map.Entry::getValue));

        int k = 2;
        for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
            minHeap.offer(entry);
            if (minHeap.size() > k) {
                minHeap.poll();  // Remove least frequent
            }
        }
        // Result: minHeap contains top 2 frequent elements!
    }
}`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/tree" className="hover:text-blue-600">Binary Tree</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Heap (Priority Queue)</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Heap (Priority Queue) - Deep Dive</h1>
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is a Heap?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            A <strong>Heap</strong> is a complete binary tree that satisfies the <strong>heap property</strong>.
            Min-heap: parent ≤ children. Max-heap: parent ≥ children. Perfect for finding min/max in O(1)!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🔑 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Heap Property:</strong> Min-heap: parent ≤ children. Max-heap: parent ≥ children at ALL levels!</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Complete Binary Tree:</strong> All levels filled except last, filled left-to-right.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Array Representation:</strong> Perfect fit! Parent at i, children at 2i+1 and 2i+2.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>O(1) Min/Max Access:</strong> Root is always min (min-heap) or max (max-heap)!</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>O(log n) Insert/Extract:</strong> Heapify operations only traverse tree height.</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-100 rounded-lg p-5">
            <h4 className="font-bold text-purple-900 mb-3">🎯 Heap Property Example</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded p-4">
                <div className="font-bold text-green-600 mb-2">Min-Heap</div>
                <pre className="text-sm font-mono">
{`      10          ← Root (minimum!)
     /  \\
   20    15        20≥10 ✓  15≥10 ✓
  /  \\
30   40           30≥20 ✓  40≥20 ✓

Array: [10, 20, 15, 30, 40]
Property: parent ≤ children
Use: Get minimum quickly`}
                </pre>
              </div>
              <div className="bg-white rounded p-4">
                <div className="font-bold text-red-600 mb-2">Max-Heap</div>
                <pre className="text-sm font-mono">
{`      40          ← Root (maximum!)
     /  \\
   30    20        30≤40 ✓  20≤40 ✓
  /  \\
10   15           10≤30 ✓  15≤30 ✓

Array: [40, 30, 20, 10, 15]
Property: parent ≥ children
Use: Get maximum quickly`}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-indigo-100 rounded-lg p-5">
            <h4 className="font-bold text-indigo-900 mb-3">📊 Array Indexing Magic</h4>
            <div className="bg-white rounded p-4">
              <pre className="text-sm font-mono">
{`Array: [10, 20, 15, 30, 40, 25, 18]
Index:  0   1   2   3   4   5   6

Tree representation:
       10 (0)
      /      \\
   20(1)     15(2)
   /  \\      /  \\
30(3) 40(4) 25(5) 18(6)

For node at index i:
- Parent: (i-1)/2
- Left child: 2*i + 1
- Right child: 2*i + 2

Example: Node 15 at index 2
- Parent: (2-1)/2 = 0 → 10 ✓
- Left: 2*2+1 = 5 → 25 ✓
- Right: 2*2+2 = 6 → 18 ✓

NO POINTERS NEEDED! Just math!`}
              </pre>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">✓ When to Use Heap</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Priority queue (task scheduling)</li>
                <li>• Find min/max quickly (O(1) access!)</li>
                <li>• K largest/smallest elements</li>
                <li>• Median of stream</li>
                <li>• Merge K sorted lists</li>
                <li>• Dijkstra's shortest path</li>
                <li>• Huffman coding</li>
                <li>• Heap sort (O(n log n) in-place)</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use Heap</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need to search for elements (O(n) search!)</li>
                <li>• Need sorted iteration (use TreeSet)</li>
                <li>• Need FIFO/LIFO (use Queue/Stack)</li>
                <li>• Need O(1) lookup by key (use HashMap)</li>
                <li>• Need to find median (unless using 2 heaps)</li>
                <li>• Need range queries (use segment tree)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Operating Systems:</strong>
                <p className="text-gray-600 mt-1">Process scheduling - run highest priority task next!</p>
              </div>
              <div>
                <strong className="text-gray-800">Dijkstra's Algorithm:</strong>
                <p className="text-gray-600 mt-1">Find shortest path - always process closest unvisited node.</p>
              </div>
              <div>
                <strong className="text-gray-800">Event Simulation:</strong>
                <p className="text-gray-600 mt-1">Process events in timestamp order (min-heap by time).</p>
              </div>
              <div>
                <strong className="text-gray-800">Load Balancing:</strong>
                <p className="text-gray-600 mt-1">Assign task to least loaded server (min-heap by load).</p>
              </div>
              <div>
                <strong className="text-gray-800">Huffman Encoding:</strong>
                <p className="text-gray-600 mt-1">Build optimal compression tree using min-heap.</p>
              </div>
              <div>
                <strong className="text-gray-800">Median Finder:</strong>
                <p className="text-gray-600 mt-1">Use 2 heaps (max + min) to find median in O(log n)!</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">🚀 Why Heaps Are Powerful</h4>
            <p className="text-gray-700">
              <strong>1. O(1) Min/Max Access:</strong> Root is always min/max. No search needed!<br/><br/>

              <strong>2. O(log n) Updates:</strong> Insert and extract only traverse tree height.<br/>
              Height = log₂(n), so at most log₂(n) swaps!<br/><br/>

              <strong>3. Array Representation:</strong> No pointer overhead! Just indices.<br/>
              1M elements: Heap = 4MB, BST with pointers = 36MB!<br/><br/>

              <strong>4. Cache-Friendly:</strong> Array = sequential memory = cache hits!<br/>
              Better cache performance than pointer-based trees.<br/><br/>

              <strong>5. Build Heap O(n):</strong> Floyd's algorithm builds heap in O(n), not O(n log n)!<br/>
              This enables heap sort and efficient initialization.<br/><br/>

              <strong>Compare to alternatives:</strong><br/>
              - Unsorted array: O(1) insert, O(n) find min → slow for priority queue<br/>
              - Sorted array: O(n) insert, O(1) find min → slow inserts<br/>
              - BST: O(log n) everything but more memory, no O(1) min/max<br/>
              - Heap: O(log n) insert/extract, O(1) min/max → PERFECT for priority queue!
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
                Try inserting values and extracting the {heapType === 'min' ? 'minimum' : 'maximum'}!
                Watch how the heap property is maintained with heapify operations. Toggle between min/max heap to see the difference!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Heap Visualization</h2>
        </div>

        {/* Heap Display */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">
                Current: <span className={heapType === 'min' ? 'text-green-600' : 'text-red-600'}>
                  {heapType === 'min' ? 'Min-Heap' : 'Max-Heap'}
                </span>
              </div>
              <button
                onClick={handleToggleHeapType}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors"
              >
                Toggle to {heapType === 'min' ? 'Max' : 'Min'}-Heap
              </button>
            </div>
            <svg width="800" height="400" className="mx-auto">
              {renderHeap()}
            </svg>
            <div className="text-sm text-gray-600 mt-2 text-center">
              Array representation: [{heap.join(', ')}]
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
            <div className="bg-green-50 p-3 rounded">
              <strong>Heap Size:</strong> {heap.length} elements
            </div>
            <div className="bg-red-50 p-3 rounded">
              <strong>Root ({heapType === 'min' ? 'Min' : 'Max'}):</strong> {heap.length > 0 ? heap[0] : 'none'}
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <strong>Height:</strong> {heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0}
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-3 bg-purple-50 p-3 rounded border-l-4 border-purple-500">
            <strong>Heap Property:</strong> {heapType === 'min' ? 'Every parent ≤ its children' : 'Every parent ≥ its children'}.
            Root is always the {heapType === 'min' ? 'minimum' : 'maximum'} element!
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value to Insert
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            placeholder="Enter value"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleInsert}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Insert value - O(log n)"
          >
            Insert → O(log n)
          </button>
          <button
            onClick={handleExtract}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title={`Extract ${heapType === 'min' ? 'minimum' : 'maximum'} - O(log n)`}
          >
            Extract {heapType === 'min' ? 'Min' : 'Max'} → O(log n)
          </button>
          <button
            onClick={handlePeek}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Peek at root - O(1)"
          >
            Peek → O(1) ⚡
          </button>
        </div>

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
            <strong>Result:</strong> {message}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Try This:</strong> Insert several values, then extract {heapType === 'min' ? 'min' : 'max'} repeatedly.
          Notice they come out in sorted order! Try toggling heap type to see how the structure changes.
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
            title="Heap from Scratch (Array-Based)"
            code={scratchCode}
            language="java"
          />
          <CodeDisplay
            title="Using Java's PriorityQueue"
            code={libraryCode}
            language="java"
          />
        </div>
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
                <li>Then return here for deep dives into heap algorithms, memory efficiency, and production use cases</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Array vs Pointer-Based Heap */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">💾 Memory: Why Array-Based Heaps Win</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">Array-Based Heap (Perfect!)</h4>
                <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Heap as array: [10, 20, 15, 30, 40]
// Memory layout (contiguous):
Address 0x1000: [10][20][15][30][40]
                 ↑   ↑   ↑   ↑   ↑
                 0   1   2   3   4 (indices)

Memory per element: 4 bytes (just the int!)
For 1M elements: 4MB

Navigation via math:
- Parent of i: (i-1)/2
- Left child: 2*i + 1
- Right child: 2*i + 2
No pointers! Just arithmetic!

Cache behavior:
- Sequential memory = cache-friendly
- Heapify down: parent→child in nearby locations
- One cache line loads multiple elements!`}
                </pre>
              </div>

              <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                <h4 className="font-semibold text-red-900 mb-2">Pointer-Based Heap (Bad!)</h4>
                <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Heap with TreeNode pointers
class HeapNode {
    int value;        // 4 bytes
    HeapNode left;    // 8 bytes
    HeapNode right;   // 8 bytes
    HeapNode parent;  // 8 bytes (for heapify up!)
}
// Object header: 12 bytes
// Alignment: 4 bytes
// Total: 44 bytes per node!

For 1M elements: 44MB (11x more!)

Navigation:
- Must follow pointers (slow!)
- Nodes scattered in memory
- Cache misses on every hop

Why nobody uses this:
❌ 11x memory overhead
❌ Poor cache locality
❌ Slower heapify operations
❌ More complex code
✓ Array is superior in every way!`}
                </pre>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-900 mb-2">Cache Performance: Heapify Operations</h4>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Heapify down: swap parent with child
// Array heap (FAST):
arr[0] = 40  ← Root at index 0
arr[1] = 30  ← Left child: index 1 (0x1004)
arr[2] = 20  ← Right child: index 2 (0x1008)

// All 3 elements in ONE cache line (64 bytes)!
// Comparing children: cache HIT! ⚡
// Swapping: cache HIT! ⚡

// Pointer heap (SLOW):
node @ 0x1000 → value:40
node.left @ 0x5A20 → value:30  ← Different cache line!
node.right @ 0x2F10 → value:20 ← Different cache line!

// Every access = cache MISS
// 100x slower than L1 cache!

Benchmark (1M heapify operations):
- Array heap: 15ms ⚡
- Pointer heap: 80ms (5x slower!)`}
              </pre>
            </div>
          </div>

          {/* Floyd's Build Heap Algorithm */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🔬 Floyd's Build Heap: O(n) Magic</h3>

            <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500 mb-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Why Not O(n log n)?</h4>
              <pre className="text-xs bg-white p-3 rounded">
{`// Naive: Insert n elements → O(n log n)
for (int i = 0; i < n; i++) {
    heap.insert(arr[i]);  // O(log n) each
}
// Total: n * log n

// Floyd's: Bottom-up heapify → O(n) ⚡
for (int i = n/2 - 1; i >= 0; i--) {
    heapifyDown(i);  // O(log n) worst, but...
}
// Total: O(n) - How?!`}
              </pre>
            </div>

            <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">The O(n) Proof</h4>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Key insight: Most nodes are near leaves!

Example: 15 elements (4 levels)
Level 0 (root):     1 node  × height 3 = 3 swaps max
Level 1:            2 nodes × height 2 = 4 swaps max
Level 2:            4 nodes × height 1 = 4 swaps max
Level 3 (leaves):   8 nodes × height 0 = 0 swaps (skip!)

Total swaps: 3 + 4 + 4 + 0 = 11 (not 15 log 15 = 58!)

General formula:
Sum from h=0 to log(n): (n/2^(h+1)) * h
= n * Sum from h=0 to log(n): h/2^(h+1)
= n * (converges to 2)
= O(n) ✓

Half the nodes are leaves (0 swaps)
Quarter are one level up (1 swap max)
Only root does log(n) work!

Brilliant algorithm! Used in:
- Java PriorityQueue constructor
- Heap sort initialization
- Any bulk heap building`}
              </pre>
            </div>
          </div>

          {/* Production Patterns */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🏭 Production Patterns with Heaps</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 1: Median Finder (2 Heaps)</h4>
                <pre className="text-xs bg-white p-3 rounded border">
{`// Find median of stream in O(log n) insert, O(1) query
class MedianFinder {
    // Max-heap for lower half
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    // Min-heap for upper half
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    /**
     * Invariant: maxHeap.size() ≥ minHeap.size()
     * Median: maxHeap.peek() or average of both tops
     *
     * Example: [1, 2, 3, 4, 5]
     * maxHeap: [3, 2, 1]  ← Lower half (max-heap)
     * minHeap: [4, 5]     ← Upper half (min-heap)
     * Median: 3 (top of maxHeap)
     */
    public void addNum(int num) {
        // Add to max-heap first
        maxHeap.offer(num);

        // Balance: ensure maxHeap.top ≤ minHeap.top
        minHeap.offer(maxHeap.poll());

        // Balance sizes: maxHeap.size ≥ minHeap.size
        if (maxHeap.size() < minHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }

    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek();  // Odd count
        } else {
            return (maxHeap.peek() + minHeap.peek()) / 2.0;  // Even
        }
    }
}

// Time: O(log n) insert, O(1) median
// Space: O(n)
// Used in: Streaming analytics, real-time statistics`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 2: Merge K Sorted Lists</h4>
                <pre className="text-xs bg-white p-3 rounded border">
{`// Merge k sorted linked lists efficiently
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Min-heap of (value, listIndex)
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(
            Comparator.comparingInt(a -> a[0])
        );

        // Initialize: add first element from each list
        for (int i = 0; i < lists.length; i++) {
            if (lists[i] != null) {
                minHeap.offer(new int[]{lists[i].val, i});
            }
        }

        ListNode dummy = new ListNode(0);
        ListNode current = dummy;

        while (!minHeap.isEmpty()) {
            int[] min = minHeap.poll();
            int value = min[0];
            int listIdx = min[1];

            // Add to result
            current.next = new ListNode(value);
            current = current.next;

            // Advance that list, add next element
            lists[listIdx] = lists[listIdx].next;
            if (lists[listIdx] != null) {
                minHeap.offer(new int[]{lists[listIdx].val, listIdx});
            }
        }

        return dummy.next;
    }
}

// Time: O(N log k) where N = total elements, k = lists
// Space: O(k) for heap
//
// Why heap?
// - Always get minimum of k elements
// - Better than comparing all k lists each time: O(N*k)
// - Heap reduces k comparisons to log k!
//
// Used in: Database merge sort, external sorting`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 3: Top K Frequent Elements</h4>
                <pre className="text-xs bg-white p-3 rounded border">
{`// Find k most frequent elements
int[] topKFrequent(int[] nums, int k) {
    // Count frequencies
    Map<Integer, Integer> freqMap = new HashMap<>();
    for (int num : nums) {
        freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
    }

    // Min-heap of size k (keep k most frequent)
    PriorityQueue<Map.Entry<Integer, Integer>> minHeap =
        new PriorityQueue<>(Comparator.comparingInt(Map.Entry::getValue));

    for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
        minHeap.offer(entry);

        // Keep only top k
        if (minHeap.size() > k) {
            minHeap.poll();  // Remove least frequent
        }
    }

    // Extract result
    int[] result = new int[k];
    for (int i = 0; i < k; i++) {
        result[i] = minHeap.poll().getKey();
    }
    return result;
}

// Time: O(n log k) - better than O(n log n) full sort!
// Space: O(n) for freq map + O(k) for heap
//
// Why min-heap of size k?
// - Keep k largest → use min-heap (remove smallest)
// - Keep k smallest → use max-heap (remove largest)
//
// Used in: Analytics, trending topics, autocomplete`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 4: Dijkstra's Shortest Path</h4>
                <pre className="text-xs bg-white p-3 rounded border">
{`// Dijkstra's algorithm using min-heap
int[] dijkstra(int[][] graph, int start) {
    int n = graph.length;
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;

    // Min-heap: (distance, node)
    PriorityQueue<int[]> minHeap = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[0])
    );
    minHeap.offer(new int[]{0, start});

    boolean[] visited = new boolean[n];

    while (!minHeap.isEmpty()) {
        int[] curr = minHeap.poll();
        int d = curr[0];
        int u = curr[1];

        if (visited[u]) continue;
        visited[u] = true;

        // Relax edges
        for (int v = 0; v < n; v++) {
            if (graph[u][v] != 0 && !visited[v]) {
                int newDist = dist[u] + graph[u][v];
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    minHeap.offer(new int[]{newDist, v});
                }
            }
        }
    }

    return dist;
}

// Time: O((V + E) log V) with heap
//       O(V²) with array (checking all vertices)
// Space: O(V) for heap
//
// Why heap critical?
// - Always process closest unvisited node
// - Without heap: O(V²) to find minimum each time
// - With heap: O(log V) to extract minimum
//
// Used in: GPS navigation, network routing, game AI`}
                </pre>
              </div>
            </div>
          </div>

          {/* Interview Problems */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🎯 Interview-Level Heap Problems</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 1: Kth Largest Element (Medium - Facebook/Amazon)</h4>
                <p className="text-sm text-gray-600 mb-3">Find kth largest in unsorted array. Min-heap of size k!</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Approach 1: Min-heap of size k
int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();  // Remove smallest
        }
    }

    return minHeap.peek();  // kth largest!
}

// Example: [3,2,1,5,6,4], k=2
// Process: heap grows to size k, keeps k largest
// [3] → [2,3] → [2,3] (remove 1) → [3,5] → [5,6] → [5,6]
// Result: 5 (2nd largest) ✓

// Time: O(n log k)
// Space: O(k)

// Approach 2: Quick Select (average O(n)!)
int findKthLargest(int[] nums, int k) {
    return quickSelect(nums, 0, nums.length - 1, nums.length - k);
}

int quickSelect(int[] nums, int left, int right, int k) {
    if (left == right) return nums[left];

    int pivotIndex = partition(nums, left, right);

    if (k == pivotIndex) return nums[k];
    else if (k < pivotIndex) return quickSelect(nums, left, pivotIndex - 1, k);
    else return quickSelect(nums, pivotIndex + 1, right, k);
}

// Time: O(n) average, O(n²) worst
// Space: O(1)
// Heap approach more consistent!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 2: Task Scheduler (Medium - Google)</h4>
                <p className="text-sm text-gray-600 mb-3">Schedule tasks with cooldown. Heap + queue combo!</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Tasks with frequencies, cooldown n between same task
int leastInterval(char[] tasks, int n) {
    // Count frequencies
    int[] freq = new int[26];
    for (char task : tasks) {
        freq[task - 'A']++;
    }

    // Max-heap by frequency
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int f : freq) {
        if (f > 0) maxHeap.offer(f);
    }

    int time = 0;
    Queue<int[]> cooldown = new LinkedList<>();  // [freq, availableTime]

    while (!maxHeap.isEmpty() || !cooldown.isEmpty()) {
        time++;

        if (!maxHeap.isEmpty()) {
            int f = maxHeap.poll() - 1;
            if (f > 0) {
                cooldown.offer(new int[]{f, time + n});
            }
        }

        // Check if any task cooled down
        if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {
            maxHeap.offer(cooldown.poll()[0]);
        }
    }

    return time;
}

// Example: tasks=['A','A','A','B','B','B'], n=2
// A → _ → _ → A → _ → _ → A (6 intervals with cooldown 2)
// Optimal: A → B → idle → A → B → idle → A → B = 8

// Time: O(n log 26) = O(n)
// Space: O(26) = O(1)
// Heap ensures we schedule most frequent task when possible!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 3: Meeting Rooms II (Medium - Microsoft/Amazon)</h4>
                <p className="text-sm text-gray-600 mb-3">Minimum conference rooms needed. Min-heap tracks end times!</p>
                <pre className="text-xs bg-white p-3 rounded">
{`int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;

    // Sort by start time
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));

    // Min-heap of end times
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    for (int[] meeting : intervals) {
        // If earliest ending meeting finishes before this starts
        if (!minHeap.isEmpty() && minHeap.peek() <= meeting[0]) {
            minHeap.poll();  // Reuse that room!
        }

        // Allocate room (add end time)
        minHeap.offer(meeting[1]);
    }

    return minHeap.size();  // Number of rooms = heap size
}

// Example: [[0,30],[5,10],[15,20]]
// Sort: [[0,30],[5,10],[15,20]] (already sorted)
// Process:
// [0,30]: heap=[30], rooms=1
// [5,10]: 30>5 (overlaps!), heap=[10,30], rooms=2
// [15,20]: 10≤15 (reuse!), heap=[20,30], rooms=2
// Answer: 2 rooms needed

// Time: O(n log n) - sort + heap ops
// Space: O(n) - heap
//
// Why heap?
// - Track earliest ending meeting
// - O(log n) to find instead of O(n)
// - Optimal room allocation!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 4: Reorganize String (Medium - Google/Amazon)</h4>
                <p className="text-sm text-gray-600 mb-3">Rearrange so no adjacent duplicates. Max-heap + greedy!</p>
                <pre className="text-xs bg-white p-3 rounded">
{`String reorganizeString(String s) {
    // Count frequencies
    int[] freq = new int[26];
    for (char c : s.toCharArray()) {
        freq[c - 'a']++;
    }

    // Max-heap by frequency
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
        (a, b) -> b[1] - a[1]
    );

    for (int i = 0; i < 26; i++) {
        if (freq[i] > 0) {
            maxHeap.offer(new int[]{i, freq[i]});
        }
    }

    StringBuilder result = new StringBuilder();
    int[] prev = null;

    while (!maxHeap.isEmpty() || prev != null) {
        // If only prev left but heap empty → impossible!
        if (maxHeap.isEmpty() && prev != null) {
            return "";
        }

        int[] curr = maxHeap.poll();
        result.append((char)('a' + curr[0]));
        curr[1]--;

        // Add prev back to heap
        if (prev != null && prev[1] > 0) {
            maxHeap.offer(prev);
        }

        prev = curr[1] > 0 ? curr : null;
    }

    return result.toString();
}

// Example: "aab"
// Freq: a=2, b=1
// Heap: [(a,2), (b,1)]
// Process:
// Pick 'a' (most frequent): "a", prev=null, heap=[(b,1),(a,1)]
// Pick 'b': "ab", prev=(a,1), heap=[]
// Pick 'a': "aba" ✓
//
// Impossible: "aaab"
// Freq: a=3, b=1 → too many a's! Return ""

// Time: O(n log 26) = O(n)
// Space: O(26) = O(1)
// Greedy: always use most frequent available!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 5: Sliding Window Maximum (Hard - Amazon/Google)</h4>
                <p className="text-sm text-gray-600 mb-3">Max in each window of size k. Deque better than heap here!</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Approach 1: Max-heap (works but suboptimal)
int[] maxSlidingWindow_Heap(int[] nums, int k) {
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
        (a, b) -> b[0] - a[0]  // [value, index]
    );

    int[] result = new int[nums.length - k + 1];

    for (int i = 0; i < nums.length; i++) {
        maxHeap.offer(new int[]{nums[i], i});

        // Remove elements outside window
        while (maxHeap.peek()[1] <= i - k) {
            maxHeap.poll();
        }

        if (i >= k - 1) {
            result[i - k + 1] = maxHeap.peek()[0];
        }
    }

    return result;
}
// Time: O(n log n) - heap operations
// Space: O(n)

// Approach 2: Deque (optimal!)
int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> deque = new ArrayDeque<>();  // Store indices
    int[] result = new int[nums.length - k + 1];

    for (int i = 0; i < nums.length; i++) {
        // Remove indices outside window
        while (!deque.isEmpty() && deque.peekFirst() <= i - k) {
            deque.pollFirst();
        }

        // Remove smaller elements (they can't be max)
        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
            deque.pollLast();
        }

        deque.offerLast(i);

        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.peekFirst()];
        }
    }

    return result;
}
// Time: O(n) - each element added/removed once! ⚡
// Space: O(k)
//
// When heap is NOT optimal:
// - Need to remove arbitrary elements (heap: O(n))
// - Deque maintains decreasing order
// - Always O(1) to get max!`}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Why Heaps Are Fundamental */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-green-600 mb-4">🚀 Why Heaps Are Fundamental</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-bold text-gray-800 mb-2">O(1) Min/Max Access</div>
            <div className="text-sm text-gray-600">
              Root is always min/max! Perfect for priority queues, task scheduling, and finding extremes quickly.
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">📦</div>
            <div className="font-bold text-gray-800 mb-2">Array-Based Efficiency</div>
            <div className="text-sm text-gray-600">
              No pointer overhead! Cache-friendly sequential memory. 9x less memory than pointer-based trees.
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">🔧</div>
            <div className="font-bold text-gray-800 mb-2">Versatile Building Block</div>
            <div className="text-sm text-gray-600">
              Powers heap sort, priority queues, graph algorithms, streaming algorithms, and more!
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg">
          <div className="font-bold text-gray-800 mb-3">Real-World Impact:</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="text-green-600 font-bold mr-2">•</span>
              <span><strong>Operating Systems:</strong> Process scheduling (priority-based task execution)</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 font-bold mr-2">•</span>
              <span><strong>Graph Algorithms:</strong> Dijkstra's shortest path, Prim's MST, A* pathfinding</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 font-bold mr-2">•</span>
              <span><strong>Data Compression:</strong> Huffman coding for optimal compression</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 font-bold mr-2">•</span>
              <span><strong>Streaming Analytics:</strong> Top-K, median finding, percentiles in real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 flex justify-between items-center border-t pt-6">
        <Link
          to="/tree"
          className="flex items-center text-blue-600 hover:text-blue-700 font-semibold"
        >
          <span className="mr-2">←</span> Previous: Binary Tree
        </Link>
        <Link
          to="/complexity"
          className="text-gray-600 hover:text-gray-700"
        >
          Review Complexity Guide
        </Link>
        <div className="text-gray-400">
          Next: Graph →
        </div>
      </div>
    </div>
  )
}

export default HeapVisualizerEnhanced
