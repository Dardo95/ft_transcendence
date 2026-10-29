import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const RAW_DIR = path.resolve('public/game/raw');
const OUT_DIR = path.resolve('public/game/atlas');
const TILE_SIZE = 32;
const COLS = 8;

// Solo tiles/props estáticos para el mapa
const TILE_KEYS = [
  'tile_floor.png',
  'tile_floor_dirty.png',
  'tile_wall.png',
  'tile_table.png',
  'crate_wood.png',
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs
  .readdirSync(RAW_DIR)
  .filter((f) => f.endsWith('.png') && TILE_KEYS.includes(f))
  .sort();

if (files.length === 0) {
  console.error('No tile images found. Check TILE_KEYS or RAW_DIR.');
  process.exit(1);
}

const count = files.length;
const rows = Math.ceil(count / COLS);
const width = COLS * TILE_SIZE;
const height = rows * TILE_SIZE;

const composites = [];
const frames = {};

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const x = col * TILE_SIZE;
  const y = row * TILE_SIZE;

  // Normalizar a 32x32 por si vienen con otro tamaño
  const buffer = await sharp(path.join(RAW_DIR, file))
    .resize(TILE_SIZE, TILE_SIZE, {
      fit: 'cover',
      position: 'center',
    })
    .png()
    .toBuffer();

  composites.push({
    input: buffer,
    left: x,
    top: y,
  });

  frames[file] = {
    frame: { x, y, w: TILE_SIZE, h: TILE_SIZE },
    rotated: false,
    trimmed: false,
    spriteSourceSize: { x: 0, y: 0, w: TILE_SIZE, h: TILE_SIZE },
    sourceSize: { w: TILE_SIZE, h: TILE_SIZE },
  };
}

const atlas = sharp({
  create: {
    width,
    height,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
});

await atlas.composite(composites).png().toFile(path.join(OUT_DIR, 'tileset.png'));

const json = {
  frames,
  meta: {
    app: 'custom-script',
    version: '1.0',
    image: 'tileset.png',
    format: 'RGBA8888',
    size: { w: width, h: height },
    scale: '1',
  },
};

fs.writeFileSync(path.join(OUT_DIR, 'tileset.json'), JSON.stringify(json, null, 2));

console.log(`Generated tileset.png (${width}x${height}) with ${count} tiles for map`);