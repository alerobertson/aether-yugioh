import React from 'react'
import './style.scss'
import { test } from '@api-operations'
import { withRouter } from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props)
    }

    getToken() {
        let token = localStorage.getItem("token")
        return token
    }

    render() {
        console.log(this.getToken())

        return (
            <main className="main page page--login">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">
                        <div className="login-form_wrap">
                            <div className="login-form">
                                <a className="button" href="https://discord.com/api/oauth2/authorize?client_id=469917400926781440&redirect_uri=http%3A%2F%2Flocalhost%3A4001%2Fapi%2Fyugioh%2Fauth&response_type=code&scope=identify">
                                    Login with Discord
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Login)