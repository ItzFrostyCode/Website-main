document.addEventListener('DOMContentLoaded', () => {
    /* Load External SVG Sprite */
    function loadSVGSprite() {
        fetch('creations/assets/svg/icons.svg')
            .then(response => response.text())
            .then(svgContent => {
                // Create a container for the SVG sprite and insert it into the document
                const div = document.createElement('div');
                div.innerHTML = svgContent;
                div.style.display = 'none';
                document.body.insertBefore(div, document.body.firstChild);
                
                // Trigger an event to let other parts of the code know the SVG is loaded
                document.dispatchEvent(new CustomEvent('svgSpriteLoaded'));
            })
            .catch(error => {
                console.error('Error loading SVG sprite:', error);
            });
    }

    // Load the SVG sprite immediately
    loadSVGSprite();

    /* Typing Effect for Hero Name */
    function typewriterEffect() {
        const heroNameElement = document.querySelector('.hero-name-main');
        if (!heroNameElement) return;

        const originalText = 'JOSHUA ARABEJO';
        let currentText = '';
        let index = 0;
        let isTyping = true;
        
        function typeNextCharacter() {
            if (isTyping) {
                // Typing phase
                if (index < originalText.length) {
                    currentText += originalText[index];
                    heroNameElement.textContent = currentText;
                    index++;
                    setTimeout(typeNextCharacter, 80);
                } else {
                    // Finished typing, wait then start erasing
                    isTyping = false;
                    setTimeout(typeNextCharacter, 2000); // Wait 2 seconds before erasing
                }
            } else {
                // Erasing phase
                if (currentText.length > 0) {
                    currentText = currentText.slice(0, -1);
                    heroNameElement.textContent = currentText;
                    setTimeout(typeNextCharacter, 50); // Faster erasing
                } else {
                    // Finished erasing, reset and start typing again
                    isTyping = true;
                    index = 0;
                    setTimeout(typeNextCharacter, 500); // Wait 0.5 seconds before typing again
                }
            }
        }
        
        // Start typing after initial delay
        setTimeout(typeNextCharacter, 900);
    }

    // Start the typing effect
    typewriterEffect();

    /* Theme Toggle with Animation & Debouncing */
    const lightModeToggle = document.getElementById('lightModeToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const hamburgerMenuBtn = document.getElementById('hamburgerMenuBtn');

    // Debug: Check if elements are found
    console.log('Theme toggle elements:', {
        lightModeToggle,
        darkModeToggle,
        body
    });

    // Debug: Test loading screen function directly
    window.testLoadingScreen = function() {
        console.log('Testing loading screen...');
        applyThemeWithTransition('light-mode');
    };

    // Debounce and animation variables
    let themeToggleDebounceTimer = null;
    let isThemeToggling = false;

    // Check for preferred color scheme on first load
    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Use system preference if no saved theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light-mode';
        }
        return 'dark-mode';
    }

    function updateToggleButtons(isLightMode, animate = true) {
        if (animate) {
            // Add animation classes
            const currentToggle = isLightMode ? darkModeToggle : lightModeToggle;
            const nextToggle = isLightMode ? lightModeToggle : darkModeToggle;
            
            currentToggle.classList.add('theme-toggle-exit');
            
            setTimeout(() => {
                currentToggle.classList.add('hidden');
                currentToggle.classList.remove('theme-toggle-exit');
                nextToggle.classList.remove('hidden');
                nextToggle.classList.add('theme-toggle-enter');
                
                setTimeout(() => {
                    nextToggle.classList.remove('theme-toggle-enter');
                }, 300);
            }, 150);
        } else {
            // Instant toggle without animation
            if (isLightMode) {
                lightModeToggle.classList.remove('hidden');
                darkModeToggle.classList.add('hidden');
            } else {
                lightModeToggle.classList.add('hidden');
                darkModeToggle.classList.remove('hidden');
            }
        }
    }

    function applyThemeWithTransition(theme) {
        console.log('Theme switch initiated:', theme); // Debug log
        if (isThemeToggling) return;
        
        isThemeToggling = true;
        
        // Create and show loading overlay with appropriate styling based on current theme
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'theme-loading-overlay';
        
        // Apply current theme class to overlay for proper styling
        if (body.classList.contains('light-mode')) {
            loadingOverlay.classList.add('current-light');
        }
        
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Switching to ${theme === 'light-mode' ? 'Light Mode' : 'Dark Mode'}...</div>
        `;
        
        document.body.appendChild(loadingOverlay);
        console.log('Loading overlay added to DOM'); // Debug log
        
        // Show loading overlay
        setTimeout(() => {
            loadingOverlay.classList.add('show');
            console.log('Loading overlay show class added'); // Debug log
        }, 10);
        
        // Apply theme change after loading screen is visible
        setTimeout(() => {
            if (theme === 'light-mode') {
                body.classList.add('light-mode');
            } else {
                body.classList.remove('light-mode');
            }
            
            localStorage.setItem('theme', theme);
            updateToggleButtons(theme === 'light-mode', true);
            
            // Hide loading overlay and clean up
            setTimeout(() => {
                loadingOverlay.classList.add('hide');
                loadingOverlay.classList.remove('show');
                
                setTimeout(() => {
                    if (loadingOverlay.parentNode) {
                        document.body.removeChild(loadingOverlay);
                    }
                    isThemeToggling = false;
                    console.log('Loading overlay removed and theme switch complete'); // Debug log
                }, 300);
            }, 800); // Show loading for 800ms to prevent spam clicking
        }, 300);
    }

    // Initialize theme on page load
    const preferredTheme = getPreferredTheme();
    if (preferredTheme === 'light-mode') {
        body.classList.add('light-mode');
        updateToggleButtons(true, false);
    } else {
        body.classList.remove('light-mode');
        updateToggleButtons(false, false);
    }
    localStorage.setItem('theme', preferredTheme);

    // Debounced theme toggle function with enhanced protection
    function debouncedThemeToggle(newTheme) {
        // Prevent multiple toggles while one is in progress
        if (isThemeToggling) return;
        
        // Clear any existing debounce timer
        if (themeToggleDebounceTimer) {
            clearTimeout(themeToggleDebounceTimer);
        }
        
        themeToggleDebounceTimer = setTimeout(() => {
            applyThemeWithTransition(newTheme);
        }, 150); // 150ms debounce for better UX
    }

    // Event listeners with enhanced debouncing and feedback
    darkModeToggle.addEventListener('click', (e) => {
        console.log('Dark mode toggle clicked'); // Debug log
        e.preventDefault();
        if (isThemeToggling) {
            console.log('Theme toggle ignored - already switching'); // Debug log
            // Optional: Add visual feedback that click was ignored
            darkModeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                darkModeToggle.style.transform = '';
            }, 100);
            return;
        }
        console.log('Initiating switch to light mode'); // Debug log
        debouncedThemeToggle('light-mode');
    });

    lightModeToggle.addEventListener('click', (e) => {
        console.log('Light mode toggle clicked'); // Debug log
        e.preventDefault();
        if (isThemeToggling) {
            console.log('Theme toggle ignored - already switching'); // Debug log
            // Optional: Add visual feedback that click was ignored
            lightModeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                lightModeToggle.style.transform = '';
            }, 100);
            return;
        }
        console.log('Initiating switch to dark mode'); // Debug log
        debouncedThemeToggle('dark-mode');
    });

    // Enhanced keyboard support for theme toggle
    [darkModeToggle, lightModeToggle].forEach(toggle => {
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isThemeToggling) {
                    // Provide accessibility feedback
                    toggle.setAttribute('aria-busy', 'true');
                    return;
                }
                
                const newTheme = toggle === darkModeToggle ? 'light-mode' : 'dark-mode';
                debouncedThemeToggle(newTheme);
            }
        });
    });

    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference recently
            const lastManualToggle = localStorage.getItem('lastManualToggle');
            const now = Date.now();
            
            if (!lastManualToggle || (now - parseInt(lastManualToggle)) > 300000) { // 5 minutes
                const newTheme = e.matches ? 'light-mode' : 'dark-mode';
                debouncedThemeToggle(newTheme);
            }
        });
    }

    // Track manual toggles
    [darkModeToggle, lightModeToggle].forEach(toggle => {
        toggle.addEventListener('click', () => {
            localStorage.setItem('lastManualToggle', Date.now().toString());
        });
    });

    // --- Search Bar Functionality ---
    const searchIcon = document.getElementById('searchIcon');
    const searchInputWrapper = document.querySelector('.search-input-wrapper');
    const searchInput = document.getElementById('searchInput');
    const closeSearchBtn = document.getElementById('closeSearchBtn');

    searchIcon.addEventListener('click', () => {
        searchIcon.classList.add('hidden'); // Hide the search magnifying glass icon
        searchInputWrapper.classList.add('active'); // Expand the search input field
        searchInput.focus(); // Focus the input field
    });

    closeSearchBtn.addEventListener('click', () => {
        searchInputWrapper.classList.remove('active'); // Collapse the search input field
        searchInput.value = ''; // Clear the input field
        searchIcon.classList.remove('hidden'); // Show the search magnifying glass icon again
    });

    // Optional: Hide search bar if user clicks outside of it
    document.addEventListener('click', (event) => {
        // Check if the click was outside the search icon and the search input wrapper
        if (!searchInputWrapper.contains(event.target) && !searchIcon.contains(event.target)) {
            if (searchInputWrapper.classList.contains('active')) {
                searchInputWrapper.classList.remove('active');
                searchInput.value = '';
                searchIcon.classList.remove('hidden');
            }
        }
    });

    // --- Desktop Creations Dropdown Toggle (Removed click handlers, now CSS hover) ---
    // The dropdown behavior for desktop is now handled purely by CSS :hover
    // The 'active' class and associated JS listeners for desktop dropdown are no longer needed.

    // --- Hamburger Menu Functionality ---
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
    const desktopNav = document.getElementById('header-nav-main'); // Reference to desktop nav
    const headerUtilitiesCta = document.getElementById('header-utilities-cta'); // Reference to utilities

    // Function to check screen width and toggle hamburger visibility
    const toggleHamburgerVisibility = () => {
        if (window.innerWidth <= 1024) {
            hamburgerMenuBtn.classList.remove('hidden'); // Show hamburger button
            desktopNav.style.display = 'none'; // Hide desktop nav
            headerUtilitiesCta.style.gap = '20px'; // Adjust gap for utilities on smaller screens
        } else {
            hamburgerMenuBtn.classList.add('hidden'); // Hide hamburger button
            desktopNav.style.display = 'flex'; // Show desktop nav
            headerUtilitiesCta.style.gap = '30px'; // Restore desktop gap
            // Ensure mobile nav is closed if resizing from mobile to desktop
            mobileNavMenu.classList.remove('is-open');
            body.classList.remove('no-scroll');
        }
    };

    // Initial check on load
    toggleHamburgerVisibility();

    // Re-check on window resize
    window.addEventListener('resize', toggleHamburgerVisibility);


    hamburgerMenuBtn.addEventListener('click', () => {
        mobileNavMenu.classList.add('is-open');
        body.classList.add('no-scroll'); // Prevent scrolling on body when menu is open
    });

    closeMobileNavBtn.addEventListener('click', () => {
        mobileNavMenu.classList.remove('is-open');
        body.classList.remove('no-scroll'); // Re-enable scrolling
    });

    // Close mobile menu when a link is clicked (optional, but good UX)
    mobileNavMenu.querySelectorAll('ul li a:not(.dropdown-toggle-mobile)').forEach(link => {
        link.addEventListener('click', () => {
            mobileNavMenu.classList.remove('is-open');
            body.classList.remove('no-scroll');
        });
    });


    // --- Mobile Creations Dropdown Toggle ---
    const creationsDropdownToggleMobile = document.getElementById('creationsDropdownToggleMobile');
    const creationsDropdownParentMobile = creationsDropdownToggleMobile.closest('.dropdown-mobile');

    creationsDropdownToggleMobile.addEventListener('click', (event) => {
        event.preventDefault();
        creationsDropdownParentMobile.classList.toggle('active');
    });

    // --- Active Navigation Link Logic ---
    const highlightActiveLink = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // Get current page filename

        // Desktop Navigation
        document.querySelectorAll('.header-nav-main ul li a').forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href').split('/').pop() || 'index.html';
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else if (currentPath.startsWith('creations/') && link.closest('.dropdown')) { // Check if it's a dropdown parent
                link.classList.add('active');
            }
        });

        // Mobile Navigation
        document.querySelectorAll('.mobile-nav-menu ul li a').forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href').split('/').pop() || 'index.html';
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else if (currentPath.startsWith('creations/') && link.closest('.dropdown-mobile')) { // Check if it's a dropdown parent
                link.classList.add('active');
            }
        });
    };

    // Call active link highlighter on load
    highlightActiveLink();

    /* ==================== MAP INITIALIZATION ==================== */
    function initializeMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        try {
            // Davao City coordinates
            const davaoLat = 7.1907;
            const davaoLng = 125.4553;

            // Initialize the map
            const map = L.map('map').setView([davaoLat, davaoLng], 12);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Custom marker icon
            const customIcon = L.divIcon({
                html: '<div style="background: linear-gradient(135deg, #ffc36a, #DD6B20); width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>',
                className: 'custom-div-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            // Add marker
            L.marker([davaoLat, davaoLng], { icon: customIcon })
                .addTo(map)
                .bindPopup('<b>📍 Davao City</b><br>Philippines')
                .openPopup();

            // Disable scroll zoom initially
            map.scrollWheelZoom.disable();

            // Enable scroll zoom on click
            map.on('click', function() {
                map.scrollWheelZoom.enable();
            });

            // Disable scroll zoom when mouse leaves
            map.on('mouseout', function() {
                map.scrollWheelZoom.disable();
            });

        } catch (error) {
            console.error('Error initializing map:', error);
            mapElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #ffc36a, #DD6B20); color: white; font-weight: 600;">📍 Davao City, Philippines</div>';
        }
    }

    /* ==================== HIRE ME BUTTON FUNCTIONALITY ==================== */
    function initializeHireMeButton() {
        const hireMeBtn = document.getElementById('hireMeBtn');
        const mobileHireMeBtn = document.getElementById('mobileHireMeBtn');
        const contactSection = document.getElementById('contact-section');

        function scrollToContact() {
            if (contactSection) {
                // Close mobile menu if it's open
                const mobileNavMenu = document.getElementById('mobileNavMenu');
                if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
                    mobileNavMenu.classList.remove('active');
                }

                // Smooth scroll to contact section
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });

                // Optional: Add a subtle animation to the contact section
                contactSection.style.transform = 'scale(1.01)';
                contactSection.style.transition = 'transform 0.3s ease';
                
                setTimeout(() => {
                    contactSection.style.transform = 'scale(1)';
                }, 300);

                // Focus on the first input field after scrolling
                setTimeout(() => {
                    const firstInput = contactSection.querySelector('input[type="text"]');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 800);
            }
        }

        // Desktop Hire Me button
        if (hireMeBtn) {
            hireMeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToContact();
            });
        }

        // Mobile Hire Me button
        if (mobileHireMeBtn) {
            mobileHireMeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToContact();
            });
        }
    }

    // Initialize Hire Me button
    initializeHireMeButton();

    /* ==================== CONTACT FORM FUNCTIONALITY ==================== */
    function initializeContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const budgetInput = document.getElementById('budget');
            const timelineInput = document.getElementById('timeline');
            const newsletterInput = document.getElementById('newsletter');
            const submitButton = contactForm.querySelector('.submit-button');

            // Validate required fields
            if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value || !messageInput.value.trim()) {
                showNotification('Please fill in all required fields (marked with *).', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<svg class="button-icon" style="animation: spin 1s linear infinite;"><use xlink:href="creations/assets/svg/icons.svg#icon-refresh"></use></svg> Sending...';
            submitButton.disabled = true;

            // Collect form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value,
                message: messageInput.value.trim(),
                budget: budgetInput.value || 'Not specified',
                timeline: timelineInput.value || 'Not specified',
                newsletter: newsletterInput.checked
            };

            // Log form data for debugging
            console.log('Form submission data:', formData);

            // Send email using EmailJS
            try {
                const emailResult = await sendContactEmail(formData);
                
                if (emailResult.success) {
                    // Success - email sent
                    const categoryText = subjectInput.options[subjectInput.selectedIndex].text;
                    showNotification(`Thank you ${formData.name}! Your ${categoryText.toLowerCase()} inquiry has been sent successfully to itzjoshuawayman@gmail.com. I'll get back to you soon!`, 'success');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Optional: Google Analytics or other tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'Contact',
                            'event_label': formData.subject
                        });
                    }
                } else {
                    // Error sending email
                    showNotification('Sorry, there was an error sending your message. Please try again or contact me directly at itzjoshuawayman@gmail.com.', 'error');
                }
            } catch (error) {
                console.error('Error sending email:', error);
                showNotification('Sorry, there was an error sending your message. Please try again or contact me directly at itzjoshuawayman@gmail.com.', 'error');
            } finally {
                // Restore button
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });

        // Add real-time validation feedback
        const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    // Field validation helper
    function validateField(field) {
        const value = field.value.trim();
        const isEmail = field.type === 'email';
        
        // Remove existing error styling
        field.classList.remove('error');
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            return false;
        }
        
        // Email validation
        if (isEmail && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                return false;
            }
        }
        
        return true;
    }

    /* ==================== NOTIFICATION SYSTEM ==================== */
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #48BB78, #38A169)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #F56565, #E53E3E)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #4299E1, #3182CE)';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    /* ==================== SCROLL ANIMATIONS ==================== */
    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });

        // Observe achievement cards
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
            observer.observe(card);
        });

        // Observe blog post cards
        const blogCards = document.querySelectorAll('.blog-post-card');
        blogCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    /* ==================== INITIALIZE ALL FEATURES ==================== */
    // Initialize map and contact form when page loads
    setTimeout(() => {
        initializeMap();
        initializeContactForm();
        initializeScrollAnimations();
    }, 500);
});

/* ==================== ADDITIONAL CSS ANIMATIONS ==================== */
// Add CSS for spinning animation
if (!document.querySelector('#spin-animation-style')) {
    const spinStyle = document.createElement('style');
    spinStyle.id = 'spin-animation-style';
    spinStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
}