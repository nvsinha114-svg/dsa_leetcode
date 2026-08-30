/**
 * Background Service Worker for LeetSync Pro
 * Handles GitHub REST API commits, duplicate checking, and state storage.
 */

importScripts('categorizer.js', 'formatter.js');

const DEFAULT_CONFIG = {
  githubToken: '',
  repoOwner: 'nvsinha114-svg',
  repoName: 'dsa_leetcode',
  branch: 'main',
  autoSync: true
};

// Safe UTF-8 to Base64 encoder for browser environments
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binString);
}

// Safe Base64 to UTF-8 decoder
function base64ToUtf8(base64) {
  const binString = atob(base64.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Get user configuration from storage
async function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get(DEFAULT_CONFIG, (items) => {
      resolve(items);
    });
  });
}

// Save recent sync record to history
async function addSyncRecord(record) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ syncHistory: [] }, (data) => {
      const history = data.syncHistory || [];
      history.unshift({
        ...record,
        timestamp: new Date().toISOString()
      });
      // Keep last 50 items
      const trimmed = history.slice(0, 50);
      chrome.storage.local.set({ syncHistory: trimmed }, () => {
        resolve();
      });
    });
  });
}

/**
 * Checks if a file exists on GitHub and returns its SHA and content
 */
async function fetchExistingFile(owner, repo, path, branch, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}?ref=${branch}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (response.status === 200) {
    const data = await response.json();
    let decodedContent = '';
    if (data.content) {
      decodedContent = base64ToUtf8(data.content);
    }
    return {
      exists: true,
      sha: data.sha,
      content: decodedContent
    };
  }

  if (response.status === 404) {
    return {
      exists: false,
      sha: null,
      content: null
    };
  }

  const errData = await response.json().catch(() => ({}));
  throw new Error(`GitHub API error checking file: ${response.status} ${errData.message || response.statusText}`);
}

/**
 * Puts file to GitHub repository using REST API
 */
async function commitFileToGitHub(owner, repo, path, branch, token, contentStr, commitMessage, existingSha) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
  
  const body = {
    message: commitMessage,
    content: utf8ToBase64(contentStr),
    branch: branch
  };

  if (existingSha) {
    body.sha = existingSha;
  }

  const maxRetries = 2;
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }

      const errData = await response.json().catch(() => ({}));
      throw new Error(`GitHub API error (${response.status}): ${errData.message || response.statusText}`);
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

/**
 * Primary sync handler
 */
async function handleSyncSubmission(data) {
  const config = await getConfig();

  if (!config.githubToken) {
    throw new Error('GitHub Personal Access Token is missing. Please configure it in the LeetSync extension popup.');
  }
  if (!config.repoOwner || !config.repoName) {
    throw new Error('Target repository is not configured. Please set owner and repo name.');
  }

  // 1. Categorize
  const categoryFolder = categorizeProblem(data.topicTags, data.title);
  
  // 2. Generate filename
  const filename = getJavaFilename(data.title);
  const repoFilePath = `${categoryFolder}/${filename}`;

  // 3. Format source code with standard metadata header
  const formattedCode = formatSolutionFile(
    {
      questionFrontendId: data.problemNumber,
      title: data.title,
      difficulty: data.difficulty,
      titleSlug: data.titleSlug
    },
    data.code
  );

  // 4. Check for duplicate or existing file on GitHub
  const existing = await fetchExistingFile(
    config.repoOwner,
    config.repoName,
    repoFilePath,
    config.branch || 'main',
    config.githubToken
  );

  if (existing.exists) {
    // Compare content normalized for whitespace/newlines
    const normalizedExisting = (existing.content || '').replace(/\r\n/g, '\n').trim();
    const normalizedNew = formattedCode.replace(/\r\n/g, '\n').trim();

    if (normalizedExisting === normalizedNew) {
      console.log(`[LeetSync Pro] Duplicate submission detected for ${repoFilePath}. Exact match found, skipping commit.`);
      await addSyncRecord({
        problemNumber: data.problemNumber,
        title: data.title,
        difficulty: data.difficulty,
        path: repoFilePath,
        status: 'SKIPPED_DUPLICATE',
        commitMessage: 'No changes detected'
      });

      return {
        success: true,
        skippedDuplicate: true,
        path: repoFilePath
      };
    }
  }

  // 5. Build standard commit message
  const commitMessage = buildCommitMessage(data.problemNumber, data.title, existing.exists);

  // 6. Commit to GitHub
  const commitResult = await commitFileToGitHub(
    config.repoOwner,
    config.repoName,
    repoFilePath,
    config.branch || 'main',
    config.githubToken,
    formattedCode,
    commitMessage,
    existing.sha
  );

  await addSyncRecord({
    problemNumber: data.problemNumber,
    title: data.title,
    difficulty: data.difficulty,
    path: repoFilePath,
    status: 'SYNCED',
    commitMessage: commitMessage,
    commitSha: commitResult?.commit?.sha || null
  });

  return {
    success: true,
    skippedDuplicate: false,
    path: repoFilePath,
    commitMessage: commitMessage,
    sha: commitResult?.commit?.sha
  };
}

/**
 * Message Dispatcher
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SYNC_SUBMISSION') {
    handleSyncSubmission(request.data)
      .then(res => sendResponse(res))
      .catch(err => {
        console.error('[LeetSync Pro] Background sync error:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep channel open for async response
  }

  if (request.action === 'TEST_GITHUB_CONNECTION') {
    const { token, owner, repo } = request.data;
    fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(async res => {
        if (res.ok) {
          const repoData = await res.json();
          sendResponse({
            success: true,
            repoName: repoData.full_name,
            private: repoData.private,
            defaultBranch: repoData.default_branch
          });
        } else {
          const err = await res.json().catch(() => ({}));
          sendResponse({
            success: false,
            error: `${res.status}: ${err.message || res.statusText}`
          });
        }
      })
      .catch(err => {
        sendResponse({ success: false, error: err.message });
      });
    return true;
  }
});
