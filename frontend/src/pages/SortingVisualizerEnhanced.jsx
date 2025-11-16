import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function SortingVisualizerEnhanced() {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 88, 45, 50])
  const [sorting, setSorting] = useState(false)
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)
  const [highlightedIndices, setHighlightedIndices] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble')

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const resetArray = () => {
    setArray([64, 34, 25, 12, 22, 11, 90, 88, 45, 50])
    setComparisons(0)
    setSwaps(0)
    setMessage('')
    setHighlightedIndices([])
  }

  const randomizeArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
    setArray(newArray)
    setComparisons(0)
    setSwaps(0)
    setMessage('')
    setHighlightedIndices([])
  }

  // Bubble Sort
  const bubbleSort = async () => {
    setSorting(true)
    const arr = [...array]
    let compCount = 0
    let swapCount = 0

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setHighlightedIndices([j, j + 1])
        compCount++
        setComparisons(compCount)
        await delay(300)

        if (arr[j] > arr[j + 1]) {
          // Swap
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          swapCount++
          setSwaps(swapCount)
          setArray([...arr])
          await delay(300)
        }
      }
    }

    setHighlightedIndices([])
    setSorting(false)
    setMessage(`Bubble Sort complete! ${compCount} comparisons, ${swapCount} swaps - O(n²)`)
  }

  // Selection Sort
  const selectionSort = async () => {
    setSorting(true)
    const arr = [...array]
    let compCount = 0
    let swapCount = 0

    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i
      setHighlightedIndices([i])

      for (let j = i + 1; j < arr.length; j++) {
        setHighlightedIndices([i, j, minIdx])
        compCount++
        setComparisons(compCount)
        await delay(300)

        if (arr[j] < arr[minIdx]) {
          minIdx = j
        }
      }

      if (minIdx !== i) {
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
        swapCount++
        setSwaps(swapCount)
        setArray([...arr])
        await delay(300)
      }
    }

    setHighlightedIndices([])
    setSorting(false)
    setMessage(`Selection Sort complete! ${compCount} comparisons, ${swapCount} swaps - O(n²)`)
  }

  // Insertion Sort
  const insertionSort = async () => {
    setSorting(true)
    const arr = [...array]
    let compCount = 0
    let swapCount = 0

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i]
      let j = i - 1
      setHighlightedIndices([i])
      await delay(300)

      while (j >= 0) {
        setHighlightedIndices([j, j + 1])
        compCount++
        setComparisons(compCount)
        await delay(300)

        if (arr[j] > key) {
          arr[j + 1] = arr[j]
          swapCount++
          setSwaps(swapCount)
          setArray([...arr])
          j--
        } else {
          break
        }
      }
      arr[j + 1] = key
      setArray([...arr])
    }

    setHighlightedIndices([])
    setSorting(false)
    setMessage(`Insertion Sort complete! ${compCount} comparisons, ${swapCount} swaps - O(n²)`)
  }

  // Quick Sort (for visualization)
  const quickSort = async () => {
    setSorting(true)
    const arr = [...array]
    let compCount = 0
    let swapCount = 0

    const partition = async (low, high) => {
      const pivot = arr[high]
      let i = low - 1

      for (let j = low; j < high; j++) {
        setHighlightedIndices([j, high])
        compCount++
        setComparisons(compCount)
        await delay(300)

        if (arr[j] < pivot) {
          i++
          if (i !== j) {
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
            swapCount++
            setSwaps(swapCount)
            setArray([...arr])
            await delay(300)
          }
        }
      }

      ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      swapCount++
      setSwaps(swapCount)
      setArray([...arr])
      await delay(300)

      return i + 1
    }

    const quickSortHelper = async (low, high) => {
      if (low < high) {
        const pi = await partition(low, high)
        await quickSortHelper(low, pi - 1)
        await quickSortHelper(pi + 1, high)
      }
    }

    await quickSortHelper(0, arr.length - 1)

    setHighlightedIndices([])
    setSorting(false)
    setMessage(`Quick Sort complete! ${compCount} comparisons, ${swapCount} swaps - O(n log n) average`)
  }

  const handleSort = () => {
    switch (selectedAlgorithm) {
      case 'bubble':
        bubbleSort()
        break
      case 'selection':
        selectionSort()
        break
      case 'insertion':
        insertionSort()
        break
      case 'quick':
        quickSort()
        break
      default:
        bubbleSort()
    }
  }

  const complexityData = {
    operations: [
      {
        name: 'Bubble Sort',
        time: 'O(n²)',
        space: 'O(1)',
        description: 'Best: O(n) if already sorted. Avg/Worst: O(n²). Stable. In-place.'
      },
      {
        name: 'Selection Sort',
        time: 'O(n²)',
        space: 'O(1)',
        description: 'Always O(n²) comparisons. Min swaps: O(n). Unstable. In-place.'
      },
      {
        name: 'Insertion Sort',
        time: 'O(n²)',
        space: 'O(1)',
        description: 'Best: O(n) for nearly sorted. Avg/Worst: O(n²). Stable. In-place.'
      },
      {
        name: 'Merge Sort',
        time: 'O(n log n)',
        space: 'O(n)',
        description: 'Always O(n log n). Stable. Not in-place (needs extra array).'
      },
      {
        name: 'Quick Sort',
        time: 'O(n log n) avg',
        space: 'O(log n)',
        description: 'Avg: O(n log n), Worst: O(n²). Unstable. In-place with recursion stack.'
      },
      {
        name: 'Heap Sort',
        time: 'O(n log n)',
        space: 'O(1)',
        description: 'Always O(n log n). Unstable. In-place. No extra memory needed.'
      },
    ]
  }

  const scratchCode = `// Sorting Algorithms from Scratch
import java.util.*;

public class SortingAlgorithms {

    /**
     * BUBBLE SORT: Repeatedly swap adjacent elements if wrong order
     *
     * WHY O(n²)?
     * - Outer loop: n iterations
     * - Inner loop: n-i iterations each time
     * - Total: n + (n-1) + (n-2) + ... + 1 = n(n+1)/2 = O(n²)
     *
     * When to use:
     * ✓ Educational purposes (easiest to understand)
     * ✓ Small datasets (< 50 elements)
     * ✓ Nearly sorted data (can optimize with flag)
     * ✗ Never use in production for large data!
     */
    public static void bubbleSort(int[] arr) {
        int n = arr.length;

        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;  // Optimization flag

            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }

            // If no swaps, array is sorted!
            if (!swapped) break;  // Best case O(n)
        }
    }

    /**
     * SELECTION SORT: Find minimum, swap to front
     *
     * WHY always O(n²)?
     * - Always scans remaining array to find minimum
     * - No early termination possible
     * - Comparisons: n(n-1)/2 always!
     *
     * Advantage: Minimum swaps O(n) - good for expensive writes
     */
    public static void selectionSort(int[] arr) {
        int n = arr.length;

        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;

            // Find minimum in unsorted portion
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }

            // Swap minimum to position i
            if (minIdx != i) {
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
            }
        }
    }

    /**
     * INSERTION SORT: Insert each element into sorted portion
     *
     * WHY good for nearly sorted?
     * - Best case O(n): already sorted, inner loop never runs
     * - Adaptive: takes advantage of existing order
     * - Online: can sort as data arrives
     *
     * Production use: Arrays.sort() uses insertion for small subarrays (< 47 elements)
     */
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;

            // Shift elements > key to the right
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }

            arr[j + 1] = key;
        }
    }

    /**
     * MERGE SORT: Divide, conquer, merge
     *
     * WHY O(n log n)?
     * - Divide: log n levels (halving each time)
     * - Merge: O(n) work per level (merge all elements)
     * - Total: O(n) × log n = O(n log n)
     *
     * Guarantees: Always O(n log n), stable sort
     * Trade-off: Requires O(n) extra space
     */
    public static void mergeSort(int[] arr) {
        if (arr.length <= 1) return;

        int mid = arr.length / 2;
        int[] left = Arrays.copyOfRange(arr, 0, mid);
        int[] right = Arrays.copyOfRange(arr, mid, arr.length);

        mergeSort(left);
        mergeSort(right);
        merge(arr, left, right);
    }

    private static void merge(int[] arr, int[] left, int[] right) {
        int i = 0, j = 0, k = 0;

        // Merge while both have elements
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {  // <= for stability
                arr[k++] = left[i++];
            } else {
                arr[k++] = right[j++];
            }
        }

        // Copy remaining
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }

    /**
     * QUICK SORT: Partition around pivot, recurse
     *
     * WHY fastest in practice?
     * - Cache-friendly: in-place (no extra array)
     * - Small constants: simple operations
     * - Average O(n log n) with good pivot selection
     *
     * Worst case O(n²): already sorted with bad pivot (first/last)
     * Solution: Use median-of-three or random pivot
     */
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];  // Choose last as pivot
        int i = low - 1;  // Index of smaller element

        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                // Swap arr[i] and arr[j]
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        // Swap pivot to correct position
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        return i + 1;
    }

    /**
     * HEAP SORT: Build max heap, extract maximum repeatedly
     *
     * WHY O(n log n) with O(1) space?
     * - Build heap: O(n) using Floyd's algorithm
     * - Extract max n times: each O(log n) heapify
     * - In-place: use array as heap (no extra space!)
     *
     * Production: Used when O(1) space is critical
     */
    public static void heapSort(int[] arr) {
        int n = arr.length;

        // Build max heap (Floyd's O(n) algorithm)
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // Extract elements from heap
        for (int i = n - 1; i > 0; i--) {
            // Move current root to end
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;

            // Heapify reduced heap
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest != i) {
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            heapify(arr, n, largest);
        }
    }

    /**
     * KEY INSIGHTS:
     *
     * 1. Time-Space Tradeoff:
     *    - Merge Sort: O(n log n) time, O(n) space
     *    - Quick Sort: O(n log n) avg, O(log n) space
     *    - Heap Sort: O(n log n) time, O(1) space
     *
     * 2. Stability Matters:
     *    - Stable: Merge, Insertion (preserve equal element order)
     *    - Unstable: Quick, Heap, Selection
     *
     * 3. Practical Choice:
     *    - Small data (< 50): Insertion
     *    - General purpose: Quick (fastest average)
     *    - Guaranteed O(n log n): Merge or Heap
     *    - Need stability: Merge
     *    - Minimal space: Heap
     */
}`

  const libraryCode = `// Sorting in Java Collections
import java.util.*;

public class SortingInJava {
    public static void main(String[] args) {

        // ===== Arrays.sort() - Dual-Pivot Quick Sort =====
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        Arrays.sort(arr);  // In-place, O(n log n) average

        // WHY dual-pivot?
        // - Faster than single-pivot Quick Sort (5-15% improvement)
        // - Two pivots divide into 3 parts instead of 2
        // - Better cache performance
        // - Used since Java 7 (DualPivotQuicksort class)


        // ===== Arrays.sort() for Objects - Tim Sort =====
        Integer[] objArr = {64, 34, 25, 12, 22};
        Arrays.sort(objArr);  // Stable, O(n log n)

        // WHY TimSort for objects?
        // - Stable sort (preserves order of equal elements)
        // - Hybrid: Merge + Insertion
        // - Optimized for real-world data (often partially sorted)
        // - Best: O(n), Worst: O(n log n)
        // - Used in Python, Java, Android


        // ===== Collections.sort() - Same as Arrays.sort(Object[]) =====
        List<Integer> list = new ArrayList<>(Arrays.asList(64, 34, 25));
        Collections.sort(list);  // Converts to array, sorts, copies back

        // Process:
        // 1. list.toArray() - O(n)
        // 2. Arrays.sort(array) - O(n log n)
        // 3. Copy back to list - O(n)
        // Total: O(n log n)


        // ===== Custom Comparator =====
        List<String> words = Arrays.asList("apple", "pie", "a", "cat");

        // Sort by length
        Collections.sort(words, (a, b) -> a.length() - b.length());
        // Result: ["a", "cat", "pie", "apple"]

        // Or using Comparator
        Collections.sort(words, Comparator.comparingInt(String::length));


        // ===== Reverse Order =====
        Collections.sort(list, Collections.reverseOrder());
        // Or
        Collections.reverse(list);  // O(n) - just reverses


        // ===== Parallel Sort (Java 8+) =====
        int[] bigArray = new int[1000000];
        Arrays.parallelSort(bigArray);

        // WHY parallel?
        // - Uses Fork-Join framework
        // - Splits array into chunks
        // - Sorts chunks in parallel (multi-threaded)
        // - Merges results
        // - Faster for large arrays (> 8192 elements)


        /* PRODUCTION DECISION TREE:
         *
         * Primitive arrays (int[], double[], etc.):
         * └─ Arrays.sort() → Dual-Pivot Quick Sort
         *    ✓ Fastest average case
         *    ✓ In-place O(log n) space
         *    ✗ Unstable (doesn't matter for primitives)
         *
         * Object arrays / Collections:
         * └─ Arrays.sort() / Collections.sort() → Tim Sort
         *    ✓ Stable (preserves equal element order)
         *    ✓ Adaptive (fast for partially sorted)
         *    ✓ Guaranteed O(n log n)
         *    ✗ O(n) extra space
         *
         * Very large arrays (> 1M elements):
         * └─ Arrays.parallelSort()
         *    ✓ Multi-threaded speedup
         *    ✓ 2-4× faster on multi-core
         *    ✗ Higher overhead for small arrays
         *
         * Custom sorting needs:
         * └─ Implement Comparator or Comparable
         *    - Comparator: external comparison logic
         *    - Comparable: natural ordering (compareTo)
         */


        // ===== Stream API Sorting =====
        List<Integer> sorted = list.stream()
            .sorted()  // Natural order
            .collect(Collectors.toList());

        List<Integer> sortedDesc = list.stream()
            .sorted(Comparator.reverseOrder())
            .collect(Collectors.toList());

        // WHY use streams?
        // - Functional style (immutable)
        // - Can chain with filter, map, etc.
        // - Parallel processing: .parallel().sorted()


        // ===== Special Cases =====

        // 1. Partially sorted? Use TimSort (Arrays.sort for objects)
        //    - Optimized for real-world data
        //    - Detects runs of sorted elements

        // 2. Need stability? Use Collections.sort() or Arrays.sort(Object[])
        //    - Example: Sort students by grade, preserve name order for ties

        // 3. Sort by multiple criteria?
        Comparator<Student> multiSort = Comparator
            .comparing(Student::getGrade)
            .thenComparing(Student::getName);

        // 4. Top-K elements? Don't sort entire array!
        //    Use PriorityQueue (heap) - O(n log k) instead of O(n log n)
        PriorityQueue<Integer> topK = new PriorityQueue<>(k);
        // Add n elements, maintain size k
    }
}

/**
 * INTERVIEW TIP: Know which algorithm Java uses!
 *
 * Q: "What sorting algorithm does Arrays.sort() use?"
 * A: "Depends on data type:
 *     - Primitives: Dual-Pivot Quick Sort (O(n log n) average, unstable)
 *     - Objects: Tim Sort (O(n log n) guaranteed, stable)
 *     - Large arrays: Can use parallel sort for speedup"
 *
 * Follow-up: "Why different algorithms?"
 * A: "Primitives don't need stability (5 and 5 are identical).
 *     Objects need stability (two students with same grade
 *     should preserve original order).
 *     Tim Sort is stable but uses extra space - worth it for objects."
 */`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/trie" className="hover:text-blue-600">Trie</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Sorting Algorithms</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Sorting Algorithms - Deep Dive</h1>
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is Sorting?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            <strong>Sorting</strong> is the process of arranging elements in a specific order (ascending or descending).
            It's one of the most fundamental operations in computer science, used everywhere from databases to search engines!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🔑 Why Sorting Matters</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Enables Binary Search:</strong> O(log n) search on sorted data vs O(n) on unsorted</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Database Indexing:</strong> B-trees keep sorted data for fast lookups</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Data Analysis:</strong> Finding median, percentiles, removing duplicates</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Algorithm Prerequisites:</strong> Many algorithms require sorted input</span>
              </li>
            </ul>
          </div>

          {/* Algorithm Comparison Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">O(n²) - Quadratic</h4>
              <div className="text-sm space-y-1">
                <div className="bg-white p-2 rounded"><strong>Bubble Sort:</strong> Swap adjacent</div>
                <div className="bg-white p-2 rounded"><strong>Selection Sort:</strong> Find min, swap</div>
                <div className="bg-white p-2 rounded"><strong>Insertion Sort:</strong> Insert into sorted</div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Use for: Small arrays (&lt;50), educational purposes, nearly sorted data
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">O(n log n) - Efficient</h4>
              <div className="text-sm space-y-1">
                <div className="bg-white p-2 rounded"><strong>Merge Sort:</strong> Divide & merge</div>
                <div className="bg-white p-2 rounded"><strong>Quick Sort:</strong> Partition & recurse</div>
                <div className="bg-white p-2 rounded"><strong>Heap Sort:</strong> Build heap, extract</div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Use for: General purpose, large datasets, production code
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-2">O(n) - Linear</h4>
              <div className="text-sm space-y-1">
                <div className="bg-white p-2 rounded"><strong>Counting Sort:</strong> Count frequencies</div>
                <div className="bg-white p-2 rounded"><strong>Radix Sort:</strong> Sort digit by digit</div>
                <div className="bg-white p-2 rounded"><strong>Bucket Sort:</strong> Distribute to buckets</div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Use for: Integers in known range, special conditions only
              </div>
            </div>
          </div>

          {/* Key Concepts */}
          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">📚 Key Concepts</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <strong className="text-gray-800">Stable Sorting:</strong>
                <p className="text-gray-600 mt-1 text-xs">Preserves relative order of equal elements. Example: Sorting [(5, "a"), (3, "b"), (5, "c")] by number keeps (5, "a") before (5, "c").</p>
              </div>
              <div>
                <strong className="text-gray-800">In-Place Sorting:</strong>
                <p className="text-gray-600 mt-1 text-xs">Uses O(1) or O(log n) extra space. Modifies original array. Example: Quick Sort, Heap Sort.</p>
              </div>
              <div>
                <strong className="text-gray-800">Adaptive Sorting:</strong>
                <p className="text-gray-600 mt-1 text-xs">Takes advantage of existing order. Runs faster on partially sorted data. Example: Insertion Sort O(n) on sorted data.</p>
              </div>
              <div>
                <strong className="text-gray-800">Comparison-Based:</strong>
                <p className="text-gray-600 mt-1 text-xs">Lower bound O(n log n). Can't do better with comparisons alone. Non-comparison sorts can be O(n).</p>
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
                Watch how different algorithms sort the same array! Notice how Quick Sort is fastest, but Bubble Sort
                makes the most comparisons. Try randomizing the array to see different behaviors!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Sorting Visualization</h2>
        </div>

        {/* Array Visualization */}
        <div className="mb-6 bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Current Array:</h3>
            <div className="flex gap-2">
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={sorting}
              >
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="quick">Quick Sort</option>
              </select>
            </div>
          </div>

          {/* Visual Array Bars */}
          <div className="flex items-end justify-center gap-2 h-64 mb-4">
            {array.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-12 transition-all duration-300 ${
                    highlightedIndices.includes(index)
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ height: `${value * 2.5}px` }}
                />
                <div className="text-xs font-semibold mt-1">{value}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Comparisons:</strong> {comparisons}
            </div>
            <div className="bg-green-50 p-3 rounded">
              <strong>Swaps:</strong> {swaps}
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <strong>Array Size:</strong> {array.length}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleSort}
            disabled={sorting}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
          >
            {sorting ? 'Sorting...' : `Sort with ${selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)}`}
          </button>
          <button
            onClick={resetArray}
            disabled={sorting}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
          >
            Reset Array
          </button>
          <button
            onClick={randomizeArray}
            disabled={sorting}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
          >
            Randomize
          </button>
        </div>

        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded mb-4">
            <strong>Result:</strong> {message}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Try This:</strong> Sort with Bubble Sort first (slow, many comparisons), then reset and try Quick Sort
          (fast, fewer comparisons). Notice the difference in efficiency!
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
            title="Sorting Algorithms from Scratch"
            code={scratchCode}
            language="java"
          />
          <CodeDisplay
            title="Sorting in Java Collections"
            code={libraryCode}
            language="java"
          />
        </div>
      </div>

      {/* STEP 4: Advanced Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-slate-500">
        <div className="flex items-center mb-6">
          <div className="bg-slate-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">4</div>
          <h2 className="text-3xl font-bold text-gray-800">Advanced: Production-Grade Sorting</h2>
        </div>

        {/* Memory Impact Analysis */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">💾 Memory Impact: Sorting 1 Million Integers</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border-2 border-gray-300 text-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Algorithm</th>
                  <th className="border border-gray-300 px-4 py-2">Base Array</th>
                  <th className="border border-gray-300 px-4 py-2">Extra Space</th>
                  <th className="border border-gray-300 px-4 py-2">Total Memory</th>
                  <th className="border border-gray-300 px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Quick Sort</td>
                  <td className="border border-gray-300 px-4 py-2">4 MB</td>
                  <td className="border border-gray-300 px-4 py-2">~80 KB</td>
                  <td className="border border-gray-300 px-4 py-2">~4.08 MB</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Recursion stack O(log n) depth</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Heap Sort</td>
                  <td className="border border-gray-300 px-4 py-2">4 MB</td>
                  <td className="border border-gray-300 px-4 py-2">0 KB</td>
                  <td className="border border-gray-300 px-4 py-2">4 MB</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Truly in-place, O(1) space</td>
                </tr>
                <tr className="bg-yellow-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Merge Sort</td>
                  <td className="border border-gray-300 px-4 py-2">4 MB</td>
                  <td className="border border-gray-300 px-4 py-2">4 MB</td>
                  <td className="border border-gray-300 px-4 py-2">8 MB</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Needs auxiliary array O(n)</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Tim Sort</td>
                  <td className="border border-gray-300 px-4 py-2">4 MB</td>
                  <td className="border border-gray-300 px-4 py-2">~2 MB</td>
                  <td className="border border-gray-300 px-4 py-2">~6 MB</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">O(n/2) worst case, adaptive</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Radix Sort</td>
                  <td className="border border-gray-300 px-4 py-2">4 MB</td>
                  <td className="border border-gray-300 px-4 py-2">~4.5 MB</td>
                  <td className="border border-gray-300 px-4 py-2">~8.5 MB</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Buckets + output array</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded">
              <strong className="text-blue-800">Memory-Constrained Systems:</strong>
              <p className="text-gray-700 mt-1">Use Heap Sort (O(1) space) or Quick Sort (O(log n)). Example: Embedded systems, mobile devices with limited RAM.</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <strong className="text-green-800">Need Stability + Speed:</strong>
              <p className="text-gray-700 mt-1">Use Tim Sort (Java/Python default). Worth the O(n) space for stable sorting of objects.</p>
            </div>
          </div>
        </div>

        {/* Advanced Sorting Algorithms */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-purple-700 mb-4">🚀 Beyond Comparison: O(n) Sorting</h3>

          <div className="space-y-6">
            {/* Counting Sort */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="text-xl font-bold text-gray-800 mb-2">1. Counting Sort - O(n + k)</h4>
              <p className="text-gray-700 mb-3">
                <strong>Idea:</strong> Count frequency of each value, then reconstruct sorted array.
              </p>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm mb-3">
                <div className="text-gray-600">// Input: [4, 2, 2, 8, 3, 3, 1]</div>
                <div className="text-gray-600">// Range: 1-8 (k=8)</div>
                <div className="mt-2">Count array: [0, 1, 2, 2, 1, 0, 0, 1]</div>
                <div className="text-gray-600">// Indices:    0  1  2  3  4  5  6  7  8</div>
                <div className="mt-2">Output: [1, 2, 2, 3, 3, 4, 8]</div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded">
                  <strong className="text-green-800">✓ Pros:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• O(n + k) time - linear!</li>
                    <li>• Stable (can preserve order)</li>
                    <li>• Simple to implement</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <strong className="text-red-800">✗ Cons:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• Only for integers in range [0, k]</li>
                    <li>• O(k) extra space (bad if k is large)</li>
                    <li>• Not practical for large ranges</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 bg-yellow-50 p-3 rounded text-sm">
                <strong>Use Case:</strong> Sorting grades (0-100), ages (0-120), small integer ranges. Used as subroutine in Radix Sort.
              </div>
            </div>

            {/* Radix Sort */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="text-xl font-bold text-gray-800 mb-2">2. Radix Sort - O(d × n)</h4>
              <p className="text-gray-700 mb-3">
                <strong>Idea:</strong> Sort digit by digit, from least significant to most significant (LSD) or vice versa (MSD).
              </p>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm mb-3">
                <div className="text-gray-600">// Input: [170, 45, 75, 90, 802, 24, 2, 66]</div>
                <div className="mt-2 text-purple-700">Pass 1 (ones): [170, 90, 802, 2, 24, 45, 75, 66]</div>
                <div className="text-blue-700">Pass 2 (tens):  [802, 2, 24, 45, 66, 170, 75, 90]</div>
                <div className="text-green-700">Pass 3 (100s): [2, 24, 45, 66, 75, 90, 170, 802]</div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded">
                  <strong className="text-green-800">✓ Pros:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• O(d × n) where d = number of digits</li>
                    <li>• Fast for fixed-length integers</li>
                    <li>• Stable (uses counting sort)</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <strong className="text-red-800">✗ Cons:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• Only for integers/strings</li>
                    <li>• O(n + k) space per pass</li>
                    <li>• Slower than Quick Sort in practice</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 bg-yellow-50 p-3 rounded text-sm">
                <strong>Use Case:</strong> Sorting IP addresses, phone numbers, credit cards, fixed-length strings. Used in parallel sorting.
              </div>
            </div>

            {/* Bucket Sort */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="text-xl font-bold text-gray-800 mb-2">3. Bucket Sort - O(n + k)</h4>
              <p className="text-gray-700 mb-3">
                <strong>Idea:</strong> Distribute elements into buckets, sort each bucket, concatenate.
              </p>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm mb-3">
                <div className="text-gray-600">// Input: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]</div>
                <div className="mt-2">Bucket 0 [0.0-0.1]: []</div>
                <div>Bucket 1 [0.1-0.2]: [0.17, 0.12]</div>
                <div>Bucket 2 [0.2-0.3]: [0.26, 0.21, 0.23]</div>
                <div>Bucket 3 [0.3-0.4]: [0.39]</div>
                <div>Bucket 7 [0.7-0.8]: [0.78, 0.72]</div>
                <div>Bucket 9 [0.9-1.0]: [0.94]</div>
                <div className="mt-2 text-green-700">// Sort each bucket, then concatenate</div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded">
                  <strong className="text-green-800">✓ Pros:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• O(n) for uniformly distributed data</li>
                    <li>• Works with floats/doubles</li>
                    <li>• Parallelizable (sort buckets independently)</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <strong className="text-red-800">✗ Cons:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• Degrades to O(n²) if uneven distribution</li>
                    <li>• Requires knowledge of data range</li>
                    <li>• Extra space for buckets</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 bg-yellow-50 p-3 rounded text-sm">
                <strong>Use Case:</strong> Sorting uniformly distributed data (timestamps, random numbers), external sorting, MapReduce.
              </div>
            </div>
          </div>
        </div>

        {/* Production Sorting Algorithms */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-green-700 mb-4">🏭 Production Sorting: What Real Systems Use</h3>

          <div className="space-y-6">
            {/* Tim Sort */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border-2 border-blue-300">
              <h4 className="text-xl font-bold text-blue-800 mb-2">Tim Sort (Python, Java for Objects)</h4>
              <p className="text-gray-700 mb-3">
                Hybrid of Merge Sort + Insertion Sort. Invented by Tim Peters in 2002 for Python.
              </p>

              <div className="bg-white p-4 rounded mb-3">
                <strong className="text-gray-800">How it works:</strong>
                <ol className="mt-2 space-y-1 text-sm text-gray-700 list-decimal list-inside">
                  <li><strong>Find runs:</strong> Identify already-sorted subsequences (natural runs)</li>
                  <li><strong>Extend runs:</strong> If run too short (&lt;32), extend with insertion sort</li>
                  <li><strong>Merge runs:</strong> Merge runs using galloping mode (binary search)</li>
                  <li><strong>Maintain stack:</strong> Keep runs balanced on stack, merge when needed</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <strong>Complexity:</strong>
                  <div className="mt-1 space-y-1 text-gray-700">
                    <div>Best: O(n)</div>
                    <div>Average: O(n log n)</div>
                    <div>Worst: O(n log n)</div>
                    <div>Space: O(n)</div>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <strong>Advantages:</strong>
                  <div className="mt-1 space-y-1 text-gray-700">
                    <div>✓ Stable sort</div>
                    <div>✓ Adaptive (fast on partial)</div>
                    <div>✓ Guaranteed O(n log n)</div>
                    <div>✓ Excellent real-world perf</div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <strong>Used By:</strong>
                  <div className="mt-1 space-y-1 text-gray-700">
                    <div>• Python (list.sort())</div>
                    <div>• Java (Arrays.sort Object[])</div>
                    <div>• Android (Collections)</div>
                    <div>• Swift (standard library)</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 bg-purple-50 p-3 rounded text-sm">
                <strong className="text-purple-800">Why so good?</strong> Real-world data is often partially sorted (logs by time, database records).
                Tim Sort exploits this with O(n) performance on already-sorted data!
              </div>
            </div>

            {/* Dual-Pivot Quick Sort */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-5 rounded-lg border-2 border-orange-300">
              <h4 className="text-xl font-bold text-orange-800 mb-2">Dual-Pivot Quick Sort (Java for Primitives)</h4>
              <p className="text-gray-700 mb-3">
                Improved Quick Sort with two pivots instead of one. Used in Java since version 7.
              </p>

              <div className="bg-white p-4 rounded mb-3">
                <strong className="text-gray-800">How it works:</strong>
                <ol className="mt-2 space-y-1 text-sm text-gray-700 list-decimal list-inside">
                  <li><strong>Choose 2 pivots:</strong> P1 = arr[1/3], P2 = arr[2/3] (ensure P1 &lt; P2)</li>
                  <li><strong>3-way partition:</strong> &lt;P1 | P1≤x≤P2 | &gt;P2</li>
                  <li><strong>Recurse:</strong> Sort all 3 parts independently</li>
                  <li><strong>Insertion for small:</strong> Switch to insertion sort for n &lt; 47</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-orange-50 p-3 rounded">
                  <strong>Complexity:</strong>
                  <div className="mt-1 space-y-1 text-gray-700">
                    <div>Best: O(n log n)</div>
                    <div>Average: O(n log n)</div>
                    <div>Worst: O(n²) rare</div>
                    <div>Space: O(log n)</div>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <strong>Advantages:</strong>
                  <div className="mt-1 space-y-1 text-gray-700">
                    <div>✓ Faster than single-pivot</div>
                    <div>✓ In-place sorting</div>
                    <div>✓ Cache-friendly</div>
                    <div>✓ 5-15% speedup</div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <strong>Used For:</strong>
                  <div className="mt-1 space-y-1 text-gray-700">
                    <div>• Java Arrays.sort(int[])</div>
                    <div>• Primitives only</div>
                    <div>• High-performance needs</div>
                    <div>• When stability not needed</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 bg-blue-50 p-3 rounded text-sm">
                <strong className="text-blue-800">Why not for objects?</strong> Unstable sort. For primitives (int, double),
                stability doesn't matter (5 and 5 are identical). For objects, need stable sort (Tim Sort).
              </div>
            </div>

            {/* Intro Sort */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-5 rounded-lg border-2 border-green-300">
              <h4 className="text-xl font-bold text-green-800 mb-2">Intro Sort (C++ std::sort)</h4>
              <p className="text-gray-700 mb-3">
                Hybrid: Quick Sort + Heap Sort + Insertion Sort. Guarantees O(n log n) worst case.
              </p>

              <div className="bg-white p-4 rounded mb-3">
                <strong className="text-gray-800">Algorithm:</strong>
                <div className="mt-2 space-y-2 text-sm text-gray-700">
                  <div><strong>1. Start with Quick Sort:</strong> Use median-of-three pivot selection</div>
                  <div><strong>2. Monitor depth:</strong> Track recursion depth limit = 2 × log₂(n)</div>
                  <div><strong>3. Switch to Heap Sort:</strong> If depth limit exceeded (pathological case)</div>
                  <div><strong>4. Finish with Insertion:</strong> For small subarrays (n &lt; 16)</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded">
                  <strong className="text-green-800">Why this combo?</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• Quick Sort: Fast average O(n log n)</li>
                    <li>• Heap Sort: Guaranteed O(n log n) backup</li>
                    <li>• Insertion: Best for small arrays</li>
                    <li>• No worst-case O(n²) ever!</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <strong className="text-blue-800">Used By:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700">
                    <li>• C++ std::sort()</li>
                    <li>• .NET Array.Sort()</li>
                    <li>• Most C++ implementations</li>
                    <li>• Performance-critical code</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Impact */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border-2 border-yellow-400">
          <h3 className="text-2xl font-bold text-amber-800 mb-4">🌍 Real-World Impact: Sorting at Scale</h3>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-blue-700 mb-2">Google: Sorting 1 Petabyte (1000 TB)</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Challenge:</strong> Sort web crawl data (trillions of URLs, page ranks, links)</p>
                <p><strong>Solution:</strong> MapReduce with external merge sort</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Divide data into chunks, sort each chunk (Quick Sort)</li>
                  <li>Write sorted chunks to disk</li>
                  <li>Multi-way merge using priority queue (heap)</li>
                  <li>Uses 1000s of machines in parallel</li>
                </ul>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <strong>Result:</strong> Sorted 1 PB in ~6 hours (2008). Now much faster with improved algorithms and hardware.
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-green-700 mb-2">Facebook: News Feed Ranking</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Challenge:</strong> Sort ~1500 posts per user by relevance score, real-time</p>
                <p><strong>Solution:</strong> Partial sorting with selection algorithms</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Don't need fully sorted - only top 20-30 posts</li>
                  <li>Use QuickSelect to find top-K: O(n) instead of O(n log n)</li>
                  <li>Only sort the top-K subset</li>
                  <li>Caching of pre-sorted segments</li>
                </ul>
                <div className="bg-green-50 p-3 rounded mt-2">
                  <strong>Optimization:</strong> 50% faster than full sort. Saves millions in server costs.
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-purple-700 mb-2">Database Systems: External Sorting</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Problem:</strong> Sort tables larger than available RAM (e.g., 100 GB table, 4 GB RAM)</p>
                <p><strong>Solution:</strong> External merge sort</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Phase 1:</strong> Read chunks that fit in RAM, sort (Quick Sort), write to disk</li>
                  <li><strong>Phase 2:</strong> K-way merge using priority queue</li>
                  <li><strong>Optimization:</strong> Minimize disk I/O (main bottleneck)</li>
                  <li>Used in ORDER BY, GROUP BY, JOIN operations</li>
                </ul>
                <div className="bg-purple-50 p-3 rounded mt-2">
                  <strong>PostgreSQL:</strong> Uses replacement selection + polyphase merge. Can sort 1 TB in ~30 minutes.
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-red-700 mb-2">Netflix: Video Recommendation Sorting</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Challenge:</strong> Sort millions of videos by predicted rating for each user</p>
                <p><strong>Solution:</strong> Approximate sorting + caching</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Don't need perfect sort - approximate top-N is fine</li>
                  <li>Bucket sort by predicted rating buckets (0-1, 1-2, 2-3, 3-4, 4-5)</li>
                  <li>Randomize within buckets (exploration)</li>
                  <li>Cache sorted results, recompute daily</li>
                </ul>
                <div className="bg-red-50 p-3 rounded mt-2">
                  <strong>Trade-off:</strong> Accuracy vs Speed. Approximate sorting 100× faster, 98% as accurate.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Problems */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-red-700 mb-4">🎯 Top 5 Sorting Interview Problems</h3>

          <div className="space-y-6">
            {/* Problem 1 */}
            <div className="border-2 border-blue-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Sort Colors (Dutch National Flag)</h4>
                  <p className="text-sm text-gray-600">Difficulty: Medium | Companies: Microsoft, Amazon, Google</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Given array with values 0, 1, 2 representing red, white, blue.
                  Sort in-place so that objects of same color are adjacent (0s, then 1s, then 2s).
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Input: [2,0,2,1,1,0]<br/>
                  Output: [0,0,1,1,2,2]
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Three-Way Partitioning O(n)</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;

    // Invariant:
    // [0...low-1]: all 0s
    // [low...mid-1]: all 1s
    // [mid...high]: unknown
    // [high+1...end]: all 2s

    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums, low, mid);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {  // nums[mid] == 2
            swap(nums, mid, high);
            high--;
            // Don't increment mid! Need to check swapped value
        }
    }
}

// Time: O(n) - single pass
// Space: O(1) - in-place
// Key: Three pointers to partition into 3 regions`}
                </div>
              </details>
            </div>

            {/* Problem 2 */}
            <div className="border-2 border-green-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Kth Largest Element (QuickSelect)</h4>
                  <p className="text-sm text-gray-600">Difficulty: Medium | Companies: Facebook, Amazon, Bloomberg</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Find the kth largest element in an unsorted array. Note: k is 1-indexed.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Input: [3,2,1,5,6,4], k = 2<br/>
                  Output: 5 (the 2nd largest)
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: QuickSelect O(n) Average</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public int findKthLargest(int[] nums, int k) {
    // Convert to 0-indexed from end
    return quickSelect(nums, 0, nums.length - 1, nums.length - k);
}

private int quickSelect(int[] nums, int left, int right, int k) {
    if (left == right) return nums[left];

    // Random pivot to avoid worst case
    int pivotIndex = left + new Random().nextInt(right - left + 1);
    pivotIndex = partition(nums, left, right, pivotIndex);

    if (k == pivotIndex) {
        return nums[k];  // Found it!
    } else if (k < pivotIndex) {
        return quickSelect(nums, left, pivotIndex - 1, k);
    } else {
        return quickSelect(nums, pivotIndex + 1, right, k);
    }
}

private int partition(int[] nums, int left, int right, int pivotIndex) {
    int pivot = nums[pivotIndex];
    swap(nums, pivotIndex, right);  // Move pivot to end
    int storeIndex = left;

    for (int i = left; i < right; i++) {
        if (nums[i] < pivot) {
            swap(nums, i, storeIndex);
            storeIndex++;
        }
    }
    swap(nums, storeIndex, right);  // Move pivot to final position
    return storeIndex;
}

// Time: O(n) average, O(n²) worst (use random pivot!)
// Space: O(1)
// Why not sort? O(n log n) vs O(n) - huge difference!
// Alternative: Min heap of size k - O(n log k)`}
                </div>
              </details>
            </div>

            {/* Problem 3 */}
            <div className="border-2 border-purple-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Merge K Sorted Lists</h4>
                  <p className="text-sm text-gray-600">Difficulty: Hard | Companies: Google, Amazon, Microsoft</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Merge k sorted linked lists into one sorted list.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Input: [[1,4,5], [1,3,4], [2,6]]<br/>
                  Output: [1,1,2,3,4,4,5,6]
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Min Heap O(N log k)</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public ListNode mergeKLists(ListNode[] lists) {
    if (lists == null || lists.length == 0) return null;

    // Min heap: store (node value, list index)
    PriorityQueue<ListNode> heap = new PriorityQueue<>(
        (a, b) -> a.val - b.val
    );

    // Add first node from each list
    for (ListNode node : lists) {
        if (node != null) {
            heap.offer(node);
        }
    }

    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;

    while (!heap.isEmpty()) {
        ListNode min = heap.poll();  // Get minimum
        tail.next = min;
        tail = tail.next;

        if (min.next != null) {
            heap.offer(min.next);  // Add next from same list
        }
    }

    return dummy.next;
}

// Time: O(N log k) where N = total nodes, k = number of lists
// Space: O(k) for heap
// Why heap? Always need minimum among k candidates
// Alternative: Merge pairs recursively - also O(N log k) but more complex`}
                </div>
              </details>
            </div>

            {/* Problem 4 */}
            <div className="border-2 border-orange-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Meeting Rooms II (Interval Sorting)</h4>
                  <p className="text-sm text-gray-600">Difficulty: Medium | Companies: Facebook, Google, Amazon</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Given meeting time intervals, find minimum number of conference rooms required.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Input: [[0,30], [5,10], [15,20]]<br/>
                  Output: 2 (rooms needed at time 5: [0,30] and [5,10] overlap)
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Sort + Min Heap O(n log n)</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;

    // Sort by start time
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

    // Min heap of end times (when rooms become free)
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    heap.offer(intervals[0][1]);  // First meeting's end time

    for (int i = 1; i < intervals.length; i++) {
        // If earliest ending meeting finishes before this starts
        if (intervals[i][0] >= heap.peek()) {
            heap.poll();  // Reuse that room
        }
        // Add this meeting's end time
        heap.offer(intervals[i][1]);
    }

    return heap.size();  // Rooms needed = meetings in progress
}

// Time: O(n log n) - sorting + heap ops
// Space: O(n) - heap
// Key insight: Sort by start, track end times in heap
// Alternative: Sweep line (start/end events) - same complexity`}
                </div>
              </details>
            </div>

            {/* Problem 5 */}
            <div className="border-2 border-red-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Maximum Gap (Bucket Sort Application)</h4>
                  <p className="text-sm text-gray-600">Difficulty: Hard | Companies: Amazon, Google</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Given unsorted array, find maximum difference between successive elements
                  in sorted form. Must be O(n) time and space.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Input: [3,6,9,1]<br/>
                  Output: 3 (sorted: [1,3,6,9], max gap is 9-6=3)
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Pigeonhole Principle + Buckets O(n)</summary>
                <div className="mt-3 font-mono text-xs bg-white p-3 rounded overflow-x-auto">
{`public int maximumGap(int[] nums) {
    if (nums.length < 2) return 0;

    int n = nums.length;
    int min = Arrays.stream(nums).min().getAsInt();
    int max = Arrays.stream(nums).max().getAsInt();

    // Bucket size: ceiling of (max - min) / (n - 1)
    int bucketSize = Math.max(1, (max - min) / (n - 1));
    int bucketCount = (max - min) / bucketSize + 1;

    int[] bucketMin = new int[bucketCount];
    int[] bucketMax = new int[bucketCount];
    Arrays.fill(bucketMin, Integer.MAX_VALUE);
    Arrays.fill(bucketMax, Integer.MIN_VALUE);

    // Place numbers in buckets
    for (int num : nums) {
        int idx = (num - min) / bucketSize;
        bucketMin[idx] = Math.min(bucketMin[idx], num);
        bucketMax[idx] = Math.max(bucketMax[idx], num);
    }

    // Max gap is between buckets (not within!)
    int maxGap = 0;
    int previousMax = min;

    for (int i = 0; i < bucketCount; i++) {
        if (bucketMin[i] == Integer.MAX_VALUE) continue;  // Empty bucket
        maxGap = Math.max(maxGap, bucketMin[i] - previousMax);
        previousMax = bucketMax[i];
    }

    return maxGap;
}

// Time: O(n)
// Space: O(n)
// Key insight: Pigeonhole principle - max gap must be >= ceiling((max-min)/(n-1))
// So max gap cannot be WITHIN a bucket, must be BETWEEN buckets!`}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Decision Framework */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-300">
          <h3 className="text-2xl font-bold text-indigo-800 mb-4">🧭 Sorting Algorithm Decision Framework</h3>

          <div className="space-y-3 text-sm">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
              <strong className="text-blue-700">Small array (n &lt; 50):</strong>
              <p className="text-gray-700 mt-1">→ Insertion Sort. Simple, fast for small n, O(1) space.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
              <strong className="text-green-700">General purpose, large array:</strong>
              <p className="text-gray-700 mt-1">→ Quick Sort (or library default). Fastest average case, in-place.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
              <strong className="text-purple-700">Need guaranteed O(n log n):</strong>
              <p className="text-gray-700 mt-1">→ Merge Sort or Heap Sort. No worst-case O(n²) degradation.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
              <strong className="text-yellow-700">Need stability (preserve equal order):</strong>
              <p className="text-gray-700 mt-1">→ Merge Sort or Tim Sort. Essential for sorting objects with multiple fields.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
              <strong className="text-red-700">Memory constrained (O(1) space required):</strong>
              <p className="text-gray-700 mt-1">→ Heap Sort. Only in-place O(n log n) guaranteed algorithm.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500">
              <strong className="text-indigo-700">Partially sorted data:</strong>
              <p className="text-gray-700 mt-1">→ Tim Sort or Insertion Sort. Adaptive algorithms exploit existing order.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
              <strong className="text-orange-700">Integers in small range:</strong>
              <p className="text-gray-700 mt-1">→ Counting Sort or Radix Sort. O(n) time for special conditions.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-teal-500">
              <strong className="text-teal-700">Only need top-K elements:</strong>
              <p className="text-gray-700 mt-1">→ QuickSelect or Min/Max Heap. O(n) vs O(n log n) - don't sort everything!</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-pink-500">
              <strong className="text-pink-700">External sorting (data &gt; RAM):</strong>
              <p className="text-gray-700 mt-1">→ External Merge Sort. Minimize disk I/O with k-way merge.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-gray-500">
              <strong className="text-gray-700">Production code (don't implement yourself!):</strong>
              <p className="text-gray-700 mt-1">→ Arrays.sort() / Collections.sort(). Highly optimized, battle-tested implementations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
        <Link
          to="/trie"
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          <span className="mr-2">←</span> Previous: Trie
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

export default SortingVisualizerEnhanced
