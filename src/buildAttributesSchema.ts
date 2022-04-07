import * as tb from "typed-bytes";

import { AttributesTable } from "./gatherAttributes";

export const AttributesSchema = tb.Object({
  attributeSize: tb.byte,
  attributes: tb.Array(
    tb.Object({
      name: tb.string,
      size: tb.byte,
      values: tb.Array(tb.string),
    })
  ),
});

export type AttributesSchema = tb.TypeOf<typeof AttributesSchema>;

export default function buildAttributesSchema(
  attributes: AttributesTable
): AttributesSchema {
  const traitNames = Object.keys(attributes);

  return {
    attributeSize: getEncodedSize(traitNames.length),
    attributes: traitNames.map((traitName) => {
      return {
        name: traitName,
        size: getEncodedSize(Object.keys(attributes[traitName].byValue).length),
        values: Object.keys(attributes[traitName].byValue),
      };
    }),
  };
}

function getEncodedSize(n: number) {
  let s = 1;

  while (16 ** s < n) {
    s++;
  }

  return s;
}
