import React from "react";
import Registration from "./registration";
import Logo from "./logo";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Welcome() {
    let logoStyle = {
        color: "green",
        fontSize: "50px"
    };
    return (
        <div className="wrapper">
            <Logo />
            <h1>Where Zimbabweans connect</h1>

            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Link to="/login">Click here to Log in!</Link>
                </div>
            </HashRouter>
            <p />
        </div>
    );
}
