/**
 * Formatter module for LeetCode -> GitHub sync
 * Handles title sanitization, PascalCase conversion, and metadata header formatting.
 */

const DIGIT_WORDS = {
  '0': 'Zero',
  '1': 'One',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine'
};

/**
 * Converts a problem title into a valid PascalCase Java filename.
 * Example:
 * "Two Sum" -> "TwoSum"
 * "3Sum" -> "ThreeSum"
 * "3Sum Closest" -> "ThreeSumClosest"
 * "Insert Delete GetRandom O(1)" -> "InsertDeleteGetRandomO1"
 * "Longest Substring Without Repeating Characters" -> "LongestSubstringWithoutRepeatingCharacters"
 * 
 * @param {string} title 
 * @returns {string} PascalCase filename without extension
 */
function toPascalCase(title) {
  if (!title) return 'Solution';

  let processed = title.trim();

  // Remove mathematical / special notation characters like O(1), (n), etc. cleanly
  processed = processed.replace(/O\(1\)/gi, 'O1');
  processed = processed.replace(/O\(n\)/gi, 'On');

  // Replace hyphen between number and word, e.g. "1-bit" -> "1 bit"
  processed = processed.replace(/(\d+)-([a-zA-Z]+)/g, '$1 $2');

  // If starts with digit, convert leading digit(s) so it's a valid Java class name
  if (/^\d/.test(processed)) {
    processed = processed.replace(/^(\d+)/, (match) => {
      return match.split('').map(d => DIGIT_WORDS[d] || d).join('');
    });
  }

  // Replace any non-alphanumeric character sequences with spaces
  processed = processed.replace(/[^a-zA-Z0-9]/g, ' ');

  // Split into words, capitalize first letter of each word
  const words = processed.split(/\s+/).filter(w => w.length > 0);

  const pascal = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');

  return pascal || 'Solution';
}

/**
 * Generates the Java filename with .java extension
 * @param {string} title 
 * @returns {string} e.g. "TwoSum.java"
 */
function getJavaFilename(title) {
  const pascalName = toPascalCase(title);
  return `${pascalName}.java`;
}

/**
 * Builds the complete solution file content with standard metadata header.
 * 
 * @param {Object} metadata
 * @param {string|number} metadata.questionFrontendId - Problem number, e.g. 1
 * @param {string} metadata.title - Problem title, e.g. "Two Sum"
 * @param {string} metadata.difficulty - "Easy", "Medium", "Hard"
 * @param {string} metadata.titleSlug - e.g. "two-sum"
 * @param {string} [metadata.timeComplexity] - e.g. "O(n)"
 * @param {string} [metadata.spaceComplexity] - e.g. "O(n)"
 * @param {string} code - The submitted Java source code
 * @returns {string} Formatted source code with header
 */
function formatSolutionFile(metadata, code) {
  const problemNumber = metadata.questionFrontendId || metadata.questionId || '';
  const problemTitle = metadata.title || '';
  const difficulty = metadata.difficulty || 'Unknown';
  const slug = metadata.titleSlug || '';
  const url = slug ? `https://leetcode.com/problems/${slug}/` : '';
  const timeComplexity = metadata.timeComplexity || 'O(n)';
  const spaceComplexity = metadata.spaceComplexity || 'O(1)';

  const header = `/*\nLeetCode #${problemNumber}\nProblem: ${problemTitle}\nDifficulty: ${difficulty}\nURL: ${url}\nTime Complexity: ${timeComplexity}\nSpace Complexity: ${spaceComplexity}\n*/\n\n`;

  // Strip any existing duplicate LeetCode metadata header if re-syncing
  let cleanCode = code.trim();
  if (cleanCode.startsWith('/*\nLeetCode #') || cleanCode.startsWith('/* LeetCode #')) {
    const endHeaderIndex = cleanCode.indexOf('*/');
    if (endHeaderIndex !== -1) {
      cleanCode = cleanCode.substring(endHeaderIndex + 2).trim();
    }
  }

  return header + cleanCode + '\n';
}

/**
 * Builds standard commit message
 * @param {string|number} questionFrontendId 
 * @param {string} title 
 * @param {boolean} isUpdate 
 * @returns {string} e.g. "feat: add leetcode #1 two sum"
 */
function buildCommitMessage(questionFrontendId, title, isUpdate = false) {
  const prefix = isUpdate ? 'refactor' : 'feat';
  const cleanTitle = (title || '').toLowerCase().trim();
  return `${prefix}: ${isUpdate ? 'update' : 'add'} leetcode #${questionFrontendId} ${cleanTitle}`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    toPascalCase,
    getJavaFilename,
    formatSolutionFile,
    buildCommitMessage
  };
}
