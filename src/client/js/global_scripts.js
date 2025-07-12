// WebSocket implementation
const socket = new WebSocket("ws://127.0.0.1:8453");

socket.onopen = () => {
    console.log("Connected to server");
    updateStatus("Server Status: Online");
};

socket.onclose = () => {
    console.log("Disconnected from server");
    updateStatus("Server Status: Offline");
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    updateStatus("Server Status: ⚠️ Error");
};

function updateStatus(message) {
    const statusText = document.getElementById("status");
    if (statusText) {
        statusText.textContent = message;
    }
}

// Event Delegation for dynamically loaded content
document.addEventListener('click', function(event) {
    if (event.target.id === 'login-button') {
        tryLogin();
    }
    if (event.target.id === 'goto-register-button') {
        loadContent('register');
    }
    if (event.target.id === 'register-button') {
        tryRegister();
    }
    if (event.target.id === 'goto-login-button') {
        loadContent('login');
    }
});

function tryRegister() {
    const username =        document.getElementById("regUsernameInput").value;
    const email =           document.getElementById("regEmailInput").value;
    const password =        document.getElementById("regPasswordInput").value;
    const passwordConfirm = document.getElementById("regPasswordConfirmInput").value;

    if (username.length < 4 || username.length > 6) {
        alert("Username must be between 4 and 6 characters.");
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert("Password must be at least 8 characters long and include a letter and a number.");
        return;
    }
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
    const loginUsernameInput = document.getElementById("loginUsernameInput").value;
    const loginPasswordInput = document.getElementById("loginPasswordInput").value;
    
    const payload = {
        type:"login",
        username:loginUsernameInput,
        password: loginPasswordInput
    };
    socket.send(JSON.stringify(payload));
}

socket.onmessage = (event) => {
    const loginErrorText = document.getElementById("login-connection-error-text");
    const registerErrorText = document.getElementById("register-connection-error-text");

    if (loginErrorText) {
        loginErrorText.textContent = event.data;
    }
    if (registerErrorText) {
        registerErrorText.textContent = event.data;
    }

    if (event.data.includes("logged in")) {
        showGameView();
    }
};

function showGameView() {
    const authContainer = document.getElementById('auth-container');
    const gameContainer = document.getElementById('game-container');
    const messagePanel = document.getElementById('message-panel');

    authContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    messagePanel.style.display = 'block';

    fetch(`html/game_view.html`)
        .then(response => response.text())
        .then(data => {
            gameContainer.innerHTML = data;
        });
}

function sendMessage() {
	const input = document.getElementById("messageInput");
    const payload = {
        type:"message",
        message:input.value
    };
    socket.send(JSON.stringify(payload));
	input.value = "";
}
