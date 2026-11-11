import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src/assets/sprites');
const PUB_DIR = path.resolve('public/game');

// prefijo -> carpeta destino en public/game
const RULES = [
  { test: (f) => f.startsWith('char_'), dest: 'characters' },
  { test: (f) => f.startsWith('bomb_') || f.startsWith('explosion_'), dest: 'fx' },
  { test: (f) => f.startsWith('powerup_'), dest: 'items' },
];

// tile_* y crate_* NO se copian: van empaquetados en atlas/tileset.png
const ATLAS_ONLY = (f) => f.startsWith('tile_') || f.startsWith('crate_');

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Source dir not found: ${SRC_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.png'));
const expected = new Map(); // dest -> Set(files)
let copied = 0;
let skipped = 0;
const unknown = [];

for (const file of files) {
  if (ATLAS_ONLY(file)) continue;

  const rule = RULES.find((r) => r.test(file));
  if (!rule) {
    unknown.push(file);
    continue;
  }

  const destDir = path.join(PUB_DIR, rule.dest);
  fs.mkdirSync(destDir, { recursive: true });

  const src = path.join(SRC_DIR, file);
  const dst = path.join(destDir, file);

  if (!expected.has(destDir)) expected.set(destDir, new Set());
  expected.get(destDir).add(file);

  const same =
    fs.existsSync(dst) &&
    fs.statSync(src).size === fs.statSync(dst).size &&
    fs.statSync(src).mtimeMs <= fs.statSync(dst).mtimeMs;

  if (same) {
    skipped++;
    continue;
  }

  fs.copyFileSync(src, dst);
  copied++;
}

// Espejo: borrar ficheros de public/game/<dir> que ya no estén en la fuente
let removed = 0;
for (const [destDir, keep] of expected) {
  if (!fs.existsSync(destDir)) continue;
  for (const existing of fs.readdirSync(destDir)) {
    if (!keep.has(existing)) {
      fs.unlinkSync(path.join(destDir, existing));
      removed++;
    }
  }
}

console.log(`Synced sprites -> public/game`);
console.log(`  copied:  ${copied}`);
console.log(`  skipped: ${skipped}`);
console.log(`  removed: ${removed}`);
if (unknown.length) {
  console.warn(`  unrecognised (not copied): ${unknown.join(', ')}`);
}
