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

export function getCards(token) {
    let headers = {
        "auth_token": token
    }
    return axios.get(config.api_endpoint + '/yugioh/my-cards/', { headers: headers }).then((response) => {
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