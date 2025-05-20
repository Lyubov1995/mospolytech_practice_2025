PHPWord
* {font-family: Arial; font-size: 11pt;}
a.NoteRef {text-decoration: none;}
hr {height: 1px; padding: 0; margin: 1em 0; border: 0; border-top: 1px solid #CCC;}
table {border: 1px solid black; border-spacing: 0px; width : 100%;}
td {border: 1px solid black;}
.Normal {margin-bottom: 8pt;}
h1 {font-family: 'Times New Roman'; font-size: 24pt; font-weight: bold;}
h2 {font-family: 'Times New Roman'; font-size: 18pt; font-weight: bold;}
h3 {font-size: 12pt; color: #1F4D78;}
.pw-post-body-paragraph {font-family: 'Times New Roman'; font-size: 12pt;}
.Strong {font-weight: bold;}
.Заголовок 1 Знак {font-family: 'Times New Roman'; font-size: 24pt; font-weight: bold;}
.Заголовок 2 Знак {font-family: 'Times New Roman'; font-size: 18pt; font-weight: bold;}
.qh {font-family: 'Times New Roman'; font-size: 12pt;}
.Emphasis {font-style: italic;}
.HTML Code {font-family: 'Courier New'; font-size: 10pt;}
.Hyperlink {color: #0000FF; text-decoration: underline ;}
.Заголовок 3 Знак {font-size: 12pt; color: #1F4D78;}
.header {margin-bottom: 0pt;}
.footer {margin-bottom: 0pt;}
.List Paragraph {margin-top: 0; margin-bottom: 0;}
Разработка собственный блокировщик рекламы для браузера на JavaScript.

Исследование предметной области:

Блокировщик рекламы — это программа или расширение браузера, которое предотвращает загрузку и отображение рекламы на веб-страницах. Они могут использовать различные методы для достижения этой цели.

Методы блокировки рекламы

Технологии и инструменты:

Есть проблемы, которые необходимо учитывать при разработке блокировщика. Первая проблема - обход блокировщиков. Рекламодатели разрабатывают методы обхода блокировщиков, например, через обфускацию кода. Это может существенно осложнить разработку. Вторая проблема - влияние блокировщика на производительность сайта. Блокировщики могут замедлять загрузку страниц, если они реализованы неэффективно. Поэтому нужно тщательно подойти к написанию кода

Руководство пользователя

Данное расширение будет работать только в браузерах на базе Chromium, например, Chrome, Brave, Opera, Microsoft Edge и т. д. Оно не будет работать в Firefox или Safari.

Чтобы все было совсем просто, наше расширение на самом деле не будет иметь всплывающего окна (маленького окна, которое появляется при нажатии на значок расширения) — оно просто будет работать в фоновом режиме.

Таким образом, нам действительно нужны всего 3 файла. Это: manifest.json, background.js и linkedin.js.

Шаг 1 – создание файла manifest.json

manifest.json – единственный необходимый файл, который нужен расширению. Он будет содержать метаданные о расширении, разрешения, необходимые для работы, и скрипт, который он должен запустить в фоновом режиме. Вот как это выглядит:

{

 "manifest\_version": 2,

 "name": "LinkedIn AdBlocker",

 "description": "Blocking ads.",

 "version": "0.0.1",

 "author": "&lt;AUTHOR\_NAME&gt;",

 "browser\_action": {

 "default\_title": "LinkedIn AdBlocker"

 },

 "permissions": \[

 "tabs",

 "webNavigation",

 "https://www.linkedin.com/"

 \],

 "background": {

 "scripts": \[

 "extension.js"

 \]

 }

 }

Помимо метаданных, манифест настраивает разрешения. Permissions определяет, что разрешено делать расширению, например, получать URL-адрес текущей страницы или добавлять JavaScript на веб-сайт. Когда публикуется расширение где-либо, например, в Chrome Web Store, браузер предложит обосновать каждое запрашиваемое разрешение, чтобы обеспечить безопасность и конфиденциальность пользователей.

Здесь же запрашивается разрешения для tabs и webNavigation для того, чтобы знать, когда посещается новый веб-сайт, а также что это за веб-сайт.

Шаг 2 – создание файла background.js

Background.js - определяет скрипты, которые должны запускаться при срабатывании определенных событий. Ключевое событие, которое большинство расширений прослушивают в той или иной степени, — это загрузка новой веб-страницы.

В данном случае мы будем отслеживать изменения навигации и получать URL-адрес каждого нового запрошенного веб-сайта.

Здесь мы настроим наш прослушиватель событий, который будет запускать действие каждый раз, когда пользователь загружает новую веб-страницу.

/\*Это событие срабатывает в начале загрузки страницы.

 В отличие от, например, webNavigation.onCompleted, оно происходит рано, давая нам возможность сразу приступить к удалению рекламы\*/

chrome.webNavigation.onCommitted.addListener(function (tab) {

 // Запрещает запуск скрипта во время загрузки других фреймов

 if (tab.frameId == 0) {

 chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs =&gt; {

 // Получает URL страницы

 let url = tabs\[0\].url;

 // Удаляет из URL необязательные определения протоколов и поддомен www

 let parsedUrl = url.replace("https://", "")

 .replace("http://", "")

 .replace("www.", "")

 // Удаляет путь и запросы, например linkedin.com/feed либо linkedin.com?query=value

 // Нам нужен только базовый домен

 let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))

 .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));

 try {

 if (domain.length &lt; 1 || domain === null || domain === undefined) {

 return;

 } else if (domain == "linkedin.com") {

 runLinkedinScript();

 return;

 }

 } catch (err) {

 throw err;

 }

 });

 }

});

function runLinkedinScript() {

 // Встраивает в страницу скрипт из файла

 chrome.tabs.executeScript({

 file: 'linkedin.js'

 });

 return true;

}

Шаг 3 – создание файла linkedin.js

linkedin.js - определяет, как на самом деле блокировать рекламу. Вот как это выглядит:

function removeAds() {

 // Получает все элементы 'span' на странице

 let spans = document.getElementsByTagName("span");

 for (let i = 0; i &lt; spans.length; ++i) {

 // Проверяет, содержат ли они текст 'Promoted'

 if (spans\[i\].innerHTML === "Promoted") {

 // Получает div, который обёртывает рекламную вставку

 let card = spans\[i\].closest(".feed-shared-update-v2");

 // если класс изменился, и мы не можем найти его при помощи closest(), получает 6-го предка

 if (card === null) {

 // Может также быть card.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode :D

              let j = 0;

 card = spans\[i\];

 while (j &lt; 6) {

 card = card.parentNode;

 ++j;

 }

 }

 // Удаляет рекламу!

 card.setAttribute("style", "display: none !important;");

 }

 }

}

removeAds();

// Обеспечивает, чтобы реклама удалялась по мере прокрутки страницы

setInterval(function () {

 removeAds();

}, 100)

Здесь мы перебираем все span элементы в поисках тех, которые содержат текст «Promoted», пытаемся получить div, который обтекает рекламу двумя разными способами, а затем избавляемся от него, устанавливая display: none;.

Чтобы найти правильного предка, мы сначала используем встроенный метод для HTML-элементов, называемый closest. Он будет перебирать предков нашего span, пока не найдет первого с классом feed-shared-update-v2.

Мы также используем простой способ, чтобы гарантировать удаление рекламы, которая динамически загружается по мере прокрутки страницы пользователем, запуская setInterval скрипт каждые 100 мс.

Шаг 4 - Добавление расширения в ваш браузер

Если вы правильно выполнили все шаги, у вас должен появиться новый значок в месте расположения ваших расширений, также в правом верхнем углу. Поскольку мы не задали для него значок, скорее всего, это будет буква «L» внутри квадрата.

Вот так выглядит браузер в режиме разработчика

Модификация блокировщика

Вы можете написать html – код, который задаст внешний вид блокировщика, а также выбрать ему иконку, которая будет отображаться в браузере.

Пример html-кода

&lt;!DOCTYPE html&gt;

&lt;html lang="ru"&gt;

&lt;head&gt;

 &lt;meta charset="UTF-8"&gt;

 &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;

 &lt;title&gt;AdBlocker&lt;/title&gt;

 &lt;style&gt;

 body {

 width: 300px;

 padding: 15px;

 font-family: Arial, sans-serif;

 margin: 0;

 }

 .status {

 display: flex;

 align-items: center;

 margin-bottom: 15px;

 justify-content: space-between;

 }

 .switch {

 position: relative;

 display: inline-block;

 width: 50px;

 height: 24px;

 }

 .switch input {

 opacity: 0;

 width: 0;

 height: 0;

 }

 .slider {

 position: absolute;

 cursor: pointer;

 top: 0;

 left: 0;

 right: 0;

 bottom: 0;

 background-color: #ccc;

 transition: .4s;

 border-radius: 24px;

 }

 .slider:before {

 position: absolute;

 content: "";

 height: 16px;

 width: 16px;

 left: 4px;

 bottom: 4px;

 background-color: white;

 transition: .4s;

 border-radius: 50%;

 }

 input:checked + .slider {

 background-color: #4CAF50;

 }

 input:checked + .slider:before {

 transform: translateX(26px);

 }

 .stats {

 display: grid;

 grid-template-columns: 1fr 1fr;

 gap: 10px;

 margin-bottom: 15px;

 }

 .stat {

 background: #f0f0f0;

 padding: 10px;

 border-radius: 5px;

 text-align: center;

 }

 .stat-value {

 font-size: 18px;

 font-weight: bold;

 color: #4CAF50;

 }

 .blocked-list {

 max-height: 200px;

 overflow-y: auto;

 border: 1px solid #eee;

 border-radius: 5px;

 padding: 10px;

 }

 .blocked-item {

 padding: 5px 0;

 border-bottom: 1px solid #f0f0f0;

 font-size: 12px;

 }

 .blocked-item:last-child {

 border-bottom: none;

 }

 &lt;/style&gt;

&lt;/head&gt;

&lt;body&gt;

 &lt;div class="status"&gt;

 &lt;h3 style="margin: 0;"&gt;AdBlocker&lt;/h3&gt;

 &lt;label class="switch"&gt;

 &lt;input type="checkbox" id="toggle" checked&gt;

 &lt;span class="slider"&gt;&lt;/span&gt;

 &lt;/label&gt;

 &lt;/div&gt;

 &lt;div class="stats"&gt;

 &lt;div class="stat"&gt;

 &lt;div class="stat-value" id="totalBlocked"&gt;0&lt;/div&gt;

 &lt;div&gt;Всего заблокировано&lt;/div&gt;

 &lt;/div&gt;

 &lt;div class="stat"&gt;

 &lt;div class="stat-value" id="todayBlocked"&gt;0&lt;/div&gt;

 &lt;div&gt;Сегодня&lt;/div&gt;

 &lt;/div&gt;

 &lt;/div&gt;

 &lt;h4 style="margin-bottom: 5px;"&gt;Последние блокировки:&lt;/h4&gt;

 &lt;div class="blocked-list" id="blockedItems"&gt;

 &lt;!-- Список будет заполняться динамически --&gt;

 &lt;/div&gt;

 &lt;script src="scriptHtml.js"&gt;&lt;/script&gt;

&lt;/body&gt;

&lt;/html&gt;

Вот так теперь будет выглядеть блокировщик.

![](data:image/png;base64,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
)

Чтобы подключить данный код, необходимо изменить файл manifest.json. Теперь он будет выглядеть так:

{

 "manifest\_version": 2,

 "name": "AdBlocker",

 "description": "Blocking ads.",

 "version": "0.0.1",

 "author": "Голданова Л.В.",

 "browser\_action": {

 "default\_title": "Блокировщик рекламы",

 "default\_icon": "icon.png",

 "default\_popup": "index.html"

 },

 "permissions": \[

 "activeTab",

 "webNavigation",

 "storage",

 "webRequest",

 "webRequestBlocking",

 "&lt;all\_urls&gt;"

 \],

 "background": {

 "scripts": \["background.js"\],

 "persistent": true

 },

 "content\_scripts": \[

 {

 "matches": \["&lt;all\_urls&gt;"\],

 "js": \["linkedin.js"\],

 "run\_at": "document\_end"

 }

 \]

}

Обратите внимание, что мы указали нашу html - страницу в строке "default\_popup": "index.html". чтобы добавить иконку, скачайте ее в интернете и пропишите строчку для ее добавления - "default\_icon": "icon.png".

Также необходимо добавить скрипт, который будет взаимодействовать и с html- страницей, и с основными js скриптами. Вы можете назвать его как хотите. Данный код будет считывать количество заблокированных реклам, а также указывать их url. Пример кода для представленной html-страницы:

document.addEventListener('DOMContentLoaded', function() {

 const toggle = document.getElementById('toggle');

 const totalBlockedEl = document.getElementById('totalBlocked');

 const todayBlockedEl = document.getElementById('todayBlocked');

 const blockedItemsEl = document.getElementById('blockedItems');

 // Загрузка состояния

 chrome.storage.local.get(\['enabled', 'stats'\], function(data) {

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

 stats.lastBlocked.filter(item =&gt;

 new Date(item.timestamp).toDateString() === today

 ).length : 0;

 todayBlockedEl.textContent = todayCount;

 // Обновление списка

 blockedItemsEl.innerHTML = '';

 if (stats.lastBlocked) {

 stats.lastBlocked.forEach(item =&gt; {

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

 chrome.tabs.reload(tabs\[0\].id);

 });

 });

 // Первоначальная загрузка

 chrome.runtime.sendMessage({type: "get\_stats"}, function(response) {

 updateStats(response);

 });

});

Также были модифицированы основные js – скрипты, к ним добавились новые функции:

1\) background.js

let stats = {

 totalBlocked: 0,

 lastBlocked: \[\],

 lastUpdated: Date.now()

};

// Инициализация хранилища

chrome.runtime.onInstalled.addListener(() =&gt; {

 chrome.storage.local.set({

 stats: stats,

 enabled: true

 });

});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =&gt; {

 if (request.type === "ad\_blocked") {

 chrome.storage.local.get(\['stats', 'enabled'\], (result) =&gt; {

 if (result.enabled !== false) {

 const currentStats = result.stats || stats;

 const updatedStats = {

 totalBlocked: currentStats.totalBlocked + 1,

 lastBlocked: \[{

 url: request.url,

 selector: request.selector,

 elementType: request.elementType,

 timestamp: Date.now()

 }, ...currentStats.lastBlocked.slice(0, 4)\],

 lastUpdated: Date.now()

 };

 chrome.storage.local.set({ stats: updatedStats }, () =&gt; {

 if (chrome.runtime.lastError) {

 console.error('Storage error:', chrome.runtime.lastError);

 }

 });

 }

 });

 }

 if (request.type === "get\_stats") {

 chrome.storage.local.get(\['stats'\], (result) =&gt; {

 sendResponse(result.stats || stats);

 });

 return true;

 }

});

chrome.webRequest.onBeforeRequest.addListener(

 (details) =&gt; {

 if (details.url.match(/ads|adservice|doubleclick|tracking|analytics/i)) {

 chrome.storage.local.get(\['enabled'\], (result) =&gt; {

 if (result.enabled !== false) {

 chrome.storage.local.get(\['stats'\], (res) =&gt; {

 const currentStats = res.stats || stats;

 const updatedStats = {

 totalBlocked: currentStats.totalBlocked + 1,

 lastBlocked: \[{

 url: details.url,

 type: 'network\_request',

 timestamp: Date.now()

 }, ...currentStats.lastBlocked.slice(0, 4)\],

 lastUpdated: Date.now()

 };

 chrome.storage.local.set({ stats: updatedStats });

 });

 return { cancel: true };

 }

 });

 }

 },

 { urls: \["&lt;all\_urls&gt;"\] },

 \["blocking"\]

);

2\) linkedin.js

const adSelectors = \[

 '.ad', '.ads', '.ad-container', '.ad-banner', '.ad-wrapper',

 '\[class\*="advert"\]', '\[id\*="advert"\]', '\[data-ad-type\]',

 'iframe\[src\*="ads"\]', 'iframe\[src\*="doubleclick"\]', 'iframe\[src\*="adservice"\]',

 '.social-widget', '\[id\*="social-plugin"\]',

 '.popup', '.modal\[data-ad\]',

 '.video-ads', '.preroll-container'

\];

function blockAds() {

 let blockedCount = 0;

 adSelectors.forEach(selector =&gt; {

 document.querySelectorAll(selector).forEach(ad =&gt; {

 if (ad.style.display !== 'none') {

 ad.style.display = 'none';

 ad.setAttribute('data-adblocked', 'true');

 blockedCount++;

 chrome.runtime.sendMessage({

 type: "ad\_blocked",

 url: window.location.href,

 selector: selector,

 elementType: ad.tagName

 });

 }

 });

 });

 document.querySelectorAll('script').forEach(script =&gt; {

 if (script.src &amp;&amp; /ads|adservice|doubleclick|tracking|analytics/i.test(script.src)) {

 script.remove();

 blockedCount++;

 }

 });

 return blockedCount;

}

const observer = new MutationObserver(() =&gt; {

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

После этого расширение было снова загружено в браузер. Новый модифицированный блокировщик готов к работе.