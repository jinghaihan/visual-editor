import domToImage from 'dom-to-image'

export function getSnapshot(el) {
  return new Promise((resolve, reject) => {
    domToImage
      .toPng(el)
      .then(function (dataUrl) {
        resolve(dataUrl)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export function downloadJson(fileName: string, data: any) {
  const aLink = document.createElement('a')
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json,charset=utf-8;',
  })
  const evt = document.createEvent('HTMLEvents')
  evt.initEvent('click', true, true)
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.click()
}
