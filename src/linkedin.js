const adSelectors = [
  '.ad', '.ads', '.ad-container', '.ad-banner', '.ad-wrapper',
  '[class*="advert"]', '[id*="advert"]', '[data-ad-type]',
  'iframe[src*="ads"]', 'iframe[src*="doubleclick"]', 'iframe[src*="adservice"]',
  '.social-widget', '[id*="social-plugin"]',
  '.popup', '.modal[data-ad]',
  '.video-ads', '.preroll-container'
];

function blockAds() {
  let blockedCount = 0;
  
  adSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(ad => {
      if (ad.style.display !== 'none') {
        ad.style.display = 'none';
        ad.setAttribute('data-adblocked', 'true');
        blockedCount++;
        
        chrome.runtime.sendMessage({
          type: "ad_blocked",
          url: window.location.href,
          selector: selector,
          elementType: ad.tagName
        });
      }
    });
  });

  document.querySelectorAll('script').forEach(script => {
    if (script.src && /ads|adservice|doubleclick|tracking|analytics/i.test(script.src)) {
      script.remove();
      blockedCount++;
    }
  });

  return blockedCount;
}

const observer = new MutationObserver(() => {
  blockAds();
});

function initAdBlock() {
  blockAds();
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdBlock);
} else {
  initAdBlock();
}