import React from "react";

function Card(props) {
    let card = props.card_info
    return (
        <div onClick={props.onClick} card_id={card.id} card_code={card.code} card_image={card.image_url} className={`card ${card.rarity}`}>
            <div className="card_effect"></div>
            <img alt={card.name} src={card.image_url} loading="lazy" width="140" height="204" />
        </div>
    )
}

export default Card;