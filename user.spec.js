const {createElement} = require('react')
const {create} = require('react-test-renderer')

const FirebaseMock = require('./firebase-mock')
const UserFactory = require('./user')

describe('user', () => {
  it('should render undefined initially', () => {
    const {Firebase} = FirebaseMock()
    const User = UserFactory(Firebase)
    const component = create(createElement(User.Provider, {},
      createElement(User.Consumer, {},
        (user) => `user: ${JSON.stringify(user)}`
      )
    ))
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when the user logs in, component is re-rendered', () => {
    const {onAuthStateChangedMock, Firebase} = FirebaseMock()
    const User = UserFactory(Firebase)
    const component = create(createElement(User.Provider, {},
      createElement(User.Consumer, {},
        (user) => `user: ${JSON.stringify(user)}`
      )
    ))
    const listener = onAuthStateChangedMock.mock.calls[0][0]
    listener({
      displayName: 'some user'
    })
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when the user logs out, component is re-rendered', () => {
    const {onAuthStateChangedMock, Firebase} = FirebaseMock()
    const User = UserFactory(Firebase)
    const component = create(createElement(User.Provider, {},
      createElement(User.Consumer, {},
        (user) => `user: ${JSON.stringify(user)}`
      )
    ))
    const listener = onAuthStateChangedMock.mock.calls[0][0]
    listener({
      displayName: 'some user'
    })
    listener(undefined)
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when component is unmounted, listener is unsubscribed', () => {
    const {unsubscribeOnAuthStateChanged, Firebase} = FirebaseMock()
    const User = UserFactory(Firebase)
    const component = create(createElement(User.Provider, {},
      createElement(User.Consumer, {},
        (user) => `user: ${JSON.stringify(user)}`
      )
    ))
    component.unmount()
    expect(unsubscribeOnAuthStateChanged.mock.calls.length).toBe(1)
  })
})
