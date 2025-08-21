<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Booster NFT</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    @livewireStyles
</head>
<body class="bg-gray-100 min-h-screen">

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
                    <span class="text-sm text-gray-600">Welcome, <span class="font-medium">{{ auth()->user()->name ?? 'Admin' }}</span></span>
                    <form method="POST" action="{{ route('admin.logout') }}" class="inline">
                        @csrf
                        <button type="submit" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm">
                            <i class="fas fa-sign-out-alt mr-1"></i>Logout
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-4xl font-bold mb-2">
                        🌱 Booster NFT dApp
                    </h1>
                    <p class="text-blue-100 text-lg">Admin Dashboard - Manage your NFT ecosystem</p>
                </div>
                <div class="hidden md:block">
                    <div class="bg-white/20 rounded-lg p-4">
                        <i class="fas fa-chart-line text-4xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <a href="/admin/users" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group">
                <div class="flex items-center">
                    <div class="bg-blue-100 rounded-lg p-3 mr-4 group-hover:bg-blue-200 transition-colors">
                        <i class="fas fa-users text-blue-600 text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">User Management</h3>
                        <p class="text-sm text-gray-600">Manage system users</p>
                    </div>
                </div>
            </a>

            <a href="/admin/tokens" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group">
                <div class="flex items-center">
                    <div class="bg-green-100 rounded-lg p-3 mr-4 group-hover:bg-green-200 transition-colors">
                        <i class="fas fa-coins text-green-600 text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">NFT Tokens</h3>
                        <p class="text-sm text-gray-600">View NFT collection</p>
                    </div>
                </div>
            </a>

            <a href="/admin/airdrops" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group">
                <div class="flex items-center">
                    <div class="bg-purple-100 rounded-lg p-3 mr-4 group-hover:bg-purple-200 transition-colors">
                        <i class="fas fa-gift text-purple-600 text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Airdrops</h3>
                        <p class="text-sm text-gray-600">Manage airdrop campaigns</p>
                    </div>
                </div>
            </a>

            <a href="http://localhost:3000" target="_blank" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group">
                <div class="flex items-center">
                    <div class="bg-orange-100 rounded-lg p-3 mr-4 group-hover:bg-orange-200 transition-colors">
                        <i class="fas fa-external-link-alt text-orange-600 text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Frontend App</h3>
                        <p class="text-sm text-gray-600">View live application</p>
                    </div>
                </div>
            </a>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- System Stats -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-chart-bar mr-2 text-blue-600"></i>System Overview
                </h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600">Total Users</span>
                        <span class="font-bold text-gray-900">{{ \App\Models\User::count() }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600">Active Users</span>
                        <span class="font-bold text-green-600">{{ \App\Models\User::where('is_active', true)->count() }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600">Users with Wallets</span>
                        <span class="font-bold text-purple-600">{{ \App\Models\User::whereNotNull('wallet_address')->count() }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600">Recent Registrations (7d)</span>
                        <span class="font-bold text-orange-600">{{ \App\Models\User::where('created_at', '>=', now()->subDays(7))->count() }}</span>
                    </div>
                </div>
            </div>

            <!-- Quick Info -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-info-circle mr-2 text-green-600"></i>Quick Info
                </h2>
                <div class="space-y-4">
                    <div class="bg-blue-50 rounded-lg p-4">
                        <div class="flex items-center">
                            <i class="fas fa-server text-blue-600 mr-3"></i>
                            <div>
                                <h3 class="font-medium text-gray-900">Backend API</h3>
                                <p class="text-sm text-gray-600">Laravel backend running on port 8000</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4">
                        <div class="flex items-center">
                            <i class="fas fa-globe text-green-600 mr-3"></i>
                            <div>
                                <h3 class="font-medium text-gray-900">Frontend App</h3>
                                <p class="text-sm text-gray-600">Next.js application on port 3000</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-4">
                        <div class="flex items-center">
                            <i class="fas fa-link text-purple-600 mr-3"></i>
                            <div>
                                <h3 class="font-medium text-gray-900">Blockchain</h3>
                                <p class="text-sm text-gray-600">Hardhat network on port 8545</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">
                <i class="fas fa-clock mr-2 text-orange-600"></i>System Status
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <div>
                            <h3 class="font-medium text-gray-900">Backend API</h3>
                            <p class="text-sm text-green-600">Online & Operational</p>
                        </div>
                    </div>
                </div>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <div>
                            <h3 class="font-medium text-gray-900">Database</h3>
                            <p class="text-sm text-blue-600">SQLite Connected</p>
                        </div>
                    </div>
                </div>
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        <div>
                            <h3 class="font-medium text-gray-900">Authentication</h3>
                            <p class="text-sm text-purple-600">Livewire Protected</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @livewireScripts
</body>
</html>
