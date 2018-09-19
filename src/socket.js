import * as io from "socket.io-client";

import {
    onlineUsers,
    disconnectUser,
    newUserOnline,
    chatMessages,
    chatMessage
} from "./actions";

let socket;

export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on("onlineUsers", data => {
            console.log("All Online Users in socket.js: ", data);
            store.dispatch(onlineUsers(data));
        });
        //
        socket.on("newUserOnline", data => {
            console.log("New user online in socket.js", data);

            store.dispatch(newUserOnline(data));
        });

        socket.on("disonnect", data => {
            console.log("We have Disconnected in Socket.js", data);

            store.dispatch(disconnectUser(data));
        });
        /////chat///////////////////////////////////////////////////////////////////////////////
        socket.on("chatMessage", message => {
            console.log("Here is message in socket:", message);
            store.dispatch(chatMessage(message));
        });

        socket.on("chatMessages", messages => {
            console.log("messages in socket.js");
            store.dispatch(chatMessages(messages));
        });
    }

    // socket.on('userLeft', data => {
    //     // dispatch
    // })

    return socket;
}
