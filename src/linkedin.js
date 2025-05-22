const adSelectors = [
  // Основные рекламные селекторы
  '.ad', '.ads', '.ad-container', '.ad-banner', '.ad-wrapper', '.advertisement',
  // Более специфичные селекторы из вашего HTML
  '.banner-ad', '.sidebar-ad', '.popup-ad', '.native-ad', '.video-ad-container', '.text-ad',
  // Универсальные селекторы
  '[class*="ad-"]', '[id*="ad"]', '[id*="Ad"]', '[class*="advert"]', '[id*="advert"]', '[data-ad-type]',
  // iframe с рекламой
  'iframe[src*="ads"]', 'iframe[src*="doubleclick"]', 'iframe[src*="adservice"]',
  // Социальные виджеты
  '.social-widget', '[id*="social-plugin"]',
  // Всплывающие окна
  '.popup', '.modal[data-ad]', '#popupAd',
  // Видео реклама
  '.video-ads', '.preroll-container',
  // Рекламные метки
  '.ad-label', '.native-ad-label'
];

function blockAds() {
  let blockedCount = 0;
  
  adSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(ad => {
      if (!ad.hasAttribute('data-adblocked')) {
        // Полное удаление элемента вместо скрытия
        ad.remove();
        blockedCount++;
        
        // Отправка сообщения в фоновый скрипт
        try {
          chrome.runtime.sendMessage({
            type: "ad_blocked",
            url: window.location.href,
            selector: selector,
            elementType: ad.tagName,
            timestamp: Date.now()
          });
        } catch (e) {
          console.log('Extension context invalidated', e);
        }
      }
    });
  });

  // Блокировка рекламных скриптов
  document.querySelectorAll('script, iframe, img, embed').forEach(element => {
    const src = element.src || element.href || '';
    if (/ads|adservice|doubleclick|tracking|analytics|adfox|googleadservices|yandexadexchange/i.test(src)) {
      element.remove();
      blockedCount++;
    }
  });

  return blockedCount;
}

// Улучшенный MutationObserver для отслеживания динамической рекламы
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      blockAds();
    }
  });
});

function initAdBlock() {
  // Первоначальная блокировка
  const count = blockAds();
  console.log(`Blocked ${count} ads initially`);
  
  // Настройка наблюдателя
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'id', 'style']
  });
  
  // Дополнительная проверка через секунду на случай динамической загрузки
  setTimeout(blockAds, 1000);
}

// Запуск блокировщика
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initAdBlock();
} else {
  document.addEventListener('DOMContentLoaded', initAdBlock);
}

// Отслеживание pushState/replaceState для SPA
window.addEventListener('popstate', blockAds);
const originalPushState = history.pushState;
history.pushState = function() {
  originalPushState.apply(this, arguments);
  setTimeout(blockAds, 500);
};
const originalReplaceState = history.replaceState;
history.replaceState = function() {
  originalReplaceState.apply(this, arguments);
  setTimeout(blockAds, 500);
};