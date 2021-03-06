module.exports = () => {
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
    onAuthStateChangedMock: jest.fn((listener) => {
      return self.unsubscribeOnAuthStateChanged
    }),
    unsubscribeOnAuthStateChanged: jest.fn(),
    Firebase: {
      database () {
        return {
          ref: self.refMock
        }
      },
      auth () {
        return {
          onAuthStateChanged: self.onAuthStateChangedMock
        }
      }
    }
  }

  return self
}
