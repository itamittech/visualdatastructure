import React, { useState } from 'react'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function LinkedListVisualizer() {
  const [list, setList] = useState([
    { value: 10, id: 1 },
    { value: 20, id: 2 },
    { value: 30, id: 3 }
  ])
  const [inputValue, setInputValue] = useState('')
  const [inputPosition, setInputPosition] = useState('')
  const [highlightId, setHighlightId] = useState(null)
  const [message, setMessage] = useState('')
  const [nextId, setNextId] = useState(4)

  const handleInsertBeginning = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const newNode = { value, id: nextId }
    setList([newNode, ...list])
    setHighlightId(nextId)
    setNextId(nextId + 1)
    setMessage(`Inserted ${value} at the beginning`)
    setTimeout(() => setHighlightId(null), 1000)
  }

  const handleInsertEnd = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const newNode = { value, id: nextId }
    setList([...list, newNode])
    setHighlightId(nextId)
    setNextId(nextId + 1)
    setMessage(`Inserted ${value} at the end`)
    setTimeout(() => setHighlightId(null), 1000)
  }

  const handleInsertPosition = () => {
    const value = parseInt(inputValue)
    const position = parseInt(inputPosition)

    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    if (isNaN(position) || position < 0 || position > list.length) {
      setMessage(`Position must be between 0 and ${list.length}`)
      return
    }

    const newNode = { value, id: nextId }
    const newList = [...list]
    newList.splice(position, 0, newNode)
    setList(newList)
    setHighlightId(nextId)
    setNextId(nextId + 1)
    setMessage(`Inserted ${value} at position ${position}`)
    setTimeout(() => setHighlightId(null), 1000)
  }

  const handleDelete = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const index = list.findIndex(node => node.value === value)
    if (index !== -1) {
      const newList = [...list]
      newList.splice(index, 1)
      setList(newList)
      setMessage(`Deleted ${value} from the list`)
    } else {
      setMessage(`${value} not found in the list`)
    }
  }

  const handleSearch = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const node = list.find(n => n.value === value)
    if (node) {
      setHighlightId(node.id)
      setMessage(`Found ${value} in the list`)
      setTimeout(() => setHighlightId(null), 2000)
    } else {
      setMessage(`${value} not found in the list`)
    }
  }

  const complexityData = {
    operations: [
      { name: 'Access', time: 'O(n)', space: 'O(1)', description: 'Must traverse from head' },
      { name: 'Search', time: 'O(n)', space: 'O(1)', description: 'Linear search through nodes' },
      { name: 'Insert (beginning)', time: 'O(1)', space: 'O(1)', description: 'Just update head pointer' },
      { name: 'Insert (end)', time: 'O(n)', space: 'O(1)', description: 'Must traverse to end' },
      { name: 'Insert (middle)', time: 'O(n)', space: 'O(1)', description: 'Must traverse to position' },
      { name: 'Delete', time: 'O(n)', space: 'O(1)', description: 'Must find node first' },
    ]
  }

  const scratchCode = `// Linked List Implementation from Scratch
public class LinkedList<T> {
    private class Node {
        T data;
        Node next;

        Node(T data) {
            this.data = data;
            this.next = null;
        }
    }

    private Node head;
    private int size;

    public LinkedList() {
        this.head = null;
        this.size = 0;
    }

    // O(1) - Insert at beginning
    public void insertAtBeginning(T data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
        size++;
    }

    // O(n) - Insert at end
    public void insertAtEnd(T data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
        } else {
            Node current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
        size++;
    }

    // O(n) - Insert at position
    public void insertAtPosition(T data, int position) {
        if (position < 0 || position > size) {
            throw new IndexOutOfBoundsException();
        }
        if (position == 0) {
            insertAtBeginning(data);
            return;
        }

        Node newNode = new Node(data);
        Node current = head;
        for (int i = 0; i < position - 1; i++) {
            current = current.next;
        }
        newNode.next = current.next;
        current.next = newNode;
        size++;
    }

    // O(n) - Delete by value
    public boolean delete(T data) {
        if (head == null) return false;

        if (head.data.equals(data)) {
            head = head.next;
            size--;
            return true;
        }

        Node current = head;
        while (current.next != null) {
            if (current.next.data.equals(data)) {
                current.next = current.next.next;
                size--;
                return true;
            }
            current = current.next;
        }
        return false;
    }

    // O(n) - Search for element
    public boolean contains(T data) {
        Node current = head;
        while (current != null) {
            if (current.data.equals(data)) {
                return true;
            }
            current = current.next;
        }
        return false;
    }

    // O(n) - Get element at index
    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        Node current = head;
        for (int i = 0; i < index; i++) {
            current = current.next;
        }
        return current.data;
    }

    public int size() {
        return size;
    }
}`

  const libraryCode = `// Using Java's Built-in LinkedList
import java.util.LinkedList;

public class LinkedListExample {
    public static void main(String[] args) {
        // Create LinkedList
        LinkedList<Integer> list = new LinkedList<>();

        // O(1) - Add at beginning
        list.addFirst(10);

        // O(1) - Add at end
        list.addLast(20);
        list.add(30);  // Also adds at end

        // O(n) - Add at specific position
        list.add(1, 15);  // [10, 15, 20, 30]

        // O(1) - Get first/last
        int first = list.getFirst();
        int last = list.getLast();

        // O(n) - Get by index
        int value = list.get(2);

        // O(1) - Remove first
        list.removeFirst();

        // O(1) - Remove last
        list.removeLast();

        // O(n) - Remove by value
        list.remove(Integer.valueOf(20));

        // O(n) - Remove by index
        list.remove(0);

        // O(n) - Search
        boolean contains = list.contains(30);
        int index = list.indexOf(30);

        // Get size - O(1)
        int size = list.size();

        // Clear all elements - O(n)
        list.clear();

        System.out.println(list);
    }
}`

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Linked List Visualizer</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Linked List Visualization</h2>

        {/* Linked List Display */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center space-x-4 p-4 min-w-max">
            {list.length === 0 ? (
              <div className="text-gray-500">List is empty</div>
            ) : (
              <>
                {list.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <div
                      className={`node flex flex-col items-center ${
                        highlightId === node.id ? 'scale-110' : ''
                      }`}
                    >
                      <div
                        className={`w-20 h-20 border-2 rounded-lg flex items-center justify-center font-bold text-lg
                          ${highlightId === node.id
                            ? 'bg-yellow-300 border-yellow-500'
                            : 'bg-green-100 border-green-500'
                          }`}
                      >
                        {node.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Node {index}
                      </div>
                    </div>
                    {index < list.length - 1 && (
                      <div className="flex items-center">
                        <svg width="40" height="20">
                          <defs>
                            <marker
                              id="arrowhead"
                              markerWidth="10"
                              markerHeight="10"
                              refX="9"
                              refY="3"
                              orient="auto"
                            >
                              <polygon
                                points="0 0, 10 3, 0 6"
                                fill="#4B5563"
                              />
                            </marker>
                          </defs>
                          <line
                            x1="0"
                            y1="10"
                            x2="35"
                            y2="10"
                            className="arrow"
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
                <div className="flex items-center">
                  <svg width="40" height="20">
                    <line
                      x1="0"
                      y1="10"
                      x2="35"
                      y2="10"
                      className="arrow"
                    />
                  </svg>
                </div>
                <div className="w-20 h-20 border-2 border-gray-400 border-dashed rounded-lg flex items-center justify-center text-gray-400">
                  NULL
                </div>
              </>
            )}
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
              Position
            </label>
            <input
              type="number"
              value={inputPosition}
              onChange={(e) => setInputPosition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter position"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleInsertBeginning}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Insert at Beginning
          </button>
          <button
            onClick={handleInsertEnd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Insert at End
          </button>
          <button
            onClick={handleInsertPosition}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Insert at Position
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
          <button
            onClick={handleSearch}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Search
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
          title="Library Implementation (LinkedList)"
          code={libraryCode}
          language="java"
        />
      </div>
    </div>
  )
}

export default LinkedListVisualizer
