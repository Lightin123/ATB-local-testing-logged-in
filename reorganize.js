// reorganize‑v2.js
import { promises as fs } from "fs";
import path from "path";

const moves = [
  { name: "src", target: "frontend" },
  /* other items you still need to move… */
];

async function mvOrCopy(item, target) {
  const src = path.resolve(item);
  const dest = path.resolve(target, item);
  try {
    await fs.rename(src, dest);
    console.log(`✔ moved ${item} → ${target}/${item}`);
  } catch (err) {
    if (err.code === "EPERM" || err.code === "EXDEV") {
      console.warn(`! rename failed for ${item}, falling back to copy…`);
      await fs.cp(src, dest, { recursive: true });
      console.log(`✔ copied ${item} → ${target}/${item}`);
      await fs.rm(src, { recursive: true, force: true });
      console.log(`✔ removed original ${item}`);
    } else {
      console.error(`✖ could not move ${item}:`, err);
    }
  }
}

async function main() {
  await fs.mkdir("frontend", { recursive: true });
  await fs.mkdir("backend", { recursive: true });

  for (let { name, target } of moves) {
    await mvOrCopy(name, target);
  }

  // write your package.json files here as before…
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
