import React from 'react';
import { Header, Page } from '@components'
import { BrowserRouter as Router } from "react-router-dom";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Header />
                <Page />
            </Router>
        )
    }
}

export default App