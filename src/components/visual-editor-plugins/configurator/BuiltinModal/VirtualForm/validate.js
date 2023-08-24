// 必填校验
export function requiredValidate (value, rule) {
  if (!value && value !== 0) return rule.message
  if (rule.whitespace && !value.trim()) return rule.message
}

// 最长校验
export function maxValidate (value, rule) {
  if (value && value.length > rule.max) return rule.message
}

// 最短校验
export function minValidate (value, rule) {
  if (value && value.length < rule.min) return rule.message
}

// 正则校验
export function patternValidate (value, rule) {
  if (value && !rule.pattern.test(value.toString())) return rule.message
}

// validator校验
export function validatorValidate (value, rule, formData) {
  let result = rule.validator(value, formData)
  if (!result && typeof result === 'boolean') return rule.message
}
