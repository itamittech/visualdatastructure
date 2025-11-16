import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplexityInfo from '../components/ComplexityInfo'
import CodeDisplay from '../components/CodeDisplay'

function DynamicProgrammingVisualizer() {
  const [selectedProblem, setSelectedProblem] = useState('fibonacci')
  const [input, setInput] = useState(5)
  const [dpTable, setDpTable] = useState([])
  const [message, setMessage] = useState('')
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [approach, setApproach] = useState('tabulation') // memoization or tabulation
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)

  const problems = {
    fibonacci: {
      name: 'Fibonacci Number',
      description: 'Find the nth Fibonacci number',
      inputLabel: 'n',
      maxInput: 15,
      icon: '🔢'
    },
    climbingStairs: {
      name: 'Climbing Stairs',
      description: 'Number of ways to climb n stairs (1 or 2 steps at a time)',
      inputLabel: 'stairs',
      maxInput: 15,
      icon: '🪜'
    },
    coinChange: {
      name: 'Coin Change',
      description: 'Minimum coins needed to make amount (coins: 1, 2, 5)',
      inputLabel: 'amount',
      maxInput: 15,
      icon: '💰'
    }
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  // Fibonacci with Tabulation
  const solveFibonacciTabulation = (n) => {
    const table = new Array(n + 1).fill(0)
    const stepsList = []

    table[0] = 0
    table[1] = 1
    stepsList.push({
      table: [...table],
      description: 'Base cases: F(0) = 0, F(1) = 1',
      highlight: [0, 1]
    })

    for (let i = 2; i <= n; i++) {
      table[i] = table[i - 1] + table[i - 2]
      stepsList.push({
        table: [...table],
        description: `F(${i}) = F(${i-1}) + F(${i-2}) = ${table[i-1]} + ${table[i-2]} = ${table[i]}`,
        highlight: [i]
      })
    }

    return { result: table[n], steps: stepsList }
  }

  // Climbing Stairs with Tabulation
  const solveClimbingStairsTabulation = (n) => {
    const table = new Array(n + 1).fill(0)
    const stepsList = []

    table[0] = 1 // 1 way to stay at ground
    table[1] = 1 // 1 way to reach stair 1
    stepsList.push({
      table: [...table],
      description: 'Base cases: ways(0) = 1, ways(1) = 1',
      highlight: [0, 1]
    })

    for (let i = 2; i <= n; i++) {
      table[i] = table[i - 1] + table[i - 2]
      stepsList.push({
        table: [...table],
        description: `ways(${i}) = ways(${i-1}) + ways(${i-2}) = ${table[i-1]} + ${table[i-2]} = ${table[i]}`,
        highlight: [i]
      })
    }

    return { result: table[n], steps: stepsList }
  }

  // Coin Change with Tabulation
  const solveCoinChangeTabulation = (amount) => {
    const coins = [1, 2, 5]
    const table = new Array(amount + 1).fill(Infinity)
    const stepsList = []

    table[0] = 0
    stepsList.push({
      table: [...table],
      description: 'Base case: 0 coins needed for amount 0',
      highlight: [0]
    })

    for (let i = 1; i <= amount; i++) {
      for (let coin of coins) {
        if (coin <= i && table[i - coin] !== Infinity) {
          const newValue = Math.min(table[i], table[i - coin] + 1)
          if (newValue !== table[i]) {
            table[i] = newValue
            stepsList.push({
              table: [...table],
              description: `amount(${i}): Using coin ${coin}, min(${table[i] === Infinity ? '∞' : table[i]}, ${table[i - coin]} + 1) = ${newValue}`,
              highlight: [i]
            })
          }
        }
      }
    }

    return {
      result: table[amount] === Infinity ? -1 : table[amount],
      steps: stepsList
    }
  }

  const handleSolve = () => {
    let solution

    switch(selectedProblem) {
      case 'fibonacci':
        solution = solveFibonacciTabulation(input)
        break
      case 'climbingStairs':
        solution = solveClimbingStairsTabulation(input)
        break
      case 'coinChange':
        solution = solveCoinChangeTabulation(input)
        break
      default:
        solution = solveFibonacciTabulation(input)
    }

    setSteps(solution.steps)
    setCurrentStep(solution.steps.length - 1)
    setDpTable(solution.steps[solution.steps.length - 1].table)
    setMessage(`Result: ${solution.result}`)
  }

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      setDpTable(steps[newStep].table)
      setMessage(steps[newStep].description)
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      setDpTable(steps[newStep].table)
      setMessage(steps[newStep].description)
    }
  }

  const handleReset = () => {
    setDpTable([])
    setSteps([])
    setCurrentStep(0)
    setMessage('')
  }

  const complexityData = {
    operations: [
      {
        name: 'Naive Recursion',
        time: 'O(2ⁿ)',
        space: 'O(n)',
        description: 'Exponential! Recalculates same subproblems many times.'
      },
      {
        name: 'Memoization (Top-Down)',
        time: 'O(n)',
        space: 'O(n)',
        description: 'Recursion + cache. Solve each subproblem once, store result.'
      },
      {
        name: 'Tabulation (Bottom-Up)',
        time: 'O(n)',
        space: 'O(n)',
        description: 'Iterative. Fill table from base cases up. No recursion overhead.'
      },
      {
        name: 'Space Optimized',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Only keep last few values. Works when only previous states needed.'
      },
    ]
  }

  const theoryCode = `// Dynamic Programming - Complete Guide

/**
 * WHAT IS DYNAMIC PROGRAMMING?
 *
 * DP is an optimization technique that:
 * 1. Breaks problem into overlapping subproblems
 * 2. Solves each subproblem once
 * 3. Stores solutions to avoid recalculation
 * 4. Combines solutions to solve original problem
 *
 * KEY INSIGHT: Trade space for time!
 * - Naive: O(2ⁿ) time, recalculate everything
 * - DP: O(n) time, O(n) space - store results
 */

/**
 * WHEN TO USE DP? - Two Requirements:
 *
 * 1. OPTIMAL SUBSTRUCTURE:
 *    - Optimal solution contains optimal solutions to subproblems
 *    - Example: Shortest path A→C = Shortest(A→B) + Shortest(B→C)
 *
 * 2. OVERLAPPING SUBPROBLEMS:
 *    - Same subproblems solved multiple times
 *    - Example: fib(5) = fib(4) + fib(3)
 *               fib(4) = fib(3) + fib(2)
 *               Notice: fib(3) calculated twice!
 *
 * If problem has both → USE DP!
 */

/**
 * HOW TO RECOGNIZE DP PROBLEMS?
 *
 * Look for these keywords:
 * ✓ "Find minimum/maximum..."
 * ✓ "Count number of ways..."
 * ✓ "Is it possible to..."
 * ✓ "Longest/Shortest..."
 * ✓ "Optimize..."
 *
 * Common patterns:
 * ✓ Fibonacci-like sequences
 * ✓ Path counting in grid
 * ✓ Subsequence/substring problems
 * ✓ Knapsack variations
 * ✓ Buy/sell stock problems
 */

/**
 * TWO APPROACHES:
 *
 * 1. MEMOIZATION (Top-Down):
 *    - Start with original problem
 *    - Recursively break into subproblems
 *    - Cache results in memo table
 *    - Pros: Natural recursion, only compute needed subproblems
 *    - Cons: Recursion overhead, stack overflow risk
 *
 * 2. TABULATION (Bottom-Up):
 *    - Start with smallest subproblems
 *    - Build up to original problem
 *    - Fill DP table iteratively
 *    - Pros: No recursion, better cache locality
 *    - Cons: Computes all subproblems (even unneeded)
 */

// ========================================
// EXAMPLE 1: FIBONACCI (Classic DP)
// ========================================

/**
 * PROBLEM: Find nth Fibonacci number
 * F(0) = 0, F(1) = 1
 * F(n) = F(n-1) + F(n-2)
 */

// ❌ NAIVE RECURSION - O(2ⁿ) - EXPONENTIAL!
public static int fibNaive(int n) {
    if (n <= 1) return n;
    return fibNaive(n - 1) + fibNaive(n - 2);

    // Why so slow?
    // fib(5) calls fib(4) and fib(3)
    // fib(4) calls fib(3) and fib(2)
    // fib(3) calculated TWICE!
    // fib(2) calculated THREE times!
    // Total calls for fib(5): 15 calls
    // Total calls for fib(10): 177 calls
    // Total calls for fib(40): 331,160,281 calls!!!
}

// ✅ MEMOIZATION (Top-Down DP) - O(n)
public static int fibMemo(int n, int[] memo) {
    if (n <= 1) return n;

    // Check if already computed
    if (memo[n] != -1) {
        return memo[n];  // Return cached result
    }

    // Compute and store
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

public static int fibonacci(int n) {
    int[] memo = new int[n + 1];
    Arrays.fill(memo, -1);  // -1 means "not computed yet"
    return fibMemo(n, memo);

    // Time: O(n) - each subproblem solved once
    // Space: O(n) - memo array + recursion stack
    // Total calls for fib(5): 9 calls (vs 15 naive)
    // Total calls for fib(40): 79 calls (vs 331M naive!)
}

// ✅ TABULATION (Bottom-Up DP) - O(n)
public static int fibTable(int n) {
    if (n <= 1) return n;

    int[] dp = new int[n + 1];
    dp[0] = 0;  // Base case
    dp[1] = 1;  // Base case

    // Build from bottom up
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];

    // Time: O(n) - single loop
    // Space: O(n) - dp array
    // No recursion! Better cache locality!
}

// ✅ SPACE OPTIMIZED - O(1) space!
public static int fibOptimized(int n) {
    if (n <= 1) return n;

    int prev2 = 0;  // F(i-2)
    int prev1 = 1;  // F(i-1)

    for (int i = 2; i <= n; i++) {
        int current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;

    // Time: O(n)
    // Space: O(1) - only 3 variables!
    // KEY INSIGHT: Only need last 2 values, not entire array!
}

// ========================================
// EXAMPLE 2: CLIMBING STAIRS
// ========================================

/**
 * PROBLEM: You're climbing stairs with n steps.
 * Each time you can climb 1 or 2 steps.
 * How many distinct ways to reach the top?
 *
 * Example: n = 3
 * Ways: [1,1,1], [1,2], [2,1] = 3 ways
 *
 * PATTERN RECOGNITION:
 * - To reach step n, you either:
 *   1. Came from step n-1 (took 1 step)
 *   2. Came from step n-2 (took 2 steps)
 * - So: ways(n) = ways(n-1) + ways(n-2)
 * - THIS IS FIBONACCI! Same recurrence relation!
 */

public static int climbStairs(int n) {
    if (n <= 2) return n;

    int[] dp = new int[n + 1];
    dp[1] = 1;  // 1 way to reach step 1
    dp[2] = 2;  // 2 ways to reach step 2

    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];

    // Time: O(n)
    // Space: O(n) - can optimize to O(1) like Fibonacci
}

// ========================================
// EXAMPLE 3: COIN CHANGE (MINIMUM COINS)
// ========================================

/**
 * PROBLEM: Given coins = [1, 2, 5] and amount = 11
 * Find minimum number of coins to make amount.
 *
 * Example: 11 = 5 + 5 + 1 = 3 coins (minimum)
 *
 * RECURRENCE RELATION:
 * dp[amount] = min(dp[amount - coin] + 1) for each coin
 *
 * INTUITION:
 * To make amount 11, we can:
 * - Use coin 1: 1 + dp[10]
 * - Use coin 2: 1 + dp[9]
 * - Use coin 5: 1 + dp[6]
 * Pick the minimum!
 */

public static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);  // Initialize with "impossible" value
    dp[0] = 0;  // Base case: 0 coins for amount 0

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];

    // Time: O(amount × coins.length)
    // Space: O(amount)

    // TRACE for amount = 11, coins = [1,2,5]:
    // dp[0] = 0
    // dp[1] = 1 (use 1)
    // dp[2] = 1 (use 2)
    // dp[3] = 2 (use 2+1)
    // dp[4] = 2 (use 2+2)
    // dp[5] = 1 (use 5)
    // dp[6] = 2 (use 5+1)
    // dp[7] = 2 (use 5+2)
    // dp[8] = 3 (use 5+2+1)
    // dp[9] = 3 (use 5+2+2)
    // dp[10] = 2 (use 5+5)
    // dp[11] = 3 (use 5+5+1)
}

/**
 * DP PROBLEM-SOLVING TEMPLATE:
 *
 * STEP 1: Define the DP state
 * - What does dp[i] represent?
 * - Example: dp[i] = minimum coins for amount i
 *
 * STEP 2: Find the recurrence relation
 * - How to compute dp[i] from previous states?
 * - Example: dp[i] = min(dp[i - coin] + 1)
 *
 * STEP 3: Identify base cases
 * - Smallest subproblems you can solve directly
 * - Example: dp[0] = 0 (no coins needed for amount 0)
 *
 * STEP 4: Determine computation order
 * - Bottom-up: Smallest to largest
 * - Example: amount 0 → 1 → 2 → ... → target
 *
 * STEP 5: Optimize space (if possible)
 * - Do you need entire array or just last few values?
 * - Example: Fibonacci only needs last 2 values
 */

/**
 * COMMON MISTAKES:
 *
 * 1. ❌ Wrong initialization
 *    dp[0] = 1 instead of dp[0] = 0
 *
 * 2. ❌ Off-by-one errors
 *    for (int i = 0; i < n; i++) instead of i <= n
 *
 * 3. ❌ Wrong loop order
 *    Must solve smaller subproblems first!
 *
 * 4. ❌ Forgetting to check bounds
 *    if (i - coin >= 0) before accessing dp[i - coin]
 *
 * 5. ❌ Not handling impossible cases
 *    Return -1 or infinity when solution doesn't exist
 */`

  const implementationCode = `// Advanced DP Problems & Patterns

// ========================================
// 2D DP: LONGEST COMMON SUBSEQUENCE (LCS)
// ========================================

/**
 * PROBLEM: Find longest subsequence present in both strings
 *
 * Example:
 * s1 = "ABCDGH"
 * s2 = "AEDFHR"
 * LCS = "ADH" (length 3)
 *
 * STATE: dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]
 *
 * RECURRENCE:
 * if s1[i-1] == s2[j-1]:
 *     dp[i][j] = dp[i-1][j-1] + 1
 * else:
 *     dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 */

public static int longestCommonSubsequence(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];

    // Base case: dp[0][j] = 0, dp[i][0] = 0 (empty string)

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];

    // Time: O(m × n)
    // Space: O(m × n) - can optimize to O(min(m,n))
}

// ========================================
// 2D DP: 0/1 KNAPSACK
// ========================================

/**
 * PROBLEM: Given items with weights and values, and knapsack capacity.
 * Maximize value without exceeding capacity. Each item used 0 or 1 time.
 *
 * Example:
 * weights = [1, 3, 4, 5]
 * values  = [1, 4, 5, 7]
 * capacity = 7
 * Answer: Take items 2,3 → value = 4+5 = 9
 *
 * STATE: dp[i][w] = max value using first i items, capacity w
 *
 * RECURRENCE:
 * For each item i at capacity w:
 * - Don't take: dp[i][w] = dp[i-1][w]
 * - Take (if fits): dp[i][w] = dp[i-1][w - weight[i]] + value[i]
 * - Choose max of both
 */

public static int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            // Don't take item i-1
            dp[i][w] = dp[i - 1][w];

            // Take item i-1 (if it fits)
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }

    return dp[n][capacity];

    // Time: O(n × capacity)
    // Space: O(n × capacity) - can optimize to O(capacity)
}

// ========================================
// DP PATTERN 1: LINEAR DP (1D)
// ========================================

/**
 * HOUSE ROBBER
 *
 * Can't rob adjacent houses. Maximize money.
 * houses = [2, 7, 9, 3, 1]
 * Answer: rob houses 0, 2, 4 → 2 + 9 + 1 = 12
 *
 * STATE: dp[i] = max money robbing houses 0..i
 * RECURRENCE: dp[i] = max(dp[i-1], dp[i-2] + houses[i])
 * - Either skip house i: dp[i-1]
 * - Or rob house i: dp[i-2] + houses[i]
 */

public static int rob(int[] houses) {
    if (houses.length == 0) return 0;
    if (houses.length == 1) return houses[0];

    int prev2 = houses[0];
    int prev1 = Math.max(houses[0], houses[1]);

    for (int i = 2; i < houses.length; i++) {
        int current = Math.max(prev1, prev2 + houses[i]);
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;

    // Time: O(n)
    // Space: O(1) - space optimized!
}

// ========================================
// DP PATTERN 2: GRID DP (2D)
// ========================================

/**
 * UNIQUE PATHS
 *
 * Robot in m×n grid. Can only move right or down.
 * How many paths from top-left to bottom-right?
 *
 * STATE: dp[i][j] = number of paths to cell (i,j)
 * RECURRENCE: dp[i][j] = dp[i-1][j] + dp[i][j-1]
 * - Paths from above + paths from left
 */

public static int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];

    // Base case: first row and column (only 1 path each)
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;

    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }

    return dp[m - 1][n - 1];

    // Time: O(m × n)
    // Space: O(m × n) - can optimize to O(n)
}

// ========================================
// DP PATTERN 3: STRING DP
// ========================================

/**
 * EDIT DISTANCE (Levenshtein Distance)
 *
 * Minimum operations to convert s1 to s2.
 * Operations: insert, delete, replace
 *
 * Example:
 * s1 = "horse", s2 = "ros"
 * horse → rorse (replace h→r)
 * rorse → rose (delete r)
 * rose → ros (delete e)
 * Answer: 3 operations
 *
 * STATE: dp[i][j] = min operations to convert s1[0..i-1] to s2[0..j-1]
 */

public static int editDistance(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];

    // Base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i;  // Delete all
    for (int j = 0; j <= n; j++) dp[0][j] = j;  // Insert all

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];  // No operation needed
            } else {
                dp[i][j] = 1 + Math.min(
                    Math.min(
                        dp[i - 1][j],      // Delete from s1
                        dp[i][j - 1]       // Insert to s1
                    ),
                    dp[i - 1][j - 1]       // Replace
                );
            }
        }
    }

    return dp[m][n];

    // Time: O(m × n)
    // Space: O(m × n)
}

// ========================================
// SPACE OPTIMIZATION TECHNIQUE
// ========================================

/**
 * When to optimize space?
 *
 * 1. If dp[i] only depends on dp[i-1]:
 *    → Use 2 variables instead of array
 *    Example: Fibonacci, House Robber
 *
 * 2. If dp[i][j] only depends on dp[i-1][...]:
 *    → Use 2 rows instead of full 2D array
 *    Example: LCS, Edit Distance, Knapsack
 *
 * 3. If processing order allows overwriting:
 *    → Process in reverse to reuse space
 */

// LCS with O(n) space instead of O(m×n)
public static int lcsOptimized(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[] prev = new int[n + 1];
    int[] curr = new int[n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                curr[j] = prev[j - 1] + 1;
            } else {
                curr[j] = Math.max(prev[j], curr[j - 1]);
            }
        }
        // Swap rows
        int[] temp = prev;
        prev = curr;
        curr = temp;
    }

    return prev[n];

    // Space: O(n) instead of O(m×n)!
}

/**
 * INTERVIEW TIPS:
 *
 * 1. Always ask about constraints:
 *    - Array size? (affects space optimization)
 *    - Value range? (affects initialization)
 *    - Multiple queries? (precompute vs compute on-demand)
 *
 * 2. Start with recurrence relation:
 *    - Write it out clearly
 *    - Explain your thinking
 *    - Interviewer cares about approach, not just code!
 *
 * 3. Consider both approaches:
 *    - Mention memoization (easier to think)
 *    - Then optimize to tabulation (better performance)
 *
 * 4. Draw the DP table:
 *    - Visual representation helps interviewer
 *    - Easier to explain your approach
 *    - Catches bugs before coding
 *
 * 5. Test with small examples:
 *    - n=0, n=1, n=2
 *    - Edge cases are where bugs hide!
 */`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/lru-cache" className="hover:text-blue-600">LRU Cache</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800 font-semibold">Dynamic Programming</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Dynamic Programming Mastery</h1>
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

      {/* Learning Path */}
      <div className="mb-8 bg-gradient-to-r from-blue-100 via-green-100 to-purple-100 rounded-lg shadow-md p-6 border-2 border-blue-300">
        <div className="flex items-center justify-center">
          <div className="text-2xl mr-3">🎯</div>
          <h3 className="font-bold text-lg text-gray-800 mr-6">Master DP in 4 Steps:</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow font-bold">
              <span className="mr-2">1</span> Recognize Pattern
            </div>
            <span className="text-gray-400 text-2xl">→</span>
            <div className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow font-bold">
              <span className="mr-2">2</span> Define State
            </div>
            <span className="text-gray-400 text-2xl">→</span>
            <div className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow font-bold">
              <span className="mr-2">3</span> Find Recurrence
            </div>
            <span className="text-gray-400 text-2xl">→</span>
            <div className="flex items-center bg-slate-500 text-white px-4 py-2 rounded-lg shadow font-bold">
              <span className="mr-2">4</span> Optimize
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 mt-3">The systematic approach used in 70% of FAANG interviews!</p>
      </div>

      {/* Theory Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-blue-500">
        <div className="flex items-center mb-4">
          <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">1</div>
          <h2 className="text-3xl font-bold text-gray-800">Theory: What is Dynamic Programming?</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            <strong>Dynamic Programming (DP)</strong> is an optimization technique that solves complex problems by breaking them
            into overlapping subproblems, solving each once, and storing results. It turns exponential O(2ⁿ) algorithms into
            polynomial O(n) or O(n²) solutions!
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-700 mb-3">🎯 Two Requirements for DP</h3>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded">
                <strong className="text-green-800">1. Optimal Substructure:</strong>
                <p className="text-sm text-gray-700 mt-1">
                  Optimal solution contains optimal solutions to subproblems.
                  Example: Shortest path A→C = Shortest(A→B) + Shortest(B→C)
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <strong className="text-blue-800">2. Overlapping Subproblems:</strong>
                <p className="text-sm text-gray-700 mt-1">
                  Same subproblems solved multiple times. Example: Computing fib(5) calculates fib(3) twice,
                  fib(2) three times - huge waste without caching!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800 mb-2">⚡ The Power of DP</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Naive Fibonacci(40):</strong> 331,160,281 recursive calls - takes seconds!</div>
              <div><strong>DP Fibonacci(40):</strong> 79 calls - instant!</div>
              <div className="text-green-700 font-bold mt-2">That's 4 MILLION times faster! 🚀</div>
            </div>
          </div>
        </div>
      </div>

      {showLearningMode && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="text-3xl mr-3">🎓</div>
            <div>
              <div className="font-bold text-green-800 text-lg mb-1">Learning Mode Active!</div>
              <div className="text-green-700">
                Watch the DP table fill step-by-step! Use Previous/Next buttons to see how each value is calculated from
                previous subproblems. This visual representation is key to understanding DP!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Practice */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-green-500">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">2</div>
          <h2 className="text-3xl font-bold text-gray-800">Practice: Interactive DP Problems</h2>
        </div>

        {/* Problem Selector */}
        <div className="mb-6 bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Select Problem:</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {Object.entries(problems).map(([key, problem]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedProblem(key)
                  handleReset()
                }}
                className={`p-4 rounded-lg font-semibold transition-all ${
                  selectedProblem === key
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="text-3xl mb-2">{problem.icon}</div>
                <div className="font-bold">{problem.name}</div>
                <div className="text-xs mt-1 opacity-80">{problem.description}</div>
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-4 mb-4">
            <label className="font-semibold">{problems[selectedProblem].inputLabel}:</label>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(Math.min(parseInt(e.target.value) || 0, problems[selectedProblem].maxInput))}
              min="0"
              max={problems[selectedProblem].maxInput}
              className="px-3 py-2 border border-gray-300 rounded-md w-24"
            />
            <button
              onClick={handleSolve}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Solve with DP
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Reset
            </button>
          </div>

          {/* DP Table Visualization */}
          {dpTable.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">DP Table:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {dpTable.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg font-bold transition-all ${
                      steps[currentStep]?.highlight?.includes(idx)
                        ? 'bg-yellow-400 text-gray-900 scale-110 shadow-lg'
                        : 'bg-blue-100 text-gray-800'
                    }`}
                  >
                    <div className="text-xs text-gray-600">[{idx}]</div>
                    <div className="text-lg">{val === Infinity ? '∞' : val}</div>
                  </div>
                ))}
              </div>

              {/* Step Controls */}
              {steps.length > 0 && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleStepBackward}
                    disabled={currentStep === 0}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
                  >
                    ← Previous
                  </button>
                  <div className="text-sm font-semibold">
                    Step {currentStep + 1} / {steps.length}
                  </div>
                  <button
                    onClick={handleStepForward}
                    disabled={currentStep === steps.length - 1}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {message && (
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded">
              <strong>Step:</strong> {message}
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded">
          <strong>Try This:</strong> Solve Fibonacci for n=5, then watch step-by-step how dp[5] = dp[4] + dp[3] is built
          from base cases!
        </div>
      </div>

      <ComplexityInfo data={complexityData} />

      {/* Code Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-8 mb-8 border-l-8 border-purple-500">
        <div className="flex items-center mb-6">
          <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 shadow-lg">3</div>
          <h2 className="text-3xl font-bold text-gray-800">Code: Master DP Implementation</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <CodeDisplay
            title="DP Theory & Classic Problems"
            code={theoryCode}
            language="java"
          />
          <CodeDisplay
            title="Advanced DP Patterns & Problems"
            code={implementationCode}
            language="java"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
        <Link
          to="/lru-cache"
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          <span className="mr-2">←</span> Previous: LRU Cache
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

export default DynamicProgrammingVisualizer
