import fetch from "node-fetch";

const blockSize = 1;

function Range(limit: number) {
  const result: number[] = [];

  for (let i = 0; i < limit; i++) {
    result.push(i);
  }

  return result;
}

async function main() {
  const [prefix, startStr, endStr] = process.argv.slice(2);

  const start = Number(startStr);
  const end = Number(endStr);

  const results: unknown[] = [];

  for (let i = start; i <= end; i += blockSize) {
    const next = await Promise.all(
      Range(blockSize).map(async (j) => {
        if (i + j > end) {
          return undefined;
        }

        const url = `${prefix}/${i + j}`;
        console.error(`${url}...`);
        const json = await fetch(url).then((res) => res.json());
        console.error(`...${url}`);
        return json;
      })
    );

    results.push(...next.filter((j) => j !== undefined));
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
