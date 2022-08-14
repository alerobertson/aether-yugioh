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
    <main className="main page page--shop">
      <div className="main_container main_container--outer">
        <div className="main_container main_container--inner">
          <Tabs
            defaultActiveKey="buy"
            id="fill-tab-example"
            className="my-3"
            fill
            style={{
              backgroundColor: "rgba(128,128,128, 0.50)",
              borderWidth: "2px",
            }}
          >
            <Tab eventKey="buy" title="Buy Cards">
              <Buy />
            </Tab>
            <Tab eventKey="decks" title="Buy Decks">
              <Decks />
            </Tab>
            <Tab eventKey="sell" title="Sell Cards">
              <Sell />
            </Tab>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

export default Shop;
