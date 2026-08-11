const db = require("../config/db");

const addExpense = (expenseData, callback) => {

    const sql = `
        INSERT INTO transactions
        (user_id, category_id, amount, transaction_type, description, transaction_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            expenseData.user_id,
            expenseData.category_id,
            expenseData.amount,
            "Expense",
            expenseData.description,
            expenseData.transaction_date
        ],
        callback
    );
};

const getExpenses = (user_id, callback) => {

    const sql = `
        SELECT * FROM transactions
        WHERE user_id = ? AND transaction_type = 'Expense'
        ORDER BY transaction_date DESC
    `;

    db.query(sql, [user_id], callback);
};

const updateExpense = (transaction_id, user_id, expenseData, callback) => {

    const sql = `
        UPDATE transactions
        SET category_id = ?,
            amount = ?,
            description = ?,
            transaction_date = ?
        WHERE transaction_id = ?
        AND user_id = ?
        AND transaction_type = 'Expense'
    `;

    db.query(
        sql,
        [
            expenseData.category_id,
            expenseData.amount,
            expenseData.description,
            expenseData.transaction_date,
            transaction_id,
            user_id
        ],
        callback
    );
};

const deleteExpense = (transaction_id, user_id, callback) => {

    const sql = `
        DELETE FROM transactions
        WHERE transaction_id = ?
        AND user_id = ?
        AND transaction_type = 'Expense'
    `;

    db.query(
        sql,
        [transaction_id, user_id],
        callback
    );
};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};