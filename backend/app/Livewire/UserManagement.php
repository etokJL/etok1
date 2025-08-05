<?php

namespace App\Livewire;

use App\Models\AppUser;
use Livewire\Component;
use Livewire\WithPagination;

class UserManagement extends Component
{
    use WithPagination;

    public $search = '';
    public $showCreateModal = false;
    public $showEditModal = false;
    public $selectedUser = null;

    // Form fields
    public $wallet_address = '';
    public $email = '';
    public $username = '';
    public $is_active = true;
    public $eligible_for_airdrops = true;

    protected $rules = [
        'wallet_address' => 'required|string|min:42|max:42',
        'email' => 'nullable|email',
        'username' => 'nullable|string|max:255',
        'is_active' => 'boolean',
        'eligible_for_airdrops' => 'boolean'
    ];

    public function render()
    {
        $users = AppUser::where('wallet_address', 'like', '%' . $this->search . '%')
            ->orWhere('username', 'like', '%' . $this->search . '%')
            ->orWhere('email', 'like', '%' . $this->search . '%')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return view('livewire.user-management', [
            'users' => $users
        ]);
    }

    public function openCreateModal()
    {
        $this->resetForm();
        $this->showCreateModal = true;
    }

    public function openEditModal($userId)
    {
        $user = AppUser::find($userId);
        if ($user) {
            $this->selectedUser = $user;
            $this->wallet_address = $user->wallet_address;
            $this->email = $user->email;
            $this->username = $user->username;
            $this->is_active = $user->is_active;
            $this->eligible_for_airdrops = $user->eligible_for_airdrops;
            $this->showEditModal = true;
        }
    }

    public function createUser()
    {
        $this->validate();

        try {
            AppUser::create([
                'wallet_address' => $this->wallet_address,
                'email' => $this->email ?: null,
                'username' => $this->username ?: null,
                'is_active' => $this->is_active,
                'eligible_for_airdrops' => $this->eligible_for_airdrops
            ]);

            $this->resetForm();
            $this->showCreateModal = false;
            session()->flash('message', 'User created successfully!');
        } catch (\Exception $e) {
            session()->flash('error', 'Error creating user: ' . $e->getMessage());
        }
    }

    public function updateUser()
    {
        $this->validate();

        try {
            $this->selectedUser->update([
                'wallet_address' => $this->wallet_address,
                'email' => $this->email ?: null,
                'username' => $this->username ?: null,
                'is_active' => $this->is_active,
                'eligible_for_airdrops' => $this->eligible_for_airdrops
            ]);

            $this->resetForm();
            $this->showEditModal = false;
            session()->flash('message', 'User updated successfully!');
        } catch (\Exception $e) {
            session()->flash('error', 'Error updating user: ' . $e->getMessage());
        }
    }

    public function deleteUser($userId)
    {
        try {
            AppUser::find($userId)->delete();
            session()->flash('message', 'User deleted successfully!');
        } catch (\Exception $e) {
            session()->flash('error', 'Error deleting user: ' . $e->getMessage());
        }
    }

    public function toggleActive($userId)
    {
        $user = AppUser::find($userId);
        if ($user) {
            $user->update(['is_active' => !$user->is_active]);
            session()->flash('message', 'User status updated!');
        }
    }

    public function toggleAirdropEligibility($userId)
    {
        $user = AppUser::find($userId);
        if ($user) {
            $user->update(['eligible_for_airdrops' => !$user->eligible_for_airdrops]);
            session()->flash('message', 'Airdrop eligibility updated!');
        }
    }

    private function resetForm()
    {
        $this->wallet_address = '';
        $this->email = '';
        $this->username = '';
        $this->is_active = true;
        $this->eligible_for_airdrops = true;
        $this->selectedUser = null;
    }

    public function closeModals()
    {
        $this->showCreateModal = false;
        $this->showEditModal = false;
        $this->resetForm();
    }
}
