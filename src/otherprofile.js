import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Friendshipbutton from "./friendshipbutton.js";

export default class Otherprofile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get(`/get-user/${this.props.match.params.userId}`)
            .then(response => {
                console.log("data from axios get-user", response);
                if (response.data.loggedProfile) {
                    console.log("this is loggedProfile");
                    this.props.history.push("/");
                }

                let otherUser = response.data;
                if (!response.data.imageurl) {
                    response.data.imageurl = "/image2.png";
                }

                this.setState({
                    id: otherUser.userId,
                    firstname: otherUser.firstname,
                    lastname: otherUser.lastname,
                    imageurl: otherUser.imageurl,
                    bio: otherUser.bio
                });
            })
            .catch(err => {
                console.log("there is an errror in get-user:", err);
            });
    }

    render() {
        return (
            <div className="otherprofile">
                <h1>PROFILE</h1>

                <img src={this.state.imageurl} className="propic3" />
                <div className="otherUser-info">
                    <h1>
                        {this.state.firstname} {this.state.lastname}
                    </h1>
                    <p> Bio: </p>
                    <p className="profileBio"> {this.state.bio} </p>
                    <Link to="/user/2">User 2</Link>
                </div>
                <Friendshipbutton
                    reciever_id={this.props.match.params.userId}
                />
            </div>
        );
    }
}
