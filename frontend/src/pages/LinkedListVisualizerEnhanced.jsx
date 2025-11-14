import React, { useState } from 'react'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'
import ComplexityEducation from '../components/ComplexityEducation'
import OperationVisualizer from '../components/OperationVisualizer'
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

      {/* Main Linked List Visualization */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Interactive Linked List Visualization</h2>

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

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
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
  )
}

export default LinkedListVisualizerEnhanced
