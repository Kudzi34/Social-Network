import React from "react";

const axios = require("axios");

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
                {this.state.error && <div className="error">error message</div>}
                <input
                    name="firstname"
                    placeholder="firstname"
                    onChange={this.handleChange}
                />
                <input
                    name="lastname"
                    placeholder="lastname"
                    onChange={this.handleChange}
                />
                <input
                    name="email"
                    placeholder="email"
                    onChange={this.handleChange}
                />
                <input
                    name="password"
                    placeholder="password"
                    onChange={this.handleChange}
                />
                <button onClick={this.submit}>Register</button>
            </div>
        );
    }
}

export default Registration;
