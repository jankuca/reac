import {
  MountTransaction,
  ReceivePropsTransaction,
  ReplaceComponentTransaction
} from './transactions'


export default class Renderer {
  constructor() {
    this.mountedComponents_ = new WeakMap()
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

    let nextComponent = transaction.perform(prevComponent, nextElement)
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
    transaction.perform(component, null)
    this.mountedComponents_.delete(mountNode)
  }
}
