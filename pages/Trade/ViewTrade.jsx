import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useParams, useHistory } from "react-router-dom";

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

  const [offer, setOffer] = useState([]);
  const [me, setMe] = useState({});

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    let token = localStorage.getItem("token");

    await getMe(token).then((response) => {
      setMe(response);
    });

    await getOffers(token).then((response) => {
      const offer = response
        .filter((offer) => offer.state == "open")
        .find((offer) => {
          return offer.id == params.id;
        });
      if (offer == undefined) {
        history.push(`/trade`);
      }
      setOffer(offer);
    });
  };

  const onCancelHandler = () => {
    let token = localStorage.getItem("token");
    cancelOffer(token, offer.id).then((response) => {
      history.push(`/trade`);
    });
  };

  const onAcceptHandler = () => {
    let token = localStorage.getItem("token");
    acceptOffer(token, offer.id).then((response) => {
      history.push(`/trade`);
    });
  };

  const onDeclineHandler = () => {
    let token = localStorage.getItem("token");
    declineOffer(token, offer.id).then((response) => {
      history.push(`/trade`);
    });
  };

  if (!offer.owner) return null;

  const youTrader = offer.target.user.id != me.id ? offer.owner : offer.target;
  const otherTrader =
    offer.target.user.id == me.id ? offer.owner : offer.target;
  const isYourTrade = offer.owner.user.id == me.id;
  return (
    <main className="main page">
      <div className="main_container main_container--outer">
        <div className="main_container main_container--inner">
          <Container>
            <Card
              className="mt-4"
              style={{ width: "100%", borderRadius: "0%" }}
            >
              <Card.Header
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="info"
                  size="lg"
                  onClick={() => {
                    history.push(`/trade`);
                  }}
                >
                  Back
                </Button>
                <h1>Trade Offer</h1>
                <div></div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <Card
                      className="mt-4"
                      style={{ width: "100%", borderRadius: "0%" }}
                    >
                      <Card.Header className="text-center">
                        {isYourTrade && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="danger"
                              size="lg"
                              onClick={() => {
                                onCancelHandler();
                              }}
                            >
                              Cancel
                            </Button>
                            <h1>You</h1>
                            <div></div>
                          </div>
                        )}
                        {!isYourTrade && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="danger"
                              size="lg"
                              onClick={() => {
                                onDeclineHandler();
                              }}
                            >
                              Decline
                            </Button>
                            <h1>{youTrader.user.username}</h1>
                            <Button
                              variant="success"
                              size="lg"
                              onClick={() => {
                                onAcceptHandler();
                              }}
                            >
                              Accept
                            </Button>
                          </div>
                        )}
                      </Card.Header>
                      <Card.Body
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {youTrader.offer.length == 0 && "No Cards"}
                        {youTrader.offer.map((card) => {
                          return (
                            <div
                              card_id={card.id}
                              card_code={card.code}
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
                        })}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card
                      className="mt-4"
                      style={{ width: "100%", borderRadius: "0%" }}
                    >
                      <Card.Header className="text-center">
                        <h1>{otherTrader.user.username}</h1>
                      </Card.Header>
                      <Card.Body
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {otherTrader.offer.length == 0 && "No Cards"}
                        {otherTrader.offer.map((card) => {
                          return (
                            <div
                              card_id={card.id}
                              card_code={card.code}
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
                        })}
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
