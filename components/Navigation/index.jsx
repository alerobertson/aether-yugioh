import React from 'react'
import './style.scss'
import {
    BrowserRouter as Router,
    useLocation,
    withRouter,
    Link
} from "react-router-dom";

class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gems: 0
        }
    }

    getToken() {
        let token = localStorage.getItem("token")
        return token
    }

    signOut() {
        localStorage.removeItem("token")
    }

    render() {
        const path = this.props.location.pathname
        let hasToken = this.getToken() != null
        return (
            <nav>
                <ul>
                    {/* <li className={path == "/" ? "active" : ""} >
                        <Link to="/">Home</Link>
                    </li> */}
                    {hasToken &&
                        <li className={path == "/trade" ? "active" : ""}>
                            <Link to="/trade">Trade</Link>
                        </li>
                    }
                    {hasToken &&
                        <li className={path == "/packs" ? "active" : ""}>
                            <Link to="/packs">Packs</Link>
                        </li>
                    }
                    {hasToken &&
                        <li className={path == "/redeem" ? "active" : ""}>
                            <Link to="/redeem">Redeem</Link>
                        </li>
                    }
                    {hasToken &&
                        <li className={path == "/craft" ? "active" : ""}>
                            <Link to="/craft">Craft</Link>
                        </li>
                    }
                    {hasToken &&
                        <li className={path == "/shop" ? "active" : ""}>
                            <Link to="/shop">Shop</Link>
                        </li>
                    }
                    {!hasToken &&
                        <li className={path == "/login" ? "active" : ""}>
                            <Link to="/login">Login</Link>
                        </li>
                    }
                    {/* {hasToken &&
                        <li className={path == "/box" ? "active" : ""}>
                            <Link to="/box">Box</Link>
                        </li>
                    } */}
                    {hasToken &&
                        <li className={path == "/decks" ? "active" : ""}>
                            <Link to="/decks">Decks</Link>
                        </li>
                    }
                    {hasToken &&
                        <li className={path == "/sign-out" ? "active" : ""}>
                            <Link onClick={this.signOut} to="/sign-out">Sign Out</Link>
                        </li>
                    }
                </ul>
            </nav>
        )
    }
}

export default withRouter(Navigation)