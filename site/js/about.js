 // Инициализация подсветки кода
        document.addEventListener('DOMContentLoaded', function() {
            hljs.highlightAll();
            
            // Обработчики для аккордеона технологий
            const techItems = document.querySelectorAll('.tech-item');
            techItems.forEach(item => {
                const header = item.querySelector('.tech-header');
                header.addEventListener('click', () => {
                    // Закрываем все открытые элементы
                    techItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Открываем/закрываем текущий элемент
                    item.classList.toggle('active');
                    
                    // Если элемент открывается - показываем соответствующий код
                    if (item.classList.contains('active')) {
                        const tech = item.getAttribute('data-tech');
                        showTechCode(tech);
                    }
                });
            });
            
            // Переключение между вкладками с кодом
            const codeTabs = document.querySelectorAll('.code-tab');
            codeTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const lang = tab.getAttribute('data-lang');
                    
                    // Удаляем активный класс у всех вкладок
                    codeTabs.forEach(t => t.classList.remove('active'));
                    
                    // Добавляем активный класс текущей вкладке
                    tab.classList.add('active');
                    
                    // Находим активную технологию
                    const activeTech = document.querySelector('.tech-item.active').getAttribute('data-tech');
                    
                    // Показываем код для выбранного языка и технологии
                    showTechCode(activeTech, lang);
                });
            });
            
            // Функция для отображения кода соответствующей технологии
            function showTechCode(tech, lang = 'python') {
                // Скрываем весь код
                document.querySelectorAll('.code-content').forEach(c => c.classList.remove('active'));
                
                // Показываем код для выбранной технологии
                const codeContents = document.querySelectorAll(`.code-content[data-tech="${tech}"]`);
                
                // Обновляем заголовок
                const techName = document.querySelector(`.tech-item[data-tech="${tech}"] h3`).textContent;
                document.getElementById('current-tech').textContent = techName;
                
                // Если есть код для выбранного языка - показываем его
                let found = false;
                codeContents.forEach(content => {
                    if (content.querySelector(`.language-${lang}`)) {
                        content.classList.add('active');
                        found = true;
                    }
                });
                
                // Если не нашли код для выбранного языка - показываем первый доступный
                if (!found && codeContents.length > 0) {
                    codeContents[0].classList.add('active');
                }
                
                // Переинициализируем подсветку синтаксиса
                hljs.highlightAll();
            }
        });