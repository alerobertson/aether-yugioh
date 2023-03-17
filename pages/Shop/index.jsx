import React, { useState, useEffect } from "react";
import "./style.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";

import Buy from "./components/Buy.jsx";
import Sell from "./components/Sell.jsx";
import Decks from "./components/Decks.jsx";
import {
  getMe
} from "@api-operations";
function Shop(props) {
 const [gems, setGems] = useState(0);

  const getInfoGems = () => {
    let token = localStorage.getItem("token");
    getMe(token).then((me) => {
          setGems(me.gems);
    });
  };

  useEffect(() => {
    getInfoGems();
  }, []);

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
              <Buy  gems={gems} getGems={getInfoGems} />
            </Tab>
            <Tab eventKey="decks" title="Buy Decks">
              <Decks  gems={gems} getGems={getInfoGems}/>
            </Tab>
            <Tab eventKey="sell" title="Sell Cards">
              <Sell  gems={gems} getGems={getInfoGems}/>
            </Tab>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

export default Shop;
