// src/client/js/auth_handler.js


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
    window.socket.send(JSON.stringify(payload));
}

function tryLogin() {
    const loginUsernameInput = document.getElementById("loginUsernameInput").value;
    const loginPasswordInput = document.getElementById("loginPasswordInput").value;
    
    const payload = {
        type:"login",
        username:loginUsernameInput,
        password: loginPasswordInput
    };
    window.socket.send(JSON.stringify(payload));
}

