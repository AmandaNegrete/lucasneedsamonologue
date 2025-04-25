document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-monologue-form');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const fullText = document.getElementById('full_text').value;
        const era = document.getElementById('era').value;
        const playName = document.getElementById('play_name').value;

        const newMonologue = {
            title,
            author,
            category,
            description,
            full_text: fullText,
            era,
            play_name: playName
        };

        try {
            const res = await fetch('/api/monologues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMonologue)
            });

            if (res.ok) {
                alert('Monologue added successfully!');
                window.location.href = 'index.html';
            } else {
                const error = await res.json();
                alert('Error adding monologue: ' + error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the monologue.');
        }
    });
});
