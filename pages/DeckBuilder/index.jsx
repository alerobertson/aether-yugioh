import React from 'react'
import './style.scss'
import { getCards, sortBy } from '@api-operations'
import { Fancybox } from '@components'
import apiConfig from '../../operations/config.json'
import { withRouter, Link } from "react-router-dom";

class DeckBuilder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: [],
            deck_cards: [],
            extra_cards: [],
            box_cards: [],
            sort_type: 'id',
            sort_direction: false,
            hover_card: apiConfig.api_endpoint + '/yugioh/card/BACK'
        }
    }

    getToken() {
        let token = localStorage.getItem("token")
        return token
    }

    onSortChangeType(event) {
        let select = event.target
        let type = select.value
        this.setState({
            sort_type: type
        })
    }

    onSortChangeDirection(event) {
        let select = event.target
        let direction = select.value
        this.setState({
            sort_direction: direction == "true" ? true : false
        })
    }

    onCardHover(event) {
        let card = event.target.closest('.card');
        let src = card.querySelector('img').getAttribute('src')
        this.setState({
            hover_card: src
        })
    }

    moveBoxCard(card_id, is_extra) {
        let box_cards = this.state.box_cards
        let extra_cards = this.state.extra_cards
        let deck_cards = this.state.deck_cards

        // Find this card in the box
        let index = box_cards.findIndex(c => c.id == card_id);
        let card = box_cards[index]

        if(card && deck_cards.length < 60 && !is_extra) {
            box_cards.splice(index, 1)
            deck_cards.push(card)

            this.setState({
                box_cards: box_cards,
                deck_cards: deck_cards
            })
        }

        if(card && extra_cards.length < 15 && is_extra) {
            box_cards.splice(index, 1)
            extra_cards.push(card)

            this.setState({
                box_cards: box_cards,
                extra_cards: extra_cards
            })
        }
    }

    moveDeckCard(card_id) {
        let box_cards = this.state.box_cards
        let deck_cards = this.state.deck_cards
        let index = deck_cards.findIndex(c => c.id == card_id);
        let card = deck_cards[index]
        if(card) {
            deck_cards.splice(index, 1)
            box_cards.push(card)

            this.setState({
                box_cards: box_cards,
                deck_cards: deck_cards
            })
        }
    }

    moveExtraDeckCard(card_id) {
        let box_cards = this.state.box_cards
        let extra_cards = this.state.extra_cards
        let index = extra_cards.findIndex(c => c.id == card_id);
        let card = extra_cards[index]
        if(card) {
            extra_cards.splice(index, 1)
            box_cards.push(card)

            this.setState({
                box_cards: box_cards,
                extra_cards: extra_cards
            })
        }
    }

    onBoxCardClick(event) {
        let card = event.target.closest('.card');
        let card_id = card.getAttribute("card_id")
        let card_monster_type = card.getAttribute("card_monster_type")
        let is_extra = false
        if(card_monster_type) {
            is_extra = card_monster_type.split('/').includes('Fusion')
        }
        console.log(is_extra)
        this.moveBoxCard(card_id, is_extra)
    }

    onDeckCardClick(event) {
        let card = event.target.closest('.card');
        let card_id = card.getAttribute("card_id")
        this.moveDeckCard(card_id)
    }

    onExtraDeckCardClick(event) {
        let card = event.target.closest('.card');
        let card_id = card.getAttribute("card_id")
        this.moveExtraDeckCard(card_id)
    }

    sortCards(cards) {
        cards = sortBy(cards, 'name', this.state.sort_direction)
        return sortBy(cards, this.state.sort_type, this.state.sort_direction)
    }

    componentDidMount() {
        let token = localStorage.getItem("token")
        getCards(token).then((cards) => {
            let deck = localStorage.getObject("deck")
            let database_cards = cards
            let valid = true
            if(deck) {
                for (let i = 0; i < deck.length; i++) {
                    let deck_card = deck[i];
                    let index = cards.findIndex(c => c.id == deck_card.id);
                    if(index < 0) {
                        valid = false
                        break
                    }
                    else {
                        cards.splice(index, 1)
                    }
                }
            }
            else {
                deck = []
            }

            let extra_deck = localStorage.getObject("extra_deck")
            if(extra_deck) {
                for (let i = 0; i < extra_deck.length; i++) {
                    let extra_card = extra_deck[i];
                    let index = cards.findIndex(c => c.id == extra_card.id);
                    if(index < 0) {
                        valid = false
                        break
                    }
                    else {
                        cards.splice(index, 1)
                    }
                }
            }
            else {
                extra_deck = []
            }

            if(valid) {
                this.setState({
                    cards: database_cards,
                    box_cards: cards,
                    deck_cards: deck,
                    extra_cards: extra_deck
                })
            }
            else {
                alert('The deck in browser memory cannot be built with the cards you own. It has been removed.')
                localStorage.removeItem("deck")
                localStorage.removeItem("extra_deck")
            }
        })
    }

    assembleDeckString(deck, extra_deck) {
        let deck_string = `#created by AetherBot`
        deck_string += `\n#main`
        deck.forEach(card => {
            deck_string += `\n${card.ygopro_id}`
        })
        deck_string += `\n#extra`
        extra_deck.forEach(card => {
            deck_string += `\n${card.ygopro_id}`
        })
        deck_string += `\n!side`
        return deck_string
    }

    exportDeck() {
        let deck = this.state.deck_cards
        let extra_deck = this.state.extra_cards
        let deck_string = this.assembleDeckString(deck, extra_deck)

        const element = document.createElement("a");
        const file = new Blob([deck_string], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "aether_deck.ydk";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    saveDeck() {
        localStorage.setObject("deck", this.state.deck_cards)
        localStorage.setObject("extra_deck", this.state.extra_cards)
        alert('Deck saved to browser.')
    }

    render() {
        let box_cards = this.sortCards(this.state.box_cards)

        let deck_card_template = this.state.deck_cards.map((card) =>
            <div onClick={this.onDeckCardClick.bind(this)} card_id={card.id} card_code={card.code} onMouseEnter={this.onCardHover.bind(this)} className={`card ${card.rarity}`} key={card.id.toString()} >
                <div className="card_effect"></div>
                <img alt={card.name} src={card.image_url} />
            </div>
        )

        let extra_card_template = this.state.extra_cards.map((card) =>
            <div onClick={this.onExtraDeckCardClick.bind(this)} card_id={card.id} card_code={card.code} onMouseEnter={this.onCardHover.bind(this)} className={`card ${card.rarity}`} key={card.id.toString()} >
                <div className="card_effect"></div>
                <img alt={card.name} src={card.image_url} />
            </div>
        )

        let box_card_template = box_cards.map((card) =>
            <div onClick={this.onBoxCardClick.bind(this)} card_id={card.id} card_code={card.code} card_monster_type={card.monster_type} onMouseEnter={this.onCardHover.bind(this)} className={`card ${card.rarity}`} key={card.id.toString()} >
                <div className="card_effect"></div>
                <img alt={card.name} src={card.image_url} />
            </div>
        )

        return (
            <main className="main page page--deck-builder">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner flex">
                        <div className="preview-box_wrap">
                            <div className="preview-box">
                                <div className="card">
                                    <img src={this.state.hover_card} />
                                </div>
                            </div>
                            <div className="options_wrap">
                                <div className="options flex flex--space-between flex--wrap">
                                    <a className="button" onClick={this.exportDeck.bind(this)}>
                                        Export .ydk
                                    </a>
                                    <a className="button" onClick={this.saveDeck.bind(this)}>
                                        Save to Browser
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="deck-box_wrap">
                            <div className="deck-box flex flex--wrap">
                                {deck_card_template}
                            </div>
                            <div className="deck-box deck-box--extra flex flex--wrap">
                                {extra_card_template}
                            </div>
                        </div>
                        <div className="card-box_wrap">
                            <div className="card-box_filter_wrap">
                                <div className="card-box_filter">
                                    <select defaultValue="id" onChange={this.onSortChangeType.bind(this)} className="card-box_filter_item sorting-type">
                                        <option value="id">Date Created</option>
                                        <option value="name">Name</option>
                                        <option value="type">Card Type</option>
                                        <option value="rarity_index">Rarity</option>
                                        <option value="level">Monster Level</option>
                                        <option value="spell_trap_type">Spell/Trap Type</option>
                                        <option value="attack">Attack</option>
                                        <option value="defense">Defense</option>
                                    </select>
                                    <select defaultValue="false" onChange={this.onSortChangeDirection.bind(this)} className="card-box_filter_item sorting-direction">
                                        <option value="false">Descending</option>
                                        <option value="true">Ascending</option>
                                    </select>
                                </div>
                            </div>
                            <div className="card-box flex flex--wrap">
                                {box_card_template}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )

    }
}

export default withRouter(DeckBuilder)