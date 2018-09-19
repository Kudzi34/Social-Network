import React, { Component } from "react";
import { connect } from "react-redux";
import { getSocket } from "./socket";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.savechatMessage = this.savechatMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    savechatMessage(e) {
        if (e.which === 13) {
            getSocket().emit("chat", e.target.value);
            e.target.value = "";
        }
    }

    scrollToBottom() {
        const scrollHeight = this.element.scrollHeight;
        const height = this.element.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.element.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    componentDidUpdate() {
        if (!this.elem) {
            return;
        }
        console.log("checking componentDidUpdate");
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }
    render() {
        if (!this.props.messages) {
            return <div> loading...</div>;
        }
        return (
            <div className="bigchat-div">
                <div className="Messages" ref={elem => (this.elem = elem)}>
                    {this.props.messages.map(message => (
                        <div className="chats" key={message.chatid}>
                            <div>
                                <img
                                    className="images"
                                    src={message.imageurl}
                                    alt={message.firstname}
                                />
                                <div>
                                    {message.firstname} {message.lastname}
                                </div>
                            </div>
                            <div className="chat">
                                <p>{message.sent}</p>
                                <p>{message.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <textarea
                        className="chatmsg"
                        onKeyDown={this.savechatMessage}
                        placeholder="enter chat"
                    />
                </div>
            </div>
        );
    }
}

const mapChatMessagestoProps = state => {
    return {
        messages: state.messages
    };
};

export default connect(mapChatMessagestoProps)(Chat);
