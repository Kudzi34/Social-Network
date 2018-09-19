import React from "react";
import axios from "./axios";

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    submit() {
        axios
            .post("/registration", {
                email: this.email,
                firstname: this.firstname,
                lastname: this.lastname,
                password: this.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }

    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    render() {
        return (
            <div className="registration">
                <div className="reg-div">
                    {this.state.error && (
                        <div className="error">error message</div>
                    )}
                    <input
                        className="input"
                        name="firstname"
                        placeholder="firstname"
                        onChange={this.handleChange}
                    />
                </div>
                <div className="reg-div">
                    <input
                        className="input"
                        name="lastname"
                        placeholder="lastname"
                        onChange={this.handleChange}
                    />
                </div>
                <div className="reg-div">
                    <input
                        className="input"
                        name="email"
                        placeholder="email"
                        onChange={this.handleChange}
                    />
                </div>
                <div className="reg-div">
                    <input
                        className="input"
                        name="password"
                        placeholder="password"
                        onChange={this.handleChange}
                    />
                </div>
                <div className="regbutton">
                    <button className="button" onClick={this.submit}>
                        Register
                    </button>
                </div>
            </div>
        );
    }
}

export default Registration;
