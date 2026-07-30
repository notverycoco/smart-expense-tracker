const db = require("../config/db");

const addIncome = (incomeData, callback) => {

    const sql = `
        INSERT INTO transactions
        (user_id, category_id, amount, transaction_type, description, transaction_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            incomeData.user_id,
            incomeData.category_id,
            incomeData.amount,
            "Income",
            incomeData.description,
            incomeData.transaction_date
        ],
        callback
    );
};

const getAllIncome = (user_id, callback) => {

    const sql = `
        SELECT *
        FROM transactions
        WHERE user_id = ?
        AND transaction_type = 'Income'
        ORDER BY transaction_date DESC
    `;

    db.query(sql, [user_id], callback);

};

module.exports = {
    addIncome,
    getAllIncome
};