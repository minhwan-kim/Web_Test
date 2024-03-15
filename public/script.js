document.addEventListener("DOMContentLoaded", () => {
    const projects = document.querySelectorAll('.project');
    const listItems = document.querySelectorAll('.list .tile');
    const filterButtons = document.querySelectorAll('.filterButton');
    const imageCountDisplay = document.getElementById('imageCountDisplay');
    const leftOverlay = document.querySelector('.cursor-overlay.left');
    const rightOverlay = document.querySelector('.cursor-overlay.right');
    const coverImages = [
        "../images/FP_01_4.jpg"
    ];
    
    let currentProjectIndex = 0;
    let currentImageIndex = 0;
    const activeFilters = [];
    const projectsContainer = document.getElementById('slideshow'); // Adjust if necessary to select your projects container
    let touchstartX = 0;
    let touchendX = 0;

    const randomCoverImage = coverImages[Math.floor(Math.random() * coverImages.length)];
    const coverImageElement = document.querySelector('#cover img');
    if (coverImageElement) {
        coverImageElement.src = randomCoverImage;
    }

    

    function handleGesture() {
        if (touchendX < touchstartX) {
            navigateToRight(); // Swipe left
        }
        if (touchendX > touchstartX) {
            navigateToLeft(); // Swipe right
        }
    }

    projectsContainer.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    });

    projectsContainer.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
    });


    // blur img when cursor is hovering over figcaption
    
    document.querySelectorAll('figcaption').forEach(caption => {
        caption.addEventListener('mouseover', () => {
            caption.previousElementSibling.classList.add('blur');
        });
        caption.addEventListener('mouseout', () => {
            caption.previousElementSibling.classList.remove('blur');
        });
    });
    

    function isProjectVisible(project) {
        if (activeFilters.length === 0) {
            return true;
        }
        const projectFilters = project.dataset.filter.split(' ');
        return activeFilters.some(filter => projectFilters.includes(filter));
    }
    


    function findNextVisibleProjectIndex(direction) {
        let index = currentProjectIndex;
        do {
            index = (index + direction + projects.length) % projects.length;
        } while (!isProjectVisible(projects[index]));
        return index;
    }

    function updateFilterButtons() {
        filterButtons.forEach(button => {
            const filter = button.getAttribute('data-filter');
            const isActive = activeFilters.includes(filter);
            button.classList.toggle('active', isActive);
        });
    }

    function updateImageCountDisplay(projectIndex, imageIndex) {
        if (projects[projectIndex].id === "cover") {
            // Hide the image count display for the cover
            imageCountDisplay.style.display = 'none';
        } else {
            // Show and update the image count display for other projects
            const project = projects[projectIndex];
            const totalImages = project.querySelectorAll('figure').length;
            imageCountDisplay.textContent = ` ${imageIndex + 1} / ${totalImages}`;
            imageCountDisplay.style.display = 'block'; // Make sure to show the counter if it was previously hidden
        }
    }
    
    function updateActiveListItem(projectId) {
        listItems.forEach(item => {
            if (item.id === `${projectId}_list`) {
                item.classList.add('active');
                // Scroll the active list item into view
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    
    function updateListItems() {
        listItems.forEach(item => {
            const projectId = item.id.replace('_list', '');
            const project = document.getElementById(projectId);
            if (isProjectVisible(project)) {
                item.classList.remove('filtered');
            } else {
                item.classList.add('filtered');
            }
        });
    }

    function applyFilter(filter) {
        const index = activeFilters.indexOf(filter);
        if (index === -1) {
            activeFilters.push(filter);
        } else {
            activeFilters.splice(index, 1);
        }
        applyFilters();
        updateActiveListItem(projects[currentProjectIndex].id);
    }
    function applyFilters() {
        let foundVisible = false;
        let firstVisibleIndex = -1;
    
        // Check each project's visibility based on the active filters
        projects.forEach((project, index) => {
            const isVisible = isProjectVisible(project);
            project.style.display = isVisible ? 'block' : 'none';
    
            // Keep track of the first visible project
            if (isVisible && firstVisibleIndex === -1) {
                firstVisibleIndex = index;
            }
            // Check if the current project is still visible
            if (isVisible && index === currentProjectIndex) {
                foundVisible = true;
            }
        });
    
        // If the current project is not visible or there are no visible projects, update the index
        if (!foundVisible) {
            if (firstVisibleIndex !== -1) {
                currentProjectIndex = firstVisibleIndex;
                currentImageIndex = 0;
            } else {
                // If no projects are visible, perhaps hide the slideshow or show a message
            }
        }
    
        // Update the display based on the current project and image indices
        showImage(currentProjectIndex, currentImageIndex);
    
        updateFilterButtons();
        updateListItems();
    }
        

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    document.getElementById('clearFilterLink').addEventListener('click', () => {
        clearFilter();
        updateListItems();
    });

    function clearFilter() {
        activeFilters.length = 0; // Clear the active filters array
        filterButtons.forEach(btn => btn.classList.remove('active')); // Remove active class from filter buttons
        updateFilterButtons();
        projects.forEach(project => project.style.display = 'block'); // Show all projects
        listItems.forEach(item => item.classList.remove('filtered', 'active')); // Clear any 'filtered' or 'active' classes
        updateListItems(); // Update list items to show all as available
        // No need to call navigateToProject here, it will be called in handleProjectClick
    }


    function handleProjectClick(projectId) {
        clearFilter(); // Clear all filters
        navigateToProject(projectId); // Navigate to the clicked project
    }

    function showImage(projectIndex, imageIndex) {
        // Hide all projects initially
        projects.forEach(p => p.style.display = 'none');
        // Display the current project
        const project = projects[projectIndex];
        project.style.display = 'block';
        
        // Hide all figures within the current project, then display the current figure
        const figures = project.querySelectorAll('figure');
        figures.forEach(fig => fig.style.display = 'none');
        figures[imageIndex].style.display = 'block';
    
        // Update styles for dark or light themes based on figure classes
        const figure = figures[imageIndex];
        if (figure.classList.contains('dark')) {
            imageCountDisplay.style.color = 'black';
            leftOverlay.style.cursor = "url('../images/previous.svg') 36 8, pointer";
            rightOverlay.style.cursor = "url('../images/next.svg') 36 8, pointer";
        } else if (figure.classList.contains('grey')) {
            imageCountDisplay.style.color = '#7e7e7e';
            leftOverlay.style.cursor = "url('../images/previous.svg') 36 8, pointer";
            rightOverlay.style.cursor = "url('../images/next.svg') 36 8, pointer";
        } else {
            imageCountDisplay.style.color = 'white';
            leftOverlay.style.cursor = "url('../images/previous_white.svg') 36 8, pointer";
            rightOverlay.style.cursor = "url('../images/next_white.svg') 36 8, pointer";
        }
    
        // Update current indices
        currentProjectIndex = projectIndex;
        currentImageIndex = imageIndex;
    
        // Update display elements
        updateImageCountDisplay(projectIndex, imageIndex);
        updateActiveListItem(projects[projectIndex].id);
    
        // Preload next 8 images for smoother transitions
        preloadNextImages(projectIndex, imageIndex);
    }

    
    
    function navigateToProject(projectId) {
        const projectIndex = Array.from(projects).findIndex(p => p.id === projectId);
        if (projectIndex >= 0) {
            currentProjectIndex = projectIndex;
            currentImageIndex = 0; // Reset to the first image of the project
            showImage(currentProjectIndex, currentImageIndex); // Show the first image
        } else {
            console.error('Project with ID not found:', projectId);
        }
    }
    

    
    listItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.id.replace('_list', '');
            const project = document.getElementById(projectId);
    
            if (isProjectVisible(project)) {
                // Project is active under the current filter
                navigateToProject(projectId);
            } else {
                // Project is inactive under the current filter
                clearFilter(); // Clear all filters
                navigateToProject(projectId); // Navigate to the clicked project
            }
        });
    });


    function preloadImages(imageUrls) {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    function getImageUrlsForProject(project) {
        const figures = project.querySelectorAll('figure');
        const imageUrls = Array.from(figures).map(figure => {
            const img = figure.querySelector('img');
            const iframe = figure.querySelector('iframe');
            // Return the src for img or iframe, or null if neither exists
            return img ? img.src : (iframe ? iframe.src : null);
        }).filter(url => url !== null); // Filter out any nulls
        return imageUrls;
    }
    


    function navigateToLeft() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
        } else {
            currentProjectIndex = findNextVisibleProjectIndex(-1);
            currentImageIndex = projects[currentProjectIndex].querySelectorAll('figure').length - 1;
        }
        showImage(currentProjectIndex, currentImageIndex);
    }

    function navigateToRight() {
        const figures = projects[currentProjectIndex].querySelectorAll('figure');
        if (currentImageIndex < figures.length - 1) {
            currentImageIndex++;
        } else {
            currentProjectIndex = findNextVisibleProjectIndex(1);
            currentImageIndex = 0;
        }
        showImage(currentProjectIndex, currentImageIndex);
    }

    function preloadNextImages(currentProjectIndex, currentImageIndex) {
        const project = projects[currentProjectIndex];
        const figures = project.querySelectorAll('figure');
        const startImageIndex = currentImageIndex + 1; // Start with the next image
        const endImageIndex = Math.min(startImageIndex + 8, figures.length); // Do not exceed total images
    
        // Preload each image in the range
        for (let i = startImageIndex; i < endImageIndex; i++) {
            const imageElement = figures[i].querySelector('img');
            if (imageElement) {
                const src = imageElement.src;
                const img = new Image();
                img.src = src;
            }
        }
    }
      
      function preloadImage(src) {
        const img = new Image();
        img.src = src;
      }
      




    leftOverlay.addEventListener('click', navigateToLeft);
    rightOverlay.addEventListener('click', navigateToRight);

    showImage(currentProjectIndex, currentImageIndex);

    
});


