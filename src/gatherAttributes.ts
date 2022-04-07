import BasicNftMetadata from "./BasicNftMetadata";
import RecordWithDefault from "./RecordWithDefault";

export type AttributesTable = Record<
  string,
  {
    total: number;
    byValue: Record<string, number>;
  }
>;

export default function gatherAttributes(
  collection: BasicNftMetadata[]
): AttributesTable {
  const attributes = new RecordWithDefault(() => new RecordWithDefault(() => 0));

  for (const nft of collection) {
    for (const attribute of nft.attributes) {
      const trait = attributes.get(attribute.trait_type);
      trait.set(attribute.value, trait.get(attribute.value) + 1);
    }
  }

  return Object.fromEntries(
    Object.entries(attributes.data).map(([trait, table]) => {
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
