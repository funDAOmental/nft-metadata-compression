import { expect } from "chai";
import { ethers } from "hardhat";

// eslint-disable-next-line node/no-missing-import
import { NFTextLib } from "../typechain/index";

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

  it("decodes", async () => {
    const nftextLib = await deploy();

    expect(await nftextLib.decode([0])).to.equal("x..");
    expect(await nftextLib.decode([1])).to.equal("y..");
  });
});
