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

exports.uploadBio = (bio, id) => {
    const q = `
    UPDATE users
    SET bio = $1
    WHERE id = $2
    `;
    return db.query(q, [bio, id]);
};

exports.getUserInfo = id => {
    return db.query(
        `
    SELECT *
    FROM users
    WHERE id = $1
    `,
        [id]
    );
};

exports.checkIfFriends = (reciever_id, sender_id) => {
    const q = `
    SELECT reciever_id, sender_id, status
    FROM friendships
    WHERE (reciever_id = $1 AND sender_id =$2)
    OR (reciever_id = $2 AND sender_id = $1
    )
    `;
    return db.query(q, [reciever_id, sender_id]);
};
exports.createFriendRequest = (status, reciever_id, sender_id) => {
    const q = `
    UPDATE friendships
    SET status = $1
    WHERE (reciever_id =$2 AND sender_id =$3)
    OR (reciever_id =$3 AND sender_id = $2)
    RETURNING status
    `;
    return db.query(q, [status, reciever_id, sender_id]);
};
exports.newFriendRequest = (status, reciever_id, sender_id) => {
    const q = `
    INSERT INTO friendships (status, reciever_id, sender_id)
    VALUES ($1, $2, $3)
    RETURNING status
    `;
    return db.query(q, [status, reciever_id, sender_id]);
};
exports.deleteFriendRequest = (reciever_id, sender_id) => {
    const q = `
    DELETE FROM friendships
    WHERE (reciever_id =$1 AND sender_id =$2)
    `;
    return db.query(q, [reciever_id, sender_id]);
};

exports.receiveFriends = id => {
    const q = `
    SELECT users.id, firstname, lastname, imageurl, status
    FROM friendships
    JOIN users
    ON (status = 1 AND reciever_id = $1 AND sender_id = users.id)
    OR (status = 2 AND reciever_id = $1 AND sender_id = users.id)
    OR (status = 2 AND sender_id = $1 AND reciever_id = users.id)
`;
    return db.query(q, [id]);
};

exports.getUsersByIds = arrayOfIds => {
    const q = `SELECT firstname, lastname, id, bio, imageurl FROM users WHERE id = ANY($1)`;
    return db.query(q, [arrayOfIds]);
};

exports.getRecentMessages = function() {
    const q = `SELECT users.id,firstname, lastname, imageurl,chats.id as chatid,sender_id,sent,message
    FROM chats
    LEFT JOIN users
    ON (sender_id = users.id)
    ORDER BY chatid DESC
    LIMIT 10`;
    return db.query(q);
};

exports.saveChatMsg = function(sender_id, message) {
    console.log("in save chat:", message);
    const q = `INSERT INTO chats(sender_id,message)
	VALUES($1,$2) RETURNING id as chatid,sender_id,sent,message`;

    return db.query(q, [sender_id || null, message || null]);
};
