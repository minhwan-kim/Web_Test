

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
            // Convert to date objects for comparison
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        } else {
            // Parse as integers for numerical comparison
            valueA = parseInt(valueA);
            valueB = parseInt(valueB);
        }

        return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });

    let parent = projects[0].parentNode;
    projects.forEach(project => {
        parent.appendChild(project);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    var projects = document.querySelectorAll('.project');

    projects.forEach(function(project) {
        let figures = project.getElementsByTagName('figure');
        let currentIndex = 0;
        let xDown = null;
        let yDown = null;
        let isTap = false;

        function handleTouchStart(evt) {
            xDown = evt.touches[0].clientX;
            yDown = evt.touches[0].clientY;
            isTap = true; // Assume it's a tap until proven otherwise
        };

        function handleTouchMove(evt) {
            if (!xDown || !yDown) {
                return;
            }

            var xUp = evt.touches[0].clientX;
            var yUp = evt.touches[0].clientY;
            var xDiff = xDown - xUp;
            var yDiff = yDown - yUp;

            // Check if the touch move is significant for a swipe
            if (Math.abs(xDiff) > 10 || Math.abs(yDiff) > 10) {
                isTap = false; // Not a tap, it's a swipe
            }
        };

        function handleTouchEnd(evt) {
            if (isTap) {
                let rect = project.getBoundingClientRect();
                let x = xDown - rect.left;

                if (x < rect.width / 2) {
                    // Left half tapped
                    currentIndex = currentIndex > 0 ? currentIndex - 1 : figures.length - 1;
                } else {
                    // Right half tapped
                    currentIndex = currentIndex < figures.length - 1 ? currentIndex + 1 : 0;
                }

                showFigure(figures, currentIndex);
            }

            // Reset values
            xDown = null;
            yDown = null;
            isTap = false;
        }

        project.addEventListener('touchstart', handleTouchStart, false);
        project.addEventListener('touchmove', handleTouchMove, false);
        project.addEventListener('touchend', handleTouchEnd, false);
    });

    function showFigure(figures, index) {
        for (let i = 0; i < figures.length; i++) {
            figures[i].style.display = i === index ? 'block' : 'none';
        }
    }
});
