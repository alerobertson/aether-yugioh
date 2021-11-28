import React from 'react'
import { Navigation } from '@components'
import { getMe } from '@api-operations'
import logo from '@images/aetherbot-dp.png'
import gem_icon from '@images/gem.png'
import './style.scss'

class Header extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    render() {
        return (
            <header className="header">
                <div className="header_container header_container--outer">
                    <div className="header_container header_container--inner flex flex--space-between">
                        <div className="header_logo_wrap">
                            <div className="header_logo">
                                <img src={logo} alt="AetherBot Logo" />
                            </div>
                        </div>
                        <Navigation />
                    </div>
                </div>
            </header>
        )
    }
}

export default Header