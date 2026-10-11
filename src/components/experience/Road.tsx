import { Platform } from './Platform'
import { POOL } from '../../lib/platform'

/**
 * The road: a pool of blocks the camera slides past. No occupant stands on
 * them, so nothing reads as a post rising from the platform.
 */
export function Road() {
  return (
    <group>
      {Array.from({ length: POOL }, (_, slot) => (
        <Platform key={slot} slot={slot} />
      ))}
    </group>
  )
}
