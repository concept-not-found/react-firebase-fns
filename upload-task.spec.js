const {createElement} = require('react')
const {create} = require('react-test-renderer')

const FirebaseMock = require('./firebase-mock')
const UploadTaskMock = require('./upload-task-mock')
const UploadTaskFactory = require('./upload-task')

describe('user', () => {
  it('should render {} initially', () => {
    const {Firebase} = FirebaseMock()
    const {UploadTask: uploadTask} = UploadTaskMock()
    const UploadTask = UploadTaskFactory(Firebase)
    const component = create(createElement(UploadTask, {uploadTask},
      (snapshot) => `snapshot: ${JSON.stringify(snapshot)}`
    ))
    expect(component.toJSON())
      .toMatchSnapshot()
  })

  it('when state changes, snapshot is rendered', () => {
    const {Firebase} = FirebaseMock()
    const {onMock, UploadTask: uploadTask} = UploadTaskMock()
    const UploadTask = UploadTaskFactory(Firebase)
    const component = create(createElement(UploadTask, {uploadTask},
      (snapshot) => `snapshot: ${JSON.stringify(snapshot)}`
    ))
    const listener = onMock.mock.calls[0][1]
    listener({
      bytesTransferred: 'some bytes transferred',
      totalBytes: 'some total bytes'
    })
    expect(component.toJSON())
      .toMatchSnapshot()
  })
})
