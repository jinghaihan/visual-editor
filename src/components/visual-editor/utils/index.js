import Vue from 'vue'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import domToImage from 'dom-to-image'

// 获取uuid
export function generateUUID () {
  return uuid().replace(/-/g, '')
}

// 中划线转驼峰
export function transferCamelcase (str) {
  var arr = str.split('-')
  var len = arr.length
  for (var i = 0; i < len; i++) {
    if (!i) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    } else {
      arr[i] = arr[i].charAt(0).toLowerCase() + arr[i].slice[1]
    }
  }
  str = arr.join('')
  return str
}

// 中划线转大驼峰
export function transferUpperCamelCase (str) {
  var arr = str.split('-')
  var len = arr.length
  for (var i = 0; i < len; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }
  str = arr.join('')
  return str
}

// 加载插件组件
export function loadPluginComponent (key, module) {
  Vue.component(key, module)
}

// 生成缩略图
export function getSnapshot (el, options) {
  return new Promise((resolve, reject) => {
    domToImage.toPng(el)
      .then(function (dataUrl) {
        resolve(dataUrl)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

// 下载文件
export function downloadFile (fileName, content) {
  let aLink = document.createElement('a')
  let blob = base64ToBlob(content)
  let evt = document.createEvent('HTMLEvents')
  evt.initEvent('click', true, true)
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.click()
}

export async function downloadJson (fileName, data) {
  let aLink = document.createElement('a')
  let blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json,charset=utf-8;' })
  let evt = document.createEvent('HTMLEvents')
  evt.initEvent('click', true, true)
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.click()
}

export function base64ToBlob (code) {
  let parts = code.split(';base64,')
  let contentType = parts[0].split(':')[1]
  let raw = window.atob(parts[1])
  let rawLength = raw.length
  let uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

export function readJsonFile (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      resolve(e.target.result)
    }
    reader.readAsText(file, 'utf-8')
  })
}
