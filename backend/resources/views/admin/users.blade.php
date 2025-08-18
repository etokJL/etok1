<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - Booster Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <div class="bg-blue-600 text-white p-4">
            <div class="container mx-auto">
                <h1 class="text-2xl font-bold">🌱 Booster NFT dApp - User Management</h1>
                <p class="text-blue-200">Admin Panel for Managing Users</p>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto p-6">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-gray-500 text-sm">Total Users</h3>
                    <p class="text-3xl font-bold text-blue-600" id="total-users">-</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-gray-500 text-sm">Active Users</h3>
                    <p class="text-3xl font-bold text-green-600" id="active-users">-</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-gray-500 text-sm">With Wallet</h3>
                    <p class="text-3xl font-bold text-purple-600" id="users-with-wallet">-</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-gray-500 text-sm">Recent (7 days)</h3>
                    <p class="text-3xl font-bold text-orange-600" id="recent-registrations">-</p>
                </div>
            </div>

            <!-- Add User Form -->
            <div class="bg-white p-6 rounded-lg shadow mb-8">
                <h2 class="text-xl font-bold mb-4">Add New User</h2>
                <form id="add-user-form" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input type="text" id="user-name" placeholder="Full Name" required
                           class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <input type="email" id="user-email" placeholder="Email Address" required
                           class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <input type="password" id="user-password" placeholder="Password" required
                           class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <input type="text" id="user-wallet" placeholder="Wallet Address (optional)"
                           class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button type="submit"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
                        Add User
                    </button>
                </form>
                <div id="form-message" class="mt-4 hidden"></div>
            </div>

            <!-- Users Table -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold">Users List</h2>
                    <button onclick="loadUsers()" class="text-blue-600 hover:text-blue-800 text-sm">
                        🔄 Refresh
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-table" class="divide-y divide-gray-200">
                            <!-- Users will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Authentication - You need to get a valid token first
        // For testing, use the token from login API
        let authToken = '';

        // Get token from prompt or localStorage
        function getAuthToken() {
            if (!authToken) {
                authToken = localStorage.getItem('admin_token') ||
                          prompt('Enter your admin token (from /api/auth/login):');
                if (authToken) {
                    localStorage.setItem('admin_token', authToken);
                }
            }
            return authToken;
        }

        // Load statistics
        async function loadStats() {
            try {
                const response = await fetch('/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('total-users').textContent = data.stats.total_users;
                    document.getElementById('active-users').textContent = data.stats.active_users;
                    document.getElementById('users-with-wallet').textContent = data.stats.users_with_wallet;
                    document.getElementById('recent-registrations').textContent = data.stats.recent_registrations;
                }
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }

        // Load users
        async function loadUsers() {
            try {
                const response = await fetch('/api/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const tbody = document.getElementById('users-table');
                    tbody.innerHTML = '';

                    data.users.forEach(user => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="px-6 py-4 text-sm text-gray-900">${user.id}</td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">${user.name}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">${user.email}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">${user.wallet_address || '-'}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                    ${user.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">${new Date(user.created_at).toLocaleDateString()}</td>
                            <td class="px-6 py-4 text-sm">
                                <button onclick="testLogin('${user.email}')" class="text-blue-600 hover:text-blue-800 mr-2">Test Login</button>
                                <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    showMessage('Failed to load users', 'error');
                }
            } catch (error) {
                console.error('Error loading users:', error);
                showMessage('Error loading users', 'error');
            }
        }

        // Add new user
        document.getElementById('add-user-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                password: document.getElementById('user-password').value,
                wallet_address: document.getElementById('user-wallet').value || null
            };

            try {
                const response = await fetch('/api/admin/users', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(`User "${data.user.name}" created successfully!`, 'success');
                    document.getElementById('add-user-form').reset();
                    loadUsers();
                    loadStats();
                } else {
                    showMessage(data.message || 'Failed to create user', 'error');
                }
            } catch (error) {
                console.error('Error creating user:', error);
                showMessage('Error creating user', 'error');
            }
        });

        // Test login for a user
        function testLogin(email) {
            const password = prompt(`Enter password for ${email} to test login:`);
            if (!password) return;

            fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`✅ Login successful for ${email}!\nToken: ${data.data.token.substring(0, 20)}...`);
                } else {
                    alert(`❌ Login failed: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`❌ Login error: ${error.message}`);
            });
        }

        // Delete user
        async function deleteUser(userId) {
            if (!confirm('Are you sure you want to delete this user?')) return;

            try {
                const response = await fetch(`/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('User deleted successfully', 'success');
                    loadUsers();
                    loadStats();
                } else {
                    showMessage(data.message || 'Failed to delete user', 'error');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                showMessage('Error deleting user', 'error');
            }
        }

        // Show message
        function showMessage(message, type) {
            const messageDiv = document.getElementById('form-message');
            messageDiv.className = `mt-4 p-3 rounded ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
            messageDiv.textContent = message;
            messageDiv.classList.remove('hidden');

            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 5000);
        }

        // Load data on page load
        document.addEventListener('DOMContentLoaded', () => {
            loadStats();
            loadUsers();
        });
    </script>
</body>
</html>
