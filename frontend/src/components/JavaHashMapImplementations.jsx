import React, { useState } from 'react'

/**
 * Component showing all Java HashMap implementations with comparisons
 */
function JavaHashMapImplementations() {
  const [expandedSection, setExpandedSection] = useState(null)

  const implementations = [
    {
      name: 'HashMap<K,V>',
      type: 'Hash Table (unordered)',
      since: 'Java 1.2',
      bestFor: 'General-purpose key-value storage - BEST CHOICE',
      avoid: 'When you need ordering or thread-safety',
      threadSafe: false,
      features: [
        'O(1) average time for get, put, remove',
        'Unordered - no iteration order guarantee',
        'Allows one null key and multiple null values',
        'Not synchronized - fast for single thread',
        'Load factor 0.75, initial capacity 16'
      ],
      code: `// HashMap - RECOMMENDED for general use!
Map<String, Integer> map = new HashMap<>();

// Basic operations - O(1) average
map.put("Alice", 25);        // Insert/Update
map.put("Bob", 30);
map.put("Charlie", 35);

// Retrieve - O(1)
Integer age = map.get("Alice");  // 25
Integer none = map.get("Dave");  // null

// Check existence - O(1)
boolean hasAlice = map.containsKey("Alice");    // true
boolean hasAge30 = map.containsValue(30);       // true

// Remove - O(1)
map.remove("Bob");

// Size
int size = map.size();  // 2

// Null handling
map.put(null, 99);      // null key allowed!
map.put("nullValue", null);  // null value allowed

// Iteration (unordered!)
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}

// Java 8+ methods - very useful!
map.putIfAbsent("Alice", 20);  // Only if not present
map.getOrDefault("Dave", 0);   // Returns 0 if not found
map.merge("Alice", 1, Integer::sum);  // Alice's age + 1
map.computeIfAbsent("Eve", k -> k.length());  // Compute if missing

// Performance tuning
Map<String, Integer> optimized = new HashMap<>(100, 0.75f);
// Initial capacity 100, load factor 0.75
// Avoids resizing if you know approximate size`
    },
    {
      name: 'LinkedHashMap<K,V>',
      type: 'Hash Table + Doubly-Linked List',
      since: 'Java 1.4',
      bestFor: 'When you need insertion order or LRU cache',
      avoid: 'General use (HashMap is faster)',
      threadSafe: false,
      features: [
        'Maintains insertion order (or access order)',
        'O(1) average time like HashMap',
        'Slightly slower than HashMap',
        'Perfect for LRU cache implementation',
        'Can iterate in predictable order'
      ],
      code: `// LinkedHashMap - Maintains insertion order!
Map<String, Integer> map = new LinkedHashMap<>();

map.put("Alice", 25);
map.put("Bob", 30);
map.put("Charlie", 35);

// Iteration follows insertion order ✓
for (String key : map.keySet()) {
    System.out.println(key);
}
// Output: Alice, Bob, Charlie (same order as inserted!)

// Compare with HashMap: order is random/unpredictable
// LinkedHashMap: predictable order ✓


// ===== LRU CACHE IMPLEMENTATION =====
// Perfect use case for LinkedHashMap!

class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        // accessOrder=true: order by last access time
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;  // Remove oldest when full
    }
}

// Usage:
LRUCache<String, Integer> cache = new LRUCache<>(3);
cache.put("A", 1);  // [A]
cache.put("B", 2);  // [A, B]
cache.put("C", 3);  // [A, B, C]
cache.get("A");     // [B, C, A] - A accessed, moved to end
cache.put("D", 4);  // [C, A, D] - B evicted (least recently used!)

// This is how caching systems work!
// Used in: Redis, Memcached, browser caches


// ===== Access Order vs Insertion Order =====
// Insertion order (default):
Map<String, Integer> insertionOrder = new LinkedHashMap<>();

// Access order (for LRU):
Map<String, Integer> accessOrder = new LinkedHashMap<>(16, 0.75f, true);

accessOrder.put("A", 1);
accessOrder.put("B", 2);
accessOrder.put("C", 3);
accessOrder.get("A");  // Access A

// Iteration order: B, C, A (A moved to end!)
// Perfect for implementing "most recently used" tracking`
    },
    {
      name: 'TreeMap<K,V>',
      type: 'Red-Black Tree (sorted)',
      since: 'Java 1.2',
      bestFor: 'When you need sorted keys or range queries',
      avoid: 'General use (slower than HashMap)',
      threadSafe: false,
      features: [
        'O(log n) for get, put, remove',
        'Keys sorted by natural order or comparator',
        'Supports range operations (subMap, headMap, tailMap)',
        'No null keys allowed (but null values OK)',
        'Implements NavigableMap interface'
      ],
      code: `// TreeMap - Keys are SORTED!
Map<String, Integer> map = new TreeMap<>();

map.put("Charlie", 35);
map.put("Alice", 25);
map.put("Bob", 30);

// Iteration is SORTED by key! ✓
for (String key : map.keySet()) {
    System.out.println(key);
}
// Output: Alice, Bob, Charlie (alphabetical!)

// Operations: O(log n) instead of O(1)
map.get("Alice");     // O(log n)
map.put("Dave", 40);  // O(log n)
map.remove("Bob");    // O(log n)


// ===== NavigableMap Operations =====
// TreeMap implements NavigableMap - powerful!

NavigableMap<Integer, String> scores = new TreeMap<>();
scores.put(85, "Alice");
scores.put(92, "Bob");
scores.put(78, "Charlie");
scores.put(95, "Dave");

// Get first/last
scores.firstKey();   // 78
scores.lastKey();    // 95
scores.firstEntry(); // 78=Charlie

// Ceiling/Floor (nearest key)
scores.ceilingKey(80);  // 85 (≥80)
scores.floorKey(80);    // 78 (≤80)
scores.higherKey(85);   // 92 (>85)
scores.lowerKey(85);    // 78 (<85)

// Range queries
scores.subMap(80, 93);     // Keys in [80, 93)
scores.headMap(90);        // Keys < 90
scores.tailMap(90);        // Keys ≥ 90

// Descending order
scores.descendingMap();    // Reversed view!


// ===== Custom Comparator =====
// Sort by key length instead of alphabetical
Map<String, Integer> byLength = new TreeMap<>(
    Comparator.comparingInt(String::length)
        .thenComparing(String::compareTo)  // Tie-breaker
);

byLength.put("Alice", 25);
byLength.put("Bob", 30);
byLength.put("Charlie", 35);
// Iteration: Bob (3), Alice (5), Charlie (7)


// ===== Use Cases =====
// 1. Leaderboards (sorted by score)
// 2. Time-series data (sorted by timestamp)
// 3. Range queries (find all keys in range)
// 4. Finding nearest element
// 5. Ordered iteration required

// Performance: O(log n) but worth it for sorting!`
    },
    {
      name: 'ConcurrentHashMap<K,V>',
      type: 'Thread-Safe Hash Table',
      since: 'Java 1.5 (improved in Java 8)',
      bestFor: 'High-concurrency multi-threaded environments',
      avoid: 'Single-threaded apps (overhead not needed)',
      threadSafe: true,
      features: [
        'Thread-safe without full synchronization',
        'Lock-free reads, fine-grained locking for writes',
        'No null keys or values allowed',
        'Atomic operations (putIfAbsent, replace, etc.)',
        'Scalable for high concurrency'
      ],
      code: `// ConcurrentHashMap - Thread-safe and fast!
Map<String, Integer> map = new ConcurrentHashMap<>();

// Thread-safe operations
map.put("Alice", 25);      // Thread-safe
map.get("Alice");          // Lock-free read!
map.remove("Alice");       // Thread-safe

// No null keys or values!
// map.put(null, 25);      // NullPointerException
// map.put("Alice", null); // NullPointerException


// ===== Atomic Operations =====
// These are atomic - no race conditions!

map.putIfAbsent("Alice", 25);  // Only if not present
// Returns null if inserted, old value if present

map.replace("Alice", 25, 26);  // Only if current value is 25
// Returns true if replaced, false otherwise

map.remove("Alice", 26);       // Only if current value is 26
// Returns true if removed, false otherwise

// Compare with HashMap:
// HashMap:
//   if (!map.containsKey("Alice")) map.put("Alice", 25);
//   // RACE CONDITION! Another thread could insert between!
// ConcurrentHashMap:
//   map.putIfAbsent("Alice", 25);  // ATOMIC! Safe!


// ===== Thread-Safe Computations =====
// Update value atomically

// Increment counter (thread-safe)
map.compute("counter", (k, v) -> (v == null) ? 1 : v + 1);

// Or use merge:
map.merge("counter", 1, Integer::sum);
// If "counter" exists: add 1
// If "counter" missing: set to 1
// ATOMIC operation!

// Real-world example: Frequency counter
ConcurrentHashMap<String, Integer> wordCount = new ConcurrentHashMap<>();

// Multiple threads can do this safely:
words.parallelStream().forEach(word -> {
    wordCount.merge(word, 1, Integer::sum);  // Thread-safe!
});


// ===== Performance: Java 8+ Improvements =====
// Java 7: 16 segments (segment-level locking)
// Java 8: Per-bucket CAS + synchronized
//         Lock-free reads, fine-grained writes

// Benchmark (8 threads, 1M operations):
// ConcurrentHashMap:           ~50ms  ⚡
// Collections.synchronizedMap: ~400ms 🐌
// Speedup: 8x!


// ===== Bulk Operations (Java 8+) =====
map.forEach((k, v) -> System.out.println(k + "=" + v));

// Parallel bulk operations
map.forEachKey(1, System.out::println);     // Parallelism threshold
map.forEachValue(1, System.out::println);
map.forEachEntry(1, System.out::println);

// Search in parallel
String result = map.search(1, (k, v) -> v > 30 ? k : null);

// Reduce in parallel
int sum = map.reduce(1,
    (k, v) -> v,           // Transform
    0,                      // Identity
    Integer::sum           // Combine
);


// ===== When to Use =====
// ✓ Multi-threaded web server (request caching)
// ✓ Shared state between threads
// ✓ High read/write concurrency
// ✗ Single-threaded (use HashMap - faster)
// ✗ Need null keys/values (use synchronized HashMap)
// ✗ Exact size() matters (ConcurrentHashMap.size() is approximate!)`
    },
    {
      name: 'WeakHashMap<K,V>',
      type: 'Weak References (GC-friendly)',
      since: 'Java 1.2',
      bestFor: 'Canonicalizing mappings without memory leaks',
      avoid: 'General use (most maps should be strong references)',
      threadSafe: false,
      features: [
        'Keys are weak references - can be garbage collected',
        'Entries automatically removed when key is GC\'d',
        'Useful for caching without memory leaks',
        'Not synchronized',
        'Perfect for canonicalization'
      ],
      code: `// WeakHashMap - Keys can be garbage collected!
Map<String, Integer> cache = new WeakHashMap<>();

String key1 = new String("temp");  // New object
cache.put(key1, 100);

System.out.println(cache.size());  // 1

key1 = null;  // No more strong references to "temp"
System.gc();  // Suggest garbage collection

Thread.sleep(100);  // Give GC time

System.out.println(cache.size());  // 0 - Entry removed!


// ===== Use Case: Canonicalizing Mapping =====
// Problem: Store metadata for objects without preventing GC

class MetadataManager {
    // Store metadata for objects
    private Map<Object, Metadata> metadata = new WeakHashMap<>();

    public void associate(Object obj, Metadata meta) {
        metadata.put(obj, meta);
    }

    public Metadata get(Object obj) {
        return metadata.get(obj);
    }
}

// When object is no longer referenced:
Object obj = new Object();
manager.associate(obj, new Metadata("info"));
obj = null;  // Object can be GC'd
// WeakHashMap entry automatically removed!
// No memory leak! ✓


// ===== Compare with HashMap =====
Map<Object, String> regular = new HashMap<>();
Object key = new Object();
regular.put(key, "value");
key = null;
System.gc();
// HashMap still holds strong reference to key!
// Entry NOT removed - potential memory leak!


// ===== Real-World Examples =====

// 1. Image cache (avoid OutOfMemoryError)
Map<ImageKey, BufferedImage> imageCache = new WeakHashMap<>();

// 2. Class metadata cache
Map<Class<?>, ClassMetadata> classMetadata = new WeakHashMap<>();

// 3. String interning (like String.intern())
Map<String, String> internPool = new WeakHashMap<>();
public String intern(String s) {
    String existing = internPool.get(s);
    if (existing != null) return existing;
    internPool.put(s, s);
    return s;
}


// ===== Important Notes =====
// 1. Keys are weak, VALUES are strong references!
//    If value references key → won't be GC'd! Be careful!

// 2. Use when:
//    - Associating data with external objects
//    - Cache that shouldn't prevent GC
//    - Don't control object lifecycle

// 3. Avoid when:
//    - Need guaranteed retention
//    - Keys are primitives (use Integer, not int)
//    - General-purpose map (use HashMap)`
    },
    {
      name: 'IdentityHashMap<K,V>',
      type: 'Reference Equality (==)',
      since: 'Java 1.4',
      bestFor: 'When you need reference equality, not value equality',
      avoid: 'Normal use cases (use HashMap)',
      threadSafe: false,
      features: [
        'Uses == instead of equals() for key comparison',
        'Uses System.identityHashCode() instead of hashCode()',
        'Different String objects with same value are different keys',
        'Useful for object tracking and serialization',
        'Intentionally violates Map contract'
      ],
      code: `// IdentityHashMap - Uses == not equals()!
Map<String, Integer> map = new IdentityHashMap<>();

String s1 = new String("key");
String s2 = new String("key");

map.put(s1, 1);
map.put(s2, 2);

// Regular HashMap: size=1 (s1.equals(s2) is true)
// IdentityHashMap: size=2 (s1 != s2) ✓

System.out.println(map.size());  // 2
System.out.println(map.get(s1)); // 1
System.out.println(map.get(s2)); // 2

// Even though s1.equals(s2) is true!
// IdentityHashMap uses reference equality (==)


// ===== Use Case: Object Tracking During Traversal =====
// Problem: Detect cycles in object graph

class ObjectSerializer {
    private Map<Object, Integer> idMap = new IdentityHashMap<>();
    private int nextId = 0;

    public void serialize(Object obj) {
        if (idMap.containsKey(obj)) {
            // Already serialized - write reference
            int id = idMap.get(obj);
            writeReference(id);
            return;
        }

        // First time seeing this object
        idMap.put(obj, nextId++);
        writeObject(obj);
    }
}

// Uses reference equality!
// Two "equal" objects should be serialized separately


// ===== Use Case: Proxy/Wrapper Tracking =====
Map<Object, ProxyWrapper> wrappers = new IdentityHashMap<>();

public ProxyWrapper getWrapper(Object obj) {
    // Want to track specific object instances
    if (!wrappers.containsKey(obj)) {
        wrappers.put(obj, new ProxyWrapper(obj));
    }
    return wrappers.get(obj);
}

// Each object instance gets its own wrapper
// Even if objects are "equal"


// ===== Comparison with HashMap =====
Map<String, Integer> hashMap = new HashMap<>();
Map<String, Integer> identityMap = new IdentityHashMap<>();

String a = new String("test");
String b = new String("test");

hashMap.put(a, 1);
hashMap.put(b, 2);
System.out.println(hashMap.size());  // 1 (b overwrote a)

identityMap.put(a, 1);
identityMap.put(b, 2);
System.out.println(identityMap.size());  // 2 (a and b are different)


// ===== When to Use =====
// ✓ Object graph traversal (cycle detection)
// ✓ Serialization frameworks
// ✓ Tracking object instances specifically
// ✓ Proxies/wrappers per instance
// ✗ Normal key-value storage (use HashMap!)
// ✗ String keys with value equality
// ✗ When you override equals()/hashCode()

// Note: Intentionally violates Map general contract!
// Use only when you specifically need reference equality`
    },
    {
      name: 'EnumMap<K,V>',
      type: 'Enum Keys (Array-based)',
      since: 'Java 1.5',
      bestFor: 'When keys are enum values',
      avoid: 'Non-enum keys',
      threadSafe: false,
      features: [
        'Specialized for enum keys',
        'Implemented as array - extremely fast',
        'O(1) operations with no hashing overhead',
        'Maintains enum declaration order',
        'More memory efficient than HashMap for enums'
      ],
      code: `// EnumMap - Specialized for enum keys!
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

Map<Day, String> schedule = new EnumMap<>(Day.class);

schedule.put(Day.MONDAY, "Team Meeting");
schedule.put(Day.WEDNESDAY, "Code Review");
schedule.put(Day.FRIDAY, "Deploy");

String monday = schedule.get(Day.MONDAY);  // "Team Meeting"

// Iteration follows enum declaration order!
for (Day day : schedule.keySet()) {
    System.out.println(day + ": " + schedule.get(day));
}
// Output: MONDAY, WEDNESDAY, FRIDAY (in enum order!)


// ===== Why EnumMap is Special =====
// Internally: Just an array!

// EnumMap implementation (simplified):
class EnumMap<K extends Enum<K>, V> {
    private V[] values;  // Array indexed by enum.ordinal()

    public V get(K key) {
        return values[key.ordinal()];  // Direct array access!
    }

    public V put(K key, V value) {
        return values[key.ordinal()] = value;
    }
}

// No hashing! No hash collisions!
// Just array indexing → BLAZING FAST ⚡


// ===== Performance Comparison =====
// Benchmark: 1M get() operations
// EnumMap:  ~5ms  ⚡⚡⚡ (array access)
// HashMap:  ~15ms ⚡ (hashing + lookup)

// Memory: EnumMap uses ~3x less memory!


// ===== Real-World Examples =====

// 1. Configuration per enum
enum Environment {
    DEV, STAGING, PRODUCTION
}

Map<Environment, Config> configs = new EnumMap<>(Environment.class);
configs.put(Environment.DEV, new Config("localhost", 8080));
configs.put(Environment.PRODUCTION, new Config("prod.com", 443));

// 2. State machine transitions
enum State {
    IDLE, RUNNING, PAUSED, STOPPED
}

Map<State, List<State>> transitions = new EnumMap<>(State.class);
transitions.put(State.IDLE, List.of(State.RUNNING));
transitions.put(State.RUNNING, List.of(State.PAUSED, State.STOPPED));
transitions.put(State.PAUSED, List.of(State.RUNNING, State.STOPPED));

// 3. HTTP method handlers
enum HttpMethod {
    GET, POST, PUT, DELETE, PATCH
}

Map<HttpMethod, Handler> handlers = new EnumMap<>(HttpMethod.class);
handlers.put(HttpMethod.GET, this::handleGet);
handlers.put(HttpMethod.POST, this::handlePost);


// ===== Best Practices =====
// ✓ ALWAYS use EnumMap for enum keys (not HashMap!)
// ✓ Faster and more memory efficient
// ✓ Type-safe at compile time
// ✓ Maintains enum order

// Compare:
Map<Day, String> bad = new HashMap<>();      // Wrong!
Map<Day, String> good = new EnumMap<>(Day.class);  // Right! ⚡

// EnumMap is one of the fastest Map implementations!`
    }
  ]

  const comparisonData = [
    {
      feature: 'Time Complexity',
      hashMap: 'O(1) avg ⚡',
      linkedHashMap: 'O(1) avg',
      treeMap: 'O(log n)',
      concurrent: 'O(1) avg',
      weak: 'O(1) avg',
      identity: 'O(1) avg',
      enumMap: 'O(1) ⚡⚡'
    },
    {
      feature: 'Ordering',
      hashMap: 'None',
      linkedHashMap: 'Insertion/Access',
      treeMap: 'Sorted',
      concurrent: 'None',
      weak: 'None',
      identity: 'None',
      enumMap: 'Enum order'
    },
    {
      feature: 'Null Keys',
      hashMap: '✅ 1 null',
      linkedHashMap: '✅ 1 null',
      treeMap: '❌',
      concurrent: '❌',
      weak: '✅',
      identity: '✅',
      enumMap: '❌'
    },
    {
      feature: 'Thread-Safe',
      hashMap: '❌',
      linkedHashMap: '❌',
      treeMap: '❌',
      concurrent: '✅ ⚡',
      weak: '❌',
      identity: '❌',
      enumMap: '❌'
    },
    {
      feature: 'Memory',
      hashMap: 'Low ⚡',
      linkedHashMap: 'Medium',
      treeMap: 'High',
      concurrent: 'Medium',
      weak: 'Low',
      identity: 'Low',
      enumMap: 'Lowest ⚡⚡'
    },
    {
      feature: 'Best Use Case',
      hashMap: 'General purpose',
      linkedHashMap: 'LRU cache',
      treeMap: 'Sorted keys',
      concurrent: 'Multi-threaded',
      weak: 'GC-friendly cache',
      identity: 'Reference equality',
      enumMap: 'Enum keys'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Java HashMap Implementations - Complete Guide
        </h2>
        <p className="text-gray-700 mb-4">
          Java provides multiple Map implementations for different use cases. <code className="bg-gray-100 px-1">HashMap</code> is
          the go-to choice for most scenarios, offering O(1) average-case performance for key operations.
        </p>
        <div className="bg-white rounded p-4 text-sm">
          <strong className="text-pink-600">Quick Decision Tree:</strong>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>• <strong>General key-value storage?</strong> → Use <code className="bg-gray-100 px-1">HashMap&lt;K,V&gt;</code> ⚡ BEST!</li>
            <li>• <strong>Need insertion order?</strong> → Use <code className="bg-gray-100 px-1">LinkedHashMap&lt;K,V&gt;</code></li>
            <li>• <strong>Need sorted keys?</strong> → Use <code className="bg-gray-100 px-1">TreeMap&lt;K,V&gt;</code></li>
            <li>• <strong>Multi-threaded?</strong> → Use <code className="bg-gray-100 px-1">ConcurrentHashMap&lt;K,V&gt;</code></li>
            <li>• <strong>Enum keys?</strong> → Use <code className="bg-gray-100 px-1">EnumMap&lt;K,V&gt;</code> (fastest!)</li>
            <li>• <strong>Reference equality?</strong> → Use <code className="bg-gray-100 px-1">IdentityHashMap&lt;K,V&gt;</code></li>
            <li>• <strong>GC-friendly cache?</strong> → Use <code className="bg-gray-100 px-1">WeakHashMap&lt;K,V&gt;</code></li>
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
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {impl.type}
                    </span>
                    {impl.threadSafe && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Thread-Safe
                      </span>
                    )}
                    {impl.name.includes('HashMap') && !impl.name.includes('Weak') && !impl.name.includes('Identity') && (
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
                        <span className="text-pink-500 mr-2">▸</span>
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
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Performance Comparison</h3>
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-3 text-left font-bold">Feature</th>
              <th className="px-3 py-3 text-left font-bold">HashMap ⚡</th>
              <th className="px-3 py-3 text-left font-bold">LinkedHashMap</th>
              <th className="px-3 py-3 text-left font-bold">TreeMap</th>
              <th className="px-3 py-3 text-left font-bold">Concurrent</th>
              <th className="px-3 py-3 text-left font-bold">WeakHashMap</th>
              <th className="px-3 py-3 text-left font-bold">IdentityHashMap</th>
              <th className="px-3 py-3 text-left font-bold">EnumMap</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-3 font-semibold">{row.feature}</td>
                <td className="px-3 py-3">{row.hashMap}</td>
                <td className="px-3 py-3">{row.linkedHashMap}</td>
                <td className="px-3 py-3">{row.treeMap}</td>
                <td className="px-3 py-3">{row.concurrent}</td>
                <td className="px-3 py-3">{row.weak}</td>
                <td className="px-3 py-3">{row.identity}</td>
                <td className="px-3 py-3">{row.enumMap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Best Practices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Best Practices</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold text-green-700">✓ DO:</h4>
            <ul className="mt-2 space-y-1 text-gray-700 text-sm">
              <li>• Use <code className="bg-gray-100 px-1">HashMap</code> as your default Map implementation</li>
              <li>• Program to interface: <code className="bg-gray-100 px-1">Map&lt;K,V&gt;</code> not <code className="bg-gray-100 px-1">HashMap&lt;K,V&gt;</code></li>
              <li>• Use <code className="bg-gray-100 px-1">ConcurrentHashMap</code> for multi-threaded scenarios</li>
              <li>• Set initial capacity if you know size: <code className="bg-gray-100 px-1">new HashMap&lt;&gt;(1000)</code></li>
              <li>• Use <code className="bg-gray-100 px-1">EnumMap</code> for enum keys (fastest!)</li>
              <li>• Override both <code className="bg-gray-100 px-1">equals()</code> and <code className="bg-gray-100 px-1">hashCode()</code> for custom keys</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold text-red-700">✗ DON'T:</h4>
            <ul className="mt-2 space-y-1 text-gray-700 text-sm">
              <li>• Don't use mutable objects as keys (will break if hashCode changes)</li>
              <li>• Don't use <code className="bg-gray-100 px-1">TreeMap</code> unless you need sorting (slower)</li>
              <li>• Don't synchronize <code className="bg-gray-100 px-1">HashMap</code> manually - use <code className="bg-gray-100 px-1">ConcurrentHashMap</code></li>
              <li>• Don't override <code className="bg-gray-100 px-1">equals()</code> without <code className="bg-gray-100 px-1">hashCode()</code> (breaks contract!)</li>
              <li>• Don't use <code className="bg-gray-100 px-1">IdentityHashMap</code> for general use</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JavaHashMapImplementations
