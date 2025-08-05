<div>
    <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">Airdrop System</h2>
            <div class="flex space-x-4">
                <div class="bg-blue-100 px-4 py-2 rounded-lg">
                    <span class="text-sm text-blue-800">Eligible Users: {{ $eligibleUsersCount }}</span>
                </div>
                <button wire:click="openCreateModal" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                    Create Airdrop
                </button>
            </div>
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

    <!-- Airdrops Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NFT Types</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @foreach($airdrops as $airdrop)
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">{{ $airdrop->title }}</div>
                            @if($airdrop->transaction_hash)
                                <div class="text-xs text-gray-500 font-mono">{{ substr($airdrop->transaction_hash, 0, 12) }}...</div>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{{ $airdrop->package_id }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ $airdrop->formatted_nft_types }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            @if($airdrop->status === 'pending')
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                            @elseif($airdrop->status === 'executing')
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Executing</span>
                            @elseif($airdrop->status === 'completed')
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                            @else
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Failed</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ $airdrop->completed_recipients }}/{{ $airdrop->total_recipients }}</div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $airdrop->progress_percentage }}%"></div>
                            </div>
                            <div class="text-xs text-gray-500">{{ $airdrop->progress_percentage }}%</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ $airdrop->scheduled_at ? $airdrop->scheduled_at->format('M d, H:i') : 'Immediate' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            @if($airdrop->canExecute())
                                <button wire:click="executeAirdrop({{ $airdrop->id }})"
                                        class="text-green-600 hover:text-green-900"
                                        onclick="return confirm('Execute this airdrop?')">Execute</button>
                            @endif

                            @if($airdrop->status === 'failed')
                                <button wire:click="retryAirdrop({{ $airdrop->id }})" class="text-blue-600 hover:text-blue-900">Retry</button>
                            @endif

                            @if($airdrop->status === 'pending')
                                <button wire:click="deleteAirdrop({{ $airdrop->id }})"
                                        class="text-red-600 hover:text-red-900"
                                        onclick="return confirm('Delete this airdrop?')">Delete</button>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4">
        {{ $airdrops->links() }}
    </div>

    <!-- Create Airdrop Modal -->
    @if($showCreateModal)
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Airdrop</h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Title *</label>
                        <input wire:model="title" type="text" placeholder="e.g., Weekly Drop #1"
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        @error('title') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Package ID *</label>
                        <input wire:model="package_id" type="text" placeholder="Smart contract package ID"
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        @error('package_id') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">NFT Types *</label>
                        <input wire:model="nft_types" type="text" placeholder="e.g., 1,2,3,4,5"
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        <p class="text-xs text-gray-500 mt-1">Comma-separated list of NFT type numbers</p>
                        @error('nft_types') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Schedule (Optional)</label>
                        <input wire:model="scheduled_at" type="datetime-local"
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        <p class="text-xs text-gray-500 mt-1">Leave empty for immediate execution</p>
                    </div>

                    <div class="bg-blue-50 p-3 rounded-md">
                        <p class="text-sm text-blue-800">
                            <strong>Recipients:</strong> {{ $eligibleUsersCount }} eligible users will receive this airdrop.
                        </p>
                    </div>
                </div>

                <div class="flex justify-end space-x-2 mt-6">
                    <button wire:click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                    <button wire:click="createAirdrop" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Create Airdrop</button>
                </div>
            </div>
        </div>
    @endif
</div>
