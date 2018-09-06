import React from "react";
import axios from "./axios";
// import { Link } from "react-router-dom";
import Logo from "./logo";
import Profilepicture from "./profilepicture";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            if (!data.imageUrl) {
                data.imageUrl = "image2.png";
            }
            console.log("here is data", data);
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
    render() {
        if (!this.state.id) {
            return <img src="/image2.png" />;
        }
        return (
            <div className="main-appdiv">
                <Logo />
                <Profilepicture
                    imageUrl={this.state.imageUrl}
                    firstname={this.state.firstname}
                    lastname={this.state.lastname}
                    clickHandler={this.makeUploaderVisible}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader updateImage={this.updateImage} />
                )}
            </div>
        );
    }
}
