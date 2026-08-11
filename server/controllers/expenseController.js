const Expense = require("../models/expenseModel");

const addExpense = (req, res) => {

    const user_id = req.user.user_id;

    const {
        category_id,
        amount,
        description,
        transaction_date
    } = req.body;

    Expense.addExpense(
        {
            user_id,
            category_id,
            amount,
            description,
            transaction_date
        },
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to add expense",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Expense added successfully",
                transaction_id: result.insertId
            });
        }
    );
};

const getExpenses = (req, res) => {

    const user_id = req.user.user_id;

    Expense.getExpenses(user_id, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch expenses",
                error: err.message
            });
        }

        res.status(200).json(result);
    });
};

const updateExpense = (req, res) => {

    const transaction_id = req.params.id;
    const user_id = req.user.user_id;

    const {
        category_id,
        amount,
        description,
        transaction_date
    } = req.body;

    Expense.updateExpense(
        transaction_id,
        user_id,
        {
            category_id,
            amount,
            description,
            transaction_date
        },
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update expense",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Expense not found"
                });
            }

            res.status(200).json({
                message: "Expense updated successfully"
            });
        }
    );
};

const deleteExpense = (req, res) => {

    const transaction_id = req.params.id;
    const user_id = req.user.user_id;

    Expense.deleteExpense(
        transaction_id,
        user_id,
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to delete expense",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Expense not found"
                });
            }

            res.status(200).json({
                message: "Expense deleted successfully"
            });
        }
    );
};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};