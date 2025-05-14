  document.addEventListener('DOMContentLoaded', function() {
            const slider = document.getElementById('teamSlider');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const cardWidth = document.querySelector('.member-card').offsetWidth + 30; 
            
            nextBtn.addEventListener('click', function() {
                slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });
            
            prevBtn.addEventListener('click', function() {
                slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
            
            let isDown = false;
            let startX;
            let scrollLeft;
            
            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });
            
            slider.addEventListener('mouseleave', () => {
                isDown = false;
            });
            
            slider.addEventListener('mouseup', () => {
                isDown = false;
            });
            
            slider.addEventListener('mousemove', (e) => {
                if(!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2;
                slider.scrollLeft = scrollLeft - walk;
            });
        });