export function getFieldOption (field, type) {
  return {
    label: field.name,
    title: field.name,
    value: JSON.stringify({
      fieldId: field.id,
      fieldType: type.toUpperCase(),
      name: field.name
    }),
    fieldId: field.id,
    fieldType: type.toUpperCase(),
    ...field
  }
}

export function getModelOptions (modelData, isTree) {
  let options = []
  const filedTypeMap = {
    'dimension': '维度',
    'measure': '指标'
  }

  Object.keys(filedTypeMap).forEach(type => {
    let data = modelData[type + 's']
    if (!data) {
      return
    }

    if (!isTree) {
      data.forEach(item => {
        options.push(getFieldOption(item, type))
      })
    } else {
      options.push({
        label: filedTypeMap[type],
        title: filedTypeMap[type],
        value: type + 's',
        children: [],
        isLeaf: false,
        selectable: false
      })
      options[options.length - 1].children = data.map(item => {
        return {
          ...getFieldOption(item, type),
          isLeaf: true
        }
      })
    }
  })

  return options
}
