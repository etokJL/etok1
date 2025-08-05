<div>
    <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">User Management</h2>
            <button wire:click="openCreateModal" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                Add New User
            </button>
        </div>

        <!-- Search -->
        <div class="mb-4">
            <input wire:model.live="search" type="text" placeholder="Search users..."
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        </div>
    </div>

    <!-- Success/Error Messages -->
    @if (session()->has('message'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ session('message') }}
        </div>
    @endif

    @if (session()->has('error'))
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ session('error') }}
        </div>
    @endif

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Airdrops</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @foreach($users as $user)
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div>
                                <div class="text-sm font-medium text-gray-900">
                                    {{ $user->display_name }}
                                </div>
                                @if($user->email)
                                    <div class="text-sm text-gray-500">{{ $user->email }}</div>
                                @endif
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {{ substr($user->wallet_address, 0, 8) }}...{{ substr($user->wallet_address, -6) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $user->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                {{ $user->is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $user->eligible_for_airdrops ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800' }}">
                                {{ $user->eligible_for_airdrops ? 'Eligible' : 'Not Eligible' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ $user->tokens->count() }} tokens
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button wire:click="openEditModal({{ $user->id }})" class="text-blue-600 hover:text-blue-900">Edit</button>
                            <button wire:click="toggleActive({{ $user->id }})" class="text-yellow-600 hover:text-yellow-900">
                                {{ $user->is_active ? 'Deactivate' : 'Activate' }}
                            </button>
                            <button wire:click="toggleAirdropEligibility({{ $user->id }})" class="text-purple-600 hover:text-purple-900">
                                {{ $user->eligible_for_airdrops ? 'Exclude' : 'Include' }}
                            </button>
                            <button wire:click="deleteUser({{ $user->id }})" class="text-red-600 hover:text-red-900"
                                    onclick="return confirm('Are you sure?')">Delete</button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4">
        {{ $users->links() }}
    </div>

    <!-- Create User Modal -->
    @if($showCreateModal)
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Add New User</h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Wallet Address *</label>
                        <input wire:model="wallet_address" type="text" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        @error('wallet_address') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input wire:model="email" type="email" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        @error('email') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Username</label>
                        <input wire:model="username" type="text" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        @error('username') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div class="flex items-center space-x-4">
                        <label class="flex items-center">
                            <input wire:model="is_active" type="checkbox" class="rounded">
                            <span class="ml-2 text-sm text-gray-700">Active</span>
                        </label>

                        <label class="flex items-center">
                            <input wire:model="eligible_for_airdrops" type="checkbox" class="rounded">
                            <span class="ml-2 text-sm text-gray-700">Eligible for Airdrops</span>
                        </label>
                    </div>
                </div>

                <div class="flex justify-end space-x-2 mt-6">
                    <button wire:click="closeModals" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                    <button wire:click="createUser" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Create User</button>
                </div>
            </div>
        </div>
    @endif

    <!-- Edit User Modal -->
    @if($showEditModal)
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Edit User</h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Wallet Address *</label>
                        <input wire:model="wallet_address" type="text" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        @error('wallet_address') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input wire:model="email" type="email" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        @error('email') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Username</label>
                        <input wire:model="username" type="text" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        @error('username') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div class="flex items-center space-x-4">
                        <label class="flex items-center">
                            <input wire:model="is_active" type="checkbox" class="rounded">
                            <span class="ml-2 text-sm text-gray-700">Active</span>
                        </label>

                        <label class="flex items-center">
                            <input wire:model="eligible_for_airdrops" type="checkbox" class="rounded">
                            <span class="ml-2 text-sm text-gray-700">Eligible for Airdrops</span>
                        </label>
                    </div>
                </div>

                <div class="flex justify-end space-x-2 mt-6">
                    <button wire:click="closeModals" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                    <button wire:click="updateUser" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Update User</button>
                </div>
            </div>
        </div>
    @endif
</div>
