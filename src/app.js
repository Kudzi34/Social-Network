import React from "react";
import axios from "./axios";
// import { Link } from "react-router-dom";
import Logo from "./logo";
import Profilepicture from "./profilepicture";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            firstname: "",
            lastname: "",
            email: "",
            bio: "",
            imageUrl: "image2.png",
            showBio: false
        };
        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
        this.toggleBio = this.toggleBio.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            if (!data.imageUrl) {
                data.imageUrl = "image2.png";
            }
            this.setState(data);
        });
    }
    makeUploaderVisible() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    updateImage(imageUrl) {
        this.setState({
            imageUrl: imageUrl,
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
                        imageUrl={this.state.imageUrl}
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        clickHandler={this.makeUploaderVisible}
                    />
                </div>
                {this.state.uploaderIsVisible && (
                    <Uploader updateImage={this.updateImage} />
                )}

                <BrowserRouter>
                    <Route
                        path="/"
                        render={() => (
                            <div className="profilediv">
                                <Profile
                                    id={this.state.id}
                                    firstName={this.state.firstname}
                                    lastName={this.state.lastname}
                                    bio={this.state.bio}
                                    imageUrl={this.state.imageUrl}
                                    showBio={this.state.showBio}
                                    toggleBio={this.toggleBio}
                                    setBio={this.setBio}
                                    clickHandler={this.makeUploaderVisible}
                                />
                            </div>
                        )}
                    />
                </BrowserRouter>
            </div>
        );
    }
}
