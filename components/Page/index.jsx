import React from 'react'
import './style.scss'
import { Authorized, Home, Login, SignOut, Box } from '@pages';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

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
                <Route path="/authorized">
                    <Authorized />
                </Route>
                <Route path="/sign-out">
                    <SignOut />
                </Route>
                <Route path="/box">
                    <Box />
                </Route>
            </Switch>
        )
    }
}

export default Page