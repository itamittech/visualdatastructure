import React, { useState } from 'react'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function ArrayVisualizer() {
  const [array, setArray] = useState([10, 20, 30, 40, 50])
  const [inputValue, setInputValue] = useState('')
  const [inputIndex, setInputIndex] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(null)
  const [message, setMessage] = useState('')

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

    const index = array.indexOf(value)
    if (index !== -1) {
      setHighlightIndex(index)
      setMessage(`Found ${value} at index ${index}`)
      setTimeout(() => setHighlightIndex(null), 2000)
    } else {
      setMessage(`${value} not found in array`)
    }
  }

  const handleAccess = () => {
    const index = parseInt(inputIndex)

    if (isNaN(index) || index < 0 || index >= array.length) {
      setMessage(`Index must be between 0 and ${array.length - 1}`)
      return
    }

    setHighlightIndex(index)
    setMessage(`Value at index ${index} is ${array[index]}`)
    setTimeout(() => setHighlightIndex(null), 2000)
  }

  const complexityData = {
    operations: [
      { name: 'Access', time: 'O(1)', space: 'O(1)', description: 'Direct access using index' },
      { name: 'Search', time: 'O(n)', space: 'O(1)', description: 'Linear search through elements' },
      { name: 'Insert (end)', time: 'O(1)*', space: 'O(1)', description: '*Amortized, may need resizing' },
      { name: 'Insert (middle)', time: 'O(n)', space: 'O(1)', description: 'Need to shift elements' },
      { name: 'Delete', time: 'O(n)', space: 'O(1)', description: 'Need to shift elements' },
    ]
  }

  const scratchCode = `// Array Implementation from Scratch
public class CustomArray<T> {
    private Object[] data;
    private int size;
    private int capacity;

    public CustomArray(int initialCapacity) {
        this.capacity = initialCapacity;
        this.data = new Object[capacity];
        this.size = 0;
    }

    // O(1) - Access element by index
    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        return (T) data[index];
    }

    // O(1) amortized - Add element at end
    public void add(T element) {
        if (size == capacity) {
            resize();
        }
        data[size++] = element;
    }

    // O(n) - Insert at specific index
    public void insert(int index, T element) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException();
        }
        if (size == capacity) {
            resize();
        }
        // Shift elements to the right
        for (int i = size; i > index; i--) {
            data[i] = data[i - 1];
        }
        data[index] = element;
        size++;
    }

    // O(n) - Remove element at index
    public T remove(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        T removed = (T) data[index];
        // Shift elements to the left
        for (int i = index; i < size - 1; i++) {
            data[i] = data[i + 1];
        }
        data[--size] = null;
        return removed;
    }

    // O(n) - Search for element
    public int indexOf(T element) {
        for (int i = 0; i < size; i++) {
            if (data[i].equals(element)) {
                return i;
            }
        }
        return -1;
    }

    private void resize() {
        capacity *= 2;
        Object[] newData = new Object[capacity];
        System.arraycopy(data, 0, newData, 0, size);
        data = newData;
    }

    public int size() {
        return size;
    }
}`

  const libraryCode = `// Using Java's Built-in ArrayList
import java.util.ArrayList;

public class ArrayExample {
    public static void main(String[] args) {
        // Create ArrayList
        ArrayList<Integer> list = new ArrayList<>();

        // O(1) - Add elements
        list.add(10);
        list.add(20);
        list.add(30);

        // O(1) - Access by index
        int value = list.get(0);  // returns 10

        // O(n) - Insert at specific index
        list.add(1, 15);  // [10, 15, 20, 30]

        // O(n) - Remove by index
        list.remove(2);  // removes 20

        // O(n) - Search for element
        int index = list.indexOf(30);

        // O(1) - Get size
        int size = list.size();

        // O(n) - Check if contains
        boolean contains = list.contains(15);

        // Set element at index - O(1)
        list.set(0, 100);

        System.out.println(list);
    }
}`

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Array Visualizer</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Array Visualization</h2>

        {/* Array Display */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 p-4 min-w-max">
            {array.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">Index {index}</div>
                <div
                  className={`array-cell w-16 h-16 border-2 flex items-center justify-center font-bold text-lg
                    ${highlightIndex === index
                      ? 'bg-yellow-300 border-yellow-500'
                      : 'bg-blue-100 border-blue-500'
                    }`}
                >
                  {value}
                </div>
              </div>
            ))}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter value"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Index
            </label>
            <input
              type="number"
              value={inputIndex}
              onChange={(e) => setInputIndex(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter index"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleInsert}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Insert
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
          <button
            onClick={handleSearch}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
          <button
            onClick={handleAccess}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Access
          </button>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            {message}
          </div>
        )}
      </div>

      <ComplexityInfo data={complexityData} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <CodeDisplay
          title="Scratch Implementation"
          code={scratchCode}
          language="java"
        />
        <CodeDisplay
          title="Library Implementation (ArrayList)"
          code={libraryCode}
          language="java"
        />
      </div>
    </div>
  )
}

export default ArrayVisualizer
