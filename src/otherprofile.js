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
                if (response.data.userId) {
                    console.log("this is loggedProfile");
                    this.props.history.push("/");
                }

                let otherUser = response.data;
                if (!response.data.imageurl) {
                    otherUser.imageurl = "/image2.png";
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
                <div className="image3-div">
                    <img src={this.state.imageurl} className="propic3" />
                </div>
                <h2>Firstname:{this.state.firstname}</h2>
                <h2>Lastname:{this.state.lastname}</h2>
                <div className="bio-div">
                    <h3> Bio: </h3>
                    <p className="profileBio"> {this.state.bio} </p>
                </div>

                <Friendshipbutton
                    reciever_id={this.props.match.params.userId}
                />
            </div>
        );
    }
}
