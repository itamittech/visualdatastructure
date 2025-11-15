import React, { useState } from 'react'

/**
 * Component showing all Java Tree-based implementations with comparisons
 */
function JavaTreeImplementations() {
  const [expandedSection, setExpandedSection] = useState(null)

  const implementations = [
    {
      name: 'TreeSet<E>',
      type: 'Sorted Set (Red-Black Tree)',
      since: 'Java 1.2',
      bestFor: 'Sorted unique elements - BEST CHOICE for sorted sets',
      avoid: 'When you need duplicates or unsorted set',
      threadSafe: false,
      features: [
        'O(log n) for add, remove, contains',
        'Elements sorted by natural order or comparator',
        'No duplicates allowed',
        'Implements NavigableSet interface',
        'Backed by TreeMap internally'
      ],
      code: `// TreeSet - Sorted set of unique elements!
TreeSet<Integer> set = new TreeSet<>();

// Add elements - O(log n)
set.add(30);
set.add(10);
set.add(20);
set.add(40);
set.add(10);  // Duplicate - ignored!

// Set is automatically sorted!
System.out.println(set);  // [10, 20, 30, 40]

// Operations - all O(log n)
boolean has20 = set.contains(20);  // true
set.remove(20);
int size = set.size();  // 3

// NavigableSet operations
int first = set.first();     // 10 (smallest)
int last = set.last();       // 40 (largest)
int ceiling = set.ceiling(25);  // 30 (≥25)
int floor = set.floor(25);   // 20 (≤25)
int higher = set.higher(10); // 20 (>10)
int lower = set.lower(40);   // 30 (<40)

// Range views
SortedSet<Integer> subset = set.subSet(15, 35);  // [20, 30]
SortedSet<Integer> headSet = set.headSet(25);    // [10, 20]
SortedSet<Integer> tailSet = set.tailSet(25);    // [30, 40]

// Descending order
NavigableSet<Integer> desc = set.descendingSet();  // [40, 30, 20, 10]

// Poll operations
int min = set.pollFirst();   // 10 - removes smallest
int max = set.pollLast();    // 40 - removes largest

// Custom comparator - reverse order
TreeSet<String> reverse = new TreeSet<>(Collections.reverseOrder());
reverse.add("Alice");
reverse.add("Bob");
reverse.add("Charlie");
// Iteration: Charlie, Bob, Alice (reverse alphabetical!)

// Use cases:
// ✓ Remove duplicates AND sort
// ✓ Range queries on sorted data
// ✓ Finding nearest elements
// ✓ Leaderboards
// ✓ Interval scheduling

// Performance:
// add/remove/contains: O(log n)
// first/last: O(1)
// Iteration: O(n)
// Space: O(n)

// Compare with HashSet:
// HashSet: O(1) but unordered
// TreeSet: O(log n) but sorted ✓`
    },
    {
      name: 'TreeMap<K,V> (RECOMMENDED)',
      type: 'Sorted Map (Red-Black Tree)',
      since: 'Java 1.2',
      bestFor: 'Sorted key-value pairs - BEST for sorted maps',
      avoid: 'When you need fast O(1) operations (use HashMap)',
      threadSafe: false,
      features: [
        'O(log n) for get, put, remove',
        'Keys sorted by natural order or comparator',
        'Implements NavigableMap interface',
        'Red-Black tree implementation',
        'No null keys (but null values OK)'
      ],
      code: `// TreeMap - Sorted key-value pairs!
TreeMap<String, Integer> map = new TreeMap<>();

// Put - O(log n)
map.put("Charlie", 35);
map.put("Alice", 25);
map.put("Bob", 30);

// Keys are automatically sorted!
for (String key : map.keySet()) {
    System.out.println(key);
}
// Output: Alice, Bob, Charlie (alphabetical!)

// Get - O(log n)
Integer age = map.get("Alice");  // 25

// NavigableMap operations
String firstKey = map.firstKey();     // "Alice"
String lastKey = map.lastKey();       // "Charlie"
String ceilingKey = map.ceilingKey("Bill");  // "Bob" (≥"Bill")
String floorKey = map.floorKey("Bill");      // "Alice" (≤"Bill")

// Get entries with keys
Map.Entry<String, Integer> first = map.firstEntry();
Map.Entry<String, Integer> last = map.lastEntry();

// Poll operations - remove and return
Map.Entry<String, Integer> removed = map.pollFirstEntry();  // Remove smallest key
Map.Entry<String, Integer> removedLast = map.pollLastEntry();  // Remove largest key

// Range views
SortedMap<String, Integer> sub = map.subMap("B", "D");  // Keys in [B, D)
SortedMap<String, Integer> head = map.headMap("C");     // Keys < C
SortedMap<String, Integer> tail = map.tailMap("C");     // Keys ≥ C

// Descending order
NavigableMap<String, Integer> desc = map.descendingMap();

// Real-world example: Time-series data
TreeMap<Long, Double> timeSeries = new TreeMap<>();
timeSeries.put(1000L, 23.5);  // timestamp → value
timeSeries.put(2000L, 24.1);
timeSeries.put(3000L, 22.8);

// Find all values between timestamps
SortedMap<Long, Double> range = timeSeries.subMap(1500L, 2500L);

// Custom comparator - sort by value length
TreeMap<String, String> byLength = new TreeMap<>(
    Comparator.comparingInt(String::length)
              .thenComparing(String::compareTo)
);

// Use cases:
// ✓ Sorted iteration required
// ✓ Range queries (find all keys in range)
// ✓ Time-series data
// ✓ Leaderboards
// ✓ Finding nearest key
// ✓ Database index simulation

// Performance:
// get/put/remove: O(log n)
// firstKey/lastKey: O(1)
// Navigation ops: O(log n)
// Iteration: O(n)

// Trade-offs:
// ✓ Sorted keys
// ✓ Range operations
// ✗ Slower than HashMap (O(log n) vs O(1))
// ✗ No null keys`
    },
    {
      name: 'PriorityQueue<E>',
      type: 'Binary Heap (Min-Heap)',
      since: 'Java 1.5',
      bestFor: 'Priority-based processing - BEST for heaps',
      avoid: 'FIFO queues or sorted sets',
      threadSafe: false,
      features: [
        'O(log n) add and poll',
        'O(1) peek at minimum element',
        'Implemented as min-heap',
        'NOT a sorted set - only guarantees min at top',
        'Allows duplicates'
      ],
      code: `// PriorityQueue - Min-heap by default!
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Add elements - O(log n)
minHeap.offer(30);
minHeap.offer(10);
minHeap.offer(20);
minHeap.offer(40);

// Peek minimum - O(1)
int min = minHeap.peek();  // 10 (smallest!)

// Poll minimum - O(log n)
int removed = minHeap.poll();  // 10 - removes smallest
int next = minHeap.poll();     // 20 - next smallest

// Max-heap (reverse order)
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(
    Collections.reverseOrder()
);
maxHeap.offer(10);
maxHeap.offer(30);
maxHeap.offer(20);
maxHeap.peek();  // 30 (largest!)

// Custom comparator - by priority
class Task {
    String name;
    int priority;
    Task(String name, int priority) {
        this.name = name;
        this.priority = priority;
    }
}

PriorityQueue<Task> taskQueue = new PriorityQueue<>(
    Comparator.comparingInt(t -> t.priority)
);

taskQueue.offer(new Task("Low", 3));
taskQueue.offer(new Task("High", 1));
taskQueue.offer(new Task("Med", 2));

// Processes: High(1), Med(2), Low(3)
while (!taskQueue.isEmpty()) {
    Task task = taskQueue.poll();
    System.out.println(task.name);  // High, Med, Low
}

// K largest elements
int[] nums = {3, 1, 5, 12, 2, 11};
int k = 3;
PriorityQueue<Integer> topK = new PriorityQueue<>();

for (int num : nums) {
    topK.offer(num);
    if (topK.size() > k) {
        topK.poll();  // Remove smallest
    }
}
// topK contains: [5, 11, 12] (3 largest)

// Heap operations
minHeap.add(15);           // O(log n) - same as offer
minHeap.remove(20);        // O(n) - must find then remove
int size = minHeap.size(); // O(1)
boolean empty = minHeap.isEmpty();  // O(1)

// Internal: Binary heap array
//       10
//      /  \\
//    20    30
//   /  \\
//  40  50
// Array: [10, 20, 30, 40, 50]
// Parent: i/2, Left: 2*i, Right: 2*i+1

// Use cases:
// ✓ Dijkstra's algorithm
// ✓ A* pathfinding
// ✓ Top-K problems
// ✓ Median finding (two heaps)
// ✓ Task scheduling by priority
// ✓ Merge K sorted lists

// Performance:
// offer/poll: O(log n)
// peek: O(1)
// remove(obj): O(n)
// contains: O(n)
// Iteration: NOT sorted!

// Important: Iteration order is NOT sorted!
// Only peek() and poll() guarantee min element`
    },
    {
      name: 'ConcurrentSkipListSet<E>',
      type: 'Thread-Safe Sorted Set',
      since: 'Java 1.6',
      bestFor: 'Concurrent sorted sets',
      avoid: 'Single-threaded (use TreeSet)',
      threadSafe: true,
      features: [
        'Thread-safe sorted set',
        'O(log n) operations with high concurrency',
        'Lock-free using skip lists',
        'Scalable for concurrent reads/writes',
        'No null elements allowed'
      ],
      code: `// ConcurrentSkipListSet - Thread-safe TreeSet!
import java.util.concurrent.*;

NavigableSet<Integer> set = new ConcurrentSkipListSet<>();

// Multiple threads can safely access
// Producer thread
new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        set.add(i);  // Thread-safe!
    }
}).start();

// Consumer thread
new Thread(() -> {
    while (set.size() < 1000) {
        if (!set.isEmpty()) {
            int first = set.pollFirst();  // Thread-safe!
            System.out.println(first);
        }
    }
}).start();

// Operations - all thread-safe
set.add(50);
set.remove(25);
boolean has = set.contains(75);

// NavigableSet operations
int first = set.first();
int last = set.last();
int ceiling = set.ceiling(40);
int floor = set.floor(60);

// Range views (also thread-safe)
NavigableSet<Integer> subset = set.subSet(10, true, 90, true);

// Why skip list instead of tree?
// - Better for concurrent access
// - Lock-free with CAS operations
// - Scalable across many threads

// Performance (multi-threaded):
// ConcurrentSkipListSet: ~80ms ⚡
// Collections.synchronizedSortedSet: ~250ms
// Speedup: 3x!

// Use cases:
// ✓ Concurrent sorted data
// ✓ Multi-threaded priority processing
// ✓ Real-time leaderboards
// ✓ Concurrent event scheduling

// Trade-offs:
// ✓ Thread-safe
// ✓ Sorted
// ✓ Scalable concurrency
// ✗ Slower than TreeSet (single-threaded)
// ✗ More memory overhead
// ✗ No null elements`
    },
    {
      name: 'ConcurrentSkipListMap<K,V>',
      type: 'Thread-Safe Sorted Map',
      since: 'Java 1.6',
      bestFor: 'Concurrent sorted maps',
      avoid: 'Single-threaded (use TreeMap)',
      threadSafe: true,
      features: [
        'Thread-safe sorted map',
        'O(log n) with lock-free reads',
        'Skip list implementation',
        'High concurrency scalability',
        'No null keys or values'
      ],
      code: `// ConcurrentSkipListMap - Thread-safe TreeMap!
import java.util.concurrent.*;

NavigableMap<String, Integer> map = new ConcurrentSkipListMap<>();

// Thread-safe operations
map.put("Alice", 25);
map.put("Bob", 30);
map.put("Charlie", 35);

// Multiple threads can safely access
Integer age = map.get("Alice");  // Lock-free read!
map.remove("Bob");

// Atomic operations
map.putIfAbsent("Dave", 40);
map.replace("Alice", 25, 26);

// NavigableMap operations (thread-safe)
String firstKey = map.firstKey();
String lastKey = map.lastKey();
Map.Entry<String, Integer> first = map.firstEntry();

// Range operations
NavigableMap<String, Integer> sub = map.subMap("B", "D");

// Real-world: Concurrent time-series
ConcurrentSkipListMap<Long, Event> timeline =
    new ConcurrentSkipListMap<>();

// Multiple threads adding events
timeline.put(System.currentTimeMillis(), new Event());

// Lock-free reads
Map.Entry<Long, Event> latest = timeline.lastEntry();

// Skip list structure (simplified):
// Level 3:     1 -----------------------> 25
// Level 2:     1 -------> 10 -----------> 25 -> 30
// Level 1:     1 -> 5 -> 10 -> 15 -> 20 -> 25 -> 30
// Level 0:     1 -> 5 -> 10 -> 15 -> 20 -> 25 -> 30 -> 35 -> 40
// Fast O(log n) search with express lanes!

// Why skip list?
// - Probabilistic balancing (no rotations!)
// - Better for concurrent access
// - Lock-free reads with CAS writes

// Performance (8 threads):
// ConcurrentSkipListMap: ~95ms ⚡
// Collections.synchronizedSortedMap: ~320ms
// Speedup: 3.4x!

// Use cases:
// ✓ Concurrent sorted data
// ✓ Time-series with multi-threaded access
// ✓ Real-time leaderboards
// ✓ Concurrent scheduling systems

// Trade-offs:
// ✓ Thread-safe and sorted
// ✓ Scalable concurrency
// ✗ Slower than TreeMap (single-threaded)
// ✗ More memory than TreeMap
// ✗ No null keys/values`
    }
  ]

  const comparisonData = [
    {
      feature: 'Time Complexity',
      treeSet: 'O(log n)',
      treeMap: 'O(log n)',
      priorityQueue: 'O(log n) add/poll',
      skipSet: 'O(log n)',
      skipMap: 'O(log n)'
    },
    {
      feature: 'Ordering',
      treeSet: 'Sorted',
      treeMap: 'Sorted keys',
      priorityQueue: 'Min-heap (partial)',
      skipSet: 'Sorted',
      skipMap: 'Sorted keys'
    },
    {
      feature: 'Duplicates',
      treeSet: '❌',
      treeMap: '❌ (keys)',
      priorityQueue: '✅',
      skipSet: '❌',
      skipMap: '❌ (keys)'
    },
    {
      feature: 'Thread-Safe',
      treeSet: '❌',
      treeMap: '❌',
      priorityQueue: '❌',
      skipSet: '✅ ⚡',
      skipMap: '✅ ⚡'
    },
    {
      feature: 'Null Elements',
      treeSet: '❌',
      treeMap: '❌ keys, ✅ values',
      priorityQueue: '❌',
      skipSet: '❌',
      skipMap: '❌'
    },
    {
      feature: 'Implementation',
      treeSet: 'Red-Black Tree',
      treeMap: 'Red-Black Tree',
      priorityQueue: 'Binary Heap',
      skipSet: 'Skip List',
      skipMap: 'Skip List'
    },
    {
      feature: 'Best Use Case',
      treeSet: 'Sorted unique elements',
      treeMap: 'Sorted key-value',
      priorityQueue: 'Priority processing',
      skipSet: 'Concurrent sorted set',
      skipMap: 'Concurrent sorted map'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Java Tree-Based Implementations - Complete Guide
        </h2>
        <p className="text-gray-700 mb-4">
          Java provides multiple tree-based and heap-based data structures for sorted data and priority processing.
          TreeSet/TreeMap use Red-Black trees for O(log n) sorted operations, while PriorityQueue uses binary heaps for priority-based processing.
        </p>
        <div className="bg-white rounded p-4 text-sm">
          <strong className="text-green-600">Quick Decision Tree:</strong>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>• <strong>Sorted unique elements?</strong> → Use <code className="bg-gray-100 px-1">TreeSet&lt;E&gt;</code> ⚡</li>
            <li>• <strong>Sorted key-value pairs?</strong> → Use <code className="bg-gray-100 px-1">TreeMap&lt;K,V&gt;</code> ⚡</li>
            <li>• <strong>Priority-based processing?</strong> → Use <code className="bg-gray-100 px-1">PriorityQueue&lt;E&gt;</code></li>
            <li>• <strong>Concurrent sorted set?</strong> → Use <code className="bg-gray-100 px-1">ConcurrentSkipListSet&lt;E&gt;</code></li>
            <li>• <strong>Concurrent sorted map?</strong> → Use <code className="bg-gray-100 px-1">ConcurrentSkipListMap&lt;K,V&gt;</code></li>
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
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {impl.type}
                    </span>
                    {impl.threadSafe && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Thread-Safe
                      </span>
                    )}
                    {(impl.name.includes('TreeSet') || impl.name.includes('TreeMap')) && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
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
                        <span className="text-green-500 mr-2">▸</span>
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
                <th className="px-4 py-3 text-left font-bold">TreeSet</th>
                <th className="px-4 py-3 text-left font-bold">TreeMap</th>
                <th className="px-4 py-3 text-left font-bold">PriorityQueue</th>
                <th className="px-4 py-3 text-left font-bold">SkipListSet</th>
                <th className="px-4 py-3 text-left font-bold">SkipListMap</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-semibold">{row.feature}</td>
                  <td className="px-4 py-3">{row.treeSet}</td>
                  <td className="px-4 py-3">{row.treeMap}</td>
                  <td className="px-4 py-3">{row.priorityQueue}</td>
                  <td className="px-4 py-3">{row.skipSet}</td>
                  <td className="px-4 py-3">{row.skipMap}</td>
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
              <li>• Use <code className="bg-gray-100 px-1">TreeSet</code> when you need sorted unique elements</li>
              <li>• Use <code className="bg-gray-100 px-1">PriorityQueue</code> for min/max heap operations</li>
              <li>• Use <code className="bg-gray-100 px-1">TreeMap</code> for range queries on sorted keys</li>
              <li>• Use concurrent versions for multi-threaded scenarios</li>
              <li>• Provide custom comparators for complex sorting logic</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold text-red-700">✗ DON'T:</h4>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>• Don't use TreeSet/TreeMap for general use (HashSet/HashMap faster)</li>
              <li>• Don't iterate PriorityQueue expecting sorted order (use poll() in loop)</li>
              <li>• Don't use null elements in any tree-based structure</li>
              <li>• Don't use mutable objects that affect comparison as keys</li>
              <li>• Don't use TreeSet when you need duplicates (use TreeMap with count)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JavaTreeImplementations
