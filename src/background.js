let stats = {
  totalBlocked: 0,
  lastBlocked: [],
  lastUpdated: Date.now()
};

// Инициализация хранилища
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 
    stats: stats,
    enabled: true 
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ad_blocked") {
    chrome.storage.local.get(['stats', 'enabled'], (result) => {
      if (result.enabled !== false) {
        const currentStats = result.stats || stats;
        const updatedStats = {
          totalBlocked: currentStats.totalBlocked + 1,
          lastBlocked: [{
            url: request.url,
            selector: request.selector,
            elementType: request.elementType,
            timestamp: Date.now()
          }, ...currentStats.lastBlocked.slice(0, 4)],
          lastUpdated: Date.now()
        };
        
        chrome.storage.local.set({ stats: updatedStats }, () => {
          if (chrome.runtime.lastError) {
            console.error('Storage error:', chrome.runtime.lastError);
          }
        });
      }
    });
  }

  if (request.type === "get_stats") {
    chrome.storage.local.get(['stats'], (result) => {
      sendResponse(result.stats || stats);
    });
    return true;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.url.match(/ads|adservice|doubleclick|tracking|analytics/i)) {
      chrome.storage.local.get(['enabled'], (result) => {
        if (result.enabled !== false) {
          chrome.storage.local.get(['stats'], (res) => {
            const currentStats = res.stats || stats;
            const updatedStats = {
              totalBlocked: currentStats.totalBlocked + 1,
              lastBlocked: [{
                url: details.url,
                type: 'network_request',
                timestamp: Date.now()
              }, ...currentStats.lastBlocked.slice(0, 4)],
              lastUpdated: Date.now()
            };
            chrome.storage.local.set({ stats: updatedStats });
          });
          return { cancel: true };
        }
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);