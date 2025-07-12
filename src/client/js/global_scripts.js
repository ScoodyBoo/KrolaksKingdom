// websok implementation
const socket = new WebSocket("ws://127.0.0.1:8453");
socket.onopen = () => {
	console.log("Connected to server");
    statusText.textContent = "Server Status: Online";
};
socket.onclose = () => {
    console.log("Disconnected from server");
    statusText.textContent = "Server Status: Offline";
};
socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    statusText.textContent = "Server Status: ⚠️ Error";
};



// Login & Auth Implementation
const statusText = document.getElementById("status");
const loginConnectionErrorText = document.getElementById("login-connection-error-text");
const registerConnectionErrorText = document.getElementById("register-connection-error-text");
const messagePanel = document.getElementById("message-panel")
const registerPanel = document.getElementById("register-panel")
const loginPanel = document.getElementById("login-panel")
function showLoginPanel() {
    loginPanel.style.display = "block";
    
}
function showRegisterPanel() {
    registerPanel.style.display = "block";
    
}
function showMessagePanel() {
    messagePanel.style.display = "block";
}
function hideAuthPanels() {
    loginPanel.style.display = "none";
    messagePanel.style.display = "none";
    registerPanel.style.display = "none";
}
function tryRegister() {
    const username =        document.getElementById("regUsernameInput").value;
    const email =           document.getElementById("regEmailInput").value;
    const password =        document.getElementById("regPasswordInput").value;
    const passwordConfirm = document.getElementById("regPasswordConfirmInput").value;
    // 🔹 Username length between 4 and 6
    if (username.length < 4 || username.length > 6) {
        alert("Username must be between 4 and 6 characters.");
        return;
    }
    // 🔹 Email validation using simple regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    // 🔹 Password strength: min 8 chars, includes letter and number
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert("Password must be at least 8 characters long and include a letter and a number.");
        return;
    }
    // 🔹 Confirm password
    if (password !== passwordConfirm) {
        alert("Passwords do not match.");
        return;
    }
    const payload = {
        type:"register",
        username:username,
        password: password,
        email: email,
        
    };
    socket.send(JSON.stringify(payload));
}
function tryLogin() {
    const loginUsernameInput = document.getElementById("loginUsernameInput")
    const loginPasswordInput = document.getElementById("loginPasswordInput")
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;
    
    const payload = {
        type:"login",
        username:username,
        password: password
    };
    socket.send(JSON.stringify(payload));
    
}

function gotoRegister() {
    hideAuthPanels();
    showRegisterPanel();
    registerConnectionErrorText.textContent = "-"
}
function gotoLogin() {
    
    hideAuthPanels();
    showLoginPanel();
    loginConnectionErrorText.textContent = "-"
    

}
socket.onmessage = (event) => {
	// const li = document.createElement("li");
	// li.textContent = event.data;
	// document.getElementById("messages").appendChild(li);
    loginConnectionErrorText.textContent = event.data
    registerConnectionErrorText.textContent = event.data
};
function sendMessage() {
	const input = document.getElementById("messageInput");
    const payload = {
        type:"message",
        username: username,
        message:input.value
    };
    socket.send(JSON.stringify(payload));
	input.value = "";
}

gotoLogin()