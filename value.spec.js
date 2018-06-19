const {createElement} = require('react')
const {create} = require('react-test-renderer')

const ValueFactory = require('./value')

function MockFirebase() {
  const self = {
    onMock: jest.fn((event, listener) => {
      return listener
    }),
    offMock: jest.fn((event, listener) => {
      return listener
    }),
    refMock: jest.fn((path) => {
      return {
        on: self.onMock,
        off: self.offMock
      }
    }),
    Firebase: {
      database() {
        return {
          ref: self.refMock
        }
      }
    }
  }

  return self;
}

describe('value', () => {
  it('should render undefined initially', () => {
    const {refMock, Firebase} = MockFirebase()
    const Value = ValueFactory(Firebase)
    const component = create(createElement(Value, {path: 'some path'},
      (value) => `value: ${value}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when a value is updated, component is re-rendered', () => {
    const {onMock, refMock, Firebase} = MockFirebase()
    const Value = ValueFactory(Firebase)
    const component = create(createElement(Value, {path: 'some path'},
      (value) => `value: ${value}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    const listener = onMock.mock.calls[0][1]
    listener({
      val() {
        return 'some value'
      }
    })
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when component is unmounted, listener is removed', () => {
    const {onMock, offMock, refMock, Firebase} = MockFirebase()
    const Value = ValueFactory(Firebase)
    const component = create(createElement(Value, {path: 'some path'},
      (value) => `value: ${value}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    component.unmount()
    expect(onMock.mock.calls.length).toBe(1)
    expect(offMock.mock.calls.length).toBe(1)
    expect(onMock.mock.calls[0][1]).toBe(offMock.mock.calls[0][1])
  })

  it('when the path changes a new listener is created', () => {
    const {onMock, offMock, refMock, Firebase} = MockFirebase()
    const Value = ValueFactory(Firebase)
    const component = create(createElement(Value, {path: 'some path'},
      (value) => `value: ${value}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    component.update(createElement(Value, {path: 'some other path'},
      (value) => `value: ${value}`
    ))
    expect(refMock.mock.calls[1][0]).toBe('some other path')
    expect(onMock.mock.calls.length).toBe(2)
  })

  it('when the path changes the existing listener is cleaned up', () => {
    const {onMock, offMock, refMock, Firebase} = MockFirebase()
    const Value = ValueFactory(Firebase)
    const component = create(createElement(Value, {path: 'some path'},
      (value) => `value: ${value}`
    ))
    expect(refMock.mock.calls[0][0]).toBe('some path')
    component.update(createElement(Value, {path: 'some other path'},
      (value) => `value: ${value}`
    ))
    expect(refMock.mock.calls[1][0]).toBe('some other path')
    expect(onMock.mock.calls.length).toBe(2)
    expect(offMock.mock.calls.length).toBe(1)
    expect(onMock.mock.calls[0][1]).toBe(offMock.mock.calls[0][1])
  })
})
