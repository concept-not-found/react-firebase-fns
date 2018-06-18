const {Component} = require('react')

const ORDER_BY_TYPES = [
  'child',
  'key',
  'priority',
  'value'
]

module.exports = (Firebase) => class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: {}
    }

    this.setupListener = () => {
      const {path, startAt, startAtKey, endAt, endAtKey, equalTo, equalToKey, limitToFirst, limitToLast} = this.props
      let {orderBy, orderByChild} = this.props
      this.reference = Firebase.database().ref(path)
      if (!orderBy && orderByChild) {
        orderBy = 'child'
      }
      if (orderBy) {
        switch (orderBy) {
          case 'child':
            if (!orderByChild) {
              throw new Error('orderByChild must be used when orderBy="child"')
            }
            this.reference = this.reference.orderByChild(orderByChild)
            break
          case 'key':
            this.reference = this.reference.orderByKey()
            break
          case 'priority':
            this.reference = this.reference.orderByPriority()
            break
          case 'value':
            this.reference = this.reference.orderByValue()
            break
          default:
            throw new Error(`orderBy must be one of [${ORDER_BY_TYPES.join(', ')}] but got ${orderBy}`)
        }
      }
      if (startAt) {
        this.reference = this.reference.startAt(startAt, startAtKey)
      }
      if (endAt) {
        this.reference = this.reference.endAt(endAt, endAtKey)
      }
      if (equalTo) {
        this.reference = this.reference.equalTo(equalTo, equalToKey)
      }
      if (limitToFirst) {
        this.reference = this.reference.limitToFirst(Number.parseInt(limitToFirst, 10))
      }
      if (limitToLast) {
        this.reference = this.reference.limitToLast(Number.parseInt(limitToLast, 10))
      }
      this.onChildAddedListener = this.reference.on('child_added', (snapshot) => {
        this.setState({
          list: Object.assign({}, this.state.list, {
            [snapshot.key]: snapshot.val()
          })
        })
      })
      this.onChildRemovedListener = this.reference.on('child_removed', (snapshot) => {
        const nextList = {}
        for (const key in this.state.list) {
          if (key !== snapshot.key) {
            nextList[key] = this.state.list[key]
          }
        }
        this.setState({
          list: nextList
        })
      })
      this.onChildChangedListener = this.reference.on('child_changed', (snapshot) => {
        this.setState({
          list: Object.assign({}, this.state.list, {
            [snapshot.key]: snapshot.val()
          })
        })
      })
    }

    this.cleanUpListener = () => {
      if (!this.reference) {
        return
      }
      this.reference.off('child_added', this.onChildAddedListener)
      this.reference.off('child_removed', this.onChildAddonChildRemovedListeneredListener)
      this.reference.off('child_changed', this.onChildChangedListener)
      this.reference = undefined
    }
  }

  componentDidMount () {
    this.setupListener()
  }

  componentDidUpdate ({path: prevPath, limit: prevLimit = 16}) {
    const {path, limit = 16} = this.props
    if (path !== prevPath || limit !== prevLimit) {
      this.cleanUpListener()
      this.setState({
        list: {}
      })
      this.setupListener()
    }
  }

  componentWillUnmount () {
    this.cleanUpListener()
  }

  render () {
    return this.props.children(this.state.list)
  }
}
