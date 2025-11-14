import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'
import OperationVisualizer from '../components/OperationVisualizer'
import JavaSetImplementations from '../components/JavaSetImplementations'
import { generateSetAddSteps } from '../utils/operationSteps'

function SetVisualizerEnhanced() {
  const [set, setSet] = useState(new Set([10, 20, 30, 40]))
  const [inputValue, setInputValue] = useState('')
  const [highlightValue, setHighlightValue] = useState(null)
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [operationSteps, setOperationSteps] = useState(null)
  const [showHashDemo, setShowHashDemo] = useState(false)

  const calculateHash = (value) => {
    // Simple hash function for demonstration
    return Math.abs(value.toString().split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 8
  }

  const handleAdd = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    if (showLearningMode) {
      const steps = generateSetAddSteps(set, value)
      setOperationSteps({ operation: 'Set Add (Hash Set)', steps })
    }

    if (set.has(value)) {
      setMessage(`${value} already exists in the set (duplicates not allowed) - Checked in O(1) time!`)
      setHighlightValue(value)
      setTimeout(() => setHighlightValue(null), 1500)
    } else {
      const newSet = new Set(set)
      newSet.add(value)
      setSet(newSet)
      setHighlightValue(value)
      setMessage(`Added ${value} to the set - Hash calculated in O(1), added in O(1)!`)
      setTimeout(() => setHighlightValue(null), 1000)
    }
  }

  const handleRemove = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    if (set.has(value)) {
      const newSet = new Set(set)
      newSet.delete(value)
      setSet(newSet)
      setMessage(`Removed ${value} from the set - Found and removed in O(1) average time!`)
    } else {
      setMessage(`${value} not found in the set - Checked in O(1) average time!`)
    }
  }

  const handleContains = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const hashValue = calculateHash(value)

    if (set.has(value)) {
      setHighlightValue(value)
      setMessage(`${value} exists in set - Hash: ${hashValue} | Found in O(1) average time!`)
      setTimeout(() => setHighlightValue(null), 2000)
    } else {
      setMessage(`${value} does not exist - Hash would be: ${hashValue} | Checked in O(1) average time!`)
    }
  }

  const handleClear = () => {
    setSet(new Set())
    setMessage('Set cleared - All buckets emptied')
  }

  const handleUnion = () => {
    const values = inputValue.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v))
    if (values.length === 0) {
      setMessage('Please enter comma-separated values (e.g., 50,60,70)')
      return
    }

    const newSet = new Set([...set, ...values])
    const addedCount = newSet.size - set.size
    setSet(newSet)
    setMessage(`Union performed: added ${addedCount} new unique values - O(m) where m = ${values.length}`)
  }

  const complexityData = {
    operations: [
      {
        name: 'Add',
        time: 'O(1)*',
        space: 'O(1)',
        description: '*Average case. Calculate hash (O(1)) → find bucket (O(1)) → add if unique (O(1)). Worst case O(n) if all collisions.'
      },
      {
        name: 'Remove',
        time: 'O(1)*',
        space: 'O(1)',
        description: '*Average case. Hash to find bucket (O(1)) → remove from bucket (O(1)). Fast because direct location access!'
      },
      {
        name: 'Contains',
        time: 'O(1)*',
        space: 'O(1)',
        description: '*Average case. Calculate hash → check specific bucket only. Don\'t need to search entire set!'
      },
      {
        name: 'Union',
        time: 'O(n+m)',
        space: 'O(n+m)',
        description: 'Add all elements from both sets. n = size of first set, m = size of second set.'
      },
      {
        name: 'Intersection',
        time: 'O(min(n,m))',
        space: 'O(min(n,m))',
        description: 'Iterate smaller set, check if each element exists in larger. Smart optimization!'
      },
      {
        name: 'Difference',
        time: 'O(n)',
        space: 'O(n)',
        description: 'Check each element in first set against second. n = size of first set.'
      },
    ]
  }

  const scratchCode = `// Hash Set Implementation from Scratch
public class CustomHashSet<T> {
    private static final int INITIAL_CAPACITY = 16;
    private static final float LOAD_FACTOR = 0.75f;

    // Array of linked lists for collision handling (separate chaining)
    private LinkedList<T>[] buckets;
    private int size;
    private int capacity;

    /**
     * HASH SET KEY CONCEPT:
     * Instead of storing elements sequentially [0][1][2][3]...
     * We use HASH FUNCTION to calculate WHERE to store element!
     *
     * Example: value = 42
     * hash = 42 % 16 = 10
     * Store 42 in bucket[10]
     *
     * This makes lookups O(1) instead of O(n)!
     */

    /**
     * WHY O(1) average? Hash function magic!
     *
     * Steps:
     * 1. Calculate hash: value.hashCode() % capacity: O(1)
     *    Example: 42 % 16 = 10
     * 2. Check if exists in bucket[10]: O(1) average
     *    (assuming few collisions)
     * 3. If not exists, add to bucket[10]: O(1)
     * Total: O(1)
     *
     * Compare to Array Search: O(n)
     * - Must check ALL elements until found
     * - Hash set: Go DIRECTLY to bucket!
     *
     * Example: Set with 1000 elements
     * Array search: Check up to 1000 elements
     * Hash set: Calculate hash, check 1 bucket!
     *
     * Worst case: O(n) when all elements collide
     * (all go to same bucket) - very rare with good hash function
     */
    public boolean add(T element) {
        // Step 1: Check if already exists - O(1)
        if (contains(element)) {
            return false;  // Sets don't allow duplicates!
        }

        // Step 2: Check if need to resize - O(1) check
        if ((float) size / capacity > LOAD_FACTOR) {
            resize();  // O(n) but rare (amortized O(1))
        }

        // Step 3: Calculate hash - O(1)
        int index = getIndex(element);

        // Step 4: Add to bucket - O(1) average
        if (buckets[index] == null) {
            buckets[index] = new LinkedList<>();
        }
        buckets[index].add(element);
        size++;
        return true;
    }

    /**
     * WHY O(1) average? Direct bucket access!
     *
     * Steps:
     * 1. Calculate hash: index = hash(element): O(1)
     * 2. Check bucket[index]: O(1) average
     * 3. Return true/false: O(1)
     * Total: O(1)
     *
     * This is HUGE advantage over:
     * - Array: O(n) must check all elements
     * - Linked List: O(n) must traverse all nodes
     * - Hash Set: O(1) go directly to bucket!
     */
    public boolean contains(T element) {
        int index = getIndex(element);  // Direct bucket calculation!

        if (buckets[index] == null) {
            return false;  // Bucket empty = definitely not present
        }

        // Check only this bucket (usually 1-2 elements)
        return buckets[index].contains(element);
    }

    /**
     * WHY O(1) average? Same as contains + removal!
     *
     * The beauty of hash sets:
     * - Know exactly which bucket to check
     * - Don't search entire data structure
     * - Remove from small bucket list (O(1) average)
     */
    public boolean remove(T element) {
        int index = getIndex(element);

        if (buckets[index] == null) {
            return false;
        }

        boolean removed = buckets[index].remove(element);
        if (removed) {
            size--;
            if (buckets[index].isEmpty()) {
                buckets[index] = null;
            }
        }
        return removed;
    }

    /**
     * Hash function: Maps element to bucket index
     *
     * Good hash function properties:
     * 1. Deterministic: Same input → same output
     * 2. Uniform distribution: Spreads elements evenly
     * 3. Fast to compute: O(1)
     *
     * Example:
     * element = 42, capacity = 16
     * hash = 42 % 16 = 10
     * element = 58, capacity = 16
     * hash = 58 % 16 = 10 (COLLISION!)
     *
     * Collisions handled by separate chaining:
     * bucket[10] = [42 → 58]
     */
    private int getIndex(T element) {
        // Math.abs to handle negative hash codes
        return Math.abs(element.hashCode() % capacity);
    }

    /**
     * WHY O(n+m)? Must add all elements!
     *
     * union({1,2,3}, {3,4,5}) = {1,2,3,4,5}
     *
     * Steps:
     * 1. Add all from first set: n operations
     * 2. Add all from second set: m operations
     * 3. Duplicates automatically ignored (set property)
     * Total: O(n + m)
     */
    public CustomHashSet<T> union(CustomHashSet<T> other) {
        CustomHashSet<T> result = new CustomHashSet<>();

        // Add all from this set - O(n)
        for (T element : this.toList()) {
            result.add(element);
        }

        // Add all from other set - O(m)
        for (T element : other.toList()) {
            result.add(element);  // Duplicates ignored
        }

        return result;
    }

    /**
     * WHY O(min(n,m))? Smart optimization!
     *
     * intersection({1,2,3,4,5}, {4,5,6,7}) = {4,5}
     *
     * Smart approach:
     * 1. Identify smaller set: O(1)
     * 2. For each element in smaller set: min(n,m) iterations
     * 3. Check if in larger set: O(1) per check
     * Total: O(min(n,m))
     *
     * Why iterate smaller?
     * If n=5, m=1000: Check 5 elements (not 1000!)
     */
    public CustomHashSet<T> intersection(CustomHashSet<T> other) {
        CustomHashSet<T> result = new CustomHashSet<>();

        // Choose smaller set to iterate
        CustomHashSet<T> smaller = this.size < other.size ? this : other;
        CustomHashSet<T> larger = this.size < other.size ? other : this;

        // Only check smaller set's elements
        for (T element : smaller.toList()) {
            if (larger.contains(element)) {  // O(1) check!
                result.add(element);
            }
        }

        return result;
    }

    /**
     * WHY resize? Maintain O(1) performance!
     *
     * Load factor = size / capacity
     * If too high (> 0.75), buckets get crowded:
     * - More collisions
     * - Longer chains in buckets
     * - Performance degrades from O(1) to O(n)
     *
     * Solution: Double capacity when load factor exceeds threshold
     * - Spreads elements across more buckets
     * - Reduces collisions
     * - Maintains O(1) average performance
     *
     * Cost: O(n) to rehash all elements
     * But happens rarely, so amortized O(1)
     */
    @SuppressWarnings("unchecked")
    private void resize() {
        capacity *= 2;
        LinkedList<T>[] oldBuckets = buckets;
        buckets = new LinkedList[capacity];
        size = 0;

        // Rehash all elements with new capacity
        for (LinkedList<T> bucket : oldBuckets) {
            if (bucket != null) {
                for (T element : bucket) {
                    add(element);  // Calculate new hash with new capacity
                }
            }
        }
    }

    public int size() { return size; }
}`

  const libraryCode = `// Using Java's Built-in HashSet
import java.util.HashSet;
import java.util.Set;

/**
 * Java's HashSet internally uses HashMap
 * which uses the same hash table concept!
 */
public class SetExample {
    public static void main(String[] args) {
        // Create HashSet (default capacity: 16, load factor: 0.75)
        Set<Integer> set = new HashSet<>();

        // O(1) average - Add elements
        set.add(10);   // Hash: 10 % 16 = 10 → bucket[10]
        set.add(20);   // Hash: 20 % 16 = 4 → bucket[4]
        set.add(30);   // Hash: 30 % 16 = 14 → bucket[14]
        set.add(10);   // Duplicate! Ignored (set property)
        // Why O(1)? Calculate hash → go to bucket → add

        // O(1) average - Check if contains
        boolean contains = set.contains(20);
        // Why O(1)? Hash 20 → bucket[4] → check that bucket only!
        // Compare to ArrayList.contains(): O(n) check all elements

        // O(1) average - Remove element
        set.remove(20);
        // Why O(1)? Hash 20 → bucket[4] → remove from that bucket
        // Compare to ArrayList.remove(value): O(n) search then shift

        // O(1) - Get size (maintained as variable)
        int size = set.size();

        // O(n) - Iterate through elements
        for (Integer num : set) {
            System.out.println(num);
        }
        // Must visit all n elements

        // Set operations
        Set<Integer> set2 = new HashSet<>();
        set2.add(30);
        set2.add(40);
        set2.add(50);

        // O(n + m) - Union (add all from both)
        Set<Integer> union = new HashSet<>(set);  // Copy first set: O(n)
        union.addAll(set2);                        // Add all from second: O(m)
        // Result: {10, 30, 40, 50}

        // O(min(n,m)) - Intersection (keep common)
        Set<Integer> intersection = new HashSet<>(set);
        intersection.retainAll(set2);
        // Result: {30} (only common element)

        // O(n) - Difference (remove second from first)
        Set<Integer> difference = new HashSet<>(set);
        difference.removeAll(set2);
        // Result: {10} (from set, not in set2)

        // O(n) - Check if subset
        boolean isSubset = set.containsAll(set2);
        // Check if every element in set2 exists in set

        // O(n) - Clear all elements
        set.clear();

        // O(1) - Check if empty
        boolean isEmpty = set.isEmpty();

        System.out.println("Union: " + union);
        System.out.println("Intersection: " + intersection);

        /* WHEN TO USE HASH SET?
         *
         * Use Hash Set when you need:
         * ✓ Fast lookup (O(1) vs O(n) for arrays)
         * ✓ Uniqueness guarantee (no duplicates)
         * ✓ Fast add/remove (O(1) average)
         * ✓ Don't care about order
         * ✓ Set operations (union, intersection)
         *
         * Don't use when you need:
         * ✗ Ordered elements (use TreeSet)
         * ✗ Index-based access
         * ✗ Duplicates allowed
         * ✗ Minimal memory (sets have overhead)
         *
         * REAL EXAMPLES:
         * - Checking for duplicates: O(n) with set vs O(n²) with array
         * - Finding unique elements: Natural with sets
         * - Membership testing: O(1) vs O(n)
         * - Cache/visited tracking: Perfect for sets
         */
    }
}`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/linkedlist" className="hover:text-blue-600">Linked List</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Hash Set</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Hash Set - Deep Dive</h1>
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is a Hash Set?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            A <strong>hash set</strong> is a data structure that stores <strong>unique elements</strong> using a <strong>hash table</strong> for lightning-fast lookups.
            It uses a <strong>hash function</strong> to calculate where to store each element, enabling O(1) average time for add, remove, and contains operations.
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🔑 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Unique Elements Only:</strong> Duplicates are automatically rejected - each value can appear at most once.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Hash-Based Storage:</strong> Uses hash function to calculate bucket index: <code className="bg-gray-100 px-1">index = hash(value) % capacity</code></span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>O(1) Average Operations:</strong> Add, remove, and contains are all constant time on average!</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>No Order Guarantee:</strong> Elements are stored by hash value, not insertion order (use LinkedHashSet for order).</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Collision Handling:</strong> When two elements hash to same bucket, use chaining (linked list) or probing.</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-100 rounded-lg p-5">
            <h4 className="font-bold text-purple-900 mb-3">🎯 How Hash Functions Enable O(1) Lookup</h4>
            <p className="text-gray-700 mb-3">
              The magic of sets comes from <strong>direct addressing</strong> via hash functions:
            </p>
            <div className="bg-white rounded p-4 font-mono text-sm">
              <div className="space-y-1">
                <div><span className="text-gray-500">// Example: Adding value 42</span></div>
                <div><span className="text-blue-600">hash</span> = 42.hashCode() = 42</div>
                <div><span className="text-blue-600">index</span> = hash % capacity = 42 % 16 = <strong className="text-green-600">10</strong></div>
                <div><span className="text-gray-500">// Store in bucket[10]</span></div>
                <div className="mt-2"><span className="text-gray-500">// Later: Checking if 42 exists</span></div>
                <div><span className="text-blue-600">index</span> = 42 % 16 = <strong className="text-green-600">10</strong></div>
                <div><span className="text-gray-500">// Check only bucket[10] - not all buckets!</span></div>
              </div>
            </div>
            <p className="text-gray-700 mt-3">
              <strong>Compare to Array Search:</strong> Must check each element until found (O(n))<br/>
              <strong>Hash Set Search:</strong> Calculate bucket, check only that bucket (O(1) average)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">✓ When to Use Hash Sets</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need to check if element exists (O(1) vs O(n) for arrays)</li>
                <li>• Remove duplicates from a collection</li>
                <li>• Track visited/seen elements (like in graph algorithms)</li>
                <li>• Fast membership testing is critical</li>
                <li>• Set operations: union, intersection, difference</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use Hash Sets</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need sorted elements (use TreeSet instead)</li>
                <li>• Need to maintain insertion order (use LinkedHashSet)</li>
                <li>• Need duplicates allowed (use List instead)</li>
                <li>• Need index-based access (use ArrayList)</li>
                <li>• Working with enums (use EnumSet - much faster)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Duplicate Detection:</strong>
                <p className="text-gray-600 mt-1">Find duplicates in array: O(n) with set vs O(n²) with nested loops</p>
              </div>
              <div>
                <strong className="text-gray-800">Unique Visitors:</strong>
                <p className="text-gray-600 mt-1">Track unique user IDs, IP addresses - automatic deduplication</p>
              </div>
              <div>
                <strong className="text-gray-800">Graph Algorithms:</strong>
                <p className="text-gray-600 mt-1">Track visited nodes in BFS/DFS to avoid cycles</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
            <h4 className="font-bold text-red-900 mb-2">⚠️ Understanding Collisions</h4>
            <p className="text-gray-700">
              <strong>Collision:</strong> When two different values hash to the same bucket index.<br/>
              Example: <code className="bg-white px-1">hash(42) % 8 = 2</code> and <code className="bg-white px-1">hash(50) % 8 = 2</code><br/><br/>

              <strong>Solution - Separate Chaining:</strong> Each bucket stores a linked list of all values that hash there.<br/>
              • Best case: Each bucket has 0-1 elements → O(1)<br/>
              • Worst case: All elements in one bucket → O(n) (rare with good hash function)<br/>
              • Average case with good distribution: O(1)<br/><br/>

              <strong>Load Factor:</strong> When set becomes too full (size/capacity &gt; 0.75), the set automatically <strong>resizes and rehashes</strong> all elements to maintain O(1) performance!
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">🚀 Performance Comparison</h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between bg-white p-2 rounded">
                <span>Check if element exists in 1,000 items:</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>• Array (unsorted):</span>
                <span className="text-red-600 font-bold">~500 comparisons (O(n))</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>• Hash Set:</span>
                <span className="text-green-600 font-bold">~1-2 operations (O(1)) ⚡</span>
              </div>
              <div className="flex justify-between bg-white p-2 rounded mt-2">
                <span>Remove duplicates from 10,000 items:</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>• Nested loops:</span>
                <span className="text-red-600 font-bold">~50M comparisons (O(n²)) 🐌</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>• Hash Set:</span>
                <span className="text-green-600 font-bold">~10K operations (O(n)) 🚀</span>
              </div>
            </div>
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
                Perform Add operation to see how hash functions work and why sets achieve O(1) lookup time!
                Watch how elements are placed in buckets using hash calculations.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-step Visualizer */}
      {operationSteps && (
        <OperationVisualizer
          operation={operationSteps.operation}
          steps={operationSteps.steps}
          onComplete={() => setOperationSteps(null)}
        />
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Set Visualization</h2>
        </div>

        {/* Set Display */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 p-6 min-h-[150px] bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
            {Array.from(set).length === 0 ? (
              <div className="text-gray-500 m-auto text-lg">Set is empty - No elements stored</div>
            ) : (
              Array.from(set).map((value) => {
                const hashValue = calculateHash(value)
                return (
                  <div
                    key={value}
                    className={`transition-all duration-300 ${
                      highlightValue === value ? 'scale-110' : ''
                    }`}
                  >
                    <div className="text-xs text-center text-gray-500 mb-1 font-semibold">
                      Hash: {hashValue}
                    </div>
                    <div
                      className={`w-20 h-20 rounded-full border-2 flex items-center justify-center font-bold text-xl shadow-md
                        ${highlightValue === value
                          ? 'bg-yellow-300 border-yellow-500 shadow-xl'
                          : 'bg-purple-100 border-purple-500'
                        }`}
                    >
                      {value}
                    </div>
                    <div className="text-xs text-center text-gray-400 mt-1 font-mono">
                      bucket[{hashValue}]
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-3 text-sm">
            <div className="bg-purple-50 p-3 rounded">
              <strong>Set Size:</strong> {set.size} unique elements
            </div>
            <div className="bg-indigo-50 p-3 rounded">
              <strong>Elements:</strong> {Array.from(set).length > 0 ? `{${Array.from(set).join(', ')}}` : 'none'}
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-3 bg-purple-50 p-3 rounded border-l-4 border-purple-500">
            <strong>How Hash Sets Work:</strong> Each value is hashed (hash = value % 8) to determine its bucket.
            Lookups are O(1) because we calculate the bucket directly instead of searching all elements!
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value (or comma-separated values for Union)
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter value(s)"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleAdd}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Add element - O(1) average"
          >
            Add → O(1)* ⚡
          </button>
          <button
            onClick={handleRemove}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Remove element - O(1) average"
          >
            Remove → O(1)* ⚡
          </button>
          <button
            onClick={handleContains}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Check if contains - O(1) average"
          >
            Contains → O(1)* ⚡
          </button>
          <button
            onClick={handleUnion}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Union with values - O(n+m)"
          >
            Union → O(n+m)
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Clear all - O(n)"
          >
            Clear → O(n)
          </button>
        </div>

        {message && (
          <div className="bg-purple-50 border-l-4 border-purple-500 text-purple-700 px-4 py-3 rounded">
            <strong>Result:</strong> {message}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Key Property:</strong> Sets do not allow duplicate elements. Adding an existing element will be ignored.
          This uniqueness is automatically enforced!
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
            title="Hash Set from Scratch (with collision handling)"
            code={scratchCode}
            language="java"
          />
          <CodeDisplay
            title="Using Java's HashSet"
            code={libraryCode}
            language="java"
          />
        </div>
      </div>

      {/* Java Set Implementations - Complete Guide */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Java Set Implementations - Complete Guide
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Sets come in many flavors in Java! Below you'll find ALL Set implementations including
          HashSet, LinkedHashSet, TreeSet, EnumSet, CopyOnWriteArraySet, and more. Learn when to use
          each one, including NavigableSet operations and Java 21 SequencedSet features!
        </p>
        <JavaSetImplementations />
      </div>

      {/* STEP 4: Advanced Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-lg shadow-md p-8 mb-8 border-l-8 border-slate-500">
        <div className="flex items-center mb-4">
          <div className="bg-slate-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">4</div>
          <h2 className="text-3xl font-bold text-gray-800">Advanced: Architect-Level Deep Dive</h2>
        </div>
        <div className="mb-4 text-sm text-gray-600">
          ⚠️ <strong>Complete Steps 1-3 below before diving into this architect-level content</strong>
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
                <li>Then return here for deep dives into hash functions, collision resolution, concurrency, and production patterns</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Hash Function Deep Dive */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🔐 Hash Function Implementation Deep Dive</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold text-gray-800 mb-2">Java hashCode() Implementation</h4>
                <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`// String hashCode() - Polynomial hash function
// "hello" → 99162322
public int hashCode() {
    int h = hash;  // Cached after first call
    if (h == 0 && value.length > 0) {
        for (int i = 0; i < value.length; i++) {
            h = 31 * h + value[i];
        }
        hash = h;  // Cache for future calls
    }
    return h;
}

// Why 31?
✓ Prime number → better distribution
✓ 31 * h = (h << 5) - h → JVM optimizes to bit shift
✓ Small enough to avoid overflow issues
✓ Large enough to spread values

// Example: "cat"
h = 0
h = 31 * 0 + 'c' = 99
h = 31 * 99 + 'a' = 3166
h = 31 * 3166 + 't' = 98193
Result: 98193

// Collision example:
"Aa".hashCode() = 2112
"BB".hashCode() = 2112  // COLLISION!
// 'A' = 65, 'a' = 97, 'B' = 66
// 31 * 65 + 97 = 2112
// 31 * 66 + 66 = 2112`}
                </pre>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-semibold text-blue-900 mb-2">HashMap Index Calculation</h4>
                  <pre className="text-xs bg-white p-2 rounded">
{`// HashSet uses HashMap internally
// Two-step process:

// Step 1: Spread hash bits (XOR fold)
static int hash(Object key) {
    int h = key.hashCode();
    // XOR high 16 bits with low 16 bits
    return h ^ (h >>> 16);
}
// Why? Reduces collisions when
// table size is power of 2

// Step 2: Map to bucket index
int index = hash & (capacity - 1);
// Equivalent to: hash % capacity
// But much faster (bit AND vs modulo)
// Only works when capacity is power of 2!

Example: hash = 12345, capacity = 16
12345 & 15 = 12345 & 0b1111
           = 0b11000000111001 & 0b1111
           = 0b1001
           = 9  ← bucket index`}
                  </pre>
                </div>

                <div className="bg-red-50 p-4 rounded">
                  <h4 className="font-semibold text-red-900 mb-2">Bad Hash Functions</h4>
                  <pre className="text-xs bg-white p-2 rounded">
{`// BAD: Always returns same value
@Override
public int hashCode() {
    return 42;  // All objects → bucket 0!
}
// Result: O(1) → O(n) degradation
// Essentially becomes a linked list

// BAD: Uses only part of data
class Point {
    int x, y;
    public int hashCode() {
        return x;  // Ignores y!
    }
}
// (1,5) and (1,10) collide!

// GOOD: Combines all fields
public int hashCode() {
    return 31 * x + y;
}
// Or use Objects.hash(x, y);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Collision Resolution */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">💥 Collision Resolution Strategies</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Separate Chaining (Java uses this)</h4>
                <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`// Each bucket stores a linked list
bucket[0]: null
bucket[1]: 17 → 33 → 49 → null
bucket[2]: 10 → 26 → null
bucket[3]: null
...

// Insert 65 (hash = 1):
bucket[1]: 17 → 33 → 49 → 65 → null

// Search for 33:
1. Calculate hash(33) = 1
2. Go to bucket[1]
3. Traverse list: 17 → 33 ✓
// Average: O(1) if load factor < 0.75
// Worst: O(n) if all in one bucket

// Java 8+ optimization:
// If bucket size > 8, convert to TreeNode
// Degraded O(n) → O(log n) ✓`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Open Addressing (Python dict uses this)</h4>
                <pre className="bg-slate-900 text-yellow-400 p-3 rounded text-xs overflow-x-auto">
{`// Store directly in array, probe if occupied
bucket[0]: 10
bucket[1]: 17
bucket[2]: 26
bucket[3]: 33  ← Insert 33
bucket[4]: null

// Insert 17 (hash = 1, occupied!):
// Linear probing: try 1, 2, 3...
// Find empty slot at 1 (already taken)
// Try 2 (taken), try 3, insert!

// Probing strategies:
1. Linear: (hash + i) % capacity
2. Quadratic: (hash + i²) % capacity
3. Double hash: (hash1 + i*hash2) % cap

Pros: Better cache locality (no pointers)
Cons: Clustering, expensive deletions`}
                </pre>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Load Factor & Resizing</h4>
              <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Load Factor = size / capacity
// HashMap default: 0.75

Why 0.75?
✓ Space-time tradeoff sweet spot
✓ Keeps chain length < 1 on average
✓ Reduces probability of collisions

// Resize trigger
if (size > capacity * loadFactor) {
    resize();  // Double capacity
}

// Resize process (expensive!)
void resize() {
    int newCapacity = capacity * 2;
    Node[] newBuckets = new Node[newCapacity];

    // Rehash ALL elements!
    for (Node bucket : oldBuckets) {
        for (Node node = bucket; node != null; node = node.next) {
            int newIndex = hash(node.key) % newCapacity;
            // Insert into newBuckets[newIndex]
        }
    }
    buckets = newBuckets;
}

// Cost: O(n) to rehash all elements
// But happens rarely → amortized O(1)

// Production tip: Set initial capacity!
Set<Integer> set = new HashSet<>(10_000);
// Avoids ~10 resize operations`}
              </pre>
            </div>
          </div>

          {/* Concurrency */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🔒 Concurrent Hash Sets</h3>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-900 mb-2">❌ HashSet Race Condition</h4>
                  <pre className="text-xs bg-white p-2 rounded">
{`HashSet<Integer> set = new HashSet<>();

// Thread 1            Thread 2
if (!set.contains(42)) {
    // Context switch!
                       if (!set.contains(42)) {
                           set.add(42);
                       }
    set.add(42);
}

// Both threads think 42 isn't present
// Both add 42 (violates set invariant!)
// Or worse: concurrent resize corrupts
//           internal structure → infinite loop!

// Never share HashSet across threads!`}
                  </pre>
                </div>

                <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-2">✓ ConcurrentHashMap.newKeySet()</h4>
                  <pre className="text-xs bg-white p-2 rounded">
{`// Java 8+: Concurrent Set backed by CHM
Set<Integer> set =
    ConcurrentHashMap.newKeySet();

set.add(42);  // Thread-safe!
set.contains(42);  // Lock-free reads

// Or from existing CHM:
ConcurrentHashMap<Integer, String> map =
    new ConcurrentHashMap<>();
Set<Integer> keys = map.keySet();

// Lock striping: 16 segments by default
// Multiple threads can write
// to different segments concurrently!`}
                  </pre>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">ConcurrentHashMap Architecture</h4>
                <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`// Java 8+ uses CAS (Compare-And-Swap) + synchronized blocks
// Instead of locking entire map, locks individual buckets

Segment 0:  [bucket0][bucket1][bucket2][bucket3]
Segment 1:  [bucket4][bucket5][bucket6][bucket7]
...
Segment 15: [bucket60][bucket61][bucket62][bucket63]

// put() operation:
1. Calculate hash → determine segment and bucket
2. Use CAS to update if bucket is empty (lock-free!)
3. If collision, synchronized on bucket head
4. Only that specific bucket is locked!

// Benefits:
✓ 16 threads can write concurrently (different segments)
✓ Readers never block (volatile reads)
✓ Scales well on multi-core CPUs

// Trade-offs vs Collections.synchronizedSet():
ConcurrentHashMap.newKeySet():
✓ Lock-free reads
✓ Fine-grained locking
✓ Better scalability
✗ Slightly more memory

Collections.synchronizedSet(new HashSet<>()):
✓ Simple wrapper
✗ Global lock on every operation
✗ Readers block writers
✗ Poor scalability

Benchmark (8 threads, 80% reads):
ConcurrentHashMap:        45M ops/sec ⚡
Collections.synchronized:  2M ops/sec 🐌
Speedup: 22.5x!`}
                </pre>
              </div>
            </div>
          </div>

          {/* Production Patterns */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🏭 Production Patterns & Performance</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern: Deduplication at Scale</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-xs font-semibold text-red-800 mb-2">❌ Naive O(n²)</p>
                    <pre className="text-xs bg-white p-2 rounded">
{`List<Integer> unique = new ArrayList<>();
for (Integer num : list) {
    if (!unique.contains(num)) {
        unique.add(num);
    }
}

// contains() is O(n) for ArrayList
// Total: O(n²)
// 1M items = 500B comparisons! 💀

Benchmark (1M duplicates):
Time: ~4500ms`}
                    </pre>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs font-semibold text-green-800 mb-2">✓ HashSet O(n)</p>
                    <pre className="text-xs bg-white p-2 rounded">
{`Set<Integer> seen = new HashSet<>(
    list.size());  // Preallocate!
List<Integer> unique = new ArrayList<>();

for (Integer num : list) {
    if (seen.add(num)) {  // O(1) check + add
        unique.add(num);
    }
}

// Or even simpler:
List<Integer> unique = new ArrayList<>(
    new LinkedHashSet<>(list));

Benchmark (1M duplicates):
Time: ~15ms ⚡
Speedup: 300x faster!`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern: Intersection/Union at Scale</h4>
                <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`// Problem: Find common users between two large lists
List<Long> listA = getUserIds("GroupA");  // 1M users
List<Long> listB = getUserIds("GroupB");  // 500K users

// BAD: Nested loops O(n × m)
Set<Long> common = new HashSet<>();
for (Long id : listA) {
    if (listB.contains(id)) {  // O(m) for each!
        common.add(id);
    }
}
// 1M × 500K = 500B comparisons 💀

// GOOD: Convert to sets first O(n + m)
Set<Long> setA = new HashSet<>(listA);     // O(n)
Set<Long> setB = new HashSet<>(listB);     // O(m)
setA.retainAll(setB);  // Intersection O(n)
// Total: O(n + m) = 1.5M operations ⚡

Benchmark:
Bad:  ~45 seconds 🐌
Good: ~120ms ⚡
Speedup: 375x!

// Bonus: parallel streams for huge datasets
Set<Long> intersection = setA.parallelStream()
    .filter(setB::contains)
    .collect(Collectors.toSet());
// Utilizes all CPU cores!`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Anti-Pattern: HashSet with Mutable Objects</h4>
                <div className="bg-red-50 p-4 rounded border-l-4 border-red-600">
                  <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`class MutablePoint {
    int x, y;

    public int hashCode() {
        return 31 * x + y;
    }

    public boolean equals(Object o) {
        MutablePoint p = (MutablePoint) o;
        return x == p.x && y == p.y;
    }
}

Set<MutablePoint> set = new HashSet<>();
MutablePoint p = new MutablePoint(1, 2);
set.add(p);                 // hashCode = 33
System.out.println(set.contains(p));  // true ✓

p.x = 5;                    // MUTATE! 🚨
// Now hashCode = 157 (different!)
System.out.println(set.contains(p));  // FALSE! 💀

// The object is in the set but lost in wrong bucket!
// set.size() = 1 but iteration finds it... chaos!

// Rule: NEVER modify hashCode/equals fields after adding to Set/Map
// Best practice: Use immutable objects
record Point(int x, int y) {}  // Java 14+ records are immutable
Set<Point> set = new HashSet<>();`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Memory-Efficient Alternatives</h4>
                <pre className="bg-white border p-3 rounded text-xs overflow-x-auto">
{`// Scenario: Set of integers 0-1M (sparse)
// HashSet: ~48 bytes per entry (object overhead + Entry node)
// 100K integers = ~4.8MB

// Better: BitSet for dense integer ranges
BitSet bitSet = new BitSet(1_000_000);
bitSet.set(42);              // O(1)
boolean has = bitSet.get(42); // O(1)

// Memory: 1M bits / 8 = 125KB (38x less!)
// Perfect for: IP addresses, user IDs, flags

// Scenario: Set of Enums
enum Status { PENDING, APPROVED, REJECTED, ARCHIVED }

// BAD: Regular HashSet
Set<Status> statuses = new HashSet<>();
// Memory: ~48 bytes per enum instance

// GOOD: EnumSet (bitfield internally!)
Set<Status> statuses = EnumSet.noneOf(Status.class);
statuses.add(Status.PENDING);

// Memory: Just 1 long (8 bytes) for ≤64 enums!
// All operations: O(1) bit manipulation
// 100x faster than HashSet for enums

Benchmark (1M operations on 10 enums):
HashSet:   120ms
EnumSet:    1.2ms ⚡
Speedup: 100x faster!`}
                </pre>
              </div>
            </div>
          </div>

          {/* Interview Problems */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🎯 Interview-Level Hash Set Problems</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem: Two Sum (Amazon/Google - LeetCode #1)</h4>
                <p className="text-sm text-gray-600 mb-3">Given array of integers, find two numbers that add up to target.</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold mb-2">Naive: O(n²) time, O(1) space</p>
                    <pre className="text-xs bg-white p-2 rounded">
{`for (int i = 0; i < nums.length; i++) {
    for (int j = i+1; j < nums.length; j++) {
        if (nums[i] + nums[j] == target) {
            return new int[]{i, j};
        }
    }
}

// Check every pair
// 1M elements = 500B comparisons 🐌`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-2">Optimal: O(n) time, O(n) space ⚡</p>
                    <pre className="text-xs bg-white p-2 rounded">
{`Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (seen.containsKey(complement)) {
        return new int[]{
            seen.get(complement), i};
    }
    seen.put(nums[i], i);
}

// One pass! Trade space for time
// Key insight: x + y = target
//             → y = target - x`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem: Longest Consecutive Sequence (Hard - O(n) solution)</h4>
                <p className="text-sm text-gray-600 mb-3">Given unsorted array, find length of longest consecutive sequence. [100,4,200,1,3,2] → 4 (sequence: 1,2,3,4)</p>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Naive: Sort first → O(n log n)
// Can we do O(n)? Yes, with HashSet!

int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int num : nums) {
        set.add(num);  // O(n)
    }

    int longest = 0;

    for (int num : set) {
        // Only start counting if it's the beginning of a sequence
        if (!set.contains(num - 1)) {  // O(1) check!
            int current = num;
            int streak = 1;

            // Count consecutive numbers
            while (set.contains(current + 1)) {  // O(1) per check
                current++;
                streak++;
            }

            longest = Math.max(longest, streak);
        }
    }
    return longest;
}

// Time: O(n) - Each number visited at most twice
// Space: O(n) - HashSet storage
//
// Key insight: Only count from sequence START
// If num-1 exists, num is not a start, skip it!
// This prevents recounting: [1,2,3] only counts from 1
//
// Brilliant use of HashSet for O(1) lookups! ✨`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem: Design LRU Cache (Microsoft/Facebook)</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Must support O(1) get() and put()
// Evict least recently used when at capacity

class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map;
    private final Node head, tail;  // Doubly-linked list

    class Node {
        int key, value;
        Node prev, next;
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        head = new Node();
        tail = new Node();
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;

        Node node = map.get(key);
        moveToHead(node);  // Mark as recently used
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.value = value;
            moveToHead(node);
        } else {
            if (map.size() >= capacity) {
                Node lru = tail.prev;  // Evict LRU
                remove(lru);
                map.remove(lru.key);
            }
            Node node = new Node();
            node.key = key;
            node.value = value;
            addToHead(node);
            map.put(key, node);
        }
    }

    private void moveToHead(Node node) {
        remove(node);
        addToHead(node);
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

// Why this works:
// HashMap: O(1) lookup
// Doubly-linked list: O(1) move to front, O(1) remove from tail
// Combination gives O(1) for everything!
//
// Real-world use: Database query caching, CDN, browser cache`}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Why Sets Are Amazing */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-purple-600 mb-4">🚀 Why Hash Sets Are Game-Changers</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-bold text-gray-800 mb-2">Lightning Fast</div>
            <div className="text-sm text-gray-600">
              O(1) lookup vs O(n) for arrays. With 1 million elements, that's 1 operation vs 1 million!
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">✓</div>
            <div className="font-bold text-gray-800 mb-2">Automatic Uniqueness</div>
            <div className="text-sm text-gray-600">
              No need to manually check for duplicates. The set guarantees uniqueness automatically!
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-bold text-gray-800 mb-2">Perfect for Membership</div>
            <div className="text-sm text-gray-600">
              "Does this exist?" questions answered in O(1) instead of searching entire collection.
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg">
          <div className="font-bold text-gray-800 mb-3">Real-World Performance Comparison:</div>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between items-center">
              <span>Array with 1,000 elements - Search:</span>
              <span className="text-red-600 font-bold">~500 comparisons (O(n))</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Hash Set with 1,000 elements - Search:</span>
              <span className="text-green-600 font-bold">~1 hash calculation (O(1)) ⚡</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span>Array with 1,000,000 elements:</span>
              <span className="text-red-600 font-bold">~500,000 comparisons 🐌</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Hash Set with 1,000,000 elements:</span>
              <span className="text-green-600 font-bold">~1 hash calculation 🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 flex justify-between items-center border-t pt-6">
        <Link
          to="/linkedlist"
          className="flex items-center text-blue-600 hover:text-blue-700 font-semibold"
        >
          <span className="mr-2">←</span> Previous: Linked List
        </Link>
        <Link
          to="/complexity"
          className="text-gray-600 hover:text-gray-700"
        >
          Review Complexity Guide
        </Link>
        <div className="text-gray-400">
          End of Learning Path
        </div>
      </div>
    </div>
  )
}

export default SetVisualizerEnhanced
