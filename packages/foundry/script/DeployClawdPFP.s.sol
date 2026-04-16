// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DeployHelpers.s.sol";
import "../contracts/ClawdPFP.sol";

/**
 * @notice Deploy script for ClawdPFP contract
 * @dev Deploys with minter = deployer address and mintDuration = 7 days (604800 seconds)
 *
 * Example:
 * yarn deploy --file DeployClawdPFP.s.sol             # local anvil chain
 * yarn deploy --file DeployClawdPFP.s.sol --network mainnet  # Ethereum mainnet
 */
contract DeployClawdPFP is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        // Deploy with minter = deployer, mintDuration = 7 days
        ClawdPFP clawdPFP = new ClawdPFP(deployer, 604800);
        console.log("ClawdPFP deployed at:", address(clawdPFP));
        console.log("Minter:", deployer);
        console.log("Mint deadline:", clawdPFP.mintDeadline());
    }
}
