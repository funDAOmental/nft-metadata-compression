import BasicNftMetadata from "./BasicNftMetadata";
import { AttributesSchema } from "./buildAttributesSchema";

type Token = {
  size: number;
  value: number;
};

export default function encodeAttributes(
  schema: AttributesSchema,
  nft: BasicNftMetadata
): Uint8Array {
  const tokens: Token[] = [];

  const attributeNames = schema.attributes.map((a) => a.name);

  for (const attribute of nft.attributes) {
    const attributeIndex = attributeNames.indexOf(attribute.trait_type);

    tokens.push({
      size: schema.attributeSize,
      value: attributeIndex,
    });

    const attributeSchema = schema.attributes[attributeIndex];

    tokens.push({
      size: attributeSchema.size,
      value: attributeSchema.values.indexOf(attribute.value),
    });
  }

  const halfBytes = tokens.map(toHalfBytes).reduce((a, b) => [...a, ...b], []);
  const byteLen = Math.ceil(halfBytes.length / 2);
  const buf = new Uint8Array(byteLen);

  for (let i = 0; i < buf.length; i++) {
    buf[i] = 16 * halfBytes[2 * i] + (halfBytes[2 * i + 1] ?? 0);
  }

  return buf;
}

function toHalfBytes(token: Token): number[] {
  const result: number[] = [];
  let value = token.value;

  for (let i = 0; i < token.size; i++) {
    result.unshift(value % 16);
    value = Math.floor(value / 16);
  }

  return result;
}
