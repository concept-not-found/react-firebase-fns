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
