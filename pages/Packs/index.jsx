import React from 'react'
import './style.scss'
import { getPacks } from '@api-operations'
import apiConfig from '../../operations/config.json'
import { withRouter } from "react-router-dom";

class Packs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            packs: []
        }
    }

    getToken() {
        let token = localStorage.getItem("token")
        return token
    }

    componentDidMount() {
        let token = localStorage.getItem("token")
        getPacks(token).then((packs) => {
            console.log({packs})
            this.setState({
                packs: packs
            })
        })
    }

    render() {
        let packs = this.state.packs
        
        let pack_template = packs.map((pack) =>
            <div key={pack.code} className="pack">
                <div className="pack_wrap">
                    <a href={`${apiConfig.api_endpoint}/yugioh/booster/${pack.code}`}>
                        <img className="pack_image" src={apiConfig.api_endpoint + "/yugioh/booster-art/LOB"} />
                    </a>
                </div>
            </div>
        )

        return (
            <main className="main page page--packs">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">
                        <div className="packs-list_wrap">
                            <div className="packs-list flex flex--wrap">
                                {pack_template}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Packs)