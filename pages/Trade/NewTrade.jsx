import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useParams, useHistory } from "react-router-dom";
import { Deckbox } from "@components";

import "./style.scss";
import {
  getDuelists,
  getCards,
  getMyCards,
  sendOffer,
  sortBy,
  getOffers,
  getMe,
  acceptOffer,
  declineOffer,
  cancelOffer,
} from "@api-operations";
function ViewTrade(props) {
  const history = useHistory();

  const params = useParams();
  const [duelists, setDuelists] = useState([]);
  const [myCards, setMyCards] = useState([]);
  const [partnerCards, setPartnerCards] = useState([]);
  const [offer, setOffer] = useState({
    owner: {
      offer: [],
    },
    target: {
      offer: [],
    },
  });

  const [me, setMe] = useState({});

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    let token = localStorage.getItem("token");
    let me;
    await getMe(token).then((response) => {
      me = response;
      setMe(response);
    });
    await getDuelists(token).then((response) => {
      setDuelists(response);
    });
    await getCards(me.id).then((response) => {
      setMyCards(response);
    });
    await getCards(params.id).then((response) => {
      setPartnerCards(response);
    });
  };

  const partner = duelists.find((duelist) => {
    return duelist.id == params.id;
  });

  const onSendOffer = () => {
    let token = localStorage.getItem("token");
    sendOffer(token, {
      offer: offer.owner.offer.map((card) => card.id),
      partner: partner.id,
      partner_offer: offer.target.offer.map((card) => card.id),
    }).then(
      (response) => {
        console.log(response);
        history.push(`/tradelist`);
      },
      (error) => {
        alert("Something Went Wrong");
      }
    );
  };

  if (!partner) return null;
  return (
    <main className="main page">
      <div className="main_container main_container--outer">
        <div className="main_container main_container--inner">
          <Container>
            <Card
              className="mt-4"
              style={{ width: "100%", borderRadius: "0%" }}
            >
              <Card.Header className="text-center">
                <h1>New Trade</h1>
              </Card.Header>
              <Button
                className="m-2"
                variant="primary"
                size="lg"
                onClick={() => {
                  onSendOffer();
                }}
              >
                Create
              </Button>
              <Card.Body>
                <Row>
                  <Col>
                    <Card
                      className="mt-4"
                      style={{ width: "100%", borderRadius: "0%" }}
                    >
                      <Card.Header className="text-center">
                        <h1>You</h1>
                      </Card.Header>
                      <Card.Body>
                        <div className="offer_box_v2">
                          {offer.owner.offer.map((card, index) => (
                            <div
                              card_id={card.id}
                              card_code={card.code}
                              className={`card ${card.rarity}`}
                              key={index}
                              onClick={() => {
                                const cardIndex = offer.owner.offer
                                  .map((item) => {
                                    return item.id;
                                  })
                                  .indexOf(card.id);
                                const temp_offer = { ...offer };
                                const moveCard =
                                  temp_offer.owner.offer[cardIndex];
                                temp_offer.owner.offer.splice(cardIndex, 1);
                                setOffer(temp_offer);
                                setMyCards([...myCards, moveCard]);
                              }}
                            >
                              <div className="card_effect"></div>
                              <img alt={card.name} src={card.image_url} />
                            </div>
                          ))}
                        </div>
                        <Deckbox
                          box_cards={myCards}
                          onMouseEnterhandler={() => {}}
                          onClickHandler={(card) => {
                            const temp_offer = { ...offer };
                            temp_offer.owner.offer.push(card);
                            const cardIndex = myCards
                              .map((item) => {
                                return item.id;
                              })
                              .indexOf(card.id);
                            myCards.splice(cardIndex, 1);
                            setOffer(temp_offer);
                          }}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card
                      className="mt-4"
                      style={{ width: "100%", borderRadius: "0%" }}
                    >
                      <Card.Header className="text-center">
                        <h1>{partner.username}</h1>
                      </Card.Header>
                      <Card.Body>
                        <div className="offer_box_v2">
                          {offer.target.offer.map((card, index) => (
                            <div
                              card_id={card.id}
                              card_code={card.code}
                              className={`card ${card.rarity}`}
                              key={index}
                              onClick={() => {
                                const cardIndex = offer.target.offer
                                  .map((item) => {
                                    return item.id;
                                  })
                                  .indexOf(card.id);
                                const temp_offer = { ...offer };
                                const moveCard =
                                  temp_offer.target.offer[cardIndex];
                                temp_offer.target.offer.splice(cardIndex, 1);
                                setOffer(temp_offer);
                                setPartnerCards([...partnerCards, moveCard]);
                              }}
                            >
                              <div className="card_effect"></div>
                              <img alt={card.name} src={card.image_url} />
                            </div>
                          ))}
                        </div>
                        <Deckbox
                          box_cards={partnerCards}
                          onMouseEnterhandler={() => {}}
                          onClickHandler={(card) => {
                            const temp_offer = { ...offer };
                            temp_offer.target.offer.push(card);
                            const cardIndex = partnerCards
                              .map((item) => {
                                return item.id;
                              })
                              .indexOf(card.id);
                            partnerCards.splice(cardIndex, 1);
                            setOffer(temp_offer);
                          }}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    </main>
  );
}

export default ViewTrade;
