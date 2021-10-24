import './styles/index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.jsx'

ReactDOM.render(
    <App />,
    document.querySelector('#app')
)

module.hot.accept()