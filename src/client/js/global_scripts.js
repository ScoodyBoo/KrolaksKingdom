// src/client/js/global_scripts.js

document.addEventListener('DOMContentLoaded', () => {


    document.addEventListener("keydown", function (event) {
        if (
            event.target.id === "messageInput" &&
            event.key === "Enter"
        ) {
            event.preventDefault();
            sendMessage();
        }
    });


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
        const onlineStatusText = document.getElementById("server-status-text");
        const loginErrorText = document.getElementById("login-connection-error-text");
        const registerErrorText = document.getElementById("register-connection-error-text");
        const chatBox = document.getElementById("chat-messages");

        console.log("Raw WebSocket message:", event.data);

        let data;
        try {
            data = JSON.parse(event.data);
        } catch (e) {
            // Fallback for plain text message
            data = { type: "text", message: event.data };
        }

        // ✅ Handle known types
        switch (data.type) {
            case "ping_online":
                if (onlineStatusText) onlineStatusText.textContent = "Server Online";
                break;
 
            case "message": // Broadcast message
                if (chatBox) {
                    chatBox.innerHTML += `<div><strong>${data.from || "Server"}:</strong> ${data.message}</div>`;
                    chatBox.scrollTop = chatBox.scrollHeight;
                }
                break;

            case "text":
            default:
                // General/fallback message
                if (onlineStatusText) onlineStatusText.textContent = "Server Online";

                if (loginErrorText) loginErrorText.textContent = data.message;
                if (registerErrorText) registerErrorText.textContent = data.message;

                if (data.message?.includes("logged in")) {
                    const username = data.message.replace("logged in ", "").replace("!", "");
                    window.currentUser = username;
                    showGameView();
                }
                break;
        }
    };




    // Load the login page by default
    window.loadContent('login');
});