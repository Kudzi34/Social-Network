import React from "react";
import axios from "./axios";
// import { Link } from "react-router-dom";
import Logo from "./logo";
import Profilepicture from "./profilepicture";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import Otherprofile from "./otherprofile";
import Friends from "./friends";
import OnlineUsers from "./onlineUsers";
import Chat from "./chat";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            firstname: "",
            lastname: "",
            email: "",
            bio: "",
            imageurl: "/image2.png",
            showBio: false
        };
        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
        this.toggleBio = this.toggleBio.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            console.log("data from app", data);
            if (!data.imageurl) {
                data.imageurl = "/image2.png";
            }
            this.setState(data);
        });
    }

    makeUploaderVisible() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    updateImage(imageurl) {
        this.setState({
            imageurl: imageurl,
            uploaderIsVisible: false
        });
    }
    toggleBio() {
        this.setState({
            showBio: !this.state.showBio
        });
    }
    setBio(e) {
        if (e.which === 13) {
            this.setState({
                bio: e.target.value,
                showBio: false
            });

            axios
                .post("/profile", {
                    bio: e.target.value
                })
                .catch(error => {});
        }
    }
    render() {
        if (!this.state.id) {
            return <img src="/image2.png" />;
        }
        return (
            <div className="main-appdiv">
                <div>
                    <Logo />
                    <Profilepicture
                        imageurl={this.state.imageurl}
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        clickHandler={this.makeUploaderVisible}
                    />
                </div>
                {this.state.uploaderIsVisible && (
                    <Uploader updateImage={this.updateImage} />
                )}
                <div>
                    <BrowserRouter>
                        <div>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <div className="profilediv">
                                        <Profile
                                            id={this.state.id}
                                            firstName={this.state.firstname}
                                            lastName={this.state.lastname}
                                            bio={this.state.bio}
                                            imageurl={this.state.imageurl}
                                            showBio={this.state.showBio}
                                            toggleBio={this.toggleBio}
                                            setBio={this.setBio}
                                            clickHandler={
                                                this.makeUploaderVisible
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <Route
                                exact
                                path="/user/:userId"
                                component={Otherprofile}
                            />
                            <Route exact path="/friends" component={Friends} />
                            <Route
                                exact
                                path="/onlineUsers"
                                component={OnlineUsers}
                            />
                            <Route exact path="/chat" component={Chat} />
                        </div>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}
