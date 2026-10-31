import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { mkdtemp, writeFile, rm } from 'node:fs/promises';

import { tmpdir } from 'node:os';

import { join } from 'node:path';

import { MapRegistryService } from './map-registry.service.js';

const VALID_MAP = ['#######', '#1.+.2#', '#.#.#.#', '#3...4#', '#######'].join(
  '\n'
);

describe('MapRegistryService', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'kitchen-mayhem-'));
  });

  afterEach(async () => {
    await rm(directory, {
      recursive: true,
      force: true,
    });
  });

  it('loads TXT files and ignores other files', async () => {
    await writeFile(join(directory, 'map1.txt'), VALID_MAP);

    await writeFile(join(directory, 'README.md'), 'Not a map');

    const registry = new MapRegistryService();

    await registry.loadFromDirectory(directory);

    expect(registry.hasMap('map1')).toBe(true);
    expect(registry.getMapIds()).toEqual(['map1']);
  });

  it('loads multiple maps', async () => {
    await writeFile(join(directory, 'map1.txt'), VALID_MAP);

    await writeFile(join(directory, 'map2.txt'), VALID_MAP);

    const registry = new MapRegistryService();

    await registry.loadFromDirectory(directory);

    expect(registry.getMapIds()).toEqual(['map1', 'map2']);

    expect(registry.getAvailableMaps()).toHaveLength(2);
  });

  it('returns map information', async () => {
    await writeFile(join(directory, 'map1.txt'), VALID_MAP);

    const registry = new MapRegistryService();

    await registry.loadFromDirectory(directory);

    expect(registry.getAvailableMaps()).toEqual([
      {
        id: 'map1',
        width: 7,
        height: 5,
        spawnPointCount: 4,
      },
    ]);
  });

  it('does not allow modifying the registered map', async () => {
    await writeFile(join(directory, 'map1.txt'), VALID_MAP);

    const registry = new MapRegistryService();

    await registry.loadFromDirectory(directory);

    const mapA = registry.getMap('map1');

    mapA.tiles[1][3] = 'FLOOR';

    const mapB = registry.getMap('map1');

    expect(mapB.tiles[1][3]).toBe('DESTRUCTIBLE');
  });

  it('rejects an unknown map', async () => {
    await writeFile(join(directory, 'map1.txt'), VALID_MAP);

    const registry = new MapRegistryService();

    await registry.loadFromDirectory(directory);

    expect(() => registry.getMap('unknown')).toThrow('Map "unknown" not found');
  });

  it('rejects an empty directory', async () => {
    const registry = new MapRegistryService();

    await expect(registry.loadFromDirectory(directory)).rejects.toThrow(
      'No map files found'
    );
  });

  it('rejects malformed maps', async () => {
    await writeFile(join(directory, 'map1.txt'), '#######\n#1..#');

    const registry = new MapRegistryService();

    await expect(registry.loadFromDirectory(directory)).rejects.toThrow(
      /Failed to load map/
    );
  });

  it('rejects duplicated IDs regardless of filename case', async () => {
    await writeFile(join(directory, 'map1.txt'), VALID_MAP);

    await writeFile(join(directory, 'MAP1.txt'), VALID_MAP);

    const registry = new MapRegistryService();

    await expect(registry.loadFromDirectory(directory)).rejects.toThrow(
      /Duplicate map ID/
    );
  });
});
