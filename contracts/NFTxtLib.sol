//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract NFTxtLib {
    //                         0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
    // Roughly corresponds to [0, ░, ▒, ▓, │, ┤, ┐, └, ┴, ├, ├, ─, ┼, ┘, ┌, █]
    bytes32 public constant CHARSET = 0x0000969196929693948294a49490949494b4949c949c948094bc9498948c9688;

    function decode(bytes calldata onChainData) public pure returns (string memory) {
        uint width = uint8(onChainData[0]);
        uint cells = 2 * (onChainData.length - 1);
        uint cellByteLen = cells / 2;
        bytes memory buf = new bytes(3 * cells + cells / width);
        uint bufPos = 0;

        for (uint i = 0; i < cellByteLen; i++) {
            uint8 byte_ = uint8(onChainData[i + 1]);

            writeChar(buf, bufPos, byte_ / 16);
            bufPos += 3;

            if ((2 * i + 1) % width == 0) {
                buf[bufPos++] = "\n";
            }

            writeChar(buf, bufPos, byte_ % 16);
            bufPos += 3;

            if ((2 * i + 2) % width == 0) {
                buf[bufPos++] = "\n";
            }
        }

        return string(buf);
    }

    function writeChar(bytes memory buf, uint pos, uint8 charsetIndex) private pure {
        uint i = pos;
        uint ci = 2 * charsetIndex;

        buf[i++] = 0xe2;
        buf[i++] = CHARSET[ci++];
        buf[i] = CHARSET[ci];
    }
}
