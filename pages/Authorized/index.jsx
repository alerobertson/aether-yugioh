import React from 'react'
import './style.scss'
import { test } from '@api-operations'
import { withRouter, Link } from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props)
    }

    getCode(location) {
        let token = new URLSearchParams(location.search).get("token");
        if(token) {
            localStorage.setItem("token", token)
        }
        return token
    }

    render() {
        this.getCode(this.props.location)

        return (
            <main className="main page page--authorized">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">
                        <div className="alert-box_wrap">
                            <div className="alert-box alert-box--success">
                                <h2>Welcome</h2>
                                <p>
                                    You have authorized successfully!
                                </p>
                                <Link className="button button--cta" to="/">Continue</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Login)