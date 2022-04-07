import * as io from "io-ts";
import reporter from "io-ts-reporters";

export default function decode<T extends io.Mixed>(
  type: T,
  value: unknown
): io.TypeOf<T> {
  const decodeResult = type.decode(value);

  if ("left" in decodeResult) {
    throw new Error(reporter.report(decodeResult).join("\n"));
  }

  return decodeResult.right;
}
