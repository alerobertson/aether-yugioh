import './styles/index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.jsx'

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

ReactDOM.render(
    <App />,
    document.querySelector('#app')
)

module.hot.accept()