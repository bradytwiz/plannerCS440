// Login function
async function login() {
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;
    
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: user, password: pass })
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        window.location.href = "home.html";
      } else {
        showMessage(data.error, 'error');
      }
    } catch (error) {
      showMessage("Login failed", 'error');
    }
  }
  
  // Register function
  async function register() {
    const user = document.getElementById("userSign").value;
    const pass = document.getElementById("passSign").value;
    const email = document.getElementById("email").value;
    
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: user, email, password: pass })
      });
      
      const data = await response.json();
      if (response.ok) {
        showMessage("Registration successful! Please login.", 'success');
      } else {
        showMessage(data.error, 'error');
      }
    } catch (error) {
      showMessage("Registration failed", 'error');
    }
  }
  
  function showMessage(message, type) {
    const element = document.getElementById("message");
    element.textContent = message;
    element.style.color = type === 'error' ? 'red' : 'green';
  }