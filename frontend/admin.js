window.onload = async () => {
    const feedbackList = document.getElementById('feedbackList');
  
    try {
      const response = await fetch('http://localhost:5000/feedbacks');
      const feedbacks = await response.json();
  
      feedbacks.forEach(fb => {
        const card = document.createElement('div');
        card.className = 'feedback-card';
        card.innerHTML = `
          <h3>${fb.name} (${fb.email})</h3>
          <p>${fb.message}</p>
        `;
        feedbackList.appendChild(card);
      });
    } catch (error) {
      feedbackList.innerHTML = '<p>Error loading feedbacks.</p>';
    }
  };

  