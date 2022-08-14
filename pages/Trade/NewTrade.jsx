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
                onClick={() => {}}
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
                      <Card.Body
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        <Deckbox
                          box_cards={myCards}
                          onClickHandler={() => {}}
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
                      <Card.Body
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        <Deckbox
                          box_cards={partnerCards}
                          onClickHandler={() => {}}
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
