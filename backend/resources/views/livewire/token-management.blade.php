<div class="space-y-6">
    <!-- Success Message -->
    @if (session()->has('message'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ session('message') }}</span>
        </div>
    @endif

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-100 p-4 rounded-lg border border-blue-200">
            <h3 class="text-lg font-semibold text-blue-800">Total Tokens</h3>
            <p class="text-2xl font-bold text-blue-900">{{ $stats['total_tokens'] }}</p>
        </div>
        <div class="bg-green-100 p-4 rounded-lg border border-green-200">
            <h3 class="text-lg font-semibold text-green-800">ERC721A NFTs</h3>
            <p class="text-2xl font-bold text-green-900">{{ $stats['erc721a_count'] }}</p>
        </div>
        <div class="bg-purple-100 p-4 rounded-lg border border-purple-200">
            <h3 class="text-lg font-semibold text-purple-800">ERC1155 Plants</h3>
            <p class="text-2xl font-bold text-purple-900">{{ $stats['erc1155_count'] }}</p>
        </div>
        <div class="bg-yellow-100 p-4 rounded-lg border border-yellow-200">
            <h3 class="text-lg font-semibold text-yellow-800">Unique Owners</h3>
            <p class="text-2xl font-bold text-yellow-900">{{ $stats['unique_owners'] }}</p>
        </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex flex-wrap gap-4 items-center justify-between">
            <div class="flex flex-wrap gap-4 items-center">
                <!-- Search -->
                <div class="flex-1 min-w-64">
                    <input
                        type="text"
                        wire:model.live="search"
                        placeholder="Search tokens, owners, addresses..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                </div>

                <!-- Type Filter -->
                <select wire:model.live="filter_type" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Types</option>
                    <option value="erc721a">ERC721A NFTs</option>
                    <option value="erc1155">ERC1155 Plants</option>
                </select>

                <!-- Contract Filter -->
                <select wire:model.live="filter_contract" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Contracts</option>
                    @foreach($contractAddresses as $address)
                        <option value="{{ $address }}">{{ Str::limit($address, 20) }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Create Button -->
            <button
                wire:click="openCreateModal"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
            >
                ➕ Create Token
            </button>
        </div>
    </div>

    <!-- Tokens Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($tokens as $token)
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center space-x-3">
                                    @if($token->has_image)
                                        <div class="flex-shrink-0 h-12 w-12">
                                            <img class="h-12 w-12 rounded-lg object-cover" src="{{ $token->image_path }}" alt="{{ $token->nft_type_name }}">
                                        </div>
                                    @else
                                        <div class="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                            @if($token->token_type === 'erc721a')
                                                <span class="text-gray-500 text-xs">NFT</span>
                                            @else
                                                <span class="text-gray-500 text-xs">🌱</span>
                                            @endif
                                        </div>
                                    @endif
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">
                                            @if($token->nft_type_name)
                                                {{ ucfirst(str_replace('-', ' ', $token->nft_type_name)) }}
                                            @else
                                                {{ $token->name }}
                                            @endif
                                        </div>
                                        <div class="text-sm text-gray-500">ID: {{ $token->token_id }}</div>
                                        @if($token->token_type === 'erc1155' && $token->sub_units)
                                            <div class="text-xs text-purple-600">{{ number_format($token->sub_units) }} units</div>
                                        @elseif($token->nft_type)
                                            <div class="text-xs text-green-600">Type {{ $token->nft_type }}</div>
                                        @endif
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($token->token_type === 'erc721a')
                                    <span class="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">ERC721A</span>
                                @else
                                    <span class="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">ERC1155</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ Str::limit($token->owner_address, 16) }}</div>
                                @if($token->owner && $token->owner->username)
                                    <div class="text-xs text-gray-500">{{ $token->owner->username }}</div>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ Str::limit($token->contract_address, 16) }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>{{ $token->created_at->format('M d, Y') }}</div>
                                <div class="text-xs text-gray-400">{{ $token->created_at->format('H:i:s') }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                    wire:click="openEditModal({{ $token->id }})"
                                    class="text-blue-600 hover:text-blue-900"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    wire:click="deleteToken({{ $token->id }})"
                                    onclick="return confirm('Are you sure you want to delete this token?')"
                                    class="text-red-600 hover:text-red-900"
                                >
                                    🗑️ Delete
                                </button>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                                No tokens found. Create your first token to get started!
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-3 border-t border-gray-200">
            {{ $tokens->links() }}
        </div>
    </div>

    <!-- Create Token Modal -->
    @if($showCreateModal)
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Token</h3>

                    <form wire:submit.prevent="createToken" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Token Type</label>
                            <select wire:model="token_type" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="erc721a">ERC721A NFT (Quest Game)</option>
                                <option value="erc1155">ERC1155 Plant Token</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Contract Address</label>
                            <input type="text" wire:model="contract_address" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Token ID</label>
                            <input type="text" wire:model="token_id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Owner Address</label>
                            <input type="text" wire:model="owner_address" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Token Name</label>
                            <input type="text" wire:model="name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>

                        @if($token_type === 'erc721a')
                            <div>
                                <label class="block text-sm font-medium text-gray-700">NFT Type</label>
                                <select wire:model="nft_type" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                    @foreach($this->nftTypes as $typeId => $typeConfig)
                                        <option value="{{ $typeId }}">{{ $typeId }} - {{ ucfirst(str_replace('-', ' ', $typeConfig['name'])) }}</option>
                                    @endforeach
                                </select>
                            </div>
                        @endif

                        @if($token_type === 'erc1155')
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Sub-Units (Energy)</label>
                                <input type="number" wire:model="sub_units" min="1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                        @endif

                        <div>
                            <label class="block text-sm font-medium text-gray-700">QR Code (optional)</label>
                            <input type="text" wire:model="qr_code" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>

                        <div class="flex justify-end space-x-2 pt-4">
                            <button type="button" wire:click="closeModals" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Create Token
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endif

    <!-- Edit Token Modal -->
    @if($showEditModal && $editingToken)
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Token</h3>

                    <form wire:submit.prevent="updateToken" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Token Type</label>
                            <select wire:model="token_type" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="erc721a">ERC721A NFT (Quest Game)</option>
                                <option value="erc1155">ERC1155 Plant Token</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Contract Address</label>
                            <input type="text" wire:model="contract_address" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Token ID</label>
                            <input type="text" wire:model="token_id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Owner Address</label>
                            <input type="text" wire:model="owner_address" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Token Name</label>
                            <input type="text" wire:model="name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>

                        @if($token_type === 'erc721a')
                            <div>
                                <label class="block text-sm font-medium text-gray-700">NFT Type</label>
                                <select wire:model="nft_type" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                    @foreach($this->nftTypes as $typeId => $typeConfig)
                                        <option value="{{ $typeId }}">{{ $typeId }} - {{ ucfirst(str_replace('-', ' ', $typeConfig['name'])) }}</option>
                                    @endforeach
                                </select>
                            </div>
                        @endif

                        @if($token_type === 'erc1155')
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Sub-Units (Energy)</label>
                                <input type="number" wire:model="sub_units" min="1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                        @endif

                        <div>
                            <label class="block text-sm font-medium text-gray-700">QR Code (optional)</label>
                            <input type="text" wire:model="qr_code" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>

                        <div class="flex justify-end space-x-2 pt-4">
                            <button type="button" wire:click="closeModals" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Update Token
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endif
</div>
