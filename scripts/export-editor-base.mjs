import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const read = async (file) => JSON.parse(await readFile(new URL("../src/data/" + file + ".json", import.meta.url), "utf8"));
const [{ biography }, archive, experience, layout] = await Promise.all([
  read("biography"), read("archive"), read("experience"), read("layout"),
]);
const content = { biography, archive, experience, layout };
const version = createHash("sha256").update(JSON.stringify(content)).digest("hex");
await writeFile(new URL("../dist/editor-base.json", import.meta.url), JSON.stringify({ version, content }) + "\n");
