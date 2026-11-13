'use strict';

(() => {
  const keyInput = document.querySelector('#fp-api-key');
  const identifyButton = document.querySelector('#fp-identify');
  const status = document.querySelector('#fp-status');
  const resultBox = document.querySelector('#fp-result');
  const compareInput = document.querySelector('#fp-compare');
  const compareResult = document.querySelector('#fp-compare-result');
  let agentPromise;
  let currentVisitorId = '';

  function showStatus(message, isError = false) {
    status.textContent = message;
    status.style.color = isError ? '#a06e2e' : '';
  }

  function updateComparison() {
    const other = compareInput.value.trim();
    if (!currentVisitorId || !other) {
      compareResult.textContent = '等待兩組 ID';
      compareResult.style.color = '';
      return;
    }
    const same = currentVisitorId === other;
    compareResult.textContent = same ? '相同 visitor ID' : '不同 visitor ID';
    compareResult.style.color = same ? '#24754e' : '#a06e2e';
  }

  async function loadAgent(publicKey) {
    if (!agentPromise) {
      const agentUrl = `https://fpjscdn.net/v4/${encodeURIComponent(publicKey)}`;
      agentPromise = import(agentUrl).then((Fingerprint) => Fingerprint.start());
    }
    return agentPromise;
  }

  identifyButton.addEventListener('click', async () => {
    const publicKey = keyInput.value.trim();
    if (!publicKey) {
      showStatus('請先貼上 Fingerprint public API key。', true);
      keyInput.focus();
      return;
    }

    identifyButton.disabled = true;
    resultBox.hidden = true;
    showStatus('正在呼叫 Fingerprint…');
    try {
      const agent = await loadAgent(publicKey);
      const result = await agent.get();
      if (!result?.visitorId && !result?.visitor_id) {
        throw new Error('回應中沒有 visitor ID；請確認目前環境是否啟用 Zero Trust Mode。');
      }

      currentVisitorId = result.visitorId || result.visitor_id;
      resultBox.replaceChildren();
      const label = document.createElement('strong');
      label.textContent = 'Visitor ID  ';
      const value = document.createElement('code');
      value.textContent = currentVisitorId;
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.textContent = '複製 ID';
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(currentVisitorId);
          showStatus('已複製 Visitor ID。');
        } catch {
          showStatus('瀏覽器未允許剪貼簿存取，請手動選取 ID 複製。', true);
        }
      });
      resultBox.append(label, value, document.createTextNode('  '), copy);
      resultBox.hidden = false;
      showStatus(`識別完成${result.event_id || result.eventId ? ` · Event ID ${result.event_id || result.eventId}` : ''}。`);
      updateComparison();
    } catch (error) {
      agentPromise = undefined;
      showStatus(`識別失敗：${error?.message || String(error)}`, true);
    } finally {
      identifyButton.disabled = false;
    }
  });

  compareInput.addEventListener('input', updateComparison);
  keyInput.addEventListener('input', () => {
    agentPromise = undefined;
    currentVisitorId = '';
    resultBox.hidden = true;
    updateComparison();
  });
})();
