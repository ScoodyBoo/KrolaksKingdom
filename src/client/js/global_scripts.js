// src/client/js/global_scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Event Delegation for dynamically loaded content
    document.addEventListener('click', function(event) {
        if (event.target.id === 'login-button') {
            tryLogin();
        }
        if (event.target.id === 'goto-register-button') {


            window.loadContent('register');
        }
        if (event.target.id === 'register-button') {
            tryRegister();
        }
        if (event.target.id === 'goto-login-button') {
            const payload = {
                type: "ping_online",
                username: window.currentUser
            };
            window.socket.send(JSON.stringify(payload));

            window.loadContent('login');
        }
        if (event.target.id === 'send-message-button') {
            sendMessage();
        }
        if (event.target.id === 'logout-button') {
            logout();
        }
    });

    window.socket.onmessage = (event) => {
        const onlineStatusText = document.getElementById("server-status-text")
        const loginErrorText = document.getElementById("login-connection-error-text");
        const registerErrorText = document.getElementById("register-connection-error-text");


        if (onlineStatusText) {
            onlineStatusText.textContent = "Server Online"
        }

        if (loginErrorText) {
            loginErrorText.textContent = event.data;
        }
        if (registerErrorText) {
            registerErrorText.textContent = event.data;
        }

        if (event.data.includes("logged in")) {
            const username = event.data.replace("logged in ", "").replace("!", "");
            window.currentUser = username;
            showGameView();
        }
        console.log(event.data);
    };

    // Load the login page by default
    window.loadContent('login');
});