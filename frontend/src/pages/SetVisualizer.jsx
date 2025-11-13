import React, { useState } from 'react'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function SetVisualizer() {
  const [set, setSet] = useState(new Set([10, 20, 30, 40]))
  const [inputValue, setInputValue] = useState('')
  const [highlightValue, setHighlightValue] = useState(null)
  const [message, setMessage] = useState('')

  const handleAdd = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    if (set.has(value)) {
      setMessage(`${value} already exists in the set (duplicates not allowed)`)
      setHighlightValue(value)
      setTimeout(() => setHighlightValue(null), 1500)
    } else {
      const newSet = new Set(set)
      newSet.add(value)
      setSet(newSet)
      setHighlightValue(value)
      setMessage(`Added ${value} to the set`)
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
      setMessage(`Removed ${value} from the set`)
    } else {
      setMessage(`${value} not found in the set`)
    }
  }

  const handleContains = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    if (set.has(value)) {
      setHighlightValue(value)
      setMessage(`${value} exists in the set`)
      setTimeout(() => setHighlightValue(null), 2000)
    } else {
      setMessage(`${value} does not exist in the set`)
    }
  }

  const handleClear = () => {
    setSet(new Set())
    setMessage('Set cleared')
  }

  const handleUnion = () => {
    const values = inputValue.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v))
    if (values.length === 0) {
      setMessage('Please enter comma-separated values (e.g., 50,60,70)')
      return
    }

    const newSet = new Set([...set, ...values])
    setSet(newSet)
    setMessage(`Union performed: added ${values.join(', ')}`)
  }

  const complexityData = {
    operations: [
      { name: 'Add', time: 'O(1)*', space: 'O(1)', description: '*Average case with hash set' },
      { name: 'Remove', time: 'O(1)*', space: 'O(1)', description: '*Average case with hash set' },
      { name: 'Contains', time: 'O(1)*', space: 'O(1)', description: '*Average case with hash set' },
      { name: 'Union', time: 'O(n+m)', space: 'O(n+m)', description: 'n and m are sizes of sets' },
      { name: 'Intersection', time: 'O(min(n,m))', space: 'O(min(n,m))', description: 'Iterate smaller set' },
      { name: 'Difference', time: 'O(n)', space: 'O(n)', description: 'n is size of first set' },
    ]
  }

  const scratchCode = `// Set Implementation from Scratch using Hash Table
public class CustomHashSet<T> {
    private static final int INITIAL_CAPACITY = 16;
    private static final float LOAD_FACTOR = 0.75f;

    private LinkedList<T>[] buckets;
    private int size;
    private int capacity;

    public CustomHashSet() {
        this.capacity = INITIAL_CAPACITY;
        this.buckets = new LinkedList[capacity];
        this.size = 0;
    }

    // O(1) average - Add element
    public boolean add(T element) {
        if (contains(element)) {
            return false;  // No duplicates
        }

        if ((float) size / capacity > LOAD_FACTOR) {
            resize();
        }

        int index = getIndex(element);
        if (buckets[index] == null) {
            buckets[index] = new LinkedList<>();
        }
        buckets[index].add(element);
        size++;
        return true;
    }

    // O(1) average - Check if contains
    public boolean contains(T element) {
        int index = getIndex(element);
        if (buckets[index] == null) {
            return false;
        }
        return buckets[index].contains(element);
    }

    // O(1) average - Remove element
    public boolean remove(T element) {
        int index = getIndex(element);
        if (buckets[index] == null) {
            return false;
        }
        boolean removed = buckets[index].remove(element);
        if (removed) {
            size--;
        }
        return removed;
    }

    // O(n) - Get all elements
    public List<T> toList() {
        List<T> result = new ArrayList<>();
        for (LinkedList<T> bucket : buckets) {
            if (bucket != null) {
                result.addAll(bucket);
            }
        }
        return result;
    }

    // O(n + m) - Union with another set
    public CustomHashSet<T> union(CustomHashSet<T> other) {
        CustomHashSet<T> result = new CustomHashSet<>();
        for (T element : this.toList()) {
            result.add(element);
        }
        for (T element : other.toList()) {
            result.add(element);
        }
        return result;
    }

    // O(min(n,m)) - Intersection
    public CustomHashSet<T> intersection(CustomHashSet<T> other) {
        CustomHashSet<T> result = new CustomHashSet<>();
        CustomHashSet<T> smaller = this.size < other.size ? this : other;
        CustomHashSet<T> larger = this.size < other.size ? other : this;

        for (T element : smaller.toList()) {
            if (larger.contains(element)) {
                result.add(element);
            }
        }
        return result;
    }

    private int getIndex(T element) {
        return Math.abs(element.hashCode() % capacity);
    }

    private void resize() {
        capacity *= 2;
        LinkedList<T>[] oldBuckets = buckets;
        buckets = new LinkedList[capacity];
        size = 0;

        for (LinkedList<T> bucket : oldBuckets) {
            if (bucket != null) {
                for (T element : bucket) {
                    add(element);
                }
            }
        }
    }

    public int size() {
        return size;
    }

    public void clear() {
        buckets = new LinkedList[capacity];
        size = 0;
    }
}`

  const libraryCode = `// Using Java's Built-in HashSet
import java.util.HashSet;
import java.util.Set;

public class SetExample {
    public static void main(String[] args) {
        // Create HashSet
        Set<Integer> set = new HashSet<>();

        // O(1) - Add elements (no duplicates)
        set.add(10);
        set.add(20);
        set.add(30);
        set.add(10);  // Ignored, already exists

        // O(1) - Check if contains
        boolean contains = set.contains(20);  // true

        // O(1) - Remove element
        set.remove(20);

        // O(1) - Get size
        int size = set.size();

        // O(n) - Iterate through elements
        for (Integer num : set) {
            System.out.println(num);
        }

        // Set operations
        Set<Integer> set2 = new HashSet<>();
        set2.add(30);
        set2.add(40);
        set2.add(50);

        // O(n + m) - Union
        Set<Integer> union = new HashSet<>(set);
        union.addAll(set2);

        // O(min(n,m)) - Intersection
        Set<Integer> intersection = new HashSet<>(set);
        intersection.retainAll(set2);

        // O(n) - Difference
        Set<Integer> difference = new HashSet<>(set);
        difference.removeAll(set2);

        // O(n) - Check if subset
        boolean isSubset = set.containsAll(set2);

        // O(n) - Clear all elements
        set.clear();

        // Check if empty - O(1)
        boolean isEmpty = set.isEmpty();

        System.out.println("Union: " + union);
        System.out.println("Intersection: " + intersection);
        System.out.println("Difference: " + difference);
    }
}`

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Set Visualizer</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Set Visualization</h2>

        {/* Set Display */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 p-4 min-h-[100px] bg-gray-50 rounded-lg">
            {Array.from(set).length === 0 ? (
              <div className="text-gray-500 m-auto">Set is empty</div>
            ) : (
              Array.from(set).map((value) => (
                <div
                  key={value}
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-lg
                    transition-all duration-300
                    ${highlightValue === value
                      ? 'bg-yellow-300 border-yellow-500 scale-110'
                      : 'bg-purple-100 border-purple-500'
                    }`}
                >
                  {value}
                </div>
              ))
            )}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Size: {set.size} {set.size > 0 && `| Elements: {${Array.from(set).join(', ')}}`}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter value(s)"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleAdd}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
          <button
            onClick={handleRemove}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Remove
          </button>
          <button
            onClick={handleContains}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Contains
          </button>
          <button
            onClick={handleUnion}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Union
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <strong>Note:</strong> Sets do not allow duplicate elements. Adding an existing element will be ignored.
        </div>
      </div>

      <ComplexityInfo data={complexityData} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <CodeDisplay
          title="Scratch Implementation (HashSet)"
          code={scratchCode}
          language="java"
        />
        <CodeDisplay
          title="Library Implementation (HashSet)"
          code={libraryCode}
          language="java"
        />
      </div>
    </div>
  )
}

export default SetVisualizer
