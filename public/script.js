
delete slidesTotal;
let slidesTotal = document.querySelectorAll("#slideshow figure").length;
document.documentElement.style.setProperty('--slides-total', slidesTotal);
console.log(slidesTotal);
let currentImageLuminance = 128; // Default value


document.addEventListener("DOMContentLoaded", function() {
    // let slidesTotal = document.querySelectorAll("#slideshow figure").length;
    // document.documentElement.style.setProperty('--slides-total', slidesTotal);

    initializeCursorCustomization();
    initializeFiltering();
    initializeListItemClicks();
    initializeClearFilterLink();

    setActiveItem();
    updateCaption();
    window.addEventListener("hashchange", updateSlideshow);

});

function initializeCursorCustomization() {
    document.querySelectorAll('figure a').forEach(link => {
        link.addEventListener('mousemove', handleLinkMouseMove);
        link.addEventListener('mouseleave', () => link.style.cursor = 'default');
    });
}

function handleLinkMouseMove(event) {
    const linkCenter = this.offsetWidth / 2;

    if (event.offsetX < linkCenter) {
        // Show "Previous" cursor
        this.style.cursor = currentImageLuminance > 128 ? 'url("images/next.svg"), auto' : 'url("images/next_white.svg"), auto';
    } else {
        // Show "Next" cursor
        this.style.cursor = currentImageLuminance > 128 ? 'url("images/previous.svg"), auto' : 'url("images/previous_white.svg"), auto';
    }
}

function updateSlideshow() {
    setActiveItem();
    updateCaption();
}



function extractMainProjectID(id) {
    const match = id.match(/project_\d+/);
    return match ? match[0] : id;
}

function getAverageImageColor(imgEl, callback) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;

    context.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);
    let data = context.getImageData(0, 0, imgEl.width, imgEl.height*0.05).data;

    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }

    r /= (data.length / 4);
    g /= (data.length / 4);
    b /= (data.length / 4);

    callback({ r, g, b });
}


document.querySelectorAll("#slideshow figure").forEach(figure => {
    const figcaption = figure.querySelector('figcaption');
    figcaption.setAttribute('data-original-caption', figcaption.textContent.trim());
});


function updateCaption() {
    const allFigcaptions = document.querySelectorAll('figcaption');
    allFigcaptions.forEach(figcaption => figcaption.style.opacity = '0');

    const visibleFigure = document.querySelector('figure:target');
    if (visibleFigure) {
        const projectId = visibleFigure.getAttribute('data-project');
        const projectFigures = document.querySelectorAll(`figure[data-project='${projectId}']`);
        const projectTotal = projectFigures.length;
        const projectIndex = Array.from(projectFigures).indexOf(visibleFigure) + 1;

        let figcaption = visibleFigure.querySelector('figcaption');
        let imageCountDiv = visibleFigure.querySelector('.image-count');

        if (figcaption && imageCountDiv) {
            // Reset to original caption and append image count
            const originalCaption = figcaption.getAttribute('data-original-caption');
            imageCountDiv.textContent = `${projectIndex}/${projectTotal}`;

            const img = visibleFigure.querySelector('img');
            if (img && (img.crossOrigin === "anonymous" || isSameOrigin(img.src))) {
                getAverageImageColor(img, function(color) {
                    // Determine caption color based on image luminance
                    const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
                    const textColor = (luminance > 128) ? 'black' : 'white';
                    figcaption.style.color = textColor;
                    imageCountDiv.style.color = textColor;
                });
            } else {
                // Fallback color for cross-origin images or if no image is present
                figcaption.style.color = 'black';
                imageCountDiv.style.color = 'black';
            }

            figcaption.style.opacity = '1';
        }
    }
}

function isSameOrigin(url) {
    const pageLocation = window.location;
    const URLObject = new URL(url, pageLocation);
    return URLObject.origin === pageLocation.origin;
}




function initializeFiltering() {
    const filterButtons = document.querySelectorAll('.filterButton');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                this.classList.add('active');
            }
            filterProjects();
        });
    });
}

function filterProjects() {
    const activeFilters = [];

    document.querySelectorAll('.filterButton.active').forEach(button => {
        activeFilters.push(button.getAttribute('data-filter'));
    });

    let firstVisibleProjectId = null;

    document.querySelectorAll('.list .tile').forEach(item => {
        item.style.color = "#B1B1B1";
    });

    document.querySelectorAll('figure').forEach(figure => {
        if (activeFilters.length === 0) {
            figure.style.display = '';
            document.getElementById(extractMainProjectID(figure.id) + "_list").style.color = "black";
            return;
        }

        let show = false;
        activeFilters.forEach(filter => {
            if (figure.classList.contains(filter)) {
                show = true;
                if (!firstVisibleProjectId) {
                    firstVisibleProjectId = figure.id;
                }
            }
        });

        figure.style.display = show ? '' : 'none';
        if (show) {
            document.getElementById(extractMainProjectID(figure.id) + "_list").style.color = "black";
        }
    });

    if (firstVisibleProjectId) {
        window.location.hash = firstVisibleProjectId;
        setActiveItem();
    }
}

function setActiveItem() {
    const listItems = document.querySelectorAll('.list .tile');
    listItems.forEach(item => {
        item.style.backgroundColor = "";
        item.style.borderRadius = "0px";
    });

    const hash = window.location.hash;
    if (hash) {
        const activeItemID = extractMainProjectID(hash.slice(1)) + "_list";
        const activeItem = document.getElementById(activeItemID);
        if (activeItem) {
            activeItem.style.backgroundColor = "#E2E1CD";
            activeItem.style.borderRadius = "0px 0px 0px 0px";
            activeItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }
}

function resetFilters() {
    document.querySelectorAll('.filterButton').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('figure').forEach(figure => {
        figure.style.display = '';
    });
    document.querySelectorAll('.list .tile').forEach(item => {
        item.style.color = "black";
    });
}



function initializeListItemClicks() {
    document.addEventListener('click', function(event) {
        const tile = event.target.closest('.list .tile');
        if (!tile) return; // Skip, if the clicked element is not a tile

        const projectId = extractMainProjectID(tile.id);
        const projectElement = document.getElementById(projectId);

        // Check if the element is visible
        const isActive = isVisible(projectElement);

        if (!isActive) {
            resetFilters(); // Clear filters
            filterProjects(); // Update project display
        }

        navigateToProject(projectId); // Navigate to the project
    });
}

function isVisible(element) {
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function navigateToProject(projectId) {
    // Update the hash to navigate to the project
    window.location.hash = projectId;

    // Optional: Scroll the project into view
    const projectElement = document.getElementById(projectId);
    if (projectElement) {
        projectElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Call setActiveItem to update the active state of the list item
    setActiveItem();
}


function show_alert() {
    alert("Hello! I am an alert box!");
}


function initializeClearFilterLink() {
    const clearFilterLink = document.getElementById('clearFilterLink');
    if (clearFilterLink) {
        clearFilterLink.addEventListener('click', function(event) {
            event.preventDefault();
            resetFilters();

            const firstFigure = document.querySelector('figure');
            if (firstFigure && firstFigure.id) {
                window.location.hash = firstFigure.id;
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("img[data-highres]").forEach(img => {
        if (img.complete) {
            loadHighResImage(img);
        } else {
            img.onload = () => loadHighResImage(img);
        }
    });
});

function loadHighResImage(img) {
    const highResSrc = img.getAttribute("data-highres");
    const highResImage = new Image();
    highResImage.src = highResSrc;
    highResImage.onload = () => img.src = highResSrc;
}
