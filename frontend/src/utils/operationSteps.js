/**
 * Generate step-by-step visualizations for operations
 * This helps students understand WHY each operation has its complexity
 */

export const generateArraySearchSteps = (array, searchValue) => {
  const steps = []
  let operationCount = 0

  steps.push({
    description: `Starting search for ${searchValue} in array`,
    code: `for (int i = 0; i < array.length; i++)`,
    visualization: array.map((val, idx) => ({ value: val })),
    operationCount: 0,
    explanation: "We must check each element one by one (linear search)"
  })

  for (let i = 0; i < array.length; i++) {
    operationCount++

    if (array[i] === searchValue) {
      steps.push({
        description: `Found ${searchValue} at index ${i}!`,
        code: `if (array[${i}] == ${searchValue}) return ${i};`,
        visualization: array.map((val, idx) => ({
          value: val,
          highlight: idx === i,
          checked: idx <= i
        })),
        operationCount,
        explanation: `We checked ${operationCount} element(s) before finding the value`,
        complexity: `O(n)`,
        complexityExplanation: `In worst case, we might need to check all n elements. Here we checked ${operationCount} out of ${array.length} elements.`
      })
      return steps
    }

    steps.push({
      description: `Checking index ${i}: ${array[i]} ≠ ${searchValue}`,
      code: `if (array[${i}] == ${searchValue}) // false`,
      visualization: array.map((val, idx) => ({
        value: val,
        highlight: idx === i,
        checked: idx <= i
      })),
      operationCount,
      explanation: `Element at index ${i} doesn't match, continue searching`
    })
  }

  steps.push({
    description: `${searchValue} not found in array`,
    code: `return -1; // not found`,
    visualization: array.map((val, idx) => ({
      value: val,
      checked: true
    })),
    operationCount,
    explanation: `We checked all ${array.length} elements`,
    complexity: `O(n)`,
    complexityExplanation: `We had to check every single element in the array (${array.length} comparisons). This is why search is O(n) - linear time.`
  })

  return steps
}

export const generateArrayInsertSteps = (array, index, value) => {
  const steps = []
  let operationCount = 0

  steps.push({
    description: `Inserting ${value} at index ${index}`,
    code: `array.insert(${index}, ${value})`,
    visualization: array.map((val) => ({ value: val })),
    operationCount: 0,
    explanation: "We need to shift elements to make room for new value"
  })

  // Show the shifting process
  if (index < array.length) {
    for (let i = array.length; i > index; i--) {
      operationCount++
      steps.push({
        description: `Shifting element at index ${i - 1} to index ${i}`,
        code: `array[${i}] = array[${i - 1}];`,
        visualization: array.map((val, idx) => ({
          value: val,
          highlight: idx === i - 1,
          target: idx === i
        })),
        operationCount,
        explanation: `Each element after insertion point must be moved one position right`
      })
    }
  }

  operationCount++
  const newArray = [...array]
  newArray.splice(index, 0, value)

  steps.push({
    description: `Placed ${value} at index ${index}`,
    code: `array[${index}] = ${value};`,
    visualization: newArray.map((val, idx) => ({
      value: val,
      highlight: idx === index
    })),
    operationCount,
    explanation: `Finally insert the new value at the desired position`,
    complexity: 'O(n)',
    complexityExplanation: `We had to shift ${operationCount - 1} elements. In worst case (inserting at beginning), we shift all n elements, making this O(n).`
  })

  return steps
}

export const generateArrayAccessSteps = (array, index) => {
  return [
    {
      description: `Accessing element at index ${index}`,
      code: `value = array[${index}];`,
      visualization: array.map((val, idx) => ({
        value: val,
        highlight: idx === index
      })),
      operationCount: 1,
      explanation: "Array elements are stored in contiguous memory locations",
      complexity: 'O(1)',
      complexityExplanation: `Direct memory access using formula: address = base_address + (index × element_size). This calculation takes constant time regardless of array size!`
    }
  ]
}

export const generateLinkedListSearchSteps = (list, searchValue) => {
  const steps = []
  let operationCount = 0

  steps.push({
    description: `Searching for ${searchValue} in linked list`,
    code: `Node current = head;`,
    visualization: list.map((val) => ({ value: val.value })),
    operationCount: 0,
    explanation: "Start at head and traverse through each node"
  })

  for (let i = 0; i < list.length; i++) {
    operationCount++

    if (list[i].value === searchValue) {
      steps.push({
        description: `Found ${searchValue} at position ${i}!`,
        code: `if (current.data == ${searchValue}) return ${i};`,
        visualization: list.map((val, idx) => ({
          value: val.value,
          highlight: idx === i,
          checked: idx <= i
        })),
        operationCount,
        explanation: `Found after checking ${operationCount} node(s)`,
        complexity: 'O(n)',
        complexityExplanation: `We must traverse nodes one by one following the 'next' pointers. Checked ${operationCount} out of ${list.length} nodes.`
      })
      return steps
    }

    steps.push({
      description: `Checking node ${i}: ${list[i].value} ≠ ${searchValue}`,
      code: `current = current.next;`,
      visualization: list.map((val, idx) => ({
        value: val.value,
        highlight: idx === i,
        checked: idx <= i
      })),
      operationCount,
      explanation: `Node doesn't match, follow 'next' pointer to continue`
    })
  }

  steps.push({
    description: `${searchValue} not found`,
    code: `return -1;`,
    visualization: list.map((val) => ({
      value: val.value,
      checked: true
    })),
    operationCount,
    complexity: 'O(n)',
    complexityExplanation: `Traversed all ${list.length} nodes. Unlike arrays, we can't jump to middle - must follow links one by one.`
  })

  return steps
}

export const generateLinkedListInsertBeginningSteps = (list, value) => {
  return [
    {
      description: `Creating new node with value ${value}`,
      code: `Node newNode = new Node(${value});`,
      visualization: [{ value: value, highlight: true }, ...list.map(v => ({ value: v.value }))],
      operationCount: 1,
      explanation: "Create new node in memory"
    },
    {
      description: `Linking new node to current head`,
      code: `newNode.next = head;`,
      visualization: [{ value: value, highlight: true }, ...list.map(v => ({ value: v.value }))],
      operationCount: 2,
      explanation: "Point new node's 'next' to current first node"
    },
    {
      description: `Updating head pointer to new node`,
      code: `head = newNode;`,
      visualization: [{ value: value, highlight: true }, ...list.map(v => ({ value: v.value }))],
      operationCount: 3,
      explanation: "Update head to point to new node",
      complexity: 'O(1)',
      complexityExplanation: `Only 3 operations regardless of list size! No traversal needed. This is why insertion at beginning is O(1) constant time.`
    }
  ]
}

export const generateSetAddSteps = (set, value) => {
  const setArray = Array.from(set)
  const hashIndex = Math.abs(value.toString().split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 8

  return [
    {
      description: `Adding ${value} to hash set`,
      code: `int hash = value.hashCode() % capacity;`,
      visualization: setArray.map((val) => ({ value: val })),
      operationCount: 1,
      explanation: "Calculate hash code to determine bucket location"
    },
    {
      description: `Checking if ${value} already exists`,
      code: `if (bucket[${hashIndex}].contains(${value}))`,
      visualization: setArray.map((val) => ({
        value: val,
        highlight: val === value
      })),
      operationCount: 2,
      explanation: "Hash sets don't allow duplicates, so check first"
    },
    {
      description: set.has(value) ? `${value} already exists, ignoring` : `Adding ${value} to bucket ${hashIndex}`,
      code: set.has(value) ? `return false;` : `bucket[${hashIndex}].add(${value});`,
      visualization: set.has(value)
        ? setArray.map((val) => ({ value: val, highlight: val === value }))
        : [...setArray, value].map((val, idx) => ({
            value: val,
            highlight: val === value
          })),
      operationCount: 3,
      explanation: set.has(value) ? "Value already exists, maintaining uniqueness" : "Add to appropriate bucket",
      complexity: 'O(1)',
      complexityExplanation: `Hash function directly computes location (O(1)), then we check/add in that bucket (O(1) average). No need to search entire set!`
    }
  ]
}

export const generateAmortizedArrayGrowthSteps = () => {
  const steps = []
  let capacity = 4
  let size = 0
  let totalOps = 0

  for (let i = 1; i <= 17; i++) {
    if (size < capacity) {
      totalOps += 1
      steps.push({
        description: `Insert element ${i} (capacity: ${capacity}, size: ${size})`,
        code: `array[size++] = ${i}; // O(1)`,
        visualization: Array(capacity).fill(null).map((_, idx) => ({
          value: idx < size ? '✓' : idx === size ? i : '□',
          highlight: idx === size
        })),
        operationCount: totalOps,
        explanation: `Space available, just insert at next position (1 operation)`,
      })
      size++
    } else {
      const oldCapacity = capacity
      capacity *= 2
      totalOps += size + 1 // copy all + insert
      steps.push({
        description: `Insert element ${i} - RESIZE NEEDED! (capacity: ${oldCapacity} → ${capacity})`,
        code: `resize(); // copy ${size} elements\narray[size++] = ${i};`,
        visualization: Array(capacity).fill(null).map((_, idx) => ({
          value: idx < size ? '✓' : idx === size ? i : '□',
          highlight: idx === size,
          checked: idx < size
        })),
        operationCount: totalOps,
        explanation: `Array full! Create larger array, copy ${size} elements, then insert (${size + 1} operations)`,
      })
      size++
    }
  }

  const avgOps = (totalOps / size).toFixed(2)
  steps.push({
    description: `Summary: ${size} insertions with ${totalOps} total operations`,
    code: `average = ${totalOps} / ${size} = ${avgOps} ops per insert`,
    visualization: Array(capacity).fill(null).map((_, idx) => ({
      value: idx < size ? '✓' : '□'
    })),
    operationCount: totalOps,
    complexity: 'O(1) amortized',
    complexityExplanation: `Even though some inserts cost O(n) due to resizing, they're rare. On average, each insert is ${avgOps} operations ≈ O(1). This is "amortized" constant time!`
  })

  return steps
}
