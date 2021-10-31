import React from 'react'
import './style.scss'
import { getCards } from '@api-operations'
import { Fancybox } from '@components'
import apiConfig from '../../operations/config.json'
import { withRouter, Link } from "react-router-dom";

class Box extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: []
        }
    }

    getToken() {
        let token = localStorage.getItem("token")
        return token
    }

    componentDidMount() {
        let token = localStorage.getItem("token")
        getCards(token).then((cards) => {
            console.log(cards)
            this.setState({
                cards: cards
            })
        })
    }

    render() {
        let card_template = this.state.cards.map((card) =>
            <div className={`card ${card.rarity}`} key={card.id.toString()} >
                <a data-fancybox="gallery" className="card_inspect" href={card.image_url}>
                    <div className="card_effect"></div>
                    <img src={card.image_url} />
                </a>
            </div>
        )

        return (
            <main className="main page page--box">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">
                        <div className="card-box_wrap">
                            <div className="card-box flex flex--wrap">
                                <Fancybox>
                                    {card_template}
                                </Fancybox>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )

    }
}

export default withRouter(Box)