/**
 * Unit Tests for LeetSync Pro logic
 */

const assert = require('assert');
const { categorizeProblem } = require('../extension/scripts/categorizer');
const { toPascalCase, getJavaFilename, formatSolutionFile, buildCommitMessage } = require('../extension/scripts/formatter');

console.log('Running LeetSync Pro Verification Tests...\n');

// 1. Test Categorizer
console.log('[Test 1] Categorizer mapping');

// Array problem
assert.strictEqual(
  categorizeProblem([{ name: 'Array', slug: 'array' }], 'Two Sum'),
  'Arrays'
);

// Dynamic Programming
assert.strictEqual(
  categorizeProblem([{ name: 'Array', slug: 'array' }, { name: 'Dynamic Programming', slug: 'dynamic-programming' }], 'Climbing Stairs'),
  'DynamicProgramming'
);

// Binary Search Tree (BST takes priority over general Tree)
assert.strictEqual(
  categorizeProblem([{ name: 'Tree', slug: 'tree' }, { name: 'Binary Search Tree', slug: 'binary-search-tree' }], 'Validate BST'),
  'BST'
);

// Binary Tree
assert.strictEqual(
  categorizeProblem([{ name: 'Tree', slug: 'tree' }, { name: 'Binary Tree', slug: 'binary-tree' }], 'Maximum Depth of Binary Tree'),
  'BinaryTree'
);

// Sliding Window
assert.strictEqual(
  categorizeProblem([{ name: 'Array', slug: 'array' }, { name: 'Sliding Window', slug: 'sliding-window' }], 'Minimum Size Subarray Sum'),
  'SlidingWindow'
);

// Two Pointers
assert.strictEqual(
  categorizeProblem([{ name: 'Two Pointers', slug: 'two-pointers' }], 'Container With Most Water'),
  'TwoPointers'
);

// Graph
assert.strictEqual(
  categorizeProblem([{ name: 'Graph', slug: 'graph' }, { name: 'Union Find', slug: 'union-find' }], 'Number of Provinces'),
  'Graph'
);

// Linked List
assert.strictEqual(
  categorizeProblem([{ name: 'Linked List', slug: 'linked-list' }], 'Reverse Linked List'),
  'LinkedList'
);

// Stack
assert.strictEqual(
  categorizeProblem([{ name: 'Stack', slug: 'stack' }], 'Valid Parentheses'),
  'Stack'
);

// Hashing
assert.strictEqual(
  categorizeProblem([{ name: 'Hash Table', slug: 'hash-table' }], 'Group Anagrams'),
  'Hashing'
);

console.log(' Categorizer tests passed.');

// 2. Test Formatter / PascalCase
console.log('\n[Test 2] PascalCase & Java filename generation');

assert.strictEqual(toPascalCase('Two Sum'), 'TwoSum');
assert.strictEqual(getJavaFilename('Two Sum'), 'TwoSum.java');

// Leading numbers
assert.strictEqual(toPascalCase('3Sum'), 'ThreeSum');
assert.strictEqual(getJavaFilename('3Sum'), 'ThreeSum.java');
assert.strictEqual(toPascalCase('3Sum Closest'), 'ThreeSumClosest');
assert.strictEqual(toPascalCase('4Sum'), 'FourSum');
assert.strictEqual(toPascalCase('01 Matrix'), 'ZeroOneMatrix');

// Special characters & Complexities in title
assert.strictEqual(toPascalCase('Insert Delete GetRandom O(1)'), 'InsertDeleteGetRandomO1');
assert.strictEqual(getJavaFilename('Insert Delete GetRandom O(1)'), 'InsertDeleteGetRandomO1.java');
assert.strictEqual(toPascalCase('1-bit and 2-bit Characters'), 'OneBitAnd2BitCharacters');
assert.strictEqual(toPascalCase('Reverse Words in a String III'), 'ReverseWordsInAStringIII');

console.log(' Formatter PascalCase tests passed.');

// 3. Test Metadata Header Formatting
console.log('\n[Test 3] Metadata Header Formatting');

const sampleMetadata = {
  questionFrontendId: 1,
  title: 'Two Sum',
  difficulty: 'Easy',
  titleSlug: 'two-sum',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)'
};

const sampleCode = `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`;

const formatted = formatSolutionFile(sampleMetadata, sampleCode);

assert(formatted.includes('LeetCode #1'));
assert(formatted.includes('Problem: Two Sum'));
assert(formatted.includes('Difficulty: Easy'));
assert(formatted.includes('URL: https://leetcode.com/problems/two-sum/'));
assert(formatted.includes('Time Complexity: O(n)'));
assert(formatted.includes('Space Complexity: O(n)'));
assert(formatted.includes('class Solution {'));

console.log(' Metadata header tests passed.');

// 4. Test Commit Message Builder
console.log('\n[Test 4] Commit Message Builder');

assert.strictEqual(
  buildCommitMessage(1, 'Two Sum', false),
  'feat: add leetcode #1 two sum'
);

assert.strictEqual(
  buildCommitMessage(1, 'Two Sum', true),
  'refactor: update leetcode #1 two sum'
);

console.log(' Commit message tests passed.');

// 5. Test Duplicate Prevention Logic
console.log('\n[Test 5] Duplicate Prevention Logic');

const formatted1 = formatSolutionFile(sampleMetadata, sampleCode);
const formatted2 = formatSolutionFile(sampleMetadata, sampleCode);

const normalized1 = formatted1.replace(/\r\n/g, '\n').trim();
const normalized2 = formatted2.replace(/\r\n/g, '\n').trim();

assert.strictEqual(normalized1 === normalized2, true, 'Exact same submissions must match');

const differentCode = sampleCode + '\n// small change';
const formatted3 = formatSolutionFile(sampleMetadata, differentCode);
const normalized3 = formatted3.replace(/\r\n/g, '\n').trim();

assert.strictEqual(normalized1 === normalized3, false, 'Modified submissions must differ');

console.log(' Duplicate prevention logic passed.');

console.log('\n ALL 5 TEST SUITES PASSED SUCCESSFULLY!');
