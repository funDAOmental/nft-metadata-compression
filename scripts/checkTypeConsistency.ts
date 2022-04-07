/* eslint-disable node/no-path-concat */
import fs from "fs/promises";

import * as io from "io-ts";
import reporter from "io-ts-reporters";

const NftMetadata = io.type({
  image: io.string,
  attributes: io.array(
    io.type({
      trait_type: io.string,
      value: io.string,
    })
  ),
});

function decode<T extends io.Mixed>(type: T, value: unknown): io.TypeOf<T> {
  const decodeResult = type.decode(value);

  if ("left" in decodeResult) {
    throw new Error(reporter.report(decodeResult).join("\n"));
  }

  return decodeResult.right;
}

(async () => {
  const boredApesJson = JSON.parse(
    await fs.readFile(
      `${__dirname}/../../metadata-samples/boredApes.json`,
      "utf-8"
    )
  );

  for (const boredApeJson of boredApesJson) {
    decode(NftMetadata, boredApeJson);
  }
})();
