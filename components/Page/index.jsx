import React from "react";
import "./style.scss";
import {
    Authorized,
    Home,
    Login,
    SignOut,
    Box,
    DeckBuilder,
    Packs,
    Trade,
    Redeem,
    Craft,
    Shop,
    TradeList,
    ViewTrade,
} from "@pages";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Page extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/trade">
                    <Trade />
                </Route>
                <Route path="/tradelist/:id">
                    <ViewTrade />
                </Route>
                <Route path="/tradelist">
                    <TradeList />
                </Route>

                <Route path="/authorized">
                    <Authorized />
                </Route>
                <Route path="/redeem">
                    <Redeem />
                </Route>
                <Route path="/craft">
                    <Craft />
                </Route>
                <Route path="/shop">
                    <Shop />
                </Route>
                <Route path="/sign-out">
                    <SignOut />
                </Route>
                <Route path="/box">
                    <Box />
                </Route>
                <Route path="/packs">
                    <Packs />
                </Route>
                <Route path="/decks">
                    <DeckBuilder />
                </Route>
            </Switch>
        );
    }
}

export default Page;
