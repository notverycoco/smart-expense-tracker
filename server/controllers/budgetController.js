const db = require("../config/db");

const addBudget = (req, res) => {
  const user_id = req.user.user_id;
  const { monthly_budget, month, year } = req.body;

  if (!monthly_budget || !month || !year) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = `
        INSERT INTO budgets
        (user_id, monthly_budget, month, year)
        VALUES (?, ?, ?, ?)
    `;

  db.query(sql, [user_id, monthly_budget, month, year], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create budget",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Budget created successfully",
      budget_id: result.insertId,
    });
  });
};

const getBudgets = (req, res) => {
  const user_id = req.user.user_id;

  const sql = `
        SELECT *
        FROM budgets
        WHERE user_id = ?
        ORDER BY year DESC, month DESC
    `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch budgets",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

const updateBudget = (req, res) => {
  const budget_id = req.params.id;
  const user_id = req.user.user_id;

  const { monthly_budget, month, year } = req.body;

  if (!monthly_budget || !month || !year) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = `
        UPDATE budgets
        SET monthly_budget = ?,
            month = ?,
            year = ?
        WHERE budget_id = ?
        AND user_id = ?
    `;

  db.query(
    sql,
    [monthly_budget, month, year, budget_id, user_id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to update budget",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Budget not found",
        });
      }

      res.status(200).json({
        message: "Budget updated successfully",
      });
    },
  );
};

const deleteBudget = (req, res) => {
  const budget_id = req.params.id;
  const user_id = req.user.user_id;

  const sql = `
        DELETE FROM budgets
        WHERE budget_id = ?
        AND user_id = ?
    `;

  db.query(sql, [budget_id, user_id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete budget",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    res.status(200).json({
      message: "Budget deleted successfully",
    });
  });
};

const getBudgetSummary = (req, res) => {
  const user_id = req.user.user_id;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({
      message: "Month and year are required",
    });
  }

  const sql = `
        SELECT
            b.monthly_budget AS budget,
            COALESCE(SUM(
                CASE
                    WHEN t.transaction_type = 'Expense'
                    THEN t.amount
                    ELSE 0
                END
            ), 0) AS spent
        FROM budgets b
        LEFT JOIN transactions t
            ON b.user_id = t.user_id
            AND MONTH(t.transaction_date) = b.month
            AND YEAR(t.transaction_date) = b.year
        WHERE b.user_id = ?
        AND b.month = ?
        AND b.year = ?
        GROUP BY b.budget_id, b.monthly_budget
    `;

  db.query(sql, [user_id, month, year], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to calculate budget summary",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Budget not found for this month",
      });
    }

    const budget = parseFloat(results[0].budget);
    const spent = parseFloat(results[0].spent);
    const remaining = budget - spent;
    const percentage = (spent / budget) * 100;

    let alert = null;

    if (spent > budget) {
      alert = "Alert: Your budget has been exceeded.";
    } else if (percentage >= 80) {
      alert = "Warning: You have used 80% or more of your budget.";
    }

    res.status(200).json({
      budget: budget,
      spent: spent,
      remaining: remaining,
      percentage_used: Number(percentage.toFixed(2)),
      status: spent > budget ? "Over Budget" : "Within Budget",
      alert: alert,
    });
  });
};

module.exports = {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
};
