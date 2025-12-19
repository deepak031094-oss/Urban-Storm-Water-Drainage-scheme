document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status when dashboard loads
    checkAuthStatus();
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

async function checkAuthStatus() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // No token found, redirect to login
            window.location.href = '/login.html';
            return;
        }

        // Verify token with server
        const response = await fetch('http://localhost:3000/api/check-auth', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.isAuthenticated) {
            // Token is invalid or expired, clear and redirect
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
        // If authenticated, continue loading the dashboard
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    }
}

async function handleLogout() {
    try {
        // Call the logout API
        await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    }
}
