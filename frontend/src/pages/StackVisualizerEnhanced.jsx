import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'
import JavaStackImplementations from '../components/JavaStackImplementations'

function StackVisualizerEnhanced() {
  const [stack, setStack] = useState([10, 20, 30])
  const [inputValue, setInputValue] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(null)
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)

  const handlePush = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      setMessage('Please enter a valid number')
      return
    }

    const newStack = [...stack, value]
    setStack(newStack)
    setHighlightIndex(newStack.length - 1)
    setMessage(`Pushed ${value} onto stack - New top element! O(1) operation`)
    setTimeout(() => setHighlightIndex(null), 1000)
  }

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty - Cannot pop!')
      return
    }

    const poppedValue = stack[stack.length - 1]
    const newStack = stack.slice(0, -1)
    setStack(newStack)
    setMessage(`Popped ${poppedValue} from stack - Removed top element! O(1) operation`)
  }

  const handlePeek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty - Nothing to peek!')
      return
    }

    const topValue = stack[stack.length - 1]
    setHighlightIndex(stack.length - 1)
    setMessage(`Peek: ${topValue} is at the top - View without removing! O(1) operation`)
    setTimeout(() => setHighlightIndex(null), 2000)
  }

  const handleClear = () => {
    setStack([])
    setMessage('Stack cleared - All elements removed')
  }

  const complexityData = {
    operations: [
      {
        name: 'Push',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Add element to top of stack. Simply place at end of array - constant time!'
      },
      {
        name: 'Pop',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Remove and return top element. Access last element and remove it - constant time!'
      },
      {
        name: 'Peek/Top',
        time: 'O(1)',
        space: 'O(1)',
        description: 'View top element without removing. Just read last element - constant time!'
      },
      {
        name: 'isEmpty',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Check if stack is empty. Simply check if size == 0 - constant time!'
      },
      {
        name: 'Size',
        time: 'O(1)',
        space: 'O(1)',
        description: 'Get number of elements. Return stored size variable - constant time!'
      },
      {
        name: 'Search',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Find element in stack. Must check from top to bottom - linear time in worst case.'
      },
    ]
  }

  const scratchCode = `// Stack Implementation from Scratch (Array-Based)
public class Stack<T> {
    private T[] array;
    private int top;           // Index of top element
    private int capacity;

    /**
     * STACK: Last In, First Out (LIFO)
     * Think of it like a stack of plates!
     * - You add plates on top (push)
     * - You remove plates from top (pop)
     * - You can only see the top plate (peek)
     */

    @SuppressWarnings("unchecked")
    public Stack(int capacity) {
        this.capacity = capacity;
        this.array = (T[]) new Object[capacity];
        this.top = -1;  // Empty stack
    }

    /**
     * WHY O(1)? Just place at next position!
     *
     * Push operation:
     * 1. Check if stack is full: O(1)
     * 2. Increment top: O(1)
     * 3. Place element at array[top]: O(1)
     * Total: O(1)
     *
     * Example: Stack = [10, 20, 30], top=2
     * Push 40:
     *   top++ → top=3
     *   array[3] = 40
     *   Result: [10, 20, 30, 40], top=3
     */
    public void push(T element) {
        if (isFull()) {
            resize();  // Dynamic resizing (amortized O(1))
        }
        array[++top] = element;  // Increment then assign
    }

    /**
     * WHY O(1)? Just remove from known position!
     *
     * Pop operation:
     * 1. Check if empty: O(1)
     * 2. Get element at top: O(1)
     * 3. Decrement top: O(1)
     * Total: O(1)
     *
     * Example: Stack = [10, 20, 30, 40], top=3
     * Pop:
     *   value = array[3] = 40
     *   top-- → top=2
     *   Result: [10, 20, 30], top=2
     *
     * Note: We don't need to actually "delete" from array!
     * Just move the top pointer down. Old value is orphaned.
     */
    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        T element = array[top];
        array[top] = null;  // Help GC
        top--;
        return element;
    }

    /**
     * WHY O(1)? Just read from known position!
     *
     * Peek operation:
     * 1. Check if empty: O(1)
     * 2. Return array[top]: O(1)
     * Total: O(1)
     *
     * Unlike pop, peek doesn't modify the stack!
     * Just looks at top element.
     */
    public T peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return array[top];
    }

    /**
     * WHY O(1)? Just check a variable!
     */
    public boolean isEmpty() {
        return top == -1;
    }

    /**
     * WHY O(1)? Just check against capacity!
     */
    public boolean isFull() {
        return top == capacity - 1;
    }

    /**
     * WHY O(1)? Just return variable!
     */
    public int size() {
        return top + 1;  // top is 0-based index
    }

    /**
     * WHY O(n)? Must check all elements!
     *
     * Search from top to bottom
     * Returns distance from top (1-based)
     * Returns -1 if not found
     *
     * Example: Stack = [10, 20, 30, 40], top=3
     * search(20):
     *   Check array[3]=40: No
     *   Check array[2]=30: No
     *   Check array[1]=20: Yes! Distance=3
     *   Return 3
     */
    public int search(T element) {
        for (int i = top; i >= 0; i--) {
            if (array[i].equals(element)) {
                return top - i + 1;  // Distance from top (1-based)
            }
        }
        return -1;  // Not found
    }

    /**
     * Dynamic resizing: Double capacity when full
     * Cost: O(n) to copy, but happens rarely
     * Amortized: O(1) per push
     */
    @SuppressWarnings("unchecked")
    private void resize() {
        capacity *= 2;
        T[] newArray = (T[]) new Object[capacity];
        System.arraycopy(array, 0, newArray, 0, top + 1);
        array = newArray;
    }
}

/**
 * KEY INSIGHT: Why stacks are so fast?
 *
 * All operations work on ONE END only (the top)!
 * - No shifting elements (unlike array insert/delete in middle)
 * - No traversal needed (unlike linked list)
 * - Direct access to top via index/pointer
 *
 * This makes push/pop/peek all O(1) operations!
 */`

  const libraryCode = `// Using Java's Stack Implementations
import java.util.*;

/**
 * IMPORTANT: Don't use Stack<E> class in new code!
 * It's legacy from Java 1.0 and has issues.
 * Use Deque implementations instead.
 */
public class StackExample {
    public static void main(String[] args) {

        // ===== RECOMMENDED: ArrayDeque =====
        // Fastest and most efficient stack implementation!
        Deque<Integer> stack = new ArrayDeque<>();

        // O(1) - Push onto stack
        stack.push(10);      // [10]
        stack.push(20);      // [10, 20]
        stack.push(30);      // [10, 20, 30]
        // Why O(1)? Array-based, just add to end (amortized)

        // O(1) - Peek at top (view without removing)
        int top = stack.peek();  // 30
        System.out.println("Top: " + top);
        // Stack still: [10, 20, 30]

        // O(1) - Pop from stack (remove and return)
        int popped = stack.pop();  // 30
        // Stack now: [10, 20]

        // O(1) - Check if empty
        boolean empty = stack.isEmpty();  // false

        // O(1) - Get size
        int size = stack.size();  // 2

        // Iterate from top to bottom
        for (Integer num : stack) {
            System.out.println(num);  // Prints 20, then 10
        }


        // ===== Alternative: LinkedList =====
        // Use when you need List operations too
        Deque<Integer> linkedStack = new LinkedList<>();

        linkedStack.push(40);
        linkedStack.push(50);
        // Guaranteed O(1) push (no resize ever)
        // But uses more memory (24 bytes per element vs 4-8)


        // ===== LEGACY: Stack class (AVOID!) =====
        Stack<Integer> legacyStack = new Stack<>();

        legacyStack.push(60);
        legacyStack.push(70);
        int legacyTop = legacyStack.peek();
        int legacyPop = legacyStack.pop();

        // Problems with Stack class:
        // 1. Extends Vector (synchronized - slower)
        // 2. Exposes Vector methods (breaks abstraction):
        //    legacyStack.add(2, 99);  // Can insert in middle!
        //    legacyStack.get(0);      // Can access anywhere!
        // 3. Legacy from Java 1.0

        // search() method (unique to Stack class)
        legacyStack.push(10);
        legacyStack.push(20);
        legacyStack.push(30);
        int pos = legacyStack.search(10);  // Returns 3
        // Position from top (1-based): top=1, next=2, etc.


        // ===== CONCURRENT: ConcurrentLinkedDeque =====
        // Use for multi-threaded scenarios
        Deque<Integer> concurrentStack = new ConcurrentLinkedDeque<>();

        // Thread-safe operations (lock-free!)
        concurrentStack.push(80);
        concurrentStack.push(90);
        Integer value = concurrentStack.poll();  // 90 (returns null if empty)
        // pop() would throw exception if empty


        /* WHEN TO USE WHICH?
         *
         * ArrayDeque (RECOMMENDED):
         * ✓ Fastest stack implementation
         * ✓ Most memory efficient
         * ✓ Good for 99% of use cases
         * ✓ Resizing is amortized O(1)
         *
         * LinkedList:
         * ✓ Guaranteed O(1) push (no resize)
         * ✓ Good when you need List + Stack operations
         * ✗ More memory overhead
         * ✗ Worse cache performance
         *
         * ConcurrentLinkedDeque:
         * ✓ Thread-safe without locks
         * ✓ Great for multi-threaded scenarios
         * ✗ Overhead not needed for single thread
         *
         * Stack (AVOID):
         * ✗ Legacy class
         * ✗ Synchronized (unnecessary overhead)
         * ✗ Exposes Vector methods (breaks abstraction)
         *
         * REAL-WORLD EXAMPLES:
         * - Function call stack (recursive calls)
         * - Undo/Redo functionality
         * - Browser back/forward
         * - Expression evaluation (postfix/infix)
         * - Depth-First Search (DFS) algorithms
         * - Backtracking problems
         */
    }
}`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/set" className="hover:text-blue-600">Hash Set</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Stack</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Stack - Deep Dive</h1>
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is a Stack?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            A <strong>stack</strong> is a linear data structure that follows the <strong>LIFO (Last In, First Out)</strong> principle.
            Think of it like a stack of plates - you can only add or remove plates from the top!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🔑 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>LIFO Principle:</strong> Last element added is the first one removed. Like a stack of plates!</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Single Access Point:</strong> All operations happen at the "top" of the stack only.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>O(1) Operations:</strong> Push, pop, and peek are all constant time!</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Two Common Implementations:</strong> Array-based (faster) or LinkedList-based (no resize).</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Natural Recursion Support:</strong> Function calls use a call stack internally!</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-100 rounded-lg p-5">
            <h4 className="font-bold text-purple-900 mb-3">🎯 Core Stack Operations</h4>
            <div className="bg-white rounded p-4 space-y-3">
              <div>
                <strong className="text-purple-600">Push:</strong> Add element to top of stack
                <div className="font-mono text-sm text-gray-600 ml-4">stack.push(5) → [1, 2, 3, 5]</div>
              </div>
              <div>
                <strong className="text-purple-600">Pop:</strong> Remove and return top element
                <div className="font-mono text-sm text-gray-600 ml-4">stack.pop() → returns 5, stack becomes [1, 2, 3]</div>
              </div>
              <div>
                <strong className="text-purple-600">Peek/Top:</strong> View top element without removing
                <div className="font-mono text-sm text-gray-600 ml-4">stack.peek() → returns 3, stack stays [1, 2, 3]</div>
              </div>
              <div>
                <strong className="text-purple-600">isEmpty:</strong> Check if stack has no elements
                <div className="font-mono text-sm text-gray-600 ml-4">stack.isEmpty() → returns false</div>
              </div>
              <div>
                <strong className="text-purple-600">Size:</strong> Get number of elements
                <div className="font-mono text-sm text-gray-600 ml-4">stack.size() → returns 3</div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-100 rounded-lg p-5">
            <h4 className="font-bold text-indigo-900 mb-3">📊 Stack vs Queue - Key Differences</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded p-4">
                <div className="font-bold text-purple-600 mb-2">Stack (LIFO)</div>
                <div className="text-sm space-y-1">
                  <div>• Last In, First Out</div>
                  <div>• Like a stack of plates</div>
                  <div>• Operations at ONE end (top)</div>
                  <div>• Example: Undo/Redo, Function calls</div>
                  <div className="font-mono text-xs mt-2 bg-gray-50 p-2">
                    push(1) push(2) push(3)<br/>
                    pop() → 3 (most recent)
                  </div>
                </div>
              </div>
              <div className="bg-white rounded p-4">
                <div className="font-bold text-green-600 mb-2">Queue (FIFO)</div>
                <div className="text-sm space-y-1">
                  <div>• First In, First Out</div>
                  <div>• Like a line at a store</div>
                  <div>• Operations at TWO ends</div>
                  <div>• Example: Print queue, BFS</div>
                  <div className="font-mono text-xs mt-2 bg-gray-50 p-2">
                    add(1) add(2) add(3)<br/>
                    remove() → 1 (oldest)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">✓ When to Use Stacks</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Function call management (recursion)</li>
                <li>• Undo/Redo functionality</li>
                <li>• Browser back/forward navigation</li>
                <li>• Expression evaluation (infix to postfix)</li>
                <li>• Balanced parentheses checking</li>
                <li>• Depth-First Search (DFS)</li>
                <li>• Backtracking algorithms</li>
                <li>• Memory management (call stack)</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use Stacks</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Need to access middle elements often</li>
                <li>• Need FIFO behavior (use Queue)</li>
                <li>• Need random access by index</li>
                <li>• Need to search frequently (O(n) search)</li>
                <li>• Need to process in order of arrival</li>
                <li>• Priority-based processing (use PriorityQueue)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Function Call Stack:</strong>
                <p className="text-gray-600 mt-1">When you call a function, it goes on the stack. When it returns, it pops off.</p>
              </div>
              <div>
                <strong className="text-gray-800">Undo/Redo:</strong>
                <p className="text-gray-600 mt-1">Text editors push each action. Undo pops the last action. Redo uses a second stack!</p>
              </div>
              <div>
                <strong className="text-gray-800">Browser History:</strong>
                <p className="text-gray-600 mt-1">Back button pops from history stack. Forward uses a separate stack.</p>
              </div>
              <div>
                <strong className="text-gray-800">Expression Evaluation:</strong>
                <p className="text-gray-600 mt-1">Convert infix (3+4) to postfix (34+) using stacks. Then evaluate postfix using another stack!</p>
              </div>
              <div>
                <strong className="text-gray-800">Balanced Parentheses:</strong>
                <p className="text-gray-600 mt-1">Push opening brackets, pop when closing. Valid if stack empty at end.</p>
              </div>
              <div>
                <strong className="text-gray-800">DFS Traversal:</strong>
                <p className="text-gray-600 mt-1">Depth-First Search uses stack (or recursion = implicit stack)</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">🚀 Why Stacks are So Fast</h4>
            <p className="text-gray-700">
              All stack operations work on <strong>ONE END</strong> only (the top)!<br/><br/>

              <strong>Push:</strong> Just add to end of array → O(1)<br/>
              <strong>Pop:</strong> Just remove from end → O(1)<br/>
              <strong>Peek:</strong> Just read last element → O(1)<br/><br/>

              Compare this to inserting/deleting in the middle of an array (O(n) due to shifting) or
              searching an unsorted array (O(n) comparisons). Stacks are blazing fast because they
              restrict operations to ONE location!
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
                Try the Push, Pop, and Peek operations below to see LIFO (Last In, First Out) in action!
                Watch how the most recently added element is always the first to be removed.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Stack Visualization</h2>
        </div>

        {/* Stack Display - Vertical */}
        <div className="mb-6">
          <div className="flex justify-center p-6 min-h-[400px] bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
            <div className="flex flex-col-reverse items-center justify-start space-y-reverse space-y-2">
              {stack.length === 0 ? (
                <div className="text-gray-500 text-lg my-auto">Stack is empty - Push some elements!</div>
              ) : (
                <>
                  {stack.map((value, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-300 ${
                        highlightIndex === index ? 'scale-110' : ''
                      }`}
                    >
                      <div
                        className={`w-32 h-16 border-2 flex flex-col items-center justify-center font-bold text-xl shadow-md
                          ${highlightIndex === index
                            ? 'bg-yellow-300 border-yellow-500 shadow-xl'
                            : index === stack.length - 1
                              ? 'bg-purple-200 border-purple-600'
                              : 'bg-indigo-100 border-indigo-500'
                          }`}
                      >
                        <div>{value}</div>
                        {index === stack.length - 1 && (
                          <div className="text-xs text-purple-700 font-semibold">← TOP</div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="text-sm text-gray-500 font-semibold mt-4">BOTTOM</div>
                </>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
            <div className="bg-purple-50 p-3 rounded">
              <strong>Stack Size:</strong> {stack.length} elements
            </div>
            <div className="bg-indigo-50 p-3 rounded">
              <strong>Top Element:</strong> {stack.length > 0 ? stack[stack.length - 1] : 'none'}
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <strong>Is Empty:</strong> {stack.length === 0 ? 'Yes' : 'No'}
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-3 bg-purple-50 p-3 rounded border-l-4 border-purple-500">
            <strong>LIFO Principle:</strong> The most recently pushed element is always at the top.
            Pop removes the top element. Peek views the top without removing it.
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value to Push
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Enter value"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handlePush}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Push element onto stack - O(1)"
          >
            Push → O(1) ⚡
          </button>
          <button
            onClick={handlePop}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Pop element from stack - O(1)"
          >
            Pop → O(1) ⚡
          </button>
          <button
            onClick={handlePeek}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Peek at top element - O(1)"
          >
            Peek → O(1) ⚡
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            title="Clear all elements"
          >
            Clear
          </button>
        </div>

        {message && (
          <div className="bg-purple-50 border-l-4 border-purple-500 text-purple-700 px-4 py-3 rounded">
            <strong>Result:</strong> {message}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Try This:</strong> Push 3 numbers, then pop them. Notice they come out in reverse order (LIFO)!
          Then try Peek to see the top without removing it.
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
            title="Stack from Scratch (Array-Based)"
            code={scratchCode}
            language="java"
          />
          <CodeDisplay
            title="Using Java's Stack Implementations"
            code={libraryCode}
            language="java"
          />
        </div>
      </div>

      {/* Java Stack Implementations - Complete Guide */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Java Stack Implementations - Complete Guide
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Stacks can be implemented in many ways in Java! Below you'll find ALL stack implementations including
          the legacy Stack class, modern ArrayDeque, LinkedList, and concurrent options. Learn when to use
          each one for optimal performance!
        </p>
        <JavaStackImplementations />
      </div>

      {/* STEP 4: Advanced Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-lg shadow-md p-8 mb-8 border-l-8 border-slate-500 mt-8">
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
                <li>Then return here for deep dives into memory layout, call stack anatomy, concurrency, and production patterns</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Memory Layout: Stack vs Heap */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">💾 Memory Layout: Stack Memory vs Heap Memory</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">Stack Memory Region</h4>
                <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Each thread has its own stack
// Default size: ~1MB on Linux, ~1MB on Windows

Stack Memory Layout (grows DOWN):
┌────────────────────────┐ ← High address
│  main() frame          │
│  - local variables     │
│  - return address      │
│  - parameters          │
├────────────────────────┤
│  calculateSum() frame  │
│  - int sum = 0         │
│  - return address      │
├────────────────────────┤
│  helper() frame        │ ← Stack pointer (SP)
│  - int x = 10          │
│  - return address      │
└────────────────────────┘ ← Low address

// Stack overflow happens when:
void recursiveFunction(int n) {
    int array[1000];  // 4KB per call
    recursiveFunction(n + 1);
}
// Stack: 1MB / 4KB = ~250 calls max
// Then: StackOverflowError!`}
                </pre>
              </div>

              <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">Heap Memory Region</h4>
                <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Shared by all threads
// Size: Limited by -Xmx flag (can be GBs)

Heap Memory (grows UP):
┌────────────────────────┐
│  Object 1              │
│  new Stack<Integer>()  │
│  - internal array      │
│  - metadata            │
├────────────────────────┤
│  Object 2              │
│  new ArrayList<>()     │
├────────────────────────┤
│  ...more objects...    │
└────────────────────────┘

// Stack variables point to heap:
void method() {
    Stack<Integer> stack = new Stack<>();
    // 'stack' reference: stack memory
    // Stack object + array: heap memory

    int x = 5;  // Primitive: stack
    Integer y = 10;  // Reference: stack
                     // Object: heap
}`}
                </pre>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Stack Frame Anatomy</h4>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// What's in a stack frame?

void fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

Stack Frame for fibonacci(5):
┌─────────────────────────────┐
│ Return Address: 0x7FFF1234  │ ← Where to jump after return
│ Previous Frame Pointer      │ ← Link to caller's frame
│ Parameter: n = 5            │ ← Function arguments
│ Local Variables: (none)     │ ← Local vars go here
│ Temporary: n-1, n-2 results│ ← Expression evaluation
└─────────────────────────────┘

// Size calculation:
// - Return address: 8 bytes (64-bit)
// - Frame pointer: 8 bytes
// - int n: 4 bytes
// - Temporaries: ~16 bytes
// Total: ~36 bytes per call
//
// Max recursion depth: 1MB / 36 bytes = ~28,000 calls
// But varies with local variables!

// Example: fibonacci(40) recursive calls
// ~100M function calls!
// If each frame = 36 bytes → would need 3.6GB stack!
// Reality: Stack overflow at ~1000-10000 depth`}
              </pre>
            </div>

            <div className="bg-purple-50 p-4 rounded mt-4">
              <h4 className="font-semibold text-purple-900 mb-2">Stack Overflow: How It Happens</h4>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// Common causes of stack overflow:

// 1. Infinite recursion
void infinite() {
    infinite();  // No base case!
}
// Depth: ~1000-10000 calls → StackOverflowError

// 2. Deep recursion with large locals
void deepRecursion(int n) {
    int bigArray[10000];  // 40KB per frame!
    if (n > 0) deepRecursion(n - 1);
}
// 1MB stack / 40KB = only ~25 calls!

// 3. Very large local arrays
void largeLocals() {
    int huge[1_000_000];  // 4MB! Exceeds 1MB stack
}

// Solutions:
// 1. Convert to iteration
// 2. Use tail recursion (if language optimizes)
// 3. Move large data to heap:
void heapBased() {
    int[] huge = new int[1_000_000];  // Heap allocation!
}
// 4. Increase stack size: -Xss2m (2MB stack)
//    java -Xss2m MyProgram`}
              </pre>
            </div>
          </div>

          {/* Array-Based vs LinkedList-Based */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">⚖️ Array-Based vs LinkedList-Based Stacks</h3>

            <div className="overflow-x-auto mb-4">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">Aspect</th>
                    <th className="px-4 py-3 text-left font-bold">ArrayDeque (Array)</th>
                    <th className="px-4 py-3 text-left font-bold">LinkedList (Nodes)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Cache Locality</td>
                    <td className="px-4 py-3 text-green-600">✓ Excellent (contiguous)</td>
                    <td className="px-4 py-3 text-red-600">✗ Poor (scattered)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Memory/Element</td>
                    <td className="px-4 py-3 text-green-600">4-8 bytes (just value)</td>
                    <td className="px-4 py-3 text-red-600">24 bytes (value + pointers + overhead)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Push Time</td>
                    <td className="px-4 py-3">O(1) amortized</td>
                    <td className="px-4 py-3">O(1) always</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Resize Cost</td>
                    <td className="px-4 py-3 text-orange-600">O(n) occasionally</td>
                    <td className="px-4 py-3 text-green-600">Never resizes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Iteration Speed</td>
                    <td className="px-4 py-3 text-green-600">Fast (sequential)</td>
                    <td className="px-4 py-3 text-red-600">Slow (pointer chasing)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Benchmark: 1M Push Operations</h4>
                <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded">
{`ArrayDeque<Integer> arrayStack = new ArrayDeque<>(1_000_000);
for (int i = 0; i < 1_000_000; i++) {
    arrayStack.push(i);
}
// Time: ~15ms ⚡
// Memory: 4MB

LinkedList<Integer> linkedStack = new LinkedList<>();
for (int i = 0; i < 1_000_000; i++) {
    linkedStack.push(i);
}
// Time: ~45ms (3x slower)
// Memory: 24MB (6x more!)`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Benchmark: 1M Iterations</h4>
                <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded">
{`// Iterate through stack
int sum = 0;
for (Integer num : arrayStack) {
    sum += num;
}
// Time: ~3ms ⚡ (cache hits!)

int sum = 0;
for (Integer num : linkedStack) {
    sum += num;
}
// Time: ~15ms (5x slower - cache misses)`}
                </pre>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded mt-4 border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">Why ArrayDeque Wins:</h4>
              <pre className="text-xs bg-white p-3 rounded">
{`CPU Cache Line = 64 bytes (holds 16 integers)

ArrayDeque (contiguous memory):
Address 0x1000: [1][2][3][4]...[16] ← All in ONE cache line!
// Accessing element 1 loads elements 1-16 into cache
// Next 15 accesses = CACHE HITS ⚡

LinkedList (scattered nodes):
Node 1 @ 0x1000 → data:1, next:0x5A20
Node 2 @ 0x5A20 → data:2, next:0x2F10  ← Different cache line!
Node 3 @ 0x2F10 → data:3, next:0x8100  ← Different cache line!
// Each access = CACHE MISS (100x slower than hit!)

Real-world impact:
- L1 cache hit: ~1 nanosecond
- L1 cache miss → RAM: ~100 nanoseconds
- LinkedList forces RAM access every node!`}
              </pre>
            </div>
          </div>

          {/* Production Patterns */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🏭 Production Patterns with Stacks</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 1: Expression Evaluation (Reverse Polish Notation)</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Problem: Evaluate "3 4 + 2 * 7 /"</p>
                    <pre className="text-xs bg-white p-2 rounded">
{`// Postfix/RPN evaluation using stack
int evaluateRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();

    for (String token : tokens) {
        if (isOperator(token)) {
            int b = stack.pop();  // Right operand
            int a = stack.pop();  // Left operand
            int result = apply(token, a, b);
            stack.push(result);
        } else {
            stack.push(Integer.parseInt(token));
        }
    }

    return stack.pop();  // Final result
}

// Example: "3 4 + 2 * 7 /"
// Push 3: [3]
// Push 4: [3, 4]
// +: pop 4,3 → 7: [7]
// Push 2: [7, 2]
// *: pop 2,7 → 14: [14]
// Push 7: [14, 7]
// /: pop 7,14 → 2: [2]
// Result: 2 ✓`}
                    </pre>
                  </div>

                  <div className="bg-slate-50 p-3 rounded">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Infix to Postfix Conversion</p>
                    <pre className="text-xs bg-white p-2 rounded">
{`// Convert "3 + 4 * 2 / (1 - 5)" to postfix
String infixToPostfix(String infix) {
    Deque<Character> stack = new ArrayDeque<>();
    StringBuilder postfix = new StringBuilder();

    for (char c : infix.toCharArray()) {
        if (isDigit(c)) {
            postfix.append(c);
        } else if (c == '(') {
            stack.push(c);
        } else if (c == ')') {
            while (stack.peek() != '(') {
                postfix.append(stack.pop());
            }
            stack.pop();  // Remove '('
        } else {  // Operator
            while (!stack.isEmpty() &&
                   precedence(stack.peek()) >= precedence(c)) {
                postfix.append(stack.pop());
            }
            stack.push(c);
        }
    }

    while (!stack.isEmpty()) {
        postfix.append(stack.pop());
    }

    return postfix.toString();
}
// "3 + 4 * 2 / (1 - 5)" → "3 4 2 * 1 5 - / +"
// Time: O(n), Space: O(n)`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 2: Backtracking - Generate All Parentheses</h4>
                <pre className="text-xs bg-white p-3 rounded border">
{`// Generate all valid n pairs of parentheses
// Example: n=3 → ["((()))", "(()())", "(())()", "()(())", "()()()"]

List<String> generateParenthesis(int n) {
    List<String> result = new ArrayList<>();
    Deque<Character> stack = new ArrayDeque<>();
    backtrack(result, stack, 0, 0, n);
    return result;
}

void backtrack(List<String> result, Deque<Character> stack,
               int open, int close, int max) {
    // Base case: used all n pairs
    if (stack.size() == max * 2) {
        result.add(toString(stack));
        return;
    }

    // Try adding '(' if we haven't used all n
    if (open < max) {
        stack.push('(');
        backtrack(result, stack, open + 1, close, max);
        stack.pop();  // Backtrack!
    }

    // Try adding ')' if valid (more '(' than ')')
    if (close < open) {
        stack.push(')');
        backtrack(result, stack, open, close + 1, max);
        stack.pop();  // Backtrack!
    }
}

// Time: O(4^n / √n) - Catalan number
// Space: O(n) - Recursion depth + stack
//
// Key: Stack used for both:
// 1. Building current string
// 2. Implicit call stack for recursion!`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Pattern 3: Monotonic Stack - Next Greater Element</h4>
                <pre className="text-xs bg-white p-3 rounded border">
{`// Find next greater element for each element
// Input: [2, 1, 2, 4, 3]
// Output: [4, 2, 4, -1, -1]

int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);

    // Monotonic decreasing stack (stores indices)
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        // Pop all smaller elements - they found their answer!
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            int idx = stack.pop();
            result[idx] = nums[i];
        }
        stack.push(i);
    }

    return result;
}

// Example walkthrough:
// i=0, nums[0]=2: stack=[0]
// i=1, nums[1]=1: stack=[0,1] (1 < 2, no pop)
// i=2, nums[2]=2: pop 1 (1<2), result[1]=2, stack=[0,2]
// i=3, nums[4]=4: pop 2 (2<4), result[2]=4
//                 pop 0 (2<4), result[0]=4, stack=[3]
// i=4, nums[4]=3: stack=[3,4] (3 < 4, no pop)
//
// Time: O(n) - each element pushed/popped once!
// Space: O(n)
//
// Applications:
// - Stock span problem
// - Largest rectangle in histogram
// - Daily temperatures`}
                </pre>
              </div>
            </div>
          </div>

          {/* Concurrency */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🔒 Concurrent Stacks</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                <h4 className="font-semibold text-red-900 mb-2">❌ Race Condition</h4>
                <pre className="text-xs bg-white p-2 rounded">
{`// ArrayDeque is NOT thread-safe!
Deque<Integer> stack = new ArrayDeque<>();

// Thread 1               Thread 2
stack.push(10);          stack.push(20);
// Both read size=0
// Both write to index 0
// One value lost! 💀

// Or worse:
// Thread 1: push() during resize
// Thread 2: pop() sees partial state
// Result: Corruption or exception!`}
                </pre>
              </div>

              <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">✓ ConcurrentLinkedDeque</h4>
                <pre className="text-xs bg-white p-2 rounded">
{`// Lock-free using CAS operations
Deque<Integer> stack =
    new ConcurrentLinkedDeque<>();

// Thread-safe push/pop
stack.push(10);  // Thread 1
stack.push(20);  // Thread 2
// Both succeed without blocking!

// Uses Compare-And-Swap:
// do {
//   Node expected = head.get();
//   Node newNode = new Node(value, expected);
// } while (!head.compareAndSet(expected, newNode));`}
                </pre>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">Thread-Local Stacks Pattern</h4>
              <pre className="text-xs bg-white p-3 rounded">
{`// Each thread gets its own stack - zero contention!
ThreadLocal<Deque<Integer>> threadStack = ThreadLocal.withInitial(ArrayDeque::new);

// Thread pool pattern
ExecutorService executor = Executors.newFixedThreadPool(8);

for (int i = 0; i < 1000; i++) {
    final int value = i;
    executor.submit(() -> {
        Deque<Integer> myStack = threadStack.get();  // Thread-local!
        myStack.push(value);
        // Process...
        myStack.pop();
    });
}

// Benchmark (8 threads, 1M ops):
// ConcurrentLinkedDeque:  ~200ms
// ThreadLocal + ArrayDeque: ~50ms ⚡ (4x faster!)
//
// Why? Zero contention, better cache locality
// Use when: Independent per-thread work
// Avoid when: Need to share data between threads`}
              </pre>
            </div>
          </div>

          {/* Interview Problems */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-4">🎯 Interview-Level Stack Problems</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 1: Valid Parentheses (Easy - Amazon/Google)</h4>
                <p className="text-sm text-gray-600 mb-3">Given string with '(', ')', '{', '}', '[', ']', determine if valid.</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Input: "({[]})" → true
// Input: "([)]" → false (interleaved)

boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> pairs = Map.of(
        ')', '(',
        '}', '{',
        ']', '['
    );

    for (char c : s.toCharArray()) {
        if (pairs.containsValue(c)) {
            // Opening bracket
            stack.push(c);
        } else if (pairs.containsKey(c)) {
            // Closing bracket
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) {
                return false;
            }
        }
    }

    return stack.isEmpty();  // All matched?
}

// Time: O(n) - one pass
// Space: O(n) - worst case all opening brackets
//
// Example: "({[]})"
// (: push '('          stack=['(']
// {: push '{'          stack=['(', '{']
// [: push '['          stack=['(', '{', '[']
// ]: pop '[' match ✓   stack=['(', '{']
// }: pop '{' match ✓   stack=['(']
// ): pop '(' match ✓   stack=[]
// Empty stack → valid! ✓`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 2: Min Stack (Medium - Microsoft)</h4>
                <p className="text-sm text-gray-600 mb-3">Design stack with push, pop, top, and getMin all in O(1) time.</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Challenge: getMin() must be O(1), not O(n)!

class MinStack {
    private Deque<Integer> stack;
    private Deque<Integer> minStack;  // Parallel stack tracking mins!

    public MinStack() {
        stack = new ArrayDeque<>();
        minStack = new ArrayDeque<>();
    }

    public void push(int val) {
        stack.push(val);

        // Update min: current val OR existing min
        if (minStack.isEmpty()) {
            minStack.push(val);
        } else {
            minStack.push(Math.min(val, minStack.peek()));
        }
    }

    public void pop() {
        stack.pop();
        minStack.pop();  // Keep in sync!
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();  // O(1)! ⚡
    }
}

// Example:
// push(5): stack=[5], min=[5]
// push(3): stack=[5,3], min=[5,3] (3 < 5)
// push(7): stack=[5,3,7], min=[5,3,3] (3 < 7)
// getMin(): returns 3 ✓ O(1)
// pop(): stack=[5,3], min=[5,3]
// getMin(): returns 3 ✓ O(1)
// pop(): stack=[5], min=[5]
// getMin(): returns 5 ✓ O(1)
//
// Space: O(n) - two stacks
// All ops: O(1) ⚡
//
// Key insight: Track min AT EACH LEVEL
// When we pop, we restore previous min!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 3: Largest Rectangle in Histogram (Hard - Facebook/Google)</h4>
                <p className="text-sm text-gray-600 mb-3">Find largest rectangular area in histogram. [2,1,5,6,2,3] → 10</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Naive: O(n²) - try all pairs
// Optimal: O(n) using monotonic stack!

int largestRectangleArea(int[] heights) {
    Deque<Integer> stack = new ArrayDeque<>();  // Stores indices
    int maxArea = 0;
    int n = heights.length;

    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];

        // Pop all taller bars - calculate their area
        while (!stack.isEmpty() && heights[stack.peek()] > h) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }

        stack.push(i);
    }

    return maxArea;
}

// Example: [2, 1, 5, 6, 2, 3]
//           0  1  2  3  4  5
//
// i=0: h=2, push 0, stack=[0]
// i=1: h=1 < 2, pop 0: area=2*1=2, push 1, stack=[1]
// i=2: h=5 > 1, push 2, stack=[1,2]
// i=3: h=6 > 5, push 3, stack=[1,2,3]
// i=4: h=2 < 6, pop 3: area=6*1=6
//      h=2 < 5, pop 2: area=5*2=10 ⭐
//      h=2 > 1, push 4, stack=[1,4]
// i=5: h=3 > 2, push 5, stack=[1,4,5]
// i=6: h=0, pop all:
//      pop 5: area=3*1=3
//      pop 4: area=2*2=4
//      pop 1: area=1*6=6
//
// Max area: 10 ✓
//
// Time: O(n) - each bar pushed/popped once!
// Space: O(n)
//
// Brilliant use of monotonic stack!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 4: Implement Queue using Two Stacks (Medium)</h4>
                <pre className="text-xs bg-white p-3 rounded">
{`// Queue: FIFO. Stack: LIFO. How to combine?

class QueueUsingStacks {
    private Deque<Integer> inStack;   // For enqueue
    private Deque<Integer> outStack;  // For dequeue

    public QueueUsingStacks() {
        inStack = new ArrayDeque<>();
        outStack = new ArrayDeque<>();
    }

    // O(1) - just push
    public void enqueue(int x) {
        inStack.push(x);
    }

    // O(1) amortized - transfer only when needed
    public int dequeue() {
        if (outStack.isEmpty()) {
            // Transfer all from in to out
            while (!inStack.isEmpty()) {
                outStack.push(inStack.pop());
            }
        }
        return outStack.pop();
    }

    public int peek() {
        if (outStack.isEmpty()) {
            while (!inStack.isEmpty()) {
                outStack.push(inStack.pop());
            }
        }
        return outStack.peek();
    }
}

// Example:
// enqueue(1): in=[1], out=[]
// enqueue(2): in=[2,1], out=[]
// enqueue(3): in=[3,2,1], out=[]
// dequeue(): transfer! in=[], out=[1,2,3]
//            pop from out → 1 ✓
// enqueue(4): in=[4], out=[2,3]
// dequeue(): pop from out → 2 ✓ (no transfer needed!)
//
// Time: enqueue O(1), dequeue O(1) amortized
// Why amortized? Each element transferred at most once
//
// Key insight: Reversing twice = original order!
// in=[3,2,1] → out=[1,2,3] → dequeue FIFO!`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-semibold text-slate-800 mb-2">Problem 5: Decode String (Medium - Google/Amazon)</h4>
                <p className="text-sm text-gray-600 mb-3">Decode "3[a2[c]]" → "accaccacc"</p>
                <pre className="text-xs bg-white p-3 rounded">
{`// Nested encoding: use stack for context

String decodeString(String s) {
    Deque<Integer> countStack = new ArrayDeque<>();
    Deque<StringBuilder> stringStack = new ArrayDeque<>();
    StringBuilder current = new StringBuilder();
    int k = 0;

    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            k = k * 10 + (c - '0');  // Handle multi-digit
        } else if (c == '[') {
            // Save context
            countStack.push(k);
            stringStack.push(current);
            current = new StringBuilder();
            k = 0;
        } else if (c == ']') {
            // Restore and repeat
            StringBuilder temp = current;
            current = stringStack.pop();
            int count = countStack.pop();
            for (int i = 0; i < count; i++) {
                current.append(temp);
            }
        } else {
            current.append(c);
        }
    }

    return current.toString();
}

// Example: "3[a2[c]]"
// '3': k=3
// '[': push 3, push "", current="", k=0
// 'a': current="a"
// '2': k=2
// '[': push 2, push "a", current="", k=0
// 'c': current="c"
// ']': pop 2, pop "a", current="a"+"cc"="acc"
// ']': pop 3, pop "", current=""+"accaccacc"
// Result: "accaccacc" ✓
//
// Time: O(maxK * n) where maxK is max repeat count
// Space: O(n) for stacks
//
// Key: Stack maintains nesting context!`}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Why Stacks Are Amazing */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-purple-600 mb-4">🚀 Why Stacks Are Fundamental</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-bold text-gray-800 mb-2">Blazing Fast</div>
            <div className="text-sm text-gray-600">
              All operations O(1)! Push, pop, peek - all constant time because we only work at one end.
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-bold text-gray-800 mb-2">Natural for Recursion</div>
            <div className="text-sm text-gray-600">
              Every recursive call uses the call stack. Understanding stacks helps you understand recursion!
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl mb-2">🔧</div>
            <div className="font-bold text-gray-800 mb-2">Everywhere in CS</div>
            <div className="text-sm text-gray-600">
              Used in compilers, interpreters, browsers, undo systems, expression evaluation, and algorithms!
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg">
          <div className="font-bold text-gray-800 mb-3">Real-World Impact:</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">•</span>
              <span><strong>Function Calls:</strong> Every program uses the call stack for function execution</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">•</span>
              <span><strong>Web Browsers:</strong> Back/forward buttons use stacks to track navigation history</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">•</span>
              <span><strong>Text Editors:</strong> Undo/redo functionality implemented with two stacks</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">•</span>
              <span><strong>Compilers:</strong> Parse expressions, check syntax, evaluate using stacks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 flex justify-between items-center border-t pt-6">
        <Link
          to="/set"
          className="flex items-center text-blue-600 hover:text-blue-700 font-semibold"
        >
          <span className="mr-2">←</span> Previous: Hash Set
        </Link>
        <Link
          to="/complexity"
          className="text-gray-600 hover:text-gray-700"
        >
          Review Complexity Guide
        </Link>
        <div className="text-gray-400">
          More Coming Soon...
        </div>
      </div>
    </div>
  )
}

export default StackVisualizerEnhanced
