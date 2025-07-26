// Tech Stack Slider Functionality
class TechStackSlider {
    constructor() {
        this.slider = document.getElementById('techCategoriesSlider');
        this.prevBtn = document.getElementById('techSliderPrev');
        this.nextBtn = document.getElementById('techSliderNext');
        this.dots = document.getElementById('techSliderDots');
        
        this.currentSlide = 0;
        this.totalSlides = 4; // Number of tech categories
        this.slideWidth = 310; // Category width + gap
        
        this.init();
    }
    
    init() {
        if (!this.slider) return;
        
        this.bindEvents();
        this.updateSlider();
        this.updateControls();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Initialize based on screen size
        this.handleResize();
    }
    
    bindEvents() {
        // Previous button
        this.prevBtn?.addEventListener('click', () => {
            this.goToPrevSlide();
        });
        
        // Next button
        this.nextBtn?.addEventListener('click', () => {
            this.goToNextSlide();
        });
        
        // Dot navigation
        this.dots?.addEventListener('click', (e) => {
            if (e.target.classList.contains('tech-dot')) {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        this.slider.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.goToNextSlide();
                } else {
                    this.goToPrevSlide();
                }
            }
            
            isDragging = false;
        });
    }
    
    goToPrevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlider();
            this.updateControls();
        }
    }
    
    goToNextSlide() {
        const maxSlide = this.getMaxSlide();
        if (this.currentSlide < maxSlide) {
            this.currentSlide++;
            this.updateSlider();
            this.updateControls();
        }
    }
    
    goToSlide(index) {
        const maxSlide = this.getMaxSlide();
        this.currentSlide = Math.max(0, Math.min(index, maxSlide));
        this.updateSlider();
        this.updateControls();
    }
    
    getMaxSlide() {
        const containerWidth = this.slider.parentElement.offsetWidth;
        const visibleSlides = Math.floor(containerWidth / this.slideWidth);
        return Math.max(0, this.totalSlides - visibleSlides);
    }
    
    updateSlider() {
        if (window.innerWidth >= 1200) {
            // Desktop: Reset transform and show all categories
            this.slider.style.transform = 'translateX(0)';
            return;
        }
        
        // Mobile/Tablet: Use slider
        const translateX = -this.currentSlide * this.slideWidth;
        this.slider.style.transform = `translateX(${translateX}px)`;
    }
    
    updateControls() {
        if (window.innerWidth >= 1200) {
            // Hide controls on desktop
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
            this.dots.style.display = 'none';
            return;
        }
        
        // Show controls on mobile/tablet
        this.prevBtn.style.display = 'flex';
        this.nextBtn.style.display = 'flex';
        this.dots.style.display = 'flex';
        
        const maxSlide = this.getMaxSlide();
        
        // Update button states
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide >= maxSlide;
        
        // Update dots
        const dotElements = this.dots.querySelectorAll('.tech-dot');
        dotElements.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
            
            // Hide dots that are beyond max slide
            if (index > maxSlide) {
                dot.style.display = 'none';
            } else {
                dot.style.display = 'block';
            }
        });
    }
    
    handleResize() {
        // Adjust slide width based on screen size
        if (window.innerWidth <= 480) {
            this.slideWidth = 230; // Smaller width for mobile
        } else if (window.innerWidth <= 768) {
            this.slideWidth = 250; // Medium width for tablet
        } else {
            this.slideWidth = 310; // Default width
        }
        
        // Reset to first slide on resize
        this.currentSlide = 0;
        this.updateSlider();
        this.updateControls();
    }
}

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TechStackSlider();
});

// Handle theme changes (if needed)
document.addEventListener('themeChanged', () => {
    // Reinitialize if needed for theme changes
    setTimeout(() => {
        const slider = new TechStackSlider();
    }, 100);
});
