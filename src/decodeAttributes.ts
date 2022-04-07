import BasicNftMetadata from "./BasicNftMetadata";
import { AttributesSchema } from "./buildAttributesSchema";

export default function decodeAttributes(
  schema: AttributesSchema,
  encodedAttributes: Uint8Array
): BasicNftMetadata["attributes"] {
  const attributes: BasicNftMetadata["attributes"] = [];

  const halfBytes: number[] = [];

  for (let i = 0; i < encodedAttributes.length; i++) {
    halfBytes.push(Math.floor(encodedAttributes[i] / 16));
    halfBytes.push(encodedAttributes[i] % 16);
  }

  let pos = 0;

  function decodeToken(size: number) {
    let value = 0;

    for (const halfByte of halfBytes.slice(pos, pos + size)) {
      value *= 16;
      value += halfByte;
    }

    pos += size;

    return value;
  }

  while (pos < halfBytes.length - 1) {
    const attributeIndex = decodeToken(schema.attributeSize);
    const attributeSchema = schema.attributes[attributeIndex];
    const valueIndex = decodeToken(attributeSchema.size);

    attributes.push({
      trait_type: attributeSchema.name,
      value: attributeSchema.values[valueIndex],
    });
  }

  return attributes;
}
