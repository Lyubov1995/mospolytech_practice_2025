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



         document.addEventListener('DOMContentLoaded', function() {
            const width = Math.min(900, window.innerWidth - 40);
            const height = 600;
            const center = { x: width / 2, y: height / 2 };
            
            const problems = [
                {
                    id: "problem1",
                    name: "Шаблонность",
                    angle: Math.PI * 0.25,
                    distance: 180,
                    detail: "problem1-detail",
                    color: "#88d3ce"
                },
                {
                    id: "problem2",
                    name: "Сложность",
                    angle: Math.PI * 0.75,
                    distance: 180,
                    detail: "problem2-detail",
                    color: "#ff9a76"
                },
                {
                    id: "problem3",
                    name: "Невыразительность",
                    angle: Math.PI * 1.25,
                    distance: 180,
                    detail: "problem3-detail",
                    color: "#a18cd1"
                },
                {
                    id: "problem4",
                    name: "AI-барьер",
                    angle: Math.PI * 1.75,
                    distance: 180,
                    detail: "problem4-detail",
                    color: "#84fab0"
                }
            ];
            
            const svg = d3.select("#diagram")
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("preserveAspectRatio", "xMidYMid meet");
            
            // Создаем связи
            problems.forEach(problem => {
                svg.append("line")
                    .attr("class", "link")
                    .attr("x1", center.x)
                    .attr("y1", center.y)
                    .attr("x2", center.x + Math.cos(problem.angle) * problem.distance)
                    .attr("y2", center.y + Math.sin(problem.angle) * problem.distance);
            });
            
            // Центральный круг
            svg.append("circle")
                .attr("class", "central-circle")
                .attr("cx", center.x)
                .attr("cy", center.y)
                .attr("r", 80);
                
            svg.append("text")
                .attr("class", "central-text")
                .attr("x", center.x)
                .attr("y", center.y + 8)
                .text("Проблемы");
            
            // Создаем узлы проблем
            problems.forEach(problem => {
                const nodeGroup = svg.append("g")
                    .attr("class", "node")
                    .attr("id", problem.id)
                    .attr("transform", `translate(${center.x + Math.cos(problem.angle) * problem.distance}, ${center.y + Math.sin(problem.angle) * problem.distance})`);
                
                nodeGroup.append("circle")
                    .attr("class", "node-circle")
                    .attr("r", 60)
                    .attr("fill", problem.color);
                
                nodeGroup.append("text")
                    .attr("class", "node-text")
                    .attr("dy", 5)
                    .text(problem.name);
                
                // Обработчики событий
                nodeGroup.on("click", function() {
                    // Закрываем все открытые детали
                    document.querySelectorAll('.problem-detail').forEach(detail => {
                        detail.style.opacity = "0";
                        detail.style.pointerEvents = "none";
                        detail.style.transform = "scale(0.9)";
                    });
                    
                    // Убираем класс expanded у всех узлов
                    svg.selectAll('.node-circle').classed('expanded', false);
                    
                    // Показываем выбранную деталь
                    const detail = document.getElementById(problem.detail);
                    detail.style.opacity = "1";
                    detail.style.pointerEvents = "auto";
                    detail.style.transform = "scale(1)";
                    
                    // Позиционируем деталь
                    const xPos = center.x + Math.cos(problem.angle) * (problem.distance + 120);
                    const yPos = center.y + Math.sin(problem.angle) * (problem.distance + 120);
                    
                    detail.style.left = `${xPos - 150}px`;
                    detail.style.top = `${yPos - 100}px`;
                    
                    // Добавляем класс expanded к текущему узлу
                    d3.select(this).select('.node-circle').classed('expanded', true);
                });
            });
            
            // Закрытие деталей по кнопке
            document.querySelectorAll('.close-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const detail = this.closest('.problem-detail');
                    detail.style.opacity = "0";
                    detail.style.pointerEvents = "none";
                    detail.style.transform = "scale(0.9)";
                    
                    // Убираем класс expanded у всех узлов
                    svg.selectAll('.node-circle').classed('expanded', false);
                });
            });
            
            // Анимация при загрузке
            svg.selectAll(".link")
                .attr("stroke-dasharray", function() { return this.getTotalLength() + " " + this.getTotalLength(); })
                .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
                .transition()
                .duration(1000)
                .attr("stroke-dashoffset", 0);
        });