// Create twinkling stars (optional, for visual effect)
function createStars() {
    const starsCount = 100;
    const container = document.body;
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(star);
    }
}

// Initialize stars
createStars();

// Fetch stories from the backend and display them
function loadStories() {
    fetch('https://hope-git-main-babimishra002-gmailcoms-projects.vercel.app/api/stories')  // Ensure this URL is correct
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            data.forEach(story => {
                addStory(story.title, story.badTimes, story.overcoming);
            });
        })
        .catch(error => {
            console.error('Error fetching stories:', error);
        });
}

// Call loadStories to display all the stories from MongoDB when the page loads
window.onload = loadStories;  // This will trigger when the page is loaded

// Handle form submission
document.getElementById('story-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const badTimes = document.getElementById('bad-times').value;
    const overcoming = document.getElementById('overcoming').value;

    // Add story to the frontend immediately
    addStory(title, badTimes, overcoming);

    // Send data to backend (MongoDB)
    fetch('https://hope-git-main-babimishra002-gmailcoms-projects.vercel.app/api/stories', { // Ensure the URL is correct
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set content type
        },
        body: JSON.stringify({ title, badTimes, overcoming }), // Convert to JSON
    })
        .then(response => response.json())
        .then(data => {
            console.log('Story saved:', data);
        })
        .catch(error => {
            console.error('Error saving story:', error);
        });

    // Clear form
    this.reset();
});

// Function to add a new story to the page
function addStory(title, badTimes, overcoming) {
    const storiesList = document.getElementById('stories-list');
    const storyBox = document.createElement('div');
    storyBox.className = 'story-box';
    storyBox.innerHTML = `
        <div class="story-title">${title}</div>
        <div class="bad-times">${badTimes}</div>
        <div class="overcoming">${overcoming}</div>
    `;
    storiesList.prepend(storyBox); // Prepend ensures new stories appear at the top
}
