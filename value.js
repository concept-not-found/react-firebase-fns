const {Component} = require('react')

module.exports = (Firebase) => class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: undefined
    }

    this.setupListener = () => {
      const {path} = this.props
      this.reference = Firebase.database().ref(path)
      this.onValueListener = this.reference.on('value', (snapshot) => {
        this.setState({
          value: snapshot.val()
        })
      })
    }

    this.cleanUpListener = () => {
      if (!this.reference) {
        return
      }
      this.reference.off('value', this.onValueListener)
      this.reference = undefined
    }
  }

  componentDidMount () {
    this.setupListener()
  }

  componentDidUpdate ({path: prevPath}) {
    const {path} = this.props
    if (path !== prevPath) {
      this.cleanUpListener()
      this.setState({
        value: undefined
      })
      this.setupListener()
    }
  }

  componentWillUnmount () {
    this.cleanUpListener()
  }

  render () {
    return this.props.children(this.state.value)
  }
}
