// 3D Project Cards Touch Behavior for Mobile/Tablet
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Check if device is mobile/tablet
    const isMobileOrTablet = window.innerWidth <= 1024;
    
    if (isMobileOrTablet) {
        projectCards.forEach(card => {
            let isAnimating = false;
            
            card.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (isAnimating) return;
                
                isAnimating = true;
                
                // Add active class for 3D effect
                this.classList.add('card-active');
                
                // Remove the effect after 2 seconds
                setTimeout(() => {
                    this.classList.remove('card-active');
                    isAnimating = false;
                }, 2000);
            });
            
            // Prevent default touch behavior
            card.addEventListener('touchstart', function(e) {
                e.preventDefault();
            });
        });
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const projectCards = document.querySelectorAll('.project-card');
    const isMobileOrTablet = window.innerWidth <= 1024;
    
    if (!isMobileOrTablet) {
        // Remove any active states when switching to desktop
        projectCards.forEach(card => {
            card.classList.remove('card-active');
        });
    }
});
