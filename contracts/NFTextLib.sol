//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract NFTextLib {
    // Roughly corresponds to ░▒▓│┤┐└┴├├─┼┘┌█
    bytes32 public constant CHARSET = 0x969196929693948294a49490949494b4949c949c948094bc9498948c96880000;

    function decode(bytes calldata onChainData) public pure returns (string memory) {
        bytes memory buf = new bytes(3 * onChainData.length);

        for (uint i = 0; i < onChainData.length; i++) {
            writeChar(buf, i, uint8(onChainData[i]));
        }

        return string(buf);
    }

    function writeChar(bytes memory buf, uint pos, uint8 charsetIndex) private pure {
        uint i = 3 * pos;
        uint ci = 2 * charsetIndex;

        buf[i++] = 0xe2;
        buf[i++] = CHARSET[ci++];
        buf[i] = CHARSET[ci];
    }
}
