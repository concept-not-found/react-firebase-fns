const {createElement, Component, createContext} = require('react')

module.exports = (Firebase) => {
  const UserContext = createContext({})
  return {
    Provider: class extends Component {
      constructor (props) {
        super(props)

        this.state = {
          user: undefined
        }
      }

      componentDidMount () {
        this.unsubscribeOnAuthStateChanged = Firebase.auth().onAuthStateChanged((user) => {
          this.setState({
            user
          })
        })
      }

      componentWillUnmount () {
        if (this.unsubscribeOnAuthStateChanged) {
          this.unsubscribeOnAuthStateChanged()
        }
      }

      render () {
        return createElement(UserContext.Provider, {value: this.state.user}, this.props.children)
      }
    },

    Consumer: UserContext.Consumer
  }
}
