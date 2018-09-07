const spicedPg = require("spiced-pg");
const secrets = require("./secrets.json");

const dbUrl = secrets.dbUrl;
const db = spicedPg(dbUrl);

exports.createUser = (firstname, lastname, email, hashedpassword) => {
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

exports.getUserById = id => {
    return db.query(
        `SELECT *
		     FROM users
		 	 WHERE id = $1
			`,
        [id]
    );
};
exports.updateImage = (imageUrl, user_id) => {
    return db.query(
        `
        UPDATE users
        SET imageUrl = $1
        WHERE id = $2
        `,
        [imageUrl, user_id]
    );
};
