/**
 * The road under the corridor, as pure functions of camera distance.
 *
 * `d` is the signed distance from the camera to a block's centre:
 * negative = still ahead, positive = already passed.
 *
 * The road is a fixed grid of blocks in world space. Only a pool of them is
 * drawn at a time, and the pool slides as the camera travels: the block that
 * leaves behind the camera is invisible by then, and the one that joins at
 * the front starts at opacity zero, so the swap is never seen. Scrolling
 * backwards runs the same functions in reverse.
 *
 * Everything here is a pure function of `d` (and of camera z for placement),
 * so the motion is fully reversible with scroll and testable without a
 * renderer.
 */

/** Base height of the road surface. The camera rides just above it. */
export const REST_Y = -4

/** Centre-to-centre distance between neighbouring blocks. */
export const BLOCK_STEP = 12

/**
 * Block depth: the blocks touch, edge to edge.
 *
 * A seam between them would show the sky through the road exactly at the
 * bottom of the frame. The joints still read because neighbouring blocks sit
 * at slightly different heights — see blockY.
 */
export const BLOCK_DEPTH = BLOCK_STEP

/**
 * Height difference between neighbouring blocks. Small enough not to trip
 * the eye, large enough that each joint catches the light as a line.
 */
export const LIP = 0.12

/** Height of the block at world z. Alternating, and stable in the world. */
export function blockY(z: number) {
  return REST_Y + (Math.abs(Math.round(z / BLOCK_STEP)) % 2) * LIP
}

/**
 * Block width. Wide enough that the road still reaches both bottom corners
 * of the frame when the camera drifts to either side of the centre line.
 */
export const BLOCK_WIDTH = 14

/**
 * Blocks drawn at a time: the one under the camera plus three ahead, and the
 * three ahead are the footings you travel along.
 *
 * Four is the smallest pool that keeps the road touching the bottom edge of
 * the frame at every point in the cycle: with three, the block nearest the
 * camera can sit far enough ahead that the viewport bottom shows through.
 */
export const POOL = 4

/** Distance within which the road is solid underfoot. */
export const ROAD_SOLID = 18

/**
 * Distance at which a block is fully faded.
 *
 * Exactly the distance a block sits at the moment it joins the pool, so a
 * block arriving from the front, or dropping out of it while scrolling back,
 * does so at zero opacity rather than popping into view.
 */
export const ROAD_FAR = (POOL - 1 + 0.5) * BLOCK_STEP

/** World z of slot `slot` of the pool, for a camera at `camZ`. */
export function blockZ(slot: number, camZ: number) {
  return (Math.round(camZ / BLOCK_STEP) - slot) * BLOCK_STEP
}

/**
 * Solid close to the camera, fading into the fog by ROAD_FAR.
 *
 * The road has to be solid underfoot: that is the part filling the bottom of
 * the frame, and fading it out would open a hole at the viewer's feet.
 */
export function roadOpacity(d: number) {
  const ahead = -d
  if (ahead >= ROAD_FAR) return 0
  if (ahead <= ROAD_SOLID) return 0.9
  return (0.9 * (ROAD_FAR - ahead)) / (ROAD_FAR - ROAD_SOLID)
}

/**
 * A block draws while any of it is ahead of the camera and it has something
 * to show. The block can sit up to half a step behind the camera and still
 * reach forward under it, which is what fills the bottom of the frame.
 */
export function roadVisible(d: number) {
  return d < BLOCK_DEPTH / 2 && roadOpacity(d) > 0.01
}
