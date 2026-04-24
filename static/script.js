document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const scheduleContainer = document.getElementById('schedule-container');
    const talkTemplate = document.getElementById('talk-template');
    const breakTemplate = document.getElementById('break-template');

    // Debounce function to limit API calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const performSearch = async (query) => {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            renderSchedule(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            scheduleContainer.innerHTML = '<p>Error loading schedule. Please try again later.</p>';
        }
    };

    const renderSchedule = (talks) => {
        scheduleContainer.innerHTML = ''; // Clear current content

        if (talks.length === 0) {
            scheduleContainer.innerHTML = '<p>No talks found matching your criteria.</p>';
            return;
        }

        talks.forEach(talk => {
            if (talk.id === 'BREAK') {
                const clone = breakTemplate.content.cloneNode(true);
                clone.querySelector('.time').textContent = talk.time;
                clone.querySelector('h3').textContent = `${talk.title} ☕`;
                clone.querySelector('.description').textContent = talk.description;
                scheduleContainer.appendChild(clone);
            } else {
                const clone = talkTemplate.content.cloneNode(true);
                clone.querySelector('.time').textContent = talk.time;
                clone.querySelector('.category-badge').textContent = talk.category;
                clone.querySelector('.talk-title').textContent = talk.title;
                clone.querySelector('.description').textContent = talk.description;
                
                const speakersList = clone.querySelector('.speaker-list');
                talk.speakers.forEach((speaker, index) => {
                    const a = document.createElement('a');
                    a.href = speaker.linkedin;
                    a.textContent = `${speaker.firstName} ${speaker.lastName}`;
                    a.className = 'speaker-link';
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    
                    speakersList.appendChild(a);
                    
                    if (index < talk.speakers.length - 1) {
                        speakersList.appendChild(document.createTextNode(', '));
                    }
                });
                scheduleContainer.appendChild(clone);
            }
        });
    };

    // Attach event listener with 300ms debounce
    searchInput.addEventListener('input', debounce((e) => {
        performSearch(e.target.value);
    }, 300));
});
