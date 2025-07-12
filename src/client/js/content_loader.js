// src/client/js/content_loader.js

function loadContent(page) {
    const container = document.getElementById('auth-container');
    fetch(`html/${page}.html`)
        .then(response => response.text())
        .then(data => {
            container.innerHTML = data;
        });
}

// Expose loadContent globally
window.loadContent = loadContent;
