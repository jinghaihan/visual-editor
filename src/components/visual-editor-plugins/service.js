const service = {
  getModelList: () => {
    let arr = ['点击量模型', '下载量模型']
    return arr.map(item => {
      return {
        label: item,
        title: item,
        value: item
      }
    })
  },
  getModelData: (modelId) => {
    const map = {
      '点击量模型': () => {
        return {
          modelId,
          dimensions: [
            {
              id: 'date',
              name: '日期',
              format: 'YYYY-MM-DD',
              dayOfWeek: 0,
              columnType: 1
            }
          ],
          measures: [
            {
              id: 'pv',
              name: '点击量',
              format: null,
              dayOfWeek: 0,
              columnType: 0
            },
            {
              id: 'name',
              name: '名称',
              format: null,
              dayOfWeek: 0,
              columnType: 0
            },
            {
              id: 'description',
              name: '描述',
              format: null,
              dayOfWeek: 0,
              columnType: 0
            }
          ]
        }
      },
      '下载量模型': () => {

      }
    }

    return map[modelId] ? map[modelId]() : {}
  }
}

export default service
