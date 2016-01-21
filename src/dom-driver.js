import { create, patch } from 'virtual-dom'


export default class DomDriver {
  mount(mountNode, nextElement) {
    let doc = (typeof document === 'undefined') ? null : document
    let rootNode = create(nextElement.vnode, {
      document: doc
    })
    mountNode.appendChild(rootNode)
    return rootNode
  }

  unmount(mountNode, prevRootNode) {
    mountNode.removeChild(prevRootNode)
    return null
  }

  applyPatches(mountNode, prevRootNode, patches) {
    let nextRootNode = patch(prevRootNode, patches)
    return nextRootNode
  }
}
