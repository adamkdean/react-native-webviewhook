# react-native-webviewhook

React Native WebView with client-side hook (iOS + Android)

### Why?

Sometimes you need to be able to callback to your react-native app from a web page. The solutions that currently exist for this are either broken on one of the platforms, bloated with features you don't need, or in the case of implementing this directly into the WebView component – [delayed for numerous reasons](https://github.com/facebook/react-native/pull/9762).

I needed a simple WebView which allowed me to pass a string back to react-native via a hook.

This is that component.

### Install

`npm i react-native-webviewhook --save`

### Usage

Place this in your `index.ios.js` and/or `index.android.js`:

```js
import React, { Component } from 'react'
import { AppRegistry, View } from 'react-native'

import WebViewHook from 'react-native-webviewhook'

export default class App extends Component {
  constructor(props) {
    super(props)
    this._bindFunctions()
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 22 }}>
        <WebViewHook
          onHookMessage={this._onHookMessage}
          source={{uri: 'http://localhost:4000/'}} />
      </View>
    )
  }

  _bindFunctions() {
    this._onHookMessage = this._onHookMessage.bind(this)
  }

  _onHookMessage(msg) {
    console.log(`msg incoming [${msg.length}] -> ${msg}`)
  }
}

AppRegistry.registerComponent('test', () => App)
```

On the web page you load (`http://localhost:4000/` for me), send text back to RN with the `hook(<string>)` function:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
<body>
  <script>
  if (typeof hook !== 'undefined') {
    hook('hello react-native')
  }
  </script>
</body>
</html>
```
