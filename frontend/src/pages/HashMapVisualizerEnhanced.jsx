import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'
import JavaHashMapImplementations from '../components/JavaHashMapImplementations'

function HashMapVisualizerEnhanced() {
  const [buckets, setBuckets] = useState(Array(16).fill(null).map(() => []))
  const [keyInput, setKeyInput] = useState('')
  const [valueInput, setValueInput] = useState('')
  const [highlightBucket, setHighlightBucket] = useState(null)
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [hashCalculation, setHashCalculation] = useState('')

  const hashFunction = (key) => {
    // Simple hash function for visualization
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i)
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash) % 16
  }

  const handlePut = () => {
    if (!keyInput || !valueInput) {
      setMessage('Please enter both key and value')
      return
    }

    const hash = hashFunction(keyInput)
    const newBuckets = buckets.map(bucket => [...bucket])

    // Find if key already exists in bucket
    const bucketIndex = newBuckets[hash].findIndex(([k, v]) => k === keyInput)

    if (bucketIndex !== -1) {
      // Update existing key
      const oldValue = newBuckets[hash][bucketIndex][1]
      newBuckets[hash][bucketIndex] = [keyInput, valueInput]
      setMessage(`Updated key "${keyInput}" from "${oldValue}" to "${valueInput}" - O(1) average!`)
    } else {
      // Add new key-value pair
      newBuckets[hash].push([keyInput, valueInput])
      setMessage(`Put "${keyInput}" → "${valueInput}" at bucket ${hash} - O(1) average!`)
    }

    setHashCalculation(`Hash("${keyInput}") = ${hash} (bucket index)`)
    setBuckets(newBuckets)
    setHighlightBucket(hash)
    setTimeout(() => setHighlightBucket(null), 1500)
  }

  const handleGet = () => {
    if (!keyInput) {
      setMessage('Please enter a key to search')
      return
    }

    const hash = hashFunction(keyInput)
    const bucket = buckets[hash]
    const entry = bucket.find(([k, v]) => k === keyInput)

    setHashCalculation(`Hash("${keyInput}") = ${hash} (searching bucket ${hash})`)
    setHighlightBucket(hash)

    if (entry) {
      setMessage(`Found: "${keyInput}" → "${entry[1]}" at bucket ${hash} - O(1) average!`)
    } else {
      setMessage(`Key "${keyInput}" not found (bucket ${hash} checked) - O(1) average!`)
    }

    setTimeout(() => setHighlightBucket(null), 2000)
  }

  const handleRemove = () => {
    if (!keyInput) {
      setMessage('Please enter a key to remove')
      return
    }

    const hash = hashFunction(keyInput)
    const newBuckets = buckets.map(bucket => [...bucket])
    const bucketIndex = newBuckets[hash].findIndex(([k, v]) => k === keyInput)

    setHashCalculation(`Hash("${keyInput}") = ${hash} (checking bucket ${hash})`)

    if (bucketIndex !== -1) {
      const removedValue = newBuckets[hash][bucketIndex][1]
      newBuckets[hash].splice(bucketIndex, 1)
      setBuckets(newBuckets)
      setMessage(`Removed "${keyInput}" → "${removedValue}" from bucket ${hash} - O(1) average!`)
      setHighlightBucket(hash)
      setTimeout(() => setHighlightBucket(null), 1500)
    } else {
      setMessage(`Key "${keyInput}" not found at bucket ${hash}`)
      setHighlightBucket(hash)
      setTimeout(() => setHighlightBucket(null), 1500)
    }
  }

  const handleClear = () => {
    setBuckets(Array(16).fill(null).map(() => []))
    setMessage('HashMap cleared - All entries removed')
    setHashCalculation('')
  }

  const complexityData = {
    operations: [
      {
        name: 'Put',
        time: 'O(1) avg',
        space: 'O(1)',
        description: 'Add/update key-value pair. Hash key to find bucket, add to chain. O(n) worst case if all collide!'
      },
      {
        name: 'Get',
        time: 'O(1) avg',
        space: 'O(1)',
        description: 'Retrieve value by key. Hash key to find bucket, search chain. O(n) worst case!'
      },
      {
        name: 'Remove',
        time: 'O(1) avg',
        space: 'O(1)',
        description: 'Delete key-value pair. Hash key to find bucket, remove from chain. O(n) worst case!'
      },
      {
        name: 'ContainsKey',
        time: 'O(1) avg',
        space: 'O(1)',
        description: 'Check if key exists. Same as get - hash and search bucket. O(n) worst case!'
      },
      {
        name: 'Size',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Get number of entries. Just return stored size variable - constant time!'
      },
      {
        name: 'Iteration',
        time: 'O(n + m)',
        space: 'O(1)',
        description: 'Iterate all entries. Must visit all buckets (m) and entries (n). Linear in total size!'
      },
    ]
  }

  const hashMapFromScratchCode = `// HashMap from Scratch with Separate Chaining
public class MyHashMap<K, V> {
    private static class Entry<K, V> {
        final K key;
        V value;
        Entry<K, V> next;  // For collision chaining
        final int hash;    // Cache hash to avoid recalculation

        Entry(int hash, K key, V value, Entry<K, V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }

    private Entry<K, V>[] buckets;  // Array of linked lists
    private int size;               // Number of entries
    private int capacity;           // Number of buckets
    private static final float LOAD_FACTOR = 0.75f;

    /**
     * WHY HASHING? O(1) lookup magic!
     *
     * Array: O(1) access by index, but can't use arbitrary keys
     * LinkedList: O(n) search
     * HashMap: O(1) average - Best of both worlds!
     *
     * How? Convert key to index via hash function:
     * key "John" → hash(John) → 42 → 42 % 16 = 10 → buckets[10]
     *
     * Collisions? Multiple keys hash to same index
     * Solution: Each bucket is a linked list (separate chaining)
     */

    @SuppressWarnings("unchecked")
    public MyHashMap() {
        this.capacity = 16;  // Initial capacity (power of 2!)
        this.buckets = new Entry[capacity];
        this.size = 0;
    }

    /**
     * Hash function: Convert key to bucket index
     *
     * Steps:
     * 1. Get hashCode() from key object
     * 2. Improve distribution (XOR with shifted version)
     * 3. Modulo capacity to get bucket index
     *
     * Why XOR? Spreads high bits to low bits
     * Example: hash = 0x12345678
     * hash >>> 16 = 0x00001234
     * XOR = 0x1234567C (better distribution!)
     */
    private int hash(Object key) {
        if (key == null) return 0;  // Null keys go to bucket 0

        int h = key.hashCode();
        // Improve distribution: XOR with right-shifted version
        h ^= (h >>> 16);
        return h;
    }

    /**
     * Get bucket index from hash
     * Use bitwise AND for speed when capacity is power of 2
     */
    private int indexFor(int hash) {
        // capacity - 1 gives us a mask of all 1s
        // Example: capacity=16 (0x10), mask=15 (0x0F)
        return hash & (capacity - 1);
    }

    /**
     * Put: Add or update key-value pair
     * WHY O(1) AVERAGE?
     *
     * Steps:
     * 1. Hash key to get bucket index: O(1)
     * 2. Search bucket chain: O(1) average (short chains!)
     * 3. Add or update entry: O(1)
     *
     * Average chain length = size / capacity = load factor
     * With load factor 0.75, average chain length < 1!
     * So search is effectively O(1)
     *
     * Resize when load factor exceeds 0.75 to maintain O(1)
     */
    public V put(K key, V value) {
        if (size >= capacity * LOAD_FACTOR) {
            resize();  // Keep load factor low!
        }

        int hash = hash(key);
        int index = indexFor(hash);

        // Search for existing key in chain
        for (Entry<K, V> e = buckets[index]; e != null; e = e.next) {
            if (e.hash == hash &&
                (e.key == key || (key != null && key.equals(e.key)))) {
                // Key exists - update value
                V oldValue = e.value;
                e.value = value;
                return oldValue;
            }
        }

        // Key doesn't exist - add new entry at front of chain
        Entry<K, V> newEntry = new Entry<>(hash, key, value, buckets[index]);
        buckets[index] = newEntry;
        size++;
        return null;
    }

    /**
     * Get: Retrieve value by key
     * WHY O(1) AVERAGE? Same as put!
     *
     * Steps:
     * 1. Hash key to get bucket: O(1)
     * 2. Search bucket chain: O(1) average
     * 3. Return value: O(1)
     */
    public V get(Object key) {
        int hash = hash(key);
        int index = indexFor(hash);

        // Search chain for matching key
        for (Entry<K, V> e = buckets[index]; e != null; e = e.next) {
            if (e.hash == hash &&
                (e.key == key || (key != null && key.equals(e.key)))) {
                return e.value;
            }
        }
        return null;  // Key not found
    }

    /**
     * Remove: Delete key-value pair
     * WHY O(1) AVERAGE? Hash and search chain!
     */
    public V remove(Object key) {
        int hash = hash(key);
        int index = indexFor(hash);

        Entry<K, V> prev = null;
        Entry<K, V> e = buckets[index];

        while (e != null) {
            if (e.hash == hash &&
                (e.key == key || (key != null && key.equals(e.key)))) {
                // Found it - unlink from chain
                if (prev == null) {
                    buckets[index] = e.next;  // Remove first in chain
                } else {
                    prev.next = e.next;  // Remove from middle/end
                }
                size--;
                return e.value;
            }
            prev = e;
            e = e.next;
        }
        return null;  // Key not found
    }

    /**
     * Resize: Double capacity when load factor exceeded
     *
     * WHY RESIZE? Keep chains short for O(1) operations!
     *
     * When load factor > 0.75:
     * - Chains get longer → O(n) worst case
     * - Solution: Double capacity, rehash all entries
     *
     * Amortized O(1) because resize is rare:
     * - Insert n elements: n puts + log(n) resizes
     * - Total work: O(n + n) = O(n)
     * - Per operation: O(n)/n = O(1) amortized!
     */
    @SuppressWarnings("unchecked")
    private void resize() {
        Entry<K, V>[] oldBuckets = buckets;
        capacity *= 2;  // Double capacity
        buckets = new Entry[capacity];
        size = 0;

        // Rehash all existing entries
        for (Entry<K, V> e : oldBuckets) {
            while (e != null) {
                put(e.key, e.value);  // Reinsert with new capacity
                e = e.next;
            }
        }
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * COLLISION RESOLUTION: Separate Chaining
     *
     * When multiple keys hash to same bucket:
     * bucket[5] → ["apple", 10] → ["banana", 20] → ["cherry", 30] → null
     *
     * Pros:
     * ✓ Simple implementation
     * ✓ Never "full" (can always add more)
     * ✓ Good for high load factors
     *
     * Cons:
     * ✗ Extra memory for next pointers
     * ✗ Cache unfriendly (linked list)
     * ✗ Slower than open addressing for low load
     *
     * Alternative: Open Addressing (Python dict uses this)
     * - No linked lists, store directly in array
     * - On collision, probe for next empty slot
     * - More cache friendly, but can get full
     */
}`

  const javaHashMapCode = `// Using Java's Built-in HashMap
import java.util.*;

public class HashMapExample {
    public static void main(String[] args) {
        /**
         * JAVA'S HASHMAP - Production Ready
         *
         * Implementation details:
         * - Initial capacity: 16 (power of 2)
         * - Load factor: 0.75 (resize at 75% full)
         * - Collision handling: Separate chaining (JDK 7)
         *                      → Treeification (JDK 8+)
         * - NOT thread-safe (use ConcurrentHashMap)
         */
        Map<String, Integer> map = new HashMap<>();

        // Put: Add or update key-value pair
        map.put("apple", 100);      // New entry
        map.put("banana", 200);
        map.put("cherry", 300);
        Integer old = map.put("apple", 150);  // Update: old = 100
        // Map: {apple=150, banana=200, cherry=300}

        // Get: Retrieve value by key
        Integer value = map.get("banana");     // 200
        Integer missing = map.get("durian");   // null (not found)
        Integer orDefault = map.getOrDefault("durian", 0);  // 0

        // ContainsKey/ContainsValue
        boolean hasKey = map.containsKey("apple");     // true - O(1)
        boolean hasValue = map.containsValue(200);     // true - O(n)!

        // Remove: Delete by key
        Integer removed = map.remove("cherry");  // 300
        // Map: {apple=150, banana=200}

        // Size and empty check
        int size = map.size();        // 2
        boolean empty = map.isEmpty(); // false

        // Clear: Remove all entries
        map.clear();  // Map: {}

        /* ============================================
         * ITERATION - Multiple Ways
         * ============================================ */
        map.put("x", 1);
        map.put("y", 2);
        map.put("z", 3);

        // 1. Iterate over keys
        for (String key : map.keySet()) {
            System.out.println(key + " = " + map.get(key));
        }

        // 2. Iterate over values
        for (Integer val : map.values()) {
            System.out.println(val);
        }

        // 3. Iterate over entries (BEST PERFORMANCE!)
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            String key = entry.getKey();
            Integer val = entry.getValue();
            System.out.println(key + " = " + val);
        }

        // 4. Java 8 forEach with lambda
        map.forEach((key, val) ->
            System.out.println(key + " = " + val)
        );

        /* ============================================
         * ADVANCED OPERATIONS (Java 8+)
         * ============================================ */

        // putIfAbsent: Only put if key doesn't exist
        map.putIfAbsent("x", 999);  // Ignored (x exists)
        map.putIfAbsent("w", 999);  // Added (w is new)

        // computeIfAbsent: Compute value if key absent
        map.computeIfAbsent("a", key -> key.length());  // a=1

        // computeIfPresent: Update if key exists
        map.computeIfPresent("x", (key, val) -> val * 10);  // x=10

        // compute: Always compute new value
        map.compute("y", (key, val) -> (val == null ? 0 : val) + 1);

        // merge: Combine old and new values
        map.merge("z", 5, (oldVal, newVal) -> oldVal + newVal);  // z=8

        // replace: Update if key exists
        map.replace("x", 100);       // Update x
        map.replace("x", 100, 200);  // Only if current value is 100

        /* ============================================
         * INITIAL CAPACITY & LOAD FACTOR
         * ============================================ */

        // Default: capacity=16, loadFactor=0.75
        Map<String, Integer> defaultMap = new HashMap<>();

        // Custom capacity (if you know size ahead)
        // Avoid resizing: capacity = expectedSize / loadFactor
        Map<String, Integer> bigMap = new HashMap<>(1000);

        // Custom load factor
        Map<String, Integer> customMap = new HashMap<>(16, 0.9f);
        // Higher load factor = less memory, more collisions
        // Lower load factor = more memory, fewer collisions

        /* ============================================
         * WHEN TO USE HASHMAP
         * ============================================ */

        // ✓ Need O(1) lookup by key
        // ✓ Key-value associations
        // ✓ Caching/memoization
        // ✓ Counting frequencies
        // ✓ Two Sum, Group Anagrams, etc.

        // ✗ Need sorted order (use TreeMap)
        // ✗ Thread-safe (use ConcurrentHashMap)
        // ✗ Order matters (use LinkedHashMap)
        // ✗ Memory constrained (TreeMap uses less)

        /* ============================================
         * HASHMAP vs HASHTABLE vs CONCURRENTHASHMAP
         * ============================================ */

        // HashMap:
        // ✓ Fast, O(1) operations
        // ✗ NOT thread-safe
        // ✓ Allows null key and values
        // ✓ Modern choice for single-threaded

        // Hashtable (legacy - avoid!):
        // ✓ Thread-safe (synchronized methods)
        // ✗ SLOW (locks entire table)
        // ✗ No null keys or values
        // ✗ Use ConcurrentHashMap instead!

        // ConcurrentHashMap:
        // ✓ Thread-safe with high concurrency
        // ✓ Lock-free reads, fine-grained locks for writes
        // ✓ Much faster than Hashtable
        // ✗ No null keys or values
        // ✓ Production choice for multi-threaded

        /* ============================================
         * COMMON PATTERNS
         * ============================================ */

        // Pattern 1: Frequency counting
        Map<Character, Integer> freq = new HashMap<>();
        String text = "hello";
        for (char c : text.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }
        // Result: {h=1, e=1, l=2, o=1}

        // Pattern 2: Grouping
        Map<String, List<String>> groups = new HashMap<>();
        String[] words = {"eat", "tea", "tan", "ate", "nat", "bat"};
        for (String word : words) {
            char[] chars = word.toCharArray();
            Arrays.sort(chars);
            String key = String.valueOf(chars);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
        }
        // Result: {aet=[eat,tea,ate], ant=[tan,nat], abt=[bat]}

        // Pattern 3: Caching/Memoization
        Map<Integer, Integer> fibCache = new HashMap<>();
        int fib(int n) {
            if (n <= 1) return n;
            if (fibCache.containsKey(n)) return fibCache.get(n);

            int result = fib(n - 1) + fib(n - 2);
            fibCache.put(n, result);
            return result;
        }
    }
}`

  const totalEntries = buckets.reduce((sum, bucket) => sum + bucket.length, 0)
  const loadFactor = (totalEntries / buckets.length).toFixed(2)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">HashMap - Deep Dive</h1>
        <button
          onClick={() => setShowLearningMode(!showLearningMode)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            showLearningMode
              ? 'bg-pink-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showLearningMode ? '✓ Learning Mode ON' : 'Enable Learning Mode'}
        </button>
      </div>

      {/* Learning Path Progress Indicator */}
      <div className="mb-8 bg-gradient-to-r from-blue-100 via-green-100 via-purple-100 to-slate-100 rounded-lg shadow-md p-6 border-2 border-blue-300">
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is a HashMap?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            A <strong>HashMap</strong> is a data structure that stores <strong>key-value pairs</strong> and provides <strong>O(1) average-case</strong> lookup, insertion, and deletion.
            It uses a <strong>hash function</strong> to convert keys into array indices, enabling incredibly fast access to values by their keys!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-pink-700 mb-3">📊 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-pink-600 font-bold mr-2">✓</span>
                <span><strong>Hash Function:</strong> Converts keys to array indices - the magic behind O(1) lookup!</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 font-bold mr-2">✓</span>
                <span><strong>Buckets:</strong> Array where each slot can hold multiple entries (collision handling).</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 font-bold mr-2">✓</span>
                <span><strong>Load Factor:</strong> Ratio of entries to buckets (0.75 in Java). Triggers resize when exceeded.</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 font-bold mr-2">✓</span>
                <span><strong>Collision Handling:</strong> Separate chaining (linked lists) or open addressing (probing).</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 font-bold mr-2">✓</span>
                <span><strong>Dynamic Resizing:</strong> Doubles capacity when load factor exceeded to maintain O(1).</span>
              </li>
            </ul>
          </div>

          <div className="bg-pink-100 rounded-lg p-5">
            <h4 className="font-bold text-pink-900 mb-3">🔑 How Hashing Works</h4>
            <div className="bg-white rounded p-4 font-mono text-sm">
              <p className="mb-2">Step 1: Convert key to hash code</p>
              <p className="ml-4 text-gray-600">hash("John") → 2179234 (via hashCode())</p>

              <p className="mt-3 mb-2">Step 2: Map hash to bucket index</p>
              <p className="ml-4 text-gray-600">2179234 % 16 = 10 (modulo by number of buckets)</p>

              <p className="mt-3 mb-2">Step 3: Store in bucket</p>
              <p className="ml-4 text-gray-600">buckets[10] → ["John", "Engineer"] stored here!</p>

              <p className="mt-4 text-pink-700 font-bold">Result: O(1) lookup - jump directly to bucket 10!</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-pink-50 rounded-lg p-5 border-l-4 border-pink-500">
              <h4 className="font-bold text-pink-800 mb-2">✓ When to Use HashMap</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need O(1) lookup by key</li>
                <li>• Caching/memoization (LRU cache)</li>
                <li>• Counting frequencies (word count)</li>
                <li>• Grouping data (anagrams, etc.)</li>
                <li>• Two Sum, subarray sum problems</li>
                <li>• Database indexing concepts</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use HashMap</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need sorted order (use TreeMap)</li>
                <li>• Need insertion order (use LinkedHashMap)</li>
                <li>• Memory extremely limited (overhead ~32 bytes/entry)</li>
                <li>• Keys don't have good hash function</li>
                <li>• Need range queries (use TreeMap)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Phone Directory:</strong>
                <p className="text-gray-600 mt-1">Name → Phone number lookup in O(1) time</p>
              </div>
              <div>
                <strong className="text-gray-800">Cache:</strong>
                <p className="text-gray-600 mt-1">URL → Cached page content for instant retrieval</p>
              </div>
              <div>
                <strong className="text-gray-800">Database Index:</strong>
                <p className="text-gray-600 mt-1">Primary key → Row location for fast queries</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">🎯 Core Operations</h4>
            <div className="space-y-2 text-sm">
              <p><code className="bg-white px-2 py-1 rounded font-mono">put(key, value)</code> - Add/update key-value pair - O(1) average</p>
              <p><code className="bg-white px-2 py-1 rounded font-mono">get(key)</code> - Retrieve value by key - O(1) average</p>
              <p><code className="bg-white px-2 py-1 rounded font-mono">remove(key)</code> - Delete key-value pair - O(1) average</p>
              <p><code className="bg-white px-2 py-1 rounded font-mono">containsKey(key)</code> - Check if key exists - O(1) average</p>
              <p><code className="bg-white px-2 py-1 rounded font-mono">size()</code> - Get number of entries - O(1)</p>
            </div>
          </div>

          <div className="bg-rose-100 rounded-lg p-5 border-l-4 border-rose-500">
            <h4 className="font-bold text-rose-900 mb-2">⚡ Collisions: The Challenge</h4>
            <p className="text-sm text-gray-700 mb-3">
              When different keys hash to the same bucket index, we have a <strong>collision</strong>. Example:
            </p>
            <div className="bg-white rounded p-3 font-mono text-xs">
              <p>hash("John") % 16 = 5</p>
              <p>hash("Jane") % 16 = 5  ← Collision!</p>
              <p className="mt-2 text-rose-700">Both keys want bucket 5!</p>
            </div>
            <p className="text-sm text-gray-700 mt-3">
              <strong>Solutions:</strong> (1) Separate Chaining - linked list at each bucket, or
              (2) Open Addressing - probe for next empty bucket. Java uses separate chaining (and trees for long chains in Java 8+).
            </p>
          </div>
        </div>
      </div>

      {showLearningMode && (
        <div className="bg-pink-50 border-2 border-pink-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="text-3xl mr-3">🎓</div>
            <div>
              <div className="font-bold text-pink-800 text-lg mb-1">
                Learning Mode Active!
              </div>
              <div className="text-pink-700">
                Try Put, Get, and Remove operations to see how hashing works.
                Watch how keys are converted to bucket indices and how collisions are handled with separate chaining!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive HashMap Visualization</h2>
        </div>

        {/* Hash Calculation Display */}
        {hashCalculation && (
          <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
            <p className="font-mono text-sm font-bold text-gray-800">{hashCalculation}</p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="bg-pink-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-pink-700">{totalEntries}</div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </div>
          <div className="bg-rose-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-rose-700">{buckets.length}</div>
            <div className="text-sm text-gray-600">Buckets</div>
          </div>
          <div className="bg-purple-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-700">{loadFactor}</div>
            <div className="text-sm text-gray-600">Load Factor</div>
          </div>
        </div>

        {/* Buckets Display */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <h3 className="font-bold text-gray-700 mb-3">HashMap Buckets (Array of 16)</h3>
          <div className="grid grid-cols-4 gap-2">
            {buckets.map((bucket, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-2 min-h-[60px] transition-all duration-300 ${
                  highlightBucket === index
                    ? 'bg-yellow-200 border-yellow-500 shadow-xl scale-105'
                    : 'bg-white border-pink-300'
                }`}
              >
                <div className="text-xs font-bold text-gray-500 mb-1">Bucket {index}</div>
                {bucket.length === 0 ? (
                  <div className="text-xs text-gray-400 italic">empty</div>
                ) : (
                  <div className="space-y-1">
                    {bucket.map(([key, value], entryIndex) => (
                      <div key={entryIndex} className="text-xs bg-pink-100 rounded px-1 py-0.5 border border-pink-300">
                        <span className="font-mono font-bold text-pink-700">{key}</span>
                        <span className="text-gray-500">→</span>
                        <span className="font-mono text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-600 mt-3 bg-pink-50 p-2 rounded">
            <strong>Collision Handling:</strong> Multiple entries in same bucket are stored as a chain (separate chaining).
            Java 8+ converts chains to trees when they get too long (8+ entries) for better performance!
          </div>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
              placeholder="Enter key (e.g., 'apple')"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value (for Put operation)
            </label>
            <input
              type="text"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
              placeholder="Enter value (e.g., '100')"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handlePut}
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Put - Add/update key-value - O(1) avg"
          >
            Put (Add/Update) → O(1) avg ⚡
          </button>
          <button
            onClick={handleGet}
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Get - Retrieve value by key - O(1) avg"
          >
            Get (Retrieve) → O(1) avg ⚡
          </button>
          <button
            onClick={handleRemove}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Remove - Delete key - O(1) avg"
          >
            Remove (Delete) → O(1) avg ⚡
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Clear all entries"
          >
            Clear HashMap
          </button>
        </div>

        {message && (
          <div className="bg-pink-50 border-l-4 border-pink-500 text-pink-700 px-4 py-3 rounded">
            <strong>Result:</strong> {message}
          </div>
        )}
      </div>

      <ComplexityInfo data={complexityData} />

      {/* Java HashMap Implementations */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Java HashMap Implementations - Complete Guide
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Java provides HashMap (fast, unsorted), LinkedHashMap (insertion order), TreeMap (sorted),
          and ConcurrentHashMap (thread-safe) for different use cases.
        </p>
        <JavaHashMapImplementations />
      </div>

      {/* STEP 3: Code Implementation Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-purple-500">
        <div className="flex items-center mb-6">
          <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">3</div>
          <h2 className="text-3xl font-bold text-gray-800">Code: Implementation Details</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <CodeDisplay
            title="HashMap from Scratch (separate chaining)"
            code={hashMapFromScratchCode}
            language="java"
          />
          <CodeDisplay
            title="Using Java's HashMap (production ready)"
            code={javaHashMapCode}
            language="java"
          />
        </div>
      </div>

      {/* Quick Comparison */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-orange-600 mb-4">💡 HashMap vs TreeMap vs LinkedHashMap</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white">
                <th className="p-3 text-left">Aspect</th>
                <th className="p-3 text-center">HashMap</th>
                <th className="p-3 text-center">TreeMap</th>
                <th className="p-3 text-center">LinkedHashMap</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Ordering</td>
                <td className="p-3 text-center">No order</td>
                <td className="p-3 text-center text-green-600 font-bold">Sorted by key</td>
                <td className="p-3 text-center text-blue-600 font-bold">Insertion order</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-semibold">Get/Put Time</td>
                <td className="p-3 text-center text-pink-600 font-bold">O(1) avg</td>
                <td className="p-3 text-center">O(log n)</td>
                <td className="p-3 text-center text-pink-600 font-bold">O(1) avg</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Implementation</td>
                <td className="p-3 text-center">Hash table</td>
                <td className="p-3 text-center">Red-Black tree</td>
                <td className="p-3 text-center">Hash table + linked list</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-semibold">Null Keys</td>
                <td className="p-3 text-center">✓ Allowed</td>
                <td className="p-3 text-center">✗ Not allowed</td>
                <td className="p-3 text-center">✓ Allowed</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Use Case</td>
                <td className="p-3 text-center">General purpose</td>
                <td className="p-3 text-center">Need sorting/range</td>
                <td className="p-3 text-center">LRU cache, order matters</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 4: Advanced Section */}
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
                <li>Then return here for deep dives into hash functions, Java 8 treeification, concurrency, and interview problems</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Hash Function Deep Dive */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🔢 Hash Functions: The Magic Behind O(1)</h3>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">What Makes a Good Hash Function?</h4>
              <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`// GOOD hash function properties:
// 1. Deterministic - same input always gives same hash
// 2. Uniform distribution - spread keys evenly across buckets
// 3. Fast to compute - O(1) or O(k) where k = key length
// 4. Minimizes collisions

// Java's String hashCode() - EXCELLENT example
public int hashCode() {
    int h = 0;
    for (int i = 0; i < length(); i++) {
        h = 31 * h + charAt(i);  // Polynomial rolling hash
    }
    return h;
}

// Why multiply by 31?
// 1. Prime number → better distribution
// 2. 31 * h = (h << 5) - h → Fast bitwise optimization!
// 3. Empirically tested - fewer collisions than other primes

// Example: hash("cat")
h = 0
h = 31 * 0 + 'c' = 99
h = 31 * 99 + 'a' = 3166
h = 31 * 3166 + 't' = 98262

// HashMap then improves distribution further:
static int hash(Object key) {
    int h = key.hashCode();
    h ^= (h >>> 16);  // XOR with shifted version
    return h;
}

// Why XOR with shifted version?
// Spreads high bits to low bits for better distribution
// Example: h = 0x12345678
// h >>> 16 = 0x00001234
// h ^ (h >>> 16) = 0x1234444C ← More entropy in lower bits!

// Final bucket index (power of 2 capacity):
index = hash & (capacity - 1)  // Fast! Equivalent to hash % capacity
// Example: hash=42, capacity=16
// 42 & 15 = 10 → bucket 10`}
              </pre>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <h4 className="font-semibold text-green-900 mb-2">Common Hash Function Mistakes</h4>
              <pre className="bg-white border p-3 rounded text-xs">
{`// ❌ BAD: Only uses first character
int badHash(String s) {
    return s.charAt(0);  // "apple" and "apricot" collide!
}

// ❌ BAD: Sum of characters (anagrams collide!)
int badHash2(String s) {
    int sum = 0;
    for (char c : s.toCharArray()) sum += c;
    return sum;  // "listen" and "silent" have same hash!
}

// ❌ BAD: Not considering all data
class Point {
    int x, y;
    public int hashCode() {
        return x;  // Ignores y! Many collisions
    }
}

// ✓ GOOD: Use Objects.hash() for multiple fields
class Point {
    int x, y;
    public int hashCode() {
        return Objects.hash(x, y);  // Combines both fields properly
    }
}

// ✓ GOOD: Custom implementation with prime multiplication
class Point {
    int x, y;
    public int hashCode() {
        int result = 17;  // Start with prime
        result = 31 * result + x;  // Multiply by prime, add field
        result = 31 * result + y;
        return result;
    }
}`}
              </pre>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">hashCode() Contract</h4>
                <pre className="bg-white border p-3 rounded text-xs">
{`// CRITICAL: If you override equals(),
// you MUST override hashCode()!

class User {
    String name;
    int age;

    // If a.equals(b) is true,
    // then a.hashCode() MUST equal b.hashCode()
    @Override
    public boolean equals(Object o) {
        if (!(o instanceof User)) return false;
        User u = (User) o;
        return name.equals(u.name) && age == u.age;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}

// What happens if you break this?
User u1 = new User("Alice", 25);
User u2 = new User("Alice", 25);

// Correct behavior:
u1.equals(u2);  // true
u1.hashCode() == u2.hashCode();  // true ✓

map.put(u1, "data");
map.get(u2);  // Returns "data" ✓

// If hashCode() broken:
// u1 and u2 hash to different buckets!
// map.get(u2) returns null even though
// u1.equals(u2) is true! ❌`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Hash Distribution Analysis</h4>
                <pre className="bg-white border p-3 rounded text-xs">
{`// Analyze hash distribution quality
void analyzeDistribution(String[] keys, int buckets) {
    int[] counts = new int[buckets];

    for (String key : keys) {
        int hash = hash(key);
        int index = hash & (buckets - 1);
        counts[index]++;
    }

    // Ideal: Each bucket has ~keys.length/buckets
    double expected = (double) keys.length / buckets;
    double variance = 0;

    for (int count : counts) {
        double diff = count - expected;
        variance += diff * diff;
    }
    variance /= buckets;

    System.out.println("Expected: " + expected);
    System.out.println("Variance: " + variance);

    // Low variance = good distribution!
    // High variance = many collisions
}

// Example results:
// Good hash (String.hashCode):
// Expected: 62.5, Variance: 12.3
// Collisions spread evenly

// Bad hash (first char only):
// Expected: 62.5, Variance: 1834.2
// Huge variance! Many collisions`}
                </pre>
              </div>
            </div>
          </div>

          {/* Java 8 Treeification */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🌳 Java 8 Optimization: Treeification</h3>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
              <h4 className="font-semibold text-purple-900 mb-2">From Linked List to Red-Black Tree</h4>
              <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Java 7: All buckets use linked lists
bucket[5]: Entry → Entry → Entry → Entry → Entry → Entry → Entry → Entry
           O(8) to search! 😞

// Java 8: Converts to tree when chain length ≥ 8
bucket[5]: TreeNode (Red-Black Tree)
           O(log n) to search! 😃

// Why the change?
// Hash DoS attack: Attacker sends keys that all hash to same bucket
// Before: O(n) search → server slows down with just 10,000 requests
// After: O(log n) even in worst case → attack mitigated!

// Treeification threshold
static final int TREEIFY_THRESHOLD = 8;  // Convert to tree
static final int UNTREEIFY_THRESHOLD = 6; // Convert back to list

// Code path in HashMap.put():
if (binCount >= TREEIFY_THRESHOLD - 1) {
    treeifyBin(tab, hash);  // Convert linked list to tree!
}

// TreeNode structure
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
    TreeNode<K,V> parent;
    TreeNode<K,V> left;
    TreeNode<K,V> right;
    TreeNode<K,V> prev;  // For iteration (doubly-linked)
    boolean red;         // Red-Black tree color
}

// Performance impact:
// Bucket with 100 entries:
// Java 7: O(100) search ← SLOW!
// Java 8: O(log 100) = O(7) search ← FAST!

// Real-world: Protects against:
// 1. Hash collision attacks (security)
// 2. Poor hash functions (robustness)
// 3. Hash table degradation over time

// Trade-off: Slight overhead for tree structure
// But massive improvement in worst case!`}
              </pre>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Treeification Requirements</h4>
              <pre className="bg-white p-3 rounded text-xs">
{`// Not all HashMaps can treeify!
// Requirements:
// 1. Bin length ≥ 8 (TREEIFY_THRESHOLD)
// 2. Total capacity ≥ 64 (MIN_TREEIFY_CAPACITY)

static final int MIN_TREEIFY_CAPACITY = 64;

// If capacity < 64, resize instead of treeify
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
        resize();  // Resize instead! Spreads entries across more buckets
    else if ((e = tab[index = (n - 1) & hash]) != null) {
        // Convert bin to tree...
    }
}

// Why 64? Small tables should resize, not treeify
// Example: capacity=8, 7 entries in bucket 0
// Better to resize to 16 (spreads entries) than build tree

// Untreeification: Convert back to list when shrinking
// Happens during resize when tree gets too small (≤ 6 entries)
if (loHead != null) {
    if (lc <= UNTREEIFY_THRESHOLD)
        tab[index] = loHead.untreeify(map);  // Back to list!
    else
        tab[index] = new TreeNode<>(loHead);
}

// Benefits of this design:
// ✓ Small maps stay simple (no tree overhead)
// ✓ Large maps with collisions stay fast (tree search)
// ✓ Dynamic adaptation based on load`}
              </pre>
            </div>
          </div>

          {/* Collision Resolution Strategies */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">💥 Collision Resolution: Deep Comparison</h3>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-900 mb-2">Strategy 1: Separate Chaining (Java HashMap)</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Each bucket is a linked list (or tree in Java 8+)
buckets[5]: ["apple", 10] → ["banana", 20] → ["cherry", 30] → null

// Pros:
// ✓ Simple to implement
// ✓ Never "full" - can always add more
// ✓ Good cache locality for small chains
// ✓ Handles high load factors well (0.75+)

// Cons:
// ✗ Extra memory for pointers (8 bytes per entry)
// ✗ Cache unfriendly for long chains
// ✗ Iteration requires following pointers

// Memory per entry:
// - Key reference: 8 bytes
// - Value reference: 8 bytes
// - Hash: 4 bytes
// - Next pointer: 8 bytes
// Total: 28 bytes + key/value objects

// Performance:
// Best case (no collisions): O(1)
// Average case (load factor 0.75): O(1)
// Worst case (all collide): O(n) or O(log n) with trees`}
                </pre>
              </div>

              <div className="bg-yellow-50 p-4 rounded">
                <h4 className="font-semibold text-yellow-900 mb-2">Strategy 2: Open Addressing / Linear Probing (Python dict)</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Store directly in array, probe for next slot on collision
buckets: [null, ["x",1], ["y",2], null, ["z",3], ["a",4], null, ...]
                                           ↑
                                    hash("z")=3, but occupied!
                                    Probe: 3→4 (found empty slot)

// Linear probing: Try index, index+1, index+2, ...
int probe(int hash, int attempt) {
    return (hash + attempt) % capacity;
}

// Put operation:
void put(K key, V value) {
    int hash = hash(key);
    for (int i = 0; i < capacity; i++) {
        int index = (hash + i) % capacity;
        if (buckets[index] == null || buckets[index].key.equals(key)) {
            buckets[index] = new Entry(key, value);
            return;
        }
    }
    // Table full! Need to resize
}

// Pros:
// ✓ Better cache locality (contiguous memory)
// ✓ No pointer overhead
// ✓ Faster for small load factors (< 0.7)
// ✓ Better for iteration (just scan array)

// Cons:
// ✗ Clustering problem (entries cluster together)
// ✗ Must maintain low load factor (< 0.7)
// ✗ Deletion is complex (need tombstones)
// ✗ Can become "full" (need resize more often)

// Clustering example:
// Items hash to 5: [_, _, _, _, _, X, X, X, X, X, _, _]
// Next item hashing to 5-9 has to probe many slots!`}
                </pre>
              </div>

              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">Strategy 3: Quadratic Probing</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Probe with quadratic sequence: 1, 4, 9, 16, 25...
int probe(int hash, int attempt) {
    return (hash + attempt * attempt) % capacity;
}

// Reduces clustering compared to linear probing
// hash("x") = 5, collision:
// Try: 5, 5+1=6, 5+4=9, 5+9=14, 5+16=21, ...
// Spreads out more than linear: 5, 6, 7, 8, 9...

// Pros:
// ✓ Less clustering than linear probing
// ✓ Still cache friendly

// Cons:
// ✗ May not probe all slots (requires capacity = power of 2)
// ✗ More complex than linear probing`}
                </pre>
              </div>

              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-semibold text-purple-900 mb-2">Strategy 4: Double Hashing</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Use second hash function for probe step
int hash1(K key) { return key.hashCode() % capacity; }
int hash2(K key) { return 1 + (key.hashCode() % (capacity - 1)); }

int probe(K key, int attempt) {
    return (hash1(key) + attempt * hash2(key)) % capacity;
}

// Example: hash1("x")=5, hash2("x")=3
// Probe: 5, 5+3=8, 8+3=11, 11+3=14, ...
// Different keys use different probe sequences!

// Pros:
// ✓ Minimal clustering (best among open addressing)
// ✓ More uniform distribution

// Cons:
// ✗ Two hash computations
// ✗ More complex`}
                </pre>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 p-4 rounded">
              <h4 className="font-semibold text-slate-800 mb-2">Performance Comparison (1M operations)</h4>
              <pre className="bg-white p-3 rounded text-xs">
{`Load Factor: 0.75
Keys: Random strings
Operations: 50% put, 50% get

Separate Chaining (Java HashMap):
Insert:  1.2M ops/sec
Lookup:  2.8M ops/sec
Memory:  89 MB (28 bytes/entry + overhead)

Linear Probing (Python dict):
Insert:  1.8M ops/sec  ← Faster!
Lookup:  4.1M ops/sec  ← Much faster!
Memory:  56 MB (less overhead)

Why Python dict is faster?
✓ Better cache locality (contiguous array)
✓ No pointer chasing
✓ Modern CPUs love sequential access

Why Java uses separate chaining?
✓ Handles high load factors better
✓ Simpler deletion (just unlink)
✓ Java 8 treeification guards worst case
✓ Works well with objects (not primitives)`}
              </pre>
            </div>
          </div>

          {/* ConcurrentHashMap */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🔒 ConcurrentHashMap: Thread-Safe HashMap</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">Why Not Just Synchronize HashMap?</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Option 1: Collections.synchronizedMap (BAD!)
Map<K, V> map = Collections.synchronizedMap(new HashMap<>());

// Every operation locks THE ENTIRE MAP:
public synchronized V get(Object key) {
    return map.get(key);  // Blocks all other threads!
}

// 10 threads trying to read simultaneously:
// Thread 1: Reading... (holds lock)
// Thread 2-10: 😴 Waiting... waiting... waiting...

// Throughput: ~1M ops/sec (single-threaded performance!)

// Option 2: ConcurrentHashMap (GOOD!)
Map<K, V> map = new ConcurrentHashMap<>();

// Fine-grained locking: Lock only specific buckets!
// 10 threads reading different buckets:
// Thread 1: Reading bucket 5 ✓
// Thread 2: Reading bucket 8 ✓
// Thread 3: Reading bucket 2 ✓
// All proceed in parallel!

// Throughput: ~25M ops/sec (actual parallelism!) ⚡

// Java 7: Segment-based locking (16 segments)
// Java 8: CAS-based + synchronized blocks (even better!)`}
                </pre>
              </div>

              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-900 mb-2">ConcurrentHashMap Internals (Java 8+)</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Lock-free reads, fine-grained writes
class ConcurrentHashMap<K, V> {
    transient volatile Node<K,V>[] table;  // Volatile for visibility!

    static class Node<K,V> {
        final int hash;
        final K key;
        volatile V val;        // Volatile!
        volatile Node<K,V> next;  // Volatile!
    }
}

// GET: Completely lock-free! 🚀
public V get(Object key) {
    Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
    int h = spread(key.hashCode());

    if ((tab = table) != null && (n = tab.length) > 0 &&
        (e = tabAt(tab, (n - 1) & h)) != null) {  // Volatile read!

        // Check first node
        if ((eh = e.hash) == h) {
            if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                return e.val;
        }
        // Traverse chain (no locks!)
        else if (eh < 0)
            return (p = e.find(h, key)) != null ? p.val : null;

        // Search rest of chain
        while ((e = e.next) != null) {
            if (e.hash == h &&
                ((ek = e.key) == key || (ek != null && key.equals(ek))))
                return e.val;
        }
    }
    return null;
}

// PUT: CAS for empty bucket, synchronized for collision
public V put(K key, V value) {
    return putVal(key, value, false);
}

final V putVal(K key, V value, boolean onlyIfAbsent) {
    int hash = spread(key.hashCode());

    for (Node<K,V>[] tab = table;;) {
        Node<K,V> f; int n, i, fh;

        if (tab == null || (n = tab.length) == 0)
            tab = initTable();  // CAS-based initialization

        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            // Bucket empty - try CAS to insert
            if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value, null)))
                break;  // Success! No locking needed!
        }

        else {
            // Bucket occupied - lock THIS bucket only
            synchronized (f) {  // Lock only this bucket's head!
                // Insert or update in chain...
            }
        }
    }
}

// Key optimizations:
// 1. Volatile reads → No locks for gets!
// 2. CAS for empty buckets → No locks for new entries!
// 3. synchronized(f) → Lock only specific bucket
// 4. Different buckets → True parallelism!

// Performance (16 threads):
Operation        Throughput
GET (0% writes)  280M ops/sec  ← Nearly linear scaling!
PUT (100% writes) 12M ops/sec  ← Limited by writes
Mixed (50/50)     45M ops/sec  ← Great balance

// Compare to Collections.synchronizedMap:
// GET: 1.2M ops/sec (233x slower!)
// PUT: 0.8M ops/sec (15x slower!)`}
                </pre>
              </div>

              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-semibold text-purple-900 mb-2">Advanced ConcurrentHashMap Operations</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Atomic operations without external synchronization
ConcurrentHashMap<String, Long> map = new ConcurrentHashMap<>();

// computeIfAbsent: Thread-safe lazy initialization
map.computeIfAbsent("key", k -> expensiveComputation(k));
// Multiple threads calling this will compute only once!

// Thread 1: Starts computing...
// Thread 2: Waits for Thread 1's result
// Thread 3: Waits for Thread 1's result
// Result: Only computed once, shared by all!

// merge: Atomic update
map.merge("counter", 1L, Long::sum);  // Atomic increment!
// Equivalent to: map.put("counter", map.getOrDefault("counter", 0L) + 1L)
// But thread-safe without extra locks!

// Bulk operations (parallel!)
map.forEach(1, (k, v) -> process(k, v));  // Parallel forEach
map.search(1, (k, v) -> v > 100 ? k : null);  // Parallel search
map.reduce(1, (k, v) -> v, Long::sum);  // Parallel reduce

// Parameter 1: Parallelism threshold
// If size < threshold, sequential
// If size >= threshold, parallel (ForkJoin)

// Real-world patterns:

// Pattern 1: Request counting
ConcurrentHashMap<String, LongAdder> counters = new ConcurrentHashMap<>();
void recordRequest(String endpoint) {
    counters.computeIfAbsent(endpoint, k -> new LongAdder()).increment();
    // LongAdder is even faster than AtomicLong for high contention!
}

// Pattern 2: Cache with size limit
ConcurrentHashMap<String, Data> cache = new ConcurrentHashMap<>();
void put(String key, Data value) {
    if (cache.size() > MAX_SIZE) {
        // Evict random entry (or implement LRU)
        cache.keySet().stream().findAny().ifPresent(cache::remove);
    }
    cache.put(key, value);
}

// Pattern 3: Distributed counter
LongAdder totalRequests = new LongAdder();
map.forEach(1, (k, v) -> totalRequests.add(v.sum()));

// Why ConcurrentHashMap is production-ready:
// ✓ Lock-free reads (scales with cores)
// ✓ Fine-grained locks (minimal contention)
// ✓ Bulk operations (parallel processing)
// ✓ Atomic helpers (computeIfAbsent, merge)
// ✓ No size limit (unlike ArrayBlockingQueue)`}
                </pre>
              </div>
            </div>
          </div>

          {/* Production Patterns */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🏭 Production Patterns with HashMap</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">Pattern 1: Caching (Memoization)</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Cache expensive computations
class FibonacciCalculator {
    private Map<Integer, Long> cache = new HashMap<>();

    public long fib(int n) {
        if (n <= 1) return n;

        // Check cache first - O(1)!
        if (cache.containsKey(n)) {
            return cache.get(n);
        }

        // Compute and cache
        long result = fib(n - 1) + fib(n - 2);
        cache.put(n, result);
        return result;
    }
}

// Without cache: fib(40) = 1.5 seconds
// With cache: fib(40) = 0.001 seconds (1500x faster!)

// Thread-safe version:
class ThreadSafeFib {
    private ConcurrentHashMap<Integer, Long> cache = new ConcurrentHashMap<>();

    public long fib(int n) {
        if (n <= 1) return n;
        return cache.computeIfAbsent(n, k -> fib(k-1) + fib(k-2));
        // Atomic! Multiple threads won't compute same value
    }
}`}
                </pre>
              </div>

              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-900 mb-2">Pattern 2: Frequency Counting</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Count word frequencies in text
Map<String, Integer> countWords(String[] words) {
    Map<String, Integer> freq = new HashMap<>();

    for (String word : words) {
        freq.put(word, freq.getOrDefault(word, 0) + 1);
    }

    return freq;
}

// Java 8 merge() - cleaner:
Map<String, Integer> countWords2(String[] words) {
    Map<String, Integer> freq = new HashMap<>();

    for (String word : words) {
        freq.merge(word, 1, Integer::sum);  // Atomic increment!
    }

    return freq;
}

// Find top K frequent:
List<String> topK(Map<String, Integer> freq, int k) {
    PriorityQueue<Map.Entry<String, Integer>> heap =
        new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());

    for (Map.Entry<String, Integer> entry : freq.entrySet()) {
        heap.offer(entry);
        if (heap.size() > k) heap.poll();
    }

    return heap.stream().map(Map.Entry::getKey).collect(Collectors.toList());
}

// Real-world: Analytics, log processing, recommendation systems`}
                </pre>
              </div>

              <div className="bg-yellow-50 p-4 rounded">
                <h4 className="font-semibold text-yellow-900 mb-2">Pattern 3: Grouping / Index Building</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// Group items by property
class Student {
    String name;
    String major;
    double gpa;
}

// Group students by major
Map<String, List<Student>> groupByMajor(List<Student> students) {
    Map<String, List<Student>> groups = new HashMap<>();

    for (Student s : students) {
        groups.computeIfAbsent(s.major, k -> new ArrayList<>()).add(s);
    }

    return groups;
}

// Java 8 Streams - even cleaner:
Map<String, List<Student>> groupByMajor2(List<Student> students) {
    return students.stream()
        .collect(Collectors.groupingBy(s -> s.major));
}

// Multi-level grouping:
Map<String, Map<String, List<Student>>> groupByMajorAndGpa(List<Student> students) {
    return students.stream()
        .collect(Collectors.groupingBy(
            s -> s.major,
            Collectors.groupingBy(s -> s.gpa >= 3.5 ? "High" : "Low")
        ));
}

// Real-world: Data aggregation, reporting, ETL pipelines`}
                </pre>
              </div>

              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-semibold text-purple-900 mb-2">Pattern 4: LRU Cache (LinkedHashMap)</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Least Recently Used cache with size limit
class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        // true = access-order (not insertion-order)
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;  // Auto-evict when full!
    }
}

// Usage:
LRUCache<String, String> cache = new LRUCache<>(3);
cache.put("a", "1");  // [a=1]
cache.put("b", "2");  // [a=1, b=2]
cache.put("c", "3");  // [a=1, b=2, c=3]
cache.get("a");       // [b=2, c=3, a=1] - 'a' moved to end!
cache.put("d", "4");  // [c=3, a=1, d=4] - 'b' evicted!

// Thread-safe version:
Map<K, V> cache = Collections.synchronizedMap(new LRUCache<>(100));

// Production: Use Caffeine or Guava Cache
// They handle concurrency, expiration, loading, stats, etc.
Cache<String, Data> cache = Caffeine.newBuilder()
    .maximumSize(10_000)
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .build();`}
                </pre>
              </div>
            </div>
          </div>

          {/* Interview Problems */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🎯 Interview-Level HashMap Problems</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 1: Two Sum (HashMap Classic)</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Find two numbers that add up to target
// Input: nums = [2, 7, 11, 15], target = 9
// Output: [0, 1] (nums[0] + nums[1] = 2 + 7 = 9)

// Brute force: O(n²) - try all pairs
int[] twoSumBrute(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[]{i, j};
            }
        }
    }
    return null;
}

// HashMap: O(n) - one pass! ⚡
int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();  // value → index

    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];

        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }

        map.put(nums[i], i);
    }

    return null;
}

// Example trace:
// nums = [2, 7, 11, 15], target = 9
// i=0: complement = 9-2 = 7, map={}, add 2→0, map={2→0}
// i=1: complement = 9-7 = 2, map has 2! Return [0, 1] ✓

// Time: O(n) - single pass
// Space: O(n) - hash map storage

// Key insight: Store what we've SEEN, check for COMPLEMENT
// This is the HashMap pattern for sum problems!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 2: Group Anagrams</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Group words that are anagrams
// Input: ["eat", "tea", "tan", "ate", "nat", "bat"]
// Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]

List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();

    for (String s : strs) {
        // Sort characters to get key
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = String.valueOf(chars);

        // Group by sorted key
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }

    return new ArrayList<>(map.values());
}

// Example trace:
// "eat" → sort → "aet" → map={"aet": ["eat"]}
// "tea" → sort → "aet" → map={"aet": ["eat", "tea"]}
// "tan" → sort → "ant" → map={"aet": ["eat", "tea"], "ant": ["tan"]}
// "ate" → sort → "aet" → map={"aet": ["eat", "tea", "ate"], "ant": ["tan"]}
// ...

// Time: O(n * k log k) where n=words, k=avg word length (for sorting)
// Space: O(n * k) for storing all words

// Optimization: Character count instead of sorting
String getKey(String s) {
    int[] count = new int[26];
    for (char c : s.toCharArray()) count[c - 'a']++;
    return Arrays.toString(count);  // Use count as key
}
// Time: O(n * k) - no sorting needed!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 3: Longest Consecutive Sequence</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Find longest consecutive sequence in unsorted array
// Input: [100, 4, 200, 1, 3, 2]
// Output: 4 (sequence: [1, 2, 3, 4])

// Brute force: Sort then scan - O(n log n)

// HashMap: O(n) with clever trick! ⚡
int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int num : nums) set.add(num);

    int maxLen = 0;

    for (int num : set) {
        // Only start counting if this is start of sequence
        if (!set.contains(num - 1)) {  // KEY INSIGHT!
            int current = num;
            int len = 1;

            // Count consecutive numbers
            while (set.contains(current + 1)) {
                current++;
                len++;
            }

            maxLen = Math.max(maxLen, len);
        }
    }

    return maxLen;
}

// Example trace:
// nums = [100, 4, 200, 1, 3, 2]
// set = {100, 4, 200, 1, 3, 2}

// Check 100: 99 not in set → start of sequence
//   100, 101 not in set → length 1

// Check 4: 3 in set → NOT start, skip

// Check 200: 199 not in set → start
//   200, 201 not in set → length 1

// Check 1: 0 not in set → start of sequence!
//   1, 2 ✓, 3 ✓, 4 ✓, 5 ✗ → length 4!

// Time: O(n) - each number visited at most twice
// Space: O(n) - hash set
// Key: Only start counting from sequence start!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 4: Subarray Sum Equals K</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Count subarrays with sum = k
// Input: nums = [1, 1, 1], k = 2
// Output: 2 ([1,1] from index 0-1, and [1,1] from index 1-2)

int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, 1);  // Base case: prefix sum 0 seen once

    int sum = 0;
    int count = 0;

    for (int num : nums) {
        sum += num;  // Prefix sum up to current index

        // If (sum - k) exists, we found subarray with sum k
        if (map.containsKey(sum - k)) {
            count += map.get(sum - k);
        }

        map.put(sum, map.getOrDefault(sum, 0) + 1);
    }

    return count;
}

// Example trace:
// nums = [1, 2, 3], k = 3
// map = {0: 1}, sum = 0, count = 0

// i=0: num=1, sum=1
//   sum-k = 1-3 = -2, not in map
//   map = {0:1, 1:1}, count = 0

// i=1: num=2, sum=3
//   sum-k = 3-3 = 0, in map! count += 1
//   map = {0:1, 1:1, 3:1}, count = 1

// i=2: num=3, sum=6
//   sum-k = 6-3 = 3, in map! count += 1
//   map = {0:1, 1:1, 3:1, 6:1}, count = 2

// Why this works:
// If prefix_sum[j] - prefix_sum[i] = k
// Then sum from i+1 to j equals k!
// Store prefix sums in map for O(1) lookup

// Time: O(n)
// Space: O(n)`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 5: LRU Cache (Design Problem)</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Implement LRU Cache with O(1) get and put
// Use HashMap + Doubly Linked List

class LRUCache {
    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private Map<Integer, Node> map;
    private Node head, tail;  // Dummy nodes
    private int capacity;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        map = new HashMap<>();
        head = new Node(0, 0);  // Dummy head
        tail = new Node(0, 0);  // Dummy tail
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;

        Node node = map.get(key);
        remove(node);      // Remove from current position
        addToHead(node);   // Move to front (most recent)
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.value = value;
            remove(node);
            addToHead(node);
        } else {
            if (map.size() >= capacity) {
                // Evict LRU (tail.prev)
                Node lru = tail.prev;
                remove(lru);
                map.remove(lru.key);
            }

            Node newNode = new Node(key, value);
            map.put(key, newNode);
            addToHead(newNode);
        }
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void addToHead(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }
}

// Why HashMap + DLL?
// HashMap: O(1) lookup by key
// DLL: O(1) move to front, O(1) remove from tail
// Together: O(1) for both get and put!

// Time: O(1) for get and put
// Space: O(capacity)`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 6: First Non-Repeating Character</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Find first non-repeating character in string
// Input: "leetcode"
// Output: 'l' (l appears once, e appears 3 times)

char firstUniqChar(String s) {
    Map<Character, Integer> freq = new HashMap<>();

    // Count frequencies
    for (char c : s.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }

    // Find first with frequency 1
    for (char c : s.toCharArray()) {
        if (freq.get(c) == 1) return c;
    }

    return '_';  // No unique character
}

// Time: O(n) - two passes
// Space: O(1) - at most 26 characters

// Follow-up: What if string is a stream?
class FirstUnique {
    Map<Character, Integer> freq = new HashMap<>();
    Queue<Character> queue = new LinkedList<>();

    void add(char c) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
        queue.offer(c);

        // Remove non-unique from front
        while (!queue.isEmpty() && freq.get(queue.peek()) > 1) {
            queue.poll();
        }
    }

    char getFirst() {
        return queue.isEmpty() ? '_' : queue.peek();
    }
}

// Real-world: Log analysis, data stream processing`}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HashMapVisualizerEnhanced
