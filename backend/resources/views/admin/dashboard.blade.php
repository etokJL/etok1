<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Booster NFT Admin - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @livewireStyles
</head>
<body class="bg-gray-100">
    <div class="min-h-screen">
        <!-- Navigation -->
        <nav class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center space-x-8">
                        <h1 class="text-xl font-bold text-gray-800">🌱 Booster NFT Admin</h1>
                        <div class="flex space-x-4">
                            <a href="{{ route('admin.dashboard') }}" class="text-blue-600 font-medium">Dashboard</a>
                            <a href="{{ route('admin.users') }}" class="text-gray-600 hover:text-blue-600">Users</a>
                            <a href="{{ route('admin.tokens') }}" class="text-gray-600 hover:text-blue-600">Tokens</a>
                            <a href="{{ route('admin.airdrops') }}" class="text-gray-600 hover:text-blue-600">Airdrops</a>
                        </div>
                    </div>
                    <div class="text-sm text-gray-500">
                        {{ now()->format('M d, Y H:i') }}
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto py-6 px-4">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                <p class="text-gray-600">Overview of your Booster NFT dApp</p>
            </div>

            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm">👥</span>
                                </div>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                    <dd class="text-lg font-medium text-gray-900">{{ \App\Models\User::count() }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm">🎁</span>
                                </div>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Eligible for Airdrops</dt>
                                    <dd class="text-lg font-medium text-gray-900">{{ \App\Models\User::eligibleForAirdrops()->count() }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm">🪙</span>
                                </div>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Tokens</dt>
                                    <dd class="text-lg font-medium text-gray-900">{{ \App\Models\AppToken::count() }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm">🚀</span>
                                </div>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Pending Airdrops</dt>
                                    <dd class="text-lg font-medium text-gray-900">{{ \App\Models\Airdrop::pending()->count() }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white shadow rounded-lg p-6 mb-8">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="{{ route('admin.users') }}" class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div class="flex items-center space-x-3">
                            <span class="text-2xl">👥</span>
                            <div>
                                <h4 class="font-medium text-gray-900">Manage Users</h4>
                                <p class="text-sm text-gray-500">Add, edit, or remove users</p>
                            </div>
                        </div>
                    </a>

                    <a href="{{ route('admin.tokens') }}" class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div class="flex items-center space-x-3">
                            <span class="text-2xl">🪙</span>
                            <div>
                                <h4 class="font-medium text-gray-900">Token Management</h4>
                                <p class="text-sm text-gray-500">Track NFTs and Plant Tokens</p>
                            </div>
                        </div>
                    </a>

                    <a href="{{ route('admin.airdrops') }}" class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div class="flex items-center space-x-3">
                            <span class="text-2xl">🎁</span>
                            <div>
                                <h4 class="font-medium text-gray-900">Create Airdrop</h4>
                                <p class="text-sm text-gray-500">Weekly package distribution</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white shadow rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Airdrops</h3>
                <div class="space-y-3">
                    @foreach(\App\Models\Airdrop::orderBy('created_at', 'desc')->limit(5)->get() as $airdrop)
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h4 class="font-medium text-gray-900">{{ $airdrop->title }}</h4>
                                <p class="text-sm text-gray-500">{{ $airdrop->formatted_nft_types }}</p>
                            </div>
                            <div class="text-right">
                                <span class="px-2 py-1 text-xs font-semibold rounded-full
                                    {{ $airdrop->status === 'completed' ? 'bg-green-100 text-green-800' :
                                       ($airdrop->status === 'executing' ? 'bg-blue-100 text-blue-800' :
                                        ($airdrop->status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800')) }}">
                                    {{ ucfirst($airdrop->status) }}
                                </span>
                                <p class="text-xs text-gray-500 mt-1">{{ $airdrop->created_at->diffForHumans() }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    @livewireScripts
</body>
</html>
