const db = require("../config/db");

const getDashboard = (req, res) => {

    const user_id = req.user.user_id;

    // Current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

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
            ) AS total_expense,

            COALESCE(
                SUM(
                    CASE
                        WHEN transaction_type = 'Expense'
                        AND MONTH(transaction_date) = ?
                        AND YEAR(transaction_date) = ?
                        THEN amount
                        ELSE 0
                    END
                ), 0
            ) AS monthly_expense

        FROM transactions

        WHERE user_id = ?
    `;

    db.query(
        sql,
        [currentMonth, currentYear, user_id],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to load dashboard",
                    error: err.message
                });
            }

            const totalIncome =
                parseFloat(results[0].total_income);

            const totalExpense =
                parseFloat(results[0].total_expense);

            const monthlyExpense =
                parseFloat(results[0].monthly_expense);

            const balance =
                totalIncome - totalExpense;


            // Get current month's budget
            const budgetSql = `
                SELECT monthly_budget
                FROM budgets
                WHERE user_id = ?
                AND month = ?
                AND year = ?
                LIMIT 1
            `;

            db.query(
                budgetSql,
                [user_id, currentMonth, currentYear],
                (budgetErr, budgetResults) => {

                    if (budgetErr) {
                        console.error(budgetErr);

                        return res.status(500).json({
                            message: "Failed to load budget",
                            error: budgetErr.message
                        });
                    }

                    const monthlyBudget =
                        budgetResults.length > 0
                            ? parseFloat(
                                budgetResults[0].monthly_budget
                            )
                            : 0;

                    const remainingBudget =
                        monthlyBudget - monthlyExpense;

                    const budgetUsage =
                        monthlyBudget > 0
                            ? (monthlyExpense / monthlyBudget) * 100
                            : 0;


                    res.status(200).json({

                        total_income: totalIncome,

                        total_expense: totalExpense,

                        balance: balance,

                        monthly_budget: monthlyBudget,

                        monthly_expense: monthlyExpense,

                        remaining_budget: remainingBudget,

                        budget_usage_percentage:
                            Number(budgetUsage.toFixed(2))

                    });

                }
            );
        }
    );
};

module.exports = {
    getDashboard
};