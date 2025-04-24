document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-monologue-form');
    
    // Add event listener to handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission (page reload)
        
        // Get the values from the form fields
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const fullText = document.getElementById('full_text').value;

        // Create an object to send in the POST request
        const newMonologue = {
            title,
            author,
            category,
            description,
            full_text: fullText
        };

        try {
            // Send the POST request to the backend to add the monologue
            const res = await fetch('/api/monologues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMonologue)
            });

            if (res.ok) {
                // If the request was successful, alert the user and redirect
                alert('Monologue added successfully!');
                window.location.href = 'index.html'; // Redirect to the main page or monologue list
            } else {
                // If there was an error, display the error message
                const error = await res.json();
                alert('Error adding monologue: ' + error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the monologue.');
        }
    });
});
