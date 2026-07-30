const db = require("../config/db");

// Find user by email
const findUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], callback);
};

// Create new user
const createUser = (userData, callback) => {
    const sql =
        "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";

    db.query(
        sql,
        [userData.full_name, userData.email, userData.password],
        callback
    );
};

module.exports = {
    findUserByEmail,
    createUser
};