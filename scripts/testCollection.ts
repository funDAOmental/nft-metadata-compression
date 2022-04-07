/* eslint-disable node/no-path-concat */

import "source-map-support/register";

import fs from "fs/promises";

import * as io from "io-ts";
import * as tb from "typed-bytes";

import BasicNftMetadata from "../src/BasicNftMetadata";
import buildAttributesSchema, {
  AttributesSchema,
} from "../src/buildAttributesSchema";
import decode from "../src/decode";
import decodeAttributes from "../src/decodeAttributes";
import encodeAttributes from "../src/encodeAttributes";
import gatherAttributes from "../src/gatherAttributes";

(async () => {
  const nftsJson = JSON.parse(
    await fs.readFile(
      `${__dirname}/../../metadata-samples/boredApes.json`,
      "utf-8"
    )
  );

  const collection = decode(io.array(BasicNftMetadata), nftsJson);

  const attributes = gatherAttributes(collection);
  const schema = buildAttributesSchema(attributes);

  const AttributesCollection = tb.Object({
    schema: AttributesSchema,
    nfts: tb.Array(tb.buffer),
  });

  const encodedCollection = AttributesCollection.encode({
    schema,
    nfts: collection.map((nft) => encodeAttributes(schema, nft)),
  });

  const decodedCollection = AttributesCollection.decode(encodedCollection);

  const decodedNftAttributes = decodedCollection.nfts.map(
    (nftAttributesBuffer) =>
      decodeAttributes(decodedCollection.schema, nftAttributesBuffer)
  );

  const encodedSize = encodedCollection.length;
  const originalSize = JSON.stringify(
    collection.map((nft) => nft.attributes)
  ).length;

  console.log(
    `${(originalSize / encodedSize).toFixed(
      1
    )}x reduction: ${encodedSize} (encoded) vs ${originalSize} (json)`
  );

  if (
    JSON.stringify(decodedNftAttributes) ===
    JSON.stringify(collection.map((nft) => nft.attributes))
  ) {
    console.log("decodes correctly ✅");
  } else {
    console.log("decode failed");
  }
})().catch(console.error);
