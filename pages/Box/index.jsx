import React from 'react'
import './style.scss'
import { getCards } from '@api-operations'
import { withRouter, Link } from "react-router-dom";

class Box extends React.Component {
    constructor(props) {
        super(props)
    }

    getToken() {
        let token = localStorage.getItem("token")
        return token
    }

    cards() {
        let token = localStorage.getItem("token")
        getCards(token).then((result) => {
            console.log(result)
        })
    }

    render() {
        this.cards()

        return (
            <main className="main page page--box">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">

                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Box)