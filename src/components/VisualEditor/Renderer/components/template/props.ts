export function getPixelProps() {
  return {
    precision: 0,
    min: 0,
    max: Infinity,
    formatter: (value) => `${value}px`,
    parser: (value) => value.replace('px', ''),
  }
}
