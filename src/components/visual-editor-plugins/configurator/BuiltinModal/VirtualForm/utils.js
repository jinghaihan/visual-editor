import { v4 as uuid } from 'uuid'

export function generateUUID () {
  return uuid().replace(/-/g, '')
}

export function getFieldsValue (data) {
  let result = []
  data.forEach(item => {
    let formData = {}
    Object.keys(item).forEach(field => {
      if (field === 'key') return
      formData[field] = item[field].value
    })
    result.push(formData)
  })

  return result
}

export function getFieldError (current, errors) {
  return [...new Set(current.concat(errors))]
}
