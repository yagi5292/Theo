// Main JavaScript functionality

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Initialize the application
function initApp() {
    // Check if user is logged in
    checkAuthState();
    
    // Set up event listeners
    setupEventListeners();
}

// Check authentication state
function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('githubCloneUser'));
    const currentPath = window.location.pathname;
    
    // Redirect logic based on auth state
    if (user && (currentPath.endsWith('login.html') || currentPath.endsWith('signup.html'))) {
        window.location.href = 'dashboard.html';
    } else if (!user && currentPath.endsWith('dashboard.html')) {
        window.location.href = 'login.html';
    }
    
    // Update UI based on auth state
    updateUIForAuthState(user);
}

// Set up event listeners
function setupEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Repository creation form
    const repoForm = document.getElementById('repoForm');
    if (repoForm) {
        repoForm.addEventListener('submit', handleRepoCreate);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMobileMenu);
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('githubCloneUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user session
        localStorage.setItem('githubCloneUser', JSON.stringify(user));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        showAlert('Invalid email or password', 'error');
    }
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!username || !email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('githubCloneUsers')) || [];
    if (users.some(u => u.email === email)) {
        showAlert('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username,
        email,
        password, // Note: In a real app, you would hash the password
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('githubCloneUsers', JSON.stringify(users));
    
    // Store user session
    localStorage.setItem('githubCloneUser', JSON.stringify(newUser));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Handle repository creation
function handleRepoCreate(e) {
    e.preventDefault();
    
    const name = document.getElementById('repoName').value;
    const description = document.getElementById('repoDescription').value;
    const isPublic = document.getElementById('repoPublic').checked;
    
    // Simple validation
    if (!name) {
        showAlert('Repository name is required', 'error');
        return;
    }
    
    // Get current user
    const user = JSON.parse(localStorage.getItem('githubCloneUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Create repository object
    const repo = {
        id: Date.now(),
        name,
        description,
        isPublic,
        owner: user.id,
        createdAt: new Date().toISOString(),
        stars: 0,
        forks: 0,
        issues: 0,
        pulls: 0
    };
    
    // Save repository
    const repos = JSON.parse(localStorage.getItem('githubCloneRepos')) || [];
    repos.push(repo);
    localStorage.setItem('githubCloneRepos', JSON.stringify(repos));
    
    // Redirect to dashboard
    showAlert('Repository created successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('githubCloneUser');
    window.location.href = 'index.html';
}

// Update UI based on authentication state
function updateUIForAuthState(user) {
    // Update dashboard with user info
    const userElement = document.getElementById('userName');
    if (userElement && user) {
        userElement.textContent = user.username;
    }
    
    // Load repositories if on dashboard
    if (window.location.pathname.endsWith('dashboard.html') && user) {
        loadUserRepositories(user.id);
    }
}

// Load user repositories
function loadUserRepositories(userId) {
    const repos = JSON.parse(localStorage.getItem('githubCloneRepos')) || [];
    const userRepos = repos.filter(repo => repo.owner === userId);
    
    const repoList = document.getElementById('repoList');
    if (repoList) {
        if (userRepos.length === 0) {
            repoList.innerHTML = `
                <div class="empty-state">
                    <h3>You don't have any repositories yet</h3>
                    <p>Create your first repository to get started</p>
                    <a href="repository.html" class="btn btn-primary">Create repository</a>
                </div>
            `;
        } else {
            repoList.innerHTML = userRepos.map(repo => `
                <li class="repo-item">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description'}</p>
                    <div class="repo-meta">
                        <span>${repo.isPublic ? 'Public' : 'Private'}</span>
                        <span>Created: ${new Date(repo.createdAt).toLocaleDateString()}</span>
                    </div>
                </li>
            `).join('');
        }
    }
}

// Show alert message
function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Style the alert
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.padding = '12px 20px';
    alert.style.borderRadius = '6px';
    alert.style.color = 'white';
    alert.style.zIndex = '1000';
    alert.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    
    if (type === 'error') {
        alert.style.background = '#cf222e';
    } else {
        alert.style.background = '#2da44e';
    }
    
    // Add to page
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Toggle mobile menu
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-desktop');
    if (nav) {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    }
}