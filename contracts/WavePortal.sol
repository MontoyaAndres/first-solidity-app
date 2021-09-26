// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import 'hardhat/console.sol';

contract WavePortal {
    uint256 totalWaves;

    event NewWave(address indexed from, string messsage, uint256 timestamp);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log('My first console log :)');
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log('%s is waved!', msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, _message, block.timestamp);

        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            'Trying to withdraw more money than the contract has.'
        );

        (bool success, ) = (msg.sender).call{value: prizeAmount}('');
        require(success, 'Failed to withdraw money from contract.');
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
