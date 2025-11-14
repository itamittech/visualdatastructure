import React, { useState } from 'react'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'
import ComplexityEducation from '../components/ComplexityEducation'
import OperationVisualizer from '../components/OperationVisualizer'
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

      {/* Complexity Education */}
      <ComplexityEducation />

      {/* Step-by-step Visualizer */}
      {operationSteps && (
        <OperationVisualizer
          operation={operationSteps.operation}
          steps={operationSteps.steps}
          onComplete={() => setOperationSteps(null)}
        />
      )}

      {/* Main Set Visualization */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Interactive Set Visualization</h2>

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

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
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
    </div>
  )
}

export default SetVisualizerEnhanced
