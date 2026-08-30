/**
 * Content Script for LeetCode
 * Coordinates between page interceptor, DOM observers, LeetCode GraphQL API, UI notification toast, and background service worker.
 */

(function () {
  'use strict';

  // Inject interceptor into main page context
  function injectInterceptor() {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('interceptor.js');
      script.onload = function () {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(script);
    } catch (e) {
      console.warn('[LeetSync Pro] Failed to inject interceptor script:', e);
    }
  }

  injectInterceptor();

  // Listen for messages from injected page interceptor
  window.addEventListener('message', async (event) => {
    if (event.source !== window || !event.data || event.data.source !== 'LEETSYNC_PAGE') {
      return;
    }

    if (event.data.type === 'LEETSYNC_SUBMISSION_ACCEPTED') {
      console.log('[LeetSync Pro] Received accepted submission notification:', event.data.payload);
      handleAcceptedSubmission(event.data.payload);
    }
  });

  // Extract problem slug from current window URL
  function getProblemSlug() {
    const match = window.location.pathname.match(/\/problems\/([^\/]+)/);
    return match ? match[1] : null;
  }

  // GraphQL query to fetch problem metadata
  async function fetchProblemMetadata(slug) {
    const query = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          titleSlug
          difficulty
          topicTags {
            name
            slug
          }
        }
      }
    `;

    try {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: { titleSlug: slug }
        })
      });

      const json = await res.json();
      return json?.data?.question || null;
    } catch (err) {
      console.error('[LeetSync Pro] Error fetching problem metadata:', err);
      return null;
    }
  }

  // GraphQL query to fetch submission code if not directly provided
  async function fetchSubmissionCode(submissionId) {
    const query = `
      query submissionDetails($submissionId: Int!) {
        submissionDetails(submissionId: $submissionId) {
          code
          runtime
          memory
          lang {
            name
            verboseName
          }
          question {
            questionId
            titleSlug
          }
        }
      }
    `;

    try {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: { submissionId: parseInt(submissionId, 10) }
        })
      });

      const json = await res.json();
      return json?.data?.submissionDetails?.code || null;
    } catch (err) {
      console.warn('[LeetSync Pro] Failed to fetch submission details GraphQL:', err);
      return null;
    }
  }

  // Fallback: extract code from Monaco editor in DOM if needed
  function getCodeFromMonacoEditor() {
    try {
      const monacoLines = document.querySelectorAll('.monaco-editor .view-line');
      if (monacoLines && monacoLines.length > 0) {
        return Array.from(monacoLines).map(line => line.textContent).join('\n');
      }
    } catch (e) {}
    return null;
  }

  // Floating Toast Notification
  function showToast(message, type = 'info', duration = 6000) {
    let toast = document.getElementById('leetsync-toast-container');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'leetsync-toast-container';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;
      document.body.appendChild(toast);
    }

    const item = document.createElement('div');
    const bgColors = {
      info: '#1e293b',
      success: '#065f46',
      warning: '#92400e',
      error: '#991b1b'
    };
    const borderColors = {
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };

    item.style.cssText = `
      background: ${bgColors[type] || bgColors.info};
      color: #ffffff;
      border-left: 4px solid ${borderColors[type] || borderColors.info};
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      font-size: 13.5px;
      line-height: 1.4;
      max-width: 380px;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    `;

    item.innerHTML = message;
    toast.appendChild(item);

    // Animate in
    requestAnimationFrame(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    });

    if (duration > 0) {
      setTimeout(() => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        setTimeout(() => item.remove(), 300);
      }, duration);
    }

    return item;
  }

  // Handle the accepted submission flow
  let isSyncing = false;
  async function handleAcceptedSubmission(payload) {
    if (isSyncing) {
      console.log('[LeetSync Pro] Sync already in progress, skipping redundant trigger');
      return;
    }
    isSyncing = true;

    const toastItem = showToast('🚀 <b>LeetSync:</b> Accepted submission detected! Preparing sync to GitHub...', 'info', 0);

    try {
      const slug = payload.titleSlug || getProblemSlug();
      if (!slug) {
        throw new Error('Could not determine problem title slug.');
      }

      // 1. Fetch metadata
      const meta = await fetchProblemMetadata(slug);
      if (!meta) {
        throw new Error(`Failed to load problem metadata for ${slug}`);
      }

      // 2. Fetch code
      let code = payload.code;
      if (!code && payload.submissionId) {
        code = await fetchSubmissionCode(payload.submissionId);
      }
      if (!code) {
        code = getCodeFromMonacoEditor();
      }

      if (!code || code.trim().length === 0) {
        throw new Error('Unable to retrieve accepted Java solution source code.');
      }

      // Send to background service worker for GitHub sync
      chrome.runtime.sendMessage(
        {
          action: 'SYNC_SUBMISSION',
          data: {
            problemNumber: meta.questionFrontendId || meta.questionId,
            title: meta.title,
            titleSlug: meta.titleSlug,
            difficulty: meta.difficulty,
            topicTags: meta.topicTags || [],
            code: code,
            lang: payload.lang || 'java',
            submissionId: payload.submissionId
          }
        },
        (response) => {
          if (toastItem) toastItem.remove();

          if (chrome.runtime.lastError) {
            showToast(`❌ <b>LeetSync Error:</b> ${chrome.runtime.lastError.message}`, 'error');
            return;
          }

          if (response && response.success) {
            if (response.skippedDuplicate) {
              showToast(`ℹ️ <b>LeetSync:</b> <code>${response.path}</code> is already up-to-date on GitHub. (No duplicate commit)`, 'info', 7000);
            } else {
              showToast(`✅ <b>LeetSync:</b> Successfully synced <code>${response.path}</code> to GitHub!<br><span style="font-size:11px; opacity:0.8;">Commit: ${response.commitMessage}</span>`, 'success', 8000);
            }
          } else {
            const errorMsg = response?.error || 'Unknown error occurred during sync.';
            showToast(`❌ <b>LeetSync Failed:</b> ${errorMsg}`, 'error', 9000);
          }
        }
      );
    } catch (err) {
      if (toastItem) toastItem.remove();
      console.error('[LeetSync Pro] Sync error:', err);
      showToast(`❌ <b>LeetSync Error:</b> ${err.message}`, 'error', 9000);
    } finally {
      setTimeout(() => {
        isSyncing = false;
      }, 3000);
    }
  }
})();
