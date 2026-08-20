const db = require("../config/db");

const addRecurringExpense = (req, res) => {

    const user_id = req.user.user_id;

    const {
        category_id,
        amount,
        description,
        frequency,
        next_due_date
    } = req.body;

    if (!amount || !frequency || !next_due_date) {
        return res.status(400).json({
            message: "Amount, frequency and next due date are required"
        });
    }

    const sql = `
        INSERT INTO recurring_expenses
        (user_id, category_id, amount, description, frequency, next_due_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            category_id || null,
            amount,
            description || null,
            frequency,
            next_due_date
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to create recurring expense",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Recurring expense created successfully",
                recurring_id: result.insertId
            });
        }
    );
};


const getRecurringExpenses = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT
            r.recurring_id,
            r.amount,
            r.description,
            r.frequency,
            r.next_due_date,
            r.status,
            c.category_name AS category

        FROM recurring_expenses r

        LEFT JOIN categories c
            ON r.category_id = c.category_id

        WHERE r.user_id = ?

        ORDER BY r.next_due_date ASC
    `;

    db.query(sql, [user_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch recurring expenses",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};


const updateRecurringExpense = (req, res) => {

    const user_id = req.user.user_id;
    const recurring_id = req.params.id;

    const {
        category_id,
        amount,
        description,
        frequency,
        next_due_date,
        status
    } = req.body;

    const sql = `
        UPDATE recurring_expenses
        SET
            category_id = ?,
            amount = ?,
            description = ?,
            frequency = ?,
            next_due_date = ?,
            status = ?
        WHERE recurring_id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            category_id || null,
            amount,
            description || null,
            frequency,
            next_due_date,
            status || "Active",
            recurring_id,
            user_id
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update recurring expense",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Recurring expense not found"
                });
            }

            res.status(200).json({
                message: "Recurring expense updated successfully"
            });
        }
    );
};


const deleteRecurringExpense = (req, res) => {

    const user_id = req.user.user_id;
    const recurring_id = req.params.id;

    const sql = `
        DELETE FROM recurring_expenses
        WHERE recurring_id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [recurring_id, user_id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to delete recurring expense",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Recurring expense not found"
                });
            }

            res.status(200).json({
                message: "Recurring expense deleted successfully"
            });
        }
    );
};

const getUpcomingRecurringExpenses = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT
            r.recurring_id,
            r.amount,
            r.description,
            r.frequency,
            r.next_due_date,
            r.status,
            c.category_name AS category

        FROM recurring_expenses r

        LEFT JOIN categories c
            ON r.category_id = c.category_id

        WHERE r.user_id = ?
        AND r.status = 'Active'
        AND r.next_due_date >= CURDATE()

        ORDER BY r.next_due_date ASC
    `;

    db.query(sql, [user_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch upcoming recurring expenses",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};


module.exports = {
    addRecurringExpense,
    getRecurringExpenses,
    updateRecurringExpense,
    deleteRecurringExpense,
    getUpcomingRecurringExpenses
};