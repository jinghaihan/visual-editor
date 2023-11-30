export function getRgbaColor(value) {
  if (!value) return

  const { r, g, b, a = 1 } = value
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export function hexToRgb(hex) {
  hex = hex.replace('#', '')

  let r, g, b

  if (hex.length === 3) {
    r = parseInt(hex.substring(0, 1).repeat(2), 16)
    g = parseInt(hex.substring(1, 2).repeat(2), 16)
    b = parseInt(hex.substring(2, 3).repeat(2), 16)
  } else {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }

  return {
    r,
    g,
    b,
  }
}
