import React, { useState, useEffect } from "react";
import "./style.scss";

function Deckbox(props) {
  const { box_cards, onClickHandler, onMouseEnterhandler } = props;

  const [boxCards, setBoxCards] = useState([]);
  const [sortDir, setSortDir] = useState("asc");
  const [sortCat, setSortCat] = useState("name");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (box_cards != []) {
      let temp_boxCards = box_cards;
      //
      temp_boxCards = temp_boxCards.filter((card) => {
        if (card[sortCat] == null) return false;
        return card[sortCat]
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
      //
      if (sortDir == "desc") {
        temp_boxCards = temp_boxCards.sort(function (a, b) {
          return a["name"].toString().toLowerCase() >
            b["name"].toString().toLowerCase()
            ? -1
            : 1;
        });
        temp_boxCards = temp_boxCards.sort(function (a, b) {
          return a[sortCat].toString().toLowerCase() >
            b[sortCat].toString().toLowerCase()
            ? -1
            : 1;
        });
      }
      if (sortDir == "asc") {
        temp_boxCards = temp_boxCards.sort(function (a, b) {
          return a["name"].toString().toLowerCase() <
            b["name"].toString().toLowerCase()
            ? -1
            : 1;
        });
        temp_boxCards = temp_boxCards.sort(function (a, b) {
          return a[sortCat].toString().toLowerCase() <
            b[sortCat].toString().toLowerCase()
            ? -1
            : 1;
        });
      }
      setBoxCards(temp_boxCards);
    }
  }, [box_cards, box_cards.length, sortDir, sortCat, searchText]);

  const box_card_template = boxCards.map((card) => {
    return (
      <div
        onClick={() => {
          onClickHandler(card);
        }}
        card_id={card.id}
        card_code={card.code}
        card_monster_type={card.monster_type}
        onMouseEnter={(event) => {
          onMouseEnterhandler(event);
        }}
        className={`card ${card.rarity}`}
        key={card.id.toString()}
      >
        <div className="card_effect"></div>
        <img
          alt={card.name}
          src={card.image_url}
          loading="lazy"
          width="100%"
          height="100%"
        />
      </div>
    );
  });

  return (
    <>
      {/*<div className="card-box_wrap">*/}
      <div className="card-box_wrap" style={{ width: "100%" }}>
        <div className="card-box_filter_wrap">
          <div className="card-box_search">
            <input
              type="text"
              placeholder="Filter"
              value={searchText}
              onChange={(val) => {
                setSearchText(val.target.value);
              }}
            />
          </div>
          <div className="card-box_filter">
            <select
              value={sortCat}
              onChange={(val) => {
                setSortCat(val.target.value);
              }}
              className="card-box_filter_item sorting-type"
            >
              <option value="id">Date Created</option>
              <option value="name">Name</option>
              <option value="type">Card Type</option>
              <option value="rarity_index">Rarity</option>
              <option value="level">Monster Level</option>
              <option value="spell_trap_type">Spell/Trap Type</option>
              <option value="attack">Attack</option>
              <option value="defense">Defense</option>
            </select>
            <select
              value={sortDir}
              onChange={(val) => {
                setSortDir(val.target.value);
              }}
              className="card-box_filter_item sorting-direction"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <div className="card-box flex flex--wrap justify-content-center">
          {box_card_template}
        </div>
      </div>{" "}
    </>
  );
}

export default Deckbox;
