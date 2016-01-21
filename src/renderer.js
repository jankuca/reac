import { diff } from 'virtual-dom'

import {
  MountTransaction,
  ReceivePropsTransaction,
  ReplaceComponentTransaction
} from './transactions'


export default class Renderer {
  constructor(driver) {
    this.driver_ = driver
    this.mountedComponents_ = new WeakMap()
    this.renderedElements_ = new WeakMap()
    this.rootNodes_ = new WeakMap()
  }

  render(nextElement, mountNode) {
    let prevComponent = this.mountedComponents_.get(mountNode)

    let transaction
    if (!prevComponent) {
      transaction = new MountTransaction()
    } else if (nextElement.type !== prevComponent.type) {
      transaction = new ReplaceComponentTransaction()
    } else {
      transaction = new ReceivePropsTransaction()
    }

    let render = this.updateRendering_.bind(this, mountNode)
    let nextComponent = transaction.perform(prevComponent, nextElement, render)

    this.mountedComponents_.set(mountNode, nextComponent)
  }

  unmountComponentAtNode(mountNode) {
    let component = this.mountedComponents_.get(mountNode)
    if (!component) {
      throw new Error(
        'Renderer#unmountComponentAtNode(): ' +
        'No component mounted at the node'
      )
    }

    let transaction = new UnmountTransaction()

    let render = this.updateRendering_.bind(this, mountNode)
    transaction.perform(component, null, render)

    this.mountedComponents_.delete(mountNode)
  }

  updateRendering_(mountNode, nextRenderedElement) {
    let prevRenderedElement = this.renderedElements_.get(mountNode)
    let nextRootNode = this.applyElementToRendering_(
      mountNode,
      prevRenderedElement,
      nextRenderedElement
    )
    if (nextRootNode) {
      this.rootNodes_.set(mountNode, nextRootNode)
      this.renderedElements_.set(mountNode, nextRenderedElement)
    } else {
      this.rootNodes_.delete(mountNode)
      this.renderedElements_.delete(mountNode)
    }
  }

  applyElementToRendering_(mountNode, prevRenderedElement, nextRenderedElement) {
    let nextRootNode
    if (!prevRenderedElement) {
      nextRootNode = this.driver_.mount(mountNode, nextRenderedElement)
    } else if (!nextRenderedElement) {
      nextRootNode = this.driver_.unmount(mountNode, prevRenderedElement)
    } else {
      let patches = diff(prevRenderedElement.vnode, nextRenderedElement.vnode)
      let prevRootNode = this.rootNodes_.get(mountNode)
      nextRootNode = this.driver_.applyPatches(mountNode, prevRootNode, patches)
    }
    return nextRootNode
  }
}
