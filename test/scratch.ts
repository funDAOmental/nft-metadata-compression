import fs from "fs/promises";
import { huffmanCompress, huffmanDecompress } from "../src/huffman";

(async () => {
  const bytes = await fs.readFile(
    "/Users/andrew/Downloads/ansi_blondie_by_ice/ansi.ans"
  );

  console.log({ bytes: Uint8Array.from(bytes) });

  const compressed = huffmanCompress(bytes);
  console.log({ compressed });

  const decompressed = huffmanDecompress(compressed);

  console.log({ decompressed });
})().catch(console.error);
