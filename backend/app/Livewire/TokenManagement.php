<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\AppToken;
use App\Models\AppUser;

class TokenManagement extends Component
{
    use WithPagination;

    public $search = '';
    public $filter_type = 'all';
    public $filter_contract = 'all';
    public $showCreateModal = false;
    public $showEditModal = false;
    public $editingToken = null;

    // Form properties
    public $contract_address = '';
    public $token_type = 'erc721a';
    public $token_id = '';
    public $owner_address = '';
    public $name = '';
    public $sub_units = 1000;
    public $qr_code = '';
    public $metadata = [];
    public $nft_type = 1;

    protected $queryString = [
        'search' => ['except' => ''],
        'filter_type' => ['except' => 'all'],
        'filter_contract' => ['except' => 'all'],
    ];

    public function mount()
    {
        $this->resetPage();
    }

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updatingFilterType()
    {
        $this->resetPage();
    }

    public function updatingFilterContract()
    {
        $this->resetPage();
    }

    public function openCreateModal()
    {
        $this->resetForm();
        $this->showCreateModal = true;
    }

    public function openEditModal($tokenId)
    {
        $token = AppToken::findOrFail($tokenId);
        $this->editingToken = $token;

        $this->contract_address = $token->contract_address;
        $this->token_type = $token->token_type;
        $this->token_id = $token->token_id;
        $this->owner_address = $token->owner_address;
        $this->name = $token->name;
        $this->sub_units = $token->sub_units ?? 1000;
        $this->qr_code = $token->qr_code ?? '';
        $this->metadata = $token->metadata ?? [];
        $this->nft_type = $token->metadata['nft_type'] ?? 1;

        $this->showEditModal = true;
    }

    public function closeModals()
    {
        $this->showCreateModal = false;
        $this->showEditModal = false;
        $this->editingToken = null;
        $this->resetForm();
    }

    public function resetForm()
    {
        $this->contract_address = '';
        $this->token_type = 'erc721a';
        $this->token_id = '';
        $this->owner_address = '';
        $this->name = '';
        $this->sub_units = 1000;
        $this->qr_code = '';
        $this->metadata = [];
        $this->nft_type = 1;
    }

    public function createToken()
    {
        $this->validate([
            'contract_address' => 'required|string',
            'token_type' => 'required|in:erc721a,erc1155',
            'token_id' => 'required|string',
            'owner_address' => 'required|string',
            'name' => 'required|string|max:255',
            'sub_units' => 'nullable|integer|min:1',
        ]);

        $metadata = $this->metadata ?: [];
        if ($this->token_type === 'erc721a') {
            $metadata['nft_type'] = $this->nft_type;
        }

        AppToken::create([
            'contract_address' => $this->contract_address,
            'token_type' => $this->token_type,
            'token_id' => $this->token_id,
            'owner_address' => $this->owner_address,
            'name' => $this->name,
            'sub_units' => $this->sub_units,
            'qr_code' => $this->qr_code,
            'metadata' => $metadata,
        ]);

        session()->flash('message', 'Token created successfully!');
        $this->closeModals();
    }

    public function updateToken()
    {
        $this->validate([
            'contract_address' => 'required|string',
            'token_type' => 'required|in:erc721a,erc1155',
            'token_id' => 'required|string',
            'owner_address' => 'required|string',
            'name' => 'required|string|max:255',
            'sub_units' => 'nullable|integer|min:1',
        ]);

        $metadata = $this->metadata ?: [];
        if ($this->token_type === 'erc721a') {
            $metadata['nft_type'] = $this->nft_type;
        }

        $this->editingToken->update([
            'contract_address' => $this->contract_address,
            'token_type' => $this->token_type,
            'token_id' => $this->token_id,
            'owner_address' => $this->owner_address,
            'name' => $this->name,
            'sub_units' => $this->sub_units,
            'qr_code' => $this->qr_code,
            'metadata' => $metadata,
        ]);

        session()->flash('message', 'Token updated successfully!');
        $this->closeModals();
    }

    public function deleteToken($tokenId)
    {
        $token = AppToken::findOrFail($tokenId);
        $token->delete();

        session()->flash('message', 'Token deleted successfully!');
    }

    public function getContractAddresses()
    {
        return AppToken::select('contract_address')
            ->distinct()
            ->orderBy('contract_address')
            ->pluck('contract_address');
    }

    public function getNftTypesProperty()
    {
        return AppToken::getNftTypesConfig();
    }

    public function render()
    {
        $query = AppToken::query()
            ->with('owner');

        // Apply search
        if ($this->search) {
            $query->where(function ($q) {
                $q->where('name', 'like', '%' . $this->search . '%')
                  ->orWhere('token_id', 'like', '%' . $this->search . '%')
                  ->orWhere('owner_address', 'like', '%' . $this->search . '%')
                  ->orWhere('contract_address', 'like', '%' . $this->search . '%');
            });
        }

        // Apply type filter
        if ($this->filter_type !== 'all') {
            $query->where('token_type', $this->filter_type);
        }

        // Apply contract filter
        if ($this->filter_contract !== 'all') {
            $query->where('contract_address', $this->filter_contract);
        }

        $tokens = $query->orderBy('created_at', 'desc')->paginate(10);

        $stats = [
            'total_tokens' => AppToken::count(),
            'erc721a_count' => AppToken::where('token_type', 'erc721a')->count(),
            'erc1155_count' => AppToken::where('token_type', 'erc1155')->count(),
            'unique_owners' => AppToken::distinct('owner_address')->count(),
        ];

        return view('livewire.token-management', [
            'tokens' => $tokens,
            'stats' => $stats,
            'contractAddresses' => $this->getContractAddresses(),
        ]);
    }
}
