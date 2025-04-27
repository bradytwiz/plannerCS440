// Load events for a specific date
async function loadEvents(date) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;
  
    try {
      const response = await fetch(`http://localhost:8080/events/user?userId=${user.id}&date=${date}`);
      const data = await response.json();
      displayEvents(data.events);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }
  
  // Create new event
  async function createEvent(eventData) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;
  
    try {
      const response = await fetch('http://localhost:8080/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventData, userId: user.id })
      });
      
      return await response.json();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  }