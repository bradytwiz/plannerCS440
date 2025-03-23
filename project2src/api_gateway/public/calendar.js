document.addEventListener("DOMContentLoaded", () => {
    updateNavbarUser(); // Update the navbar when the page loads

    const dateInput = document.getElementById("day-select");
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission
        const selectedDate = dateInput.value;

        if (!selectedDate) {
            alert("Please select a date.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) {
            alert("You must be logged in to view events.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5002/user-events?user_id=${user.id}&date=${selectedDate}`);
            const data = await response.json();

            if (data.events.length === 0) {
                alert("No events found for this day.");
            } else {
                displayEvents(data.events);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    });
});

function displayEvents(events) {
    let eventList = document.getElementById("event-list");
    if (!eventList) {
        eventList = document.createElement("div");
        eventList.id = "event-list";
        document.body.appendChild(eventList);
    }

    eventList.innerHTML = "<h2>Events on Selected Day</h2>";
    
    events.forEach(event => {
        const eventItem = document.createElement("p");
        eventItem.innerHTML = `<strong>${event.name}</strong>: ${event.description} at ${event.time} 
                               <br> <span style="color: ${event.color};">Priority: ${event.importance}</span>`;
        eventList.appendChild(eventItem);
    });
}


function updateNavbarUser() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const userDisplay = document.querySelector(".nav-list li:last-child"); // Selects the last <li> in the nav

    if (user) {
        userDisplay.textContent = `User: ${user.userName}`;
    } else {
        userDisplay.textContent = "User: Guest";
    }
}
