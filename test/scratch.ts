import fs from "fs/promises";
import { huffmanCompress } from "../src/huffman";

(async () => {
  const bytes = await fs.readFile(
    "/Users/andrew/Downloads/ansi_blondie_by_ice/ansi.ans"
  );

  console.log(huffmanCompress(bytes));
})().catch(console.error);
