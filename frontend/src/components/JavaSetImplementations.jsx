import React, { useState } from 'react'

/**
 * Component showing all Java Set implementations with comparisons
 */
function JavaSetImplementations() {
  const [expandedSection, setExpandedSection] = useState(null)

  const implementations = [
    {
      name: 'HashSet',
      type: 'Hash Table',
      since: 'Java 1.2',
      bestFor: 'Fast lookups, uniqueness, no order needed',
      avoid: 'When you need sorted or insertion-order',
      threadSafe: false,
      ordered: false,
      sorted: false,
      features: [
        'O(1) average for add, remove, contains',
        'No guaranteed order',
        'Allows one null element',
        'Backed by HashMap internally'
      ],
      code: `// HashSet - Fastest set implementation!
HashSet<String> set = new HashSet<>();

// O(1) operations
set.add("Apple");            // true
set.add("Banana");
set.add("Apple");            // false - already exists!

// Fast contains check
boolean has = set.contains("Apple");  // O(1) average

// Iteration order is NOT guaranteed
for (String fruit : set) {
    System.out.println(fruit);  // Random order!
}

// Initial capacity and load factor
HashSet<String> optimized = new HashSet<>(1000, 0.75f);

// Bulk operations
Set<String> another = Set.of("Cherry", "Date");
set.addAll(another);         // Union
set.retainAll(another);      // Intersection
set.removeAll(another);      // Difference`
    },
    {
      name: 'LinkedHashSet',
      type: 'Hash Table + Linked List',
      since: 'Java 1.4',
      bestFor: 'When you need insertion-order AND fast lookups',
      avoid: 'When memory is very constrained',
      threadSafe: false,
      ordered: true,
      sorted: false,
      features: [
        'Maintains insertion order',
        'Still O(1) for add/remove/contains',
        'Slightly slower than HashSet',
        'Higher memory overhead (linked list pointers)'
      ],
      code: `// LinkedHashSet - Remembers insertion order!
LinkedHashSet<String> set = new LinkedHashSet<>();

set.add("Banana");
set.add("Apple");
set.add("Cherry");

// Iteration maintains insertion order
for (String fruit : set) {
    System.out.println(fruit);
    // Prints: Banana, Apple, Cherry (insertion order!)
}

// Perfect for: Removing duplicates while preserving order
List<String> withDuplicates = Arrays.asList("A", "B", "A", "C", "B");
Set<String> unique = new LinkedHashSet<>(withDuplicates);
// Result: [A, B, C] in insertion order!

// Use case: LRU Cache foundation
LinkedHashSet<String> accessOrder = new LinkedHashSet<>();
// Can track access patterns`
    },
    {
      name: 'TreeSet',
      type: 'Red-Black Tree (NavigableSet)',
      since: 'Java 1.2',
      bestFor: 'Sorted data, range queries, navigation',
      avoid: 'When you don\'t need sorting (use HashSet)',
      threadSafe: false,
      ordered: true,
      sorted: true,
      features: [
        'Elements always sorted (natural or custom order)',
        'O(log n) for add, remove, contains',
        'Implements NavigableSet (powerful range operations)',
        'No null elements allowed'
      ],
      code: `// TreeSet - Auto-sorted!
TreeSet<Integer> set = new TreeSet<>();

set.add(5);
set.add(2);
set.add(8);
set.add(1);

// Always sorted!
System.out.println(set);     // [1, 2, 5, 8]

// NavigableSet operations - POWERFUL!
set.first();                 // 1 - smallest element
set.last();                  // 8 - largest element
set.higher(2);               // 5 - next element after 2
set.lower(5);                // 2 - previous element before 5
set.ceiling(3);              // 5 - >= 3
set.floor(7);                // 5 - <= 7

// Range views
Set<Integer> subset = set.subSet(2, 6);  // [2, 5]
Set<Integer> headSet = set.headSet(5);    // [1, 2]
Set<Integer> tailSet = set.tailSet(5);    // [5, 8]

// Reverse order
NavigableSet<Integer> reversed = set.descendingSet();
System.out.println(reversed);  // [8, 5, 2, 1]

// Custom comparator
TreeSet<String> byLength = new TreeSet<>(
    Comparator.comparingInt(String::length)
);
byLength.add("Apple");
byLength.add("Banana");
byLength.add("Fig");
// Sorted by length: [Fig, Apple, Banana]`
    },
    {
      name: 'EnumSet',
      type: 'Bit Vector',
      since: 'Java 1.5',
      bestFor: 'Sets of enum values',
      avoid: 'Non-enum elements',
      threadSafe: false,
      ordered: true,
      sorted: true,
      features: [
        'Extremely efficient for enum types',
        'Internally uses bit vectors',
        'All operations are very fast',
        'Much faster and more compact than HashSet for enums'
      ],
      code: `// EnumSet - Super efficient for enums!
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY,
    FRIDAY, SATURDAY, SUNDAY
}

// Create in various ways
EnumSet<Day> weekend = EnumSet.of(Day.SATURDAY, Day.SUNDAY);
EnumSet<Day> weekdays = EnumSet.range(Day.MONDAY, Day.FRIDAY);
EnumSet<Day> allDays = EnumSet.allOf(Day.class);
EnumSet<Day> noDays = EnumSet.noneOf(Day.class);

// Complement
EnumSet<Day> workdays = EnumSet.complementOf(weekend);

// Use in switch (Java 14+)
Day today = Day.FRIDAY;
if (weekend.contains(today)) {
    System.out.println("It's the weekend!");
}

// Perfect for: Flags and options
enum Permission {
    READ, WRITE, EXECUTE, DELETE
}

EnumSet<Permission> userPerms = EnumSet.of(
    Permission.READ,
    Permission.WRITE
);

// Check permissions
if (userPerms.contains(Permission.WRITE)) {
    // Allow write
}

// Why EnumSet?
// - Uses single long (64 bits) for up to 64 enum values
// - Operations are simple bit manipulations - VERY fast!
// - HashSet<Enum> would need objects and hash calculations`
    },
    {
      name: 'CopyOnWriteArraySet',
      type: 'Thread-Safe Array',
      since: 'Java 1.5',
      bestFor: 'Thread-safe, read-heavy scenarios',
      avoid: 'Write-heavy or large sets',
      threadSafe: true,
      ordered: true,
      sorted: false,
      features: [
        'Thread-safe without locks',
        'Backed by CopyOnWriteArrayList',
        'Expensive writes (copies entire array)',
        'Great for small sets with many readers'
      ],
      code: `// CopyOnWriteArraySet - Thread-safe!
CopyOnWriteArraySet<String> set = new CopyOnWriteArraySet<>();

// Safe for concurrent access
set.add("Apple");

// Multiple threads can iterate safely
for (String item : set) {
    // Other threads can modify set
    // This iterator won't throw ConcurrentModificationException
}

// Perfect use case: Observer pattern
CopyOnWriteArraySet<Observer> observers = new CopyOnWriteArraySet<>();

// Adding observers is rare
observers.add(new Observer());

// Notifying is frequent - safe iteration
for (Observer obs : observers) {
    obs.notify();  // Safe even if others modify set
}

// Warning: Contains is O(n) not O(1)!
// Uses array search, not hash table`
    },
    {
      name: 'Set.of()',
      type: 'Immutable Set',
      since: 'Java 9',
      bestFor: 'Immutable sets, constants',
      avoid: 'When you need to modify',
      threadSafe: true,
      ordered: false,
      sorted: false,
      features: [
        'Completely immutable',
        'No null elements',
        'Space-efficient',
        'Optimized for small sets'
      ],
      code: `// Set.of() - Immutable! (Java 9+)
Set<String> fruits = Set.of("Apple", "Banana", "Cherry");

// fruits.add("Date");       // UnsupportedOperationException!
// fruits.remove("Apple");   // UnsupportedOperationException!

// No nulls allowed
// Set<String> bad = Set.of("A", null);  // NullPointerException!

// No duplicates
// Set<String> bad = Set.of("A", "A");  // IllegalArgumentException!

// Perfect for constants
public class Config {
    public static final Set<String> VALID_MODES =
        Set.of("READ", "WRITE", "EXECUTE");

    public static final Set<Integer> ALLOWED_PORTS =
        Set.of(80, 443, 8080, 8443);
}

// Can use var (Java 10+)
var immutableSet = Set.of(1, 2, 3, 4, 5);

// Small sets (0-10 elements) have specialized implementations
// Very memory efficient!`
    },
    {
      name: 'Set.copyOf()',
      type: 'Immutable Copy',
      since: 'Java 10',
      bestFor: 'Creating immutable snapshots',
      avoid: 'When source is already immutable',
      threadSafe: true,
      ordered: false,
      sorted: false,
      features: [
        'Creates immutable copy',
        'Returns same instance if already immutable',
        'Defensive copying made easy',
        'Thread-safe'
      ],
      code: `// Set.copyOf() - Immutable snapshot! (Java 10+)
Set<String> original = new HashSet<>();
original.add("Apple");
original.add("Banana");

Set<String> immutableCopy = Set.copyOf(original);
original.add("Cherry");      // Original changes
// immutableCopy still has ["Apple", "Banana"]

// Defensive copying in APIs
public class User {
    private final Set<String> permissions;

    public User(Set<String> perms) {
        this.permissions = Set.copyOf(perms);  // Defensive copy
    }

    public Set<String> getPermissions() {
        return permissions;  // Safe - already immutable
    }
}

// Smart: If source is already immutable, returns same instance
Set<String> immutable1 = Set.of("A", "B");
Set<String> immutable2 = Set.copyOf(immutable1);
// immutable1 == immutable2  (same object!)

// Performance optimization built-in!`
    }
  ]

  const comparisonData = [
    {
      feature: 'Add/Remove/Contains',
      hashSet: 'O(1) avg ⚡',
      linkedHashSet: 'O(1) avg ⚡',
      treeSet: 'O(log n)',
      enumSet: 'O(1) ⚡⚡',
      copyOnWrite: 'O(n) write'
    },
    {
      feature: 'Ordering',
      hashSet: 'No order',
      linkedHashSet: 'Insertion order',
      treeSet: 'Sorted',
      enumSet: 'Natural enum order',
      copyOnWrite: 'Insertion order'
    },
    {
      feature: 'Null Elements',
      hashSet: '✓ One null',
      linkedHashSet: '✓ One null',
      treeSet: '❌ No nulls',
      enumSet: '❌ No nulls',
      copyOnWrite: '✓ Allows nulls'
    },
    {
      feature: 'Thread Safety',
      hashSet: '❌',
      linkedHashSet: '❌',
      treeSet: '❌',
      enumSet: '❌',
      copyOnWrite: '✅ Lock-free'
    },
    {
      feature: 'Memory Efficiency',
      hashSet: 'Good',
      linkedHashSet: 'Medium (links)',
      treeSet: 'Medium (tree)',
      enumSet: 'Excellent (bits)',
      copyOnWrite: 'Poor (copies)'
    },
    {
      feature: 'Best Use Case',
      hashSet: 'General purpose',
      linkedHashSet: 'Order matters',
      treeSet: 'Need sorting',
      enumSet: 'Enum flags',
      copyOnWrite: 'Concurrent reads'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Java Set Implementations - Complete Guide
        </h2>
        <p className="text-gray-700 mb-4">
          Java provides several Set implementations, each with different characteristics.
          Choose based on your needs for ordering, performance, and thread-safety.
        </p>
        <div className="bg-white rounded p-4 text-sm">
          <strong className="text-purple-600">Quick Decision Tree:</strong>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>• <strong>Need fast lookups, no order?</strong> → Use <code className="bg-gray-100 px-1">HashSet</code></li>
            <li>• <strong>Need insertion order preserved?</strong> → Use <code className="bg-gray-100 px-1">LinkedHashSet</code></li>
            <li>• <strong>Need sorted elements?</strong> → Use <code className="bg-gray-100 px-1">TreeSet</code></li>
            <li>• <strong>Working with enums?</strong> → Use <code className="bg-gray-100 px-1">EnumSet</code></li>
            <li>• <strong>Need thread-safe with many reads?</strong> → Use <code className="bg-gray-100 px-1">CopyOnWriteArraySet</code></li>
            <li>• <strong>Need immutable?</strong> → Use <code className="bg-gray-100 px-1">Set.of()</code> (Java 9+)</li>
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
                    {impl.ordered && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Ordered
                      </span>
                    )}
                    {impl.sorted && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Sorted
                      </span>
                    )}
                    {impl.threadSafe && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Thread-Safe
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Since:</strong> {impl.since}</div>
                    <div><strong>Best for:</strong> {impl.bestFor}</div>
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
                <th className="px-4 py-3 text-left font-bold">HashSet</th>
                <th className="px-4 py-3 text-left font-bold">LinkedHashSet</th>
                <th className="px-4 py-3 text-left font-bold">TreeSet</th>
                <th className="px-4 py-3 text-left font-bold">EnumSet</th>
                <th className="px-4 py-3 text-left font-bold">CopyOnWrite</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-semibold">{row.feature}</td>
                  <td className="px-4 py-3">{row.hashSet}</td>
                  <td className="px-4 py-3">{row.linkedHashSet}</td>
                  <td className="px-4 py-3">{row.treeSet}</td>
                  <td className="px-4 py-3">{row.enumSet}</td>
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
          Java 21 Features - Sequenced Sets
        </h3>
        <p className="text-gray-700 mb-4">
          Java 21 introduced <strong>Sequenced Collections</strong>, which includes SequencedSet for sets with defined order!
        </p>

        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`// Java 21 - Sequenced Sets!
// LinkedHashSet and TreeSet now implement SequencedSet

LinkedHashSet<String> set = new LinkedHashSet<>();
set.add("A");
set.add("B");
set.add("C");

// New methods for ordered sets:
set.addFirst("Z");           // Add at beginning - NEW!
set.addLast("D");            // Add at end - NEW!
String first = set.getFirst();   // Get first - NEW!
String last = set.getLast();     // Get last - NEW!
set.removeFirst();           // Remove first - NEW!
set.removeLast();            // Remove last - NEW!

// Reverse view - NEW!
SequencedSet<String> reversed = set.reversed();
// Returns view, changes reflect in original!

// TreeSet benefits too:
TreeSet<Integer> sorted = new TreeSet<>(List.of(1, 3, 5, 7, 9));
sorted.addFirst(0);          // Adds 0 (maintains sort)
sorted.addLast(10);          // Adds 10 (maintains sort)
Integer first = sorted.getFirst();   // 0 - minimum
Integer last = sorted.getLast();     // 10 - maximum

// Before Java 21:
// sorted.first() / sorted.last() - different API!
// Now unified: getFirst() / getLast() for all ordered sets!`}</code>
        </pre>

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-bold text-gray-800 mb-2">SequencedSet Interface Hierarchy:</h4>
          <pre className="text-sm text-gray-700 font-mono">
{`Collection
  └── Set
      └── SequencedSet (Java 21+)
          ├── SortedSet
          │   └── NavigableSet
          │       └── TreeSet
          └── LinkedHashSet`}
          </pre>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Best Practices</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold text-green-700">✓ DO:</h4>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>• Use <code className="bg-gray-100 px-1">HashSet</code> as default choice</li>
              <li>• Use <code className="bg-gray-100 px-1">EnumSet</code> for enum collections (much faster!)</li>
              <li>• Use <code className="bg-gray-100 px-1">Set.of()</code> for immutable constants</li>
              <li>• Use <code className="bg-gray-100 px-1">TreeSet</code> when you need sorted data</li>
              <li>• Program to interface: <code className="bg-gray-100 px-1">Set&lt;String&gt;</code> not <code className="bg-gray-100 px-1">HashSet&lt;String&gt;</code></li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold text-red-700">✗ DON'T:</h4>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>• Don't use <code className="bg-gray-100 px-1">TreeSet</code> if you don't need sorting (slower than HashSet)</li>
              <li>• Don't use <code className="bg-gray-100 px-1">LinkedHashSet</code> if order doesn't matter (uses more memory)</li>
              <li>• Don't use <code className="bg-gray-100 px-1">HashSet</code> for enums (use EnumSet)</li>
              <li>• Don't add null to <code className="bg-gray-100 px-1">TreeSet</code> or <code className="bg-gray-100 px-1">EnumSet</code></li>
              <li>• Don't use <code className="bg-gray-100 px-1">CopyOnWriteArraySet</code> for write-heavy scenarios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JavaSetImplementations
