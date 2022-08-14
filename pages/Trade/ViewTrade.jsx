import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
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
  const params = useParams();

  const [offer, setOffer] = useState([]);
  const [me, setMe] = useState({});

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    let token = localStorage.getItem("token");
    let promises = [];
    let offers, me;
    promises.push(
      getOffers(token).then((response) => {
        offers = response.filter((offer) => offer.state == "open");
      })
    );
    promises.push(
      getMe(token).then((response) => {
        me = response;
      })
    );
    Promise.all(promises).then(() => {
      const offer = offers.find((offer) => {
        return offer.id == params.id;
      });

      setMe(me);
      setOffer(offer);
    });
  };

  if (!offer.owner) return null;

  const youTrader = offer.target.user.id != me.id ? offer.owner : offer.target;
  const otherTrader =
    offer.target.user.id == me.id ? offer.owner : offer.target;
  const isYourTrade = offer.owner.user.id == me.id;
  console.log(isYourTrade);
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
                <h1>Trade Offer</h1>
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
                            <Button variant="danger" size="lg">
                              Cancel
                            </Button>
                            <h1>{youTrader.user.username}</h1>
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
                            <Button variant="danger" size="lg">
                              Decline
                            </Button>
                            <h1>{youTrader.user.username}</h1>
                            <Button variant="success" size="lg">
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
                        {youTrader.offer.map((card) => {
                          return (
                            <div
                              card_id={card.id}
                              card_code={card.code}
                              className={`card ${card.rarity}`}
                              key={card.id.toString()}
                            >
                              <div className="card_effect"></div>
                              <img alt={card.name} src={card.image_url} />
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
                        {otherTrader.offer.map((card) => {
                          return (
                            <div
                              card_id={card.id}
                              card_code={card.code}
                              className={`card ${card.rarity}`}
                              key={card.id.toString()}
                            >
                              <div className="card_effect"></div>
                              <img alt={card.name} src={card.image_url} />
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
