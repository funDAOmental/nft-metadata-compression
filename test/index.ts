/* eslint-disable prettier/prettier */

import { expect } from "chai";
import { ethers } from "hardhat";

// eslint-disable-next-line node/no-missing-import
import { NFTextLib } from "../typechain/index";
// eslint-disable-next-line node/no-missing-import
import { encodeLines } from "../encode";

const deploy = (() => {
  let nftextLib: NFTextLib | undefined;

  return async () => {
    if (nftextLib !== undefined) {
      return nftextLib;
    }

    const NFTextLib = await ethers.getContractFactory("NFTextLib");
    nftextLib = await (await NFTextLib.deploy()).deployed();

    return nftextLib;
  };
})();

describe("NFTextLib", function () {
  it("Should deploy", async () => {
    await deploy();
  });

  it("decodes 2x2 box", async () => {
    const nftextLib = await deploy();

    const boxData = encodeLines(
      "┌┐",
      "└┘",
    );

    expect(boxData.toString('hex')).to.equal('02e67d');
    expect(await nftextLib.decode(boxData)).to.equal("┌┐\n└┘\n");
  });
});
