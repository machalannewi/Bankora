import express from "express"
import pool from "../config/db.js";
import fetchBalance from "../Model/fetchBalance.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();

// Look up a transfer recipient by email or phone, for the "send money" form's
// recipient-preview step. Lives under /api/user to match the client's existing
// call site (TransferMoney.jsx).
router.post("/fetch-user/:userId", verifyToken, async (req, res) => {
  const { receiverIdentifier } = req.body;

  if (!receiverIdentifier) {
    return res.status(400).json({
      success: false,
      message: "Receiver identifier is required"
    });
  }

  try {
    const query = receiverIdentifier.includes('@')
      ? `SELECT first_name, last_name, email FROM users WHERE email = $1`
      : `SELECT first_name, last_name, phone FROM users WHERE phone = $1`;

    const result = await pool.query(query, [receiverIdentifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({
      success: false,
      message: "Database Error",
      error: error.message
    });
  }
});

router.get("/balance/:userId", verifyToken, async (req, res) => {
    try {
    const userId = parseInt(req.params.userId);

    if (req.user.id !== userId) {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const user = await fetchBalance(userId);

    if(!user) {
       return res.status(404).json({
        success: false,
        message: "Balance not found",
      });
    }


    res.status(200).json({
        success: true,
        message: "Balance Refreshed Successfully",
        balance: Number(user.balance)
    })
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
        success: false,
        message: "Error updating balance",
        error: error.message
    })
  }

})

export default router;