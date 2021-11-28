import React from 'react'
import jsxToString from 'jsx-to-string';
import './style.scss'
import { disenchantCard, enchantCard, getMyCards, sortBy, getMe, getCardSets } from '@api-operations'
import { modalOpen } from '@mixin-operations'
import { Card } from '@components'
import { withRouter } from "react-router-dom";
import gem_icon from '@images/gem.png'
import { modalClose } from '../../operations/mixins';

class Craft extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: "disenchant",
            common: [],
            rare: [],
            super_rare: [],
            ultra_rare: [],
            secret_rare: [],
            sets: [],
            active_set: 'LOB',
            gems: 0
        }
    }

    disenchant(card_id) {
        let token = localStorage.getItem("token")
        disenchantCard(token, card_id).then((success) => {
            this.setState({})
            if(success) {
                modalOpen({
                    body: jsxToString(
                        <div class="alert-box_wrap">
                            <div class="alert-box">
                                Successfully disenchanted!
                            </div>
                        </div>
                    )
                }, 0)
            }
            else {
                modalOpen({
                    body: jsxToString(
                        <div class="alert-box_wrap">
                            <div class="alert-box alert-box--error">
                                An error has occured
                            </div>
                        </div>
                    )
                }, 0)
            }
        })
    }

    enchant(code) {
        let token = localStorage.getItem("token")
        enchantCard(token, code).then((success) => {
            this.setState({})
            if(success) {
                modalOpen({
                    body: jsxToString(
                        <div class="alert-box_wrap">
                            <div class="alert-box">
                                Successfully enchanted!
                            </div>
                        </div>
                    )
                }, 0)
            }
            else {
                modalOpen({
                    body: jsxToString(
                        <div class="alert-box_wrap">
                            <div class="alert-box alert-box--error">
                                An error has occured
                            </div>
                        </div>
                    )
                }, 0)
            }
        })
    }

    getAttributes(element) {
        let attribute_nodes = [...element.attributes]
        let attribute_object = {}
        attribute_nodes.forEach((attribute_node) => {
            let key = attribute_node.nodeName
            let value = attribute_node.nodeValue
            attribute_object[key] = value
        })

        return attribute_object
    }

    onCardClick(card_info, event) {
        event.preventDefault()
        let template = jsxToString(
            <div class="craft-card_wrap">
                {this.state.mode == "disenchant" &&
                    <div class="craft-card_option disenchant">
                        <p>Destroy</p>
                        <p><span>{`+ ${card_info.disenchant}`}</span><img class="gem-icon" src={gem_icon} /></p>
                    </div>
                }
                <div class="craft-card">
                    <div class="card">
                        <img src={card_info.image_url} />
                    </div>
                </div>
                {this.state.mode == "enchant" &&
                    <div class="craft-card_option enchant">
                        <p>Create</p>
                        <p><span>{`- ${card_info.enchant}`}</span><img class="gem-icon" src={gem_icon} /></p>
                    </div>
                }

            </div>
        )
        modalOpen({
            body: template,
            click_events: [
                {
                    selector: '.craft-card_option.disenchant',
                    callback: () => {
                        this.disenchant(card_info.id)
                    }
                },
                {
                    selector: '.craft-card_option.enchant',
                    callback: () => {
                        this.enchant(card_info.code)
                    }
                }
            ]
        }, 0)
    }

    changeMode(mode, event) {
        event.preventDefault()
        this.setState({
            mode: mode
        })
    }

    onSetChange(event) {
        let new_option = event.target.value
        this.setState({
            active_set: new_option
        })
    }

    sortRarity(cards) {
        cards = sortBy(cards, "name", true)
        let common = cards.filter(card => card.rarity == "common")
        let rare = cards.filter(card => card.rarity == "rare")
        let super_rare = cards.filter(card => card.rarity == "super_rare")
        let ultra_rare = cards.filter(card => card.rarity == "ultra_rare")
        let secret_rare = cards.filter(card => card.rarity == "secret_rare")

        return {
            common, rare, super_rare, ultra_rare, secret_rare
        }
    }

    refreshData() {
        let token = localStorage.getItem("token")
        getMyCards(token).then((cards) => {
            cards = sortBy(cards, "name", true)
            let cards_by_rarity = this.sortRarity(cards)

            getMe(token).then((me) => {
                this.setState({
                    common: cards_by_rarity.common,
                    rare: cards_by_rarity.rare,
                    super_rare: cards_by_rarity.super_rare,
                    ultra_rare: cards_by_rarity.ultra_rare,
                    secret_rare: cards_by_rarity.secret_rare,
                    gems: me.gems
                })
            })

        })
    }

    componentDidMount() {
        document.addEventListener('click', function (event) {
            if (!event.target.matches('#modal') && !event.target.matches('.modal') && !event.target.matches('.modal_content') && !event.target.matches('.craft-card_wrap')) return;
            modalClose(0)
        }, false);
        getCardSets().then((sets) => {
            sets = sets.filter(set => set.craftable == true)
            if(sets) {
                sets = sets.map(set => {
                    let cards = this.sortRarity(set.cards)
                    set.cards = cards
                    return set
                })
                this.setState({
                    sets: sets
                })
            }
        })
        this.refreshData()
    }

    componentDidUpdate(prevProps, prevState) {
        let token = localStorage.getItem("token")
        getMe(token).then((me) => {
            if(me.gems != this.state.gems) {
                this.refreshData()
            }
        })
    }

    rarityBox(cards, rarity) {
        if(cards.length > 0) {
            let index = 0
            cards = cards.map((card) => {
                if(!card.id) {
                    card.id = index
                    index++
                }
                return card
            })
            return (
                <div className="rarity-box_wrap">
                    <div className={"rarity-box " + rarity}>
                        {cards.map((card) =>
                            <Card key={card.id.toString()} card_info={card} onClick={this.onCardClick.bind(this, card)} />
                        )}
                    </div>
                </div>
            )
        }
        else {
            return null
        }
    }

    getCardSet(set_name) {
        let sets = this.state.sets.filter(s => s.set_name == set_name)
        if(sets) {
            return sets[0]
        }
        else {
            return []
        }
    }



    render() {
        let craftable_set = this.getCardSet(this.state.active_set)
        return (
            <main className="main page page--craft">
                <div className="main_container main_container--outer">
                    <div className="main_container main_container--inner">
                        <div className="gems_wrap">
                                <div className="gems">
                                    {this.state.gems}
                                    <img className="gem-icon" src={gem_icon} />
                                </div>
                        </div>
                        <div className="tab_wrap">
                            <a onClick={this.changeMode.bind(this, "disenchant")} className={"button tab" + (this.state.mode=="disenchant" ? " active" : "")} href="#disenchant">
                                Disenchant
                            </a>
                            <a onClick={this.changeMode.bind(this, "enchant")} className={"button tab" + (this.state.mode=="enchant" ? " active" : "")} href="#enchant">
                                Enchant
                            </a>
                        </div>
                        {this.state.mode == "disenchant" &&
                            <div className="disenchant">
                                {this.rarityBox(this.state.secret_rare, "secret_rare")}
                                {this.rarityBox(this.state.ultra_rare, "ultra_rare")}
                                {this.rarityBox(this.state.super_rare, "super_rare")}
                                {this.rarityBox(this.state.rare, "rare")}
                                {this.rarityBox(this.state.common, "common")}
                            </div>
                        }
                        {this.state.mode == "enchant" &&
                            <div className="enchant">
                                <select onChange={this.onSetChange.bind(this)}>
                                    {this.state.sets.map((set) =>
                                        <option>{set.set_name}</option>
                                    )}
                                </select>
                                {this.rarityBox(craftable_set.cards.secret_rare, "secret_rare")}
                                {this.rarityBox(craftable_set.cards.ultra_rare, "ultra_rare")}
                                {this.rarityBox(craftable_set.cards.super_rare, "super_rare")}
                                {this.rarityBox(craftable_set.cards.rare, "rare")}
                                {this.rarityBox(craftable_set.cards.common, "common")}
                            </div>
                        }
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Craft)