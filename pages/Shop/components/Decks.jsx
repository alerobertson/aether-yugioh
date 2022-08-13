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
  const [starterDecks, setStarterDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [buyFlag, setBuyFlag] = useState(false);
  const [gems, setGems] = useState(0);

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    let token = localStorage.getItem("token");
    getMe(token).then((me) => {
      getStarterDecks(token).then((starter_decks_data) => {
        setStarterDecks(starter_decks_data);
        setGems(me.gems);
      });
    });
  };

  const enchantDeck = (code) => {
    let token = localStorage.getItem("token");
    purchaseDeck(token, code).then((success) => {
      if (success) {
        console.log("Bought");
        setSelectedDeck(null);
        getInfo();
      } else {
        console.log("Error");
      }
    });
  };

  const renderDeck = (deck) => {
    return (
      <div
        onClick={() => {
          setSelectedDeck(deck);
        }}
        className="starter-decks_item"
        key={deck.code}
      >
        <img className="p-3" src={deck.image_url} />
      </div>
    );
  };

  const renderDecks = () => {
    return (
      <div className="px-0 mx-0">
        <div className="p-5" style={{ backgroundColor: "rgba(128,128,128, 0.20)" }}>
          <h2 className="text-center mb-3">Decks</h2>
          <div className="d-flex flex-wrap justify-content-center">
            {starterDecks.length == 0 && (
              <Card.Text className="text-center">Nothing On Sale.</Card.Text>
            )}
            {starterDecks.map((deck) => {
              return renderDeck(deck);
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {selectedDeck && (
        <Modal
          centered
          show={selectedDeck}
          onHide={() => {
            setSelectedDeck(null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h3>Buy {selectedDeck.name}?</h3>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="text-center">
            <img
              alt={selectedDeck.name}
              src={selectedDeck.image_url}
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
                enchantDeck(selectedDeck.code);
              }, 1500);
            }}
          >
            <h4>
              Buy for <u>{selectedDeck.price}</u>{" "}
              <img class="gem-icon" src={gem_icon} /> ?
            </h4>
          </Button>
        </Modal>
      )}
      {/**/}
      <Card style={{ width: "100%", borderRadius: "0%" }}>
        <Card.Header className="text-center">
          <h1>Buy Decks</h1>
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="my-4"
          >
            <img class="gem-icon" src={gem_icon} />
            {gems}
          </span>
        </Card.Header>
        <Card.Body>{renderDecks()}</Card.Body>
      </Card>
    </div>
  );
}

export default Buy;
