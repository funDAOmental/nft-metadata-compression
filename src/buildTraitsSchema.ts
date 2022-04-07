import * as tb from "typed-bytes";

import { TraitsTable } from "./gatherTraits";

export const TraitsSchema = tb.Object({
  traitSize: tb.number,
  traits: tb.Array(
    tb.Object({
      name: tb.string,
      size: tb.number,
      values: tb.Array(tb.string),
    })
  ),
});

export type TraitsSchema = tb.TypeOf<typeof TraitsSchema>;

export default function buildTraitsSchema(traits: TraitsTable): TraitsSchema {
  const traitNames = Object.keys(traits);

  return {
    traitSize: getEncodedSize(traitNames.length),
    traits: traitNames.map((traitName) => {
      return {
        name: traitName,
        size: getEncodedSize(Object.keys(traits[traitName].byValue).length),
        values: Object.keys(traits[traitName].byValue),
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
