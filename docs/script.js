document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const monologueList = document.getElementById('monologue-list');
    const monologueDetail = document.getElementById('monologue-detail');
    const favoritesList = document.getElementById('favorites-list');
    const eraFilterInputs = document.querySelectorAll('input[name="era"]');

    const userId = 1;  
    
    
    
    async function fetchMonologues(query = '') {
        try {
            const res = await fetch(`/api/monologues`);
            const monologues = await res.json();
            console.log("Monologues fetched:", monologues); 
            
            
            const era = document.querySelector('input[name="era"]:checked')?.value || 'All';
    
            
            const filteredMonologues = monologues.filter(monologue =>
                monologue.title.toLowerCase().includes(query.toLowerCase()) &&
                (era === 'All' || monologue.era?.toLowerCase() === era.toLowerCase())
            );
    
            
            monologueList.innerHTML = ''; // Clear the monologue list first
            filteredMonologues.forEach(monologue => {
                const div = document.createElement('div');
                div.classList.add('monologue');
                div.innerHTML = `
                    <!-- Make the title a clickable link that goes to monologueDetail.html -->
                    <h2><a href="monologueDetail.html?id=${monologue.id}">${monologue.title}</a></h2>
                    <p>By: ${monologue.author}</p>
                    <p>From: ${monologue.play_name}</p>
                    <p><strong>${monologue.era}</strong></p> 
                    <p>${monologue.description}</p>
                    <span class="star" onclick="toggleFavorite(${monologue.id})">&#9733;</span> <!-- Star for favorite -->
                `;
                monologueList.appendChild(div);
            });
        } catch (error) {
            console.error("Error fetching monologues:", error);
        }
    }
    

   
    function downloadMonologue(id) {
        fetch(`/api/monologues/${id}`)
            .then(res => res.json())
            .then(monologue => {
                // Create a PDF using jsPDF
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                doc.setFont("Javanese Text", "normal");
                doc.text(`Title: ${monologue.title}`, 10, 10);
                doc.text(`By: ${monologue.author}`, 10, 20);
                doc.text(`Category: ${monologue.category}`, 10, 30);
                doc.text(`Description: ${monologue.description}`, 10, 40);
                doc.text(`Full Monologue:`, 10, 50);
                doc.text(monologue.full_text, 10, 60);

                // Save the PDF as a file
                doc.save(`${monologue.title}.pdf`);
            })
            .catch(error => console.error("Error downloading monologue:", error));
    }
    function downloadMonologue(id) {
        fetch(`/api/monologues/${id}`)
            .then(res => res.json())
            .then(monologue => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
    
                const margin = 10;
                const pageWidth = doc.internal.pageSize.width; // Width of the page
                const pageHeight = doc.internal.pageSize.height; // Height of the page
                const availableWidth = pageWidth - 2 * margin; // Width minus margins
    
                // Define the font and size
                doc.setFont("Helvetica", "normal");
                doc.setFontSize(12);
    
                // Split the text to ensure it doesn't go off the page width
                const title = monologue.title;
                const author = `By: ${monologue.author}`;
                const category = `Category: ${monologue.category}`;
                const description = `Description: ${monologue.description}`;
                const fullText = `Full Monologue:\n\n${monologue.full_text}`;
    
                // Add title with a larger font size and center it
                doc.setFontSize(16);
                doc.text(title, pageWidth / 2, margin + 10, null, null, 'center');
    
                // Add author, category, and description
                doc.setFontSize(12);
                doc.text(author, margin, margin + 30);
                doc.text(category, margin, margin + 40);
                doc.text(description, margin, margin + 50);
    
                // Add the full monologue text with wrapping
                const textOptions = { maxWidth: availableWidth };
                const splitText = doc.splitTextToSize(fullText, availableWidth); // Automatically wrap text to fit the available width
                doc.text(splitText, margin, margin + 60);
    
                // Save the generated PDF
                doc.save(`${monologue.title}.pdf`);
            })
            .catch(error => console.error("Error downloading monologue:", error));
    }
    // Function to toggle favorite monologue (add/remove favorite)
    async function toggleFavorite(id) {
        try {
            const res = await fetch(`/api/favorites/${userId}`);
            const favorites = await res.json();
            const isFavorite = favorites.some(fav => fav.id === id);

            if (isFavorite) {
                // If it's already in the favorites, remove it
                await fetch(`/api/favorites/remove`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, monologue_id: id })
                });
                alert("Monologue removed from favorites");
            } else {
                // Otherwise, add it to favorites
                await fetch(`/api/favorites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, monologue_id: id })
                });
                alert("Monologue added to favorites");
            }
            
            fetchFavorites(); // Refresh the favorites list
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    }

    // Function to fetch and display user's favorite monologues
    async function fetchFavorites() {
        try {
            const res = await fetch(`/api/favorites/${userId}`);
            const favorites = await res.json();
            favoritesList.innerHTML = ''; // Clear the current list of favorites

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
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    }

    // Search functionality
    searchBar.addEventListener('input', () => {
        fetchMonologues(searchBar.value);
    });

    // Initial load
    fetchMonologues();
    fetchFavorites();
});
