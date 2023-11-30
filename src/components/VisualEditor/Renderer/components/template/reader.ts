export function readAsText(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      const contents = e.target?.result
      resolve(contents)
    }
    reader.readAsText(file)
  })
}

export function readAsBase64(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function () {
      const contents = reader.result
      resolve(contents)
    }
    reader.readAsDataURL(file)
  })
}

export function readAsObjectUrl(file: File) {
  return URL.createObjectURL(file)
}
