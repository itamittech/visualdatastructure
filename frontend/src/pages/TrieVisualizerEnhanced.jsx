import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function TrieVisualizerEnhanced() {
  // Trie structure: nested objects where each key is a character
  // '*' marks end of word
  const [trie, setTrie] = useState({
    c: {
      a: {
        t: { '*': true },
        r: { '*': true, d: { '*': true } }
      }
    },
    d: {
      o: {
        g: { '*': true }
      }
    }
  })
  const [word, setWord] = useState('')
  const [searchWord, setSearchWord] = useState('')
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [highlightedPath, setHighlightedPath] = useState([])

  // Insert word into trie
  const handleInsert = () => {
    if (!word.trim()) {
      setMessage('Please enter a word')
      return
    }

    const lowerWord = word.toLowerCase()
    let current = { ...trie }
    let node = current

    for (const char of lowerWord) {
      if (!node[char]) {
        node[char] = {}
      }
      node = node[char]
    }
    node['*'] = true // Mark end of word

    setTrie(current)
    setMessage(`Inserted "${lowerWord}" - O(m) where m = word length`)
    setWord('')

    // Highlight inserted path
    const path = lowerWord.split('')
    setHighlightedPath(path)
    setTimeout(() => setHighlightedPath([]), 2000)
  }

  // Search for exact word
  const handleSearch = () => {
    if (!searchWord.trim()) {
      setMessage('Please enter a word to search')
      return
    }

    const lowerWord = searchWord.toLowerCase()
    let node = trie

    for (const char of lowerWord) {
      if (!node[char]) {
        setMessage(`"${lowerWord}" NOT found in trie`)
        setHighlightedPath([])
        return
      }
      node = node[char]
    }

    if (node['*']) {
      setMessage(`"${lowerWord}" FOUND in trie ✓`)
      setHighlightedPath(lowerWord.split(''))
      setTimeout(() => setHighlightedPath([]), 2000)
    } else {
      setMessage(`"${lowerWord}" is a prefix but not a complete word`)
      setHighlightedPath([])
    }
  }

  // Check if prefix exists
  const handleStartsWith = () => {
    if (!searchWord.trim()) {
      setMessage('Please enter a prefix')
      return
    }

    const prefix = searchWord.toLowerCase()
    let node = trie

    for (const char of prefix) {
      if (!node[char]) {
        setMessage(`No words start with "${prefix}"`)
        setHighlightedPath([])
        return
      }
      node = node[char]
    }

    setMessage(`Words starting with "${prefix}" exist ✓`)
    setHighlightedPath(prefix.split(''))
    setTimeout(() => setHighlightedPath([]), 2000)
  }

  // Get all words with given prefix (for autocomplete demo)
  const getWordsWithPrefix = (prefix) => {
    const results = []
    let node = trie

    // Navigate to prefix
    for (const char of prefix) {
      if (!node[char]) return results
      node = node[char]
    }

    // DFS to collect all words from this point
    const dfs = (currentNode, currentWord) => {
      if (currentNode['*']) {
        results.push(currentWord)
      }
      for (const char in currentNode) {
        if (char !== '*') {
          dfs(currentNode[char], currentWord + char)
        }
      }
    }

    dfs(node, prefix)
    return results
  }

  const handleAutocomplete = () => {
    if (!searchWord.trim()) {
      setMessage('Please enter a prefix for autocomplete')
      return
    }

    const prefix = searchWord.toLowerCase()
    const suggestions = getWordsWithPrefix(prefix)

    if (suggestions.length > 0) {
      setMessage(`Autocomplete suggestions: ${suggestions.join(', ')}`)
      setHighlightedPath(prefix.split(''))
      setTimeout(() => setHighlightedPath([]), 3000)
    } else {
      setMessage(`No autocomplete suggestions for "${prefix}"`)
      setHighlightedPath([])
    }
  }

  // Render trie as tree structure
  const renderTrie = (node, prefix = '', depth = 0) => {
    const elements = []
    const chars = Object.keys(node).filter(k => k !== '*')

    chars.forEach((char, index) => {
      const currentPrefix = prefix + char
      const isEndOfWord = node[char]['*']
      const isHighlighted = highlightedPath.length > depth && highlightedPath[depth] === char

      elements.push(
        <div key={currentPrefix} className="ml-6">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                isHighlighted ? 'bg-yellow-500' : 'bg-blue-500'
              } ${isEndOfWord ? 'ring-4 ring-green-500' : ''}`}
            >
              {char}
            </div>
            {isEndOfWord && (
              <span className="ml-2 text-green-600 font-bold text-sm">✓ word</span>
            )}
          </div>
          {renderTrie(node[char], currentPrefix, depth + 1)}
        </div>
      )
    })

    return elements
  }

  const complexityData = {
    operations: [
      {
        name: 'Insert',
        time: 'O(m)',
        space: 'O(m)',
        description: 'm = word length. Create nodes for each character if not exists.'
      },
      {
        name: 'Search',
        time: 'O(m)',
        space: 'O(1)',
        description: 'Traverse m characters. No extra space needed.'
      },
      {
        name: 'StartsWith (Prefix)',
        time: 'O(m)',
        space: 'O(1)',
        description: 'Same as search but without checking end-of-word marker.'
      },
      {
        name: 'Autocomplete',
        time: 'O(p + n)',
        space: 'O(n)',
        description: 'p = prefix length, n = number of words with prefix (DFS collection).'
      },
      {
        name: 'Delete',
        time: 'O(m)',
        space: 'O(m)',
        description: 'Traverse and remove nodes bottom-up. Recursion stack space.'
      },
    ]
  }

  const scratchCode = `// Trie (Prefix Tree) Implementation from Scratch
import java.util.*;

/**
 * TRIE: Tree-based data structure for efficient string operations
 *
 * Key Characteristics:
 * - Each node represents a character
 * - Root node is empty
 * - Path from root to node = prefix
 * - Words share common prefixes (space efficient!)
 *
 * Time Complexity: O(m) where m = word length
 * Space: O(ALPHABET_SIZE × m × n) worst case
 *        where n = number of words
 */

public class Trie {
    private TrieNode root;

    /**
     * WHY TrieNode?
     *
     * Each node contains:
     * 1. Children map (character → child node)
     * 2. isEndOfWord flag
     *
     * HashMap vs Array for children?
     * - HashMap: O(1) average, space efficient for sparse alphabets
     * - Array[26]: O(1) guaranteed, faster but wastes space
     *
     * Production: HashMap for Unicode, Array for lowercase a-z only
     */
    class TrieNode {
        Map<Character, TrieNode> children;
        boolean isEndOfWord;

        TrieNode() {
            this.children = new HashMap<>();
            this.isEndOfWord = false;
        }
    }

    public Trie() {
        this.root = new TrieNode();
    }

    /**
     * INSERT: Add word to trie
     *
     * WHY O(m)?
     * - Visit each character once: m iterations
     * - HashMap put/get: O(1) average
     * - Total: O(m)
     *
     * Example: Insert "cat"
     * root → c → a → t (mark end)
     *
     * Then insert "car":
     * root → c → a → t (word)
     *              → r (word)
     * Shares prefix "ca"!
     */
    public void insert(String word) {
        TrieNode node = root;

        for (char ch : word.toCharArray()) {
            // Create node if doesn't exist
            node.children.putIfAbsent(ch, new TrieNode());
            node = node.children.get(ch);
        }

        node.isEndOfWord = true;  // Mark word end
    }

    /**
     * SEARCH: Check if exact word exists
     *
     * WHY O(m)?
     * - Traverse m characters: O(m)
     * - HashMap get: O(1) average
     * - Must check isEndOfWord!
     *
     * Example: Search "car" in trie with "car", "card"
     * ✓ "car" found (isEndOfWord = true)
     * ✗ "ca" not found (isEndOfWord = false, just prefix)
     */
    public boolean search(String word) {
        TrieNode node = root;

        for (char ch : word.toCharArray()) {
            if (!node.children.containsKey(ch)) {
                return false;  // Character path doesn't exist
            }
            node = node.children.get(ch);
        }

        return node.isEndOfWord;  // Must be complete word!
    }

    /**
     * STARTS_WITH: Check if any word has this prefix
     *
     * WHY useful?
     * - Autocomplete: find all words starting with "ap" → ["app", "apple"]
     * - Spell checker: suggest words with valid prefix
     * - Search engines: instant suggestions
     *
     * Difference from search: don't check isEndOfWord
     */
    public boolean startsWith(String prefix) {
        TrieNode node = root;

        for (char ch : prefix.toCharArray()) {
            if (!node.children.containsKey(ch)) {
                return false;
            }
            node = node.children.get(ch);
        }

        return true;  // Prefix exists!
    }

    /**
     * AUTOCOMPLETE: Get all words with given prefix
     *
     * WHY O(p + n)?
     * - p: Navigate to prefix (O(p))
     * - n: DFS to collect all words from prefix node (O(n))
     *
     * Used in: Search bars, IDEs, command terminals
     */
    public List<String> autocomplete(String prefix) {
        List<String> results = new ArrayList<>();
        TrieNode node = root;

        // Navigate to prefix
        for (char ch : prefix.toCharArray()) {
            if (!node.children.containsKey(ch)) {
                return results;  // No words with this prefix
            }
            node = node.children.get(ch);
        }

        // DFS to collect all words
        dfs(node, prefix, results);
        return results;
    }

    private void dfs(TrieNode node, String current, List<String> results) {
        if (node.isEndOfWord) {
            results.add(current);
        }

        for (Map.Entry<Character, TrieNode> entry : node.children.entrySet()) {
            dfs(entry.getValue(), current + entry.getKey(), results);
        }
    }

    /**
     * DELETE: Remove word from trie
     *
     * WHY tricky?
     * - Can't just mark isEndOfWord = false!
     * - Must remove nodes if no other words use them
     *
     * Example: Trie has "cat", "car"
     * Delete "cat":
     * - Can remove 't' (not used by other words)
     * - Keep 'c', 'a' (used by "car")
     *
     * Solution: Recursive deletion with bottom-up cleanup
     */
    public boolean delete(String word) {
        return deleteHelper(root, word, 0);
    }

    private boolean deleteHelper(TrieNode node, String word, int index) {
        if (index == word.length()) {
            if (!node.isEndOfWord) {
                return false;  // Word doesn't exist
            }
            node.isEndOfWord = false;

            // Delete node if it has no children
            return node.children.isEmpty();
        }

        char ch = word.charAt(index);
        TrieNode child = node.children.get(ch);
        if (child == null) {
            return false;  // Word doesn't exist
        }

        boolean shouldDeleteChild = deleteHelper(child, word, index + 1);

        if (shouldDeleteChild) {
            node.children.remove(ch);
            // Delete current node if:
            // 1. No children left
            // 2. Not end of another word
            return node.children.isEmpty() && !node.isEndOfWord;
        }

        return false;
    }
}

/**
 * KEY INSIGHTS:
 *
 * 1. Space-Time Tradeoff:
 *    - Trie: O(ALPHABET × m × n) space for O(m) operations
 *    - HashMap: O(n × m) space for O(m) operations
 *    - Trie wins when: many words share prefixes!
 *
 * 2. When to use Trie:
 *    ✓ Autocomplete (prefix matching)
 *    ✓ Spell checkers
 *    ✓ IP routing (longest prefix match)
 *    ✓ Dictionary with prefix queries
 *    ✗ Simple exact lookups (use HashMap)
 *    ✗ No prefix sharing (wastes space)
 *
 * 3. Memory optimization:
 *    - Compressed trie (radix tree): merge single-child chains
 *      "car" → "cat": c → a → r/t instead of c → a → r
 *                                              → t
 *    - Array[26] for lowercase English only
 *    - Ternary Search Tree: 3-way branching (< = >)
 */`

  const libraryCode = `// Trie Operations in Java (Manual Implementation)
import java.util.*;

/**
 * Java doesn't have built-in Trie class
 * But we can use Map-based implementation
 */
public class TrieExample {
    public static void main(String[] args) {

        // ===== Create and populate Trie =====
        Trie trie = new Trie();

        // Insert words
        String[] words = {"cat", "car", "card", "care", "dog", "dodge"};
        for (String word : words) {
            trie.insert(word);
        }
        // Trie structure:
        // c → a → r → (word)
        //       → t → (word)
        //       → d → (word)
        //       → e → (word)
        // d → o → g → (word)
        //       → d → g → e → (word)


        // ===== Search operations =====
        System.out.println(trie.search("cat"));      // true
        System.out.println(trie.search("car"));      // true
        System.out.println(trie.search("ca"));       // false (prefix only)
        System.out.println(trie.search("cats"));     // false


        // ===== Prefix operations =====
        System.out.println(trie.startsWith("ca"));   // true
        System.out.println(trie.startsWith("do"));   // true
        System.out.println(trie.startsWith("bat"));  // false


        // ===== Autocomplete =====
        List<String> suggestions = trie.autocomplete("ca");
        System.out.println(suggestions);  // [car, card, care, cat]

        suggestions = trie.autocomplete("do");
        System.out.println(suggestions);  // [dog, dodge]


        // ===== Delete operations =====
        trie.delete("cat");
        System.out.println(trie.search("cat"));   // false
        System.out.println(trie.search("car"));   // true (still exists)


        /* REAL-WORLD APPLICATIONS:
         *
         * 1. AUTOCOMPLETE (Google Search, IDEs):
         *    - User types "jav"
         *    - Trie.autocomplete("jav") → ["java", "javascript", "javadoc"]
         *    - O(p + n) where p = prefix length, n = suggestions
         *    - Much faster than scanning all strings!
         *
         * 2. SPELL CHECKER:
         *    - Check if word exists: trie.search(word)
         *    - Find suggestions: try variations (delete/add/replace chars)
         *    - Check each variation with trie.search()
         *
         * 3. IP ROUTING (Longest Prefix Match):
         *    - IP addresses stored as prefixes
         *    - Route packet using longest matching prefix
         *    - Example: 192.168.1.0/24 matches 192.168.1.5
         *
         * 4. T9 PREDICTIVE TEXT (Old phones):
         *    - Map digits to letters (2=ABC, 3=DEF...)
         *    - Build trie of valid words
         *    - 228 → "cat", "bat", "act"
         *
         * 5. WORD GAMES (Boggle, Scrabble):
         *    - Dictionary as trie
         *    - Check if path forms valid word
         *    - Prune invalid paths early (if prefix doesn't exist)
         */


        // ===== Advanced: Word Search II (Leetcode Hard) =====
        // Given board of letters and list of words,
        // find all words that can be formed by adjacent cells

        char[][] board = {
            {'o','a','a','n'},
            {'e','t','a','e'},
            {'i','h','k','r'},
            {'i','f','l','v'}
        };
        String[] dictionary = {"oath", "pea", "eat", "rain"};

        // Solution: Build trie of dictionary, then DFS on board
        // Prune DFS if current path not in trie (huge speedup!)
        Set<String> found = wordSearchII(board, dictionary);
        System.out.println(found);  // [oath, eat]
    }

    static Set<String> wordSearchII(char[][] board, String[] words) {
        Trie trie = new Trie();
        for (String word : words) {
            trie.insert(word);
        }

        Set<String> result = new HashSet<>();
        boolean[][] visited = new boolean[board.length][board[0].length];

        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[0].length; j++) {
                dfs(board, i, j, "", trie, visited, result);
            }
        }

        return result;
    }

    static void dfs(char[][] board, int i, int j, String current,
                    Trie trie, boolean[][] visited, Set<String> result) {
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length ||
            visited[i][j]) {
            return;
        }

        current += board[i][j];

        // KEY OPTIMIZATION: Prune if prefix doesn't exist!
        if (!trie.startsWith(current)) {
            return;
        }

        if (trie.search(current)) {
            result.add(current);
        }

        visited[i][j] = true;

        // Explore 4 directions
        dfs(board, i+1, j, current, trie, visited, result);
        dfs(board, i-1, j, current, trie, visited, result);
        dfs(board, i, j+1, current, trie, visited, result);
        dfs(board, i, j-1, current, trie, visited, result);

        visited[i][j] = false;  // Backtrack
    }
}`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/graph" className="hover:text-blue-600">Graph</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Trie</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Trie (Prefix Tree) - Deep Dive</h1>
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
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is a Trie?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            A <strong>Trie</strong> (pronounced "try", from re<strong>trie</strong>val) is a tree-based data structure for efficient string storage and retrieval.
            Each node represents a character, and paths from root to nodes form prefixes or complete words!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🔑 Key Characteristics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Character Nodes:</strong> Each node stores one character (not the whole string).</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Prefix Sharing:</strong> Words with common prefixes share nodes. "cat" and "car" share "ca".</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>O(m) Operations:</strong> Insert, search, delete all take O(m) time where m = word length.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>End-of-Word Marker:</strong> Nodes are marked to distinguish words from prefixes.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 font-bold mr-2">✓</span>
                <span><strong>Autocomplete Support:</strong> Perfect for prefix-based searches and suggestions.</span>
              </li>
            </ul>
          </div>

          {/* Visual Example */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
            <h4 className="font-bold text-green-800 mb-3">📊 Trie Structure Example</h4>
            <pre className="bg-white p-4 rounded text-sm font-mono overflow-x-auto">
{`Words: ["cat", "car", "card", "dog"]

Trie Structure:
         root
        /    \\
       c      d
       |      |
       a      o
      / \\     |
     t   r    g  ← end of "dog"
    ↑    |
  end    d
  of     |
  "cat"  ← end of "car"
         ↓
       end of "card"

Key observations:
1. "cat" and "car" share prefix "ca" (saves space!)
2. Green checkmarks indicate end of valid words
3. "ca" is NOT a word (no end marker), just a prefix
4. Each path from root spells a word/prefix`}
            </pre>
          </div>

          {/* Trie vs Other Structures */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-2">Trie vs HashMap</h4>
              <div className="text-sm space-y-2">
                <div>
                  <strong className="text-gray-800">HashMap (Set&lt;String&gt;):</strong>
                  <ul className="ml-4 mt-1 text-xs">
                    <li>• Search: O(m) - hash computation</li>
                    <li>• Space: O(n × m) - store all words</li>
                    <li>• Prefix search: O(n × m) - scan all!</li>
                    <li>• Autocomplete: ✗ Not supported</li>
                  </ul>
                </div>
                <div className="mt-3">
                  <strong className="text-gray-800">Trie:</strong>
                  <ul className="ml-4 mt-1 text-xs">
                    <li>• Search: O(m) - traverse path</li>
                    <li>• Space: O(ALPHABET × m × n) worst</li>
                    <li>• Prefix search: O(m) - direct!</li>
                    <li>• Autocomplete: ✓ Natural support</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-800 mb-2">Trie vs Binary Search Tree</h4>
              <div className="text-sm space-y-2">
                <div>
                  <strong className="text-gray-800">BST (TreeSet):</strong>
                  <ul className="ml-4 mt-1 text-xs">
                    <li>• Search: O(m log n) - compare strings</li>
                    <li>• Ordered traversal: ✓ Supported</li>
                    <li>• Prefix search: O(m × n) - scan range</li>
                    <li>• Common prefix optimization: ✗</li>
                  </ul>
                </div>
                <div className="mt-3">
                  <strong className="text-gray-800">Trie:</strong>
                  <ul className="ml-4 mt-1 text-xs">
                    <li>• Search: O(m) - no comparisons!</li>
                    <li>• Ordered traversal: ✓ DFS gives order</li>
                    <li>• Prefix search: O(m) - direct path</li>
                    <li>• Common prefix: ✓ Shared nodes!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* When to use */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2">✓ When to Use Trie</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Autocomplete / search suggestions</li>
                <li>• Spell checkers with prefix matching</li>
                <li>• IP routing (longest prefix match)</li>
                <li>• T9 predictive text input</li>
                <li>• Dictionary with prefix queries</li>
                <li>• Word games (Boggle, Scrabble validation)</li>
                <li>• Browser history autocomplete</li>
                <li>• DNA sequence analysis (ACGT alphabet)</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2">✗ When NOT to Use Trie</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Simple exact lookups (use HashMap)</li>
                <li>• No prefix-based queries needed</li>
                <li>• Very long strings (memory overhead)</li>
                <li>• Few words, no shared prefixes</li>
                <li>• Need range queries (use BST/TreeMap)</li>
                <li>• Frequent updates to middle of strings</li>
              </ul>
            </div>
          </div>

          {/* Real-world examples */}
          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Real-World Examples</h4>
            <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
              <div>
                <strong className="text-gray-800">Google Search:</strong>
                <p className="text-gray-600 mt-1 text-xs">Type "pyth" → instant suggestions: "python", "python tutorial", "python download". Trie stores billions of queries!</p>
              </div>
              <div>
                <strong className="text-gray-800">VSCode IntelliSense:</strong>
                <p className="text-gray-600 mt-1 text-xs">Type "console." → autocomplete shows all methods: log(), error(), warn(). Trie of API methods.</p>
              </div>
              <div>
                <strong className="text-gray-800">Phone Contacts:</strong>
                <p className="text-gray-600 mt-1 text-xs">Type "Joh" → shows "John", "Johnny", "Johnson". Trie enables instant prefix search across 1000s of contacts.</p>
              </div>
              <div>
                <strong className="text-gray-800">IP Routing:</strong>
                <p className="text-gray-600 mt-1 text-xs">Router matches IP 192.168.1.5 to longest prefix: 192.168.1.0/24. Trie finds longest match in O(32) for IPv4!</p>
              </div>
              <div>
                <strong className="text-gray-800">Spell Checker:</strong>
                <p className="text-gray-600 mt-1 text-xs">Type "recieve" → suggests "receive". Trie checks valid prefixes, prunes invalid paths early.</p>
              </div>
              <div>
                <strong className="text-gray-800">Scrabble Validator:</strong>
                <p className="text-gray-600 mt-1 text-xs">Check if "QUIXOTIC" is valid word. Trie lookup in O(8) beats scanning 100,000-word dictionary!</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 mb-2">🚀 Why Tries Are Powerful</h4>
            <p className="text-gray-700 text-sm">
              <strong>1. Prefix Sharing = Space Efficient:</strong> 1000 words starting with "app" share 3 nodes, not 3000!<br/><br/>

              <strong>2. O(m) Guaranteed:</strong> No hash collisions, no tree rebalancing. Just traverse m characters.<br/><br/>

              <strong>3. Lexicographic Order:</strong> DFS traversal gives alphabetically sorted words for free!<br/><br/>

              <strong>4. Early Pruning:</strong> Invalid prefix? Stop immediately! No need to check remaining characters.<br/><br/>

              <strong>5. Autocomplete Magic:</strong> One prefix lookup gives ALL matching words via DFS subtree traversal.
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
                Try inserting words to build the trie! Use Search to find exact words, StartsWith to check prefixes,
                and Autocomplete to see all words matching a prefix. Watch how words share prefixes in the tree!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Practice Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive Trie Visualization</h2>
        </div>

        {/* Trie Visualization */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 min-h-[300px]">
            <div className="font-bold text-lg mb-3">Current Trie Structure:</div>
            <div className="bg-white rounded-lg p-4 overflow-auto max-h-96">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-gray-400 text-white">
                  ⌀
                </div>
                <span className="ml-2 text-gray-600 text-sm">root</span>
              </div>
              {renderTrie(trie)}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Legend:</strong> Blue circle = character node | Green ring = end of word | Yellow = highlighted path
            </div>
          </div>
        </div>

        {/* Insert Controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Insert Word</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter word to insert"
            />
            <button
              onClick={handleInsert}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Insert → O(m)
            </button>
          </div>
        </div>

        {/* Search Controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search / Check Prefix</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter word or prefix"
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Search → O(m)
            </button>
            <button
              onClick={handleStartsWith}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              StartsWith → O(m)
            </button>
            <button
              onClick={handleAutocomplete}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Autocomplete → O(p+n)
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded mb-4">
            <strong>Result:</strong> {message}
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Try This:</strong> Insert "apple", "app", "application". Notice how they share "app" prefix!
          Then try autocomplete with "app" to see all three suggestions.
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
            title="Trie from Scratch"
            code={scratchCode}
            language="java"
          />
          <CodeDisplay
            title="Trie Operations & Applications"
            code={libraryCode}
            language="java"
          />
        </div>
      </div>

      {/* STEP 4: Advanced Section - Architect Level */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-slate-500">
        <div className="flex items-center mb-6">
          <div className="bg-slate-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">4</div>
          <h2 className="text-3xl font-bold text-gray-800">Advanced: Production-Grade Trie Knowledge</h2>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 mb-6 rounded">
          <div className="flex items-start">
            <div className="text-2xl mr-3">⚠️</div>
            <div>
              <div className="font-bold text-lg mb-1">Senior Engineer Territory Ahead</div>
              <div className="text-red-700">
                This section covers architect-level insights: memory optimization, compressed tries, production autocomplete systems,
                and advanced trie variants. Perfect for senior roles and system design interviews!
              </div>
            </div>
          </div>
        </div>

        {/* Memory Analysis */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">💾</span>
            Memory Layout & Optimization
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
              <h4 className="font-bold text-blue-800 text-lg mb-3">Standard Trie (HashMap Children)</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-gray-800">Memory per Node:</strong>
                  <pre className="bg-white p-3 rounded mt-1 text-xs font-mono overflow-x-auto">
{`TrieNode object:
- Object header: 12 bytes (compressed)
- HashMap reference: 8 bytes
- isEndOfWord boolean: 1 byte (+ 3 padding)
- HashMap object: 48 bytes (initial)
  - Entry[] array: 64 bytes (capacity 16)
Total per node: ~135 bytes (empty)

Example: Store "cat", "car", "dog"
- Nodes: c, a, t, r, d, o, g (7 nodes)
- Memory: 7 × 135 ≈ 945 bytes
- Plus HashMap entries: ~100 bytes
Total: ~1 KB for 3 words!`}
                  </pre>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Pros:</strong>
                  <div className="text-xs mt-1">
                    ✓ Supports any alphabet (Unicode)<br/>
                    ✓ Sparse alphabet efficient<br/>
                    ✓ O(1) child lookup (average)
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Cons:</strong>
                  <div className="text-xs mt-1">
                    ✗ High memory overhead per node<br/>
                    ✗ HashMap initialization cost<br/>
                    ✗ Poor cache locality
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
              <h4 className="font-bold text-green-800 text-lg mb-3">Optimized: Array[26] Children</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-gray-800">Memory per Node:</strong>
                  <pre className="bg-white p-3 rounded mt-1 text-xs font-mono overflow-x-auto">
{`TrieNode object (lowercase a-z only):
- Object header: 12 bytes
- TrieNode[] array: 8 bytes reference
- isEndOfWord: 1 byte (+ 3 padding)
- Array[26] object: 16 bytes header
- 26 references: 208 bytes (8×26)
Total per node: ~247 bytes

But: No HashMap overhead!
Faster O(1) child access: children[ch - 'a']

Same example: "cat", "car", "dog"
- 7 nodes × 247 = 1,729 bytes
Seems worse! But...`}
                  </pre>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>When Array[26] Wins:</strong>
                  <div className="text-xs mt-1">
                    ✓ Dense alphabet usage<br/>
                    ✓ Better cache locality (sequential)<br/>
                    ✓ No HashMap allocation overhead<br/>
                    ✓ Faster access: no hashing!
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded text-xs">
                  Production: English dictionary (270K words)<br/>
                  HashMap Trie: ~50 MB<br/>
                  Array[26] Trie: ~70 MB (40% more)<br/>
                  BUT 2× faster lookups!
                </div>
              </div>
            </div>
          </div>

          {/* Compressed Trie */}
          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-300 mb-6">
            <h4 className="font-bold text-purple-800 text-lg mb-3">🚀 Memory Optimization: Compressed Trie (Radix Tree)</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`Standard Trie for "cat", "catastrophe":

root → c → a → t → (end "cat")
                 → a → s → t → r → o → p → h → e → (end)

11 nodes total!

Compressed Trie (Radix Tree):

root → "cat" → (end "cat")
            → "astrophe" → (end "catastrophe")

Only 3 nodes! 73% reduction!

How: Merge chains of single-child nodes
"a → s → t → r → o → p → h → e" becomes "astrophe"

Each node now stores string, not single char`}
                </pre>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded text-sm">
                  <strong>Space Savings:</strong>
                  <div className="text-xs mt-1">
                    Worst case: No sharing (each word unique)<br/>
                    Standard: O(ALPHABET × total_chars)<br/>
                    Compressed: O(num_words)<br/>
                    <br/>
                    Example: 100K English words<br/>
                    Standard: ~3M nodes<br/>
                    Compressed: ~200K nodes (93% reduction!)
                  </div>
                </div>
                <div className="bg-white p-3 rounded text-sm">
                  <strong>Trade-offs:</strong>
                  <div className="text-xs mt-1">
                    ✓ Much less memory<br/>
                    ✓ Faster cache (fewer nodes)<br/>
                    ✗ More complex code<br/>
                    ✗ Split nodes on insertion<br/>
                    ✗ String comparison overhead
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded text-sm">
                  <strong>Production Use:</strong>
                  <div className="text-xs mt-1">
                    • Git version control (commit tree)<br/>
                    • Linux routing tables<br/>
                    • Nginx request routing<br/>
                    • Redis sorted sets (skiplist + radix)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ternary Search Tree */}
          <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-300">
            <h4 className="font-bold text-orange-800 text-lg mb-3">⚡ Alternative: Ternary Search Tree (TST)</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`Hybrid: BST + Trie

Each node has 3 children:
- left:  char < current char
- equal: char == current char (continue word)
- right: char > current char

Example: "cat", "car", "dog"

        c
       /
      a
     / \\
    r   t
   (car)(cat)

       d
        \\
         o
          \\
           g
          (dog)

Space: O(n) where n = total characters
(3 pointers per char, but no array waste!)`}
                </pre>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded text-sm">
                  <strong>TST vs Standard Trie:</strong>
                  <div className="text-xs mt-1">
                    <strong>Space:</strong><br/>
                    Trie Array[26]: 26 pointers per node<br/>
                    Trie HashMap: ~50 bytes overhead<br/>
                    TST: 3 pointers per node ✓<br/>
                    <br/>
                    <strong>Time:</strong><br/>
                    Trie: O(m) guaranteed<br/>
                    TST: O(m log n) average (BST navigation)
                  </div>
                </div>
                <div className="bg-white p-3 rounded text-sm">
                  <strong>Best for:</strong>
                  <div className="text-xs mt-1">
                    • Large alphabets (Unicode)<br/>
                    • Sparse character distribution<br/>
                    • Memory-constrained systems<br/>
                    • Millions of short strings
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded text-sm">
                  <strong>Real Use:</strong>
                  <div className="text-xs mt-1">
                    • Sedgewick's symbol tables<br/>
                    • Spell checkers (space efficient)<br/>
                    • Network packet classification
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Production Patterns */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">🏭</span>
            Production Trie Systems
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-300">
              <h4 className="font-bold text-blue-800 mb-3">Google Search Autocomplete</h4>
              <div className="text-sm space-y-2">
                <div className="bg-white p-3 rounded">
                  <strong>Architecture:</strong>
                  <div className="text-xs mt-1">
                    • Compressed trie of 3.5B+ queries<br/>
                    • Each node stores frequency/popularity<br/>
                    • Distributed across data centers<br/>
                    • Cache top 10K queries per prefix
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Algorithm:</strong>
                  <div className="text-xs mt-1">
                    1. User types prefix → trie lookup O(m)<br/>
                    2. DFS subtree to collect suggestions<br/>
                    3. Rank by frequency/personalization<br/>
                    4. Return top 10 in &lt;50ms!
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <strong>Optimizations:</strong>
                  <div className="text-xs mt-1">
                    • Store only top-K per node (memory)<br/>
                    • Bloom filter to prune invalid prefixes<br/>
                    • A/B test ranking algorithms<br/>
                    • Update trie in background (eventually consistent)
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded">
                  <strong>Scale:</strong>
                  <div className="text-xs mt-1">
                    5.6B searches/day<br/>
                    200K+ queries/second peak<br/>
                    &lt;100ms latency P99<br/>
                    Saves 200+ hours typing daily!
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-5 border-2 border-green-300">
              <h4 className="font-bold text-green-800 mb-3">VSCode IntelliSense (IDE Autocomplete)</h4>
              <div className="text-sm space-y-2">
                <div className="bg-white p-3 rounded">
                  <strong>Trie Structure:</strong>
                  <div className="text-xs mt-1">
                    • Separate tries for: variables, functions,<br/>
                      classes, imports, keywords<br/>
                    • Rebuild trie on file changes<br/>
                    • Scoped tries (local, global, imported)
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Fast Lookup:</strong>
                  <div className="text-xs mt-1">
                    Type "con" in JavaScript:<br/>
                    1. Lookup "con" in global trie → O(3)<br/>
                    2. Collect: console, const, constructor<br/>
                    3. Rank by usage frequency<br/>
                    4. Show in &lt;10ms (no perceptible lag!)
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <strong>Optimizations:</strong>
                  <div className="text-xs mt-1">
                    • Incremental updates (only changed symbols)<br/>
                    • Cache previous autocomplete results<br/>
                    • Fuzzy matching with Levenshtein distance<br/>
                    • Multi-threaded trie building
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-300">
              <h4 className="font-bold text-purple-800 mb-3">IP Routing Tables (Longest Prefix Match)</h4>
              <div className="text-sm space-y-2">
                <div className="bg-white p-3 rounded">
                  <strong>Binary Trie for IPs:</strong>
                  <div className="text-xs mt-1">
                    IPv4: 32-bit addresses → binary trie<br/>
                    Each level: 0 (left) or 1 (right)<br/>
                    Depth: 32 levels max<br/>
                    <br/>
                    Example: 192.168.1.0/24<br/>
                    Binary: 11000000.10101000.00000001.00000000<br/>
                    Store routing info at level 24
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Lookup Algorithm:</strong>
                  <div className="text-xs mt-1">
                    Packet arrives: 192.168.1.5<br/>
                    1. Traverse binary trie for 32 bits<br/>
                    2. Track deepest match (longest prefix)<br/>
                    3. Return route at deepest node<br/>
                    Time: O(32) = O(1) for IPv4!
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <strong>Production:</strong>
                  <div className="text-xs mt-1">
                    Core routers: 800K+ routes<br/>
                    Lookup: &lt;1 microsecond<br/>
                    Compressed tries (path compression)<br/>
                    TCAM hardware acceleration
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-5 border-2 border-orange-300">
              <h4 className="font-bold text-orange-800 mb-3">Spell Checker (MS Word, Grammarly)</h4>
              <div className="text-sm space-y-2">
                <div className="bg-white p-3 rounded">
                  <strong>Dictionary as Trie:</strong>
                  <div className="text-xs mt-1">
                    English: 470K words in trie<br/>
                    Memory: ~80 MB (compressed)<br/>
                    Lookup: O(m) where m = word length<br/>
                    Faster than HashMap for spell check!
                  </div>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong>Suggestion Algorithm:</strong>
                  <div className="text-xs mt-1">
                    Misspelled "recieve":<br/>
                    1. Check exact: trie.search("recieve") → false<br/>
                    2. Generate edits (delete/insert/replace 1 char)<br/>
                    3. Check each edit in trie<br/>
                    4. "receive" found! (swap i↔e)<br/>
                    Edit distance 1: O(26m) checks
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <strong>Optimizations:</strong>
                  <div className="text-xs mt-1">
                    • Prune invalid prefixes early<br/>
                    • Cache common misspellings<br/>
                    • Phonetic matching (soundex)<br/>
                    • Machine learning ranking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Problems */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">💼</span>
            Common Trie Interview Problems
          </h3>

          <div className="space-y-6">
            {/* Problem 1: Implement Trie */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-blue-900 text-lg">1. Implement Trie (Prefix Tree)</h4>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Medium</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Implement insert(word), search(word), and startsWith(prefix) methods for a trie data structure.
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-blue-800 hover:text-blue-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class Trie {
    class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isWord = false;
    }

    private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    // Insert word into trie: O(m) time, O(m) space
    public void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node.children.putIfAbsent(ch, new TrieNode());
            node = node.children.get(ch);
        }
        node.isWord = true;
    }

    // Search exact word: O(m) time, O(1) space
    public boolean search(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            if (!node.children.containsKey(ch)) {
                return false;
            }
            node = node.children.get(ch);
        }
        return node.isWord;  // Must be complete word!
    }

    // Check if prefix exists: O(m) time, O(1) space
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char ch : prefix.toCharArray()) {
            if (!node.children.containsKey(ch)) {
                return false;
            }
            node = node.children.get(ch);
        }
        return true;  // Prefix found
    }
}

// KEY INSIGHT: HashMap for children = supports any alphabet
// Alternative: TrieNode[] children = new TrieNode[26] for a-z only
// Trade-off: Array faster but wastes memory, HashMap flexible`}
                  </pre>
                </div>
              </details>
            </div>

            {/* Problem 2: Word Search II */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-red-900 text-lg">2. Word Search II (Boggle)</h4>
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">Hard</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Given an m×n board of letters and a list of words, find all words that can be formed by
                sequentially adjacent cells (horizontally or vertically). Each cell can be used at most once per word.
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-red-800 hover:text-red-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class Solution {
    public List<String> findWords(char[][] board, String[] words) {
        // Build trie from dictionary
        Trie trie = new Trie();
        for (String word : words) {
            trie.insert(word);
        }

        Set<String> result = new HashSet<>();
        boolean[][] visited = new boolean[board.length][board[0].length];

        // Try starting from each cell
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[0].length; j++) {
                dfs(board, i, j, trie.root, "", visited, result);
            }
        }

        return new ArrayList<>(result);
    }

    private void dfs(char[][] board, int i, int j, TrieNode node,
                     String current, boolean[][] visited, Set<String> result) {
        // Boundary and visited checks
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length ||
            visited[i][j]) {
            return;
        }

        char ch = board[i][j];

        // KEY OPTIMIZATION: Prune if prefix doesn't exist in trie!
        if (!node.children.containsKey(ch)) {
            return;  // This path won't form any dictionary word
        }

        node = node.children.get(ch);
        current += ch;

        // Found a word!
        if (node.isWord) {
            result.add(current);
            // Don't return - might be prefix of longer word
        }

        visited[i][j] = true;

        // Explore 4 directions
        dfs(board, i+1, j, node, current, visited, result);
        dfs(board, i-1, j, node, current, visited, result);
        dfs(board, i, j+1, node, current, visited, result);
        dfs(board, i, j-1, node, current, visited, result);

        visited[i][j] = false;  // Backtrack
    }
}

// Time: O(M×N×4^L) where M,N = board size, L = max word length
// Space: O(W×L) for trie, where W = number of words

// WHY TRIE IS CRITICAL:
// Without trie: For each cell, DFS all paths, then check each in Set<String>
// = O(M×N×4^L×W) - checking W words per path!
//
// With trie: Prune invalid paths immediately when prefix not in trie
// = O(M×N×4^L) - huge speedup! Most paths pruned early.
//
// Example: Board 4×4, dictionary 10K words, max length 10
// Without trie: 4×4×4^10×10K = 41 trillion operations!
// With trie: 4×4×4^10 = 4 million operations ✓`}
                  </pre>
                </div>
              </details>
              <div className="bg-red-50 p-3 rounded">
                <strong className="text-sm">Why this is HARD without Trie:</strong>
                <div className="text-xs mt-1">
                  Brute force: Generate all possible paths, check each against dictionary → exponential!<br/>
                  Trie optimization: Prune 99%+ of paths early when prefix doesn't exist in dictionary.
                </div>
              </div>
            </div>

            {/* Problem 3: Replace Words */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-green-900 text-lg">3. Replace Words (Word Roots)</h4>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Medium</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Given a dictionary of word roots and a sentence, replace all derivatives in the sentence
                with the shortest root. Example: roots=["cat"], sentence="the cattle was rattled" → "the cat was rattled"
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-green-800 hover:text-green-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class Solution {
    public String replaceWords(List<String> dictionary, String sentence) {
        // Build trie of roots
        Trie trie = new Trie();
        for (String root : dictionary) {
            trie.insert(root);
        }

        String[] words = sentence.split(" ");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (result.length() > 0) {
                result.append(" ");
            }
            result.append(findRoot(trie.root, word));
        }

        return result.toString();
    }

    private String findRoot(TrieNode root, String word) {
        TrieNode node = root;
        StringBuilder prefix = new StringBuilder();

        for (char ch : word.toCharArray()) {
            if (!node.children.containsKey(ch)) {
                // No root found, return original word
                return word;
            }
            node = node.children.get(ch);
            prefix.append(ch);

            // Found shortest root!
            if (node.isWord) {
                return prefix.toString();
            }
        }

        // Word itself is in trie or no root found
        return word;
    }
}

// Time: O(D + S) where D = total chars in dictionary, S = chars in sentence
// Space: O(D) for trie

// KEY INSIGHT: Trie naturally finds SHORTEST root!
// As soon as we hit isWord=true, we've found the shortest prefix.
// No need to check longer prefixes.

// Example: roots = ["cat", "catt"]
// Word "cattle":
// - Traverse c, a, t → isWord=true → return "cat" (shortest!)
// - Never reach "catt" node

// Without trie: Check each root as substring
// = O(R × W) where R = roots, W = word length
// = O(1000 × 20) per word if 1000 roots!
//
// With trie: O(W) single traversal
// 50× faster for large dictionaries!`}
                  </pre>
                </div>
              </details>
            </div>

            {/* Problem 4: Design Add and Search Words */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-purple-900 text-lg">4. Add and Search Word (Wildcards)</h4>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Medium</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Design a data structure that supports addWord(word) and search(word) where search word
                may contain dots '.' representing any letter. Example: search("b.d") matches "bad", "bed", "bid".
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-purple-800 hover:text-purple-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class WordDictionary {
    class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isWord = false;
    }

    private TrieNode root;

    public WordDictionary() {
        root = new TrieNode();
    }

    // Add word: O(m) time
    public void addWord(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node.children.putIfAbsent(ch, new TrieNode());
            node = node.children.get(ch);
        }
        node.isWord = true;
    }

    // Search with wildcards: O(26^k × m) worst case
    // where k = number of dots, m = word length
    public boolean search(String word) {
        return searchHelper(word, 0, root);
    }

    private boolean searchHelper(String word, int index, TrieNode node) {
        if (index == word.length()) {
            return node.isWord;
        }

        char ch = word.charAt(index);

        if (ch == '.') {
            // Wildcard: try all children!
            for (TrieNode child : node.children.values()) {
                if (searchHelper(word, index + 1, child)) {
                    return true;
                }
            }
            return false;
        } else {
            // Regular character
            if (!node.children.containsKey(ch)) {
                return false;
            }
            return searchHelper(word, index + 1,
                                node.children.get(ch));
        }
    }
}

// Time Complexity Analysis:
// - No dots: O(m) - normal trie search
// - k dots: O(26^k × m) - try all 26 children at each dot
//
// Example: search("b.d")
// At index 1 ('.'), try all 26 children:
// - a → search "d" at children['a']
// - b → search "d" at children['b']
// ...
// - z → search "d" at children['z']
//
// Worst: search(".....") with 5 dots
// = 26^5 = 11M paths to explore!
//
// Optimization: If trie has limited vocabulary,
// actual branching factor << 26 (e.g., 3-4 on average)

// KEY INSIGHT: Trie structure enables efficient wildcard search!
// HashMap/Set would require scanning ALL words: O(N×m) per search
// Trie prunes invalid branches: only explore matching paths`}
                  </pre>
                </div>
              </details>
            </div>

            {/* Problem 5: Longest Word */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-600">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-orange-900 text-lg">5. Longest Word in Dictionary</h4>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Medium</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm">
                Given an array of words, find the longest word that can be built one character at a time by
                other words in the array. Example: ["w","wo","wor","worl","world"] → "world"
              </p>
              <details className="mb-3">
                <summary className="cursor-pointer font-semibold text-orange-800 hover:text-orange-600">
                  💡 Show Solution
                </summary>
                <div className="mt-3 bg-white rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto">
{`class Solution {
    class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isWord = false;
        String word = null;  // Store word at leaf
    }

    public String longestWord(String[] words) {
        // Build trie
        TrieNode root = new TrieNode();
        for (String word : words) {
            TrieNode node = root;
            for (char ch : word.toCharArray()) {
                node.children.putIfAbsent(ch, new TrieNode());
                node = node.children.get(ch);
            }
            node.isWord = true;
            node.word = word;
        }

        // BFS to find longest word
        // Only explore paths where ALL prefixes are words!
        Queue<TrieNode> queue = new LinkedList<>();
        queue.offer(root);

        String longest = "";

        while (!queue.isEmpty()) {
            TrieNode node = queue.poll();

            for (TrieNode child : node.children.values()) {
                // KEY: Only add child if it's a word
                // (ensures all prefixes exist)
                if (child.isWord) {
                    queue.offer(child);

                    // Update longest
                    if (child.word.length() > longest.length() ||
                        (child.word.length() == longest.length() &&
                         child.word.compareTo(longest) < 0)) {
                        longest = child.word;
                    }
                }
            }
        }

        return longest;
    }
}

// Time: O(N×L) where N = words, L = avg length
// Space: O(N×L) for trie

// WHY BFS + isWord CHECK WORKS:
//
// Example: ["w", "wo", "wor", "worl", "world", "apple"]
//
// Trie:
// w (word) → o (word) → r (word) → l (word) → d (word)
// a → p → p → l → e (word)
//
// BFS only explores:
// root → w (word ✓) → wo (word ✓) → wor (word ✓) → ...
//
// Skips "apple" path because 'a', 'ap', 'app', 'appl'
// are NOT words (no intermediate isWord=true)
//
// Result: "world" because all prefixes exist!

// KEY INSIGHT: Trie + BFS naturally enforces
// "built one character at a time" constraint.
// Only explore child if it's marked as word!

// Without trie: Sort words, check each prefix manually
// = O(N log N + N×L²) - quadratic prefix checks!
// With trie: O(N×L) - linear!`}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Real-World Impact */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6 border-2 border-indigo-400">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">🌍</span>
            Real-World Impact: Why Tries Matter
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-indigo-800 mb-2">💬 Search & Autocomplete</h4>
              <p className="text-gray-700 text-xs">
                <strong>Google:</strong> 5.6B searches daily. Trie-based autocomplete suggests 10 options
                in &lt;50ms. Saves users 200+ hours of typing every second globally!<br/><br/>

                <strong>Mobile Keyboards:</strong> SwiftKey, Gboard use tries for next-word prediction.
                99% accuracy for common phrases. Reduces typing by 40% on average.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">📝 Writing & Editing</h4>
              <p className="text-gray-700 text-xs">
                <strong>Grammarly:</strong> 470K word English dictionary as compressed trie.
                Real-time spell check for 30M daily active users. Catches typos in &lt;10ms.<br/><br/>

                <strong>MS Word:</strong> Autocorrect uses trie + edit distance (Levenshtein).
                "teh" → "the" automatically. Fixes 10B+ typos daily across Office users!
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-2">🌐 Networking</h4>
              <p className="text-gray-700 text-xs">
                <strong>IP Routing:</strong> Core internet routers use binary tries for 800K+ routes.
                Longest prefix match in O(32) for IPv4. Handles 100Gbps+ traffic.<br/><br/>

                <strong>DNS:</strong> Domain name resolution uses trie structure. ".com" trie has
                160M+ domains. Lookup in O(domain_length), not O(160M)!
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-purple-800 mb-2">💻 Developer Tools</h4>
              <p className="text-gray-700 text-xs">
                <strong>IDEs:</strong> VSCode, IntelliJ use tries for code completion. Millions of symbols
                across projects. "import java.u" → suggests util, until, etc instantly.<br/><br/>

                <strong>Git:</strong> Commit tree uses radix trie (compressed). Efficient storage
                for 100K+ commits. Fast prefix search for commit SHAs.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-orange-800 mb-2">🎮 Gaming</h4>
              <p className="text-gray-700 text-xs">
                <strong>Scrabble/Boggle:</strong> Dictionary stored as trie. Validate words in O(length).
                AI opponents use trie to find all valid words on board in seconds.<br/><br/>

                <strong>Chat Filters:</strong> Profanity filter as trie of banned words.
                Real-time scanning of millions of messages. O(message_length) check.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2">🧬 Science</h4>
              <p className="text-gray-700 text-xs">
                <strong>DNA Sequencing:</strong> Genome databases use suffix tries. Search for gene
                sequences in O(pattern_length). Human genome: 3B base pairs searchable!<br/><br/>

                <strong>Protein Analysis:</strong> Amino acid sequences in tries. Fast pattern matching
                for drug discovery. Accelerates research by 100×.
              </p>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <p className="text-sm text-gray-800">
              <strong>💡 Bottom Line:</strong> Tries power the digital interfaces we use every day. From search
              suggestions to spell check, from IP routing to DNA analysis, trie algorithms make modern computing
              feel instant and intelligent. Mastering tries is essential for senior engineering roles in search,
              networking, bioinformatics, and developer tools!
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
        <Link
          to="/graph"
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          <span className="mr-2">←</span> Previous: Graph
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

export default TrieVisualizerEnhanced
