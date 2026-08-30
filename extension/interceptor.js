/**
 * Injected Page Script (runs in the context of leetcode.com)
 * Intercepts submission requests and response payloads to catch "Accepted" solutions immediately.
 */

(function () {
  'use strict';

  // Prevent duplicate injection
  if (window.__LEETSYNC_INTERCEPTOR_ACTIVE__) return;
  window.__LEETSYNC_INTERCEPTOR_ACTIVE__ = true;

  console.log('[LeetSync Pro] Network Interceptor active on LeetCode');

  // Intercept Fetch API
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    try {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
      
      // Check for submission check polling endpoints
      if (url.includes('/submissions/detail/') && url.includes('/check/')) {
        const clone = response.clone();
        clone.json().then(data => {
          handleSubmissionCheck(data, url);
        }).catch(() => {});
      } else if (url.includes('/graphql') && args[1] && args[1].body) {
        // Check for GraphQL submission result queries
        try {
          const bodyStr = typeof args[1].body === 'string' ? args[1].body : '';
          if (bodyStr.includes('submissionDetails') || bodyStr.includes('submissionStatus') || bodyStr.includes('submitCode')) {
            const clone = response.clone();
            clone.json().then(data => {
              handleGraphQLSubmission(data);
            }).catch(() => {});
          }
        } catch (e) {}
      }
    } catch (err) {
      console.warn('[LeetSync Pro] Fetch intercept warning:', err);
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
    
    // Check if submission check is finished
    if (data.state === 'SUCCESS') {
      // Check if accepted: status_code 10 is Accepted, or status_msg === "Accepted"
      const isAccepted = data.status_code === 10 || data.status_msg === 'Accepted' || (data.status_display && data.status_display.toLowerCase() === 'accepted');
      
      if (isAccepted) {
        console.log('[LeetSync Pro] Accepted submission detected via Check API!', data);
        
        let submissionId = data.submission_id;
        if (!submissionId && url) {
          const match = url.match(/\/submissions\/detail\/(\d+)\/check/);
          if (match) submissionId = match[1];
        }

        window.postMessage({
          type: 'LEETSYNC_SUBMISSION_ACCEPTED',
          source: 'LEETSYNC_PAGE',
          payload: {
            submissionId: submissionId,
            lang: data.lang || 'java',
            runtime: data.status_runtime || data.runtime || '',
            memory: data.status_memory || data.memory || '',
            code: data.code || null,
            questionId: data.question_id || null,
            statusCode: data.status_code
          }
        }, '*');
      }
    }
  }

  function handleGraphQLSubmission(data) {
    if (!data || !data.data) return;
    
    const details = data.data.submissionDetails;
    if (details && (details.statusCode === 10 || (details.statusDisplay && details.statusDisplay.toLowerCase() === 'accepted'))) {
      console.log('[LeetSync Pro] Accepted submission detected via GraphQL!', details);
      window.postMessage({
        type: 'LEETSYNC_SUBMISSION_ACCEPTED',
        source: 'LEETSYNC_PAGE',
        payload: {
          submissionId: details.id,
          lang: details.lang ? (details.lang.name || details.lang) : 'java',
          runtime: details.runtimeDisplay || details.runtime || '',
          memory: details.memoryDisplay || details.memory || '',
          code: details.code || null,
          questionId: details.question ? details.question.questionId : null,
          titleSlug: details.question ? details.question.titleSlug : null
        }
      }, '*');
    }
  }
})();
