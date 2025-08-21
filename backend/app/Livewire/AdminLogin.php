<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\Log;

class AdminLogin extends Component
{
    public $email = '';
    public $password = '';
    public $remember = false;
    public $isLoading = false;
    public $errorMessage = '';

    protected $rules = [
        'email' => 'required|email',
        'password' => 'required|min:6',
    ];

    public function mount()
    {
        // Check if user is already logged in
        if (session()->has('admin_token')) {
            return redirect()->route('admin.dashboard');
        }
    }

        public function login()
    {
        $this->validate();
        $this->isLoading = true;
        $this->errorMessage = '';

        try {
            // Direct Laravel authentication without API call
            $credentials = [
                'email' => $this->email,
                'password' => $this->password,
            ];

            if (auth()->attempt($credentials, $this->remember)) {
                $user = auth()->user();

                // Generate Sanctum token for API access
                $token = $user->createToken('admin-session')->plainTextToken;

                // Store token in session for API calls
                session([
                    'admin_token' => $token,
                    'admin_user' => $user->toArray(),
                ]);

                session()->flash('success', 'Login successful! Welcome to the admin panel.');
                return redirect()->route('admin.dashboard');
            } else {
                $this->errorMessage = 'Invalid email or password. Please try again.';
            }
        } catch (\Exception $e) {
            $this->errorMessage = 'Login error: ' . $e->getMessage();
            \Log::error('Admin login error: ' . $e->getMessage());
        }

        $this->isLoading = false;
    }

    public function render()
    {
        return view('livewire.admin-login');
    }
}
