<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;

class ContractController extends Controller
{
    /**
     * Get current contract addresses and ABIs
     */
    public function getContracts(): JsonResponse
    {
        try {
            // Path to the contracts.json file that gets updated by Hardhat
            $contractsPath = base_path('../frontend/src/contracts.json');

            if (!File::exists($contractsPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contracts not deployed yet',
                    'contracts' => null
                ], 404);
            }

            $contracts = json_decode(File::get($contractsPath), true);

            if (!$contracts) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid contracts file',
                    'contracts' => null
                ], 500);
            }

            // Extract just the addresses and essential info for frontend
            $contractInfo = [];
            foreach ($contracts as $name => $contract) {
                $contractInfo[$name] = [
                    'address' => $contract['address'] ?? null,
                    'abi' => $contract['abi'] ?? null,
                    'deployedAt' => $contract['deployedAt'] ?? now()->toISOString()
                ];
            }

            return response()->json([
                'success' => true,
                'contracts' => $contractInfo,
                'network' => 'localhost',
                'chainId' => 31337,
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error loading contracts: ' . $e->getMessage(),
                'contracts' => null
            ], 500);
        }
    }

    /**
     * Check if contracts are deployed and valid
     */
    public function checkDeployment(): JsonResponse
    {
        try {
            $contractsPath = base_path('../frontend/src/contracts.json');

            if (!File::exists($contractsPath)) {
                return response()->json([
                    'success' => false,
                    'deployed' => false,
                    'message' => 'Contracts file not found'
                ]);
            }

            $contracts = json_decode(File::get($contractsPath), true);

            // Check if all required contracts are present
            $requiredContracts = ['QuestNFT', 'PlantToken', 'MockUSDT', 'NFTShop'];
            $deployedContracts = array_keys($contracts);
            $missingContracts = array_diff($requiredContracts, $deployedContracts);

            if (!empty($missingContracts)) {
                return response()->json([
                    'success' => false,
                    'deployed' => false,
                    'message' => 'Missing contracts: ' . implode(', ', $missingContracts),
                    'missing' => $missingContracts
                ]);
            }

            // Check if addresses are valid
            foreach ($contracts as $name => $contract) {
                if (empty($contract['address'])) {
                    return response()->json([
                        'success' => false,
                        'deployed' => false,
                        'message' => "Contract {$name} has no address"
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'deployed' => true,
                'message' => 'All contracts deployed successfully',
                'contracts' => $requiredContracts
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'deployed' => false,
                'message' => 'Error checking deployment: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Force contract reload (for development)
     */
    public function reloadContracts(): JsonResponse
    {
        try {
            // Clear any cached contract data
            if (function_exists('opcache_reset')) {
                opcache_reset();
            }

            // Return fresh contract data
            return $this->getContracts();

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error reloading contracts: ' . $e->getMessage()
            ], 500);
        }
    }
}
