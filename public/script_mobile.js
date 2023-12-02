// Event listeners for weight sorting
document.getElementById('sortByWeightAsc').addEventListener('click', function() {
    sortProjects('weight', 'asc');
});

document.getElementById('sortByWeightDesc').addEventListener('click', function() {
    sortProjects('weight', 'desc');
});

// Event listeners for size sorting
document.getElementById('sortBySizeAsc').addEventListener('click', function() {
    sortProjects('size', 'asc');
});

document.getElementById('sortBySizeDesc').addEventListener('click', function() {
    sortProjects('size', 'desc');
});

// Event listeners for date sorting
document.getElementById('sortByDateAsc').addEventListener('click', function() {
    sortProjects('date', 'desc'); // Assuming newer dates have larger values
});

document.getElementById('sortByDateDesc').addEventListener('click', function() {
    sortProjects('date', 'asc'); // Assuming older dates have smaller values
});

function sortProjects(attribute, direction) {
    let projects = Array.from(document.querySelectorAll('.project'));

    projects.sort(function(a, b) {
        let valueA = a.getAttribute(`data-${attribute}`);
        let valueB = b.getAttribute(`data-${attribute}`);

        if (attribute === 'date') {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        } else {
            valueA = parseInt(valueA, 10);
            valueB = parseInt(valueB, 10);
        }

        return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });

    let parent = projects[0].parentNode;
    projects.forEach(project => parent.appendChild(project));
}

function showFigure(figures, index, project) {
    figures.forEach(figure => {
        figure.style.display = 'none'; // Hide all figures
    });
    figures[index].style.display = 'block'; // Show the current figure

    // Update the image count for the project
    let imageCountInfo = `${index + 1}/${figures.length}`;
    let imageCountDisplay = project.querySelector('.image-count');
    if (!imageCountDisplay) {
        imageCountDisplay = document.createElement('div');
        imageCountDisplay.className = 'image-count';
        project.appendChild(imageCountDisplay);
    }
    imageCountDisplay.innerText = imageCountInfo;
}

// Touch event handlers
function handleTouchStart(evt) {
    const img = evt.target.closest('figure').querySelector('img');
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
    this.isTap = true; // Assume it's a tap until proven otherwise
    this.currentFigure = img;
}

function handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
        return;
    }

    var xDiff = this.xDown - evt.touches[0].clientX;
    var yDiff = this.yDown - evt.touches[0].clientY;

    if (Math.abs(xDiff) > 10 || Math.abs(yDiff) > 10) {
        this.isTap = false; // Not a tap, it's a swipe
    }
}

function handleTouchEnd(evt) {
    if (this.isTap) {
        let rect = this.currentFigure.getBoundingClientRect();
        let x = this.xDown - rect.left;
        let figures = Array.from(this.currentFigure.closest('.project').querySelectorAll('figure'));
        let currentIndex = figures.indexOf(this.currentFigure.closest('figure'));

        if (x < rect.width / 2) {
            // Left half tapped
            currentIndex = currentIndex > 0 ? currentIndex - 1 : figures.length - 1;
        } else {
            // Right half tapped
            currentIndex = currentIndex < figures.length - 1 ? currentIndex + 1 : 0;
        }

        showFigure(figures, currentIndex, this.currentFigure.closest('.project'));
    }

    // Reset values
    this.xDown = null;
    this.yDown = null;
    this.isTap = false;
}

// Initialize projects on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    var projects = document.querySelectorAll('.project');
    projects.forEach(function(project) {
        let figures = project.querySelectorAll('figure');
        project.xDown = null;
        project.yDown = null;
        project.isTap = false;
        project.currentFigure = null;

        figures.forEach((figure, index) => {
            figure.addEventListener('touchstart', handleTouchStart.bind(project), false);
            figure.addEventListener('touchmove', handleTouchMove.bind(project), false);
            figure.addEventListener('touchend', handleTouchEnd.bind(project), false);
        });

        // Initialize with the first image
        showFigure(figures, 0, project);
    });
});
