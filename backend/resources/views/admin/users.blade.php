<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    @livewireStyles
</head>
<body class="bg-gray-100 min-h-screen">
    <!-- Auth Check -->
    <div id="authCheck" class="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Checking authentication...</p>
        </div>
    </div>

    <!-- Unauthorized Access -->
    <div id="unauthorizedAccess" class="hidden fixed inset-0 bg-white flex items-center justify-center z-50">
        <div class="text-center">
            <div class="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-lock text-red-600 text-2xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p class="text-gray-600 mb-6">You need to be logged in to access this page.</p>
            <a href="/admin/login" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <i class="fas fa-sign-in-alt mr-2"></i>Go to Login
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <div id="mainContent" class="hidden">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm border-b">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <div class="bg-blue-600 rounded-lg p-2 mr-3">
                            <i class="fas fa-shield-alt text-white"></i>
                        </div>
                        <span class="text-xl font-bold text-gray-900">Admin Panel</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600">Welcome, <span id="adminName" class="font-medium"></span></span>
                        <button onclick="logout()" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm">
                            <i class="fas fa-sign-out-alt mr-1"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">
                            <i class="fas fa-users mr-3 text-blue-600"></i>User Management
                        </h1>
                        <p class="text-gray-600">Manage system users and their permissions</p>
                    </div>
                    <div class="flex space-x-4">
                        <a href="/admin" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
                        </a>
                        <a href="/admin/tokens" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <i class="fas fa-coins mr-2"></i>Manage Tokens
                        </a>
                    </div>
                </div>
            </div>

            <!-- Livewire User Management Component -->
            <div class="bg-white rounded-lg shadow-md p-6">
                @livewire('user-management')
            </div>

            <!-- Messages -->
            <div id="messageContainer" class="fixed top-4 right-4 z-40 space-y-2"></div>
        </div>
    </div>

    @livewireScripts

    <script>
        let adminToken = null;
        let adminUser = null;

        // Authentication functions
        function checkAuth() {
            adminToken = localStorage.getItem('admin_token');
            const storedUser = localStorage.getItem('admin_user');

            if (!adminToken) {
                showUnauthorized();
                return false;
            }

            if (storedUser) {
                adminUser = JSON.parse(storedUser);
                document.getElementById('adminName').textContent = adminUser.name;
            }

            // Verify token is still valid
            return fetch('/api/admin/auth/user', {
                headers: {
                    'Authorization': 'Bearer ' + adminToken,
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showMainContent();
                    return true;
                } else {
                    logout();
                    return false;
                }
            })
            .catch(() => {
                logout();
                return false;
            });
        }

        function showMainContent() {
            document.getElementById('authCheck').classList.add('hidden');
            document.getElementById('unauthorizedAccess').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
        }

        function showUnauthorized() {
            document.getElementById('authCheck').classList.add('hidden');
            document.getElementById('mainContent').classList.add('hidden');
            document.getElementById('unauthorizedAccess').classList.remove('hidden');
        }

        function logout() {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/admin/login';
        }

        function showMessage(message, type = 'success') {
            const container = document.getElementById('messageContainer');
            const messageDiv = document.createElement('div');

            const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
            const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';

            messageDiv.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 translate-x-full`;
            messageDiv.innerHTML = `
                <i class="fas ${icon}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.remove()" class="ml-auto">
                    <i class="fas fa-times"></i>
                </button>
            `;

            container.appendChild(messageDiv);

            // Animate in
            setTimeout(() => {
                messageDiv.classList.remove('translate-x-full');
            }, 100);

            // Auto remove after 5 seconds
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.classList.add('translate-x-full');
                    setTimeout(() => messageDiv.remove(), 300);
                }
            }, 5000);
        }

        // Initialize
        window.addEventListener('load', function() {
            checkAuth();
        });
    </script>
</body>
</html>
