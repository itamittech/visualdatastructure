import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'
import OperationVisualizer from '../components/OperationVisualizer'
import JavaListImplementations from '../components/JavaListImplementations'
import {
  generateLinkedListSearchSteps,
  generateLinkedListInsertBeginningSteps
} from '../utils/operationSteps'

function LinkedListVisualizerEnhanced() {
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
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [operationSteps, setOperationSteps] = useState(null)

  const handleInsertBeginning = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    if (showLearningMode) {
      const steps = generateLinkedListInsertBeginningSteps(list, value)
      setOperationSteps({ operation: 'Insert at Beginning', steps })
    }

    const newNode = { value, id: nextId }
    setList([newNode, ...list])
    setHighlightId(nextId)
    setNextId(nextId + 1)
    setMessage(`Inserted ${value} at the beginning - O(1) operation!`)
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
    setMessage(`Inserted ${value} at the end - Had to traverse ${list.length} nodes: O(n)`)
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
    setMessage(`Inserted ${value} at position ${position} - Traversed ${position} nodes: O(n)`)
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
      setMessage(`Deleted ${value} - Traversed ${index + 1} nodes to find it: O(n)`)
    } else {
      setMessage(`${value} not found - Checked all ${list.length} nodes: O(n)`)
    }
  }

  const handleSearch = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    if (showLearningMode) {
      const steps = generateLinkedListSearchSteps(list, value)
      setOperationSteps({ operation: 'Linked List Search', steps })
    } else {
      const node = list.find(n => n.value === value)
      if (node) {
        setHighlightId(node.id)
        setMessage(`Found ${value} in the list`)
        setTimeout(() => setHighlightId(null), 2000)
      } else {
        setMessage(`${value} not found in the list`)
      }
    }
  }

  const complexityData = {
    operations: [
      {
        name: 'Access by Index',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Must traverse from head following "next" pointers. No direct memory calculation like arrays!'
      },
      {
        name: 'Search',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Must check each node sequentially until found. Similar to array search but can\'t skip nodes.'
      },
      {
        name: 'Insert at Beginning',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Just create node and update head pointer. No shifting needed! Major advantage over arrays.'
      },
      {
        name: 'Insert at End',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Must traverse all n nodes to reach end. With tail pointer, this becomes O(1)!'
      },
      {
        name: 'Insert at Position',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Must traverse to position (O(n)), then update pointers (O(1)). Total: O(n).'
      },
      {
        name: 'Delete',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Must find node first (O(n)), then update pointers (O(1)). Finding dominates: O(n).'
      },
    ]
  }

  const scratchCode = `// Linked List Implementation from Scratch
public class LinkedList<T> {
    /**
     * Node is the building block of linked list.
     * Each node contains:
     * 1. Data (the actual value)
     * 2. Next pointer (reference to next node)
     *
     * This is KEY difference from arrays:
     * - Arrays: Elements in contiguous memory [10][20][30][40]
     * - Linked List: Nodes scattered, connected by pointers
     *   [10|•]-->[20|•]-->[30|•]-->[40|null]
     */
    private class Node {
        T data;
        Node next;

        Node(T data) {
            this.data = data;
            this.next = null;
        }
    }

    private Node head;  // Points to first node
    private int size;

    /**
     * WHY O(1)? Just pointer manipulation!
     *
     * Steps:
     * 1. Create new node: O(1)
     * 2. Point new node's next to current head: O(1)
     * 3. Update head to new node: O(1)
     * Total: O(1)
     *
     * Example: Insert 5 into [10→20→30]
     * Step 1: Create [5|?]
     * Step 2: [5|•]-->10→20→30
     * Step 3: head now points to 5
     * Result: 5→10→20→30
     *
     * No traversal! No shifting! Just pointer updates!
     * This is HUGE advantage over array insert at beginning (O(n))
     */
    public void insertAtBeginning(T data) {
        Node newNode = new Node(data);
        newNode.next = head;  // Point to current first
        head = newNode;        // Update head
        size++;
    }

    /**
     * WHY O(n)? Must traverse to end!
     *
     * Steps:
     * 1. Start at head: O(1)
     * 2. Follow next pointers until current.next == null: O(n)
     * 3. Set current.next = newNode: O(1)
     * Total: O(n) - dominated by traversal
     *
     * Example: Insert 40 into 10→20→30→null
     * current = head (10)
     * current.next != null, move to 20
     * current.next != null, move to 30
     * current.next == null, found end!
     * Set 30.next = 40
     * Result: 10→20→30→40→null
     *
     * We visited n nodes to find end.
     *
     * OPTIMIZATION: Keep tail pointer for O(1) insert at end!
     */
    public void insertAtEnd(T data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            size++;
            return;
        }

        Node current = head;
        // This loop runs n times!
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
        size++;
    }

    /**
     * WHY O(n)? Must traverse to position!
     *
     * Example: Insert 25 at position 2 in 10→20→30→40
     * 1. Start at head
     * 2. Move forward position-1 times: O(n)
     * 3. Insert: newNode.next = current.next: O(1)
     * 4. current.next = newNode: O(1)
     * Total: O(n)
     *
     * Result: 10→20→25→30→40
     *
     * Note: Even though insertion itself is O(1),
     * getting to position takes O(n), so total is O(n).
     */
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

        // Traverse to position - O(n)
        for (int i = 0; i < position - 1; i++) {
            current = current.next;
        }

        // Update pointers - O(1)
        newNode.next = current.next;
        current.next = newNode;
        size++;
    }

    /**
     * WHY O(n)? Must find the node!
     *
     * Steps:
     * 1. Check if head is target: O(1)
     * 2. Traverse until current.next == target: O(n)
     * 3. Skip target: current.next = current.next.next: O(1)
     * Total: O(n)
     *
     * Example: Delete 20 from 10→20→30→40
     * current = 10
     * current.next (20) == target!
     * Set 10.next = 20.next (which is 30)
     * Result: 10→30→40
     *
     * The challenge: We need node BEFORE target
     * to update its next pointer!
     */
    public boolean delete(T data) {
        if (head == null) return false;

        // Special case: deleting head
        if (head.data.equals(data)) {
            head = head.next;
            size--;
            return true;
        }

        Node current = head;
        // Traverse to find node before target - O(n)
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

    /**
     * WHY O(n)? Must check each node!
     *
     * Unlike arrays where we can calculate address,
     * we MUST follow the chain of next pointers.
     * No shortcuts!
     *
     * Best case: O(1) - element is head
     * Worst case: O(n) - element at end or not found
     * Average case: O(n/2) = O(n)
     */
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

    /**
     * WHY O(n)? Must traverse to index!
     *
     * Key difference from array:
     * - Array get(5): ONE calculation
     * - LinkedList get(5): FIVE pointer follows
     *
     * This is why arrays beat linked lists for random access!
     */
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
}`

  const libraryCode = `// Using Java's Built-in LinkedList
import java.util.LinkedList;

/**
 * Java's LinkedList is a doubly-linked list
 * Each node has both 'next' AND 'prev' pointers
 * This makes some operations faster!
 */
public class LinkedListExample {
    public static void main(String[] args) {
        // Create LinkedList
        LinkedList<Integer> list = new LinkedList<>();

        // O(1) - Add at beginning (updatesfirst pointer)
        list.addFirst(10);
        // Why O(1)? Just create node and update head!

        // O(1) - Add at end (Java keeps tail pointer!)
        list.addLast(20);
        list.add(30);  // Also adds at end
        // Why O(1)? Because doubly-linked list maintains tail!

        // O(n) - Add at specific position
        list.add(1, 15);  // [10, 15, 20, 30]
        // Why O(n)? Must traverse to position first

        // O(1) - Get first/last (direct pointer access)
        int first = list.getFirst();
        int last = list.getLast();
        // Why O(1)? Direct access via head/tail pointers!

        // O(n) - Get by index (must traverse)
        int value = list.get(2);
        // Why O(n)? Follow next pointers 2 times
        // Arrays would be O(1) here!

        // O(1) - Remove first
        list.removeFirst();
        // Why O(1)? head = head.next

        // O(1) - Remove last (because doubly-linked!)
        list.removeLast();
        // Why O(1)? Have direct pointer to last node!

        // O(n) - Remove by value (must find it first)
        list.remove(Integer.valueOf(20));
        // Why O(n)? Must search through list

        // O(n) - Remove by index
        list.remove(0);
        // Why O(n)? Must traverse to index
        // (Though first/last are O(1))

        // O(n) - Search
        boolean contains = list.contains(30);
        int index = list.indexOf(30);
        // Why O(n)? Must check each node sequentially

        // O(1) - Get size (maintained as variable)
        int size = list.size();

        System.out.println(list);

        /* WHEN TO USE LINKED LIST?
         *
         * Use Linked List when:
         * ✓ Frequent insertions/deletions at beginning
         * ✓ Don't need random access by index
         * ✓ Size changes dramatically
         * ✓ Implementing queue/stack
         *
         * Use Array when:
         * ✓ Need fast access by index
         * ✓ Size relatively stable
         * ✓ Mostly sequential access
         * ✓ Less insertions in middle
         */
    }
}`

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Linked List - Deep Dive</h1>
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is a Linked List?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            A <strong>linked list</strong> is a linear data structure where elements (called <strong>nodes</strong>) are NOT stored in contiguous memory.
            Instead, each node contains data and a <strong>pointer (reference)</strong> to the next node, forming a chain.
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-green-700 mb-3">🔗 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Node-Based Structure:</strong> Each node contains: (1) data value, (2) pointer to next node.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Dynamic Size:</strong> Can grow/shrink easily - just update pointers! No need to resize like arrays.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Non-Contiguous Memory:</strong> Nodes can be scattered anywhere in memory, connected by pointers.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>O(1) Insert/Delete at Beginning:</strong> Just update the head pointer - no shifting needed!</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Sequential Access:</strong> Must traverse from head to reach any element - no random access.</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-100 rounded-lg p-5">
            <h4 className="font-bold text-emerald-900 mb-3">📊 Linked List vs Array - The Trade-offs</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <strong className="text-green-700">✓ Linked List Wins:</strong>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Insert at beginning: O(1) vs O(n)</li>
                  <li>• Delete at beginning: O(1) vs O(n)</li>
                  <li>• Dynamic size: Easy vs Expensive</li>
                  <li>• No wasted space from pre-allocation</li>
                </ul>
              </div>
              <div className="bg-white rounded p-3">
                <strong className="text-red-700">✗ Array Wins:</strong>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Access by index: O(n) vs O(1)</li>
                  <li>• Memory locality: Poor vs Excellent</li>
                  <li>• Cache performance: Worse vs Better</li>
                  <li>• Memory overhead: Higher (pointers) vs Lower</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">✓ When to Use Linked Lists</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Frequent insertions/deletions at beginning or middle</li>
                <li>• Don\'t know size in advance and it changes a lot</li>
                <li>• Implementing stacks, queues, or adjacency lists (graphs)</li>
                <li>• Rarely need random access by index</li>
                <li>• Want to avoid the cost of array resizing</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use Linked Lists</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need fast random access by index (use ArrayList)</li>
                <li>• Memory is very limited (extra pointer overhead)</li>
                <li>• Mainly iterating sequentially (array cache-friendly)</li>
                <li>• Need to frequently access middle elements</li>
                <li>• Binary search or sorted operations (TreeSet better)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Browser History:</strong>
                <p className="text-gray-600 mt-1">Back/forward buttons - doubly linked list allows easy navigation both directions</p>
              </div>
              <div>
                <strong className="text-gray-800">Music Playlist:</strong>
                <p className="text-gray-600 mt-1">Next/previous songs, easy to add/remove songs without shifting</p>
              </div>
              <div>
                <strong className="text-gray-800">Undo/Redo:</strong>
                <p className="text-gray-600 mt-1">Text editors maintain action history as linked list of states</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">🎯 Why Pointers Change Everything</h4>
            <p className="text-gray-700">
              The key insight: To insert at the <strong>beginning of a linked list</strong>, you only need to:
              <br/>
              <code className="bg-white px-2 py-1 rounded font-mono block mt-2">
                newNode.next = head; // Point new node to current head<br/>
                head = newNode;      // Update head to new node
              </code>
              <br/>
              That\'s it! <strong>O(1)</strong> - just two pointer updates, no matter how big the list is!
              <br/><br/>
              Compare to array: Insert at beginning requires shifting ALL n elements → O(n)
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
                Perform Search or Insert at Beginning to see step-by-step visualization.
                Watch how we traverse nodes one by one and why certain operations are faster than others!
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
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Linked List Visualization</h2>
        </div>

        {/* Linked List Display */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center space-x-4 p-4 min-w-max bg-gray-50 rounded-lg">
            {list.length === 0 ? (
              <div className="text-gray-500 text-lg">List is empty - head → NULL</div>
            ) : (
              <>
                {list.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <div className={`node transition-all duration-300 ${
                      highlightId === node.id ? 'scale-110' : ''
                    }`}>
                      <div className="text-xs text-gray-500 mb-1 text-center font-semibold">
                        {index === 0 ? 'HEAD →' : `Node ${index}`}
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-24 h-24 border-2 rounded-lg flex items-center justify-center font-bold text-xl ${
                            highlightId === node.id
                              ? 'bg-yellow-300 border-yellow-500 shadow-xl'
                              : 'bg-green-100 border-green-500'
                          }`}
                        >
                          <div className="text-center">
                            <div>{node.value}</div>
                            <div className="text-xs text-gray-500 mt-1">data</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 border-2 border-green-500 rounded bg-white ml-1 flex items-center justify-center text-xs">
                          next
                        </div>
                      </div>
                    </div>
                    {index < list.length - 1 && (
                      <div className="flex items-center">
                        <svg width="60" height="30">
                          <defs>
                            <marker
                              id="arrowhead"
                              markerWidth="10"
                              markerHeight="10"
                              refX="9"
                              refY="3"
                              orient="auto"
                            >
                              <polygon points="0 0, 10 3, 0 6" fill="#4B5563" />
                            </marker>
                          </defs>
                          <line x1="0" y1="15" x2="55" y2="15" className="arrow" />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
                <div className="flex items-center">
                  <svg width="60" height="30">
                    <line x1="0" y1="15" x2="55" y2="15" className="arrow" />
                  </svg>
                </div>
                <div className="w-20 h-20 border-2 border-gray-400 border-dashed rounded-lg flex items-center justify-center text-gray-400 font-bold">
                  NULL
                </div>
              </>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-3 bg-green-50 p-3 rounded">
            <strong>Memory Layout:</strong> Unlike arrays, nodes are NOT in contiguous memory.
            Each node points to the next via memory address (pointer). This is why we can't jump to middle - must follow the chain!
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="Enter value"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position (0 to {list.length})
            </label>
            <input
              type="number"
              value={inputPosition}
              onChange={(e) => setInputPosition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="Enter position"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleInsertBeginning}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Insert at beginning - O(1)"
          >
            Insert Beginning → O(1) ⚡
          </button>
          <button
            onClick={handleInsertEnd}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Insert at end - O(n)"
          >
            Insert End → O(n)
          </button>
          <button
            onClick={handleInsertPosition}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Insert at position - O(n)"
          >
            Insert Position → O(n)
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Delete by value - O(n)"
          >
            Delete → O(n)
          </button>
          <button
            onClick={handleSearch}
            className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            title="Search for value - O(n)"
          >
            Search → O(n)
          </button>
        </div>

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
            <strong>Result:</strong> {message}
          </div>
        )}
      </div>

      <ComplexityInfo data={complexityData} />

      {/* Java List Implementations - LinkedList is also a List! */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Java List Implementations - Complete Guide
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          LinkedList is one of Java's List implementations! Below you'll find ALL List types including
          ArrayList vs LinkedList comparison, Deque operations, Vector, CopyOnWriteArrayList, and Java 21
          Sequenced Collections features.
        </p>
        <JavaListImplementations />
      </div>

      {/* STEP 3: Code Implementation Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-purple-500">
        <div className="flex items-center mb-6">
          <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">3</div>
          <h2 className="text-3xl font-bold text-gray-800">Code: Implementation Details</h2>
        </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <CodeDisplay
          title="Singly Linked List from Scratch (detailed explanations)"
          code={scratchCode}
          language="java"
        />
        <CodeDisplay
          title="Using Java's LinkedList (doubly-linked)"
          code={libraryCode}
          language="java"
        />
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
                <li>Then return here for deep dives into memory, CPU cache, concurrency, and production patterns</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Memory & Cache Performance */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">💾 Why LinkedList is Slower in Practice</h3>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <h4 className="font-semibold text-red-900 mb-2">The Cache Miss Problem</h4>
              <pre className="bg-slate-900 text-yellow-400 p-3 rounded text-xs overflow-x-auto">
{`// Traversing LinkedList = Pointer Chasing Nightmare
Node current = head;
while (current != null) {
    process(current.data);     // Process
    current = current.next;    // CACHE MISS! 🚨
}

Each "current.next" loads from random memory location:
┌──────────────────────────────────────────────┐
│ CPU fetches node at 0x1000                   │
│ → next pointer points to 0x8FA0              │
│ → CPU must fetch from 0x8FA0 (different page)│
│ → STALL ~200 CPU cycles waiting for RAM     │
└──────────────────────────────────────────────┘

Modern CPUs: 3-4 GHz = 0.25-0.33ns per cycle
RAM latency: ~50-100ns = 150-300 wasted cycles per node!

Real benchmark (JMH, 1M elements):
ArrayList iteration:     2.1ms  (CPU happy, prefetching)
LinkedList iteration:   18.5ms  (CPU starved, waiting)
Difference: 8.8x slower!`}
              </pre>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Memory Overhead Comparison</h4>
                <pre className="bg-white border p-3 rounded text-xs">
{`// ArrayList (Integer)
[ref][ref][ref][ref]...
4 bytes × n elements = 4n bytes
Overhead: ~0-50% (resize waste)

// LinkedList (Integer)
Node {
  Integer data;     // 4 bytes ref
  Node next;        // 4 bytes ref
  Object header;    // 12 bytes
  Padding;          // 4 bytes
} = 24 bytes per node!

1M integers:
ArrayList:  ~4MB + array overhead
LinkedList: ~24MB (6x larger!)

Plus: GC pressure from millions of Node objects`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">When LinkedList Actually Wins</h4>
                <pre className="bg-green-50 border-l-4 border-green-600 p-3 rounded text-xs">
{`// Scenario: Frequent head insertions
// 100K insertions at position 0

ArrayList.add(0, x):
for (int i = size; i > 0; i--) {
    arr[i] = arr[i-1];  // Shift ALL
}
// O(n) per insert = O(n²) total
// ~5 billion operations! 💀

LinkedList.addFirst(x):
newNode.next = head;
head = newNode;
// O(1) per insert = O(n) total
// Just 100K operations ⚡

Benchmark (100K head inserts):
ArrayList:     4,200ms 🐌
LinkedList:       12ms ⚡
Speedup: 350x faster!`}
                </pre>
              </div>
            </div>
          </div>

          {/* Doubly Linked List */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🔗 Java's LinkedList: Doubly-Linked Implementation</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold text-gray-800 mb-2">Why Doubly-Linked?</h4>
                <pre className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`// Singly-Linked: Can only traverse forward
class Node {
    int data;
    Node next;  // One direction only
}

// Doubly-Linked: Bidirectional traversal + O(1) removals
class Node {
    int data;
    Node next;
    Node prev;  // Can go backwards!
}

// Java's actual implementation (simplified)
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;  // Double linking

    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}

LinkedList maintains:
- first (head pointer)
- last  (tail pointer)
- size  (cached for O(1) access)

Benefits:
✓ addLast()/removeLast() = O(1) (singly-linked would be O(n))
✓ Efficient Deque operations (both ends)
✓ ListIterator can traverse backwards
Cost:
✗ 8 more bytes per node (prev pointer + padding)
✗ More pointer updates on insert/delete`}
                </pre>
              </div>

              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">LinkedList as Deque (Production Pattern)</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// LinkedList implements Deque<E>
Deque<Task> taskQueue = new LinkedList<>();

// O(1) operations at both ends!
taskQueue.addFirst(highPriorityTask);   // Urgent
taskQueue.addLast(normalTask);          // Regular
Task next = taskQueue.pollFirst();       // FIFO
Task last = taskQueue.pollLast();        // LIFO

// Use cases:
✓ LRU Cache implementation (add/remove at both ends)
✓ Undo/Redo stacks (push/pop from either end)
✓ Browser history (back/forward navigation)
✓ Task scheduling (priority insertion)

// Anti-pattern: Random access
taskQueue.get(5000);  // O(n) - Terrible!
// LinkedList has to traverse 5000 nodes

// When to choose LinkedList over ArrayDeque:
❓ Honestly? Rarely in modern Java.
ArrayDeque is usually faster even for deque operations!

Benchmark (10K operations):
ArrayDeque:   0.8ms ⚡
LinkedList:   1.2ms
Reason: ArrayDeque has better cache locality`}
                </pre>
              </div>
            </div>
          </div>

          {/* Production Gotchas */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">⚠️ Production Gotchas & Myths</h3>

            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-600 p-4">
                <h4 className="font-semibold text-red-900 mb-2">Myth #1: "LinkedList is better for insertions"</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Reality:</strong> Only true for insertions at <em>known positions</em> (head/tail).
                  If you need to find the position first, you've already paid O(n) cost!
                </p>
                <pre className="bg-white p-3 rounded text-xs">
{`// Insert after finding element with value 42
// LinkedList
for (Node n = head; n != null; n = n.next) {  // O(n) search
    if (n.data == 42) {
        Node newNode = new Node(99);
        newNode.next = n.next;  // O(1) insert
        n.next = newNode;
        break;
    }
}
Total: O(n)  // Search dominates

// ArrayList
int index = list.indexOf(42);      // O(n) search
list.add(index + 1, 99);            // O(n) shift
Total: O(n)  // But ArrayList has better cache, so faster in practice!

// Key insight: If you're searching anyway, the insert cost is dominated by search.
// ArrayList's cache-friendly search usually wins.`}
                </pre>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Myth #2: "Use LinkedList for unknown size"</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Reality:</strong> ArrayList with default capacity or initial size estimate is almost always better.
                </p>
                <pre className="bg-white p-3 rounded text-xs">
{`// Scenario: Adding 50K elements, size unknown
// LinkedList: 24 bytes × 50K = 1.2MB + Node object overhead
//             Fragmented across heap
//             Poor cache locality

// ArrayList: 4 bytes × 50K = 200KB (after resizes)
//            Contiguous memory
//            Excellent cache locality
//            ~5-10 resize operations (acceptable)

// Even with resizes, ArrayList wins on:
✓ Memory usage (6x less)
✓ Iteration speed (10x faster)
✓ GC pressure (1 object vs 50K objects)
✓ Random access (O(1) vs O(n))

The ONLY time to prefer LinkedList:
→ Proven profiling shows ArrayList resize is your bottleneck
→ AND you have frequent head/tail insertions
→ AND you rarely iterate or access by index
(This is <1% of use cases)`}
                </pre>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4">
                <h4 className="font-semibold text-green-900 mb-2">✓ Legitimate LinkedList Use Case</h4>
                <pre className="bg-white p-3 rounded text-xs">
{`// LRU Cache with LinkedHashMap (uses doubly-linked list internally)
class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);  // accessOrder = true
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}

// Usage
LRUCache<String, User> cache = new LRUCache<>(1000);
cache.put(userId, user);  // O(1)
User u = cache.get(userId);  // O(1) + moves to end (MRU)

// Why linked list here?
✓ Need to track access order (doubly-linked maintains it)
✓ Need to remove eldest (O(1) with tail pointer)
✓ Need O(1) lookup (HashMap provides this)
✓ Rare insertions/deletions relative to lookups

// This is actually a great use of linked structure!
// But note: Still uses HashMap for the actual lookups.`}
                </pre>
              </div>
            </div>
          </div>

          {/* Interview Problems */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🎯 Interview-Level LinkedList Problems</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem: Reverse LinkedList (Facebook/Amazon)</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold mb-2">Iterative: O(n) time, O(1) space</p>
                    <pre className="text-xs bg-white p-2 rounded">
{`Node reverse(Node head) {
    Node prev = null;
    Node curr = head;

    while (curr != null) {
        Node next = curr.next;  // Save
        curr.next = prev;       // Reverse
        prev = curr;            // Move
        curr = next;            // Move
    }
    return prev;  // New head
}

// Trace: 1→2→3→null
// Step 1: null←1  2→3→null
// Step 2: null←1←2  3→null
// Step 3: null←1←2←3
// Result: 3→2→1→null ✓`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-2">Recursive: O(n) time, O(n) space</p>
                    <pre className="text-xs bg-white p-2 rounded">
{`Node reverse(Node head) {
    if (head == null || head.next == null)
        return head;

    Node newHead = reverse(head.next);
    head.next.next = head;  // Reverse
    head.next = null;       // Cut old link
    return newHead;
}

// Recursion stack visualization:
// reverse(1) waits for
//   reverse(2) waits for
//     reverse(3) returns 3
//   2.next.next = 2 → 3→2
// 1.next.next = 1 → 3→2→1
// Beautiful but O(n) stack space`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem: Detect Cycle in LinkedList (Google/Microsoft)</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`// Floyd's Tortoise & Hare Algorithm
boolean hasCycle(Node head) {
    if (head == null) return false;

    Node slow = head;
    Node fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;           // Move 1 step
        fast = fast.next.next;      // Move 2 steps

        if (slow == fast) {
            return true;  // They met - cycle exists!
        }
    }
    return false;  // Fast reached end - no cycle
}

// Why this works mathematically:
// If there's a cycle of length C,
// slow and fast will meet within C iterations after entering cycle.
//
// Proof: In each iteration, fast gains 1 position on slow.
// If they start at same position in cycle, fast will lap slow
// within C steps (worst case = full cycle).
//
// Time: O(n), Space: O(1) - Brilliant! ✨
//
// Follow-up: Find cycle start point?
// Reset slow to head, move both at same speed → they meet at start!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem: Merge Two Sorted Lists (LeetCode Easy, asked everywhere)</h4>
                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`Node mergeTwoLists(Node l1, Node l2) {
    Node dummy = new Node(0);  // Sentinel node trick
    Node tail = dummy;

    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            tail.next = l1;
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }

    // Attach remaining (one list exhausted)
    tail.next = (l1 != null) ? l1 : l2;

    return dummy.next;  // Skip sentinel
}

// Dummy node pattern:
// Instead of special-casing the first node,
// create a dummy and always use tail.next.
// Simplifies code and avoids null checks.
//
// Time: O(n + m), Space: O(1) - in-place merge!
//
// Common mistake: Creating new nodes instead of reusing
// → Wastes memory and time
// ✓ Just redirect pointers! No new allocations needed.`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-orange-600 mb-4">💡 Array vs Linked List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white">
                <th className="p-3 text-left">Operation</th>
                <th className="p-3 text-center">Array</th>
                <th className="p-3 text-center">Linked List</th>
                <th className="p-3 text-left">Winner & Why?</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Access by index</td>
                <td className="p-3 text-center text-green-600 font-bold">O(1) ✓</td>
                <td className="p-3 text-center text-red-600">O(n)</td>
                <td className="p-3">Array - Direct memory calculation</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-semibold">Insert at beginning</td>
                <td className="p-3 text-center text-red-600">O(n)</td>
                <td className="p-3 text-center text-green-600 font-bold">O(1) ✓</td>
                <td className="p-3">Linked List - Just update head pointer</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Insert at end</td>
                <td className="p-3 text-center text-green-600 font-bold">O(1)* ✓</td>
                <td className="p-3 text-center text-orange-600">O(n) or O(1)*</td>
                <td className="p-3">Tie with tail pointer, Array with amortized</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-semibold">Search</td>
                <td className="p-3 text-center text-gray-600">O(n)</td>
                <td className="p-3 text-center text-gray-600">O(n)</td>
                <td className="p-3">Tie - Both must check sequentially</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Memory overhead</td>
                <td className="p-3 text-center text-green-600 font-bold">Low ✓</td>
                <td className="p-3 text-center text-red-600">High</td>
                <td className="p-3">Array - No extra pointers needed</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-semibold">Cache performance</td>
                <td className="p-3 text-center text-green-600 font-bold">Excellent ✓</td>
                <td className="p-3 text-center text-red-600">Poor</td>
                <td className="p-3">Array - Contiguous memory is cache-friendly</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  )
}

export default LinkedListVisualizerEnhanced
