async function login() {
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;
    const loginMessage = document.getElementById("loginMessage");

    const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: user, password: pass })
    });

    const data = await response.json();

    if (response.ok) {
        loginMessage.style.color = "green";
        loginMessage.textContent = "Login Successful!";
        localStorage.setItem("loggedInUser", JSON.stringify(data.user)); // Store user

        document.getElementById("userDisplay").textContent = `User: ${data.user.userName}`;
    } else {
        loginMessage.style.color = "red";
        loginMessage.textContent = data.error || "Login Failed";
    }
}


async function signup() {
    const user = document.getElementById("userSign").value;
    const pass1 = document.getElementById("passSign").value;
    const pass2 = document.getElementById("passConf").value;
    const email = document.getElementById("email").value;
    const signupMessage = document.getElementById("signupMessage");

    if (pass1 !== pass2) {
        signupMessage.style.color = "red";
        signupMessage.textContent = "Passwords do not match!";
        return;
    }

    const response = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: user, email: email, password: pass1 })
    });

    const data = await response.json();

    if (response.ok) {
        signupMessage.style.color = "green";
        signupMessage.textContent = "Signup Successful! You can now log in.";
        user.value = "";
        pass1.value = "";
        pass2.value = "";
        email.value = "";
    } else {
        signupMessage.style.color = "red";
        signupMessage.textContent = data.error || "Signup Failed";
    }
}
