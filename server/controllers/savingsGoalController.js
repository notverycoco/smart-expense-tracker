const db = require("../config/db");

const createSavingsGoal = (req, res) => {

    const user_id = req.user.user_id;

    const {
        goal_name,
        target_amount,
        target_date
    } = req.body;

    if (!goal_name || !target_amount) {
        return res.status(400).json({
            message: "Goal name and target amount are required"
        });
    }

    const sql = `
        INSERT INTO savings_goals
        (user_id, goal_name, target_amount, saved_amount, target_date)
        VALUES (?, ?, ?, 0, ?)
    `;

    db.query(
        sql,
        [user_id, goal_name, target_amount, target_date || null],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to create savings goal",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Savings goal created successfully",
                goal_id: result.insertId
            });
        }
    );
};


const getSavingsGoals = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT
            goal_id,
            goal_name,
            target_amount,
            saved_amount,
            target_date,
            ROUND(
                (saved_amount / target_amount) * 100,
                2
            ) AS progress_percentage,

            (target_amount - saved_amount)
            AS remaining_amount

        FROM savings_goals

        WHERE user_id = ?

        ORDER BY created_at DESC
    `;

    db.query(sql, [user_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load savings goals",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

const addMoneyToGoal = (req, res) => {

    const user_id = req.user.user_id;
    const goal_id = req.params.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            message: "Valid amount is required"
        });
    }

    const sql = `
        UPDATE savings_goals
        SET saved_amount = saved_amount + ?
        WHERE goal_id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [amount, goal_id, user_id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to add money",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Savings goal not found"
                });
            }

            res.status(200).json({
                message: "Money added to savings goal successfully"
            });
        }
    );
};

const updateSavingsGoal = (req, res) => {

    const user_id = req.user.user_id;
    const goal_id = req.params.id;

    const {
        goal_name,
        target_amount,
        target_date
    } = req.body;

    if (!goal_name || !target_amount) {
        return res.status(400).json({
            message: "Goal name and target amount are required"
        });
    }

    const sql = `
        UPDATE savings_goals
        SET
            goal_name = ?,
            target_amount = ?,
            target_date = ?
        WHERE goal_id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            goal_name,
            target_amount,
            target_date || null,
            goal_id,
            user_id
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update savings goal",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Savings goal not found"
                });
            }

            res.status(200).json({
                message: "Savings goal updated successfully"
            });
        }
    );
};

const deleteSavingsGoal = (req, res) => {

    const user_id = req.user.user_id;
    const goal_id = req.params.id;

    const sql = `
        DELETE FROM savings_goals
        WHERE goal_id = ?
        AND user_id = ?
    `;

    db.query(sql, [goal_id, user_id], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to delete savings goal",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Savings goal not found"
            });
        }

        res.status(200).json({
            message: "Savings goal deleted successfully"
        });
    });
};

module.exports = {
    createSavingsGoal,
    getSavingsGoals,
    addMoneyToGoal,
    updateSavingsGoal,
    deleteSavingsGoal
};