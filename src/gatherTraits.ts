import BasicNftMetadata from "./BasicNftMetadata";
import RecordWithDefault from "./RecordWithDefault";

export default function gatherTraits(collection: BasicNftMetadata[]) {
  const traits = new RecordWithDefault(() => new RecordWithDefault(() => 0));

  for (const nft of collection) {
    for (const attribute of nft.attributes) {
      const trait = traits.get(attribute.trait_type);
      trait.set(attribute.value, trait.get(attribute.value) + 1);
    }
  }

  return traits;
}
