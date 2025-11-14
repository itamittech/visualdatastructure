import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'
import JavaQueueImplementations from '../components/JavaQueueImplementations'

function QueueVisualizerEnhanced() {
  const [queue, setQueue] = useState([10, 20, 30])
  const [inputValue, setInputValue] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(null)
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)

  const handleEnqueue = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const newQueue = [...queue, value]
    setQueue(newQueue)
    setHighlightIndex(newQueue.length - 1)
    setMessage(`Enqueued ${value} - Added to REAR of queue! O(1) operation`)
    setTimeout(() => setHighlightIndex(null), 1000)
  }

  const handleDequeue = () => {
    if (queue.length === 0) {
      setMessage('Queue is empty - Cannot dequeue!')
      return
    }

    const dequeuedValue = queue[0]
    const newQueue = queue.slice(1)
    setQueue(newQueue)
    setMessage(`Dequeued ${dequeuedValue} - Removed from FRONT! O(1) operation (with circular buffer)`)
  }

  const handlePeek = () => {
    if (queue.length === 0) {
      setMessage('Queue is empty - Nothing to peek!')
      return
    }

    const frontValue = queue[0]
    setHighlightIndex(0)
    setMessage(`Peek: ${frontValue} is at the FRONT - First one to be dequeued! O(1) operation`)
    setTimeout(() => setHighlightIndex(null), 2000)
  }

  const handleClear = () => {
    setQueue([])
    setMessage('Queue cleared - All elements removed')
  }

  const complexityData = {
    operations: [
      {
        name: 'Enqueue',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Add element to rear of queue. With circular buffer, just increment rear pointer!'
      },
      {
        name: 'Dequeue',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Remove element from front. With circular buffer, just increment front pointer!'
      },
      {
        name: 'Peek/Front',
        time: 'O(1)',
        space: 'O(1)',
        description: 'View front element without removing. Just read array[front] - constant time!'
      },
      {
        name: 'isEmpty',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Check if queue is empty. Compare front == rear or check size - constant time!'
      },
      {
        name: 'Size',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Get number of elements. Return stored size variable - constant time!'
      },
      {
        name: 'Search',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Find element in queue. Must check all elements - linear time. Rarely needed!'
      },
    ]
  }

  const circularQueueCode = `// Circular Queue Implementation from Scratch
public class CircularQueue<T> {
    private T[] array;
    private int front;    // Index of front element
    private int rear;     // Index where next element will be added
    private int size;     // Current number of elements
    private int capacity; // Maximum capacity

    /**
     * WHY CIRCULAR? Avoid wasted space!
     *
     * Simple Queue Problem:
     * After multiple enqueue/dequeue operations:
     * [_, _, _, 40, 50, 60]  <- front=3, can't use indices 0-2!
     *
     * Circular Queue Solution:
     * [60, _, _, 40, 50, _]  <- rear wraps around to index 0!
     * Use: index = (index + 1) % capacity
     */

    @SuppressWarnings("unchecked")
    public CircularQueue(int capacity) {
        this.capacity = capacity;
        this.array = (T[]) new Object[capacity];
        this.front = 0;
        this.rear = 0;
        this.size = 0;
    }

    /**
     * Enqueue: Add to rear
     * WHY O(1)? Just place at rear and increment!
     *
     * Steps:
     * 1. Check if full: O(1)
     * 2. Place element at rear: O(1)
     * 3. Increment rear with wrap-around: O(1)
     * Total: O(1) - No shifting needed!
     *
     * The magic: (rear + 1) % capacity
     * Example: capacity=5, rear=4
     * → (4 + 1) % 5 = 0  (wraps to beginning!)
     */
    public boolean enqueue(T data) {
        if (isFull()) {
            return false;  // Queue is full
        }

        array[rear] = data;
        rear = (rear + 1) % capacity;  // Circular increment!
        size++;
        return true;
    }

    /**
     * Dequeue: Remove from front
     * WHY O(1)? Just read front and increment!
     *
     * Steps:
     * 1. Check if empty: O(1)
     * 2. Read element at front: O(1)
     * 3. Increment front with wrap-around: O(1)
     * Total: O(1) - No shifting needed!
     *
     * Key insight: We don't actually "remove" the element.
     * We just move the front pointer. Old element will be
     * overwritten when we wrap around.
     */
    public T dequeue() {
        if (isEmpty()) {
            return null;  // Queue is empty
        }

        T data = array[front];
        array[front] = null;  // Help GC (optional)
        front = (front + 1) % capacity;  // Circular increment!
        size--;
        return data;
    }

    /**
     * Peek: View front without removing
     * WHY O(1)? Just read array[front]!
     */
    public T peek() {
        if (isEmpty()) {
            return null;
        }
        return array[front];
    }

    /**
     * Check if empty
     * WHY O(1)? Just check size!
     */
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * Check if full
     * WHY O(1)? Just compare size to capacity!
     */
    public boolean isFull() {
        return size == capacity;
    }

    public int size() {
        return size;
    }

    /**
     * OPTIMIZATION: Power-of-2 Capacity
     *
     * If capacity is power of 2 (4, 8, 16, 32...):
     * Instead of: (index + 1) % capacity  (slow division!)
     * Use:        (index + 1) & (capacity - 1)  (fast bitwise AND!)
     *
     * Example: capacity=8 (binary: 1000)
     * capacity-1=7 (binary: 0111)
     *
     * (5 + 1) & 7 = 6 & 7 = 6  ✓
     * (7 + 1) & 7 = 8 & 7 = 0  ✓ (wraps around!)
     *
     * This is what ArrayDeque does internally!
     */
}`

  const javaLibraryCode = `// Using Java's Built-in Queue Implementations
import java.util.*;

public class QueueExample {
    public static void main(String[] args) {
        /**
         * RECOMMENDED: ArrayDeque
         * - Resizable circular array (starts at 16, doubles when full)
         * - Faster than LinkedList (better cache locality)
         * - O(1) operations at both ends
         * - NOT thread-safe (use ArrayBlockingQueue for concurrency)
         */
        Queue<Integer> queue = new ArrayDeque<>();

        // Enqueue (add to rear)
        queue.offer(10);   // Preferred - returns false if fails
        queue.add(20);     // Alternative - throws exception if fails
        queue.offer(30);
        // Queue: [10, 20, 30] (front → rear)

        // Peek (view front without removing)
        int front = queue.peek();     // 10 - returns null if empty
        int front2 = queue.element(); // 10 - throws exception if empty

        // Dequeue (remove from front)
        int removed = queue.poll();   // 10 - returns null if empty
        int removed2 = queue.remove(); // 20 - throws exception if empty
        // Queue: [30]

        // Check status
        boolean empty = queue.isEmpty();  // false
        int size = queue.size();          // 1

        /* ============================================
         * ALTERNATIVE: LinkedList (also implements Queue)
         * - Doubly-linked list
         * - True O(1) without resizing
         * - More memory overhead (24 bytes per node vs 4-8 for array)
         * - Slower iteration (cache misses)
         * ============================================ */
        Queue<String> linkedQueue = new LinkedList<>();
        linkedQueue.offer("first");
        linkedQueue.offer("second");
        String dequeued = linkedQueue.poll();  // "first"

        /* ============================================
         * FOR CONCURRENCY: Blocking Queues
         * ============================================ */

        // ArrayBlockingQueue - Bounded, thread-safe with locks
        BlockingQueue<Task> taskQueue = new ArrayBlockingQueue<>(100);

        // Producer thread:
        taskQueue.put(new Task());  // Blocks if full

        // Consumer thread:
        Task task = taskQueue.take();  // Blocks if empty

        // ConcurrentLinkedQueue - Unbounded, lock-free (CAS)
        Queue<Event> eventQueue = new ConcurrentLinkedQueue<>();
        eventQueue.offer(new Event());  // Never blocks
        Event event = eventQueue.poll(); // Non-blocking

        /* ============================================
         * WHEN TO USE EACH:
         * ============================================ */

        // ArrayDeque:
        // ✓ Default choice for single-threaded queues
        // ✓ Fast, low memory overhead
        // ✓ Can use as Stack or Queue (Deque interface)

        // LinkedList:
        // ✓ Need true O(1) without occasional resize cost
        // ✓ Already using LinkedList elsewhere
        // ✗ Generally slower than ArrayDeque

        // ArrayBlockingQueue:
        // ✓ Producer-consumer pattern with bounded buffer
        // ✓ Need blocking behavior (wait when full/empty)
        // ✓ Fair lock policy option

        // ConcurrentLinkedQueue:
        // ✓ Unbounded concurrent queue
        // ✓ High throughput (lock-free)
        // ✗ No blocking (use LinkedBlockingQueue if needed)

        /* ============================================
         * BFS TRAVERSAL EXAMPLE
         * ============================================ */
        Queue<TreeNode> bfsQueue = new ArrayDeque<>();
        bfsQueue.offer(root);

        while (!bfsQueue.isEmpty()) {
            TreeNode node = bfsQueue.poll();
            process(node);

            if (node.left != null) bfsQueue.offer(node.left);
            if (node.right != null) bfsQueue.offer(node.right);
        }
    }
}`

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Queue - Deep Dive</h1>
        <button
          onClick={() => setShowLearningMode(!showLearningMode)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            showLearningMode
              ? 'bg-teal-500 text-white'
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is a Queue?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            A <strong>queue</strong> is a linear data structure that follows <strong>FIFO (First In First Out)</strong> principle.
            Elements are added at the <strong>rear (back)</strong> and removed from the <strong>front</strong>, just like a line at a bank or store!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-teal-700 mb-3">📊 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-teal-600 font-bold mr-2">✓</span>
                <span><strong>FIFO Order:</strong> First element added is the first to be removed (like waiting in line).</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 font-bold mr-2">✓</span>
                <span><strong>Two Pointers:</strong> Front pointer (where we remove) and rear pointer (where we add).</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 font-bold mr-2">✓</span>
                <span><strong>O(1) Operations:</strong> Both enqueue and dequeue are constant time with proper implementation!</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 font-bold mr-2">✓</span>
                <span><strong>Circular Buffer:</strong> Efficient array-based queue reuses space by wrapping around.</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 font-bold mr-2">✓</span>
                <span><strong>Sequential Access:</strong> Can only add/remove from ends - no random access.</span>
              </li>
            </ul>
          </div>

          <div className="bg-teal-100 rounded-lg p-5">
            <h4 className="font-bold text-teal-900 mb-3">🔄 Queue vs Stack - The Fundamental Difference</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <strong className="text-teal-700">Queue (FIFO):</strong>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• First In, First Out</li>
                  <li>• Add at rear, remove from front</li>
                  <li>• Like a line at a store</li>
                  <li>• Used for: BFS, scheduling, buffering</li>
                </ul>
              </div>
              <div className="bg-white rounded p-3">
                <strong className="text-purple-700">Stack (LIFO):</strong>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Last In, First Out</li>
                  <li>• Add and remove from same end (top)</li>
                  <li>• Like a stack of plates</li>
                  <li>• Used for: DFS, undo/redo, recursion</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-teal-50 rounded-lg p-5 border-l-4 border-teal-500">
              <h4 className="font-bold text-teal-800 mb-2">✓ When to Use Queue</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Processing tasks in order received</li>
                <li>• BFS (Breadth-First Search) traversal</li>
                <li>• Print job scheduling</li>
                <li>• Request handling in web servers</li>
                <li>• Message queues (Kafka, RabbitMQ)</li>
                <li>• CPU task scheduling</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use Queue</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need random access by index (use Array)</li>
                <li>• Need to remove from middle (use LinkedList)</li>
                <li>• Priority-based processing (use PriorityQueue)</li>
                <li>• Need LIFO behavior (use Stack)</li>
                <li>• Frequent insertions in middle (use LinkedList)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Print Queue:</strong>
                <p className="text-gray-600 mt-1">Documents print in order submitted - first submitted, first printed</p>
              </div>
              <div>
                <strong className="text-gray-800">Call Center:</strong>
                <p className="text-gray-600 mt-1">Callers wait in queue - first to call, first to be served</p>
              </div>
              <div>
                <strong className="text-gray-800">BFS Traversal:</strong>
                <p className="text-gray-600 mt-1">Visit tree/graph nodes level by level using queue</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">🎯 Core Operations</h4>
            <div className="space-y-2 text-sm">
              <p><code className="bg-white px-2 py-1 rounded font-mono">enqueue(x)</code> - Add element x to rear - O(1)</p>
              <p><code className="bg-white px-2 py-1 rounded font-mono">dequeue()</code> - Remove and return front element - O(1)</p>
              <p><code className="bg-white px-2 py-1 rounded font-mono">peek()</code> - View front element without removing - O(1)</p>
              <p><code className="bg-white px-2 py-1 rounded font-mono">isEmpty()</code> - Check if queue is empty - O(1)</p>
              <p><code className="bg-white px-2 py-1 rounded font-mono">size()</code> - Get number of elements - O(1)</p>
            </div>
          </div>
        </div>
      </div>

      {showLearningMode && (
        <div className="bg-teal-50 border-2 border-teal-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="text-3xl mr-3">🎓</div>
            <div>
              <div className="font-bold text-teal-800 text-lg mb-1">
                Learning Mode Active!
              </div>
              <div className="text-teal-700">
                Perform Enqueue or Dequeue to see how FIFO (First In First Out) works.
                Watch how elements are added at the REAR and removed from the FRONT!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Queue Visualization</h2>
        </div>

        {/* Queue Display - Horizontal */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex flex-col items-center min-w-max">
            {/* Labels */}
            <div className="flex items-center justify-between w-full mb-2 px-4">
              <span className="text-sm font-bold text-green-700">← FRONT (Dequeue here)</span>
              <span className="text-sm font-bold text-blue-700">REAR (Enqueue here) →</span>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {queue.length === 0 ? (
                <div className="text-gray-500 text-lg py-8 px-12">Queue is empty</div>
              ) : (
                <>
                  {queue.map((value, index) => (
                    <div
                      key={index}
                      className={`w-20 h-20 border-2 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                        highlightIndex === index
                          ? 'bg-yellow-300 border-yellow-500 shadow-xl scale-110'
                          : 'bg-teal-100 border-teal-500'
                      }`}
                    >
                      {value}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 mt-3 bg-teal-50 p-3 rounded">
            <strong>FIFO Behavior:</strong> Elements are added at the REAR (right) and removed from the FRONT (left).
            First element added is the first to be removed!
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value to Enqueue
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
            placeholder="Enter value"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleEnqueue}
            className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Enqueue - Add to rear - O(1)"
          >
            Enqueue (Add to Rear) → O(1) ⚡
          </button>
          <button
            onClick={handleDequeue}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Dequeue - Remove from front - O(1)"
          >
            Dequeue (Remove from Front) → O(1) ⚡
          </button>
          <button
            onClick={handlePeek}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Peek - View front - O(1)"
          >
            Peek (View Front) → O(1)
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Clear queue"
          >
            Clear Queue
          </button>
        </div>

        {message && (
          <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-700 px-4 py-3 rounded">
            <strong>Result:</strong> {message}
          </div>
        )}
      </div>

      <ComplexityInfo data={complexityData} />

      {/* Java Queue Implementations */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Java Queue Implementations - Complete Guide
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Java provides multiple Queue implementations: ArrayDeque (recommended), LinkedList, PriorityQueue,
          and concurrent queues like ArrayBlockingQueue and ConcurrentLinkedQueue for multi-threaded scenarios.
        </p>
        <JavaQueueImplementations />
      </div>

      {/* STEP 3: Code Implementation Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-purple-500">
        <div className="flex items-center mb-6">
          <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">3</div>
          <h2 className="text-3xl font-bold text-gray-800">Code: Implementation Details</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <CodeDisplay
            title="Circular Queue from Scratch (efficient!)"
            code={circularQueueCode}
            language="java"
          />
          <CodeDisplay
            title="Using Java's Queue (ArrayDeque recommended)"
            code={javaLibraryCode}
            language="java"
          />
        </div>
      </div>

      {/* Quick Comparison */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-orange-600 mb-4">💡 Queue vs Stack Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white">
                <th className="p-3 text-left">Aspect</th>
                <th className="p-3 text-center">Queue</th>
                <th className="p-3 text-center">Stack</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Order</td>
                <td className="p-3 text-center text-teal-600 font-bold">FIFO (First In First Out)</td>
                <td className="p-3 text-center text-purple-600 font-bold">LIFO (Last In First Out)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-semibold">Insert Operation</td>
                <td className="p-3 text-center">Enqueue at rear</td>
                <td className="p-3 text-center">Push at top</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Remove Operation</td>
                <td className="p-3 text-center">Dequeue from front</td>
                <td className="p-3 text-center">Pop from top</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-semibold">Real-World Analogy</td>
                <td className="p-3 text-center">Line at bank</td>
                <td className="p-3 text-center">Stack of plates</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Use Case</td>
                <td className="p-3 text-center">BFS, Scheduling, Buffering</td>
                <td className="p-3 text-center">DFS, Undo/Redo, Recursion</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 4: Advanced Section - Moved to end */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-lg shadow-md p-8 mb-8 border-l-8 border-slate-500">
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
                <li>Then return here for deep dives into circular buffers, concurrency, production patterns, and interview problems</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Circular Buffer Deep Dive */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🔄 Circular Buffer: The Key to O(1) Queue</h3>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Why Circular? The Space Waste Problem</h4>
              <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`// Simple Queue (NO wrap-around) - WASTEFUL!
int[] arr = new int[10];
int front = 0;
int rear = 0;

// After 5 enqueues and 3 dequeues:
[X, X, X, 40, 50, _, _, _, _, _]
           ↑   ↑
         front rear

// Problem: Indices 0-2 are wasted! Can't reuse them.
// After 7 more enqueues, rear reaches end even though
// there's space at the beginning!

// Circular Queue - EFFICIENT!
int front = 3, rear = 0;  // rear wrapped around!
[60, 70, _, 40, 50, _, _, _, _, _]
     ↑      ↑
    rear  front

// Magic formula: rear = (rear + 1) % capacity
// When rear=9: (9+1)%10 = 0 → wraps to beginning!

// Space Efficiency:
Simple Queue:  Can only use n - front positions (wasteful)
Circular Queue: Can use ALL positions (optimal)`}
              </pre>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <h4 className="font-semibold text-green-900 mb-2">Power-of-2 Optimization</h4>
              <pre className="bg-white border p-3 rounded text-xs">
{`// ArrayDeque uses power-of-2 capacity (8, 16, 32...)

// Slow modulo:
rear = (rear + 1) % capacity;  // Division is slow! (~20-30 cycles)

// Fast bitwise AND (when capacity is power of 2):
rear = (rear + 1) & (capacity - 1);  // Just 1 cycle! ⚡

// Why this works:
capacity = 16  (binary: 0001 0000)
capacity - 1 = 15 (binary: 0000 1111)  ← All 1s in lower bits!

(15 + 1) & 15 = 16 & 15 = 0  ← Automatic wrap!
(5 + 1) & 15 = 6 & 15 = 6    ← Normal increment

// Speedup: Bitwise AND is 20-30x faster than modulo!
// This is why ArrayDeque uses powers of 2.`}
              </pre>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Memory Layout</h4>
                <pre className="bg-white border p-3 rounded text-xs">
{`// ArrayDeque internal structure
class ArrayDeque<E> {
    Object[] elements;  // Circular array
    int head;           // Front index
    int tail;           // Next insert index

    // Initial capacity: 16
    // Doubles when full
    // Never shrinks (deliberate!)
}

// Memory per element:
ArrayDeque:   4-8 bytes (just array slot)
LinkedList:   24 bytes (Node object)

// 1K elements:
ArrayDeque:   ~4-8 KB
LinkedList:   ~24 KB + GC overhead

// Winner: ArrayDeque (3-6x less memory)`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Cache Behavior</h4>
                <pre className="bg-white border p-3 rounded text-xs">
{`// ArrayDeque: Contiguous memory
Cache Line (64 bytes):
[10][20][30][40][50][60][70][80]
 ↑ All loaded together!

// Iteration speed: FAST (prefetching)

// LinkedList: Scattered nodes
Node at 0x1000 → next at 0x5FA0 → ...
Each access = potential cache miss

// Benchmark (1M elements):
ArrayDeque iteration:    2.3ms ⚡
LinkedList iteration:   19.2ms
Difference: 8.3x slower!

// Why: CPU can prefetch ArrayDeque,
// but LinkedList requires RAM access
// for each node (~100ns latency)`}
                </pre>
              </div>
            </div>
          </div>

          {/* Production Patterns */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🏭 Production Patterns</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">Pattern 1: Producer-Consumer</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Classic multi-threaded pattern with BlockingQueue
BlockingQueue<Task> queue = new ArrayBlockingQueue<>(1000);

// Producer thread (generates tasks):
class Producer implements Runnable {
    public void run() {
        while (true) {
            Task task = generateTask();
            queue.put(task);  // Blocks if queue is full!
        }
    }
}

// Consumer thread (processes tasks):
class Consumer implements Runnable {
    public void run() {
        while (true) {
            Task task = queue.take();  // Blocks if queue is empty!
            process(task);
        }
    }
}

// Benefits:
✓ Automatic flow control (back-pressure)
✓ No busy-waiting (threads block efficiently)
✓ Thread-safe without explicit locks
✓ Bounded buffer prevents memory overflow

// Real use: Web servers, video encoding, ETL pipelines`}
                </pre>
              </div>

              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-900 mb-2">Pattern 2: BFS Traversal</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Breadth-First Search using Queue
Queue<TreeNode> queue = new ArrayDeque<>();
queue.offer(root);
Set<TreeNode> visited = new HashSet<>();

while (!queue.isEmpty()) {
    TreeNode node = queue.poll();  // Process level by level

    if (visited.contains(node)) continue;
    visited.add(node);

    process(node);  // Visit node

    // Add children to queue (next level)
    for (TreeNode child : node.children) {
        queue.offer(child);
    }
}

// Why Queue? Processes level-by-level:
Level 0: [A]
Level 1: [B, C]       ← Process A, add B and C
Level 2: [D, E, F, G] ← Process B, C, add children

// Compare to Stack (DFS): Goes deep first, not level-by-level`}
                </pre>
              </div>

              <div className="bg-yellow-50 p-4 rounded">
                <h4 className="font-semibold text-yellow-900 mb-2">Pattern 3: Rate Limiting (Token Bucket)</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Token bucket algorithm with circular queue
class RateLimiter {
    private final Queue<Long> timestamps = new ArrayDeque<>();
    private final int maxRequests;
    private final long timeWindowMs;

    public boolean allowRequest() {
        long now = System.currentTimeMillis();

        // Remove expired timestamps (older than time window)
        while (!timestamps.isEmpty() &&
               now - timestamps.peek() > timeWindowMs) {
            timestamps.poll();
        }

        // Check if under limit
        if (timestamps.size() < maxRequests) {
            timestamps.offer(now);
            return true;
        }
        return false;  // Rate limit exceeded
    }
}

// Example: 100 requests per second
RateLimiter limiter = new RateLimiter(100, 1000);

// Request arrives:
if (limiter.allowRequest()) {
    processRequest();
} else {
    return 429;  // Too Many Requests
}

// Used by: APIs (rate limiting), load balancers`}
                </pre>
              </div>
            </div>
          </div>

          {/* Concurrency */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🔒 Concurrency: Thread-Safe Queues</h3>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-semibold text-purple-900 mb-2">ArrayBlockingQueue - Bounded with Locks</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Fixed-size queue with ReentrantLock
ArrayBlockingQueue<Task> queue = new ArrayBlockingQueue<>(1000);

// Internal structure:
class ArrayBlockingQueue<E> {
    final Object[] items;     // Circular array
    final ReentrantLock lock; // Single lock for both ends!
    final Condition notEmpty; // Signals when dequeue possible
    final Condition notFull;  // Signals when enqueue possible
}

// put() - Blocking enqueue:
queue.put(task);
// → Acquires lock
// → If full, waits on notFull condition
// → Adds element
// → Signals notEmpty
// → Releases lock

// Throughput: ~1-2M ops/sec (single lock bottleneck)
// Best for: Bounded buffer, back-pressure needed`}
                </pre>
              </div>

              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-900 mb-2">ConcurrentLinkedQueue - Lock-Free</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Unbounded, non-blocking queue using CAS
ConcurrentLinkedQueue<Event> queue = new ConcurrentLinkedQueue<>();

// Uses Compare-And-Swap (no locks!):
class Node<E> {
    volatile E item;
    volatile Node<E> next;  // Updated via CAS
}

// CAS operation (atomic):
boolean compareAndSet(Node expected, Node newNode) {
    // If current == expected, set to newNode atomically
    // Returns true if successful, false if another thread changed it
}

// offer() pseudocode:
while (true) {
    Node<E> t = tail;
    Node<E> s = t.next;

    if (t == tail) {  // Check tail hasn't changed
        if (s == null) {
            if (t.casNext(null, newNode)) {  // Try to link
                casTail(t, newNode);  // Update tail
                return true;
            }
        }
    }
}

// Throughput: ~10-20M ops/sec (no locks!) ⚡
// Best for: High concurrency, unbounded, non-blocking needed

// Trade-off: No blocking, must handle queue full elsewhere`}
                </pre>
              </div>

              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">Performance Comparison</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Benchmark: 4 producers, 4 consumers, 10M operations

ArrayBlockingQueue (1024 capacity):
Throughput:      1.8M ops/sec
Latency (avg):   550ns
Latency (p99):   2,100ns
Memory:          Fixed (1024 slots)

LinkedBlockingQueue (unbounded):
Throughput:      2.5M ops/sec
Latency (avg):   400ns
Latency (p99):   1,800ns
Memory:          Dynamic (grows as needed)

ConcurrentLinkedQueue (unbounded):
Throughput:      15.2M ops/sec ⚡
Latency (avg):   65ns
Latency (p99):   450ns
Memory:          Dynamic + GC pressure

// When to use each:
ArrayBlockingQueue:  Need bounded buffer + back-pressure
LinkedBlockingQueue: Need unbounded + blocking
ConcurrentLinkedQueue: Maximum throughput, handle full elsewhere`}
                </pre>
              </div>
            </div>
          </div>

          {/* Interview Problems */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🎯 Interview-Level Queue Problems</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 1: Implement Circular Queue</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// LeetCode: Design Circular Queue
class MyCircularQueue {
    private int[] arr;
    private int front, rear, size, capacity;

    public MyCircularQueue(int k) {
        arr = new int[k];
        capacity = k;
        front = 0;
        rear = -1;  // rear starts before first element
        size = 0;
    }

    public boolean enQueue(int value) {
        if (isFull()) return false;
        rear = (rear + 1) % capacity;  // Circular increment!
        arr[rear] = value;
        size++;
        return true;
    }

    public boolean deQueue() {
        if (isEmpty()) return false;
        front = (front + 1) % capacity;  // Circular increment!
        size--;
        return true;
    }

    public int Front() {
        return isEmpty() ? -1 : arr[front];
    }

    public int Rear() {
        return isEmpty() ? -1 : arr[rear];
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public boolean isFull() {
        return size == capacity;
    }
}

// Time: O(1) for all operations
// Space: O(k)
// Key insight: Use size to distinguish empty vs full`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 2: Implement Queue using Two Stacks</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Amazon, Microsoft interview favorite
class MyQueue {
    private Stack<Integer> inStack;   // For enqueue
    private Stack<Integer> outStack;  // For dequeue

    public MyQueue() {
        inStack = new Stack<>();
        outStack = new Stack<>();
    }

    // Push to back: O(1)
    public void push(int x) {
        inStack.push(x);
    }

    // Pop from front: Amortized O(1) ⚡
    public int pop() {
        peek();  // Ensure outStack has elements
        return outStack.pop();
    }

    // Peek front: Amortized O(1)
    public int peek() {
        if (outStack.isEmpty()) {
            // Transfer all from inStack to outStack
            // This reverses the order!
            while (!inStack.isEmpty()) {
                outStack.push(inStack.pop());
            }
        }
        return outStack.peek();
    }

    public boolean empty() {
        return inStack.isEmpty() && outStack.isEmpty();
    }
}

// Example trace:
push(1), push(2), push(3)
inStack: [1, 2, 3]  outStack: []

pop()  // Transfer to outStack!
inStack: []  outStack: [3, 2, 1]  // Note: reversed!
Returns: 1  ✓ (FIFO maintained)

// Amortized O(1) proof:
// Each element is pushed once and popped once
// Total operations: 2n for n elements = O(1) amortized`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 3: Moving Average from Data Stream</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Sliding window with queue
class MovingAverage {
    private Queue<Integer> queue;
    private int size;
    private double sum;

    public MovingAverage(int size) {
        this.queue = new ArrayDeque<>();
        this.size = size;
        this.sum = 0.0;
    }

    public double next(int val) {
        queue.offer(val);
        sum += val;

        // If window full, remove oldest
        if (queue.size() > size) {
            sum -= queue.poll();
        }

        return sum / queue.size();
    }
}

// Example:
MovingAverage ma = new MovingAverage(3);
ma.next(1);  // [1] → avg = 1.0
ma.next(10); // [1, 10] → avg = 5.5
ma.next(3);  // [1, 10, 3] → avg = 4.67
ma.next(5);  // [10, 3, 5] → avg = 6.0 (1 removed)

// Time: O(1) per operation
// Space: O(size)
// Use case: Stock prices, sensor data smoothing`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 4: Design Hit Counter (Timestamp Queue)</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Count hits in last 300 seconds
class HitCounter {
    private Queue<Integer> queue;

    public HitCounter() {
        queue = new ArrayDeque<>();
    }

    // Record a hit at timestamp
    public void hit(int timestamp) {
        queue.offer(timestamp);
    }

    // Get hits in [timestamp - 300, timestamp]
    public int getHits(int timestamp) {
        // Remove timestamps older than 300 seconds
        while (!queue.isEmpty() &&
               timestamp - queue.peek() >= 300) {
            queue.poll();
        }
        return queue.size();
    }
}

// Example:
HitCounter counter = new HitCounter();
counter.hit(1);      // timestamp 1
counter.hit(2);      // timestamp 2
counter.hit(3);      // timestamp 3
counter.getHits(4);  // 3 (all within 300 seconds)
counter.hit(300);
counter.getHits(300); // 4
counter.getHits(301); // 3 (timestamp 1 is now > 300 seconds old)

// Time: hit() = O(1), getHits() = O(n) worst case
// Space: O(n) where n = number of hits
// Optimization: Use bucketing for O(1) getHits()`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 5: Task Scheduler (Priority + Cooling)</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Schedule tasks with cooling period
// Input: tasks = ['A','A','A','B','B','B'], n = 2
// Output: 8 (A -> B -> idle -> A -> B -> idle -> A -> B)

int leastInterval(char[] tasks, int n) {
    // Count frequency of each task
    int[] freq = new int[26];
    for (char task : tasks) {
        freq[task - 'A']++;
    }

    // Max heap to always process most frequent task
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
    for (int f : freq) {
        if (f > 0) maxHeap.offer(f);
    }

    int time = 0;
    Queue<int[]> cooldown = new LinkedList<>();  // [freq, availableTime]

    while (!maxHeap.isEmpty() || !cooldown.isEmpty()) {
        time++;

        if (!maxHeap.isEmpty()) {
            int freq = maxHeap.poll() - 1;
            if (freq > 0) {
                // Task needs cooling, add to cooldown queue
                cooldown.offer(new int[]{freq, time + n});
            }
        }

        // Check if any task finished cooling
        if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {
            maxHeap.offer(cooldown.poll()[0]);
        }
    }

    return time;
}

// Time: O(n) where n = number of tasks
// Space: O(1) - at most 26 task types
// Key: Use queue for cooling period tracking!`}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default QueueVisualizerEnhanced
