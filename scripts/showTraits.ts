/* eslint-disable node/no-path-concat */

import fs from "fs/promises";

import * as io from "io-ts";
import * as tb from "typed-bytes";

import BasicNftMetadata from "../src/BasicNftMetadata";
import buildTraitsSchema, { TraitsSchema } from "../src/buildTraitsSchema";
import decode from "../src/decode";
import gatherTraits from "../src/gatherTraits";

(async () => {
  const nftsJson = JSON.parse(
    await fs.readFile(
      `${__dirname}/../../metadata-samples/timelessCharacters.json`,
      "utf-8"
    )
  );

  const collection = decode(io.array(BasicNftMetadata), nftsJson);

  const traits = gatherTraits(collection);

  console.log("stats", JSON.stringify(traits, null, 2));

  const schema = buildTraitsSchema(traits);
  console.log("schema", JSON.stringify(schema, null, 2));

  const encodedSchema = TraitsSchema.encode(schema);

  console.log(
    "encoded schema",
    `${encodedSchema.length} bytes`,
    `0x${Buffer.from(encodedSchema).toString("hex")}`
  );
})().catch(console.error);
