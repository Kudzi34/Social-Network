const spicedPg = require("spiced-pg");
const secrets = require("./secrets.json");

const dbUrl = secrets.dbUrl;
const db = spicedPg(dbUrl);

module.exports.createUser = (firstname, lastname, email, hashedpassword) => {
    return db.query(
        `
        INSERT INTO users (firstname, lastname, email, hashedpassword)
        VALUES($1, $2, $3, $4)
        RETURNING id
        `,
        [
            firstname || null,
            lastname || null,
            email || null,
            hashedpassword || null
        ]
    );
};

exports.getUsers = function() {
    return db.query("SELECT * FROM users");
};
