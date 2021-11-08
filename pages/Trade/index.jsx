import React from 'react'
import './style.scss'
import { 
    getDuelists, 
    getCards, 
    getMyCards, 
    sendOffer, 
    sortBy, 
    getOffers, 
    getMe,
    acceptOffer,
    declineOffer,
    cancelOffer
} from '@api-operations'
import { withRouter } from "react-router-dom";

class Trade extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            partner: null,
            duelists: [],
            cards: [],
            offer: [],
            complete: false,
            error: false,
            offers: [],
            me: {}
        }
    }

    chooseDuelist(event) {
        event.preventDefault()
        let duelist = event.target.closest('.duelist-list_item');
        let duelist_icon = duelist.querySelector('img').getAttribute("src")
        let duelist_id = duelist.getAttribute("duelist_id")
        getCards(duelist_id).then((cards) => {
            cards = sortBy(cards, "name", true)
            cards = sortBy(cards, "rarity_index", false)
            this.setState({
                partner: {
                    id: duelist_id,
                    avatar: duelist_icon,
                    cards: cards,
                    offer: []
                }
            })
        })
    }

    back(event) {
        event.preventDefault()
        this.setState({
            partner: null
        })
    }

    moveCard(card_id) {
        let cards = this.state.cards,
            offer = this.state.offer,
            partner_cards = this.state.partner.cards,
            partner_offer = this.state.partner.offer

        let cards_index = cards.findIndex(c => c.id == card_id),
            offer_index = offer.findIndex(c => c.id == card_id),
            partner_cards_index = partner_cards.findIndex(c => c.id == card_id),
            partner_offer_index = partner_offer.findIndex(c => c.id == card_id)

        if(cards_index >= 0) {
            offer.push(cards[cards_index])
            cards.splice(cards_index, 1)
        }
        else if(offer_index >= 0) {
            cards.push(offer[offer_index])
            offer.splice(offer_index, 1)
        }
        else if(partner_cards_index >= 0) {
            partner_offer.push(partner_cards[partner_cards_index])
            partner_cards.splice(partner_cards_index, 1)
        }
        else if(partner_offer_index >= 0) {
            partner_cards.push(partner_offer[partner_offer_index])
            partner_offer.splice(partner_offer_index, 1)
        }

        let partner = this.state.partner
        partner.cards = partner_cards
        partner.offer = partner_offer

        this.setState({
            cards: cards,
            offer: offer,
            partner: partner
        })
    }

    onCardClick(event) {
        event.preventDefault()
        let card = event.target.closest('.card')
        let id = card.getAttribute('card_id')
        this.moveCard(id)
    }

    getDuelist(id) {
        return this.state.duelists.find(duelist => duelist.id == id)
    }

    onSendOffer(event) {
        event.preventDefault()
        let token = localStorage.getItem("token")
        sendOffer(token, {
            offer: this.state.offer.map(card => card.id),
            partner: this.state.partner.id,
            partner_offer: this.state.partner.offer.map(card => card.id)
        }).then((response) => {
            this.setState({
                complete: true
            })
        }, (error) => {
            this.setState({
                complete: true,
                error: true
            })
        })
    }

    removeOffer(offer_id) {
        let offers = this.state.offers
        let index = offers.findIndex(o => o.id == offer_id)
        offers.splice(index, 1)
        this.setState({
            offers: offers
        })
    }

    onCancel(event) {
        event.preventDefault()
        let token = localStorage.getItem("token")
        let offer = event.target.closest('.offer')
        let offer_id = offer.getAttribute('offer_id')
        cancelOffer(token, offer_id).then((response) => {
            this.removeOffer(offer_id)
        })
    }

    onAccept(event) {
        event.preventDefault()
        let token = localStorage.getItem("token")
        let offer = event.target.closest('.offer')
        let offer_id = offer.getAttribute('offer_id')
        acceptOffer(token, offer_id).then((response) => {
            this.removeOffer(offer_id)
        })
    }

    onDecline(event) {
        event.preventDefault()
        let token = localStorage.getItem("token")
        let offer = event.target.closest('.offer')
        let offer_id = offer.getAttribute('offer_id')
        declineOffer(token, offer_id).then((response) => {
            this.removeOffer(offer_id)
        })
    }

    componentDidMount() {
        let token = localStorage.getItem("token")
        let promises = []
        
        let duelists,
            cards,
            offers,
            me

        promises.push(getDuelists(token).then((response) => {
            duelists = response
        }))
        promises.push(getMyCards(token).then((response) => {
            cards = response
        }))
        promises.push(getOffers(token).then((response) => {
            offers = response.filter(offer => offer.state == "open")
        }))
        promises.push(getMe(token).then((response) => {
            me = response
        }))

        Promise.all(promises).then(() => {
            cards = sortBy(cards, "name", true)
            cards = sortBy(cards, "rarity_index", false)
            this.setState({
                duelists: duelists,
                cards: cards,
                offers: offers,
                me: me
            })
        })
    }

    render() {
        let duelist_options = this.state.duelists.map((duelist) =>
            <div duelist_id={duelist.id} className="duelist-list_item" key={duelist.id} value={duelist.id}>
                <a href={'#trade' + duelist.id} onClick={this.chooseDuelist.bind(this)}>
                    <img className="discord_icon" src={duelist.avatar} />
                </a>
            </div>
        )

        let trade_options = this.state.offers.map((offer) => 
            <div key={offer.id} className="offer_wrap">
                <div offer_id={offer.id} className={"offer" + (offer.owner.user.id == this.state.me.id ? " sent" : " received")}>
                    <div className="offer_owner_wrap">
                        <div className="offer_owner">
                            <div className="offer_banner">
                                <div className="offer_avatar">
                                    <img className="discord_icon" src={offer.owner.user.avatar} />
                                </div>
                                <div className="offer_name">
                                    {
                                        offer.owner.user.id == this.state.me.id ?
                                        "You offered:" : offer.owner.user.username + " offers:"
                                    }
                                </div>
                                <div className="offer_options">
                                    <a onClick={this.onCancel.bind(this)} href="#cancel" className="option cancel">
                                        X
                                    </a>
                                </div>
                            </div>
                            <div className="offer_box">
                                {
                                    offer.owner.offer.map((card) => 
                                        <div card_id={card.id} card_code={card.code} className={`card ${card.rarity}`} key={card.id.toString()} >
                                            <div className="card_effect"></div>
                                            <img alt={card.name} src={card.image_url} />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="offer_target_wrap">
                        <div className="offer_target">
                            <div className="offer_banner">
                                <div className="offer_avatar">
                                    <img className="discord_icon" src={offer.target.user.avatar} />
                                </div>
                                <div className="offer_name">
                                    {
                                        offer.target.user.id == this.state.me.id ?
                                        "You have:" : `${offer.target.user.username} has:`
                                    }
                                </div>
                                <div className="offer_options">
                                    <a onClick={this.onDecline.bind(this)} href="#decline" className="option decline">
                                        X
                                    </a>
                                    <a onClick={this.onAccept.bind(this)} href="#accept" className="option accept">
                                        O
                                    </a>
                                </div>
                            </div>
                            <div className="offer_box">
                                {
                                    offer.target.offer.map((card) => 
                                        <div card_id={card.id} card_code={card.code} className={`card ${card.rarity}`} key={card.id.toString()} >
                                            <div className="card_effect"></div>
                                            <img alt={card.name} src={card.image_url} />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )   

        let cards = this.state.cards.map((card) => 
            <div onClick={this.onCardClick.bind(this)} state="card" card_id={card.id} card_code={card.code} className={`card ${card.rarity}`} key={card.id.toString()} >
                <div className="card_effect"></div>
                <img alt={card.name} src={card.image_url} />
            </div>
        )

        let offer = this.state.offer.map((card) => 
            <div onClick={this.onCardClick.bind(this)} state="offer" card_id={card.id} card_code={card.code} className={`card ${card.rarity}`} key={card.id.toString()} >
                <div className="card_effect"></div>
                <img alt={card.name} src={card.image_url} />
            </div>
        )

        let partner_cards
        let partner_offer
        if(this.state.partner) {
            partner_cards = this.state.partner.cards.map((card) => 
                <div onClick={this.onCardClick.bind(this)} state="partner_card" card_id={card.id} card_code={card.code} className={`card ${card.rarity}`} key={card.id.toString()} >
                    <div className="card_effect"></div>
                    <img alt={card.name} src={card.image_url} />
                </div>
            )
            partner_offer = this.state.partner.offer.map((card) => 
                <div onClick={this.onCardClick.bind(this)} state="partner_offer" card_id={card.id} card_code={card.code} className={`card ${card.rarity}`} key={card.id.toString()} >
                    <div className="card_effect"></div>
                    <img alt={card.name} src={card.image_url} />
                </div>
            )
        }

        return (
            <main className="main page page--trade">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">
                        {!this.state.partner && !this.state.complete &&
                            <div>
                                <div className="duelist-list_wrap">
                                    <div className="duelist-list">
                                        {duelist_options}
                                    </div>
                                </div>
                                <div className="offer-list_wrap">
                                    <div className="offer-list">
                                        {trade_options}
                                    </div>
                                </div>
                            </div>
                        }
                        {this.state.partner && !this.state.complete &&
                            <div>
                                <a href="#back" onClick={this.back.bind(this)}>Back</a>
                                <img src={this.state.partner.avatar} />
                                <div className="offer-controls">
                                    <a className="button" href="#send-offer" onClick={this.onSendOffer.bind(this)}>Send Offer</a>
                                </div>
                                <div className="offer-box_wrap">
                                    <div className="offer-box flex flex--wrap">
                                        {offer}
                                    </div>
                                    <div className="offer-box flex flex--wrap">
                                        {partner_offer}
                                    </div>
                                </div>
                                <div className="card-list_wrap">
                                    <div className="card-list flex flex--wrap">
                                        {cards}
                                    </div>
                                    <div className="card-list flex flex--wrap">
                                        {partner_cards}
                                    </div>
                                </div>
                            </div>
                        }
                        {this.state.complete &&
                            <div className="alert-box_wrap">
                                {this.state.error &&
                                    <div className="alert-box alert-box--error">
                                        <h2>Error</h2>
                                        <p>
                                            An error has occured
                                        </p>
                                    </div>
                                }
                                {!this.state.error &&
                                    <div className="alert-box alert-box--success">
                                        <h2>Success</h2>
                                        <p>
                                            Offer submitted!
                                        </p>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Trade)