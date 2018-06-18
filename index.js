const Firebase = require('firebase')

const Value = require('./value')
const List = require('./list')
const User = require('./user')

module.exports = (Firebase) => {
  return {
    Value: Value(Firebase),
    List: List(Firebase),
    User: User(Firebase)
  }
}

const globalFirebaseIntances = module.exports(Firebase)
Object.assign(module.exports, globalFirebaseIntances)
