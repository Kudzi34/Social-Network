import * as io from "socket.io-client";

import { onlineUsers, disconnectUser, newUserOnline } from "./actions";

let socket;

export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
    }

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

    // socket.on('userLeft', data => {
    //     // dispatch
    // })

    return socket;
}

// import * as io from "socket.io-client";
// import { addAnimals } from "./actions";
//
// let socket;
//
// export function getSocket(store) {
//     if (!socket) {
//         socket = io.connect();
//         socket.on("cuteAnimals", data => {
//             store.dispatch(addAnimals(data));
//             console.log("cuteAnimals", data);
//             socket.on("onlineUsers", data => {});
//         });
//     }
//     return socket;
// }
