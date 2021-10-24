import React from 'react'
import './style.scss'
import { test } from '@api-operations'
import { withRouter } from "react-router-dom";

class SignOut extends React.Component {
    constructor(props) {
        super(props)
    }

    getToken() {
        let token = localStorage.getItem("token")
        return token
    }

    render() {
        return (
            <main className="main page page--sign-out">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">
                        <div className="alert-box_wrap">
                            <div className="alert-box alert-box--success">
                                <h2>Success</h2>
                                <p>
                                    You have signed out successfully!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(SignOut)