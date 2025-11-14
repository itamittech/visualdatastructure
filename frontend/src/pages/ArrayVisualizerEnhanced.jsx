import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'
import OperationVisualizer from '../components/OperationVisualizer'
import JavaListImplementations from '../components/JavaListImplementations'
import {
  generateArraySearchSteps,
  generateArrayInsertSteps,
  generateArrayAccessSteps,
  generateAmortizedArrayGrowthSteps
} from '../utils/operationSteps'

function ArrayVisualizerEnhanced() {
  const [array, setArray] = useState([10, 20, 30, 40, 50])
  const [inputValue, setInputValue] = useState('')
  const [inputIndex, setInputIndex] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(null)
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [operationSteps, setOperationSteps] = useState(null)
  const [showAmortizedDemo, setShowAmortizedDemo] = useState(false)

  const handleInsert = () => {
    const value = parseInt(inputValue)
    const index = parseInt(inputIndex)

    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    if (isNaN(index) || index < 0 || index > array.length) {
      setMessage(`Index must be between 0 and ${array.length}`)
      return
    }

    if (showLearningMode) {
      const steps = generateArrayInsertSteps(array, index, value)
      setOperationSteps({ operation: 'Array Insert', steps })
    }

    const newArray = [...array]
    newArray.splice(index, 0, value)
    setArray(newArray)
    setHighlightIndex(index)
    setMessage(`Inserted ${value} at index ${index}`)
    setTimeout(() => setHighlightIndex(null), 1000)
  }

  const handleDelete = () => {
    const index = parseInt(inputIndex)

    if (isNaN(index) || index < 0 || index >= array.length) {
      setMessage(`Index must be between 0 and ${array.length - 1}`)
      return
    }

    const deletedValue = array[index]
    const newArray = [...array]
    newArray.splice(index, 1)
    setArray(newArray)
    setMessage(`Deleted ${deletedValue} from index ${index}`)
  }

  const handleSearch = () => {
    const value = parseInt(inputValue)

    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    if (showLearningMode) {
      const steps = generateArraySearchSteps(array, value)
      setOperationSteps({ operation: 'Array Search (Linear)', steps })
    } else {
      const index = array.indexOf(value)
      if (index !== -1) {
        setHighlightIndex(index)
        setMessage(`Found ${value} at index ${index}`)
        setTimeout(() => setHighlightIndex(null), 2000)
      } else {
        setMessage(`${value} not found in array`)
      }
    }
  }

  const handleAccess = () => {
    const index = parseInt(inputIndex)

    if (isNaN(index) || index < 0 || index >= array.length) {
      setMessage(`Index must be between 0 and ${array.length - 1}`)
      return
    }

    if (showLearningMode) {
      const steps = generateArrayAccessSteps(array, index)
      setOperationSteps({ operation: 'Array Access', steps })
    }

    setHighlightIndex(index)
    setMessage(`Value at index ${index} is ${array[index]}`)
    setTimeout(() => setHighlightIndex(null), 2000)
  }

  const showAmortizedAnalysis = () => {
    const steps = generateAmortizedArrayGrowthSteps()
    setOperationSteps({ operation: 'Amortized Array Growth', steps })
    setShowAmortizedDemo(true)
  }

  const complexityData = {
    operations: [
      {
        name: 'Access by Index',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Direct memory calculation: address = base + (index × size). Always constant time!'
      },
      {
        name: 'Search (Unsorted)',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Must check each element sequentially until found or end reached. Worst case: n comparisons.'
      },
      {
        name: 'Insert at End',
        time: 'O(1)*',
        space: 'O(1)',
        description: '*Amortized O(1). Usually just place at next slot. Occasional resize is O(n) but rare.'
      },
      {
        name: 'Insert at Beginning',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Must shift all n elements one position right. Array[0]=new causes array[0→1], array[1→2], etc.'
      },
      {
        name: 'Insert at Middle',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Must shift all elements from index to end. Average n/2 shifts = O(n) in Big O notation.'
      },
      {
        name: 'Delete',
        time: 'O(n)',
        space: 'O(1)',
        description: 'After removing element, must shift remaining elements left to fill gap. n operations worst case.'
      },
    ]
  }

  const scratchCode = `// Array Implementation from Scratch
public class CustomArray<T> {
    private Object[] data;     // Actual storage
    private int size;           // Number of elements
    private int capacity;       // Total space allocated

    public CustomArray(int initialCapacity) {
        this.capacity = initialCapacity;
        this.data = new Object[capacity];
        this.size = 0;
    }

    /**
     * WHY O(1)? Direct memory access using math!
     * Formula: address = base_address + (index × element_size)
     * This is just arithmetic - doesn't depend on array size.
     */
    @SuppressWarnings("unchecked")
    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index: " + index);
        }
        return (T) data[index];  // Single calculation!
    }

    /**
     * WHY O(1) amortized? Most inserts are quick!
     *
     * Normal case (99% of time):
     *   - Check if space available: O(1)
     *   - Place at end: data[size++] = element: O(1)
     *   - Total: O(1)
     *
     * Rare case (when full):
     *   - Create bigger array: O(1)
     *   - Copy all elements: O(n)
     *   - Insert new element: O(1)
     *   - Total: O(n)
     *
     * But this happens so rarely (capacity doubles each time),
     * that average over many operations is still O(1)!
     *
     * Example: 17 inserts = 20 operations total
     *          20/17 ≈ 1.2 operations per insert = O(1)
     */
    public void add(T element) {
        if (size == capacity) {
            resize();  // Expensive but rare!
        }
        data[size++] = element;
    }

    /**
     * WHY O(n)? We must shift elements!
     *
     * Example: Insert 99 at index 1 in [10, 20, 30, 40, 50]
     * Step 1: Move 50 from index 4 to 5: data[5] = data[4]
     * Step 2: Move 40 from index 3 to 4: data[4] = data[3]
     * Step 3: Move 30 from index 2 to 3: data[3] = data[2]
     * Step 4: Move 20 from index 1 to 2: data[2] = data[1]
     * Step 5: Insert 99 at index 1: data[1] = 99
     *
     * Result: [10, 99, 20, 30, 40, 50]
     *
     * We did 4 shifts + 1 insert = 5 operations for n=5 elements
     * In worst case (insert at index 0), we shift all n elements.
     */
    public void insert(int index, T element) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException();
        }
        if (size == capacity) {
            resize();
        }

        // Shift elements to the right - this is the O(n) part!
        for (int i = size; i > index; i--) {
            data[i] = data[i - 1];  // Each shift is one operation
        }

        data[index] = element;
        size++;
    }

    /**
     * WHY O(n)? Must shift elements left after deletion!
     *
     * Example: Remove index 1 from [10, 20, 30, 40, 50]
     * Step 1: Copy data[2] to data[1]: 30 → position 1
     * Step 2: Copy data[3] to data[2]: 40 → position 2
     * Step 3: Copy data[4] to data[3]: 50 → position 3
     *
     * Result: [10, 30, 40, 50]
     *
     * We shifted n-1 elements = O(n) time
     */
    @SuppressWarnings("unchecked")
    public T remove(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        T removed = (T) data[index];

        // Shift elements to the left - O(n) operation!
        for (int i = index; i < size - 1; i++) {
            data[i] = data[i + 1];
        }

        data[--size] = null;
        return removed;
    }

    /**
     * WHY O(n)? Must check each element until found!
     *
     * Best case: Element is at index 0 = 1 comparison = O(1)
     * Worst case: Element at end or not found = n comparisons = O(n)
     * Average case: Element in middle = n/2 comparisons = O(n)
     *
     * Big O uses worst case, so O(n).
     */
    public int indexOf(T element) {
        for (int i = 0; i < size; i++) {  // Loop runs n times worst case
            if (data[i] != null && data[i].equals(element)) {
                return i;  // Found! Return immediately
            }
        }
        return -1;  // Not found after checking all n elements
    }

    /**
     * Resize when capacity reached
     * Double the capacity to make resizes rare (amortized analysis)
     */
    private void resize() {
        capacity *= 2;  // Double capacity
        Object[] newData = new Object[capacity];
        System.arraycopy(data, 0, newData, 0, size);  // Copy n elements = O(n)
        data = newData;
    }

    public int size() { return size; }
}`

  const libraryCode = `// Using Java's Built-in ArrayList
import java.util.ArrayList;

/**
 * ArrayList internally uses array with automatic resizing.
 * It implements the exact same logic we showed in scratch version!
 */
public class ArrayExample {
    public static void main(String[] args) {
        // Create ArrayList (starts with capacity 10 by default)
        ArrayList<Integer> list = new ArrayList<>();

        // O(1) amortized - Add at end
        list.add(10);      // [10]
        list.add(20);      // [10, 20]
        list.add(30);      // [10, 20, 30]

        // WHY O(1)? Just place at next position!
        // Unless array full → resize (rare) → still O(1) amortized

        // O(1) - Access by index (direct memory calculation)
        int value = list.get(0);
        // Calculates: baseAddress + (0 × elementSize)
        // Just math! No loops!
        System.out.println("First element: " + value);

        // O(n) - Insert at specific index (must shift elements)
        list.add(1, 15);  // [10, 15, 20, 30]
        // Internally shifts: 20→index2, 30→index3, then insert 15→index1

        // O(n) - Remove by index (must shift elements left)
        list.remove(2);  // Removes 20
        // Internally shifts: 30→index2 to fill gap
        // Result: [10, 15, 30]

        // O(n) - Search for element (linear search)
        int index = list.indexOf(30);
        // Internally: loop through each element until found
        // Checks: list[0]==30? No. list[1]==30? No. list[2]==30? Yes! Return 2

        // O(1) - Get size (just return a variable)
        int size = list.size();

        // O(n) - Check if contains (same as indexOf)
        boolean contains = list.contains(15);
        // Must check each element: O(n)

        // O(1) - Set element at index
        list.set(0, 100);  // [100, 15, 30]
        // Just: array[index] = value. Direct access!

        System.out.println("Final list: " + list);

        /* KEY INSIGHT:
         * Arrays are great when you:
         * - Need fast access by index (O(1))
         * - Mostly add to end (O(1) amortized)
         * - Don't insert/delete in middle often (O(n))
         *
         * Consider LinkedList when:
         * - Frequent insert/delete in middle
         * - Don't need random access by index
         */
    }
}`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/complexity" className="hover:text-blue-600">Complexity Guide</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Array</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Array - Deep Dive</h1>
        <div className="flex items-center space-x-4">
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
          <button
            onClick={showAmortizedAnalysis}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Show Amortized Analysis
          </button>
        </div>
      </div>

      {/* Theory Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">What is an Array?</h2>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            An <strong>array</strong> is a fundamental data structure that stores elements in <strong>contiguous memory locations</strong>.
            Think of it as a row of numbered boxes, where each box holds one value and has a unique index (position number).
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-indigo-700 mb-3">🔑 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Fixed Size (Static Arrays):</strong> Once created, size cannot change. Java arrays are fixed-size.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Dynamic Arrays (ArrayList):</strong> Can grow/shrink automatically by creating new larger arrays internally.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Indexed Access:</strong> Access any element directly using its index in O(1) time.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Contiguous Memory:</strong> Elements stored in adjacent memory locations for cache efficiency.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Same Type:</strong> All elements must be of the same data type (homogeneous).</span>
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">✓ When to Use Arrays</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• You need fast random access by index (O(1))</li>
                <li>• You know the size in advance or it doesn't change often</li>
                <li>• You're iterating through all elements sequentially</li>
                <li>• Memory locality matters (cache-friendly)</li>
                <li>• Implementing other data structures (stacks, queues, heaps)</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use Arrays</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Frequent insertions/deletions in middle (O(n) shifting)</li>
                <li>• Size changes frequently and unpredictably</li>
                <li>• Need fast insert at beginning (O(n) to shift all)</li>
                <li>• Memory is severely constrained and size varies greatly</li>
                <li>• Need to frequently search unsorted data (O(n))</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Static Arrays:</strong>
                <p className="text-gray-600 mt-1">Days of week, months, chess board (8×8), fixed configuration settings</p>
              </div>
              <div>
                <strong className="text-gray-800">Dynamic Arrays:</strong>
                <p className="text-gray-600 mt-1">Shopping cart items, user list, chat messages, image pixels</p>
              </div>
              <div>
                <strong className="text-gray-800">Performance Critical:</strong>
                <p className="text-gray-600 mt-1">Game entity positions, sensor readings, financial time series</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-100 rounded-lg p-5">
            <h4 className="font-bold text-indigo-900 mb-2">🎯 The Power of Index-Based Access</h4>
            <p className="text-gray-700">
              Arrays excel because of <strong>direct addressing</strong>. If you know an element's index, you can access it
              instantly using the formula: <code className="bg-white px-2 py-1 rounded font-mono">memory_address = base_address + (index × element_size)</code>
              <br/><br/>
              This is why accessing <code className="bg-white px-1 rounded">arr[0]</code> and <code className="bg-white px-1 rounded">arr[1000000]</code>
              take the <strong>exact same time</strong> - just one calculation!
            </p>
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
                When you perform operations (Search, Insert, Access), you'll see a step-by-step
                visualization showing exactly what happens and why it has that time complexity.
                This helps you understand the "why" behind Big O notation!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complexity Guide Link */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6 mb-6 border-2 border-purple-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-2">📚</span>
              Need to understand complexity first?
            </h3>
            <p className="text-gray-700 mb-3">
              Before diving deep into arrays, make sure you understand Big O notation, time complexity,
              and amortized analysis. Visit our comprehensive guide to build a strong foundation.
            </p>
            <Link
              to="/complexity"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Learn About Complexity →
            </Link>
          </div>
        </div>
      </div>

      {/* Step-by-step Visualizer */}
      {operationSteps && (
        <OperationVisualizer
          operation={operationSteps.operation}
          steps={operationSteps.steps}
          onComplete={() => {
            if (!showAmortizedDemo) {
              setOperationSteps(null)
            }
          }}
        />
      )}

      {/* Main Array Visualization */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Interactive Array Visualization</h2>

        {/* Array Display */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 p-4 min-w-max bg-gray-50 rounded-lg">
            {array.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1 font-semibold">
                  Index {index}
                </div>
                <div
                  className={`array-cell w-20 h-20 border-2 flex items-center justify-center font-bold text-xl rounded-lg
                    ${highlightIndex === index
                      ? 'bg-yellow-300 border-yellow-500 shadow-lg'
                      : 'bg-blue-100 border-blue-500'
                    }`}
                >
                  {value}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  addr+{index}
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 mt-3 bg-blue-50 p-3 rounded">
            <strong>Memory Layout:</strong> Elements stored in contiguous memory locations.
            Access time is constant O(1) because we can calculate exact address instantly!
          </div>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter value"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Index (0 to {array.length})
            </label>
            <input
              type="number"
              value={inputIndex}
              onChange={(e) => setInputIndex(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter index"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleInsert}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Insert element at specific index - O(n)"
          >
            Insert → O(n)
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Delete element at index - O(n)"
          >
            Delete → O(n)
          </button>
          <button
            onClick={handleSearch}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Search for value - O(n)"
          >
            Search → O(n)
          </button>
          <button
            onClick={handleAccess}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Access by index - O(1)"
          >
            Access → O(1)
          </button>
        </div>

        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded">
            <strong>Result:</strong> {message}
          </div>
        )}
      </div>

      <ComplexityInfo data={complexityData} />

      {/* Java List Implementations - All types explained */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Java List Implementations - Complete Guide
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Arrays and Lists are fundamental in Java. Below you'll find ALL Java List implementations,
          including ArrayList, LinkedList, Vector, CopyOnWriteArrayList, and more. Learn when to use
          each one, including new Java 21 features!
        </p>
        <JavaListImplementations />
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Detailed Code Comparison
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <CodeDisplay
          title="Implementation from Scratch (with detailed explanations)"
          code={scratchCode}
          language="java"
        />
        <CodeDisplay
          title="Using Java's ArrayList (library implementation)"
          code={libraryCode}
          language="java"
        />
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-orange-600 mb-4">💡 Student Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <div className="font-bold text-gray-800 mb-2">When to Use Arrays?</div>
            <ul className="space-y-1 text-gray-700">
              <li>✓ Need fast access by index (O(1))</li>
              <li>✓ Mostly adding to end</li>
              <li>✓ Size relatively stable</li>
              <li>✓ Sequential access patterns</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="font-bold text-gray-800 mb-2">When NOT to Use Arrays?</div>
            <ul className="space-y-1 text-gray-700">
              <li>✗ Frequent insertions in middle (O(n))</li>
              <li>✗ Frequent deletions (O(n))</li>
              <li>✗ Size changes dramatically</li>
              <li>✗ Need fast insert at beginning</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex justify-between items-center bg-white rounded-lg shadow-md p-6">
        <Link
          to="/complexity"
          className="text-blue-600 hover:text-blue-700 flex items-center font-semibold"
        >
          ← Previous: Complexity Guide
        </Link>
        <Link
          to="/linkedlist"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
        >
          Next: Linked List →
        </Link>
      </div>
    </div>
  )
}

export default ArrayVisualizerEnhanced
