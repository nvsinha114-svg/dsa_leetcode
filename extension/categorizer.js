/**
 * Categorizer module for LeetCode -> GitHub sync
 * Maps LeetCode problem topic tags to repository category folders
 */

const CATEGORIES = [
  'Arrays',
  'Strings',
  'Hashing',
  'TwoPointers',
  'SlidingWindow',
  'PrefixSum',
  'BinarySearch',
  'LinkedList',
  'Stack',
  'Queue',
  'BinaryTree',
  'BST',
  'Heap',
  'Greedy',
  'Backtracking',
  'Graph',
  'DynamicProgramming'
];

/**
 * Maps problem topic tags to one of the 17 designated categories.
 * @param {Array<{name: string, slug: string}>} topicTags 
 * @param {string} problemTitle 
 * @returns {string} Target category folder name
 */
function categorizeProblem(topicTags = [], problemTitle = '') {
  if (!topicTags || !Array.isArray(topicTags)) {
    topicTags = [];
  }

  const slugs = topicTags.map(t => (t.slug || t.name || '').toLowerCase());
  const names = topicTags.map(t => (t.name || '').toLowerCase());
  const allTags = [...slugs, ...names];

  const hasTag = (pattern) => {
    const p = pattern.toLowerCase();
    return allTags.some(tag => tag.includes(p));
  };

  // 1. Binary Search Tree (specific tree category)
  if (hasTag('binary search tree') || hasTag('bst')) {
    return 'BST';
  }

  // 2. Binary Tree & Trees
  if (hasTag('binary tree') || (hasTag('tree') && !hasTag('fenwick') && !hasTag('segment tree'))) {
    return 'BinaryTree';
  }

  // 3. Sliding Window
  if (hasTag('sliding window') || hasTag('sliding-window')) {
    return 'SlidingWindow';
  }

  // 4. Two Pointers
  if (hasTag('two pointers') || hasTag('two-pointers')) {
    return 'TwoPointers';
  }

  // 5. Prefix Sum
  if (hasTag('prefix sum') || hasTag('prefix-sum')) {
    return 'PrefixSum';
  }

  // 6. Dynamic Programming
  if (hasTag('dynamic programming') || hasTag('dynamic-programming') || hasTag('memoization')) {
    return 'DynamicProgramming';
  }

  // 7. Backtracking / Recursion
  if (hasTag('backtracking')) {
    return 'Backtracking';
  }

  // 8. Heap / Priority Queue
  if (hasTag('heap') || hasTag('priority queue') || hasTag('priority-queue')) {
    return 'Heap';
  }

  // 9. Graph / Disjoint Set / Shortest Path / Topological Sort
  if (
    hasTag('graph') ||
    hasTag('union find') ||
    hasTag('union-find') ||
    hasTag('disjoint set') ||
    hasTag('shortest path') ||
    hasTag('topological sort') ||
    hasTag('bipartite') ||
    hasTag('eulerian') ||
    hasTag('minimum spanning tree')
  ) {
    return 'Graph';
  }

  // 10. Stack
  if (hasTag('stack') || hasTag('monotonic stack')) {
    return 'Stack';
  }

  // 11. Queue & Deque
  if (hasTag('queue') || hasTag('monotonic queue') || hasTag('deque')) {
    return 'Queue';
  }

  // 12. Linked List
  if (hasTag('linked list') || hasTag('linked-list')) {
    return 'LinkedList';
  }

  // 13. Binary Search
  if (hasTag('binary search') || hasTag('binary-search')) {
    return 'BinarySearch';
  }

  // 14. Greedy
  if (hasTag('greedy')) {
    return 'Greedy';
  }

  // 15. Hashing / Hash Table
  if (hasTag('hash table') || hasTag('hash-table') || hasTag('hash function') || hasTag('hashing')) {
    return 'Hashing';
  }

  // 16. Strings
  if (hasTag('string') || hasTag('string matching')) {
    return 'Strings';
  }

  // 17. Arrays / Matrix / Simulation / Fallback
  return 'Arrays';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CATEGORIES,
    categorizeProblem
  };
}
