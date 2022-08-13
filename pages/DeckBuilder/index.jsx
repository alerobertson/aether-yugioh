import React from 'react'
import './style.scss'
import { getMyCards, sortBy, getMyDecks, saveDeck, newDeck, editDeckName, deleteDeck } from '@api-operations'
import { Fancybox } from '@components'
import apiConfig from '../../operations/config.json'
import { withRouter, Link } from "react-router-dom";
import Deckbox from './components/Deckbox.jsx'
class DeckBuilder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: "",
            cards: [],
            deck_cards: [],
            extra_cards: [],
            box_cards: [],
            sort_type: 'name',
            sort_direction: true,
            hover_card: apiConfig.api_endpoint + '/yugioh/card/BACK',
            deck_id: -1,
            decks: [],
            deck_name: ""
        }
    }

    getToken() {
        let token = localStorage.getItem("token")
        return token
    }

    // onSortChangeType(event) {
    //     let select = event.target
    //     let type = select.value
    //     this.setState({
    //         sort_type: type
    //     })
    // }

    // onSortChangeDirection(event) {
    //     let select = event.target
    //     let direction = select.value
    //     this.setState({
    //         sort_direction: direction == "true" ? true : false
    //     })
    // }

    onCardHover(event) {
        let card = event.target.closest('.card');
        let src = card.querySelector('img').getAttribute('src')
        this.setState({
            hover_card: src
        })
    }


    handleSearchChange(event) {   
        this.setState({search: event.target.search});  
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
        let deck_id = this.state.deck_id
        if(deck_id == -1 || deck_id == "old") { return }
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
        let deck_id = this.state.deck_id
        if(deck_id == -1 || deck_id == "old") { return }
        let card = event.target.closest('.card');
        let card_id = card.getAttribute("card_id")
        this.moveDeckCard(card_id)
    }

    onExtraDeckCardClick(event) {
        let deck_id = this.state.deck_id
        if(deck_id == -1 || deck_id == "old") { return }
        let card = event.target.closest('.card');
        let card_id = card.getAttribute("card_id")
        this.moveExtraDeckCard(card_id)
    }

    sortCards(cards) {
        cards = sortBy(cards, 'name', this.state.sort_direction)
        return sortBy(cards, this.state.sort_type, this.state.sort_direction)
    }

    sortDeckCardsByType() {
        let cards = this.state.deck_cards
        cards = sortBy(cards, 'name', true)
        cards = sortBy(cards, 'type', true)
        this.setState({
            deck_cards: cards
        })
    }

    componentDidMount() {
        let token = localStorage.getItem("token")
        let deck_id = parseInt(localStorage.getItem("current_deck_id"))
        getMyCards(token).then((cards) => {
            getMyDecks(token).then((decks) => {
                let database_cards = JSON.parse(JSON.stringify(cards))
                let deck = []
                let extra_deck = []
                let deck_name = ""

                if(decks.length > 0) {
                    if(deck_id) {
                        let current_deck = decks.find(d => d.id == deck_id)
                        if(current_deck) {
                            deck = current_deck.cards
                            deck_name = current_deck.name
                        }
                        else {
                            deck = decks[0].cards
                            deck_name = decks[0].name
                            localStorage.setItem("current_deck_id", decks[0].id)
                        }
                    }
                    else {
                        deck = decks[0].cards
                        deck_name = decks[0].name
                        localStorage.setItem("current_deck_id", decks[0].id)
                    }
                
                    let valid_cards = []
                    let invalid_cards = []

                    for(let i = 0; i < deck.length; i++) {
                        let deck_card = deck[i];
                        let index = cards.findIndex(c => c.code == deck_card.code);
                        if(index < 0) {
                            invalid_cards.push(deck_card)
                        }
                        else {
                            valid_cards.push(cards[index])
                            cards.splice(index, 1)
                        }
                    }
                    deck = valid_cards;

                    if(invalid_cards.length > 0) {
                        let alert_message = `Unable to find ${invalid_cards.length} card(s) to add to your deck:`
                        invalid_cards.forEach((card) => {
                            alert_message += `\r\n(${card.code}) ${card.name} ${card.first_edition ? '[1st]': ''}`
                        })
                        alert(alert_message)
                    }
                    
                    // filter out extra deck cards
                    extra_deck = deck.filter((card) => {
                        let is_extra = false
                        if(card.monster_type) {
                            is_extra = card.monster_type.split('/').includes('Fusion')
                        }
                        return is_extra
                    })
                    deck = deck.filter((card) => {
                        let is_extra = false
                        if(card.monster_type) {
                            is_extra = card.monster_type.split('/').includes('Fusion')
                        }
                        return !is_extra
                    })
                }
                else {
                    deck_id = -1
                    
                    // Check for old deck in memory
                    let deck_in_memory = localStorage.getObject("deck")
                    let extra_deck_in_memory = localStorage.getObject("extra_deck")
                    if(deck_in_memory) {
                        deck = deck_in_memory
                    }
                    if(extra_deck_in_memory) {
                        extra_deck = extra_deck_in_memory
                    }
                    if(deck_in_memory || extra_deck_in_memory) {
                        deck_id = "old"
                        deck_name = "Aether Deck"
                    }
                }

                this.setState({
                    cards: database_cards,
                    box_cards: cards,
                    deck_cards: deck,
                    extra_cards: extra_deck,
                    deck_id: deck_id,
                    decks: decks,
                    deck_name: deck_name
                })
            })
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
        element.download = `${this.state.deck_name}.ydk`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    saveDeck() {
        let token = localStorage.getItem("token")
        let cards = this.state.deck_cards.concat(this.state.extra_cards)
        saveDeck(token, this.state.deck_id, this.state.deck_name, cards).then((response) => {
            let deck = this.state.decks.find(d => d.id == this.state.deck_id)
            if(deck) { deck.cards = cards }
            alert('Deck saved to database.')
            // this.setState({
            //     decks: decks
            // })
        })
    }

    newDeck() {
        let deck_name = prompt("Enter the name of your new deck:")
        let token = localStorage.getItem("token")
        newDeck(token, deck_name).then((new_deck_id) => {
            localStorage.setItem("current_deck_id", new_deck_id)
            let decks = this.state.decks
            decks.push({
                id: new_deck_id,
                name: deck_name,
                cards: []
            })
            this.setState({
                deck_cards: [],
                deck_id: new_deck_id,
                extra_cards: [],
                box_cards: this.state.cards,
                deck_name: deck_name,
                decks: decks
            })
        })
    }

    onDeckChange(event) {
        let select = event.target
        let deck_id = parseInt(select.value)
        let deck_info = this.state.decks.find(d => d.id == deck_id)
        localStorage.setItem("current_deck_id", deck_id)
        if(!deck_info) {
            alert('Deck not found.')
        }
        else {
            let deck = deck_info.cards
            let cards_length = this.state.cards.length;
            console.log({cards_length})
            
            let cards = JSON.parse(JSON.stringify(this.state.cards))
            let valid_cards = []
            let invalid_cards = []

            for(let i = 0; i < deck.length; i++) {
                let deck_card = deck[i];
                let index = cards.findIndex(c => c.code == deck_card.code);
                if(index < 0) {
                    invalid_cards.push(deck_card)
                }
                else {
                    valid_cards.push(cards[index])
                    cards.splice(index, 1)
                }
            }
            deck = valid_cards;


            if(invalid_cards.length > 0) {
                let alert_message = `Unable to find ${invalid_cards.length} card(s) to add to your deck:`
                invalid_cards.forEach((card) => {
                    alert_message += `\r\n(${card.code}) ${card.name} ${card.first_edition ? '[1st]': ''}`
                })
                alert(alert_message)
            }

            // filter out extra deck cards
            let extra_deck = deck.filter((card) => {
                let is_extra = false
                if(card.monster_type) {
                    is_extra = card.monster_type.split('/').includes('Fusion')
                }
                return is_extra
            })
            deck = deck.filter((card) => {
                let is_extra = false
                if(card.monster_type) {
                    is_extra = card.monster_type.split('/').includes('Fusion')
                }
                return !is_extra
            })

            this.setState({
                deck_id: deck_id,
                deck_name: deck_info.name,
                deck_cards: deck,
                extra_cards: extra_deck,
                box_cards: cards
            })
        }
        
    }

    convertOldDeck() {
        let token = localStorage.getItem("token")
        let cards = this.state.deck_cards.concat(this.state.extra_cards)
        newDeck(token, "Aether Deck").then((deck_id) => {
            saveDeck(token, deck_id, "Aether Deck", cards).then((response) => {
                alert("The deck has successfully been converted to the new format. The page will now refresh")
                location.reload()
            })
        })
    }

    editDeckName() {
        let token = localStorage.getItem("token")
        let deck_name = prompt("Enter a new name for your deck:")
        editDeckName(token, this.state.deck_id, deck_name).then((response) => {
            let decks = this.state.decks
            decks.find(d => d.id == this.state.deck_id).name = deck_name
            this.setState({
                decks: decks
            })
        })
    }

    deleteDeck() {
        let token = localStorage.getItem("token")
        let deck_name = this.state.deck_name
        if(confirm(`Are you sure you want to delete "${deck_name}"?`)) {
            deleteDeck(token, this.state.deck_id).then((response) => {
                location.reload()
            })
        }
    }

    render() {
        // let filtered_box_cards = this.state.box_cards.filter((card) =>{
        //     card.name.includes(this.state.search)

        // })
        // let box_cards = this.sortCards(this.state.box_cards)
        let deck_id = this.state.deck_id

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

        let deck_select_template = this.state.decks.map((deck) => 
            <option key={deck.id} value={deck.id}>
                {deck.name}
            </option>
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
                                {!["old"].includes(deck_id) &&
                                    <div className="options flex flex--space-between flex--wrap">
                                        <select value={this.state.deck_id} onChange={this.onDeckChange.bind(this)} className="options_select deck-select block">
                                            {deck_select_template}
                                        </select>
                                        {![-1].includes(deck_id) &&
                                            <a className="button" onClick={this.exportDeck.bind(this)}>
                                                Export .ydk
                                            </a>
                                        }
                                        {![-1].includes(deck_id) &&
                                            <a className="button" onClick={this.saveDeck.bind(this)}>
                                                Save
                                            </a>
                                        }
                                        <a className="button" onClick={this.newDeck.bind(this)}>
                                            New Deck
                                        </a>
                                        {![-1].includes(deck_id) &&
                                            <a className="button" onClick={this.editDeckName.bind(this)}>
                                                Edit Deck Name
                                            </a>
                                        }
                                        {![-1].includes(deck_id) &&
                                            <a className="button button--danger" onClick={this.deleteDeck.bind(this)}>
                                                Delete Deck
                                            </a>
                                        }
                                        {![-1].includes(deck_id) &&
                                            <a className="button" onClick={this.sortDeckCardsByType.bind(this)}>
                                                Sort Deck
                                            </a>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="deck-box_wrap">
                            <div className="deck-box flex flex--wrap">
                                {deck_card_template}
                            </div>
                            <div className="deck-box deck-box--extra flex flex--wrap">
                                {extra_card_template}
                                {["old"].includes(deck_id) &&
                                    <a className="button" onClick={this.convertOldDeck.bind(this)}>
                                        Convert Old Deck
                                    </a>
                                }
                            </div>
                        </div>
                        <Deckbox box_cards={this.state.box_cards} onClickHandler={this.onBoxCardClick.bind(this)} onMouseEnterHandler={this.onCardHover.bind(this)} />
                    </div>
                </div>
            </main>
        )

    }
}

export default withRouter(DeckBuilder)