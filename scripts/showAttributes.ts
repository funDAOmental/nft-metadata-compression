/* eslint-disable node/no-path-concat */

import fs from "fs/promises";

import * as io from "io-ts";
import * as tb from "typed-bytes";

import BasicNftMetadata from "../src/BasicNftMetadata";
import buildAttributesSchema, {
  AttributesSchema,
} from "../src/buildAttributesSchema";
import decode from "../src/decode";
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
})().catch(console.error);
