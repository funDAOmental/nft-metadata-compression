//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract NFTextLib {
    function decode(bytes calldata onChainData) public pure returns (string memory) {
        if (onChainData[0] == bytes1(uint8(123))) {
            return "123-first";
        }

        return "not 123-first";
    }
}
