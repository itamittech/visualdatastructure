import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function SearchingVisualizerEnhanced() {
  const [array, setArray] = useState([5, 12, 18, 25, 33, 42, 51, 68, 75, 89, 94])
  const [target, setTarget] = useState(42)
  const [searching, setSearching] = useState(false)
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [comparisons, setComparisons] = useState(0)
  const [highlightedIndices, setHighlightedIndices] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear')
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [searchRange, setSearchRange] = useState([])

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const resetSearch = () => {
    setComparisons(0)
    setMessage('')
    setHighlightedIndices([])
    setCurrentIndex(-1)
    setSearchRange([])
  }

  const randomizeArray = () => {
    const newArray = Array.from({ length: 11 }, () => Math.floor(Math.random() * 100)).sort((a, b) => a - b)
    setArray(newArray)
    setTarget(newArray[Math.floor(Math.random() * newArray.length)])
    resetSearch()
  }

  const randomTarget = () => {
    const newTarget = Math.floor(Math.random() * 100)
    setTarget(newTarget)
    resetSearch()
  }

  // Linear Search - O(n)
  const linearSearch = async () => {
    setSearching(true)
    resetSearch()
    let compCount = 0

    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i)
      setHighlightedIndices([i])
      compCount++
      setComparisons(compCount)
      await delay(400)

      if (array[i] === target) {
        setMessage(`Linear Search: Found ${target} at index ${i}! ${compCount} comparisons - O(n)`)
        setSearching(false)
        return
      }
    }

    setHighlightedIndices([])
    setCurrentIndex(-1)
    setSearching(false)
    setMessage(`Linear Search: ${target} not found. ${compCount} comparisons - O(n)`)
  }

  // Binary Search - O(log n)
  const binarySearch = async () => {
    setSearching(true)
    resetSearch()
    let compCount = 0
    let left = 0
    let right = array.length - 1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      setSearchRange([left, right])
      setCurrentIndex(mid)
      setHighlightedIndices([mid])
      compCount++
      setComparisons(compCount)
      await delay(600)

      if (array[mid] === target) {
        setMessage(`Binary Search: Found ${target} at index ${mid}! ${compCount} comparisons - O(log n)`)
        setSearching(false)
        return
      } else if (array[mid] < target) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    setHighlightedIndices([])
    setCurrentIndex(-1)
    setSearchRange([])
    setSearching(false)
    setMessage(`Binary Search: ${target} not found. ${compCount} comparisons - O(log n)`)
  }

  // Jump Search - O(√n)
  const jumpSearch = async () => {
    setSearching(true)
    resetSearch()
    let compCount = 0
    const n = array.length
    const jump = Math.floor(Math.sqrt(n))
    let prev = 0

    // Find the block where element may be present
    while (prev < n && array[Math.min(jump, n) - 1] < target) {
      setHighlightedIndices([Math.min(jump, n) - 1])
      setSearchRange([prev, Math.min(jump, n) - 1])
      compCount++
      setComparisons(compCount)
      await delay(500)

      prev = jump
      if (jump >= n) break
    }

    // Linear search in the identified block
    for (let i = prev; i < Math.min(jump, n); i++) {
      setCurrentIndex(i)
      setHighlightedIndices([i])
      compCount++
      setComparisons(compCount)
      await delay(500)

      if (array[i] === target) {
        setMessage(`Jump Search: Found ${target} at index ${i}! ${compCount} comparisons - O(√n)`)
        setSearching(false)
        return
      }
    }

    setHighlightedIndices([])
    setCurrentIndex(-1)
    setSearchRange([])
    setSearching(false)
    setMessage(`Jump Search: ${target} not found. ${compCount} comparisons - O(√n)`)
  }

  // Interpolation Search - O(log log n) for uniform distribution
  const interpolationSearch = async () => {
    setSearching(true)
    resetSearch()
    let compCount = 0
    let left = 0
    let right = array.length - 1

    while (left <= right && target >= array[left] && target <= array[right]) {
      if (left === right) {
        setCurrentIndex(left)
        setHighlightedIndices([left])
        compCount++
        setComparisons(compCount)
        await delay(600)

        if (array[left] === target) {
          setMessage(`Interpolation Search: Found ${target} at index ${left}! ${compCount} comparisons - O(log log n)`)
        } else {
          setMessage(`Interpolation Search: ${target} not found. ${compCount} comparisons - O(log log n)`)
        }
        setSearching(false)
        return
      }

      // Interpolate position
      const pos = left + Math.floor(
        ((target - array[left]) * (right - left)) / (array[right] - array[left])
      )

      setSearchRange([left, right])
      setCurrentIndex(pos)
      setHighlightedIndices([pos])
      compCount++
      setComparisons(compCount)
      await delay(600)

      if (array[pos] === target) {
        setMessage(`Interpolation Search: Found ${target} at index ${pos}! ${compCount} comparisons - O(log log n)`)
        setSearching(false)
        return
      } else if (array[pos] < target) {
        left = pos + 1
      } else {
        right = pos - 1
      }
    }

    setHighlightedIndices([])
    setCurrentIndex(-1)
    setSearchRange([])
    setSearching(false)
    setMessage(`Interpolation Search: ${target} not found. ${compCount} comparisons - O(log log n)`)
  }

  // Exponential Search - O(log n)
  const exponentialSearch = async () => {
    setSearching(true)
    resetSearch()
    let compCount = 0
    const n = array.length

    // Check if target is at first position
    setCurrentIndex(0)
    setHighlightedIndices([0])
    compCount++
    setComparisons(compCount)
    await delay(500)

    if (array[0] === target) {
      setMessage(`Exponential Search: Found ${target} at index 0! ${compCount} comparisons - O(log n)`)
      setSearching(false)
      return
    }

    // Find range for binary search by doubling
    let i = 1
    while (i < n && array[i] <= target) {
      setHighlightedIndices([i])
      compCount++
      setComparisons(compCount)
      await delay(500)
      i *= 2
    }

    // Binary search in the identified range
    let left = Math.floor(i / 2)
    let right = Math.min(i, n - 1)

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      setSearchRange([left, right])
      setCurrentIndex(mid)
      setHighlightedIndices([mid])
      compCount++
      setComparisons(compCount)
      await delay(600)

      if (array[mid] === target) {
        setMessage(`Exponential Search: Found ${target} at index ${mid}! ${compCount} comparisons - O(log n)`)
        setSearching(false)
        return
      } else if (array[mid] < target) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    setHighlightedIndices([])
    setCurrentIndex(-1)
    setSearchRange([])
    setSearching(false)
    setMessage(`Exponential Search: ${target} not found. ${compCount} comparisons - O(log n)`)
  }

  const handleSearch = () => {
    switch (selectedAlgorithm) {
      case 'linear':
        linearSearch()
        break
      case 'binary':
        binarySearch()
        break
      case 'jump':
        jumpSearch()
        break
      case 'interpolation':
        interpolationSearch()
        break
      case 'exponential':
        exponentialSearch()
        break
      default:
        linearSearch()
    }
  }

  const complexityData = {
    operations: [
      {
        name: 'Linear Search',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Best: O(1) if found at start. Avg/Worst: O(n). Works on unsorted arrays.'
      },
      {
        name: 'Binary Search',
        time: 'O(log n)',
        space: 'O(1)',
        description: 'Requires sorted array. Halves search space each iteration. Most common.'
      },
      {
        name: 'Jump Search',
        time: 'O(√n)',
        space: 'O(1)',
        description: 'Jump ahead by √n steps, then linear search. Better than linear for large arrays.'
      },
      {
        name: 'Interpolation Search',
        time: 'O(log log n)',
        space: 'O(1)',
        description: 'Best for uniformly distributed data. Worst: O(n). Uses value interpolation.'
      },
      {
        name: 'Exponential Search',
        time: 'O(log n)',
        space: 'O(1)',
        description: 'Find range by doubling, then binary search. Good for unbounded/infinite arrays.'
      },
    ]
  }

  const scratchCode = `// Searching Algorithms from Scratch
import java.util.*;

public class SearchingAlgorithms {

    /**
     * LINEAR SEARCH: Check every element sequentially
     *
     * WHY O(n)?
     * - Must potentially check every element in array
     * - No assumptions about data order
     * - Simple but inefficient for large datasets
     *
     * When to use:
     * ✓ Small datasets (< 100 elements)
     * ✓ Unsorted data (only option!)
     * ✓ Data changes frequently (no sorting overhead)
     * ✗ Large sorted datasets (use binary search!)
     */
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;  // Found! Return index
            }
        }
        return -1;  // Not found
    }

    /**
     * BINARY SEARCH: Divide and conquer on sorted array
     *
     * WHY O(log n)?
     * - Halves search space each iteration
     * - log₂(n) iterations: 1000 elements → ~10 comparisons!
     * - Requires sorted array (critical!)
     *
     * Real-world examples:
     * - Dictionary lookup (words are sorted)
     * - Database indexes (B-trees use binary search)
     * - Git bisect (find bad commit)
     */
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            // Avoid overflow: (left + right) / 2 can overflow!
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                return mid;  // Found!
            } else if (arr[mid] < target) {
                left = mid + 1;  // Search right half
            } else {
                right = mid - 1;  // Search left half
            }
        }

        return -1;  // Not found
    }

    /**
     * Recursive Binary Search (same O(log n))
     * Uses call stack instead of iteration
     * Space: O(log n) for recursion stack
     */
    public static int binarySearchRecursive(int[] arr, int target, int left, int right) {
        if (left > right) {
            return -1;  // Base case: not found
        }

        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            return binarySearchRecursive(arr, target, mid + 1, right);
        } else {
            return binarySearchRecursive(arr, target, left, mid - 1);
        }
    }

    /**
     * JUMP SEARCH: Jump ahead by √n, then linear search
     *
     * WHY O(√n)?
     * - Jump step size: √n (optimal!)
     * - Jumps: √n comparisons
     * - Linear search within block: √n comparisons
     * - Total: √n + √n = O(√n)
     *
     * When to use:
     * ✓ Better than linear O(n) for large arrays
     * ✓ Worse than binary O(log n), but simpler
     * ✓ Cache-friendly (sequential access)
     * ✗ Still slower than binary for random access
     */
    public static int jumpSearch(int[] arr, int target) {
        int n = arr.length;
        int jump = (int) Math.sqrt(n);  // Optimal jump size
        int prev = 0;

        // Jump ahead until we overshoot or reach end
        while (arr[Math.min(jump, n) - 1] < target) {
            prev = jump;
            jump += (int) Math.sqrt(n);
            if (prev >= n) {
                return -1;  // Not found
            }
        }

        // Linear search in the identified block
        while (arr[prev] < target) {
            prev++;
            if (prev == Math.min(jump, n)) {
                return -1;  // Not found
            }
        }

        if (arr[prev] == target) {
            return prev;
        }

        return -1;
    }

    /**
     * INTERPOLATION SEARCH: Estimate position based on value
     *
     * WHY O(log log n) for uniform data?
     * - Like looking up a phone book: guess position by name
     * - If data is uniformly distributed, converges super fast!
     * - Example: Finding 75 in [0, 10, 20, ..., 90, 100]
     *   → Jumps to ~75% position immediately
     *
     * CAUTION: O(n) worst case for non-uniform data!
     * Example: [1, 2, 3, ..., 99, 10000] - last element causes O(n)
     */
    public static int interpolationSearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right && target >= arr[left] && target <= arr[right]) {
            if (left == right) {
                if (arr[left] == target) return left;
                return -1;
            }

            // Interpolate position (key formula!)
            int pos = left + ((target - arr[left]) * (right - left)) /
                             (arr[right] - arr[left]);

            if (arr[pos] == target) {
                return pos;
            } else if (arr[pos] < target) {
                left = pos + 1;
            } else {
                right = pos - 1;
            }
        }

        return -1;
    }

    /**
     * EXPONENTIAL SEARCH: Double range, then binary search
     *
     * WHY O(log n)?
     * - Find range: 1, 2, 4, 8, 16, ... → log n steps
     * - Binary search within range: log n steps
     * - Total: log n + log n = O(log n)
     *
     * When to use:
     * ✓ Unbounded/infinite arrays (don't know size!)
     * ✓ Target is near beginning (faster than binary)
     * ✓ Better cache performance than binary (sequential)
     */
    public static int exponentialSearch(int[] arr, int target) {
        int n = arr.length;

        // If target is at first position
        if (arr[0] == target) {
            return 0;
        }

        // Find range for binary search by doubling
        int i = 1;
        while (i < n && arr[i] <= target) {
            i *= 2;
        }

        // Binary search in the identified range
        return binarySearch(arr, target, i / 2, Math.min(i, n - 1));
    }

    private static int binarySearch(int[] arr, int target, int left, int right) {
        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }

    /**
     * TERNARY SEARCH: Divide into 3 parts instead of 2
     *
     * WHY still O(log n)?
     * - Reduces to 2/3 of array each time
     * - log₃(n) iterations
     * - But 2 comparisons per iteration (vs 1 for binary)
     * - Total: 2 × log₃(n) ≈ 1.26 × log₂(n)
     * - WORSE than binary search in practice!
     *
     * When to use:
     * ✓ Finding maximum/minimum of unimodal function
     * ✗ Regular search (binary is better!)
     */
    public static int ternarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            int mid1 = left + (right - left) / 3;
            int mid2 = right - (right - left) / 3;

            if (arr[mid1] == target) return mid1;
            if (arr[mid2] == target) return mid2;

            if (target < arr[mid1]) {
                right = mid1 - 1;
            } else if (target > arr[mid2]) {
                left = mid2 + 1;
            } else {
                left = mid1 + 1;
                right = mid2 - 1;
            }
        }

        return -1;
    }

    /**
     * KEY INSIGHTS:
     *
     * 1. Sorted vs Unsorted:
     *    - Unsorted: Linear search only (O(n))
     *    - Sorted: Binary search (O(log n)) is king!
     *
     * 2. Performance Comparison (n = 1,000,000):
     *    - Linear: 1,000,000 comparisons worst case
     *    - Jump: 1,000 comparisons
     *    - Binary: 20 comparisons
     *    - Interpolation: ~4 comparisons (uniform data)
     *
     * 3. Cache Performance:
     *    - Binary: Poor (random jumps)
     *    - Jump: Good (sequential blocks)
     *    - Linear: Best (sequential access)
     *
     * 4. Production Choice:
     *    - Use Arrays.binarySearch() or Collections.binarySearch()
     *    - Highly optimized, handles edge cases
     *    - Don't implement yourself unless learning!
     */
}`

  const libraryCode = `// Searching in Java Collections
import java.util.*;

public class SearchingInJava {
    public static void main(String[] args) {

        // ===== Arrays.binarySearch() - Sorted Arrays =====
        int[] arr = {5, 12, 18, 25, 33, 42, 51, 68, 75, 89, 94};

        int index = Arrays.binarySearch(arr, 42);  // Returns 5
        // CRITICAL: Array MUST be sorted!
        // If not sorted, result is undefined (wrong answer, not error!)

        // Result interpretation:
        // - index >= 0: Found at arr[index]
        // - index < 0: Not found, insertion point = -(index + 1)

        int notFound = Arrays.binarySearch(arr, 50);
        // notFound = -7 (would insert at index 6)
        int insertionPoint = -(notFound + 1);  // = 6


        // ===== Arrays.binarySearch() with Range =====
        // Search only in a specific range [fromIndex, toIndex)
        int rangeIndex = Arrays.binarySearch(arr, 3, 7, 33);
        // Searches arr[3] to arr[6] (toIndex exclusive!)


        // ===== Collections.binarySearch() - Lists =====
        List<Integer> list = Arrays.asList(5, 12, 18, 25, 33, 42, 51, 68, 75, 89, 94);

        int listIndex = Collections.binarySearch(list, 68);  // Returns 7

        // IMPORTANT: List must be sorted in ascending order!
        // If not sorted: Collections.sort(list) first


        // ===== Custom Objects with Comparable =====
        class Student implements Comparable<Student> {
            String name;
            int id;

            Student(String name, int id) {
                this.name = name;
                this.id = id;
            }

            @Override
            public int compareTo(Student other) {
                return Integer.compare(this.id, other.id);
            }
        }

        Student[] students = {
            new Student("Alice", 101),
            new Student("Bob", 103),
            new Student("Charlie", 105)
        };
        // Must be sorted by id!

        int studentIndex = Arrays.binarySearch(students, new Student("", 103));
        // Returns 1 (Bob's index)


        // ===== Custom Objects with Comparator =====
        class Employee {
            String name;
            double salary;

            Employee(String name, double salary) {
                this.name = name;
                this.salary = salary;
            }
        }

        Employee[] employees = {
            new Employee("Alice", 50000),
            new Employee("Bob", 60000),
            new Employee("Charlie", 70000)
        };

        // Search by salary using Comparator
        Comparator<Employee> salaryComparator =
            (e1, e2) -> Double.compare(e1.salary, e2.salary);

        // Array must be sorted by salary first!
        Arrays.sort(employees, salaryComparator);

        int empIndex = Arrays.binarySearch(employees,
            new Employee("", 60000), salaryComparator);


        // ===== List.contains() - Linear Search O(n) =====
        boolean exists = list.contains(42);  // true
        // Internally calls indexOf() which does linear search
        // Not efficient for large lists!


        // ===== List.indexOf() - Linear Search O(n) =====
        int linearIndex = list.indexOf(42);  // Returns 5
        // First occurrence from start

        int lastIndex = list.lastIndexOf(42);  // Last occurrence

        // Returns -1 if not found
        int notFoundLinear = list.indexOf(999);  // -1


        // ===== Set.contains() - O(1) for HashSet, O(log n) for TreeSet =====
        Set<Integer> hashSet = new HashSet<>(list);
        boolean fastExists = hashSet.contains(42);  // O(1) average!

        Set<Integer> treeSet = new TreeSet<>(list);
        boolean logExists = treeSet.contains(42);  // O(log n)

        // For membership testing, use Set instead of List!


        // ===== Map.containsKey() / containsValue() =====
        Map<String, Integer> map = new HashMap<>();
        map.put("Alice", 101);
        map.put("Bob", 103);

        boolean hasKey = map.containsKey("Alice");  // O(1) average
        boolean hasValue = map.containsValue(101);  // O(n) - linear!

        // Key lookup is fast, value lookup is slow!


        // ===== Stream API - Finding Elements =====
        Optional<Integer> first = list.stream()
            .filter(x -> x > 50)
            .findFirst();  // Returns Optional[51]

        Optional<Integer> any = list.stream()
            .parallel()
            .filter(x -> x > 50)
            .findAny();  // Any matching element (non-deterministic in parallel)

        boolean anyMatch = list.stream()
            .anyMatch(x -> x > 90);  // true (94 exists)

        boolean allMatch = list.stream()
            .allMatch(x -> x > 0);  // true (all positive)

        boolean noneMatch = list.stream()
            .noneMatch(x -> x < 0);  // true (no negatives)


        /* PRODUCTION DECISION TREE:
         *
         * Sorted Array:
         * └─ Arrays.binarySearch() → O(log n)
         *    ✓ Fast for large arrays
         *    ✓ Must keep array sorted
         *    ✗ Sorting overhead: O(n log n)
         *
         * Unsorted Array (few searches):
         * └─ Linear search or Arrays.asList().indexOf() → O(n)
         *    ✓ No sorting overhead
         *    ✗ Slow for large arrays
         *    ✗ Slow for frequent searches
         *
         * Unsorted Array (many searches):
         * └─ Convert to HashSet → O(1) per search!
         *    ✓ Fast lookups after conversion
         *    ✗ O(n) space for set
         *    ✗ O(n) conversion time
         *
         * Sorted List:
         * └─ Collections.binarySearch() → O(log n)
         *    ✓ Efficient for ArrayList (random access)
         *    ✗ Still O(n) for LinkedList! (no random access)
         *
         * Unsorted List (frequent searches):
         * └─ Use TreeSet or HashMap instead!
         *    - TreeSet: O(log n) search, maintains order
         *    - HashMap: O(1) search, no order
         */


        // ===== Common Mistakes =====

        // MISTAKE 1: Binary search on unsorted array
        int[] unsorted = {50, 10, 30, 20, 40};
        int wrong = Arrays.binarySearch(unsorted, 30);
        // Returns -3 (wrong!) because array is not sorted
        // ALWAYS sort first: Arrays.sort(unsorted)

        // MISTAKE 2: Using indexOf() for frequent searches
        List<Integer> bigList = new ArrayList<>();
        for (int i = 0; i < 1000000; i++) {
            bigList.add(i);
        }
        // Bad: O(n) per search
        for (int i = 0; i < 1000; i++) {
            bigList.indexOf(i);  // 1000 × O(n) = O(n²) total!
        }
        // Better: Convert to HashSet once, then O(1) per search
        Set<Integer> bigSet = new HashSet<>(bigList);  // O(n) once
        for (int i = 0; i < 1000; i++) {
            bigSet.contains(i);  // 1000 × O(1) = O(n) total!
        }

        // MISTAKE 3: Comparing with == for objects
        String[] strings = {"apple", "banana", "cherry"};
        String target = new String("banana");
        // Arrays.binarySearch uses equals(), not ==
        int strIndex = Arrays.binarySearch(strings, target);  // Correct!

        // MISTAKE 4: Not checking return value
        int result = Arrays.binarySearch(arr, 999);
        // if (result >= 0) { ... }  // ALWAYS check!
    }
}

/**
 * INTERVIEW TIP: Searching vs Data Structures
 *
 * Q: "How would you find an element in a dataset?"
 * A: "Depends on the context:
 *     - One-time search on sorted array: Binary search O(log n)
 *     - Frequent searches: Use HashMap/HashSet O(1)
 *     - Range queries: Use TreeMap/TreeSet O(log n)
 *     - Unsorted, infrequent: Linear search O(n)
 *     - Choose data structure based on use case!"
 *
 * Follow-up: "When would you NOT use binary search?"
 * A: "1. Unsorted data (sorting overhead may not be worth it)
 *     2. LinkedList (no random access, degrades to O(n))
 *     3. Frequent insertions/deletions (maintaining sorted order is expensive)
 *     4. HashMap/HashSet available (O(1) is better than O(log n))"
 */`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/sorting" className="hover:text-blue-600">Sorting Algorithms</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Searching Algorithms</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Searching Algorithms - Deep Dive</h1>
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
          <div className="text-2xl mr-3">🔍</div>
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is Searching?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            <strong>Searching</strong> is the process of finding a specific element in a collection of data.
            It's one of the most fundamental operations in computer science, used in everything from web search to database queries!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🔑 Why Searching Matters</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Database Queries:</strong> Finding records in millions of rows</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Web Search:</strong> Google searches billions of pages in milliseconds</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>File Systems:</strong> Locating files on disk</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>AI & ML:</strong> Finding patterns in data</span>
              </li>
            </ul>
          </div>

          {/* Algorithm Comparison Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">O(n) - Linear</h4>
              <div className="text-sm space-y-1">
                <div className="bg-white p-2 rounded"><strong>Linear Search:</strong> Check each element</div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Use for: Unsorted data, small arrays, one-time searches
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
              <h4 className="font-bold text-yellow-800 mb-2">O(√n) - Sublinear</h4>
              <div className="text-sm space-y-1">
                <div className="bg-white p-2 rounded"><strong>Jump Search:</strong> Jump by √n blocks</div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Use for: Sorted data, better than linear, simpler than binary
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">O(log n) - Logarithmic</h4>
              <div className="text-sm space-y-1">
                <div className="bg-white p-2 rounded"><strong>Binary Search:</strong> Halve search space</div>
                <div className="bg-white p-2 rounded"><strong>Exponential Search:</strong> Double then binary</div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Use for: Sorted data, large datasets, production code
              </div>
            </div>
          </div>

          {/* Key Concepts */}
          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">📚 Key Concepts</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <strong className="text-gray-800">Sorted vs Unsorted:</strong>
                <p className="text-gray-600 mt-1 text-xs">Sorted data enables O(log n) search (binary). Unsorted requires O(n) (linear).</p>
              </div>
              <div>
                <strong className="text-gray-800">Sequential vs Random Access:</strong>
                <p className="text-gray-600 mt-1 text-xs">Arrays allow O(1) random access. Linked lists require O(n) sequential access.</p>
              </div>
              <div>
                <strong className="text-gray-800">Best vs Average vs Worst:</strong>
                <p className="text-gray-600 mt-1 text-xs">Linear search: Best O(1) if first element, Worst O(n) if last or not found.</p>
              </div>
              <div>
                <strong className="text-gray-800">Trade-offs:</strong>
                <p className="text-gray-600 mt-1 text-xs">Binary is fastest but requires sorting. Sorting takes O(n log n) time!</p>
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
                Watch how different algorithms search for the target! Notice how Binary Search is much faster than Linear Search.
                Try changing the target value to see how each algorithm behaves. The array is kept sorted for comparison purposes!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Searching Visualization</h2>
        </div>

        {/* Array Visualization */}
        <div className="mb-6 bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sorted Array:</h3>
            <div className="flex gap-2 items-center">
              <label className="text-sm font-semibold text-gray-700">Target:</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                className="px-3 py-2 border border-gray-300 rounded-md w-20 focus:ring-2 focus:ring-blue-500"
                disabled={searching}
              />
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={searching}
              >
                <option value="linear">Linear Search</option>
                <option value="binary">Binary Search</option>
                <option value="jump">Jump Search</option>
                <option value="interpolation">Interpolation Search</option>
                <option value="exponential">Exponential Search</option>
              </select>
            </div>
          </div>

          {/* Visual Array Elements */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {array.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 flex items-center justify-center font-bold text-lg rounded-lg transition-all duration-300 ${
                    highlightedIndices.includes(index)
                      ? 'bg-yellow-500 text-white scale-110 shadow-lg'
                      : searchRange.length === 2 && index >= searchRange[0] && index <= searchRange[1]
                      ? 'bg-blue-200 text-gray-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {value}
                </div>
                <div className="text-xs font-semibold mt-1 text-gray-600">[{index}]</div>
              </div>
            ))}
          </div>

          {/* Target Display */}
          <div className="text-center mb-4">
            <span className="text-lg font-bold text-purple-700">Searching for: </span>
            <span className="text-2xl font-bold text-purple-900 bg-purple-100 px-4 py-2 rounded-lg">{target}</span>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Comparisons:</strong> {comparisons}
            </div>
            <div className="bg-green-50 p-3 rounded">
              <strong>Current Index:</strong> {currentIndex >= 0 ? currentIndex : 'N/A'}
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <strong>Array Size:</strong> {array.length}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleSearch}
            disabled={searching}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
          >
            {searching ? 'Searching...' : `Search with ${selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)}`}
          </button>
          <button
            onClick={resetSearch}
            disabled={searching}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
          >
            Reset
          </button>
          <button
            onClick={randomizeArray}
            disabled={searching}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
          >
            Randomize Array
          </button>
          <button
            onClick={randomTarget}
            disabled={searching}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
          >
            Random Target
          </button>
        </div>

        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded mb-4">
            <strong>Result:</strong> {message}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Try This:</strong> Search with Linear Search first (slow), then try Binary Search (fast!).
          Notice how Binary eliminates half the array each step. For large arrays, this makes a HUGE difference!
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
            title="Searching Algorithms from Scratch"
            code={scratchCode}
            language="java"
          />
          <CodeDisplay
            title="Searching in Java Collections"
            code={libraryCode}
            language="java"
          />
        </div>
      </div>

      {/* STEP 4: Advanced Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-slate-500">
        <div className="flex items-center mb-6">
          <div className="bg-slate-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">4</div>
          <h2 className="text-3xl font-bold text-gray-800">Advanced: Production-Grade Searching</h2>
        </div>

        {/* Advanced Search Techniques */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">🚀 Advanced Search Techniques</h3>

          <div className="space-y-6">
            {/* Hash-Based Search */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="text-xl font-bold text-gray-800 mb-2">1. Hash-Based Search - O(1)</h4>
              <p className="text-gray-700 mb-3">
                <strong>Idea:</strong> Use hash table for constant-time lookups. Best for membership testing.
              </p>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm mb-3">
                <div className="text-gray-600">// Instead of searching array multiple times</div>
                <div>HashSet&lt;Integer&gt; set = new HashSet&lt;&gt;(Arrays.asList(arr));</div>
                <div>boolean found = set.contains(target);  // O(1)!</div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded">
                  <strong className="text-green-800">✓ Pros:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• O(1) average search time</li>
                    <li>• Perfect for frequent lookups</li>
                    <li>• Works with unsorted data</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <strong className="text-red-800">✗ Cons:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• O(n) space overhead</li>
                    <li>• O(n) preprocessing time</li>
                    <li>• No ordering information</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 bg-yellow-50 p-3 rounded text-sm">
                <strong>Use Case:</strong> Checking if email exists, duplicate detection, membership testing.
              </div>
            </div>

            {/* Binary Search Variants */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="text-xl font-bold text-gray-800 mb-2">2. Binary Search Variants</h4>
              <p className="text-gray-700 mb-3">
                <strong>Beyond simple search:</strong> Finding boundaries, ranges, and optimal values.
              </p>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <strong className="text-blue-700">Lower Bound:</strong> First element ≥ target
                  <div className="font-mono text-xs mt-1">Used in: Finding insertion point, range start</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong className="text-blue-700">Upper Bound:</strong> First element &gt; target
                  <div className="font-mono text-xs mt-1">Used in: Range end, finding next larger element</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong className="text-blue-700">Binary Search on Answer:</strong> Find optimal value in range
                  <div className="font-mono text-xs mt-1">Used in: Minimize maximum, maximize minimum problems</div>
                </div>
              </div>
            </div>

            {/* Ternary Search */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="text-xl font-bold text-gray-800 mb-2">3. Ternary Search for Optimization</h4>
              <p className="text-gray-700 mb-3">
                <strong>Idea:</strong> Find maximum/minimum of unimodal function (single peak/valley).
              </p>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm mb-3">
                <div className="text-gray-600">// Find maximum of f(x) in range [left, right]</div>
                <div>while (right - left &gt; epsilon) &#123;</div>
                <div>&nbsp;&nbsp;mid1 = left + (right - left) / 3;</div>
                <div>&nbsp;&nbsp;mid2 = right - (right - left) / 3;</div>
                <div>&nbsp;&nbsp;if (f(mid1) &lt; f(mid2)) left = mid1;</div>
                <div>&nbsp;&nbsp;else right = mid2;</div>
                <div>&#125;</div>
              </div>
              <div className="mt-3 bg-yellow-50 p-3 rounded text-sm">
                <strong>Use Case:</strong> Optimize shipping costs, find optimal parameter, minimize error function.
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Applications */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border-2 border-yellow-400">
          <h3 className="text-2xl font-bold text-amber-800 mb-4">🌍 Real-World Search Applications</h3>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-blue-700 mb-2">Google: Web Search</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Challenge:</strong> Search 50+ billion web pages in &lt;0.5 seconds</p>
                <p><strong>Solution:</strong> Inverted index + distributed systems</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Build inverted index: word → list of pages containing word</li>
                  <li>Each query word lookup: O(1) with hash table</li>
                  <li>Merge result lists (like merge k sorted lists)</li>
                  <li>Rank by PageRank + relevance (sorting)</li>
                  <li>Distribute across thousands of servers</li>
                </ul>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <strong>Key Insight:</strong> Don't search 50B pages! Pre-process into searchable index.
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-green-700 mb-2">Databases: Query Optimization</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Challenge:</strong> Find records in tables with millions of rows</p>
                <p><strong>Solution:</strong> B-Tree and B+ Tree indexes</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>B-Tree: Balanced search tree optimized for disk I/O</li>
                  <li>Each node: hundreds of keys (vs binary tree's 1 key)</li>
                  <li>Height: log₁₀₀(n) instead of log₂(n)</li>
                  <li>Example: 1M records → 3 disk reads instead of 20!</li>
                  <li>Range queries: Scan leaf nodes (all data at leaves)</li>
                </ul>
                <div className="bg-green-50 p-3 rounded mt-2">
                  <strong>Result:</strong> MySQL/PostgreSQL can search 100M rows in milliseconds.
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-purple-700 mb-2">Git: Finding Bug-Introducing Commit</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Problem:</strong> Which of 10,000 commits introduced the bug?</p>
                <p><strong>Solution:</strong> Git bisect - binary search on commits</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Start with: good commit (old), bad commit (recent)</li>
                  <li>Test middle commit: bug present?</li>
                  <li>If yes: bug in first half (search left)</li>
                  <li>If no: bug in second half (search right)</li>
                  <li>Repeat until found</li>
                </ul>
                <div className="bg-purple-50 p-3 rounded mt-2">
                  <strong>Efficiency:</strong> 10,000 commits → only 14 tests needed! (log₂ 10000 ≈ 14)
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-red-700 mb-2">Netflix: Content Recommendation</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Challenge:</strong> Find similar movies among millions for each user</p>
                <p><strong>Solution:</strong> Approximate nearest neighbor search</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Represent each movie as vector (genre, actors, ratings)</li>
                  <li>Use locality-sensitive hashing (LSH)</li>
                  <li>Bucket similar movies together</li>
                  <li>Search only within buckets: O(√n) instead of O(n)</li>
                  <li>Trade accuracy for speed (good enough recommendations)</li>
                </ul>
                <div className="bg-red-50 p-3 rounded mt-2">
                  <strong>Trade-off:</strong> 95% accuracy, 100× faster than exhaustive search.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Problems */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-red-700 mb-4">🎯 Top 5 Searching Interview Problems</h3>

          <div className="space-y-6">
            {/* Problem 1 */}
            <div className="border-2 border-blue-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Search in Rotated Sorted Array</h4>
                  <p className="text-sm text-gray-600">Difficulty: Medium | Companies: Google, Facebook, Amazon</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Array rotated at unknown pivot. Find target in O(log n) time.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Input: nums = [4,5,6,7,0,1,2], target = 0<br/>
                  Output: 4
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Modified Binary Search O(log n)</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return mid;

        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {  // Left half sorted
            if (target >= nums[left] && target < nums[mid]) {
                right = mid - 1;  // Target in sorted left half
            } else {
                left = mid + 1;   // Target in rotated right half
            }
        } else {  // Right half sorted
            if (target > nums[mid] && target <= nums[right]) {
                left = mid + 1;   // Target in sorted right half
            } else {
                right = mid - 1;  // Target in rotated left half
            }
        }
    }

    return -1;
}

// Time: O(log n) - still binary search!
// Key insight: One half is always sorted, use that to decide direction`}
                </div>
              </details>
            </div>

            {/* Problem 2 */}
            <div className="border-2 border-green-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Find First and Last Position</h4>
                  <p className="text-sm text-gray-600">Difficulty: Medium | Companies: Microsoft, Amazon</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Find starting and ending position of target in sorted array.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Input: nums = [5,7,7,8,8,10], target = 8<br/>
                  Output: [3,4]
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Two Binary Searches O(log n)</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public int[] searchRange(int[] nums, int target) {
    int[] result = {-1, -1};
    result[0] = findFirst(nums, target);
    result[1] = findLast(nums, target);
    return result;
}

private int findFirst(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    int result = -1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) {
            result = mid;
            right = mid - 1;  // Keep searching left for first occurrence
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

private int findLast(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    int result = -1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) {
            result = mid;
            left = mid + 1;  // Keep searching right for last occurrence
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

// Time: O(log n) - two binary searches
// Space: O(1)
// Key: Modified binary search to find boundaries`}
                </div>
              </details>
            </div>

            {/* Problem 3 */}
            <div className="border-2 border-purple-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Find Peak Element</h4>
                  <p className="text-sm text-gray-600">Difficulty: Medium | Companies: Google, Facebook</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Find a peak element (greater than neighbors) in O(log n).
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Input: nums = [1,2,3,1]<br/>
                  Output: 2 (element 3 is peak)
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Binary Search O(log n)</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public int findPeakElement(int[] nums) {
    int left = 0, right = nums.length - 1;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] > nums[mid + 1]) {
            // Peak is in left half (including mid)
            right = mid;
        } else {
            // Peak is in right half
            left = mid + 1;
        }
    }

    return left;  // left == right at peak
}

// Time: O(log n)
// Space: O(1)
// Key insight: Always move toward higher neighbor
// Guarantees finding a peak (array has no plateau by definition)`}
                </div>
              </details>
            </div>

            {/* Problem 4 */}
            <div className="border-2 border-orange-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Search a 2D Matrix</h4>
                  <p className="text-sm text-gray-600">Difficulty: Medium | Companies: Amazon, Microsoft</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Search in m×n matrix where rows and columns are sorted.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Matrix: [[1,4,7,11], [2,5,8,12], [3,6,9,16]], target = 5<br/>
                  Output: true
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Start Top-Right O(m + n)</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public boolean searchMatrix(int[][] matrix, int target) {
    if (matrix.length == 0 || matrix[0].length == 0) return false;

    int row = 0;
    int col = matrix[0].length - 1;  // Start top-right corner

    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] == target) {
            return true;
        } else if (matrix[row][col] > target) {
            col--;  // Move left (smaller values)
        } else {
            row++;  // Move down (larger values)
        }
    }

    return false;
}

// Time: O(m + n) where m=rows, n=cols
// Space: O(1)
// Key insight: Start at corner where you can eliminate row OR column each step
// Top-right: If target smaller → go left, if larger → go down`}
                </div>
              </details>
            </div>

            {/* Problem 5 */}
            <div className="border-2 border-red-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Capacity To Ship Packages (Binary Search on Answer)</h4>
                  <p className="text-sm text-gray-600">Difficulty: Hard | Companies: Google, Amazon</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Find minimum ship capacity to ship all packages within D days.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Input: weights = [1,2,3,4,5,6,7,8,9,10], D = 5<br/>
                  Output: 15 (ship 15 capacity can do it in 5 days)
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Binary Search on Capacity O(n log(sum))</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public int shipWithinDays(int[] weights, int days) {
    int left = Arrays.stream(weights).max().getAsInt();  // Min: max weight
    int right = Arrays.stream(weights).sum();             // Max: sum of all

    while (left < right) {
        int mid = left + (right - left) / 2;  // Try this capacity

        if (canShip(weights, days, mid)) {
            right = mid;  // Try smaller capacity
        } else {
            left = mid + 1;  // Need larger capacity
        }
    }

    return left;
}

private boolean canShip(int[] weights, int days, int capacity) {
    int daysNeeded = 1;
    int currentLoad = 0;

    for (int weight : weights) {
        if (currentLoad + weight > capacity) {
            daysNeeded++;
            currentLoad = 0;
        }
        currentLoad += weight;
    }

    return daysNeeded <= days;
}

// Time: O(n × log(sum)) where sum = total weight
// Space: O(1)
// Pattern: "Binary search on answer" - search in range of possible answers!
// Also works for: minimize maximum, maximize minimum problems`}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Decision Framework */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-300">
          <h3 className="text-2xl font-bold text-indigo-800 mb-4">🧭 Searching Algorithm Decision Framework</h3>

          <div className="space-y-3 text-sm">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
              <strong className="text-blue-700">Unsorted data, one search:</strong>
              <p className="text-gray-700 mt-1">→ Linear Search O(n). Only option without sorting!</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
              <strong className="text-green-700">Sorted array, frequent searches:</strong>
              <p className="text-gray-700 mt-1">→ Binary Search O(log n). Use Arrays.binarySearch() in production.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
              <strong className="text-purple-700">Unsorted data, many searches:</strong>
              <p className="text-gray-700 mt-1">→ Build HashSet O(n), then O(1) per search. Worth the preprocessing!</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
              <strong className="text-yellow-700">Uniformly distributed sorted data:</strong>
              <p className="text-gray-700 mt-1">→ Interpolation Search O(log log n). Better than binary if data is uniform.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
              <strong className="text-red-700">Unbounded/infinite sorted array:</strong>
              <p className="text-gray-700 mt-1">→ Exponential Search O(log n). Don't know size? Double until found!</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500">
              <strong className="text-indigo-700">Need ordering + fast search:</strong>
              <p className="text-gray-700 mt-1">→ TreeSet/TreeMap O(log n) with automatic sorting. Best of both worlds.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
              <strong className="text-orange-700">Membership testing only:</strong>
              <p className="text-gray-700 mt-1">→ HashSet O(1). Fastest option if you don't need ordering.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-teal-500">
              <strong className="text-teal-700">Pattern matching in strings:</strong>
              <p className="text-gray-700 mt-1">→ KMP/Boyer-Moore O(n + m). Better than naive O(n × m).</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-pink-500">
              <strong className="text-pink-700">Range queries (find all in [a, b]):</strong>
              <p className="text-gray-700 mt-1">→ TreeMap.subMap() O(log n + k) where k=results. Perfect for ranges!</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-gray-500">
              <strong className="text-gray-700">Production code:</strong>
              <p className="text-gray-700 mt-1">→ Use library methods! Arrays.binarySearch(), Collections.binarySearch(), HashSet.contains().</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
        <Link
          to="/sorting"
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          <span className="mr-2">←</span> Previous: Sorting Algorithms
        </Link>
        <Link
          to="/"
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default SearchingVisualizerEnhanced
