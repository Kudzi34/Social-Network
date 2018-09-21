import React, { Component } from "react";
import axios from "./axios";
// import {Link} from 'react-router-dom';

export default class Friendshipbutton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "",
            buttonStatus: "",
            reciever_id: this.props.reciever_id
        };
        this.friendRequest = this.friendRequest.bind(this);
    }

    componentDidMount() {
        console.log("Props in button: ", this.props.reciever_id);
        // var revieverId = this.props;

        axios
            .get("/get-friend-status", {
                params: {
                    reciever_id: this.props.reciever_id
                }
            })
            .then(results => {
                //console.log("Results from axios get-friends", results);

                if (results.data == "") {
                    this.setState({
                        buttonText: "Make A Friend Request",
                        buttonStatus: 0
                    });
                } else if (results.data.status == 1) {
                    if (results.data.sender_id == this.props.reciever_id) {
                        this.setState({
                            buttonText: "Accept Friend Request",
                            buttonStatus: "1a"
                        });
                    } else {
                        this.setState({
                            buttonText: "Request is pending. Cancel?",
                            buttonStatus: "1b"
                        });
                    }
                } else if (results.data.status == 2) {
                    this.setState({
                        buttonText: "we are friends",
                        buttonStatus: 2
                    });
                }
            });
    }

    friendRequest() {
        //console.log("no friends yet!", this.props.reciever_id);
        var reciever_id = this.props.reciever_id;

        if (this.state.buttonStatus == 0) {
            //console.log("We are here");
            var status = 1;
            axios
                .post("/friendRequest", {
                    status: status,
                    reciever_id: reciever_id
                })
                .then(results => {
                    //console.log("After First Request", results);
                    // socket.on("friendRequestrequest", results => {
                    //     io.sockets.emit("friendRequest", results);
                    // });

                    this.setState({
                        buttonStatus: "1b",
                        buttonText: "Request is pending. Cancel?"
                    });
                });
        } else if (this.state.buttonStatus == "1a") {
            // become a friend
            console.log("We are here 2");
            var status2 = 2;
            axios
                .post("/friendRequest", {
                    status: status2,
                    reciever_id: reciever_id
                })
                .then(results => {
                    //console.log("After Pending", results);
                    this.setState({
                        buttonStatus: 2,
                        buttonText: "Friends"
                    });
                });
        } else if (this.state.buttonStatus == "1b") {
            // cancel pending request
            axios
                .post("/deleteFriendRequest", {
                    reciever_id: reciever_id
                })
                .then(results => {
                    //console.log("After Deleting", results);
                    this.setState({
                        buttonText: "Make A Friend Request",
                        buttonStatus: 0
                    });
                });
        } else if (this.state.buttonStatus == 2) {
            // cancel friend request
            axios
                .post("/deleteFriendRequest", {
                    reciever_id: reciever_id
                })
                .then(results => {
                    console.log("After Deleting", results);
                    this.setState({
                        buttonText: "Make A Friend Request",
                        buttonStatus: 0
                    });
                });
        }
    }

    render() {
        // console.log("render: ", this.state);
        return (
            <div className="friendButtonBox">
                <button className="friendButton" onClick={this.friendRequest}>
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}
