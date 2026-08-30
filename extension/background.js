/**
 * Background Service Worker for LeetSync Pro
 * Handles GitHub REST API commits, duplicate checking, and state storage.
 */

importScripts('categorizer.js', 'formatter.js');

console.log('[LeetSync] Service worker initialized');

const DEFAULT_CONFIG = {
  githubToken: '',
  repoOwner: 'nvsinha114-svg',
  repoName: 'dsa_leetcode',
  branch: 'main',
  autoSync: true
};

// Safe UTF-8 to Base64 encoder
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

// Get user configuration from storage with sanitization
async function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get(DEFAULT_CONFIG, (items) => {
      resolve({
        githubToken: (items.githubToken || '').trim(),
        repoOwner: (items.repoOwner || 'nvsinha114-svg').trim().replace(/^\/+|\/+$/g, ''),
        repoName: (items.repoName || 'dsa_leetcode').trim().replace(/^\/+|\/+$/g, ''),
        branch: (items.branch || 'main').trim(),
        autoSync: items.autoSync !== false
      });
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
      const trimmed = history.slice(0, 50);
      chrome.storage.local.set({ syncHistory: trimmed }, () => {
        resolve();
      });
    });
  });
}

/**
 * Checks if a file exists on GitHub and returns its SHA and decoded content.
 * HTTP 404 indicates the file does not exist yet (normal/expected for new solutions).
 */
async function fetchExistingFile(owner, repo, path, branch, token) {
  console.log(`[LeetSync] Checking existing file... (${path})`);
  const branchParam = branch ? `?ref=${encodeURIComponent(branch)}` : '';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}${branchParam}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (response.status === 200) {
    const data = await response.json();
    let decodedContent = '';
    if (data.content) {
      decodedContent = base64ToUtf8(data.content);
    }
    console.log(`[LeetSync] File exists on GitHub (SHA: ${data.sha})`);
    return {
      exists: true,
      sha: data.sha,
      content: decodedContent
    };
  }

  if (response.status === 404) {
    console.log(`[LeetSync] File does not exist (404), creating new file...`);
    return {
      exists: false,
      sha: null,
      content: null
    };
  }

  if (response.status === 401) {
    throw new Error('Invalid or expired GitHub Personal Access Token (401 Unauthorized). Please check your token in the extension popup.');
  }

  if (response.status === 403) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`GitHub permission or rate limit error (403 Forbidden): ${errData.message || 'Check token scopes'}`);
  }

  const errData = await response.json().catch(() => ({}));
  throw new Error(`GitHub API error checking file (${response.status}): ${errData.message || response.statusText}`);
}

/**
 * Puts file to GitHub repository using REST API.
 */
async function commitFileToGitHub(owner, repo, path, branch, token, contentStr, commitMessage, existingSha) {
  console.log(`[LeetSync] Creating file on GitHub... (${path})`);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
  
  const body = {
    message: commitMessage,
    content: utf8ToBase64(contentStr)
  };

  if (branch) {
    body.branch = branch;
  }

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
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        body: JSON.stringify(body)
      });

      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
        console.log(`[LeetSync] GitHub file created successfully: ${path}`);
        return result;
      }

      if (response.status === 401) {
        throw new Error('Invalid or expired GitHub Personal Access Token (401 Unauthorized).');
      }

      if (response.status === 403) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`GitHub permission error (403 Forbidden): ${errData.message || 'Ensure PAT has repo permissions.'}`);
      }

      if (response.status === 404) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`GitHub repository '${owner}/${repo}' or branch '${branch}' not found (404 Not Found). Ensure the repository exists and your PAT has repo permissions.`);
      }

      if (response.status === 409) {
        console.warn('[LeetSync] Conflict (409) committing file, refetching latest SHA...');
        const refetched = await fetchExistingFile(owner, repo, path, branch, token);
        if (refetched.sha) {
          body.sha = refetched.sha;
        }
      }

      const errData = await response.json().catch(() => ({}));
      throw new Error(`GitHub API error (${response.status}): ${errData.message || response.statusText}`);
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        console.log(`[LeetSync] Retrying GitHub commit (attempt ${attempt + 1}/${maxRetries})...`);
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
  console.log(`[LeetSync] Processing submission: #${data.problemNumber} ${data.title}`);
  const config = await getConfig();

  if (!config.githubToken) {
    throw new Error('GitHub Personal Access Token is missing. Please configure it in the LeetSync extension popup.');
  }
  if (!config.repoOwner || !config.repoName) {
    throw new Error('Target repository is not configured. Please set owner and repo name.');
  }

  // 1. Categorize
  const categoryFolder = categorizeProblem(data.topicTags, data.title);
  console.log(`[LeetSync] Categorized into folder: ${categoryFolder}`);
  
  // 2. Generate filename
  const filename = getJavaFilename(data.title);
  const repoFilePath = `${categoryFolder}/${filename}`;
  console.log(`[LeetSync] Target path: ${repoFilePath}`);

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
    const normalizedExisting = (existing.content || '').replace(/\r\n/g, '\n').trim();
    const normalizedNew = formattedCode.replace(/\r\n/g, '\n').trim();

    if (normalizedExisting === normalizedNew) {
      console.log(`[LeetSync] Duplicate submission detected for ${repoFilePath}. Skipping commit.`);
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
  console.log(`[LeetSync] Prepared commit message: "${commitMessage}"`);

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
        console.error('[LeetSync] Background sync error:', err.message);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep message channel open for async sendResponse
  }

  if (request.action === 'TEST_GITHUB_CONNECTION') {
    const { token, owner, repo } = request.data;
    fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
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
    return true; // Keep message channel open
  }
});
