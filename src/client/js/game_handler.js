// src/client/js/game_handler.js

function showGameView() {
    const authContainer = document.getElementById('auth-container');
    const gameContainer = document.getElementById('game-container');

    authContainer.style.display = 'none';
    gameContainer.style.display = 'block';

    fetch(`html/game_view.html`)
        .then(response => response.text())
        .then(data => {
            gameContainer.innerHTML = data;
        });
}

function logout() {
    if (window.currentUser) {
        const payload = {
            type: "logout",
            username: window.currentUser
        };
        window.socket.send(JSON.stringify(payload));
        window.currentUser = null; // Clear the global username
    }

    const authContainer = document.getElementById('auth-container');
    const gameContainer = document.getElementById('game-container');

    authContainer.style.display = 'block';
    gameContainer.style.display = 'none';

    window.loadContent('login');
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const payload = {
        type:"message",
        message:input.value
    };
    window.socket.send(JSON.stringify(payload));
    input.value = "";
}
