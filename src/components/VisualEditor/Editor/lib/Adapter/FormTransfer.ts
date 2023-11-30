export class FormTransfer {
  getDefaultValue(config) {
    const defaultValue = {}

    for (const conf of config) {
      if (conf.defaultValue !== undefined) {
        defaultValue[conf.key] = conf.defaultValue
      }

      if (conf.children) {
        const childrenDefaultValue = this.getDefaultValue(conf.children)
        if (Object.keys(childrenDefaultValue).length > 0) {
          defaultValue[conf.key] = childrenDefaultValue
        }
      }
    }

    return defaultValue
  }

  getDiff(prev, curr) {
    const diff = {}

    for (const key in prev) {
      if (typeof prev[key] === 'object' && curr.hasOwnProperty(key)) {
        const nestedDiff = this.getDiff(prev[key], curr[key])
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff
        }
      } else if (prev[key] !== curr[key]) {
        diff[key] = curr[key]
      }
    }

    for (const key in curr) {
      if (!prev.hasOwnProperty(key)) {
        diff[key] = curr[key]
      }
    }

    return diff
  }
}
