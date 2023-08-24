const header = [
  {
    column: 6,
    name: '字段',
    required: false
  },
  {
    column: 4,
    name: '字段格式',
    required: false
  },
  {
    column: 4,
    name: '限制条件',
    required: false
  },
  {
    column: 8,
    name: '限制条件值',
    required: false
  },
  {
    column: 2,
    name: '操作',
    required: false,
    center: true
  }
]

const config = [
  {
    column: 6,
    type: 'tree-select',
    options: [],
    key: 'field',
    center: true,
    placeholder: '请选择字段',
    showSearch: true,
    rules: [
      { required: true, message: '请选择字段' }
    ],
    relations: {
      assign: { format: null }
    }
  },
  {
    column: 4,
    type: 'text',
    key: 'format',
    rules: []
  },
  {
    column: 4,
    type: 'select',
    options: [
      {
        label: '介于',
        value: 'BETWEEN'
      },
      {
        label: '等于',
        value: '='
      },
      {
        label: '小于',
        value: '<'
      },
      {
        label: '大于',
        value: '>'
      },
      {
        label: '小于等于',
        value: '<='
      },
      {
        label: '大于等于',
        value: '>='
      },
      {
        label: '不等于',
        value: '!='
      },
      {
        label: '为空',
        value: 'IS NULL'
      },
      {
        label: '非空',
        value: 'IS NOT NULL'
      }
    ],
    key: 'option',
    center: true,
    placeholder: '请选择限制条件',
    showSearch: true,
    rules: [
      { required: true, message: '请选择限制条件' }
    ],
    relations: {
      config: null,
      validate: ['values']
    }
  },
  {
    column: 8,
    type: 'input',
    key: 'values',
    center: true,
    defaultValue: undefined,
    placeholder: '请输入限制条件值',
    rules: [
      {
        validator: function (value, form) {
          let option = form.option
          if (option === 'IS NULL' || option === 'IS NOT NULL') {
            return true
          }
          return !!value
        },
        message: '请输入限制条件值'
      }
    ]
  },
  {
    column: 2,
    type: 'action',
    key: 'action',
    center: true,
    operations: [
      {
        name: '删除本行',
        icon: 'minus-circle',
        event: 'delete'
      }
    ]
  }
]

export { header, config }
