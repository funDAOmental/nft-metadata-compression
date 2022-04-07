/* eslint-disable node/no-path-concat */

import fs from "fs/promises";

import * as io from "io-ts";

import BasicNftMetadata from "../src/BasicNftMetadata";
import decode from "../src/decode";
import gatherTraits from "../src/gatherTraits";

(async () => {
  const nftsJson = JSON.parse(
    await fs.readFile(
      `${__dirname}/../../metadata-samples/boredApes.json`,
      "utf-8"
    )
  );

  const collection = decode(io.array(BasicNftMetadata), nftsJson);

  const traits = gatherTraits(collection);

  const traitsJson = Object.fromEntries(
    Object.entries(traits.data).map(([trait, table]) => {
      return [
        trait,
        {
          total: Object.values(table.data).reduce((a, b) => a + b, 0),
          byValue: table.data,
        },
      ];
    })
  );

  console.log(JSON.stringify(traitsJson, null, 2));
})().catch(console.error);
