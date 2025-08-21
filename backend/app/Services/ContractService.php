<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class ContractService
{
    private static $contracts = null;
    private static $contractsPath = null;

    /**
     * Get the path to the contracts.json file
     */
    private static function getContractsPath()
    {
        if (self::$contractsPath === null) {
            // Path to frontend contracts.json from backend directory
            self::$contractsPath = base_path('../frontend/src/contracts.json');
        }
        return self::$contractsPath;
    }

    /**
     * Load contracts from the frontend contracts.json file
     */
    private static function loadContracts()
    {
        if (self::$contracts !== null) {
            return self::$contracts;
        }

        $contractsPath = self::getContractsPath();

        if (!File::exists($contractsPath)) {
            Log::error("Contracts file not found at: {$contractsPath}");
            throw new \Exception("Contracts file not found. Make sure frontend contracts.json exists.");
        }

        try {
            $contractsJson = File::get($contractsPath);
            self::$contracts = json_decode($contractsJson, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception("Invalid JSON in contracts file: " . json_last_error_msg());
            }

            Log::info("Contracts loaded successfully from: {$contractsPath}");
            return self::$contracts;

        } catch (\Exception $e) {
            Log::error("Error loading contracts: " . $e->getMessage());
            throw new \Exception("Failed to load contracts: " . $e->getMessage());
        }
    }

    /**
     * Get contract address by name
     */
    public static function getContractAddress(string $contractName): string
    {
        $contracts = self::loadContracts();

        if (!isset($contracts[$contractName])) {
            throw new \Exception("Contract '{$contractName}' not found in contracts.json");
        }

        if (!isset($contracts[$contractName]['address'])) {
            throw new \Exception("Address not found for contract '{$contractName}'");
        }

        return $contracts[$contractName]['address'];
    }

    /**
     * Get contract ABI by name
     */
    public static function getContractAbi(string $contractName): array
    {
        $contracts = self::loadContracts();

        if (!isset($contracts[$contractName])) {
            throw new \Exception("Contract '{$contractName}' not found in contracts.json");
        }

        if (!isset($contracts[$contractName]['abi'])) {
            throw new \Exception("ABI not found for contract '{$contractName}'");
        }

        return $contracts[$contractName]['abi'];
    }

    /**
     * Get all available contract names
     */
    public static function getAvailableContracts(): array
    {
        $contracts = self::loadContracts();
        return array_keys($contracts);
    }

    /**
     * Get complete contract info (address + ABI)
     */
    public static function getContract(string $contractName): array
    {
        return [
            'name' => $contractName,
            'address' => self::getContractAddress($contractName),
            'abi' => self::getContractAbi($contractName)
        ];
    }

    /**
     * Reload contracts from file (useful for development)
     */
    public static function reloadContracts(): void
    {
        self::$contracts = null;
        self::loadContracts();
    }

    /**
     * Check if contracts file exists and is readable
     */
    public static function isContractsFileAvailable(): bool
    {
        $contractsPath = self::getContractsPath();
        return File::exists($contractsPath) && File::isReadable($contractsPath);
    }
}
