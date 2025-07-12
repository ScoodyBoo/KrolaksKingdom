// src/client/js/websocket_handler.js
window.socket = new WebSocket("ws://127.0.0.1:8453");

window.socket.onopen = () => {
    console.log("Connected to server");
    updateStatus("Server Status: Online");
};

window.socket.onclose = () => {
    console.log("Disconnected from server");
    updateStatus("Server Status: Offline");
    if (window.currentUser) {
        const payload = {
            type: "logout",
            username: window.currentUser
        };
        // Send the logout message before the socket fully closes
        // This might not always work if the connection is already dead
        // but it's good practice to attempt.
        window.socket.send(JSON.stringify(payload));
        window.currentUser = null;
    }
};

window.socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    updateStatus("Server Status: ⚠️ Error");
};

// This will be handled by global_scripts.js or other handlers
window.socket.onmessage = (event) => {
    // Placeholder for now, actual message handling will be in global_scripts.js
    // or dispatched to specific handlers.
    console.log("Message received:", event.data);
};

function updateStatus(message) {
    const statusText = document.getElementById("server-status-text");
    if (statusText) {
        statusText.textContent = message;
    }
}




// Expose updateStatus globally if needed by other modules directly
window.updateStatus = updateStatus;
