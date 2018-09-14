import * as io from "socket.io-client";
import { addAnimals } from "./actions";

let socket;

export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on("cuteAnimals", data => {
            store.dispatch(addAnimals(data));
            console.log("cuteAnimals", data);
            socket.on("onlineUsers", data => {});
        });
    }
    return socket;
}
