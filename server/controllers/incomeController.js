const Income = require("../models/incomeModel");

const addIncome = (req, res) => {

    const user_id = req.user.user_id;

    const {
        category_id,
        amount,
        description,
        transaction_date
    } = req.body;

    if (!category_id || !amount || !transaction_date) {
        return res.status(400).json({
            message: "Required fields are missing"
        });
    }

    Income.addIncome(
        {
            user_id,
            category_id,
            amount,
            description,
            transaction_date
        },
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to add income",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Income Added Successfully"
            });

        }
    );

};

const getAllIncome = (req, res) => {

    const user_id = req.user.user_id;

    Income.getAllIncome(user_id, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to fetch income"
            });
        }

        res.status(200).json(result);

    });

};

module.exports = {
    addIncome,
    getAllIncome
};