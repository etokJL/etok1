// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @dev Mock USDT contract for testing purposes
 */
contract MockUSDT is ERC20, Ownable {
    uint8 private _decimals = 6; // USDT uses 6 decimals

    constructor(address initialOwner) ERC20("Mock USDT", "mUSDT") Ownable(initialOwner) {
        // Mint initial supply of 1,000,000 USDT to owner
        _mint(initialOwner, 1000000 * 10**_decimals);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Mint tokens to any address (for testing)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Faucet function - anyone can get 1000 USDT for testing
     */
    function faucet() external {
        require(balanceOf(msg.sender) < 10000 * 10**_decimals, "Already have enough USDT");
        _mint(msg.sender, 1000 * 10**_decimals); // 1000 USDT
    }

    /**
     * @dev Get balance in human readable format
     */
    function balanceOfFormatted(address account) external view returns (string memory) {
        uint256 balance = balanceOf(account);
        uint256 whole = balance / 10**_decimals;
        uint256 fraction = balance % 10**_decimals;
        
        if (fraction == 0) {
            return string(abi.encodePacked(_toString(whole), " USDT"));
        } else {
            return string(abi.encodePacked(_toString(whole), ".", _toString(fraction), " USDT"));
        }
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

