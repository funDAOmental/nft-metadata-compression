/* eslint-disable prettier/prettier */

import { expect } from "chai";
import { ethers } from "hardhat";

// eslint-disable-next-line node/no-missing-import
import { NFTxtLib } from "../typechain/index";
// eslint-disable-next-line node/no-missing-import
import { encodeLines } from "../encode";

const deploy = (() => {
  let nftxtLib: NFTxtLib | undefined;

  return async () => {
    if (nftxtLib !== undefined) {
      return nftxtLib;
    }

    const NFTxtLib = await ethers.getContractFactory("NFTxtLib");
    nftxtLib = await (await NFTxtLib.deploy()).deployed();

    return nftxtLib;
  };
})();

describe("NFTxtLib", function () {
  it("Should deploy", async () => {
    await deploy();
  });

  it("decodes 2x2 box", async () => {
    const nftxtLib = await deploy();

    // off-chain encoder
    const boxData = encodeLines(
      "┌┐",
      "└┘",
    );

    // 3 bytes to be stored on chain
    expect(boxData.toString('hex')).to.equal('02e67d');

    // on-chain decoder
    expect(await nftxtLib.decode(boxData)).to.equal("┌┐\n└┘\n");
    // This unicode string is 14 bytes uncompressed
  });

  it("decodes 4x4 box", async () => {
    const nftxtLib = await deploy();

    const boxData = encodeLines(
      "┌──┐",
      "│░▒│",
      "│▒░│",
      "└──┘",
    );

    expect(boxData.toString('hex')).to.equal('04ebb6412442147bbd');
    expect(await nftxtLib.decode(boxData)).to.equal("┌──┐\n│░▒│\n│▒░│\n└──┘\n");
  });
});
