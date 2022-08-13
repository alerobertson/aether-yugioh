import React, { useState, useEffect } from "react";
import "./style.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";

import Buy from "./components/Buy.jsx";
import Sell from "./components/Sell.jsx";
import Decks from "./components/Decks.jsx";

function Shop(props) {
  return (
    <>
      <Tabs defaultActiveKey="buy" id="fill-tab-example" className="my-3" fill>
        <Tab eventKey="buy" title="Buy Cards">
          <Container>
            <Buy />
          </Container>
        </Tab>
        <Tab eventKey="decks" title="Buy Decks">
          <Container>
            <Decks />
          </Container>
        </Tab>
        <Tab eventKey="sell" title="Sell Cards">
          <Container>
            <Sell />
          </Container>
        </Tab>
      </Tabs>
    </>
  );
}

export default Shop;
