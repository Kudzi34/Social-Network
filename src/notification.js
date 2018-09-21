import { connect } from "react-redux";
import React from "react";
import { alert } from "./actions";
import { Link } from "react-router-dom";

class Friendnotif extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        if (!this.props.notification) {
            return null;
        }
        console.log("checking state", this.props);
        return (
            <div className="notification">
                {this.props.notification.notification}
                {this.props.notification.message}
                {this.props.notification.firstname}
                {this.props.notification.lastname}
            </div>
        );
    }
}

const getStateFromRedux = state => {
    console.log("state", state);
    return {
        notification: state.notification
    };
};
export default connect(getStateFromRedux)(Friendnotif);
