import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import { readdir, readFile } from 'node:fs/promises';

import { basename, extname, resolve, join } from 'node:path';

import { parseMapText, type LoadedMap } from './map-loader.js';

export interface MapSummary {
  id: string;
  width: number;
  height: number;
  spawnPointCount: number;
}

@Injectable()
export class MapRegistryService implements OnModuleInit {
  private readonly logger = new Logger(MapRegistryService.name);

  private readonly mapsDirectory = resolve(
    process.cwd(),
    process.env.MAPS_DIR ?? 'maps'
  );

  private maps = new Map<string, LoadedMap>();

  /**
   * NestJS carga los mapas automáticamente al arrancar.
   */
  async onModuleInit(): Promise<void> {
    await this.loadFromDirectory();
  }

  /**
   * Lee y valida todos los archivos .txt.
   *
   * La sustitución del registro se realiza únicamente
   * cuando todos los mapas se han cargado correctamente.
   */
  async loadFromDirectory(
    directory: string = this.mapsDirectory
  ): Promise<void> {
    let entries;

    try {
      entries = await readdir(directory, {
        withFileTypes: true,
      });
    } catch (error) {
      throw new Error(
        `Cannot read maps directory "${directory}": ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    const files = entries
      .filter(
        (entry) =>
          entry.isFile() && extname(entry.name).toLowerCase() === '.txt'
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    if (files.length === 0) {
      throw new Error(`No map files found in "${directory}"`);
    }

    const loadedMaps = new Map<string, LoadedMap>();
    const normalizedIds = new Set<string>();

    for (const file of files) {
      const extension = extname(file.name);
      const id = basename(file.name, extension);

      // Los identificadores no pueden contener rutas.
      if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
        throw new Error(`Invalid map filename: "${file.name}"`);
      }

      const normalizedId = id.toLowerCase();

      if (normalizedIds.has(normalizedId)) {
        throw new Error(`Duplicate map ID: "${id}"`);
      }

      normalizedIds.add(normalizedId);

      const filePath = join(directory, file.name);

      try {
        const content = await readFile(filePath, 'utf8');

        const map = parseMapText(id, content);

        loadedMaps.set(id, map);

        this.logger.log(`Loaded map "${id}" (${map.width}x${map.height})`);
      } catch (error) {
        throw new Error(
          `Failed to load map "${id}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    // Solo reemplazamos el registro si todos los mapas
    // han sido cargados y validados correctamente.
    this.maps = loadedMaps;

    this.logger.log(`Loaded ${this.maps.size} maps successfully`);
  }

  /**
   * Obtiene una copia independiente del mapa.
   *
   * Evita que un consumidor pueda modificar accidentalmente
   * la plantilla almacenada en el registro.
   */
  getMap(id: string): LoadedMap {
    const map = this.maps.get(id);

    if (!map) {
      throw new NotFoundException(
        `Map "${id}" not found. Available maps: ${this.getMapIds().join(', ')}`
      );
    }

    return {
      ...map,
      tiles: map.tiles.map((row) => [...row]),
      spawnPoints: Object.fromEntries(
        Object.entries(map.spawnPoints).map(([spawnId, position]) => [
          spawnId,
          { ...position },
        ])
      ),
    };
  }

  /**
   * Devuelve los identificadores disponibles.
   */
  getMapIds(): string[] {
    return [...this.maps.keys()].sort();
  }

  /**
   * Devuelve información pública de los mapas.
   * No devuelve las matrices completas.
   */
  getAvailableMaps(): MapSummary[] {
    return [...this.maps.values()]
      .map((map) => ({
        id: map.id,
        width: map.width,
        height: map.height,
        spawnPointCount: Object.keys(map.spawnPoints).length,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  hasMap(id: string): boolean {
    return this.maps.has(id);
  }
}
