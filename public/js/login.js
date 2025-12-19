document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token and redirect if valid
        checkAuthStatus();
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const loginButton = loginForm.querySelector('button[type="submit"]');
        
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        // Show loading state
        const originalButtonText = loginButton.innerHTML;
        loginButton.disabled = true;
        loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
        
        try {
            console.log('Attempting login with:', { username });
            const apiUrl = 'http://localhost:3000/api/auth/login';
            console.log('Calling API:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // Important for cookies/sessions if used
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Login error response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Login successful, response data:', data);
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Token stored, redirecting to dashboard...');
                window.location.href = '/dashboard.html';
            } else {
                throw new Error('No token received from server');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            alert(`Login failed: ${error.message || 'Please check your credentials and try again.'}`);
        } finally {
            loginButton.disabled = false;
            loginButton.innerHTML = originalButtonText;
        }
    });
});

async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('http://localhost:5000/api/check-auth', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.isAuthenticated) {
                window.location.href = '/dashboard.html';
            }
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
    }
}
