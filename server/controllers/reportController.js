const db = require("../config/db");

const getMonthlyReport = (req, res) => {

    const user_id = req.user.user_id;
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({
            message: "Month and year are required"
        });
    }

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
        AND MONTH(transaction_date) = ?
        AND YEAR(transaction_date) = ?
    `;

    db.query(
        sql,
        [user_id, month, year],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to generate monthly report",
                    error: err.message
                });
            }

            const totalIncome =
                parseFloat(results[0].total_income);

            const totalExpense =
                parseFloat(results[0].total_expense);

            const balance =
                totalIncome - totalExpense;

            res.status(200).json({
                month: Number(month),
                year: Number(year),
                total_income: totalIncome,
                total_expense: totalExpense,
                balance: balance
            });
        }
    );
};

const getCategoryReport = (req, res) => {

    const user_id = req.user.user_id;
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({
            message: "Month and year are required"
        });
    }

    const sql = `
        SELECT
            c.category_name AS category,
            COALESCE(SUM(t.amount), 0) AS total

        FROM transactions t

        JOIN categories c
            ON t.category_id = c.category_id

        WHERE t.user_id = ?
        AND t.transaction_type = 'Expense'
        AND MONTH(t.transaction_date) = ?
        AND YEAR(t.transaction_date) = ?

        GROUP BY c.category_id, c.category_name

        ORDER BY total DESC
    `;

    db.query(
        sql,
        [user_id, month, year],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to generate category report",
                    error: err.message
                });
            }

            res.status(200).json(results);
        }
    );
};

const getTransactionReport = (req, res) => {

    const user_id = req.user.user_id;
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({
            message: "Month and year are required"
        });
    }

    const sql = `
        SELECT
            t.transaction_id,
            t.transaction_date,
            t.description,
            t.transaction_type,
            t.amount,
            c.category_name AS category

        FROM transactions t

        LEFT JOIN categories c
            ON t.category_id = c.category_id

        WHERE t.user_id = ?
        AND MONTH(t.transaction_date) = ?
        AND YEAR(t.transaction_date) = ?

        ORDER BY t.transaction_date DESC
    `;

    db.query(
        sql,
        [user_id, month, year],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to generate transaction report",
                    error: err.message
                });
            }

            res.status(200).json(results);
        }
    );
};


module.exports = {
    getMonthlyReport,
    getCategoryReport,
    getTransactionReport
};