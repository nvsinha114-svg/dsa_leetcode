/**
 * Popup Script for LeetSync Pro
 */

document.addEventListener('DOMContentLoaded', async () => {
  const tokenInput = document.getElementById('githubToken');
  const toggleTokenBtn = document.getElementById('toggleTokenBtn');
  const ownerInput = document.getElementById('repoOwner');
  const repoInput = document.getElementById('repoName');
  const branchInput = document.getElementById('branch');
  const autoSyncCheckbox = document.getElementById('autoSync');
  const saveBtn = document.getElementById('saveBtn');
  const testBtn = document.getElementById('testBtn');
  const statusMessage = document.getElementById('statusMessage');
  const connectionBadge = document.getElementById('connectionBadge');
  const syncHistoryList = document.getElementById('syncHistoryList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  // 1. Load saved config
  chrome.storage.local.get({
    githubToken: '',
    repoOwner: 'nvsinha114-svg',
    repoName: 'dsa_leetcode',
    branch: 'main',
    autoSync: true,
    syncHistory: []
  }, (items) => {
    tokenInput.value = items.githubToken || '';
    ownerInput.value = items.repoOwner || 'nvsinha114-svg';
    repoInput.value = items.repoName || 'dsa_leetcode';
    branchInput.value = items.branch || 'main';
    autoSyncCheckbox.checked = items.autoSync !== false;

    if (items.githubToken) {
      updateBadge(true);
    } else {
      updateBadge(false);
    }

    renderHistory(items.syncHistory || []);
  });

  // 2. Toggle password visibility
  toggleTokenBtn.addEventListener('click', () => {
    if (tokenInput.type === 'password') {
      tokenInput.type = 'text';
      toggleTokenBtn.textContent = '🔒';
    } else {
      tokenInput.type = 'password';
      toggleTokenBtn.textContent = '👁️';
    }
  });

  // 3. Save Settings
  saveBtn.addEventListener('click', () => {
    const config = {
      githubToken: tokenInput.value.trim(),
      repoOwner: ownerInput.value.trim(),
      repoName: repoInput.value.trim(),
      branch: branchInput.value.trim() || 'main',
      autoSync: autoSyncCheckbox.checked
    };

    if (!config.githubToken) {
      showStatus('Please enter your GitHub Personal Access Token.', 'error');
      return;
    }

    chrome.storage.local.set(config, () => {
      showStatus('Settings saved successfully!', 'success');
      updateBadge(true);
    });
  });

  // 4. Test Connection
  testBtn.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    const owner = ownerInput.value.trim();
    const repo = repoInput.value.trim();

    if (!token || !owner || !repo) {
      showStatus('Please fill in Token, Owner, and Repository.', 'error');
      return;
    }

    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';
    showStatus('Connecting to GitHub API...', 'info');

    chrome.runtime.sendMessage({
      action: 'TEST_GITHUB_CONNECTION',
      data: { token, owner, repo }
    }, (res) => {
      testBtn.disabled = false;
      testBtn.textContent = 'Test Connection';

      if (res && res.success) {
        showStatus(`Connected to <b>${res.repoName}</b> (${res.private ? 'Private' : 'Public'}, branch: <i>${res.defaultBranch}</i>)`, 'success');
        updateBadge(true);
      } else {
        showStatus(`Connection failed: ${res?.error || 'Unknown error'}`, 'error');
        updateBadge(false);
      }
    });
  });

  // 5. Clear History
  clearHistoryBtn.addEventListener('click', () => {
    chrome.storage.local.set({ syncHistory: [] }, () => {
      renderHistory([]);
    });
  });

  function showStatus(msg, type) {
    statusMessage.innerHTML = msg;
    statusMessage.className = `status-box ${type}`;
    statusMessage.classList.remove('hidden');
  }

  function updateBadge(connected) {
    if (connected) {
      connectionBadge.textContent = 'Configured';
      connectionBadge.className = 'badge badge-connected';
    } else {
      connectionBadge.textContent = 'Not Configured';
      connectionBadge.className = 'badge badge-disconnected';
    }
  }

  function renderHistory(history) {
    if (!history || history.length === 0) {
      syncHistoryList.innerHTML = '<div class="empty-state">No submissions synced yet. Solve a LeetCode problem in Java and hit Submit!</div>';
      return;
    }

    syncHistoryList.innerHTML = history.slice(0, 10).map(item => {
      const isDuplicate = item.status === 'SKIPPED_DUPLICATE';
      const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="history-item ${isDuplicate ? 'skipped' : ''}">
          <div class="history-details">
            <span class="history-title">#${item.problemNumber} ${item.title}</span>
            <span class="history-meta">${item.path} &bull; ${timeStr}</span>
          </div>
          <span class="history-status ${isDuplicate ? 'duplicate' : 'synced'}">
            ${isDuplicate ? 'Up-to-date' : 'Synced'}
          </span>
        </div>
      `;
    }).join('');
  }
});
