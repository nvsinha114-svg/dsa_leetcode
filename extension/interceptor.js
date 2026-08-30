/**
 * LeetSync Pro - Main World Network Interceptor
 * Runs in the page's MAIN execution context to hook fetch and XMLHttpRequest.
 * Detects only ACCEPTED submissions (status_code 10) and notifies content script.
 */

(function () {
  'use strict';

  if (window.__LEETSYNC_INTERCEPTOR_ACTIVE__) return;
  window.__LEETSYNC_INTERCEPTOR_ACTIVE__ = true;

  console.log('[LeetSync] Interceptor injected');

  // Helper to dispatch event to content script via both CustomEvent and postMessage
  function emitAcceptedEvent(payload) {
    console.log('[LeetSync] Accepted submission detected', payload);
    
    // 1. Dispatch CustomEvent on document (fast, direct, secure bridge)
    try {
      const event = new CustomEvent('LEETSYNC_SUBMISSION_ACCEPTED', {
        detail: payload
      });
      document.dispatchEvent(event);
    } catch (e) {
      console.warn('[LeetSync] CustomEvent dispatch error:', e);
    }

    // 2. Window postMessage fallback
    try {
      window.postMessage({
        type: 'LEETSYNC_SUBMISSION_ACCEPTED',
        source: 'LEETSYNC_PAGE',
        payload: payload
      }, '*');
    } catch (e) {
      console.warn('[LeetSync] postMessage dispatch error:', e);
    }
  }

  // Intercept Fetch API
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    try {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
      
      // Check for LeetCode submission check polling endpoint
      if (url.includes('/submissions/detail/') && url.includes('/check/')) {
        const clone = response.clone();
        clone.json().then(data => {
          handleSubmissionCheck(data, url);
        }).catch(() => {});
      } else if (url.includes('/graphql') && args[1] && args[1].body) {
        // Check for GraphQL submission result queries
        try {
          const bodyStr = typeof args[1].body === 'string' ? args[1].body : '';
          if (
            bodyStr.includes('submissionDetails') || 
            bodyStr.includes('submissionStatus') || 
            bodyStr.includes('submitCode')
          ) {
            const clone = response.clone();
            clone.json().then(data => {
              handleGraphQLSubmission(data);
            }).catch(() => {});
          }
        } catch (e) {}
      }
    } catch (err) {
      console.warn('[LeetSync] Fetch intercept warning:', err);
    }
    return response;
  };

  // Intercept XMLHttpRequest
  const originalXHR = window.XMLHttpRequest;
  const originalOpen = originalXHR.prototype.open;
  const originalSend = originalXHR.prototype.send;

  originalXHR.prototype.open = function (method, url, ...rest) {
    this._url = url;
    return originalOpen.apply(this, [method, url, ...rest]);
  };

  originalXHR.prototype.send = function (...args) {
    this.addEventListener('load', function () {
      try {
        if (this._url && this._url.includes('/submissions/detail/') && this._url.includes('/check/')) {
          const data = JSON.parse(this.responseText);
          handleSubmissionCheck(data, this._url);
        }
      } catch (e) {}
    });
    return originalSend.apply(this, args);
  };

  function handleSubmissionCheck(data, url) {
    if (!data) return;
    
    // Check if submission finished processing
    if (data.state === 'SUCCESS') {
      console.log('[LeetSync] Submission detected');
      console.log(`[LeetSync] Submission status: ${data.status_code} (${data.status_msg || data.status_display || ''})`);
      
      // ONLY trigger synchronization when status is ACCEPTED (status code 10)
      const isAccepted = data.status_code === 10 || 
                         data.status_msg === 'Accepted' || 
                         (data.status_display && data.status_display.toLowerCase() === 'accepted');
      
      if (isAccepted) {
        let submissionId = data.submission_id;
        if (!submissionId && url) {
          const match = url.match(/\/submissions\/detail\/(\d+)\/check/);
          if (match) submissionId = match[1];
        }

        emitAcceptedEvent({
          submissionId: submissionId,
          lang: data.lang || 'java',
          runtime: data.status_runtime || data.runtime || '',
          memory: data.status_memory || data.memory || '',
          code: data.code || null,
          questionId: data.question_id || null,
          statusCode: data.status_code || 10
        });
      } else {
        console.log(`[LeetSync] Submission not accepted (status ${data.status_code}), skipping sync.`);
      }
    }
  }

  function handleGraphQLSubmission(data) {
    if (!data || !data.data) return;
    
    const details = data.data.submissionDetails;
    if (details) {
      console.log('[LeetSync] Submission detected');
      const statusCode = details.statusCode || (details.statusDisplay === 'Accepted' ? 10 : 0);
      console.log(`[LeetSync] Submission status: ${statusCode} (${details.statusDisplay || ''})`);

      // ONLY trigger synchronization when status is ACCEPTED (status code 10)
      if (statusCode === 10 || (details.statusDisplay && details.statusDisplay.toLowerCase() === 'accepted')) {
        emitAcceptedEvent({
          submissionId: details.id,
          lang: details.lang ? (details.lang.name || details.lang) : 'java',
          runtime: details.runtimeDisplay || details.runtime || '',
          memory: details.memoryDisplay || details.memory || '',
          code: details.code || null,
          questionId: details.question ? details.question.questionId : null,
          titleSlug: details.question ? details.question.titleSlug : null,
          statusCode: 10
        });
      } else {
        console.log(`[LeetSync] Submission not accepted (status ${statusCode}), skipping sync.`);
      }
    }
  }
})();
