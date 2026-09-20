import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();

router.post("/transactions/send", verifyToken, async (req, res) => {
  const senderId = req.user.id;
  const { receiverIdentifier, amount } = req.body;
  const numericAmount = Number(amount);

  if (!receiverIdentifier || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a receiver identifier and amount'
    });
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a valid number greater than 0'
    });
  }

  // Guard against float noise (e.g. 10.005) — round to the cent.
  const transferAmount = Math.round(numericAmount * 100) / 100;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Lock both rows for the duration of the transaction, in a fixed order
    // (by id) so two concurrent transfers between the same two accounts
    // can't deadlock each other.
    const { rows: participants } = await client.query(
      `SELECT id, first_name, last_name, email, phone, balance
       FROM users
       WHERE id = $1 OR email = $2 OR phone = $2
       ORDER BY id
       FOR UPDATE`,
      [senderId, receiverIdentifier]
    );

    const senderWallet = participants.find((u) => u.id === senderId);
    const receiverWallet = participants.find(
      (u) => u.id !== senderId && (u.email === receiverIdentifier || u.phone === receiverIdentifier)
    );

    if (!senderWallet) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Sender wallet not found' });
    }

    if (!receiverWallet) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Receiver wallet not found' });
    }

    if (senderWallet.id === receiverWallet.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Cannot transfer to your own wallet' });
    }

    if (Number(senderWallet.balance) < transferAmount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const newSenderBalance = Number(senderWallet.balance) - transferAmount;
    const newReceiverBalance = Number(receiverWallet.balance) + transferAmount;

    await client.query('UPDATE users SET balance = $1 WHERE id = $2', [newSenderBalance, senderWallet.id]);
    await client.query('UPDATE users SET balance = $1 WHERE id = $2', [newReceiverBalance, receiverWallet.id]);

    const { rows: transactionRows } = await client.query(
      `INSERT INTO transactions (sender_id, receiver_id, amount, status, note, sender_name, receiver_name, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       RETURNING id, created_at`,
      [
        senderWallet.id,
        receiverWallet.id,
        transferAmount,
        'completed',
        `Transfer from ${senderWallet.email} to ${receiverIdentifier}`,
        `${senderWallet.first_name} ${senderWallet.last_name}`,
        `${receiverWallet.first_name} ${receiverWallet.last_name}`
      ]
    );

    await client.query('COMMIT');

    const transaction = transactionRows[0];

    const io = req.app.get('io');
    if (io) {
      io.to(receiverIdentifier).emit('transaction', {
        type: 'received',
        message: `You have received $${transferAmount} from ${senderWallet.first_name} ${senderWallet.last_name}!`,
        amount: transferAmount,
        newBalance: newReceiverBalance,
        transactionId: transaction.id,
        timestamp: transaction.created_at
      });

      io.to(senderWallet.email).emit('transaction', {
        type: 'sent',
        message: `You sent $${transferAmount} to ${receiverIdentifier}`,
        amount: transferAmount,
        newBalance: newSenderBalance,
        transactionId: transaction.id,
        timestamp: transaction.created_at
      });
    }

    res.status(200).json({
      success: true,
      message: "Money sent successfully!",
      transaction: {
        id: transaction.id,
        amount: transferAmount,
        senderNewBalance: newSenderBalance,
        receiverNewBalance: newReceiverBalance,
        timestamp: transaction.created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Transfer failed. Please try again.'
    });
  } finally {
    client.release();
  }
});


router.get("/transactions/:userId", verifyToken, async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (req.user.id !== userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        t.*,
        s.username AS sender_name,
        r.username AS receiver_name
      FROM transactions t
      JOIN users s ON t.sender_id = s.id
      JOIN users r ON t.receiver_id = r.id
      WHERE t.sender_id = $1 OR t.receiver_id = $1
      ORDER BY t.created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
