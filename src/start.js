import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Logo from "./logo";
import App from "./app";
import Profilepicture from "./profilepicture";

let elem;

if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
