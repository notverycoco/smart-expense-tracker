const db = require("../config/db");

const getExpenseByCategory = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT
            c.category_name AS category,
            COALESCE(SUM(t.amount), 0) AS total

        FROM transactions t

        JOIN categories c
            ON t.category_id = c.category_id

        WHERE t.user_id = ?
        AND t.transaction_type = 'Expense'

        GROUP BY c.category_id, c.category_name

        ORDER BY total DESC
    `;

    db.query(sql, [user_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load expense analytics",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getMonthlyIncomeExpense = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT
            MONTH(transaction_date) AS month_number,
            MONTHNAME(transaction_date) AS month,

            COALESCE(
                SUM(
                    CASE
                        WHEN transaction_type = 'Income'
                        THEN amount
                        ELSE 0
                    END
                ), 0
            ) AS income,

            COALESCE(
                SUM(
                    CASE
                        WHEN transaction_type = 'Expense'
                        THEN amount
                        ELSE 0
                    END
                ), 0
            ) AS expense

        FROM transactions

        WHERE user_id = ?

        GROUP BY
            MONTH(transaction_date),
            MONTHNAME(transaction_date)

        ORDER BY month_number ASC
    `;

    db.query(sql, [user_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load monthly analytics",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const getRecentTransactions = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT
            t.transaction_id,
            t.amount,
            t.description,
            t.transaction_date,
            t.transaction_type,
            c.category_name AS category

        FROM transactions t

        LEFT JOIN categories c
            ON t.category_id = c.category_id

        WHERE t.user_id = ?

        ORDER BY t.transaction_date DESC,
                 t.transaction_id DESC

        LIMIT 5
    `;

    db.query(sql, [user_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load recent transactions",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

module.exports = {
    getExpenseByCategory,
    getMonthlyIncomeExpense,
    getRecentTransactions
};