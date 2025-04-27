function updateUserDisplay() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const displayElement = document.getElementById("userDisplay");
    
  if (user) {
    displayElement.textContent = `User: ${user.userName}`;
  } else {
    displayElement.textContent = "User: Guest";
  }
}
  
// Navigation functions
function navigateTo(page) {
  window.location.href = `${page}.html`;
}
  
// Initialize on page load
document.addEventListener("DOMContentLoaded", updateUserDisplay);