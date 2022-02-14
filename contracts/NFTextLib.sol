//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract NFTextLib {
    // Roughly corresponds to ░▒▓│┤┐└┴├├─┼┘┌█
    bytes32 public constant CHARSET = 0x0000969196929693948294a49490949494b4949c949c948094bc9498948c9688;

    function decode(bytes calldata onChainData) public pure returns (string memory) {
        bytes memory buf = new bytes(6 * onChainData.length);

        for (uint i = 0; i < onChainData.length; i++) {
            uint pos = 2 * i;
            uint8 byte_ = uint8(onChainData[i]);

            writeChar(buf, pos++, byte_ / 16);
            writeChar(buf, pos, byte_ % 16);
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
