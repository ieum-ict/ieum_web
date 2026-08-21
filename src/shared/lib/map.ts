export type Coordinate = {
  lat: number
  lng: number
}

export type ScreenPoint = {
  x: number
  y: number
}

export const TILE_SIZE = 256

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function project({ lat, lng }: Coordinate, zoom: number): ScreenPoint {
  const scale = TILE_SIZE * 2 ** zoom
  const sin = Math.sin((lat * Math.PI) / 180)

  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  }
}

export function unproject({ x, y }: ScreenPoint, zoom: number): Coordinate {
  const scale = TILE_SIZE * 2 ** zoom
  const lng = (x / scale) * 360 - 180
  const n = Math.PI - (2 * Math.PI * y) / scale
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))

  return { lat, lng }
}

export function pointsToPath(points: ScreenPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ')
}
