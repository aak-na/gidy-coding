// Handle form submission
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  try {
    // Submit the feedback to the backend
    const response = await fetch('http://localhost:5000/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await response.json();
    document.getElementById('responseMessage').textContent = result.message;

    // Reset the form fields
    document.getElementById('feedbackForm').reset();

    // Clear the response message after 5 seconds
    setTimeout(function() {
      document.getElementById('responseMessage').textContent = '';
    }, 5000);

    // Refresh the feedback list
    loadFeedbacks();

  } catch (error) {
    document.getElementById('responseMessage').textContent = 'Error submitting feedback.';
  }
});

// Function to load feedback from the backend
async function loadFeedbacks() {
  try {
    const response = await fetch('http://localhost:5000/feedbacks');
    const feedbacks = await response.json();
    const feedbackList = document.getElementById('feedbackList');

    feedbackList.innerHTML = ''; // Clear the current list

    feedbacks.forEach(feedback => {
      const feedbackCard = document.createElement('div');
      feedbackCard.classList.add('feedback-card');
      feedbackCard.dataset.feedbackId = feedback.id;

      feedbackCard.innerHTML = `
        <p class="feedback-message">${feedback.message}</p>
        <button class="delete-feedback-btn">Delete</button>
      `;

      // Add delete button functionality
      feedbackCard.querySelector('.delete-feedback-btn').addEventListener('click', async () => {
        try {
          const response = await fetch(`http://localhost:5000/feedback/${feedback.id}`, {
            method: 'DELETE',
          });

          const result = await response.json();

          if (result.success) {
            feedbackCard.remove(); // Remove feedback from DOM
            alert('Feedback deleted successfully');
          } else {
            alert('Error deleting feedback');
          }
        } catch (error) {
          alert('Error communicating with the server');
        }
      });

      feedbackList.appendChild(feedbackCard);
    });
  } catch (error) {
    console.error('Error loading feedbacks:', error);
  }
}

// Load feedbacks when the page is loaded
window.onload = loadFeedbacks;

// Function to load feedback from the backend
async function loadFeedbacks() {
  try {
    const response = await fetch('http://localhost:5000/feedbacks');
    const feedbacks = await response.json();
    const feedbackList = document.getElementById('feedbackList');

    feedbackList.innerHTML = ''; // Clear the current list

    feedbacks.forEach(feedback => {
      const feedbackCard = document.createElement('div');
      feedbackCard.classList.add('feedback-card');
      feedbackCard.dataset.feedbackId = feedback.id;

      feedbackCard.innerHTML = `
        <p class="feedback-message">${feedback.message}</p>
        <button class="edit-feedback-btn">Edit</button>
        <button class="delete-feedback-btn">Delete</button>
      `;

      // Add delete button functionality
      feedbackCard.querySelector('.delete-feedback-btn').addEventListener('click', async () => {
        try {
          const response = await fetch(`http://localhost:5000/feedback/${feedback.id}`, {
            method: 'DELETE',
          });

          const result = await response.json();

          if (result.success) {
            feedbackCard.remove(); // Remove feedback from DOM
            alert('Feedback deleted successfully');
          } else {
            alert('Error deleting feedback');
          }
        } catch (error) {
          alert('Error communicating with the server');
        }
      });

      // Add edit button functionality
      feedbackCard.querySelector('.edit-feedback-btn').addEventListener('click', () => {
        const messageElement = feedbackCard.querySelector('.feedback-message');
        const originalMessage = messageElement.textContent;

        // Create an editable textarea for the feedback message
        const textarea = document.createElement('textarea');
        textarea.value = originalMessage;
        textarea.classList.add('edit-textarea'); // Optional styling class

        // Replace the message with the textarea
        messageElement.replaceWith(textarea);

        // Change the Edit button to an Update button
        const editButton = feedbackCard.querySelector('.edit-feedback-btn');
        editButton.textContent = 'Update';

        // When Update is clicked, save the changes
        editButton.addEventListener('click', async () => {
          const updatedMessage = textarea.value;

          // Send the updated feedback to the backend
          try {
            const response = await fetch(`http://localhost:5000/feedback/${feedback.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: updatedMessage }),
            });

            const result = await response.json();

            if (result.success) {
              // Update the feedback message in the DOM
              textarea.replaceWith(updatedMessage);
              alert('Feedback updated successfully');
            } else {
              alert('Error updating feedback');
            }
          } catch (error) {
            alert('Error communicating with the server');
          }
        });
      });

      feedbackList.appendChild(feedbackCard);
    });
  } catch (error) {
    console.error('Error loading feedbacks:', error);
  }
}

