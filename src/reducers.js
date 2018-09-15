const INITIAL_STATE = {
    friends: []
};
// export function reducer(state = {}, action) {
//     if (action.type == "ADD_ANIMALS") {
//         state = {
//             ...state,
//             cuteAnimals: action.animals
//         };
//     }
//     return state;
// }

export default function(state = INITIAL_STATE, action) {
    console.log("Here is your actions: ", action);
    if (action.type == "LIST_OF_FRIENDS") {
        state = {
            ...state,
            friends: action.friends
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friends:
                state.friends &&
                state.friends.filter(user => user.id != action.receiver_id)
        };
    }

    if (action.type == "ACCEPT_REQUEST") {
        state = {
            ...state,
            friends: state.friends.map(friend => {
                //console.log("out super id:", friend.id);
                //console.log("reciever ID", action.receiver_id);
                if (friend.id == action.receiver_id) {
                    console.log("we Are here in reducers acceptRequest!");
                    return { ...friend, status: (friend.status = 2) };
                } else {
                    return friend;
                }
            })
        };
    }
    if (action.type == "ONLINE_USERS") {
        state = {
            ...state,
            onlineUsers: action.users
        };
    }

    if (action.type == "DISCONNECT") {
        console.log("reciever ID", action.userId);
        console.log("current state of users: ", state);
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                user => user.id != action.user.id
            )
        };
    }

    if (action.type == "NEW_USER_ONLINE") {
        console.log("Out nice new user: ", action.user);
        state = {
            ...state,
            onlineUsers: state.onlineUsers.concat(action.user)
        };
    }

    console.log("Our state", state);
    return state;
}
