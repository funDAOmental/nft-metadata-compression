/* eslint-disable node/no-path-concat */
import fs from "fs/promises";

import * as io from "io-ts";
import decode from "../src/decode";

const NftMetadata = io.type({
  image: io.string,
  attributes: io.array(
    io.type({
      trait_type: io.string,
      // display_type: io.union([io.undefined, io.literal("number")]),
      value: io.string,
    })
  ),
});

(async () => {
  const nftsJson = JSON.parse(
    await fs.readFile(
      `${__dirname}/../../metadata-samples/timelessCharacters.json`,
      "utf-8"
    )
  );

  for (let i = 0; i < nftsJson.length; i++) {
    const nftJson = nftsJson[i];

    try {
      decode(NftMetadata, nftJson);
    } catch (error) {
      console.log(i, nftJson);
      throw error;
    }
  }
})();
