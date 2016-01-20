
export default class Component {
  constructor(props = {}, context = null) {
    this.type = this.constructor
    this.props = props
    this.context = context
    this.state = null
    this.renderer_ = null
  }

  setRenderer(renderer) {
    this.renderer_ = renderer
  }

  setTransaction(transaction) {
    this.transaction_ = transaction
  }

  setState(nextPartialState) {
    if (this.transaction_) {
      this.transaction_.setState(nextPartialState)
      return
    }
    if (this.renderer_) {
      this.renderer_.setComponentState(this, nextPartialState)
      return
    }

    throw new Error(
      'Component#setState() ' +
      'called for a untranslatable component'
    )
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {}
}
