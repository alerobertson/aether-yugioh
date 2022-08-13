import React, { useState, useEffect } from "react";
import "./style.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from 'react-bootstrap/Container';

import Buy from './components/Buy.jsx'
import Sell from './components/Sell.jsx'


function Shop(props) {
  return (
    <>
      <Tabs defaultActiveKey="sell" id="fill-tab-example" className="my-3" fill>
        <Tab eventKey="buy" title="Buy">
        <Container>
          <Buy />
          </Container>
        </Tab>
        <Tab eventKey="sell" title="Sell">
           <Container>
          <Sell />
          </Container>
        </Tab>
      </Tabs>
    </>
  );
}

export default Shop;
