import axios from 'axios'
import config from './config.json'

function rarityIndex(rarity) {
    return ['common', 'rare', 'super_rare', 'ultra_rare', 'secret_rare'].indexOf(rarity)
}

function convertToInt(string) {
    if(string == undefined || string == null) { return string }
    let value = parseInt(string)
    return isNaN(value) ? 0 : value
}

function sanitizeCards(cards) {
    return cards.map((card) => {
        card.rarity_index = rarityIndex(card.rarity)
        card.attack = convertToInt(card.attack)
        card.defense = convertToInt(card.defense)
        card.image_url = `${config.api_endpoint}/yugioh/card/${card.code}?fe=${card.first_edition}&le=${card.limited_edition}`
        return card
    })
}

// true = ascending, false = descending
export function sortBy(cards, key, direction) {
    cards = cards.filter(card => card[key] != undefined)

    return cards.sort((a, b) => {
        if(a[key] < b[key]) {
            return direction ? -1 : 1
        }
        if(a[key] > b[key]) {
            return direction ? 1 : -1
        }
        return 0
    })
}

export function getMyCards(token) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/my-cards/', { headers: headers }).then((response) => {
        let cards = sanitizeCards(response.data)
        console.log({cards})
        return cards
    })
}

export function getCards(user_id) {
    return axios.get(config.api_endpoint + '/yugioh/get-cards/' + user_id).then((response) => {
        let cards = sanitizeCards(response.data)
        return cards
    })
}

export function getPacks(token) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/my-packs/', { headers: headers }).then((response) => {
        let packs = response.data

        return packs
    })
}

export function getOffers(token) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/my-offers/', { headers: headers }).then((response) => {
        let offers = response.data
        offers = offers.map(offer => {
            offer.owner.offer = offer.owner.offer.map(card => { 
                card.image_url = `${config.api_endpoint}/yugioh/card/${card.code}?fe=${card.first_edition}`
                return card
            })
            offer.target.offer = offer.target.offer.map(card => { 
                card.image_url = `${config.api_endpoint}/yugioh/card/${card.code}?fe=${card.first_edition}`
                return card
            })
            return offer
        })

        return offers
    })
}

export function getDuelists(token) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/duelists/', { headers: headers }).then((response) => {
        let duelists = response.data

        return duelists
    })
}

export function sendOffer(token, body) {
    let headers = {
        "auth_token": token
    }
    return axios.post(config.api_endpoint + '/yugioh/send-offer/', body, { headers: headers })
}

export function getMe(token) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/me/', { headers: headers }).then((response) => {
        return response.data
    })
}

export function cancelOffer(token, offer_id) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/cancel-offer/' + offer_id, { headers: headers }).then((response) => {
        return response.data
    })
}

export function acceptOffer(token, offer_id) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/accept-offer/' + offer_id, { headers: headers }).then((response) => {
        return response.data
    })
}

export function declineOffer(token, offer_id) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/decline-offer/' + offer_id, { headers: headers }).then((response) => {
        return response.data
    })
}

export function redeemCode(token, code) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/redeem/' + code, { headers: headers }).then((response) => {
        return true
    }, (error) => {
        return false
    })
}

export function getCardSets() {
    return axios.get(config.api_endpoint + '/yugioh/sets/').then((response) => {
        let sets = response.data
        return sets.map((set) => {
            set.cards = sanitizeCards(set.cards)
            return set
        })
    }, (error) => {
        return false
    })
}

export function disenchantCard(token, card_id) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/disenchant/' + card_id, { headers: headers }).then((response) => {
        return true
    }, (error) => {
        return false
    })
}

export function enchantCard(token, card_code) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/enchant/' + card_code, { headers: headers }).then((response) => {
        return true
    }, (error) => {
        return false
    })
}

export function getMyDecks(token) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/my-decks/', { headers: headers }).then((response) => {
        console.log({
            deck_data: response.data
        })
        let decks = response.data
        decks.forEach((deck) => {
            deck.cards = sanitizeCards(deck.cards)
        })
        return decks
    }, (error) => {
        return false
    })
}

export function newDeck(token, name) {
    let headers = {
        "auth_token": token
    }
    let body = {
        name: name
    }
    return axios.post(config.api_endpoint + '/yugioh/new-deck/', body, { headers: headers }).then((response) => {
        return response.data
    })
}

export function saveDeck(token, deck_id, name, cards, side_deck_cards) {
    let headers = {
        "auth_token": token
    }

    cards = cards.map(card => {
        return {
            code: card.code,
            first_edition: card.first_edition,
            limited_edition: card.limited_edition,
            side: false
        }
    })

    side_deck_cards = side_deck_cards.map(card => {
        return {
            code: card.code,
            first_edition: card.first_edition,
            limited_edition: card.limited_edition,
            side: true
        }
    })

    let body = {
        deck_id: deck_id,
        name: name,
        cards: [...cards, ...side_deck_cards],
    }
    return axios.post(config.api_endpoint + '/yugioh/save-deck/', body, { headers: headers }).then((response) => {
        return response.data
    })
}

export function editDeckName(token, deck_id, name) {
    let headers = {
        "auth_token": token
    }

    let body = {
        deck_id: deck_id,
        name: name
    }
    return axios.put(config.api_endpoint + '/yugioh/rename-deck/', body, { headers: headers }).then((response) => {
        return response.data
    })
}

export function deleteDeck(token, deck_id) {
    let headers = {
        "auth_token": token
    }

    let body = {
        deck_id: deck_id
    }
    return axios.put(config.api_endpoint + '/yugioh/delete-deck/', body, { headers: headers }).then((response) => {
        return response.data
    })
}

export function getStarterDecks(token) {
    let headers = {
        "auth_token": token
    }

    return axios.get(config.api_endpoint + '/yugioh/starter-decks/', { headers: headers }).then((response) => {
        let starter_decks = response.data.map((starter_deck) => {
            starter_deck.image_url = config.api_endpoint + '/yugioh/deck-art/' + starter_deck.code
            return starter_deck
        })
        return starter_decks
    })
}

export function purchaseDeck(token, code) {
    let headers = {
        "auth_token": token
    }

    return axios.get(config.api_endpoint + '/yugioh/purchase-deck/' + code, { headers: headers }).then((response) => {
        return true
    }, (error) => {
        return false
    })
}