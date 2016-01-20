import { VNode, VText } from 'virtual-dom'


export default function element(type, props = {}, ...children) {
  props = Object.assign({}, props, { children })

  let element = { type, props }

  let childVNodes = getChildVNodes(children)
  element.vnode = new VNode(type, props, childVNodes)

  return element
}


export function text(text) {
  text = String(text)

  let element = {
    type: '__text__',
    props: {},
    vnode: new VText(text)
  }

  return element
}


export function getChildElements(children) {
  let childElements = []

  let collectChildElements = (child) => {
    if (Array.isArray(child)) {
      collectChildElements(child)
    } else if (typeof child === 'object') {
      childElements.push(child)
    } else {
      childElements.push(text(child))
    }
  }
  children.forEach(collectChildElements)

  return childElements
}


export function getChildVNodes(children) {
  let childElements = getChildElements(children)
  let childVNodes = childElements.map(element => element.vnode)
  return childVNodes
}
