import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const RAW_DIR = path.resolve('public/game/raw');
const OUT_DIR = path.resolve('public/game/atlas');
const TILE_SIZE = 64;
const COLS = 8;
const PADDING = 1;

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
const paddedSize = TILE_SIZE + PADDING * 2;
const width = COLS * paddedSize;
const height = rows * paddedSize;

const composites = [];
const frames = {};

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const x = col * paddedSize;
  const y = row * paddedSize;

  const resized = await sharp(path.join(RAW_DIR, file))
    .resize(TILE_SIZE, TILE_SIZE, {
      fit: 'cover',
      position: 'center',
    })
    .png()
    .toBuffer();

  const topRow = await sharp(resized).extract({ left: 0, top: 0, width: TILE_SIZE, height: 1 }).toBuffer();
  const bottomRow = await sharp(resized).extract({ left: 0, top: TILE_SIZE - 1, width: TILE_SIZE, height: 1 }).toBuffer();
  const leftCol = await sharp(resized).extract({ left: 0, top: 0, width: 1, height: TILE_SIZE }).toBuffer();
  const rightCol = await sharp(resized).extract({ left: TILE_SIZE - 1, top: 0, width: 1, height: TILE_SIZE }).toBuffer();
  const topLeft = await sharp(resized).extract({ left: 0, top: 0, width: 1, height: 1 }).toBuffer();
  const topRight = await sharp(resized).extract({ left: TILE_SIZE - 1, top: 0, width: 1, height: 1 }).toBuffer();
  const bottomLeft = await sharp(resized).extract({ left: 0, top: TILE_SIZE - 1, width: 1, height: 1 }).toBuffer();
  const bottomRight = await sharp(resized).extract({ left: TILE_SIZE - 1, top: TILE_SIZE - 1, width: 1, height: 1 }).toBuffer();

  const extruded = await sharp({
    create: {
      width: paddedSize,
      height: paddedSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: resized, left: PADDING, top: PADDING },
      { input: topRow, left: PADDING, top: 0 },
      { input: bottomRow, left: PADDING, top: paddedSize - 1 },
      { input: leftCol, left: 0, top: PADDING },
      { input: rightCol, left: paddedSize - 1, top: PADDING },
      { input: topLeft, left: 0, top: 0 },
      { input: topRight, left: paddedSize - 1, top: 0 },
      { input: bottomLeft, left: 0, top: paddedSize - 1 },
      { input: bottomRight, left: paddedSize - 1, top: paddedSize - 1 },
    ])
    .png()
    .toBuffer();

  composites.push({
    input: extruded,
    left: x,
    top: y,
  });

  frames[file] = {
    frame: { x: x + PADDING, y: y + PADDING, w: TILE_SIZE, h: TILE_SIZE },
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

console.log(`Generated tileset.png (${width}x${height}) with ${count} tiles for map (extruded)`);
