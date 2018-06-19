const {Component} = require('react')

module.exports = (Firebase) => class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      snapshot: {}
    }
  }

  componentDidMount () {
    const {uploadTask} = this.props
    uploadTask.on('state_changed', (snapshot) => {
      this.setState({
        snapshot
      })
    })
  }

  render () {
    return this.props.children(this.state.snapshot)
  }
}
