import React, { useState } from 'react'

/**
 * Component showing all Java List implementations with comparisons
 */
function JavaListImplementations() {
  const [expandedSection, setExpandedSection] = useState(null)

  const implementations = [
    {
      name: 'ArrayList',
      type: 'Resizable Array',
      since: 'Java 1.2',
      bestFor: 'Random access, iterations',
      avoid: 'Frequent insertions/deletions in middle',
      threadSafe: false,
      features: [
        'Dynamic resizing (1.5x capacity)',
        'Fast random access O(1)',
        'Slow insertions/deletions O(n)',
        'Best for read-heavy operations'
      ],
      code: `// ArrayList - Most commonly used!
ArrayList<String> list = new ArrayList<>();
list.add("Apple");           // O(1) amortized
list.get(0);                 // O(1) - Fast!
list.add(0, "Banana");       // O(n) - Slow, shifts elements
list.remove(1);              // O(n) - Slow, shifts elements

// Initial capacity to avoid resizing
ArrayList<String> optimized = new ArrayList<>(1000);

// Trim to size after bulk operations
list.trimToSize();  // Reduce capacity to current size`
    },
    {
      name: 'LinkedList',
      type: 'Doubly-Linked List',
      since: 'Java 1.2',
      bestFor: 'Frequent insertions at beginning/end, Queue/Deque operations',
      avoid: 'Random access by index',
      threadSafe: false,
      features: [
        'Implements both List and Deque',
        'Fast insertions at head/tail O(1)',
        'Slow random access O(n)',
        'Higher memory overhead (node pointers)'
      ],
      code: `// LinkedList - Great for queue operations!
LinkedList<String> list = new LinkedList<>();

// List operations
list.add("Apple");
list.addFirst("Banana");     // O(1) - Fast!
list.addLast("Cherry");      // O(1) - Fast!
list.get(1);                 // O(n) - Slow!

// Deque operations (Double-ended queue)
list.offerFirst("First");    // Add at beginning
list.offerLast("Last");      // Add at end
list.pollFirst();            // Remove from beginning
list.pollLast();             // Remove from end
list.peekFirst();            // View first without removing
list.peekLast();             // View last without removing

// Use as Stack
list.push("Item");           // Push to stack
list.pop();                  // Pop from stack`
    },
    {
      name: 'Vector',
      type: 'Synchronized Resizable Array',
      since: 'Java 1.0 (Legacy)',
      bestFor: 'Legacy code only',
      avoid: 'New code - use ArrayList or Collections.synchronizedList',
      threadSafe: true,
      features: [
        'Legacy class from Java 1.0',
        'Synchronized (thread-safe but slow)',
        'Doubles capacity when full (vs 1.5x for ArrayList)',
        'Use ArrayList instead for better performance'
      ],
      code: `// Vector - Legacy, avoid in new code!
Vector<String> vector = new Vector<>();
vector.add("Item");

// All methods are synchronized (slower)
// For thread-safety, prefer:
List<String> syncList = Collections.synchronizedList(new ArrayList<>());

// Or use concurrent collections:
CopyOnWriteArrayList<String> concurrent = new CopyOnWriteArrayList<>();`
    },
    {
      name: 'CopyOnWriteArrayList',
      type: 'Thread-Safe Array',
      since: 'Java 1.5',
      bestFor: 'Read-heavy, thread-safe scenarios',
      avoid: 'Write-heavy operations',
      threadSafe: true,
      features: [
        'Thread-safe without explicit synchronization',
        'Creates copy on every modification',
        'Excellent for read-heavy concurrent access',
        'Very expensive for writes'
      ],
      code: `// CopyOnWriteArrayList - For concurrent reads!
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();

// Safe for multiple threads
list.add("Apple");           // Creates new copy - expensive!

// Iterators never throw ConcurrentModificationException
for (String item : list) {
    // Another thread can modify list safely
    // Iterator sees snapshot from creation time
}

// Perfect use case: Listener lists
CopyOnWriteArrayList<EventListener> listeners = new CopyOnWriteArrayList<>();
// Adding listeners is rare, notifying is frequent`
    },
    {
      name: 'Arrays.asList()',
      type: 'Fixed-Size List',
      since: 'Java 1.2',
      bestFor: 'Creating fixed-size lists from arrays',
      avoid: 'When you need to add/remove elements',
      threadSafe: false,
      features: [
        'Fixed-size list backed by array',
        'Cannot add or remove elements',
        'Can modify existing elements',
        'Backed by original array (changes reflect)'
      ],
      code: `// Arrays.asList() - Fixed size!
List<String> list = Arrays.asList("A", "B", "C");

list.set(0, "X");            // OK - Modify existing
// list.add("D");            // UnsupportedOperationException!
// list.remove(0);           // UnsupportedOperationException!

// Changes reflect in original array
String[] array = {"A", "B", "C"};
List<String> listView = Arrays.asList(array);
listView.set(0, "X");
// array[0] is now "X"!

// For mutable list, wrap it:
List<String> mutable = new ArrayList<>(Arrays.asList("A", "B", "C"));
mutable.add("D");            // OK now!`
    },
    {
      name: 'List.of()',
      type: 'Immutable List',
      since: 'Java 9',
      bestFor: 'Creating immutable lists, constants',
      avoid: 'When you need to modify',
      threadSafe: true,
      features: [
        'Completely immutable',
        'No null elements allowed',
        'More memory efficient than Arrays.asList',
        'Thread-safe by design'
      ],
      code: `// List.of() - Immutable! (Java 9+)
List<String> list = List.of("A", "B", "C");

// list.add("D");            // UnsupportedOperationException!
// list.set(0, "X");         // UnsupportedOperationException!
// list.remove(0);           // UnsupportedOperationException!

// No null allowed
// List<String> bad = List.of("A", null);  // NullPointerException!

// Perfect for constants
public static final List<String> DAYS = List.of(
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
);

// Can also use var (Java 10+)
var immutableList = List.of(1, 2, 3, 4, 5);`
    },
    {
      name: 'List.copyOf()',
      type: 'Immutable Copy',
      since: 'Java 10',
      bestFor: 'Creating immutable snapshots',
      avoid: 'When source is already immutable (returns same instance)',
      threadSafe: true,
      features: [
        'Creates immutable copy of collection',
        'If source is already immutable, returns same instance',
        'Defensive copying made easy',
        'Thread-safe'
      ],
      code: `// List.copyOf() - Immutable snapshot! (Java 10+)
List<String> original = new ArrayList<>();
original.add("A");
original.add("B");

List<String> immutableCopy = List.copyOf(original);
original.add("C");           // Original changes
// immutableCopy still ["A", "B"]

// Great for defensive copying in APIs
public class User {
    private final List<String> roles;

    public User(List<String> roles) {
        this.roles = List.copyOf(roles);  // Defensive copy
    }

    public List<String> getRoles() {
        return roles;  // Already immutable, safe to return
    }
}`
    }
  ]

  const comparisonData = [
    {
      feature: 'Random Access (get)',
      arrayList: 'O(1) ⚡',
      linkedList: 'O(n) 🐌',
      vector: 'O(1) ⚡',
      copyOnWrite: 'O(1) ⚡'
    },
    {
      feature: 'Insert at Beginning',
      arrayList: 'O(n) - Shift all',
      linkedList: 'O(1) ⚡',
      vector: 'O(n) - Shift all',
      copyOnWrite: 'O(n) - Copy all'
    },
    {
      feature: 'Insert at End',
      arrayList: 'O(1) amortized',
      linkedList: 'O(1) ⚡',
      vector: 'O(1) amortized',
      copyOnWrite: 'O(n) - Copy all'
    },
    {
      feature: 'Remove',
      arrayList: 'O(n)',
      linkedList: 'O(1) if at head/tail',
      vector: 'O(n)',
      copyOnWrite: 'O(n) - Copy all'
    },
    {
      feature: 'Thread Safety',
      arrayList: '❌ Not thread-safe',
      linkedList: '❌ Not thread-safe',
      vector: '✅ Synchronized',
      copyOnWrite: '✅ Lock-free'
    },
    {
      feature: 'Memory Overhead',
      arrayList: 'Low',
      linkedList: 'High (2 pointers/node)',
      vector: 'Low',
      copyOnWrite: 'High (copies)'
    },
    {
      feature: 'Best Use Case',
      arrayList: 'General purpose',
      linkedList: 'Queue operations',
      vector: 'Legacy code',
      copyOnWrite: 'Read-heavy concurrent'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Java List Implementations - Complete Guide
        </h2>
        <p className="text-gray-700 mb-4">
          Java provides multiple List implementations, each optimized for different scenarios.
          Understanding when to use each is crucial for writing efficient code.
        </p>
        <div className="bg-white rounded p-4 text-sm">
          <strong className="text-blue-600">Quick Decision Tree:</strong>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>• <strong>Need general-purpose list?</strong> → Use <code className="bg-gray-100 px-1">ArrayList</code></li>
            <li>• <strong>Frequent insertions at beginning?</strong> → Use <code className="bg-gray-100 px-1">LinkedList</code></li>
            <li>• <strong>Need thread-safety with many reads?</strong> → Use <code className="bg-gray-100 px-1">CopyOnWriteArrayList</code></li>
            <li>• <strong>Need immutable list?</strong> → Use <code className="bg-gray-100 px-1">List.of()</code> (Java 9+)</li>
            <li>• <strong>Working with legacy code?</strong> → Might see <code className="bg-gray-100 px-1">Vector</code></li>
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
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{impl.name}</h3>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {impl.type}
                    </span>
                    {impl.threadSafe && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Thread-Safe
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
                        <span className="text-blue-500 mr-2">▸</span>
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
                <th className="px-4 py-3 text-left font-bold">ArrayList</th>
                <th className="px-4 py-3 text-left font-bold">LinkedList</th>
                <th className="px-4 py-3 text-left font-bold">Vector</th>
                <th className="px-4 py-3 text-left font-bold">CopyOnWrite</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-semibold">{row.feature}</td>
                  <td className="px-4 py-3">{row.arrayList}</td>
                  <td className="px-4 py-3">{row.linkedList}</td>
                  <td className="px-4 py-3">{row.vector}</td>
                  <td className="px-4 py-3">{row.copyOnWrite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Java 21 Features */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border-2 border-yellow-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🆕</span>
          Java 21 Features - Sequenced Collections
        </h3>
        <p className="text-gray-700 mb-4">
          Java 21 introduced <strong>Sequenced Collections</strong>, a major enhancement that adds methods
          for accessing elements at both ends of collections!
        </p>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-bold text-gray-800 mb-2">New Interfaces:</h4>
          <ul className="space-y-2 text-gray-700">
            <li>• <code className="bg-gray-100 px-2 py-1">SequencedCollection</code> - Base interface</li>
            <li>• <code className="bg-gray-100 px-2 py-1">SequencedSet</code> - For sets with order</li>
            <li>• <code className="bg-gray-100 px-2 py-1">SequencedMap</code> - For maps with order</li>
          </ul>
        </div>

        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`// Java 21 - Sequenced Collections!
List<String> list = new ArrayList<>(List.of("A", "B", "C", "D"));

// New methods available on all Lists:
list.addFirst("Z");          // Add at beginning - NEW!
list.addLast("E");           // Add at end - NEW!
String first = list.getFirst();  // Get first - NEW!
String last = list.getLast();    // Get last - NEW!
list.removeFirst();          // Remove first - NEW!
list.removeLast();           // Remove last - NEW!

// Reverse view - NEW!
List<String> reversed = list.reversed();
// Returns view, not copy!

// Works with LinkedList too:
LinkedList<Integer> numbers = new LinkedList<>(List.of(1, 2, 3));
numbers.addFirst(0);         // Now unified API!
numbers.addLast(4);

// Before Java 21, LinkedList had different methods:
// numbers.addFirst() vs list.add(0, item)  // Inconsistent!
// Now unified: both use addFirst()!`}</code>
        </pre>

        <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <strong className="text-yellow-800">Why This Matters:</strong>
          <p className="text-yellow-700 mt-1">
            Before Java 21, ArrayList and LinkedList had different APIs for adding at beginning/end.
            Now they share a common interface, making code more consistent and easier to refactor!
          </p>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Best Practices</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold text-green-700">✓ DO:</h4>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>• Use <code className="bg-gray-100 px-1">ArrayList</code> as default choice</li>
              <li>• Specify initial capacity if size is known: <code className="bg-gray-100 px-1">new ArrayList&lt;&gt;(1000)</code></li>
              <li>• Use <code className="bg-gray-100 px-1">List.of()</code> for immutable constants</li>
              <li>• Use <code className="bg-gray-100 px-1">LinkedList</code> for queue/deque operations</li>
              <li>• Program to interface: <code className="bg-gray-100 px-1">List&lt;String&gt;</code> not <code className="bg-gray-100 px-1">ArrayList&lt;String&gt;</code></li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold text-red-700">✗ DON'T:</h4>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>• Don't use <code className="bg-gray-100 px-1">Vector</code> in new code</li>
              <li>• Don't use <code className="bg-gray-100 px-1">LinkedList</code> for random access</li>
              <li>• Don't use <code className="bg-gray-100 px-1">CopyOnWriteArrayList</code> for write-heavy scenarios</li>
              <li>• Don't modify <code className="bg-gray-100 px-1">Arrays.asList()</code> result</li>
              <li>• Don't use raw types: <code className="bg-gray-100 px-1">List</code> → use <code className="bg-gray-100 px-1">List&lt;String&gt;</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JavaListImplementations
