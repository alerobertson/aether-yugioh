import React from 'react'
import './style.scss'
import { test } from '@api-operations'
import apiConfig from '../../operations/config.json'
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

        return (
            <main className="main page page--login">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">
                        <div className="login-form_wrap">
                            <div className="login-form">
                                <a className="button" href={`https://discord.com/api/oauth2/authorize?client_id=469917400926781440&redirect_uri=${encodeURIComponent(apiConfig.api_endpoint + '/yugioh/auth')}&response_type=code&scope=identify`}>
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