document.addEventListener('DOMContentLoaded', async () => {
    const userId = 1; // Hardcoded user for now
    try {
        const res = await fetch(`/api/favorites/${userId}`);
        const favorites = await res.json();

        const list = document.getElementById('favorites-list');
        if (favorites.length === 0) {
            list.innerHTML = '<p>You have no favorite monologues yet!</p>';
            return;
        }

        favorites.forEach(monologue => {
            const div = document.createElement('div');
            div.className = 'monologue';
            div.innerHTML = `
                <h2>${monologue.title}</h2>
                <p><strong>Author:</strong> ${monologue.author}</p>
                <p>${monologue.description}</p>
                <a href="monologue.html?id=${monologue.id}">Read More</a>
            `;
            list.appendChild(div);
        });
    } catch (error) {
        console.error('Failed to fetch favorites:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to load and display the list of favorites
    function loadFavorites() {
        const favoritesList = document.getElementById('favorites-list');
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        favoritesList.innerHTML = ''; // Clear the current favorites list

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p>No favorites added yet!</p>';
            return;
        }

        favorites.forEach(monologue => {
            const div = document.createElement('div');
            div.classList.add('monologue');
            div.innerHTML = `
                <h2>${monologue.title}</h2>
                <p>By: ${monologue.author}</p>
                <p>${monologue.description}</p>
            `;
            favoritesList.appendChild(div);
        });
    }

    loadFavorites(); // Load favorites when the page is loaded
});
