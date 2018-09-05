const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const bcrypt = require("./bcrypt");
const secrets = require("./secrets.json");

app.use(express.static("./public"));
app.use(compression());
app.use(require("cookie-parser")());
app.use(
    cookieSession({
        secret: "secrets",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
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
/////////DO NOT TOUCH///////////////////////////////////////////////////////////

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
////////////////////////////////////////////////////////////////////////////////
app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        return res.redirect("/welcome");
    }
    res.sendFile(__dirname + "/index.html");
});

app.get("/", (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/welcome");
    }
    res.sendFile(__dirname + "/index.html");
});

app.post("/registration", (req, res) => {
    let { firstname, lastname, email, password } = req.body;
    console.log(firstname, lastname, email, password);
    bcrypt
        .hashPass(password)
        .then(hash => {
            db.createUser(firstname, lastname, email, hash);
        })
        .then(id => {
            req.session.userId = id;
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

app.listen(8080, function() {
    console.log("I'm listening.");
});
