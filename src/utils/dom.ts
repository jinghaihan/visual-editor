export function parents(element, selector) {
  const parentsArray = [] as HTMLElement[]
  let parent = element.parentNode as HTMLElement

  while (parent !== null) {
    if (parent.nodeType === 1 && (!selector || parent.matches(selector))) {
      parentsArray.push(parent)
    }
    parent = parent.parentNode as HTMLElement
  }

  return parentsArray
}
