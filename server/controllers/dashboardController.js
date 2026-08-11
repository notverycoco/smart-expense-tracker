const db = require("../config/db");

const getDashboard = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT

            COALESCE(
                SUM(
                    CASE
                        WHEN transaction_type = 'Income'
                        THEN amount
                        ELSE 0
                    END
                ), 0
            ) AS total_income,

            COALESCE(
                SUM(
                    CASE
                        WHEN transaction_type = 'Expense'
                        THEN amount
                        ELSE 0
                    END
                ), 0
            ) AS total_expense

        FROM transactions

        WHERE user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load dashboard",
                error: err.message
            });
        }

        const totalIncome = parseFloat(results[0].total_income);
        const totalExpense = parseFloat(results[0].total_expense);

        const balance = totalIncome - totalExpense;

        res.status(200).json({
            total_income: totalIncome,
            total_expense: totalExpense,
            balance: balance
        });
    });
};

module.exports = {
    getDashboard
};