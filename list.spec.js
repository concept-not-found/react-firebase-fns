const {createElement} = require('react')
const {create} = require('react-test-renderer')

const FirebaseMock = require('./firebase-mock')
const ListFactory = require('./list')

describe('list', () => {
  it('should render {} initially', () => {
    const {refMock, Firebase} = FirebaseMock()
    const List = ListFactory(Firebase)
    const component = create(createElement(List, {path: 'some path'},
      (list) => `list: ${JSON.stringify(list)}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when a child is added, component is re-rendered', () => {
    const {onMock, refMock, Firebase} = FirebaseMock()
    const List = ListFactory(Firebase)
    const component = create(createElement(List, {path: 'some path'},
      (list) => `list: ${JSON.stringify(list)}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    expect(onMock.mock.calls[0][0]).toBe('child_added')
    const childAddedListener = onMock.mock.calls[0][1]
    childAddedListener({
      key: 'some key',
      val () {
        return 'some value'
      }
    })
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when a child is removed, component is re-rendered', () => {
    const {onMock, refMock, Firebase} = FirebaseMock()
    const List = ListFactory(Firebase)
    const component = create(createElement(List, {path: 'some path'},
      (list) => `list: ${JSON.stringify(list)}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    expect(onMock.mock.calls[0][0]).toBe('child_added')
    const childAddedListener = onMock.mock.calls[0][1]
    childAddedListener({
      key: 'some key',
      val () {
        return 'some value'
      }
    })
    expect(onMock.mock.calls[1][0]).toBe('child_removed')
    const childRemovedListener = onMock.mock.calls[1][1]
    childRemovedListener({
      key: 'some key'
    })
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when a child is changed, component is re-rendered', () => {
    const {onMock, refMock, Firebase} = FirebaseMock()
    const List = ListFactory(Firebase)
    const component = create(createElement(List, {path: 'some path'},
      (list) => `list: ${JSON.stringify(list)}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    expect(onMock.mock.calls[0][0]).toBe('child_added')
    const childAddedListener = onMock.mock.calls[0][1]
    childAddedListener({
      key: 'some key',
      val () {
        return 'some value'
      }
    })
    expect(onMock.mock.calls[2][0]).toBe('child_changed')
    const childChangedListener = onMock.mock.calls[2][1]
    childChangedListener({
      key: 'some key',
      val () {
        return 'some other value'
      }
    })
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when component is unmounted, listeners are removed', () => {
    const {onMock, offMock, refMock, Firebase} = FirebaseMock()
    const List = ListFactory(Firebase)
    const component = create(createElement(List, {path: 'some path'},
      (list) => `list: ${JSON.stringify(list)}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    component.unmount()
    expect(onMock.mock.calls.length).toBe(3)
    expect(offMock.mock.calls.length).toBe(3)
    expect(onMock.mock.calls[0][1]).toBe(offMock.mock.calls[0][1])
    expect(onMock.mock.calls[1][1]).toBe(offMock.mock.calls[1][1])
    expect(onMock.mock.calls[2][1]).toBe(offMock.mock.calls[2][1])
  })

  it('when the path changes a new listeners are created', () => {
    const {onMock, refMock, Firebase} = FirebaseMock()
    const List = ListFactory(Firebase)
    const component = create(createElement(List, {path: 'some path'},
      (list) => `list: ${JSON.stringify(list)}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    component.update(createElement(List, {path: 'some other path'},
      (list) => `list: ${JSON.stringify(list)}`
    ))
    expect(refMock.mock.calls[1][0]).toBe('some other path')
    expect(onMock.mock.calls.length).toBe(3 + 3)
  })

  it('when the path changes the existing listeners are cleaned up', () => {
    const {onMock, offMock, refMock, Firebase} = FirebaseMock()
    const List = ListFactory(Firebase)
    const component = create(createElement(List, {path: 'some path'},
      (list) => `list: ${JSON.stringify(list)}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    component.update(createElement(List, {path: 'some other path'},
      (list) => `list: ${JSON.stringify(list)}`
    ))
    expect(refMock.mock.calls[1][0]).toBe('some other path')
    expect(onMock.mock.calls.length).toBe(3 + 3)
    expect(offMock.mock.calls.length).toBe(3)
    expect(onMock.mock.calls[0][1]).toBe(offMock.mock.calls[0][1])
    expect(onMock.mock.calls[1][1]).toBe(offMock.mock.calls[1][1])
    expect(onMock.mock.calls[2][1]).toBe(offMock.mock.calls[2][1])
  })
})
