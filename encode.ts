// eslint-disable-next-line node/no-missing-import
import assert from "./helpers/assert";

const charset = "0░▒▓│┤┐└┴├├─┼┘┌█";

export default function encode(artwork: string) {
  const width = artwork.indexOf("\n");
  const lines = artwork.length / (width + 1);
  assert(lines === Math.round(lines));
  const cells = lines * width;
  assert(cells % 2 === 0); // TODO: Implement artworks with odd number of cells

  const bufLen = 1 + cells / 2;
  let bufPos = 0;
  const buf = Buffer.alloc(bufLen);

  buf[bufPos++] = width;

  const writeHalfByte = (() => {
    let partial: number | undefined;

    return (halfByte: number) => {
      if (partial === undefined) {
        partial = 16 * halfByte;
      } else {
        buf[bufPos++] = partial + halfByte;
        partial = undefined;
      }
    };
  })();

  for (let i = 0; i < artwork.length; i++) {
    if (artwork[i] === "\n") {
      assert(i % (width + 1) === width);
      continue;
    }

    const charsetIndex = charset.indexOf(artwork[i]);
    assert(charsetIndex > 0); // Not -1 because 0 is also invalid
    writeHalfByte(charsetIndex);
  }

  return buf;
}

export function encodeLines(...lines: string[]) {
  return encode(lines.map((line) => line + "\n").join(""));
}
