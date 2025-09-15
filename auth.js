// Authentication handling

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('githubCloneUser') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('githubCloneUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Protect routes that require authentication
function protectRoute() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Redirect if already logged in
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return true;
    }
    return false;
}

// Set up authentication state on page load
document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    
    // Update user info in UI
    const userNameElements = document.querySelectorAll('#userName');
    if (userNameElements.length > 0 && user) {
        userNameElements.forEach(element => {
            element.textContent = user.username;
        });
    }
    
    // Set repository owner field
    const repoOwnerElement = document.getElementById('repoOwner');
    if (repoOwnerElement && user) {
        repoOwnerElement.value = user.username;
    }
    
    // Protect authenticated routes
    if (window.location.pathname.endsWith('dashboard.html') || 
        window.location.pathname.endsWith('repository.html')) {
        protectRoute();
    }
    
    // Redirect away from auth pages if already logged in
    if (window.location.pathname.endsWith('login.html') || 
        window.location.pathname.endsWith('signup.html')) {
        redirectIfLoggedIn();
    }
});