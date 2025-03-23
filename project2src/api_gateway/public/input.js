document.addEventListener("DOMContentLoaded", () => {
    checkUserSession();
    fetchTypes();
    enableSubmitButton();
});


// Fetch available event types
async function fetchTypes() {
    try {
        const user = JSON.parse(localStorage.getItem("loggedInUser")); // Get logged-in user

        const response = await fetch("http://localhost:5002/types", {
            method: "GET",
            headers: user ? { "User-ID": user.id } : {}, // Only send if user exists
            credentials: "include"
        });

        if (!response.ok) {
            console.error("Failed to fetch types:", response.status, response.statusText);
            return;
        }

        const data = await response.json();

        if (!data.types) {
            console.error("Types data is missing:", data);
            return;
        }

        const typeSelect = document.getElementById("types");
        typeSelect.innerHTML = '<option value="">Select Type</option>'; // Reset options

        data.types.forEach(type => {
            const option = document.createElement("option");
            option.value = type.id;
            option.textContent = type.name;
            typeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching types:", error);
    }
}

// Check if user is logged in
async function checkUserSession() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        alert("You must be logged in to submit an event.");
        document.getElementById("userDisplay").textContent = "User: Guest";
        document.getElementById("submitEvent").disabled = true;
        return;
    }

    // Display user info
    document.getElementById("userDisplay").textContent = `User: ${user.userName}`;
    document.getElementById("submitEvent").disabled = false;
}


// Enable submit button when form fields are filled
function enableSubmitButton() {
    const nameInput = document.getElementById("eventName");
    const dateInput = document.getElementById("eventDate");
    const typeInput = document.getElementById("types");
    const submitButton = document.getElementById("submitEvent");

    function checkInputs() {
        if (nameInput.value.trim() !== "" && dateInput.value && typeInput.value !== "") {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    nameInput.addEventListener("input", checkInputs);
    dateInput.addEventListener("input", checkInputs);
    typeInput.addEventListener("change", checkInputs);

    checkInputs(); // Run check once in case fields are already filled
}

// Submit an event
document.getElementById("submitEvent").addEventListener("click", async () => {
    const name = document.getElementById("eventName").value;
    const description = document.getElementById("eventDesc").value;
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const type_id = document.getElementById("types").value;

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("You must be logged in to create an event.");
        return;
    }

    const response = await fetch("http://localhost:5002/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, date, time, type_id, user_id: user.id })
    });

    const data = await response.json();
    alert(data.message);
    document.getElementById("eventName").value = "";
    document.getElementById("eventDesc").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
});

// Submit a type
document.getElementById("submitType").addEventListener("click", async () => {
    const name = document.getElementById("typeName").value;
    const color = document.getElementById("typeColor").value;
    const importance = document.getElementById("priority").value;

    if (!name || !color || !importance) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5002/type", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, color, importance })
        });

        const data = await response.json();
        alert(data.message);

        // Reset type fields
        document.getElementById("typeName").value = "";
        document.getElementById("typeColor").value = "#FFFFFF";
        document.getElementById("priority").value = "1";

        fetchTypes(); // Refresh type dropdown
    } catch (error) {
        console.error("Error submitting type:", error);
        alert("Error submitting type. Please try again.");
    }
});
