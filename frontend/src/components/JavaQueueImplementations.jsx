import React, { useState } from 'react'

/**
 * Component showing all Java Queue implementations with comparisons
 */
function JavaQueueImplementations() {
  const [expandedSection, setExpandedSection] = useState(null)

  const implementations = [
    {
      name: 'LinkedList<E> (Simple)',
      type: 'Doubly-Linked List',
      since: 'Java 1.2',
      bestFor: 'Simple queue, works reliably',
      avoid: 'High-performance scenarios (use ArrayDeque)',
      threadSafe: false,
      features: [
        'Implements Queue and Deque interfaces',
        'O(1) enqueue and dequeue operations',
        'No capacity restrictions',
        'More memory overhead than array-based',
        'Slower than ArrayDeque due to cache misses'
      ],
      code: `// LinkedList - Simple queue implementation
Queue<Integer> queue = new LinkedList<>();

// Enqueue (add to rear)
queue.offer(10);          // Preferred - returns false if fails
queue.add(20);            // Alternative - throws exception if fails
queue.offer(30);          // [10, 20, 30]

// Peek (view front without removing)
int front = queue.peek(); // 10 - returns null if empty
// OR:
int front2 = queue.element(); // 10 - throws exception if empty

// Dequeue (remove from front)
int removed = queue.poll(); // 10 - returns null if empty
// OR:
int removed2 = queue.remove(); // 20 - throws exception if empty
// Queue now: [30]

// Check if empty
boolean empty = queue.isEmpty();  // false

// Get size
int size = queue.size();  // 1

// Why LinkedList works:
// ✓ Guaranteed O(1) enqueue/dequeue (no resizing)
// ✓ Simple implementation
// ✓ Familiar for beginners
//
// But slower than ArrayDeque:
// ✗ Node allocation overhead
// ✗ Poor cache locality (scattered memory)
// ✗ 24 bytes per element vs 4-8 for array

// Performance (1M operations):
// LinkedList: ~45ms
// ArrayDeque: ~15ms (3x faster!) ⚡`
    },
    {
      name: 'ArrayDeque<E> (RECOMMENDED)',
      type: 'Resizable Circular Array',
      since: 'Java 1.6',
      bestFor: 'General-purpose queue - BEST CHOICE',
      avoid: 'When you need thread-safety',
      threadSafe: false,
      features: [
        'Fastest queue implementation',
        'Circular buffer with automatic resizing',
        'Cache-friendly (contiguous memory)',
        'More memory efficient than LinkedList',
        'Can be used as both Queue and Deque'
      ],
      code: `// ArrayDeque - RECOMMENDED for queues!
Queue<Integer> queue = new ArrayDeque<>();

// Enqueue (add to rear) - O(1) amortized
queue.offer(10);
queue.offer(20);
queue.offer(30);  // [10, 20, 30]

// Peek (view front) - O(1)
int front = queue.peek();  // 10

// Dequeue (remove from front) - O(1)
int removed = queue.poll(); // 10
// Queue now: [20, 30]

// Why ArrayDeque is BEST:
// ✓ Fastest implementation (cache-friendly!)
// ✓ Circular buffer - efficient use of space
// ✓ Automatic resizing (amortized O(1))
// ✓ Less memory than LinkedList
// ✓ Can be used as Deque too (add/remove both ends)

// Internal: Circular buffer
// [20, 30, _, _, _]  (front=0, rear=2)
// Enqueue 40:
// [20, 30, 40, _, _]  (front=0, rear=3)
// Dequeue:
// [_, 30, 40, _, _]   (front=1, rear=3)
// When rear reaches end, it wraps around!

// Performance comparison (1M operations):
// ArrayDeque: ~15ms ⚡ FASTEST!
// LinkedList: ~45ms (3x slower)
// PriorityQueue: ~65ms (heap operations)

// Initial capacity optimization:
Queue<Integer> optimized = new ArrayDeque<>(1000);
// Avoids resizing if you know size

// As Deque (double-ended queue):
Deque<Integer> deque = new ArrayDeque<>();
deque.addFirst(10);   // Add to front
deque.addLast(20);    // Add to rear
deque.removeFirst();  // Remove from front
deque.removeLast();   // Remove from rear`
    },
    {
      name: 'PriorityQueue<E>',
      type: 'Binary Heap',
      since: 'Java 1.5',
      bestFor: 'Priority-based processing',
      avoid: 'Regular FIFO queues (use ArrayDeque)',
      threadSafe: false,
      features: [
        'Elements ordered by natural ordering or Comparator',
        'NOT FIFO - smallest element has priority',
        'Implemented as min-heap',
        'O(log n) enqueue, O(log n) dequeue',
        'O(1) peek at minimum element'
      ],
      code: `// PriorityQueue - Heap-based, NOT FIFO!
Queue<Integer> pq = new PriorityQueue<>();

// Enqueue - O(log n) (maintains heap property)
pq.offer(30);
pq.offer(10);
pq.offer(20);
// NOT FIFO! Elements ordered by value

// Peek - O(1) - always returns SMALLEST
int min = pq.peek();  // 10 (not 30!)

// Dequeue - O(log n) - removes SMALLEST
int removed = pq.poll();  // 10 (smallest!)
int removed2 = pq.poll(); // 20 (next smallest)
int removed3 = pq.poll(); // 30 (largest)

// Custom comparator - max heap
Queue<Integer> maxHeap = new PriorityQueue<>(
    (a, b) -> b - a  // Reverse order
);
maxHeap.offer(10);
maxHeap.offer(30);
maxHeap.offer(20);
maxHeap.poll();  // 30 (largest!)

// Custom objects
Queue<Task> taskQueue = new PriorityQueue<>(
    Comparator.comparingInt(Task::getPriority)
);
taskQueue.offer(new Task("Low", 3));
taskQueue.offer(new Task("High", 1));
taskQueue.offer(new Task("Med", 2));
// Processes: High(1), Med(2), Low(3)

// When to use:
// ✓ Need to process by priority, not order
// ✓ Find min/max efficiently (O(1) peek)
// ✓ Top-K problems
// ✓ Dijkstra's algorithm
// ✓ Job scheduling by priority

// When NOT to use:
// ✗ Need FIFO order (use ArrayDeque!)
// ✗ Need O(1) enqueue (heap is O(log n))
// ✗ Random access needed

// Time complexity:
// offer():  O(log n) - bubble up
// poll():   O(log n) - bubble down
// peek():   O(1) - just read root
// remove(obj): O(n) - must find then remove

// Internal: Min-heap array representation
//       10
//      /  \\
//    20    30
//   /  \\
//  40  50
// Array: [10, 20, 30, 40, 50]`
    },
    {
      name: 'ArrayBlockingQueue<E>',
      type: 'Bounded Array (Lock-based)',
      since: 'Java 1.5',
      bestFor: 'Producer-consumer with back-pressure',
      avoid: 'Unbounded queues or lock-free requirements',
      threadSafe: true,
      features: [
        'Fixed capacity - blocks when full/empty',
        'Thread-safe with ReentrantLock',
        'Blocking operations for producer-consumer',
        'Fair or unfair locking policy',
        'Prevents unbounded growth'
      ],
      code: `// ArrayBlockingQueue - Bounded, blocking, thread-safe
import java.util.concurrent.*;

// Fixed capacity of 10
BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(10);

// Producer thread
new Thread(() -> {
    try {
        for (int i = 0; i < 100; i++) {
            queue.put(i);  // Blocks if queue is FULL!
            System.out.println("Produced: " + i);
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();

// Consumer thread
new Thread(() -> {
    try {
        while (true) {
            int item = queue.take();  // Blocks if queue is EMPTY!
            System.out.println("Consumed: " + item);
            Thread.sleep(100);  // Simulate processing
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();

// Non-blocking alternatives:
queue.offer(99);          // Returns false if full (doesn't block)
queue.offer(99, 1, TimeUnit.SECONDS);  // Waits up to 1 second
Integer item = queue.poll();           // Returns null if empty
Integer item2 = queue.poll(1, TimeUnit.SECONDS); // Waits up to 1 second

// Fair vs unfair:
BlockingQueue<Integer> fairQueue =
    new ArrayBlockingQueue<>(10, true);  // Fair - FIFO for threads
// Fair: Waiting threads served in order (slower)
// Unfair: Better throughput, but can starve threads

// When to use:
// ✓ Producer-consumer pattern
// ✓ Need back-pressure (limit queue size)
// ✓ Thread coordination with blocking
// ✓ Rate limiting
// ✓ Thread pool work queues

// Benchmark (4 threads, bounded queue):
// ArrayBlockingQueue: ~85ms
// LinkedBlockingQueue: ~95ms
// SynchronousQueue: ~120ms (no capacity!)

// Common pattern: Thread pool
ExecutorService executor = new ThreadPoolExecutor(
    4,        // Core threads
    8,        // Max threads
    60L,      // Keep-alive time
    TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(100)  // Work queue!
);`
    },
    {
      name: 'LinkedBlockingQueue<E>',
      type: 'Unbounded/Bounded Linked List',
      since: 'Java 1.5',
      bestFor: 'High-throughput producer-consumer',
      avoid: 'Memory-constrained environments',
      threadSafe: true,
      features: [
        'Optionally bounded (default: Integer.MAX_VALUE)',
        'Thread-safe with two locks (better concurrency)',
        'Separate locks for head and tail',
        'Higher throughput than ArrayBlockingQueue',
        'Can grow unbounded (risk: OutOfMemoryError)'
      ],
      code: `// LinkedBlockingQueue - Optionally bounded, thread-safe
import java.util.concurrent.*;

// Unbounded (careful - can cause OOM!)
BlockingQueue<Integer> unbounded = new LinkedBlockingQueue<>();

// Bounded (safer)
BlockingQueue<Integer> bounded = new LinkedBlockingQueue<>(100);

// Producer thread
new Thread(() -> {
    try {
        for (int i = 0; i < 1000; i++) {
            bounded.put(i);  // Blocks if full (for bounded)
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();

// Consumer thread
new Thread(() -> {
    try {
        while (true) {
            int item = bounded.take();  // Blocks if empty
            // Process item...
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();

// Why better throughput than ArrayBlockingQueue?
// TWO LOCKS instead of one!
// - putLock: For enqueue operations
// - takeLock: For dequeue operations
// → Producers and consumers don't block each other!

// ArrayBlockingQueue: ONE lock
//   Producer → LOCK → [queue] ← LOCK ← Consumer
//   They block each other! ❌

// LinkedBlockingQueue: TWO locks
//   Producer → putLock → [queue] ← takeLock ← Consumer
//   Can run concurrently! ✅

// Benchmark (4 producers, 4 consumers):
// LinkedBlockingQueue: ~75ms ⚡ (2 locks)
// ArrayBlockingQueue: ~95ms (1 lock)

// Trade-offs:
// ✓ Higher throughput (separate locks)
// ✓ Works as unbounded queue
// ✗ More memory per element (nodes)
// ✗ More GC pressure
// ✗ Unbounded mode can cause OOM!

// Best practice: Always set capacity!
BlockingQueue<Task> queue =
    new LinkedBlockingQueue<>(1000);  // Bounded!

// Common in frameworks:
// - Tomcat connector queues
// - Kafka consumer buffers
// - Message queue implementations`
    },
    {
      name: 'ConcurrentLinkedQueue<E>',
      type: 'Unbounded Lock-Free Queue',
      since: 'Java 1.5',
      bestFor: 'High-concurrency, non-blocking',
      avoid: 'Need blocking behavior or bounded capacity',
      threadSafe: true,
      features: [
        'Lock-free using CAS (Compare-And-Swap)',
        'Unbounded capacity',
        'Non-blocking operations',
        'Highest concurrency, lowest contention',
        'Weakly consistent iterators'
      ],
      code: `// ConcurrentLinkedQueue - Lock-free, unbounded
import java.util.concurrent.*;

Queue<Integer> queue = new ConcurrentLinkedQueue<>();

// Multiple threads can operate concurrently!
// Producer thread
new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        queue.offer(i);  // Lock-free enqueue!
        // Never blocks - always succeeds
    }
}).start();

// Consumer thread
new Thread(() -> {
    while (true) {
        Integer item = queue.poll();  // Lock-free dequeue!
        if (item != null) {
            // Process item...
        }
    }
}).start();

// How it works: CAS (Compare-And-Swap)
// Pseudo-code for enqueue:
// do {
//     Node<E> oldTail = tail.get();
//     Node<E> newNode = new Node<>(item);
// } while (!tail.compareAndSet(oldTail, newNode));
// → Retry if another thread modified tail

// No locks = No thread contention!
// ArrayBlockingQueue:  [Producer blocks] → LOCK → Queue
// ConcurrentLinkedQueue: Producer1, Producer2, ... (all concurrent!)

// Operations:
queue.offer(10);     // Add - always succeeds (unbounded)
Integer item = queue.poll();  // Remove - returns null if empty
Integer front = queue.peek(); // View front - returns null if empty
int size = queue.size();      // O(n)! Must traverse list
boolean empty = queue.isEmpty(); // O(1)

// When to use:
// ✓ High concurrency (many threads)
// ✓ Non-blocking requirement
// ✓ Don't need back-pressure
// ✓ Unbounded queue acceptable
// ✓ Performance critical

// When NOT to use:
// ✗ Need bounded capacity
// ✗ Need blocking (use BlockingQueue)
// ✗ Need precise size() often (it's O(n)!)
// ✗ Memory constrained (unbounded)

// Benchmark (8 threads, 1M operations):
// ConcurrentLinkedQueue: ~95ms ⚡ FASTEST!
// LinkedBlockingQueue: ~180ms (lock contention)
// ArrayBlockingQueue: ~220ms (more contention)

// Real-world uses:
// - Message passing between threads
// - Event queues in GUI frameworks
// - Task queues for thread pools
// - Lock-free data structure research

// Weakly consistent iterator:
for (Integer item : queue) {
    // May not see concurrent modifications!
    // But won't throw ConcurrentModificationException
}`
    }
  ]

  const comparisonData = [
    {
      feature: 'Enqueue/Dequeue',
      linkedList: 'O(1)',
      arrayDeque: 'O(1) amortized ⚡',
      priorityQueue: 'O(log n)',
      arrayBlocking: 'O(1) blocking',
      linkedBlocking: 'O(1) blocking',
      concurrent: 'O(1) lock-free'
    },
    {
      feature: 'Thread Safety',
      linkedList: '❌',
      arrayDeque: '❌',
      priorityQueue: '❌',
      arrayBlocking: '✅ Lock-based',
      linkedBlocking: '✅ Lock-based',
      concurrent: '✅ Lock-free'
    },
    {
      feature: 'Bounded',
      linkedList: 'No',
      arrayDeque: 'No',
      priorityQueue: 'No',
      arrayBlocking: 'Yes (required)',
      linkedBlocking: 'Optional',
      concurrent: 'No (unbounded)'
    },
    {
      feature: 'Blocking Ops',
      linkedList: '❌',
      arrayDeque: '❌',
      priorityQueue: '❌',
      arrayBlocking: '✅ put/take',
      linkedBlocking: '✅ put/take',
      concurrent: '❌'
    },
    {
      feature: 'Memory Efficiency',
      linkedList: 'Poor (nodes)',
      arrayDeque: 'Excellent ⚡',
      priorityQueue: 'Good (array)',
      arrayBlocking: 'Good (array)',
      linkedBlocking: 'Poor (nodes)',
      concurrent: 'Poor (nodes)'
    },
    {
      feature: 'Ordering',
      linkedList: 'FIFO',
      arrayDeque: 'FIFO',
      priorityQueue: 'Priority (heap)',
      arrayBlocking: 'FIFO',
      linkedBlocking: 'FIFO',
      concurrent: 'FIFO'
    },
    {
      feature: 'Best Use Case',
      linkedList: 'Simple queues',
      arrayDeque: 'General purpose ⚡',
      priorityQueue: 'Priority processing',
      arrayBlocking: 'Bounded producer-consumer',
      linkedBlocking: 'High-throughput',
      concurrent: 'Lock-free concurrency'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Java Queue Implementations - Complete Guide
        </h2>
        <p className="text-gray-700 mb-4">
          Java provides multiple queue implementations for different use cases. From simple FIFO queues to
          priority queues, blocking queues for concurrency, and lock-free implementations for high performance.
        </p>
        <div className="bg-white rounded p-4 text-sm">
          <strong className="text-teal-600">Quick Decision Tree:</strong>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>• <strong>General purpose queue?</strong> → Use <code className="bg-gray-100 px-1">ArrayDeque&lt;E&gt;</code> ⚡ BEST!</li>
            <li>• <strong>Need priority ordering?</strong> → Use <code className="bg-gray-100 px-1">PriorityQueue&lt;E&gt;</code></li>
            <li>• <strong>Bounded producer-consumer?</strong> → Use <code className="bg-gray-100 px-1">ArrayBlockingQueue&lt;E&gt;</code></li>
            <li>• <strong>High-throughput blocking?</strong> → Use <code className="bg-gray-100 px-1">LinkedBlockingQueue&lt;E&gt;</code></li>
            <li>• <strong>Lock-free concurrency?</strong> → Use <code className="bg-gray-100 px-1">ConcurrentLinkedQueue&lt;E&gt;</code></li>
            <li>• <strong>Simple learning/prototyping?</strong> → Use <code className="bg-gray-100 px-1">LinkedList&lt;E&gt;</code></li>
          </ul>
        </div>
      </div>

      {/* Detailed Implementations */}
      <div className="space-y-4">
        {implementations.map((impl, index) => (
          <div key={impl.name} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === index ? null : index)}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{impl.name}</h3>
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {impl.type}
                    </span>
                    {impl.threadSafe && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Thread-Safe
                      </span>
                    )}
                    {impl.name.includes('ArrayDeque') && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        RECOMMENDED ⚡
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Since:</strong> {impl.since}</div>
                    <div><strong>Best for:</strong> {impl.bestFor}</div>
                    <div><strong>Avoid when:</strong> {impl.avoid}</div>
                  </div>
                </div>
                <div className="text-2xl text-gray-400">
                  {expandedSection === index ? '−' : '+'}
                </div>
              </div>
            </button>

            {expandedSection === index && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {impl.features.map((feature, i) => (
                      <li key={i} className="text-gray-700 flex items-start">
                        <span className="text-teal-500 mr-2">▸</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Code Examples:</h4>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{impl.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Performance Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left font-bold">Feature</th>
                <th className="px-4 py-3 text-left font-bold">LinkedList</th>
                <th className="px-4 py-3 text-left font-bold">ArrayDeque ⚡</th>
                <th className="px-4 py-3 text-left font-bold">PriorityQueue</th>
                <th className="px-4 py-3 text-left font-bold">ArrayBlocking</th>
                <th className="px-4 py-3 text-left font-bold">LinkedBlocking</th>
                <th className="px-4 py-3 text-left font-bold">Concurrent</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-semibold">{row.feature}</td>
                  <td className="px-4 py-3">{row.linkedList}</td>
                  <td className="px-4 py-3">{row.arrayDeque}</td>
                  <td className="px-4 py-3">{row.priorityQueue}</td>
                  <td className="px-4 py-3">{row.arrayBlocking}</td>
                  <td className="px-4 py-3">{row.linkedBlocking}</td>
                  <td className="px-4 py-3">{row.concurrent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Best Practices</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold text-green-700">✓ DO:</h4>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>• Use <code className="bg-gray-100 px-1">ArrayDeque</code> for general-purpose FIFO queues</li>
              <li>• Use <code className="bg-gray-100 px-1">PriorityQueue</code> when processing by priority</li>
              <li>• Use <code className="bg-gray-100 px-1">BlockingQueue</code> for producer-consumer patterns</li>
              <li>• Use <code className="bg-gray-100 px-1">offer()</code> and <code className="bg-gray-100 px-1">poll()</code> (return null) instead of <code className="bg-gray-100 px-1">add()</code> and <code className="bg-gray-100 px-1">remove()</code> (throw exceptions)</li>
              <li>• Set capacity for blocking queues to prevent unbounded growth</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold text-red-700">✗ DON'T:</h4>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>• Don't use <code className="bg-gray-100 px-1">LinkedList</code> as default (ArrayDeque is faster)</li>
              <li>• Don't use unbounded queues in production (risk of OOM)</li>
              <li>• Don't call <code className="bg-gray-100 px-1">size()</code> frequently on ConcurrentLinkedQueue (it's O(n)!)</li>
              <li>• Don't use PriorityQueue for FIFO - it's for priority ordering only</li>
              <li>• Don't share non-thread-safe queues between threads without synchronization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JavaQueueImplementations
