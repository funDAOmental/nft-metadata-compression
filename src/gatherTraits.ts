import BasicNftMetadata from "./BasicNftMetadata";
import RecordWithDefault from "./RecordWithDefault";

export type TraitsTable = Record<
  string,
  {
    total: number;
    byValue: Record<string, number>;
  }
>;

export default function gatherTraits(
  collection: BasicNftMetadata[]
): TraitsTable {
  const traits = new RecordWithDefault(() => new RecordWithDefault(() => 0));

  for (const nft of collection) {
    for (const attribute of nft.attributes) {
      const trait = traits.get(attribute.trait_type);
      trait.set(attribute.value, trait.get(attribute.value) + 1);
    }
  }

  return Object.fromEntries(
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
}
