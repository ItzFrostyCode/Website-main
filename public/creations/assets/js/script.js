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

    /* Theme Toggle */
    const lightModeToggle = document.getElementById('lightModeToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const hamburgerMenuBtn = document.getElementById('hamburgerMenuBtn');

    const currentTheme = localStorage.getItem('theme');

    function updateToggleButtons(isLightMode) {
        if (isLightMode) {
            lightModeToggle.classList.remove('hidden');
            darkModeToggle.classList.add('hidden');
        } else {
            lightModeToggle.classList.add('hidden');
            darkModeToggle.classList.remove('hidden');
        }
    }

    if (currentTheme === 'light-mode') {
        body.classList.add('light-mode');
        updateToggleButtons(true);
    } else {
        body.classList.remove('light-mode');
        updateToggleButtons(false);
        localStorage.setItem('theme', 'dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {    
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
        updateToggleButtons(true);
    });

    lightModeToggle.addEventListener('click', () => {
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark-mode');
        updateToggleButtons(false);
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
});