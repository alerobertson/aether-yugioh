import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../style.scss";

function Buy(props) {
  return (
    <div>
      <Card className="my-4" style={{ width: "100%" }}>
        <Card.Header className="text-center">
          <h1>Discounted!</h1>
        </Card.Header>
        <Card.Body>
          <Card.Text className="text-center">Nothing Discounted.</Card.Text>
        </Card.Body>
      </Card>
      {/**/}
      <Card style={{ width: "100%" }}>
        <Card.Header className="text-center">
          <h1>Buy</h1>
        </Card.Header>
        <Card.Body>
          <Card.Text className="text-center">Nothing On Sale.</Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Buy;
