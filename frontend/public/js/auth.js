// Check if user is authenticated
const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return false;
    }

    try {
        const response = await fetch('/api/check-auth', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        if (!data.isAuthenticated) {
            localStorage.removeItem('token');
            window.location.href = '/';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        window.location.href = '/';
        return false;
    }
};

// Logout function
const logout = async () => {
    try {
        // Try to call the server-side logout endpoint
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        // Clear the token regardless of the server response
        localStorage.removeItem('token');
        
        // Redirect to login page
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear token and redirect even if server logout fails
        localStorage.removeItem('token');
        window.location.href = '/';
    }
};

// Add event listener for logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Export for use in other files
window.auth = { checkAuth, logout };

// Check auth status when page loads
checkAuth().then(isAuthenticated => {
    if (isAuthenticated) {
        // User is authenticated, you can fetch user data here if needed
        console.log('User is authenticated');
    }
});
