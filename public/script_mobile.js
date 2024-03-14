// Event listeners for sorting
document.getElementById('sortByWeightAsc').addEventListener('click', function() {
    sortProjects('weight', 'asc');
});

document.getElementById('sortByWeightDesc').addEventListener('click', function() {
    sortProjects('weight', 'desc');
});

document.getElementById('sortBySizeAsc').addEventListener('click', function() {
    sortProjects('size', 'asc');
});

document.getElementById('sortBySizeDesc').addEventListener('click', function() {
    sortProjects('size', 'desc');
});

document.getElementById('sortByDateAsc').addEventListener('click', function() {
    sortProjects('date', 'desc');
});

document.getElementById('sortByDateDesc').addEventListener('click', function() {
    sortProjects('date', 'asc');
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
        figure.style.display = 'none';
    });
    figures[index].style.display = 'block';

    let imageCountInfo = `${index + 1}/${figures.length}`;
    let imageCountDisplay = project.querySelector('.image-count');
    if (!imageCountDisplay) {
        imageCountDisplay = document.createElement('div');
        imageCountDisplay.className = 'image-count';
        project.appendChild(imageCountDisplay);
    }
    imageCountDisplay.innerText = imageCountInfo;
}

// Combined event handler for both touch and mouse events
function handleInteraction(evt) {
    let isTouchEvent = evt.type.startsWith('touch');
    let clientX = isTouchEvent ? evt.touches[0].clientX : evt.clientX;

    if (evt.type === 'touchstart' || evt.type === 'mousedown') {
        this.xDown = clientX;
        this.isInteracting = true;
        // Check if the target is the overlay, and if so, use it, otherwise fallback to img
        this.currentTarget = evt.target.classList.contains('iframe-overlay') ? evt.target : evt.target.closest('figure').querySelector('img');
    }

    if ((isTouchEvent && evt.type === 'touchend') || (!isTouchEvent && evt.type === 'mouseup' && this.isInteracting)) {
        let rect = this.currentTarget.getBoundingClientRect();
        let x = this.xDown - rect.left;
        let figures = Array.from(this.currentTarget.closest('.project').querySelectorAll('figure'));
        let currentIndex = figures.indexOf(this.currentTarget.closest('figure'));

        if (x < rect.width / 2) {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : figures.length - 1;
        } else {
            currentIndex = currentIndex < figures.length - 1 ? currentIndex + 1 : 0;
        }

        showFigure(figures, currentIndex, this.currentTarget.closest('.project'));
        this.isInteracting = false;
    }
}


// Initialize projects on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    var projects = document.querySelectorAll('.project');
    projects.forEach(function(project) {
        let figures = project.querySelectorAll('figure');
        project.isInteracting = false;

        figures.forEach((figure, index) => {
            // Combined touch and mouse event listeners
            figure.addEventListener('touchstart', handleInteraction.bind(project), false);
            figure.addEventListener('touchend', handleInteraction.bind(project), false);
            figure.addEventListener('mousedown', handleInteraction.bind(project), false);
            figure.addEventListener('mouseup', handleInteraction.bind(project), false);
        });

        showFigure(figures, 0, project);
    });
});
