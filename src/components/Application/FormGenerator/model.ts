export interface FormGeneratorConfig {
  key: string
  label: string
  type: string | FormType
  defaultValue?: string | number | boolean | null
  rules?: any[]
  props?: any
  children?: FormGeneratorConfig[]
}

export enum FormType {
  COLLAPSE = 'collapseForm',
  RADIOBUTTON = 'radioButtonForm',
}
