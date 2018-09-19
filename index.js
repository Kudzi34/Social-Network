const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db");
const bcrypt = require("./bcrypt");
const secrets = require("./secrets.json");
const csurf = require("csurf");
const s3 = require("./s3");
const bp = require("body-parser");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const config = require("./config.json");

app.use(express.static("./public"));
app.use(compression());
app.use(require("cookie-parser")());
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `secrets`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(require("body-parser").json());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        return res.redirect("/");
    }
    res.sendFile(__dirname + "/index.html");
});

app.get("/", (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/welcome");
    }
    res.sendFile(__dirname + "/index.html");
});
app.get("/user", (req, res) => {
    db.getUserById(req.session.userId)

        .then(results => {
            console.log("info by getUserById ", results.rows);
            res.json(results.rows[0]);
        })
        .catch(err => {});
});

app.post("/registration", (req, res) => {
    let { firstname, lastname, email, password } = req.body;
    bcrypt
        .hashPass(password)
        .then(hash => {
            return db.createUser(firstname, lastname, email, hash);
        })
        .then(results => {
            req.session.userId = results.rows[0].id;
            console.log("session", req.session.userId);
            res.json({
                success: true
            });
        })
        .catch(() => res.json({ success: false }));
});
app.post("/login", (req, res) => {
    let { email, password } = req.body;
    db.getUsers()
        .then(response => {
            response.rows.forEach(row => {
                if (email == row.email) {
                    bcrypt
                        .checkPass(password, row.hashedpassword)
                        .then(doesMatch => {
                            if (doesMatch) {
                                req.session.user = {
                                    firstname: row.firstname,
                                    lastname: row.lastname,
                                    userId: row.id
                                };
                                res.json({
                                    success: true
                                });
                            }
                        });
                }
            });
        })
        .catch(error => {
            res.json({
                success: false
            });
        });
});
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // update image_url in users table
    db.updateImage(config.s3Url + req.file.filename, req.session.userId)
        .then(() => {
            let imageurl = config.s3Url + req.file.filename;
            req.session.imageurl = imageurl;
            // send back from db to vue to render
            res.json({
                imageurl: req.session.imageurl
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false
            });
        });
});

app.post("/profile", (req, res) => {
    db.uploadBio(req.body.bio, req.session.userId).catch(err => {
        res.status(500).json({
            success: false
        });
    });
});

app.get("/get-user/:userId", (req, res) => {
    db.getUserInfo(req.params.userId)
        .then(results => {
            res.json(results.rows[0]);
        })
        .catch(error => {
            console.log("server failure in get-user ", error);
        });
});

app.get("/get-friend-status", (req, res) => {
    console.log("Current User:", req.session.userId);
    console.log("req in Request:", req.query.reciever_id);
    var reciever_id = req.query.reciever_id;
    var sender_id = req.session.userId;
    db.checkIfFriends(reciever_id, sender_id)
        .then(results => {
            console.log("Friend request: ", sender_id);
            res.json(results.rows[0]);
        })
        .catch(error => {
            console.log("Error in GET FRIEND STATUS", error);
        });
});
app.get("/getAllFriends", (req, res) => {
    console.log("Current User:", req.session.userId);
    console.log("req in Request:", req.query.reciever_id);
    var reciever_id = req.query.reciever_id;
    var sender_id = req.session.userId;
    db.checkIfFriends(reciever_id, sender_id)
        .then(results => {
            console.log("Friend request: ", sender_id);
            res.json(results.rows);
        })
        .catch(error => {
            console.log("Error in GET FRIEND BUTTON STATUS", error);
        });
});

app.get("/getFriends", (req, res) => {
    console.log("running getFriends", req.session);
    db.receiveFriends(req.session.userId)
        .then(results => {
            res.json({ friends: results.rows });
        })
        .catch(error => {
            console.log("Error in GET FRIENDS", error);
        });
    // console.log("Current User:", req.session.userId);
    // console.log("req in Request:", req.query.reciever_id);
    // var reciever_id = req.query.reciever_id;
    // var sender_id = req.session.userId;
    // db.checkIfFriends(reciever_id, sender_id)
    //     .then(results => {
    //         console.log("Friend request: ", sender_id);
    //         res.json(results.rows);
    //     })
    //     .catch(error => {
    //         console.log("Error in GET FRIENDS", error);
    //     });
});

app.post("/friendRequest", (req, res) => {
    var status = req.body.status;
    var sender_id = req.session.userId;
    var reciever_id = req.body.reciever_id;
    if (status == 1) {
        db.newFriendRequest(status, reciever_id, sender_id).then(results => {
            console.log("Result In new Making Friend row", results.rows[0]);
            res.json(results.rows[0]);
        });
    } else {
        db.createFriendRequest(status, reciever_id, sender_id).then(results => {
            console.log("Results form sending request", results.rows[0]);
            res.json(results.rows[0]);
        });
    }
});
app.post("/deleteFriendRequest", (req, res) => {
    console.log("Delete as friend ");
    var sender_id = req.session.userId.rows;
    console.log(sender_id);
    var reciever_id = req.body.reciever_id;
    console.log(reciever_id);
    db.deleteFriendRequest(reciever_id, sender_id).then(() => {
        res.json("");
    });
});
//////////////////Do NOT TOUCH////////////////////////////////////////////////////////////////////
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
/////////////////////////////////////////////////////////////////////////////////////////////////

server.listen(8080, function() {
    console.log("We working here.");
});

let onlineUsers = {};
//Checking connection to socket//
io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);

    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }

    // store socketid and userid in variables

    const userId = socket.request.session.userId;
    const socketId = socket.id;

    // add socket id with user id to the object
    onlineUsers[socketId] = userId;

    // some code

    let arrayOfUserIds = Object.values(onlineUsers); // gives an array of all righthand values of the Object

    console.log("Array of userIds", arrayOfUserIds);
    // put to DB

    db.getUsersByIds(arrayOfUserIds).then(results => {
        console.log("Array of Users: ", results.rows);
        // results = array of objects that contains users name, email, etc.

        // now we have to take this results and emit them.

        socket.emit("onlineUsers", results.rows);
    });

    //     // we can also emit to everyone but the person who has just connected

    if (
        arrayOfUserIds.filter(id => id == socket.request.session.userId)
            .length == 1
    ) {
        console.log("We passed the condition");
        db.getUserInfo(socket.request.session.userId).then(results => {
            console.log("New user logged in info: ", results.rows[0]);

            socket.broadcast.emit("newUserOnline", results.rows);
        });
    }
    //     socket.broadcast.emit('userJoined', payload)
    //
    //
    //
    //  prevent one user to appear more
    //
    //
    socket.on("disconnect", function() {
        delete onlineUsers[socket.id];

        console.log("DISCONNECT: ", onlineUsers);
        console.log(
            "CHECK DISCONNECT",
            Object.values(onlineUsers).includes(userId)
        );

        if (!Object.values(onlineUsers).includes(userId)) {
            console.log("Id is not there");
            console.log(`socket with the id ${socket.id} is now disconnected`);

            io.sockets.emit("disonnect", userId);
        }

        // in this situation there is no difference between emit and broadcast
        // plurar if io.sockets
    });
    ////////////chat//////////////////////////////////////////////////////////////////
    db.getRecentMessages()
        .then(results => {
            console.log("chatMessages", results.rows);
            socket.emit("chatMessages", results.rows.reverse());
        })
        .catch(function(error) {
            console.log("Error occured in getting chat messages", error);
        });

    socket.on("chat", message => {
        db.saveChatMsg(userId, message)
            .then(results => {
                console.log("here are results in saveChatMsg", results);
                let userInfo = Object.assign(results.rows[0]);
                db.getUserInfo(userId)
                    .then(results => {
                        console.log("Here is userInfo:", userInfo);
                        io.sockets.emit(
                            "chatMessage",
                            Object.assign({}, userInfo, results.rows[0])
                        );
                    })
                    .catch(function(err) {
                        console.log(
                            "Error in getting chat socket on server",
                            err
                        );
                    });
            })
            .catch(function(err) {
                console.log("Error occured in getting chat message", err);
            });
    });
});

// socket.on('chatMessages', messages => {
//     store.dispatch(chatMessages(messages))
// })
//
// socket.on('newChatMessage', message => {
//     store.dispatch(newChatMessage(message))
// })
//
//     // function getUsersByIds(arrayOfIds) {
//     // const query = `SELECT * FROM users WHERE id = ANY($1)`;
//     // return db.query(query, [arrayOfIds]);
// }
//
//     console.log("online users: ", onlineUsers);
