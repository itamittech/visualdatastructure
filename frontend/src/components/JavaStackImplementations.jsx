import React, { useState } from 'react'

/**
 * Component showing all Java Stack implementations with comparisons
 */
function JavaStackImplementations() {
  const [expandedSection, setExpandedSection] = useState(null)

  const implementations = [
    {
      name: 'Stack<E> (Legacy)',
      type: 'Vector-based (synchronized)',
      since: 'Java 1.0',
      bestFor: 'Legacy code only',
      avoid: 'New code - use Deque instead',
      threadSafe: true,
      features: [
        'Extends Vector - synchronized methods',
        'LIFO operations: push, pop, peek',
        'Search method to find element position',
        'Slower due to unnecessary synchronization',
        'Not recommended for new code'
      ],
      code: `// Stack<E> - LEGACY! Don't use in new code
Stack<Integer> stack = new Stack<>();

// LIFO operations
stack.push(10);           // Add to top
stack.push(20);
stack.push(30);

int top = stack.peek();   // 30 - view top without removing
int removed = stack.pop(); // 30 - remove and return top

// Unique to Stack: search from top
int pos = stack.search(10);  // Returns 2 (position from top, 1-based!)
// Top=1, next=2, etc. Returns -1 if not found

// Check if empty
boolean empty = stack.isEmpty();

// Why NOT to use:
// 1. Synchronized (slower, unnecessary if single-threaded)
// 2. Extends Vector (inherits ALL Vector methods - breaks abstraction)
//    stack.add(3, 99);  // Can insert in middle! Violates stack!
// 3. Legacy class from Java 1.0

// Use ArrayDeque or LinkedList instead!`
    },
    {
      name: 'ArrayDeque<E> (Recommended)',
      type: 'Resizable Array (circular buffer)',
      since: 'Java 1.6',
      bestFor: 'General-purpose stack - BEST CHOICE',
      avoid: 'When you need thread-safety',
      threadSafe: false,
      features: [
        'Fastest stack implementation',
        'No synchronization overhead',
        'Implements Deque interface',
        'More memory efficient than LinkedList',
        'Cache-friendly (contiguous memory)'
      ],
      code: `// ArrayDeque - RECOMMENDED for stacks!
Deque<Integer> stack = new ArrayDeque<>();

// Stack operations (LIFO)
stack.push(10);           // Add to top - O(1) amortized
stack.push(20);
stack.push(30);

int top = stack.peek();   // 30 - view top - O(1)
int removed = stack.pop(); // 30 - remove top - O(1)

// Alternative method names (same behavior):
stack.addFirst(40);       // Same as push()
stack.removeFirst();      // Same as pop()
stack.peekFirst();        // Same as peek()

// Why ArrayDeque is BEST:
// 1. No synchronization → faster than Stack
// 2. More efficient than LinkedList:
//    - Better cache locality (contiguous memory)
//    - Less memory overhead (no node objects)
// 3. Resizes automatically (amortized O(1))
// 4. Can be used as Queue too! (pollLast, addLast)

// Performance:
// Push 1M items: ArrayDeque ~15ms, LinkedList ~45ms ⚡

// Initial capacity optimization:
Deque<Integer> optimized = new ArrayDeque<>(1000);
// Avoids resizing if you know approximate size`
    },
    {
      name: 'LinkedList<E>',
      type: 'Doubly-Linked List',
      since: 'Java 1.2',
      bestFor: 'When you need both stack and queue ops frequently',
      avoid: 'General stack use (ArrayDeque is faster)',
      threadSafe: false,
      features: [
        'Implements both List and Deque',
        'O(1) for push/pop (no resizing ever)',
        'More memory overhead (node objects)',
        'Worse cache performance than ArrayDeque',
        'Good when mixed access patterns'
      ],
      code: `// LinkedList as Stack
Deque<Integer> stack = new LinkedList<>();

// Stack operations
stack.push(10);           // Add to top - O(1) always
stack.push(20);
stack.push(30);

int top = stack.peek();   // 30 - O(1)
int removed = stack.pop(); // 30 - O(1)

// Advantages over ArrayDeque:
// 1. Guaranteed O(1) push (no resize ever)
// 2. Can use as List too: stack.get(index)
// 3. Good for mixed stack/queue/list operations

// Disadvantages vs ArrayDeque:
// 1. More memory: 24 bytes per element vs 4-8 bytes
// 2. Cache misses: nodes scattered in memory
// 3. Slower iteration: pointer chasing
// 4. More GC pressure: allocates node objects

// Memory comparison (1000 integers):
// ArrayDeque: ~4KB
// LinkedList: ~24KB (6x more!)

// Use when:
// - Need List operations AND stack operations
// - Exact O(1) guarantee matters (no amortization)
// - Working with very large elements (resize cost high)`
    },
    {
      name: 'Collections.synchronizedList()',
      type: 'Synchronized Wrapper',
      since: 'Java 1.2',
      bestFor: 'Thread-safe stack with external sync',
      avoid: 'High concurrency (locks entire list)',
      threadSafe: true,
      features: [
        'Wraps any List implementation',
        'All methods synchronized',
        'Simple but coarse-grained locking',
        'Manual sync needed for iteration',
        'Better than Stack, worse than concurrent alternatives'
      ],
      code: `// Synchronized Stack Wrapper
Deque<Integer> stack = new ArrayDeque<>();
Deque<Integer> syncStack =
    (Deque<Integer>) Collections.synchronizedList(
        new LinkedList<>(stack)
    );

// Thread-safe operations
syncStack.push(10);       // Synchronized
syncStack.pop();          // Synchronized
syncStack.peek();         // Synchronized

// BUT: Iteration requires manual synchronization!
synchronized(syncStack) {
    for (Integer num : syncStack) {
        System.out.println(num);
    }
}

// Drawbacks:
// 1. Locks entire list on EVERY operation
// 2. Readers block writers and vice versa
// 3. No concurrent operations possible
// 4. Performance degrades with thread count

// Benchmark (4 threads, 100K ops):
// ConcurrentLinkedDeque: ~25ms
// Collections.synchronized: ~180ms 🐌

// Use only when:
// - Low concurrency (2-3 threads)
// - Simple wrapper needed
// - Legacy code compatibility`
    },
    {
      name: 'ConcurrentLinkedDeque<E>',
      type: 'Lock-Free Concurrent Stack',
      since: 'Java 1.7',
      bestFor: 'High-concurrency stack operations',
      avoid: 'Single-threaded (overhead not needed)',
      threadSafe: true,
      features: [
        'Non-blocking algorithms (CAS)',
        'Highly scalable for multiple threads',
        'Lock-free push/pop operations',
        'Unlimited capacity (no blocking)',
        'Best for concurrent producer-consumer'
      ],
      code: `// ConcurrentLinkedDeque - Lock-free!
Deque<Integer> stack = new ConcurrentLinkedDeque<>();

// Thread-safe operations (no locks!)
stack.push(10);           // CAS-based - O(1)
stack.push(20);
Integer top = stack.peek(); // Lock-free read
Integer removed = stack.pop(); // CAS-based

// Multiple threads can operate concurrently!
// Thread 1                Thread 2
stack.push(30);           stack.push(40);
// Both succeed without blocking!

// Use in thread pool pattern:
ExecutorService executor = Executors.newFixedThreadPool(8);
Deque<Task> workStack = new ConcurrentLinkedDeque<>();

// Producer threads
for (int i = 0; i < 100; i++) {
    workStack.push(new Task(i));
}

// Worker threads
for (int i = 0; i < 8; i++) {
    executor.submit(() -> {
        while (!workStack.isEmpty()) {
            Task task = workStack.poll();  // pop() throws, poll() returns null
            if (task != null) {
                task.process();
            }
        }
    });
}

// Performance (8 threads, 1M operations):
// ConcurrentLinkedDeque: ~120ms ⚡
// Collections.synchronized: ~950ms 🐌
// Speedup: 8x!

// Trade-offs:
// ✓ Excellent for high concurrency
// ✓ Non-blocking (no thread contention)
// ✗ More memory than ArrayDeque (nodes + overhead)
// ✗ Slower than ArrayDeque for single thread`
    },
    {
      name: 'ArrayList<E> (as Stack)',
      type: 'Dynamic Array',
      since: 'Java 1.2',
      bestFor: 'When you need stack + index access',
      avoid: 'Pure stack operations (use ArrayDeque)',
      threadSafe: false,
      features: [
        'Not designed for stack but works',
        'Use add/remove for push/pop',
        'Bonus: random access by index',
        'Slower than ArrayDeque for stack ops',
        'Good for mixed stack/list operations'
      ],
      code: `// ArrayList as Stack (not recommended for pure stack)
List<Integer> stack = new ArrayList<>();

// Stack operations
stack.add(10);            // push - O(1) amortized
stack.add(20);
stack.add(30);

// peek - get last element
int top = stack.get(stack.size() - 1);  // O(1)

// pop - remove last element
int removed = stack.remove(stack.size() - 1);  // O(1)

// Why ArrayList might be used:
// 1. Need both stack ops AND index access
//    stack.get(5);  // Random access - O(1)
// 2. Need to iterate from bottom to top
//    for (int i = 0; i < stack.size(); i++)
// 3. Already using ArrayList in codebase

// Disadvantages vs ArrayDeque:
// 1. Less clear API (no push/pop methods)
// 2. Slightly slower (ArrayList optimized for lists)
// 3. Easy to accidentally use wrong end
//    stack.remove(0);  // WRONG! O(n) operation!

// Performance comparison (1M push/pop):
// ArrayDeque.push/pop:     ~15ms ⚡
// ArrayList.add/remove:    ~18ms
// ArrayList.remove(0):     ~4500ms 💀

// Use only when:
// - Need List interface AND stack behavior
// - Random access by index is required
// - Otherwise, prefer ArrayDeque!`
    }
  ]

  const comparisonData = [
    {
      feature: 'Push/Pop/Peek',
      stack: 'O(1) but sync',
      arrayDeque: 'O(1) amortized ⚡',
      linkedList: 'O(1) always',
      concurrent: 'O(1) lock-free',
      arrayList: 'O(1) amortized'
    },
    {
      feature: 'Thread Safety',
      stack: '✅ Synchronized',
      arrayDeque: '❌',
      linkedList: '❌',
      concurrent: '✅ Lock-free',
      arrayList: '❌'
    },
    {
      feature: 'Memory Efficiency',
      stack: 'Poor (Vector)',
      arrayDeque: 'Excellent ⚡',
      linkedList: 'Poor (nodes)',
      concurrent: 'Medium (nodes)',
      arrayList: 'Good'
    },
    {
      feature: 'Cache Performance',
      stack: 'Good (array)',
      arrayDeque: 'Excellent ⚡',
      linkedList: 'Poor (scattered)',
      concurrent: 'Poor (scattered)',
      arrayList: 'Excellent'
    },
    {
      feature: 'Recommended?',
      stack: '❌ Legacy',
      arrayDeque: '✅ YES! ⚡',
      linkedList: '⚠️ Sometimes',
      concurrent: '✅ For threading',
      arrayList: '⚠️ Rare cases'
    },
    {
      feature: 'Best Use Case',
      stack: 'Legacy code',
      arrayDeque: 'General purpose',
      linkedList: 'Mixed ops',
      concurrent: 'Multi-threaded',
      arrayList: 'Need indexing'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Java Stack Implementations - Complete Guide
        </h2>
        <p className="text-gray-700 mb-4">
          Java offers multiple ways to implement stacks. The classic <code className="bg-gray-100 px-1">Stack</code> class
          is legacy and should be avoided. Modern code should use <code className="bg-gray-100 px-1">Deque</code> implementations.
        </p>
        <div className="bg-white rounded p-4 text-sm">
          <strong className="text-purple-600">Quick Decision Tree:</strong>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>• <strong>General purpose stack?</strong> → Use <code className="bg-gray-100 px-1">ArrayDeque&lt;E&gt;</code> ⚡ BEST!</li>
            <li>• <strong>High concurrency needed?</strong> → Use <code className="bg-gray-100 px-1">ConcurrentLinkedDeque&lt;E&gt;</code></li>
            <li>• <strong>Need List + Stack operations?</strong> → Use <code className="bg-gray-100 px-1">LinkedList&lt;E&gt;</code></li>
            <li>• <strong>Simple thread-safety?</strong> → Use <code className="bg-gray-100 px-1">Collections.synchronizedList()</code></li>
            <li>• <strong>Legacy code only?</strong> → <code className="bg-gray-100 px-1">Stack&lt;E&gt;</code> (avoid in new code!)</li>
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
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
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
                        <span className="text-purple-500 mr-2">▸</span>
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
                <th className="px-4 py-3 text-left font-bold">Stack (Legacy)</th>
                <th className="px-4 py-3 text-left font-bold">ArrayDeque ⚡</th>
                <th className="px-4 py-3 text-left font-bold">LinkedList</th>
                <th className="px-4 py-3 text-left font-bold">Concurrent</th>
                <th className="px-4 py-3 text-left font-bold">ArrayList</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-semibold">{row.feature}</td>
                  <td className="px-4 py-3">{row.stack}</td>
                  <td className="px-4 py-3">{row.arrayDeque}</td>
                  <td className="px-4 py-3">{row.linkedList}</td>
                  <td className="px-4 py-3">{row.concurrent}</td>
                  <td className="px-4 py-3">{row.arrayList}</td>
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
              <li>• Use <code className="bg-gray-100 px-1">ArrayDeque</code> as your default stack implementation</li>
              <li>• Program to interface: <code className="bg-gray-100 px-1">Deque&lt;T&gt;</code> not <code className="bg-gray-100 px-1">ArrayDeque&lt;T&gt;</code></li>
              <li>• Use <code className="bg-gray-100 px-1">ConcurrentLinkedDeque</code> for multi-threaded scenarios</li>
              <li>• Set initial capacity if you know approximate size: <code className="bg-gray-100 px-1">new ArrayDeque&lt;&gt;(1000)</code></li>
              <li>• Use <code className="bg-gray-100 px-1">poll()</code> instead of <code className="bg-gray-100 px-1">pop()</code> if you want null instead of exception</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold text-red-700">✗ DON'T:</h4>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>• Don't use <code className="bg-gray-100 px-1">Stack&lt;E&gt;</code> class in new code (legacy!)</li>
              <li>• Don't use <code className="bg-gray-100 px-1">LinkedList</code> as default (ArrayDeque is faster)</li>
              <li>• Don't use <code className="bg-gray-100 px-1">ArrayList.remove(0)</code> for pop - it's O(n)!</li>
              <li>• Don't synchronize ArrayDeque manually - use ConcurrentLinkedDeque instead</li>
              <li>• Don't use <code className="bg-gray-100 px-1">Collections.synchronizedList</code> for high concurrency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Migration Guide */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border-2 border-yellow-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔄</span>
          Migrating from Legacy Stack
        </h3>
        <p className="text-gray-700 mb-4">
          If you have code using the old <code className="bg-gray-100 px-1">Stack</code> class, here's how to migrate:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-red-700 mb-2">❌ Old Way (Legacy)</h4>
            <pre className="bg-gray-800 text-red-400 p-3 rounded text-xs overflow-x-auto">
{`Stack<Integer> stack = new Stack<>();

stack.push(10);
stack.push(20);
int top = stack.peek();
int value = stack.pop();
boolean empty = stack.isEmpty();
int pos = stack.search(10);

// Problem: Inherits Vector methods!
stack.add(2, 99);  // Violates stack!
stack.get(0);      // Access anywhere!`}
            </pre>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-green-700 mb-2">✅ New Way (Modern)</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`Deque<Integer> stack = new ArrayDeque<>();

stack.push(10);
stack.push(20);
int top = stack.peek();
int value = stack.pop();
boolean empty = stack.isEmpty();
// search() not available - use contains()
boolean has = stack.contains(10);

// Clean API - only stack operations!
// No random access!`}
            </pre>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-4">
          <h4 className="font-bold text-gray-800 mb-2">Method Mapping:</h4>
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Stack (Old)</th>
                <th className="text-left py-2">ArrayDeque (New)</th>
                <th className="text-left py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-1">push(e)</code></td>
                <td className="py-2"><code className="bg-gray-100 px-1">push(e)</code></td>
                <td className="py-2">Same method name ✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-1">pop()</code></td>
                <td className="py-2"><code className="bg-gray-100 px-1">pop()</code></td>
                <td className="py-2">Same method name ✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-1">peek()</code></td>
                <td className="py-2"><code className="bg-gray-100 px-1">peek()</code></td>
                <td className="py-2">Same method name ✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-1">empty()</code></td>
                <td className="py-2"><code className="bg-gray-100 px-1">isEmpty()</code></td>
                <td className="py-2">Different name!</td>
              </tr>
              <tr className="border-b">
                <td className="py-2"><code className="bg-gray-100 px-1">search(e)</code></td>
                <td className="py-2"><code className="bg-gray-100 px-1">contains(e)</code></td>
                <td className="py-2">Returns boolean, not position</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default JavaStackImplementations
