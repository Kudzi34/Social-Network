import React from "react";
import { receiveFriends, unfriend, acceptRequest } from "./actions.js";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

class Friends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.dispatch(receiveFriends());
    }

    render() {
        console.log("Our Props: ", this.props);
        if (!this.props.friends) {
            return (
                <div> Loading... </div> // you can replace it with some funny or useful image/text
            );
        }
        return (
            <div className="boxOfFriends">
                <div className="realFriends">
                    <h2> Friends </h2>
                    {this.props.friends.map(friend => (
                        <div key={friend.id}>
                            <img src={friend.imageurl} />
                            <div className="nameOfTheFriend">
                                <p>
                                    {friend.firstname} {friend.lastname}
                                </p>
                                <button
                                    onClick={e => {
                                        this.props.dispatch(
                                            unfriend(friend.id)
                                        );
                                    }}
                                >
                                    Unfriend
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="almostFriends">
                    <h2> Friend Requests From: </h2>
                    {this.props.wannabes.map(friend => (
                        <div key={friend.id}>
                            <img src={friend.imageurl} />
                            <div className="nameOfTheFriend">
                                <p>
                                    {friend.firstname} {friend.lastname}
                                </p>
                                <button
                                    onClick={e => {
                                        this.props.dispatch(
                                            acceptRequest(friend.id)
                                        );
                                    }}
                                >
                                    Accept Friend Request
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    console.log("state", state);
    return {
        friends:
            state.friends && state.friends.filter(user => user.status == 2),
        wannabes:
            state.friends && state.friends.filter(user => user.status == 1)
    };
};

export default connect(mapStateToProps)(Friends);
