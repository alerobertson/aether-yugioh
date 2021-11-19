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
        card.image_url = `${config.api_endpoint}/yugioh/card/${card.code}?fe=${card.first_edition}`
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