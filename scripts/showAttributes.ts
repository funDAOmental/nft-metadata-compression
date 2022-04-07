/* eslint-disable node/no-path-concat */

import fs from "fs/promises";

import * as io from "io-ts";
import * as tb from "typed-bytes";

import BasicNftMetadata from "../src/BasicNftMetadata";
import buildAttributesSchema, {
  AttributesSchema,
} from "../src/buildAttributesSchema";
import decode from "../src/decode";
import encodeAttributes from "../src/encodeAttributes";
import gatherAttributes from "../src/gatherAttributes";

(async () => {
  const nftsJson = JSON.parse(
    await fs.readFile(
      `${__dirname}/../../metadata-samples/timelessCharacters.json`,
      "utf-8"
    )
  );

  const collection = decode(io.array(BasicNftMetadata), nftsJson);

  const attributes = gatherAttributes(collection);

  console.log("stats", JSON.stringify(attributes, null, 2));

  const schema = buildAttributesSchema(attributes);
  console.log("schema", JSON.stringify(schema, null, 2));

  const encodedSchema = AttributesSchema.encode(schema);

  console.log(
    "encoded schema",
    `${encodedSchema.length} bytes`,
    `0x${Buffer.from(encodedSchema).toString("hex")}`
  );

  const nftSample = collection[Math.floor(Math.random() * collection.length)];

  console.log("nft sample", nftSample);
  const encodedAttributes = encodeAttributes(schema, nftSample);

  console.log(
    "encoded attributes",
    `0x${Buffer.from(encodedAttributes).toString("hex")}`
  );

  console.log(
    `size comparison: ${encodedAttributes.length} (encoded) vs ${
      JSON.stringify(nftSample.attributes).length
    } (json)`
  );
})().catch(console.error);
