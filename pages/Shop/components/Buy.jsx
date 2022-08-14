import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import gem_icon from "@images/gem.png";

import "../style.scss";
import { Card as CardComponent } from "@components";

import {
  disenchantCard,
  enchantCard,
  getMyCards,
  sortBy,
  getMe,
  getCardSets,
  getStarterDecks,
  purchaseDeck,
} from "@api-operations";
function Buy(props) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [buyFlag, setBuyFlag] = useState(false);
  const [gems, setGems] = useState(0);
  const [selectedSetName, setSelectedSetName] = useState();
  const [selectedSetCards, setSelectedSetCards] = useState({
    common: [],
    rare: [],
    super_rare: [],
    ultra_rare: [],
    secret_rare: [],
  });
  const [sets, setSets] = useState([]);

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    let token = localStorage.getItem("token");
    getMe(token).then((me) => {
      getCardSets().then((sets_data) => {
        let temp_sets_data = sets_data.filter((set) => set.craftable == true);
        if (temp_sets_data) {
          temp_sets_data = temp_sets_data.map((set) => {
            let cards = sortRarity(set.cards);
            set.cards = cards;
            return set;
          });
          setSets(temp_sets_data);
          setGems(me.gems);
          if (temp_sets_data.length > 0) {
            setSelectedSetName(temp_sets_data[0].set_name);
          }
        }
      });
    });
  };

  useEffect(() => {
    const temp_set = sets.find((set) => {
      return set.set_name == selectedSetName;
    });
    if (temp_set) {
      setSelectedSetCards(temp_set.cards);
    }
  }, [selectedSetName, setSelectedSetCards]);

  const sortRarity = (cards) => {
    cards = sortBy(cards, "name", true);
    let common = cards.filter((card) => card.rarity == "common");
    let rare = cards.filter((card) => card.rarity == "rare");
    let super_rare = cards.filter((card) => card.rarity == "super_rare");
    let ultra_rare = cards.filter((card) => card.rarity == "ultra_rare");
    let secret_rare = cards.filter((card) => card.rarity == "secret_rare");

    return {
      common,
      rare,
      super_rare,
      ultra_rare,
      secret_rare,
    };
  };

  const enchant = (card_id) => {
    let token = localStorage.getItem("token");
    enchantCard(token, card_id).then((success) => {
      if (success) {
        console.log("Bought");
        setSelectedCard(null);
        getInfo();
      } else {
        console.log("Error");
      }
    });
  };

  const renderCard = (card) => {
    return (
      <CardComponent
        key={card.code}
        card_info={card}
        onClick={() => {
          setSelectedCard(card);
        }}
      />
    );
  };

  const renderCards = () => {
    return (
      <div className="px-0 mx-0">
        <div
          className="p-5"
          style={{ backgroundColor: "rgba(255, 51, 51, 0.20)" }}
        >
          <h2 className="text-center mb-3">Secret Rare</h2>
          <div className="d-flex flex-wrap justify-content-start">
            {selectedSetCards.secret_rare.length == 0 && (
              <Card.Text className="text-center">Nothing On Sale.</Card.Text>
            )}
            {selectedSetCards.secret_rare.map((card) => {
              return renderCard(card);
            })}
          </div>
        </div>
        <div
          className="p-5"
          style={{ backgroundColor: "rgba(255, 221, 46, 0.20)" }}
        >
          <h2 className="text-center mb-3">Ultra Rare</h2>{" "}
          <div className="d-flex  flex-wrap justify-content-start">
            {selectedSetCards.ultra_rare.length == 0 && (
              <Card.Text className="text-center">Nothing On Sale.</Card.Text>
            )}

            {selectedSetCards.ultra_rare.map((card) => {
              return renderCard(card);
            })}
          </div>
        </div>
        <div
          className="p-5"
          style={{ backgroundColor: "rgba(194, 69, 255, 0.20)" }}
        >
          <h2 className="text-center mb-3">Super Rare</h2>{" "}
          <div className="d-flex  flex-wrap justify-content-start">
            {selectedSetCards.super_rare.length == 0 && (
              <Card.Text className="text-center">Nothing On Sale.</Card.Text>
            )}

            {selectedSetCards.super_rare.map((card) => {
              return renderCard(card);
            })}
          </div>
        </div>
        <div
          className="p-5"
          style={{ backgroundColor: "rgba(69, 111, 255, 0.20)" }}
        >
          <h2 className="text-center mb-3">Rare</h2>{" "}
          <div className="d-flex  flex-wrap justify-content-start">
            {selectedSetCards.rare.length == 0 && (
              <Card.Text className="text-center">Nothing On Sale.</Card.Text>
            )}

            {selectedSetCards.rare.map((card) => {
              return renderCard(card);
            })}
          </div>
        </div>
        <div
          className="p-5"
          style={{ backgroundColor: "rgba(128,128,128, 0.20)" }}
        >
          <h2 className="text-center mb-3">Common</h2>
          <div className="d-flex  flex-wrap justify-content-start">
            {selectedSetCards.common.length == 0 && (
              <Card.Text className="text-center">Nothing On Sale.</Card.Text>
            )}

            {selectedSetCards.common.map((card) => {
              return renderCard(card);
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {selectedCard && (
        <Modal
          centered
          show={selectedCard}
          onHide={() => {
            setSelectedCard(null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h3>Buy {selectedCard.name}?</h3>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="text-center">
            <img
              alt={selectedCard.name}
              src={selectedCard.image_url}
              className={buyFlag ? "buyAnimation" : null}
            />
          </Modal.Body>
          <Button
            variant="primary"
            size="lg"
            className="m-4 p-4"
            disabled={buyFlag}
            onClick={() => {
              setBuyFlag(true);
              setTimeout(() => {
                setBuyFlag(false);
                enchant(selectedCard.code);
              }, 1500);
            }}
          >
            <h4>
              Buy for <u>{selectedCard.enchant}</u>{" "}
              <img className="gem-icon" src={gem_icon} /> ?
            </h4>
          </Button>
        </Modal>
      )}
      {/**/}
      <Card style={{ width: "100%", borderRadius: "0%" }}>
        <Card.Header className="text-center">
          <h1>Buy Cards</h1>
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="my-4"
          >
            <span
              className="p-4 gemAnimation"
              style={{
                backgroundColor: "rgba(128,128,128, 0.20)",
                borderRadius: "12px",
              }}
            >
              <img className="gem-icon mb-2" src={gem_icon} />
              {gems}
            </span>
          </span>

          <Form.Select
            style={{ minWidth: "100%" }}
            value={selectedSetName}
            onChange={(val) => {
              setSelectedSetName(val.target.value);
            }}
          >
            {sets.map((set) => {
              return (
                <option key={set.set_name} value={set.set_name}>
                  {set.set_name}
                </option>
              );
            })}
          </Form.Select>
        </Card.Header>

        <Card.Body>{renderCards()}</Card.Body>
      </Card>
    </div>
  );
}

export default Buy;
