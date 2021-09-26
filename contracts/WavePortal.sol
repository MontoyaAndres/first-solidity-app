// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import 'hardhat/console.sol';

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, string messsage, uint256 timestamp);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    /*
     * This is an address => uint mapping, meaning I can associated an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log('My first console log :)');
    }

    function wave(string memory _message) public {
        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            'Wait 15 min'
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log('%s is waved!', msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a Psuedo random number between 0 and 100
         */
        uint256 randomNumber = (block.difficulty + block.timestamp + seed) %
            100;
        console.log('Random # generated: %s', randomNumber);

        seed = randomNumber;

        if (randomNumber < 50) {
            console.log('%s won!', msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                'Trying to withdraw more money than the contract has.'
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}('');
            require(success, 'Failed to withdraw money from contract.');
        }

        emit NewWave(msg.sender, _message, block.timestamp);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
