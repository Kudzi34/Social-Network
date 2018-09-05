import React from "react";

const axios = require("axios");

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    submit() {
        axios
            .post("/login", {
                email: this.email,
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
            <div className="login">
                {this.state.error && <div className="error">error message</div>}
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
                <button onClick={this.submit}>Login</button>
            </div>
        );
    }
}

export default Login;
