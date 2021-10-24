import axios from 'axios'

export function getCards(token) {
    let headers = {
        "auth_token": token
    }
    return axios.get('http://localhost:4001/api/yugioh/get-cards/').then((result) => {
        console.log(result)
        return result
    })
}