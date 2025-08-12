<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Booster NFT Admin - Airdrops</title>
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
                            <a href="{{ route('admin.dashboard') }}" class="text-gray-600 hover:text-blue-600">Dashboard</a>
                            <a href="{{ route('admin.users') }}" class="text-gray-600 hover:text-blue-600">Users</a>
                            <a href="{{ route('admin.tokens') }}" class="text-gray-600 hover:text-blue-600">Tokens</a>
                            <a href="{{ route('admin.airdrops') }}" class="text-blue-600 font-medium">Airdrops</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto py-6 px-4">
            @livewire('airdrop-system')
        </div>
    </div>

    @livewireScripts
</body>
</html>
