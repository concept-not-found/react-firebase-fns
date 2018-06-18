react-firebase-fns
==================

`react-firebase-fns` [Firebase](https://firebase.google.com/)'s [JavaScript SDK](https://firebase.google.com/docs/web/setup) turned into declarative [React](https://github.com/facebook/react) components.

Components
----------

### Value
Watch a [Realtime Database](https://firebase.google.com/docs/database/) value. Equivalent to https://firebase.google.com/docs/database/web/read-and-write#listen_for_value_events
```js
<Value
  path="/realtime/database/path"
>{(val) =>
  {/* val is the value from dataSnapshot.val() */}
}</Value>
```

### List
Watch a [Realtime Database](https://firebase.google.com/docs/database/) list. Equivalent to https://firebase.google.com/docs/database/web/lists-of-data#listen_for_child_events
```js
<List
  path="/realtime/database/list"

  orderBy="child | key | value"
  // orderBy="child" is optional when orderByChild is set, but orderByChild is required when orderBy="child"
  // orderByChild is ignored when orderBy is set to anything other than child
  orderByChild="child key or path"

  startAt="value"
  startAtKey="optional key"

  endAt="value"
  endAtKey="optional key"

  equalTo="value"
  equalToKey="optional key"

  limitToFirst="number"
  limitToLast="number"
>{(list) =>
  {/* list is updated on child_added, child_removed, and child_changed events */}
}</List>
```

### User
A user state provider for [Authentication](https://firebase.google.com/docs/auth/). Equivalent to https://firebase.google.com/docs/auth/web/start#set_an_authentication_state_observer_and_get_user_data

Unlike other components, User is a [React Context](https://reactjs.org/docs/context.html#reactcreatecontext) with a Provider and Consumer.
```js
<User.Provider>

  <SomeComponents>
    <DeeplyNested>

      <User.Consumer>{(user) =>
        {/* user will be undefined if not logged in */}
      }</User.Consumer>
    
    </DeeplyNested>
  </SomeComponents>

</User.Provider>
```

Missing components?
-------------------
The entire SDK won't be exposed in this library. Only the parts with a realtime aspect make sense.

The following is not implemented yet. Make a pull request? ❤️
### Realtime Database
 * [Connection state](https://firebase.google.com/docs/database/web/offline-capabilities#section-connection-state)
 * [Presence](https://firebase.google.com/docs/database/web/offline-capabilities#section-presence)
### Cloud Firestore
 * [Realtime updates](https://firebase.google.com/docs/firestore/query-data/listen)
### Storage
 * [Upload progress](https://firebase.google.com/docs/storage/web/upload-files#monitor_upload_progress)

Installation
------------
```
npm install --save react-firebase-fns
```

### Global Firebase
Configure Firebase as usual and `react-firebase-fns` will use the global Firebase with:
```js
import {Value, List, User} from 'react-firebase-fns'
```

### Provided Firebase application
You can also pass in a Firebase application.
```js
import ReactFirebaseFns from 'react-firebase-fns'
import Firebase from 'firebase'

const {Value, List, User} = ReactFirebaseFns(Firebase.initializeApp(config))
```

Roadmap
-------
 * add render prop
 * add component prop

Inspired by [react-fns](https://github.com/jaredpalmer/react-fns).

Ronald Chen [@pyrolistical](https://twitter.com/pyrolistical)
