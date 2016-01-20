
export class MountTransaction {
  constructor() {
    this.nextState_ = null
  }
  perform(component, nextElement) {
    component = new nextElement.type(nextElement.props)
    this.nextState_ = component.state

    component.componentWillMount()
    component.state = this.nextState_

    component.render()
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
  perform(component, nextElement) {
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

    component.render()
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
  perform(component, nextElement) {
    let nextState = Object.assign({}, component.state, this.nextPartialState_)

    if (!component.shouldComponentUpdate(nextElement.props, nextState)) {
      component.state = nextState
      return
    }

    component.componentWillUpdate(component.props, nextState)
    component.state = nextState
    component.render()
    component.componentDidUpdate(component.props, nextState)
  }
  setState(nextPartialState) {
    this.nextPartialState_ = Object.assign({}, this.nextPartialState_, nextPartialState_)
  }
}

export class UnmountTransaction {
  constructor() {}
  perform(component, nextElement) {
    component.componentWillUnmount()
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
  perform(component, nextElement) {
    if (component) {
      this.transaction_ = new UnmountTransaction()
      component = this.transaction_.perform(component, null)
    }
    if (nextElement) {
      this.transaction_ = new MountTransaction()
      component = this.transaction_.perform(null, nextElement)
    }
    return component
  }
  setState(nextPartialState) {
    this.transaction_.setState(nextPartialState)
  }
}
