class BufWriteStream {
  capacity = 1024;
  buf: Uint8Array = new Uint8Array(this.capacity);
  len = 0;

  write(bytes: Uint8Array) {
    let newCapacity = this.capacity;
    const newLen = this.len + bytes.length;

    while (newLen > newCapacity) {
      newCapacity *= 2;
    }

    if (newCapacity > this.capacity) {
      const newBuf = new Uint8Array(newCapacity);
      newBuf.set(this.buf, 0);
      this.buf = newBuf;
      this.capacity = newCapacity;
    }

    this.buf.set(bytes, this.len);
    this.len = newLen;
  }

  Buf() {
    return this.buf.subarray(0, this.len);
  }
}

class BufReadStream {
  pos = 0;

  // eslint-disable-next-line no-useless-constructor
  constructor(public buf: Uint8Array) {}

  read(len: number) {
    const res = this.buf.subarray(this.pos, this.pos + len);
    this.pos += len;

    return res;
  }
}

class BitWriteStream {
  bufWriteStream = new BufWriteStream();
  currByte = 0;
  bitPos = 7;

  write(bit: number) {
    this.currByte |= bit << this.bitPos;

    if (this.bitPos === 0) {
      this.bufWriteStream.write(Uint8Array.from([this.currByte]));
      this.currByte = 0;
      this.bitPos = 7;
    } else {
      this.bitPos--;
    }
  }
}

class BitReadStream {
  bufReadStream: BufReadStream;
  bitPos = 7;
  currByte: number;

  constructor(buf: Uint8Array) {
    this.bufReadStream = new BufReadStream(buf);
    this.currByte = this.bufReadStream.read(1)[0] ?? 0;
  }

  read() {
    const res = (this.currByte >> this.bitPos) & 1;

    if (this.bitPos === 0) {
      this.currByte = this.bufReadStream.read(1)[0] ?? 0;
      this.bitPos = 7;
    } else {
      this.bitPos--;
    }

    return res;
  }
}

export function huffmanCompress(buf: Uint8Array) {
  const frequencies: Record<string, number> = {};
  const output = new BufWriteStream();

  for (const c of buf) {
    frequencies[c] = (frequencies[c] ?? 0) + 1;
  }

  const freqTable = Object.entries(frequencies)
    .sort(([, a], [, b]) => b - a)
    .map(([char, freq]) => ({ char: Number(char), freq }));

  const topFreq = freqTable[0].freq;

  for (const row of freqTable) {
    row.freq = Math.ceil((row.freq * 255) / topFreq);
  }

  freqTable.push({ char: 0, freq: 0 });

  for (const { char, freq } of freqTable) {
    output.write(Uint8Array.from([char, freq]));
  }

  const tree = createTree(freqTable);
  const treeLookupTable = TreeLookupTable(tree);
  const bitsOutput = new BitWriteStream();

  for (const char of buf) {
    const bits = treeLookupTable[String(char)];

    for (const b of bits) {
      bitsOutput.write(b);
    }
  }

  output.write(bitsOutput.bufWriteStream.Buf());

  return output.Buf();
}

export function huffmanDecompress(buf: Uint8Array) {}

type BinaryTree<T> =
  | { leaf: T }
  | { left: BinaryTree<T>; right: BinaryTree<T> };

function createTree(
  freqTable: { char: number; freq: number }[]
): BinaryTree<number> {
  const treeTable: { tree: BinaryTree<number>; freq: number }[] = freqTable.map(
    ({ char, freq }) => ({ tree: { leaf: char }, freq })
  );

  while (treeTable.length > 1) {
    // TODO: Use heap?
    treeTable.sort(({ freq: a }, { freq: b }) => a - b);
    const leftRow = treeTable.shift()!;
    const rightRow = treeTable.shift()!;

    treeTable.unshift({
      tree: {
        left: leftRow.tree,
        right: rightRow.tree,
      },
      freq: leftRow.freq + rightRow.freq,
    });
  }

  return treeTable[0].tree;
}

function TreeLookupTable(tree: BinaryTree<number>): Record<string, number[]> {
  const lookupTable: Record<string, number[]> = {};

  function processTree(prefix: number[], subTree: BinaryTree<number>) {
    if ("leaf" in subTree) {
      lookupTable[String(subTree.leaf)] = prefix;
    } else {
      processTree([...prefix, 0], subTree.left);
      processTree([...prefix, 1], subTree.right);
    }
  }

  processTree([], tree);

  return lookupTable;
}

function summarizeHuffmanTree(root: BinaryTree<number>) {
  const entries: [string, number][] = [];

  function processTree(prefix: string, subTree: BinaryTree<number>) {
    if ("leaf" in subTree) {
      entries.push([prefix, subTree.leaf]);
    } else {
      processTree(`${prefix}0`, subTree.left);
      processTree(`${prefix}1`, subTree.right);
    }
  }

  processTree("", root);

  entries.sort(([a], [b]) => a.length - b.length);

  return entries;
}
