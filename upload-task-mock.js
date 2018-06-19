module.exports = () => {
  const onMock = jest.fn()
  return {
    onMock,
    UploadTask: {
      on: onMock
    }
  }
}
