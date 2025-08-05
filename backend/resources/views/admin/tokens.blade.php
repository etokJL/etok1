<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Token Management - Booster Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @livewireStyles
</head>
<body class="bg-gray-100">
    <div class="min-h-screen">
        <!-- Navigation -->
        <nav class="bg-blue-600 text-white p-4">
            <div class="container mx-auto flex justify-between items-center">
                <h1 class="text-xl font-bold">🌱 Booster NFT dApp - Admin Panel</h1>
                <div class="flex space-x-4">
                    <a href="/admin" class="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</a>
                    <a href="/admin/users" class="hover:bg-blue-700 px-3 py-2 rounded">Users</a>
                    <a href="/admin/tokens" class="bg-blue-800 px-3 py-2 rounded">Tokens</a>
                    <a href="/admin/airdrops" class="hover:bg-blue-700 px-3 py-2 rounded">Airdrops</a>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="container mx-auto p-6">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">🎮 Token Management</h2>
                    <div class="flex space-x-2">
                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">ERC721A NFTs</span>
                        <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">ERC1155 Plants</span>
                    </div>
                </div>

                @livewire('token-management')
            </div>
        </div>
    </div>

    @livewireScripts
</body>
</html>
