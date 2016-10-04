'use strict'

import React, { Component } from 'react'
import { Platform, View, WebView } from 'react-native'

class WebViewHook extends WebView {
  constructor(props) {
    super(props)
    this._bindFunctions()
    this._initialise()
  }

  _bindFunctions() {
    this._initialise = this._initialise.bind(this)
  }

  _initialise() {
    const onLoadingStart = (e) => { this.__onLoadingStart(e) }
    if (Platform.OS === 'ios') this._onLoadingStart = onLoadingStart
    else if (Platform.OS === 'android') this.onLoadingStart = onLoadingStart
  }

  _getHash(url) {
    if (url.indexOf('http') === 0) {
      var index = url.indexOf('#')
      if (index !== -1)
        return url.substr(index + 1)
    }
    return ''
  }

  __onLoadingStart(e) {
    const hash = this._getHash(e.nativeEvent.url)

    if (hash.indexOf('_hook_') == 0) {
      const message = decodeURIComponent(hash)
      if (message && message.indexOf(';') > -1) {
        const msg = message.substr(message.indexOf(';') + 1)
        this.props.onHookMessage && this.props.onHookMessage(msg)
      }
    } else {
      if (Platform.OS === 'ios') this._updateNavigationState(e)
      else if (Platform.OS === 'android') this.updateNavigationState(e)
    }
  }
}

export default class extends Component {
  constructor(props) {
    super(props)
    this._bindFunctions()
    this._setInitialState()
    this._initJavaScript()
  }

  _bindFunctions() {
    this._setInitialState = this._setInitialState.bind(this)
    this._initJavaScript = this._initJavaScript.bind(this)
    this._onHookMessage = this._onHookMessage.bind(this)
  }

  _setInitialState(props) {
    this.state = Object.assign({}, props, {
      source: this.props.source
    })
  }

  _initJavaScript() {
    this.state.injectedJavaScript = `
      window.hook = function (v) {
        window.location.hash = '_hook_;' + encodeURIComponent(String(v));
      }
    `
  }

  _onHookMessage(m) {
    this.props.onHookMessage && this.props.onHookMessage(m)
  }

  render() {
    return (
      <View>
        <WebViewHook
          {...this.props}
          source={this.state.source}
          onHookMessage={this._onHookMessage}
          injectedJavaScript={this.state.injectedJavaScript} />
      </View>
    )
  }
}
