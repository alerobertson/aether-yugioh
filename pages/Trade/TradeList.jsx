import React, { useState, useEffect } from "react";
import "./style.scss";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useHistory } from "react-router-dom";
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
function TradeList(props) {
  const history = useHistory();
  const [duelists, setDuelists] = useState([]);
  const [offers, setOffers] = useState([]);
  const [me, setMe] = useState({});

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    let token = localStorage.getItem("token");

    await getMe(token).then((response) => {
      setMe(response);
    });

    await getDuelists(token).then((response) => {
      setDuelists(response);
    });

    await getOffers(token).then((response) => {
      setOffers(response.filter((offer) => offer.state == "open"));
    });
  };

  const duelist_options = () => {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {duelists.map((duelist) => {
          return (
            <Card
              key={duelist.id}
              className="m-2"
              style={{ backgroundColor: "lightgrey" }}
            >
              <Card.Img variant="top" src={duelist.avatar} />
              <Card.Body>
                <Card.Title className="text-center">
                  {duelist.username}
                </Card.Title>
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="primary"
                  size="lg"
                  style={{ width: "100%" }}
                  onClick={() => {
                    history.push(`/trade/new/${duelist.id}`);
                  }}
                >
                  Trade
                </Button>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    );
  };

  const trade_options = () => {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {offers.length == 0 && "No Pending Trades"}
        {offers.map((offer) => {
          const otherTrader =
            offer.target.user.id == me.id
              ? offer.owner.user
              : offer.target.user;
          return (
            <Card
              key={offer.id}
              className="m-2"
              style={{ backgroundColor: "lightgrey" }}
            >
              <Card.Img variant="top" src={otherTrader.avatar} />
              <Card.Body>
                <Card.Title className="text-center">
                  {otherTrader.username}
                </Card.Title>
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="info"
                  size="lg"
                  style={{ width: "100%" }}
                  onClick={() => {
                    history.push(`/trade/${offer.id}`);
                  }}
                >
                  View
                </Button>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    );
  };
  return (
    <main className="main page">
      <div className="main_container main_container--outer">
        <div className="main_container main_container--inner">
          <Container>
            <Row>
              <Col>
                <Card
                  className="mt-4"
                  style={{ width: "100%", borderRadius: "0%" }}
                >
                  <Card.Header className="text-center">
                    <h1>Users</h1>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="my-4"
                    ></span>
                  </Card.Header>
                  <Card.Body>{duelist_options()}</Card.Body>
                </Card>
              </Col>
              <Col>
                <Card
                  className="mt-4"
                  style={{ width: "100%", borderRadius: "0%" }}
                >
                  <Card.Header className="text-center">
                    <h1>Pending Trades</h1>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="my-4"
                    ></span>
                  </Card.Header>
                  <Card.Body>{trade_options()}</Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </main>
  );
}

export default TradeList;
