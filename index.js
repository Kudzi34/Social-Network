const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
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
app.use(
    cookieSession({
        secret: "secrets",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

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
            //console.log("This is results", results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch(err => {
            console.log("there is an error in get user", err);
        });
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
    //console.log("working", req.file.filename);

    // update image_url in users table
    db.updateImage(config.s3Url + req.file.filename, req.session.userId)
        .then(() => {
            console.log(config.s3Url + req.file.filename, req.session.userId);
            let imageUrl = config.s3Url + req.file.filename;
            req.session.imageUrl = imageUrl;
            //console.log("this is my ", req.session.imageUrl);
            // send back from db to vue to render
            res.json({
                imageUrl: req.session.imageUrl
            });
        })
        .catch(error => {
            console.log("this error in image uplod", error);
            res.status(500).json({
                success: false
            });
        });
});
//////////////////Do NOT TOUCH////////////////////////////////////////////////////////////////////
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
/////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(8080, function() {
    console.log("I'm listening.");
});
