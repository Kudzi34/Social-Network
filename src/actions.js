import axios from "./axios";

export async function receiveFriends() {
    const { data } = await axios.get("/getFriends");
    //console.log("Data in ACTIONS in Receive Friends", data);
    return {
        type: "LIST_OF_FRIENDS",
        friends: data.friends
    };
}

export async function unfriend(props) {
    var receiver_id = props;
    const { data } = await axios.post("/deleteFriendRequest", {
        receiver_id: receiver_id
    });
    return {
        type: "UNFRIEND",
        receiver_id
    };
}

export async function acceptRequest(props) {
    //console.log("Props:", props);
    var receiver_id = props;

    const { data } = await axios.post("/friendRequest", {
        receiver_id: receiver_id,
        status: 2
    });
    //console.log("Data in ACTIONS in Receive Friends", data);
    return {
        type: "ACCEPT_REQUEST",
        receiver_id
    };
}

export async function onlineUsers(users) {
    // actions always return the object
    return {
        type: "ONLINE_USERS",
        users: users
    };
}

export async function disconnectUser(userId) {
    return {
        type: "DISCONNECT",
        userId: userId
    };
}

export async function newUserOnline(user) {
    return {
        type: "NEW_USER_ONLINE",
        user: user
    };
}
//////chat functions////////////////////////
export function chatMessages(messages) {
    return {
        type: "CHAT_MESSAGES",
        messages: messages
    };
}

export function chatMessage(message) {
    return {
        type: "CHAT_MESSAGE",
        message: message
    };
}
export function friendRequestNotification(notification) {
    console.log("working actions friendreq!");

    return {
        type: "FRIEND_REQUEST_NOTIFICATION",
        notification: notification
    };
}
