<?php

namespace App\Livewire;

use App\Models\Airdrop;
use App\Models\User;
use App\Models\AppToken;
use App\Services\ContractService;
use Livewire\Component;
use Livewire\WithPagination;

class AirdropSystem extends Component
{
    use WithPagination;

    public $showCreateModal = false;
    public $title = '';
    public $package_id = '';
    public $nft_types = '';
    public $scheduled_at = '';

    protected $rules = [
        'title' => 'required|string|max:255',
        'package_id' => 'required|string',
        'nft_types' => 'required|string',
        'scheduled_at' => 'nullable|date'
    ];

    public function render()
    {
        $airdrops = Airdrop::orderBy('created_at', 'desc')->paginate(10);
        $eligibleUsersCount = User::eligibleForAirdrops()->count();

        return view('livewire.airdrop-system', [
            'airdrops' => $airdrops,
            'eligibleUsersCount' => $eligibleUsersCount
        ]);
    }

    public function openCreateModal()
    {
        $this->resetForm();
        $this->showCreateModal = true;
    }

    public function createAirdrop()
    {
        $this->validate();

        try {
            // Convert comma-separated string to array
            $nftTypesArray = array_map('trim', explode(',', $this->nft_types));
            $nftTypesArray = array_map('intval', array_filter($nftTypesArray));

            $eligibleUsers = User::eligibleForAirdrops()->count();

            Airdrop::create([
                'title' => $this->title,
                'package_id' => $this->package_id,
                'nft_types' => $nftTypesArray,
                'total_recipients' => $eligibleUsers,
                'scheduled_at' => $this->scheduled_at ?: now()
            ]);

            $this->resetForm();
            $this->showCreateModal = false;
            session()->flash('message', 'Airdrop created successfully!');
        } catch (\Exception $e) {
            session()->flash('error', 'Error creating airdrop: ' . $e->getMessage());
        }
    }

    public function executeAirdrop($airdropId)
    {
        $airdrop = Airdrop::find($airdropId);

        if (!$airdrop || !$airdrop->canExecute()) {
            session()->flash('error', 'Cannot execute this airdrop.');
            return;
        }

        try {
            // Update status to executing
            $airdrop->update([
                'status' => 'executing',
                'executed_at' => now()
            ]);

            // Get eligible users
            $eligibleUsers = User::eligibleForAirdrops()->get();

            // Execute real blockchain airdrop
            $this->executeBlockchainAirdrop($airdrop, $eligibleUsers);

            session()->flash('message', 'Airdrop executed successfully! Tokens created on blockchain.');
        } catch (\Exception $e) {
            $airdrop->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
            session()->flash('error', 'Error executing airdrop: ' . $e->getMessage());
        }
    }

    private function executeBlockchainAirdrop($airdrop, $eligibleUsers)
    {
        // REAL blockchain interaction - create actual NFT packages on-chain
        $totalUsers = $eligibleUsers->count();
        $completedUsers = 0;

        try {
            // Get QuestNFT contract address dynamically from frontend contracts.json
            $contractAddress = ContractService::getContractAddress('QuestNFT');
            \Log::info("Using QuestNFT contract address from contracts.json: {$contractAddress}");
        } catch (\Exception $e) {
            \Log::error("Failed to get QuestNFT contract address: " . $e->getMessage());
            throw new \Exception("Cannot execute airdrop: Contract address not available. " . $e->getMessage());
        }

        // NOTE: This method should be called via a job queue for real blockchain interaction
        // For now, we'll create a command that can be run manually or via queue

        foreach ($eligibleUsers as $user) {
            try {
                // Create a weekly package for this user via Hardhat/blockchain
                $packageCreationResult = $this->createBlockchainPackage($user->wallet_address, $airdrop->nft_types);

                if ($packageCreationResult['success']) {
                    // Only create database records if blockchain transaction succeeded
                    foreach ($airdrop->nft_types as $nftType) {
                        AppToken::create([
                            'contract_address' => $contractAddress,
                            'token_type' => 'erc721a',
                            'token_id' => $packageCreationResult['package_id'] . '_' . $nftType,
                            'owner_address' => $user->wallet_address,
                            'name' => 'Quest NFT Type ' . $nftType,
                            'sub_units' => null,
                            'qr_code' => null,
                            'transaction_hash' => $packageCreationResult['transaction_hash'],
                            'metadata' => [
                                'airdrop_id' => $airdrop->id,
                                'nft_type' => $nftType,
                                'created_via' => 'airdrop',
                                'package_id' => $packageCreationResult['package_id'],
                                'blockchain_confirmed' => true
                            ]
                        ]);
                    }
                    $completedUsers++;
                } else {
                    \Log::error("Failed to create blockchain package for user {$user->wallet_address}: " . $packageCreationResult['error']);
                }
            } catch (\Exception $e) {
                \Log::error("Error creating blockchain package for user {$user->wallet_address}: " . $e->getMessage());
            }

            // Update progress every 10 users or at the end
            if ($completedUsers % 10 === 0 || $completedUsers === $totalUsers) {
                $airdrop->update([
                    'completed_recipients' => $completedUsers
                ]);
            }
        }

        // Mark as completed
        $airdrop->update([
            'status' => $completedUsers > 0 ? 'completed' : 'failed',
            'completed_recipients' => $completedUsers,
            'transaction_hash' => $completedUsers > 0 ? 'multiple_transactions' : null,
            'error_message' => $completedUsers === 0 ? 'No blockchain transactions succeeded' : null
        ]);
    }

    private function createBlockchainPackage($userAddress, $nftTypes)
    {
        // This method should call a Node.js script or Hardhat task to create real blockchain packages
        // For now, return a placeholder - this needs to be implemented with actual blockchain calls

        try {
            // Set environment variables for the script including PATH
            $env = [
                'AIRDROP_USER_ADDRESS' => $userAddress,
                'AIRDROP_NFT_TYPES' => implode(',', $nftTypes),
                'PATH' => '/Users/jgtcdghun/.nvm/versions/node/v20.19.2/bin:' . ($_ENV['PATH'] ?? '/usr/bin:/bin'),
                'NODE_PATH' => '/Users/jgtcdghun/.nvm/versions/node/v20.19.2/lib/node_modules'
            ];

            // Command to execute Hardhat script for package creation (with absolute paths)
            // Use --network localhost to connect to persistent node
            $command = "cd " . base_path('../') . " && /Users/jgtcdghun/.nvm/versions/node/v20.19.2/bin/npx hardhat run scripts/create-airdrop-via-shop.js --network localhost";

            \Log::info("Executing blockchain airdrop command: {$command}");
            \Log::info("Environment variables: " . json_encode($env));

            // Execute the command with environment variables
            $process = proc_open(
                $command,
                [
                    0 => ['pipe', 'r'],  // stdin
                    1 => ['pipe', 'w'],  // stdout
                    2 => ['pipe', 'w']   // stderr
                ],
                $pipes,
                base_path('../'),
                array_merge($_ENV, $env)
            );

            if (is_resource($process)) {
                // Close stdin
                fclose($pipes[0]);

                // Read output
                $output = stream_get_contents($pipes[1]);
                $errors = stream_get_contents($pipes[2]);

                // Close pipes
                fclose($pipes[1]);
                fclose($pipes[2]);

                // Get return code
                $returnCode = proc_close($process);

                \Log::info("Blockchain command output: " . $output);
                if ($errors) {
                    \Log::warning("Blockchain command errors: " . $errors);
                }
                \Log::info("Blockchain command return code: " . $returnCode);

                // Parse the output to extract real transaction data
                if (strpos($output, 'SUCCESS') !== false && $returnCode === 0) {
                    // Extract transaction hashes from output
                    $createTxMatch = [];
                    $purchaseTxMatch = [];
                    $packageIdMatch = [];

                    preg_match('/Create Tx: (0x[a-fA-F0-9]+)/', $output, $createTxMatch);
                    preg_match('/Purchase Tx: (0x[a-fA-F0-9]+)/', $output, $purchaseTxMatch);
                    preg_match('/Package ID: (\d+)/', $output, $packageIdMatch);

                    return [
                        'success' => true,
                        'transaction_hash' => $purchaseTxMatch[1] ?? 'unknown',
                        'create_transaction_hash' => $createTxMatch[1] ?? 'unknown',
                        'package_id' => $packageIdMatch[1] ?? time(),
                        'output' => $output
                    ];
                } else {
                    return [
                        'success' => false,
                        'error' => $errors ?: $output ?: 'Blockchain command failed',
                        'return_code' => $returnCode,
                        'output' => $output
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'error' => 'Failed to start blockchain process'
                ];
            }
        } catch (\Exception $e) {
            \Log::error("Exception in createBlockchainPackage: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function deleteAirdrop($airdropId)
    {
        try {
            $airdrop = Airdrop::find($airdropId);
            if ($airdrop && $airdrop->status === 'pending') {
                $airdrop->delete();
                session()->flash('message', 'Airdrop deleted successfully!');
            } else {
                session()->flash('error', 'Cannot delete this airdrop.');
            }
        } catch (\Exception $e) {
            session()->flash('error', 'Error deleting airdrop: ' . $e->getMessage());
        }
    }

    public function retryAirdrop($airdropId)
    {
        $airdrop = Airdrop::find($airdropId);

        if ($airdrop && $airdrop->status === 'failed') {
            $airdrop->update([
                'status' => 'pending',
                'error_message' => null,
                'executed_at' => null,
                'completed_recipients' => 0
            ]);

            session()->flash('message', 'Airdrop reset for retry!');
        }
    }

    private function resetForm()
    {
        $this->title = '';
        $this->package_id = '';
        $this->nft_types = '';
        $this->scheduled_at = '';
    }

    public function closeModal()
    {
        $this->showCreateModal = false;
        $this->resetForm();
    }
}
