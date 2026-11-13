// news-image-01 entry (Node 22, standard library only).
// The image beside this file is the entry: a newspaper front page
// summing up the world's news of Friday 13 November 2026 — Senate
// summons Huang & Lutnick, Zelensky meets US envoys, a drone hits a
// Russian warship, Iran claims a strike in Bahrain, the FBI's North
// Korea $400m crypto hack, Kane's England caps record, and the US
// record 483,200 deportations — around a central globe. The program
// copies it, byte for byte, to /output/entry.png so the judge sees
// exactly those bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);

// The copy must be exact: the judge sees these bytes, and the entry
// runs twice, so both runs have to write the same file. Refuse to
// finish quietly if the sizes ever disagree.
if (statSync(source).size !== statSync(target).size) {
  throw new Error('entry.png copy is incomplete');
}
