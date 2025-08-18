<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Booster NFT</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-900 to-purple-900 min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-shield-alt text-white text-2xl"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p class="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
        </div>

        <!-- Login Form -->
        <form id="loginForm" class="space-y-6">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-envelope mr-2"></i>Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="admin@example.com"
                >
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-lock mr-2"></i>Password
                </label>
                <div class="relative">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                        placeholder="Your password"
                    >
                    <button
                        type="button"
                        onclick="togglePassword()"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <i id="passwordIcon" class="fas fa-eye"></i>
                    </button>
                </div>
            </div>

            <!-- Error Message -->
            <div id="errorMessage" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span id="errorText"></span>
            </div>

            <!-- Success Message -->
            <div id="successMessage" class="hidden bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <i class="fas fa-check-circle mr-2"></i>
                Login successful! Redirecting...
            </div>

            <button
                type="submit"
                id="submitButton"
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
                <span id="submitText">
                    <i class="fas fa-sign-in-alt mr-2"></i>Sign In
                </span>
                <span id="loadingSpinner" class="hidden">
                    <i class="fas fa-spinner fa-spin mr-2"></i>Signing In...
                </span>
            </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
            <p class="text-sm text-gray-500">
                <i class="fas fa-info-circle mr-1"></i>
                Use your admin credentials to access the panel
            </p>
        </div>
    </div>

    <script>
        // Toggle password visibility
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const passwordIcon = document.getElementById('passwordIcon');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordIcon.className = 'fas fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                passwordIcon.className = 'fas fa-eye';
            }
        }

        // Show/hide messages
        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            const errorText = document.getElementById('errorText');
            const successDiv = document.getElementById('successMessage');

            successDiv.classList.add('hidden');
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
        }

        function showSuccess() {
            const errorDiv = document.getElementById('errorMessage');
            const successDiv = document.getElementById('successMessage');

            errorDiv.classList.add('hidden');
            successDiv.classList.remove('hidden');
        }

        function hideMessages() {
            document.getElementById('errorMessage').classList.add('hidden');
            document.getElementById('successMessage').classList.add('hidden');
        }

        // Toggle loading state
        function setLoading(loading) {
            const submitButton = document.getElementById('submitButton');
            const submitText = document.getElementById('submitText');
            const loadingSpinner = document.getElementById('loadingSpinner');

            if (loading) {
                submitButton.disabled = true;
                submitButton.classList.add('opacity-75', 'cursor-not-allowed');
                submitText.classList.add('hidden');
                loadingSpinner.classList.remove('hidden');
            } else {
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
                submitText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
            }
        }

        // Handle form submission
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            hideMessages();
            setLoading(true);

            try {
                const response = await fetch('/api/admin/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Store the token in localStorage
                    localStorage.setItem('admin_token', data.token);
                    localStorage.setItem('admin_user', JSON.stringify(data.admin));

                    showSuccess();

                    // Redirect after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = '/admin';
                    }, 1500);

                } else {
                    showError(data.message || 'Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        });

        // Check if already logged in
        window.addEventListener('load', function() {
            const token = localStorage.getItem('admin_token');
            if (token) {
                // Verify token is still valid
                fetch('/api/admin/auth/user', {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Already logged in, redirect to admin
                        window.location.href = '/admin';
                    } else {
                        // Invalid token, remove it
                        localStorage.removeItem('admin_token');
                        localStorage.removeItem('admin_user');
                    }
                })
                .catch(() => {
                    // Network error, remove token to be safe
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                });
            }
        });
    </script>
</body>
</html>
