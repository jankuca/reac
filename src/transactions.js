
export class MountTransaction {
  constructor() {
    this.nextState_ = null
  }
  perform(component, nextElement, render) {
    component = new nextElement.type(nextElement.props)
    this.nextState_ = component.state

    component.componentWillMount()
    component.state = this.nextState_

    let effectiveElement = component.render()
    render(effectiveElement)

    component.componentDidMount()
  }
  setState(nextPartialState) {
    this.nextState_ = Object.assign({}, this.nextState_, nextPartialState)
  }
}

export class ReceivePropsTransaction {
  constructor() {
    this.nextState_ = null
  }
  perform(component, nextElement, render) {
    let prevProps = component.props
    let prevState = component.state
    this.nextState_ = prevState

    component.componentWillReceiveProps(nextElement.props)

    if (!component.shouldComponentUpdate(nextElement.props, this.nextState_)) {
      component.props = nextElement.props
      component.state = this.nextState_
      return
    }

    component.componentWillUpdate(nextElement.props, this.nextState_)
    component.props = nextElement.props
    component.state = this.nextState_

    let effectiveElement = component.render()
    render(effectiveElement)

    component.componentDidUpdate(prevProps, prevState)
  }
  setState(nextPartialState) {
    this.nextState_ = Object.assign({}, this.nextState_, nextPartialState)
  }
}

export class SetStateTransaction {
  constructor() {
    this.nextPartialState_ = null
  }
  perform(component, nextElement, render) {
    let nextState = Object.assign({}, component.state, this.nextPartialState_)

    if (!component.shouldComponentUpdate(nextElement.props, nextState)) {
      component.state = nextState
      return
    }

    component.componentWillUpdate(component.props, nextState)
    component.state = nextState

    let effectiveElement = component.render()
    render(effectiveElement)

    component.componentDidUpdate(component.props, nextState)
  }
  setState(nextPartialState) {
    this.nextPartialState_ = Object.assign({}, this.nextPartialState_, nextPartialState_)
  }
}

export class UnmountTransaction {
  constructor() {}
  perform(component, nextElement, render) {
    component.componentWillUnmount()
    render(null)
    return null
  }
  setState(nextPartialState) {
    throw new Error(
      'UnmountTransaction#setState(): ' +
      'Cannot update a component which is being unmounted'
    )
  }
}

export class ReplaceComponentTransaction {
  constructor() {
    this.transaction_ = null
  }
  perform(component, nextElement, render) {
    if (component) {
      this.transaction_ = new UnmountTransaction()
      component = this.transaction_.perform(component, null, render)
    }
    if (nextElement) {
      this.transaction_ = new MountTransaction()
      component = this.transaction_.perform(null, nextElement, render)
    }
    return component
  }
  setState(nextPartialState) {
    this.transaction_.setState(nextPartialState)
  }
}
