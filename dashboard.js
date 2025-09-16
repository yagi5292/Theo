function renderUserAvatar(user) {
    const avatarContainer = document.getElementById('avatar');
    if (!avatarContainer) return; // Prevent error if element not found

    avatarContainer.innerHTML = '';

    if (user.avatarUrl && user.avatarUrl.trim() !== '') {
        // User has an avatar image
        const img = document.createElement('img');
        img.src = user.avatarUrl;
        img.alt = user.name || 'User';
        img.className = 'avatar-img';
        avatarContainer.appendChild(img);
    } else {
        // No avatar: use first letter of name
        const letter = user.name && user.name.length > 0
            ? user.name.charAt(0).toUpperCase()
            : '?';
        const div = document.createElement('div');
        div.className = 'avatar-letter';
        div.textContent = letter;
        avatarContainer.appendChild(div);
    }
}

// Example CSS (add to your CSS file)
/*
.avatar-letter {
    width: 40px;
    height: 40px;
    background: #007bff;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
}
.avatar-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}
*/