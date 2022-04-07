import * as io from "io-ts";

const BasicNftMetadata = io.type({
  image: io.string,
  attributes: io.array(
    io.type({
      trait_type: io.string,
      // display_type: io.union([io.undefined, io.literal("number")]),
      value: io.string,
    })
  ),
});

type BasicNftMetadata = io.TypeOf<typeof BasicNftMetadata>;

export default BasicNftMetadata;
