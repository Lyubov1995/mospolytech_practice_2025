document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('toggle');
  const totalBlockedEl = document.getElementById('totalBlocked');
  const todayBlockedEl = document.getElementById('todayBlocked');
  const blockedItemsEl = document.getElementById('blockedItems');

  // Загрузка состояния
  chrome.storage.local.get(['enabled', 'stats'], function(data) {
    toggle.checked = data.enabled !== false;
    updateStats(data.stats);
  });

  // Обновление статистики
  function updateStats(stats) {
    if (!stats) return;
    
    totalBlockedEl.textContent = stats.totalBlocked || 0;
    
    // Подсчет блокировок за сегодня
    const today = new Date().toDateString();
    const todayCount = stats.lastBlocked ? 
      stats.lastBlocked.filter(item => 
        new Date(item.timestamp).toDateString() === today
      ).length : 0;
    todayBlockedEl.textContent = todayCount;
    
    // Обновление списка
    blockedItemsEl.innerHTML = '';
    if (stats.lastBlocked) {
      stats.lastBlocked.forEach(item => {
        const div = document.createElement('div');
        div.className = 'blocked-item';
        div.textContent = `${item.url} (${item.selector || item.type})`;
        blockedItemsEl.appendChild(div);
      });
    }
  }

  // Слушаем изменения хранилища
  chrome.storage.onChanged.addListener(function(changes) {
    if (changes.stats) {
      updateStats(changes.stats.newValue);
    }
  });

  // Переключение
  toggle.addEventListener('change', function() {
    chrome.storage.local.set({ enabled: this.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  });

  // Первоначальная загрузка
  chrome.runtime.sendMessage({type: "get_stats"}, function(response) {
    updateStats(response);
  });
});