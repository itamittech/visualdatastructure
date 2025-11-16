import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function LRUCacheVisualizerEnhanced() {
  const [capacity, setCapacity] = useState(4)
  const [cache, setCache] = useState([]) // Array of {key, value} representing DLL from head to tail
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [highlightedKey, setHighlightedKey] = useState(null)
  const [operation, setOperation] = useState('get')
  const [inputKey, setInputKey] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [operationCount, setOperationCount] = useState(0)

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleGet = async (key) => {
    setHighlightedKey(key)
    await delay(500)

    const index = cache.findIndex(item => item.key === key)
    if (index !== -1) {
      // Found! Move to head (most recently used)
      const item = cache[index]
      const newCache = [item, ...cache.filter((_, i) => i !== index)]
      setCache(newCache)
      setMessage(`✓ Cache HIT! Key "${key}" found with value "${item.value}". Moved to front (most recent).`)
      setOperationCount(prev => prev + 1)
    } else {
      setMessage(`✗ Cache MISS! Key "${key}" not found in cache.`)
    }

    await delay(500)
    setHighlightedKey(null)
  }

  const handlePut = async (key, value) => {
    setHighlightedKey(key)
    await delay(500)

    const index = cache.findIndex(item => item.key === key)

    if (index !== -1) {
      // Key exists, update value and move to head
      const newCache = [{ key, value }, ...cache.filter((_, i) => i !== index)]
      setCache(newCache)
      setMessage(`✓ Updated key "${key}" to value "${value}". Moved to front (most recent).`)
    } else {
      // Key doesn't exist, add to head
      let newCache = [{ key, value }, ...cache]

      if (newCache.length > capacity) {
        // Evict LRU (tail)
        const evicted = newCache[newCache.length - 1]
        newCache = newCache.slice(0, capacity)
        setMessage(`✓ Added key "${key}" with value "${value}". Cache full! Evicted LRU key "${evicted.key}".`)
      } else {
        setMessage(`✓ Added key "${key}" with value "${value}". Cache size: ${newCache.length}/${capacity}.`)
      }

      setCache(newCache)
    }

    setOperationCount(prev => prev + 1)
    await delay(500)
    setHighlightedKey(null)
  }

  const handleOperation = () => {
    if (operation === 'get') {
      if (inputKey) {
        handleGet(inputKey)
        setInputKey('')
      }
    } else {
      if (inputKey && inputValue) {
        handlePut(inputKey, inputValue)
        setInputKey('')
        setInputValue('')
      }
    }
  }

  const handleReset = () => {
    setCache([])
    setMessage('')
    setHighlightedKey(null)
    setOperationCount(0)
  }

  const handleDemo = async () => {
    setCache([])
    setMessage('Running demo...')
    await delay(1000)

    await handlePut('A', '1')
    await delay(1000)
    await handlePut('B', '2')
    await delay(1000)
    await handlePut('C', '3')
    await delay(1000)
    await handlePut('D', '4')
    await delay(1000)
    await handleGet('B')
    await delay(1000)
    await handlePut('E', '5') // Will evict A
    await delay(1000)
    await handleGet('A') // Cache miss
    await delay(500)
    setMessage('Demo complete! Notice how B was moved to front when accessed, so A was evicted instead of B.')
  }

  const complexityData = {
    operations: [
      {
        name: 'get(key)',
        time: 'O(1)',
        space: 'O(1)',
        description: 'HashMap lookup + move to head of DLL. Both O(1)!'
      },
      {
        name: 'put(key, value)',
        time: 'O(1)',
        space: 'O(1)',
        description: 'HashMap insert + add to head of DLL. Eviction is O(1) (remove tail).'
      },
      {
        name: 'Overall Space',
        time: 'N/A',
        space: 'O(capacity)',
        description: 'HashMap stores key→node, DLL stores nodes. Total: 2 × capacity.'
      },
    ]
  }

  const scratchCode = `// LRU Cache from Scratch
import java.util.*;

/**
 * LRU (Least Recently Used) Cache
 *
 * KEY IDEA: Combine HashMap + Doubly Linked List
 * - HashMap: O(1) key lookup → node
 * - DLL: O(1) move to head, O(1) remove tail
 *
 * DESIGN PATTERN:
 * - Head = Most Recently Used (MRU)
 * - Tail = Least Recently Used (LRU)
 * - On access: Move to head
 * - On eviction: Remove tail
 *
 * WHY NOT USE:
 * - HashMap + ArrayList? Remove middle is O(n)
 * - HashMap + LinkedList? No O(1) access to arbitrary node
 * - TreeMap? O(log n) operations, don't need ordering
 *
 * INTERVIEW TIP: This is the #1 design question!
 * Companies: Google, Facebook, Amazon, Microsoft
 */
public class LRUCache {

    // Doubly Linked List Node
    class Node {
        int key;
        int value;
        Node prev;
        Node next;

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<Integer, Node> map;  // key → node
    private final Node head;  // Dummy head (MRU side)
    private final Node tail;  // Dummy tail (LRU side)

    /**
     * WHY DUMMY NODES?
     * - Simplify edge cases (empty list, single element)
     * - No null checks when adding/removing
     * - head.next = actual first element
     * - tail.prev = actual last element
     *
     * Structure: head ↔ [elements] ↔ tail
     */
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();

        // Initialize dummy nodes
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    /**
     * GET: Retrieve value for key
     *
     * Steps:
     * 1. Check if key exists in HashMap
     * 2. If yes: Move node to head (mark as recently used)
     * 3. Return value
     *
     * Time: O(1)
     * - HashMap lookup: O(1)
     * - Remove from DLL: O(1) (we have direct reference)
     * - Add to head: O(1)
     */
    public int get(int key) {
        Node node = map.get(key);

        if (node == null) {
            return -1;  // Cache miss
        }

        // Move to head (most recently used)
        remove(node);
        addToHead(node);

        return node.value;
    }

    /**
     * PUT: Insert or update key-value pair
     *
     * Cases:
     * 1. Key exists: Update value, move to head
     * 2. Key doesn't exist:
     *    a. Cache not full: Add to head
     *    b. Cache full: Remove tail (LRU), add to head
     *
     * Time: O(1)
     * - All operations (remove, add, evict) are O(1)
     */
    public void put(int key, int value) {
        Node node = map.get(key);

        if (node != null) {
            // Key exists: Update and move to head
            node.value = value;
            remove(node);
            addToHead(node);
        } else {
            // Key doesn't exist: Create new node
            Node newNode = new Node(key, value);
            map.put(key, newNode);
            addToHead(newNode);

            // Check capacity
            if (map.size() > capacity) {
                // Evict LRU (tail)
                Node lru = tail.prev;
                remove(lru);
                map.remove(lru.key);  // Remove from HashMap too!
            }
        }
    }

    /**
     * HELPER: Add node right after head (most recent position)
     *
     * Before: head ↔ A ↔ B ↔ tail
     * After:  head ↔ node ↔ A ↔ B ↔ tail
     *
     * Time: O(1) - fixed number of pointer updates
     */
    private void addToHead(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    /**
     * HELPER: Remove node from DLL
     *
     * Before: A ↔ node ↔ B
     * After:  A ↔ B
     *
     * Time: O(1) - direct access to prev/next
     *
     * KEY: We can remove in O(1) because we have reference to node!
     * If we only had key, we'd need O(n) search in DLL.
     * That's why HashMap stores key → node reference!
     */
    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    /**
     * EXAMPLE TRACE:
     *
     * LRUCache cache = new LRUCache(2);
     *
     * cache.put(1, 1);
     * State: head ↔ [1:1] ↔ tail
     * Map: {1 → Node(1,1)}
     *
     * cache.put(2, 2);
     * State: head ↔ [2:2] ↔ [1:1] ↔ tail
     * Map: {1 → Node(1,1), 2 → Node(2,2)}
     *
     * cache.get(1);  // Returns 1
     * State: head ↔ [1:1] ↔ [2:2] ↔ tail  (1 moved to head!)
     *
     * cache.put(3, 3);  // Evicts 2 (LRU)
     * State: head ↔ [3:3] ↔ [1:1] ↔ tail
     * Map: {1 → Node(1,1), 3 → Node(3,3)}  (2 removed!)
     *
     * cache.get(2);  // Returns -1 (evicted)
     */
}

/**
 * VARIATIONS & FOLLOW-UPS:
 *
 * 1. LFU Cache (Least Frequently Used):
 *    - Track access frequency instead of recency
 *    - Evict least frequently used
 *    - Harder! Need frequency map + multiple DLLs
 *
 * 2. TTL Cache (Time To Live):
 *    - Each entry has expiration time
 *    - Evict expired entries
 *    - Need timestamp + background cleanup
 *
 * 3. Thread-Safe LRU:
 *    - Add synchronized keyword
 *    - Or use ConcurrentHashMap + locks
 *    - Performance trade-off
 *
 * 4. Write-Through vs Write-Back:
 *    - Write-through: Write to cache + DB immediately
 *    - Write-back: Write to cache, DB later (faster, risky)
 */

/**
 * COMMON MISTAKES:
 *
 * 1. Forgetting to update HashMap on eviction
 *    remove(lru);
 *    map.remove(lru.key);  // DON'T FORGET THIS!
 *
 * 2. Not moving to head on get()
 *    - get() should mark as recently used!
 *
 * 3. Using singly linked list
 *    - Can't remove node in O(1) without prev pointer
 *
 * 4. Capacity check in wrong place
 *    - Check AFTER adding, not before
 *    - if (map.size() > capacity) not (map.size() >= capacity)
 */`

  const libraryCode = `// LRU Cache in Java: Using LinkedHashMap
import java.util.*;

/**
 * CHEAT CODE: Java's LinkedHashMap!
 *
 * LinkedHashMap = HashMap + Doubly Linked List (built-in!)
 * - Maintains insertion order (or access order!)
 * - Can override removeEldestEntry() for automatic eviction
 *
 * This is the "production" way to implement LRU cache in Java.
 * For interviews, implement from scratch to show you understand!
 */
public class LRUCacheLibrary {

    /**
     * METHOD 1: Extend LinkedHashMap (cleanest!)
     */
    class LRUCacheV1 extends LinkedHashMap<Integer, Integer> {
        private final int capacity;

        /**
         * KEY PARAMETERS:
         * - initialCapacity: HashMap size
         * - loadFactor: 0.75 default (rehash when 75% full)
         * - accessOrder: true = access order, false = insertion order
         *
         * accessOrder = true makes it LRU!
         * - get() moves entry to end
         * - Eldest = first entry (least recently used)
         */
        public LRUCacheV1(int capacity) {
            super(capacity, 0.75f, true);  // accessOrder = true!
            this.capacity = capacity;
        }

        public int get(int key) {
            return super.getOrDefault(key, -1);
        }

        public void put(int key, int value) {
            super.put(key, value);
        }

        /**
         * Called after each put()
         * Return true to remove eldest entry
         *
         * This handles eviction automatically!
         */
        @Override
        protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
            return size() > capacity;
        }
    }


    /**
     * METHOD 2: Composition with LinkedHashMap
     * (When you can't extend, e.g., already extending another class)
     */
    class LRUCacheV2 {
        private final int capacity;
        private final LinkedHashMap<Integer, Integer> map;

        public LRUCacheV2(int capacity) {
            this.capacity = capacity;
            // Note: Using composition, so we manually handle access order
            this.map = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                    return size() > capacity;
                }
            };
        }

        public int get(int key) {
            return map.getOrDefault(key, -1);
        }

        public void put(int key, int value) {
            map.put(key, value);
        }
    }


    /**
     * METHOD 3: Manual implementation (interview style)
     * Use when you need custom behavior or to show understanding
     */
    class LRUCacheV3 {
        private final int capacity;
        private final Map<Integer, Integer> map;

        public LRUCacheV3(int capacity) {
            this.capacity = capacity;
            this.map = new LinkedHashMap<>(capacity, 0.75f, true);
        }

        public int get(int key) {
            return map.getOrDefault(key, -1);
        }

        public void put(int key, int value) {
            map.put(key, value);

            // Manual eviction
            if (map.size() > capacity) {
                // Get first key (eldest)
                Integer firstKey = map.keySet().iterator().next();
                map.remove(firstKey);
            }
        }
    }


    /**
     * COMPARISON: Custom vs LinkedHashMap
     *
     * Custom (HashMap + DLL):
     * ✓ Full control over behavior
     * ✓ Learn data structure internals
     * ✓ Better for interviews (shows knowledge)
     * ✗ More code to maintain
     * ✗ More places for bugs
     *
     * LinkedHashMap:
     * ✓ Production-ready, battle-tested
     * ✓ Concise, less code
     * ✓ Maintained by Java team
     * ✗ Less control over internals
     * ✗ Interviewer may want custom implementation
     */


    /**
     * REAL-WORLD CACHE LIBRARIES:
     *
     * 1. Google Guava Cache
     *    - Feature-rich: TTL, size limits, stats
     *    - Thread-safe
     *    - Loading cache (auto-populate on miss)
     */
    public void guavaCacheExample() {
        // Requires Guava dependency
        /*
        Cache<String, String> cache = CacheBuilder.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .recordStats()
            .build();

        cache.put("key", "value");
        String value = cache.getIfPresent("key");
        */
    }

    /**
     * 2. Caffeine Cache (modern, faster than Guava)
     *    - Replacement for Guava Cache
     *    - Better performance (W-TinyLFU eviction)
     *    - Async loading
     */
    public void caffeineCacheExample() {
        /*
        Cache<String, String> cache = Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(Duration.ofMinutes(5))
            .recordStats()
            .build();

        cache.put("key", "value");
        String value = cache.getIfPresent("key");
        */
    }

    /**
     * 3. EhCache (enterprise-grade)
     *    - Disk persistence
     *    - Distributed caching
     *    - JCache (JSR-107) compliant
     */


    /**
     * WHEN TO USE EACH:
     *
     * Interview / Learning:
     * → Implement from scratch (HashMap + DLL)
     *
     * Quick prototype:
     * → LinkedHashMap with accessOrder = true
     *
     * Production (small scale):
     * → Caffeine or Guava Cache
     *
     * Production (large scale / distributed):
     * → Redis, Memcached, EhCache
     * → Distributed systems need special handling
     */


    /**
     * TESTING YOUR LRU CACHE:
     */
    public static void main(String[] args) {
        LRUCacheV1 cache = new LRUCacheV1(2);

        cache.put(1, 1);
        cache.put(2, 2);
        System.out.println(cache.get(1));  // 1 (moves to end)

        cache.put(3, 3);  // Evicts 2 (was LRU)
        System.out.println(cache.get(2));  // -1 (evicted)

        cache.put(4, 4);  // Evicts 1
        System.out.println(cache.get(1));  // -1 (evicted)
        System.out.println(cache.get(3));  // 3
        System.out.println(cache.get(4));  // 4
    }
}

/**
 * INTERVIEW TIP: What to say
 *
 * "I'll implement this from scratch using a HashMap for O(1) lookup
 * and a Doubly Linked List for O(1) insertion and deletion.
 * In production, I'd use LinkedHashMap with accessOrder=true,
 * or a library like Caffeine for more features.
 *
 * The key insight is that we need both fast lookup (HashMap)
 * and fast reordering (DLL). A HashMap alone can't track order.
 * An array can track order but can't remove middle elements in O(1)."
 */`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/searching" className="hover:text-blue-600">Searching Algorithms</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">LRU Cache</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">LRU Cache - Deep Dive</h1>
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
          <div className="text-2xl mr-3">💾</div>
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is LRU Cache?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            <strong>LRU (Least Recently Used) Cache</strong> is a data structure that stores a limited number of items
            and automatically evicts the least recently used item when capacity is reached. It combines HashMap for O(1)
            lookup with Doubly Linked List for O(1) reordering!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🔑 Why LRU Cache Matters</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Browser Caching:</strong> Keep recently viewed pages in memory for instant access</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>CPU Caching:</strong> L1/L2/L3 caches use LRU-like policies for frequently accessed data</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Database Query Cache:</strong> Store recent query results to avoid expensive DB hits</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>CDN Edge Caching:</strong> Cache popular content closer to users</span>
              </li>
            </ul>
          </div>

          {/* Key Design */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-3 text-xl">🏗️ Design: HashMap + Doubly Linked List</h4>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded">
                <strong className="text-blue-700">HashMap:</strong>
                <p className="text-sm text-gray-700 mt-1">
                  Provides O(1) key → value lookup. Maps key → node reference in the linked list.
                </p>
              </div>
              <div className="bg-white p-4 rounded">
                <strong className="text-green-700">Doubly Linked List:</strong>
                <p className="text-sm text-gray-700 mt-1">
                  Maintains access order. Head = Most Recently Used (MRU), Tail = Least Recently Used (LRU).
                  Doubly linked allows O(1) removal of any node.
                </p>
              </div>
              <div className="bg-white p-4 rounded">
                <strong className="text-purple-700">Operations:</strong>
                <ul className="text-sm text-gray-700 mt-1 space-y-1">
                  <li>• <strong>get(key):</strong> If found, move to head (mark as recently used). O(1)</li>
                  <li>• <strong>put(key, value):</strong> Add to head. If capacity exceeded, remove tail (LRU). O(1)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Why not alternatives */}
          <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
            <h4 className="font-bold text-red-800 mb-2">❌ Why Not Use Alternatives?</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <strong className="text-gray-800">HashMap + ArrayList?</strong>
                <p className="text-gray-600 mt-1 text-xs">Remove middle element is O(n). Can't reorder efficiently.</p>
              </div>
              <div>
                <strong className="text-gray-800">HashMap + Singly Linked List?</strong>
                <p className="text-gray-600 mt-1 text-xs">Need O(n) to find previous node for deletion. Must be doubly linked!</p>
              </div>
              <div>
                <strong className="text-gray-800">TreeMap?</strong>
                <p className="text-gray-600 mt-1 text-xs">O(log n) operations. Don't need ordering by key, need by access time.</p>
              </div>
              <div>
                <strong className="text-gray-800">Priority Queue?</strong>
                <p className="text-gray-600 mt-1 text-xs">Can't update priority efficiently. Reordering is O(log n).</p>
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
                Watch how the cache maintains order! Most recently used items move to the front (left).
                When capacity is reached, the rightmost item (least recently used) is evicted. Try the demo to see it in action!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive LRU Cache Visualization</h2>
        </div>

        {/* Cache Visualization */}
        <div className="mb-6 bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Cache State (Capacity: {capacity})</h3>
            <div className="text-sm text-gray-600">
              <strong>Order:</strong> Left (MRU) → Right (LRU)
            </div>
          </div>

          {/* Visual Cache - Doubly Linked List */}
          <div className="mb-6">
            <div className="text-xs text-gray-500 mb-2 text-center">Doubly Linked List (Most Recent → Least Recent)</div>
            <div className="flex items-center justify-center gap-2 min-h-[100px]">
              {cache.length === 0 ? (
                <div className="text-gray-400 text-lg">Empty Cache</div>
              ) : (
                <>
                  {cache.map((item, index) => (
                    <React.Fragment key={index}>
                      <div
                        className={`flex flex-col items-center transition-all duration-300 ${
                          highlightedKey === item.key ? 'scale-110' : ''
                        }`}
                      >
                        <div
                          className={`w-24 h-24 flex flex-col items-center justify-center rounded-lg font-bold shadow-lg transition-all ${
                            highlightedKey === item.key
                              ? 'bg-yellow-400 text-gray-900'
                              : index === 0
                              ? 'bg-green-500 text-white'
                              : index === cache.length - 1
                              ? 'bg-red-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          <div className="text-2xl">{item.key}</div>
                          <div className="text-sm">val: {item.value}</div>
                        </div>
                        <div className="text-xs mt-1 text-gray-600">
                          {index === 0 && '(MRU)'}
                          {index === cache.length - 1 && cache.length > 1 && '(LRU)'}
                        </div>
                      </div>
                      {index < cache.length - 1 && (
                        <div className="text-2xl text-gray-400">↔</div>
                      )}
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* HashMap Representation */}
          <div className="mb-4 bg-gray-50 p-4 rounded">
            <div className="text-sm font-semibold text-gray-700 mb-2">HashMap (key → node):</div>
            <div className="flex flex-wrap gap-2">
              {cache.length === 0 ? (
                <span className="text-gray-400 text-sm">Empty</span>
              ) : (
                cache.map((item, index) => (
                  <div key={index} className="bg-white px-3 py-1 rounded border border-gray-300 text-sm">
                    {item.key} → Node({item.value})
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Cache Size:</strong> {cache.length}/{capacity}
            </div>
            <div className="bg-green-50 p-3 rounded">
              <strong>Operations:</strong> {operationCount}
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <strong>Fill %:</strong> {((cache.length / capacity) * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg mb-4">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Operation:</label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setOperation('get')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  operation === 'get'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                get(key)
              </button>
              <button
                onClick={() => setOperation('put')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  operation === 'put'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                put(key, value)
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Key"
                className="px-3 py-2 border border-gray-300 rounded-md flex-1"
              />
              {operation === 'put' && (
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Value"
                  className="px-3 py-2 border border-gray-300 rounded-md flex-1"
                />
              )}
              <button
                onClick={handleOperation}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Execute
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDemo}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Run Demo
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Reset Cache
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm font-semibold text-gray-700">Capacity:</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => {
                  const newCap = parseInt(e.target.value) || 1
                  setCapacity(Math.max(1, Math.min(10, newCap)))
                  setCache([])
                }}
                min="1"
                max="10"
                className="px-3 py-2 border border-gray-300 rounded-md w-20"
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`border-l-4 px-4 py-3 rounded mb-4 ${
            message.includes('HIT') ? 'bg-green-50 border-green-500 text-green-700' :
            message.includes('MISS') ? 'bg-red-50 border-red-500 text-red-700' :
            'bg-blue-50 border-blue-500 text-blue-700'
          }`}>
            <strong>Result:</strong> {message}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Try This:</strong> Run the demo to see a complete LRU cache example. Notice how accessing 'B' moves it
          to the front, so 'A' gets evicted instead when 'E' is added!
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
            title="LRU Cache from Scratch (Interview Version)"
            code={scratchCode}
            language="java"
          />
          <CodeDisplay
            title="LRU Cache with LinkedHashMap (Production)"
            code={libraryCode}
            language="java"
          />
        </div>
      </div>

      {/* STEP 4: Advanced Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-slate-500">
        <div className="flex items-center mb-6">
          <div className="bg-slate-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">4</div>
          <h2 className="text-3xl font-bold text-gray-800">Advanced: Production & Interviews</h2>
        </div>

        {/* Real-World Applications */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border-2 border-yellow-400">
          <h3 className="text-2xl font-bold text-amber-800 mb-4">🌍 Real-World Caching Systems</h3>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-blue-700 mb-2">Chrome Browser Cache</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Challenge:</strong> Keep recently visited pages in memory for instant back/forward</p>
                <p><strong>Solution:</strong> Multi-level LRU caches</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Memory cache (LRU): 32MB-256MB of recently accessed resources</li>
                  <li>Disk cache: Larger but slower, also uses LRU</li>
                  <li>HTTP headers (Cache-Control, ETag) determine cachability</li>
                  <li>Eviction on capacity or TTL expiration</li>
                </ul>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <strong>Performance:</strong> 90% hit rate = 10× faster page loads!
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-green-700 mb-2">Redis Cache (Distributed)</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Challenge:</strong> Shared cache for multiple application servers</p>
                <p><strong>Solution:</strong> Redis with LRU/LFU eviction policies</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>maxmemory-policy: allkeys-lru (evict any key with LRU)</li>
                  <li>volatile-lru: Only evict keys with TTL set</li>
                  <li>Approximation: Samples random keys (not true LRU, but faster)</li>
                  <li>Used by: Twitter, GitHub, Stack Overflow, Pinterest</li>
                </ul>
                <div className="bg-green-50 p-3 rounded mt-2">
                  <strong>Scale:</strong> Handle millions of requests/second with sub-millisecond latency
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-purple-700 mb-2">CPU Cache Hierarchy</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Problem:</strong> RAM is 100× slower than CPU registers</p>
                <p><strong>Solution:</strong> L1/L2/L3 caches with pseudo-LRU policies</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>L1: 32KB, 4 cycles access (~1ns)</li>
                  <li>L2: 256KB, 12 cycles (~3ns)</li>
                  <li>L3: 8MB, 40 cycles (~10ns)</li>
                  <li>RAM: GBs, 200+ cycles (~60ns)</li>
                  <li>Uses approximation (not true LRU) for speed</li>
                </ul>
                <div className="bg-purple-50 p-3 rounded mt-2">
                  <strong>Impact:</strong> 95% cache hit rate = 20× performance improvement
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-bold text-lg text-red-700 mb-2">CDN Edge Caching (Cloudflare/Akamai)</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Challenge:</strong> Cache content at edge servers closest to users</p>
                <p><strong>Solution:</strong> LRU + TTL + popularity-based eviction</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Each edge server: 10-100TB SSD cache</li>
                  <li>Hot content (videos, images) stays cached</li>
                  <li>Cold content evicted via LRU</li>
                  <li>Origin fetch only on cache miss</li>
                </ul>
                <div className="bg-red-50 p-3 rounded mt-2">
                  <strong>Result:</strong> 90% traffic served from cache, 50% cost reduction
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cache Eviction Policies Comparison */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">🔄 Cache Eviction Policies Compared</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border-2 border-gray-300 text-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Policy</th>
                  <th className="border border-gray-300 px-4 py-2">Evicts</th>
                  <th className="border border-gray-300 px-4 py-2">Complexity</th>
                  <th className="border border-gray-300 px-4 py-2">Hit Rate</th>
                  <th className="border border-gray-300 px-4 py-2">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">LRU</td>
                  <td className="border border-gray-300 px-4 py-2">Least Recently Used</td>
                  <td className="border border-gray-300 px-4 py-2">O(1)</td>
                  <td className="border border-gray-300 px-4 py-2">High (80-95%)</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">General purpose, temporal locality</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">LFU</td>
                  <td className="border border-gray-300 px-4 py-2">Least Frequently Used</td>
                  <td className="border border-gray-300 px-4 py-2">O(log n)</td>
                  <td className="border border-gray-300 px-4 py-2">Very High (85-98%)</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Popular content, long-term patterns</td>
                </tr>
                <tr className="bg-yellow-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">FIFO</td>
                  <td className="border border-gray-300 px-4 py-2">First In First Out</td>
                  <td className="border border-gray-300 px-4 py-2">O(1)</td>
                  <td className="border border-gray-300 px-4 py-2">Low (60-75%)</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Simple caches, no hotspot bias</td>
                </tr>
                <tr className="bg-purple-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Random</td>
                  <td className="border border-gray-300 px-4 py-2">Random Entry</td>
                  <td className="border border-gray-300 px-4 py-2">O(1)</td>
                  <td className="border border-gray-300 px-4 py-2">Low (55-70%)</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Uniform access pattern</td>
                </tr>
                <tr className="bg-green-100">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">ARC</td>
                  <td className="border border-gray-300 px-4 py-2">Adaptive (LRU+LFU)</td>
                  <td className="border border-gray-300 px-4 py-2">O(1)</td>
                  <td className="border border-gray-300 px-4 py-2">Highest (90-99%)</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Database caches (ZFS, PostgreSQL)</td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">TTL</td>
                  <td className="border border-gray-300 px-4 py-2">Expired Entries</td>
                  <td className="border border-gray-300 px-4 py-2">O(1)*</td>
                  <td className="border border-gray-300 px-4 py-2">Variable</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">Time-sensitive data (auth tokens)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            * TTL with lazy eviction is O(1), with active cleanup is O(n)
          </div>
        </div>

        {/* Interview Problems */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-red-700 mb-4">🎯 Top LRU Cache Interview Questions</h3>

          <div className="space-y-6">
            {/* Problem 1 */}
            <div className="border-2 border-blue-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">LRU Cache (Leetcode #146)</h4>
                  <p className="text-sm text-gray-600">Difficulty: Medium | Asked by: Google, Facebook, Amazon, Microsoft, Apple</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Design and implement a data structure for LRU cache with O(1) get and put.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  LRUCache cache = new LRUCache(2);<br/>
                  cache.put(1, 1); cache.put(2, 2);<br/>
                  cache.get(1);    // returns 1<br/>
                  cache.put(3, 3); // evicts key 2<br/>
                  cache.get(2);    // returns -1 (not found)
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: See scratch code above!</summary>
                <div className="mt-3 text-sm text-gray-700">
                  <p>Key insights:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                    <li>Use HashMap for O(1) lookup: key → node</li>
                    <li>Use Doubly Linked List for O(1) reordering</li>
                    <li>Dummy head/tail nodes simplify edge cases</li>
                    <li>Always update both HashMap AND DLL!</li>
                  </ul>
                </div>
              </details>
            </div>

            {/* Problem 2 */}
            <div className="border-2 border-green-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">LFU Cache (Leetcode #460)</h4>
                  <p className="text-sm text-gray-600">Difficulty: Hard | Asked by: Amazon, Google</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Implement LFU (Least Frequently Used) cache with O(1) operations.
                </p>
                <div className="font-mono text-xs text-gray-600">
                  Evict the least frequently used item.<br/>
                  If tie, evict the least recently used among them.
                </div>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: HashMap + Frequency Map + DLLs</summary>
                <div className="mt-3 text-sm text-gray-700">
                  <p className="mb-2">Much harder than LRU! Need 3 data structures:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>HashMap: key → node (with frequency)</li>
                    <li>Frequency Map: frequency → DLL of nodes</li>
                    <li>Track minFrequency for eviction</li>
                  </ul>
                </div>
              </details>
            </div>

            {/* Problem 3 */}
            <div className="border-2 border-purple-200 rounded-lg p-5">
              <div className="flex items-start mb-3">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Design In-Memory File System (Leetcode #588)</h4>
                  <p className="text-sm text-gray-600">Difficulty: Hard | Asked by: Google, Dropbox</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Problem:</strong> Design an in-memory file system with LRU cache for frequently accessed files.
                </p>
              </div>

              <details className="bg-green-50 p-4 rounded">
                <summary className="font-bold text-green-800 cursor-pointer">Solution: Trie + LRU Cache</summary>
                <div className="mt-3 text-sm text-gray-700">
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Trie for path hierarchy</li>
                    <li>LRU cache for frequently accessed files</li>
                    <li>Combine both for optimal performance</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* When to Use What */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-300">
          <h3 className="text-2xl font-bold text-indigo-800 mb-4">🧭 When to Use Each Caching Strategy</h3>

          <div className="space-y-3 text-sm">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
              <strong className="text-blue-700">LRU Cache:</strong>
              <p className="text-gray-700 mt-1">→ General purpose. Temporal locality (recently used likely used again).</p>
              <p className="text-gray-600 text-xs mt-1">Examples: Browser cache, page cache, CPU cache</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
              <strong className="text-green-700">LFU Cache:</strong>
              <p className="text-gray-700 mt-1">→ Popular content that's accessed frequently over long periods.</p>
              <p className="text-gray-600 text-xs mt-1">Examples: Video streaming, CDN, trending articles</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
              <strong className="text-purple-700">TTL Cache:</strong>
              <p className="text-gray-700 mt-1">→ Time-sensitive data that becomes stale/invalid after period.</p>
              <p className="text-gray-600 text-xs mt-1">Examples: Auth tokens, API rate limits, DNS records</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
              <strong className="text-yellow-700">Write-Through Cache:</strong>
              <p className="text-gray-700 mt-1">→ Write to cache AND database immediately. Safe but slower.</p>
              <p className="text-gray-600 text-xs mt-1">Examples: Banking, transactions, critical data</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
              <strong className="text-red-700">Write-Back Cache:</strong>
              <p className="text-gray-700 mt-1">→ Write to cache, write to DB later. Fast but risk data loss.</p>
              <p className="text-gray-600 text-xs mt-1">Examples: Logs, analytics, non-critical updates</p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500">
              <strong className="text-indigo-700">No Cache:</strong>
              <p className="text-gray-700 mt-1">→ Frequently changing data, personalized content, small datasets.</p>
              <p className="text-gray-600 text-xs mt-1">Examples: Live scores, stock prices, user-specific data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
        <Link
          to="/searching"
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          <span className="mr-2">←</span> Previous: Searching Algorithms
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

export default LRUCacheVisualizerEnhanced
