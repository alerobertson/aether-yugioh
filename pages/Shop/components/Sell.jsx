import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { Card as CardComponent } from "@components";
import gem_icon from "@images/gem.png";
import Form from "react-bootstrap/Form";
import "../style.scss";
import {
  disenchantCard,
  enchantCard,
  getMyCards,
  sortBy,
  getCardSets,
  getStarterDecks,
  purchaseDeck,
} from "@api-operations";

function Sell(props) {
  const [duplicateCount, setDuplicateCount] = useState(1);
  const [soldFlag, setSoldFlag] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [boxCards, setBoxCards] = useState({
    common: [],
    rare: [],
    super_rare: [],
    ultra_rare: [],
    secret_rare: [],
  });

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    let token = localStorage.getItem("token");
    getMyCards(token).then((cards) => {
      let cards_by_rarity = sortRarity(cards);
        setBoxCards({
          common: cards_by_rarity.common,
          rare: cards_by_rarity.rare,
          super_rare: cards_by_rarity.super_rare,
          ultra_rare: cards_by_rarity.ultra_rare,
          secret_rare: cards_by_rarity.secret_rare,
        });
      });
  };

  const disenchant = (card_id) => {
    let token = localStorage.getItem("token");
    disenchantCard(token, card_id).then((success) => {
      if (success) {
        console.log("Sold");
        setSelectedCard(null);
        getInfo();
        props.getGems()
      } else {
        console.log("Error");
      }
    });
  };

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

  const renderCard = (card) => {
    if (duplicateCount > 1) {
      const duplicates = boxCards[card.rarity].filter((c_val) => {
        return c_val.code == card.code;
      });
      if (duplicates.length < duplicateCount) {
        return null;
      }
    }
    return (
      <CardComponent
        key={card.id.toString()}
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
            {boxCards.secret_rare.length == 0 && (
              <Card.Text className="text-center">Nothing to Sell.</Card.Text>
            )}
            {boxCards.secret_rare.map((card) => {
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
            {boxCards.ultra_rare.length == 0 && (
              <Card.Text className="text-center">Nothing to Sell.</Card.Text>
            )}

            {boxCards.ultra_rare.map((card) => {
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
            {boxCards.super_rare.length == 0 && (
              <Card.Text className="text-center">Nothing to Sell.</Card.Text>
            )}

            {boxCards.super_rare.map((card) => {
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
            {boxCards.rare.length == 0 && (
              <Card.Text className="text-center">Nothing to Sell.</Card.Text>
            )}

            {boxCards.rare.map((card) => {
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
            {boxCards.common.length == 0 && (
              <Card.Text className="text-center">Nothing to Sell.</Card.Text>
            )}

            {boxCards.common.map((card) => {
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
              <h3>Sell {selectedCard.name}?</h3>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="text-center">
            <img
              alt={selectedCard.name}
              src={selectedCard.image_url}
              className={soldFlag ? "soldAnimation" : null}
            />
          </Modal.Body>
          <Button
            variant="danger"
            size="lg"
            className="m-4 p-4"
            disabled={soldFlag}
            onClick={() => {
              setSoldFlag(true);
              setTimeout(() => {
                setSoldFlag(false);
                disenchant(selectedCard.id);
              }, 500);
            }}
          >
            <h4>
              Sell for <u>{selectedCard.disenchant}</u>{" "}
              <img className="gem-icon" src={gem_icon} /> ?
            </h4>
          </Button>
        </Modal>
      )}

      <Card style={{ width: "100%", borderRadius: "0%" }}>
        <Card.Header className="text-center">
          <h1>Sell Cards</h1>

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
              {props.gems}
            </span>
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <span>Duplicate Count: </span>
            <Form.Control
              label="Count"
              type="number"
              className="mx-2"
              min="1"
              style={{ width: "50px" }}
              value={duplicateCount}
              onChange={(val) => {
                setDuplicateCount(val.target.value);
              }}
            ></Form.Control>
          </div>
        </Card.Header>
        <Card.Body>{renderCards()}</Card.Body>
      </Card>
    </div>
  );
}

export default Sell;
