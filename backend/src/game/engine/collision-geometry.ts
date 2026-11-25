// La hitbox de muerte vive en shared (fuente única con la demo):
// se re-exporta aquí para no romper los imports existentes.
export { PLAYER_HALF_SIZE, overlapsTile } from '@transcendence/shared';
