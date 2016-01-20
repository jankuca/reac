import { VNode, VText } from 'virtual-dom'


export default function element(type, props = {}, ...children) {
  props = Object.assign({}, props, { children })

  let element = { type, props }

  let childVNodes = getChildElements(children).map(element => element.vnode)
  element.vnode = new VNode(type, props, childVNodes)

  return element
}


function getChildElements(children) {
  let childElements = []

  let collectChildElements = (child) => {
    if (Array.isArray(child)) {
      collectChildElements(child)
    } else if (typeof child === 'object') {
      childElements.push(child)
    } else {
      childElements.push(new VText(child))
    }
  }
  children.forEach(collectChildElements)

  return childElements
}
