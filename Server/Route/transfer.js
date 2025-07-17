import express from "express";
import pool from "../config/db.js";
import findWalletByEmailOrPhone from "../Model/transfer.js"

const router = express.Router();


router.post("/transactions/send", async (req, res) => {
  const { senderEmail, receiverIdentifier, amount } = req.body;
  
  try {
    if (!senderEmail || !receiverIdentifier || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sender email, receiver identifier, and amount'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const senderWallet = await findWalletByEmailOrPhone(senderEmail);
    const receiverWallet = await findWalletByEmailOrPhone(receiverIdentifier);


    if (!senderWallet) {
      return res.status(404).json({
        success: false,
        message: 'Sender wallet not found'
      });
    }
   
    if (!receiverWallet) {
      return res.status(404).json({
        success: false,
        message: 'Receiver wallet not found'
      });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

  
    if (senderWallet.id === receiverWallet.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer to same wallet'
      });
    }


    const originalSenderBalance = senderWallet.balance;
    const originalReceiverBalance = receiverWallet.balance;


    senderWallet.balance = parseFloat(senderWallet.balance) - parseFloat(amount);
    receiverWallet.balance = parseFloat(receiverWallet.balance) + parseFloat(amount);

  
    await senderWallet.save();
    await receiverWallet.save();

   
    const transactionQuery = `
      INSERT INTO transactions (sender_id, receiver_id, amount, status, note, sender_name, receiver_name, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING id, created_at
    `;
    
    const transactionResult = await pool.query(transactionQuery, [
      senderWallet.id,
      receiverWallet.id,
      parseFloat(amount),
      'completed',
      `Transfer from ${senderEmail} to ${receiverIdentifier}`,
      senderWallet.first_name + "" + senderWallet.last_name,
      receiverWallet.first_name + "" + receiverWallet.last_name
    ]);
    
    const transaction = transactionResult.rows[0];

    // Get Socket.IO instance and emit notifications
    const io = req.app.get('io');
    
    if (io) {
      // Emit to receiver's room
      io.to(receiverIdentifier).emit('transaction', {
        type: 'received',
        message: `You have received $${amount} from ${senderWallet.first_name} ${senderWallet.last_name}!`,
        amount: parseFloat(amount),
        newBalance: receiverWallet.balance,
        transactionId: transaction.id,
        timestamp: transaction.created_at
      });
      
      // Emit to sender's room for confirmation
      io.to(senderEmail).emit('transaction', {
        type: 'sent',
        message: `You sent ${amount} to ${receiverIdentifier}`,
        amount: parseFloat(amount),
        newBalance: senderWallet.balance,
        transactionId: transaction.id,
        timestamp: transaction.created_at
      });
      
      console.log(`Real-time notifications sent for transaction ${transaction.id}`);
    }


    res.status(200).json({
      success: true,
      message: "Money sent successfully!",
      transaction: {
        id: transaction.id,
        amount: parseFloat(amount),
        senderNewBalance: senderWallet.balance,
        receiverNewBalance: receiverWallet.balance,
        timestamp: transaction.created_at
      }
    });

  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Transfer failed. Please try again.'
    });
  }
});


router.post("/fetch-user/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId)
  console.log('User ID:', userId);
  console.log('Request body:', req.body);
  
  const { receiverIdentifier } = req.body;
  
  if (!receiverIdentifier) {
    return res.status(400).json({
      success: false,
      message: "Receiver identifier is required"
    });
  }
  
  try {
    let query;
    let params;
    
    // Check if receiverIdentifier is an email or phone number
    if (receiverIdentifier.includes('@')) {
      // It's an email
      query = `SELECT first_name, last_name, email FROM users WHERE email = $1`;
      params = [receiverIdentifier];
    } else {
      // It's a phone number
      query = `SELECT first_name, last_name, phone FROM users WHERE phone = $1`;
      params = [receiverIdentifier];
    }
    
    const result = await pool.query(query, params);
    
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
    
    console.log("Result:", result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({
      success: false,
      message: "Database Error",
      error: error.message
    });
  }
});



router.get("/transactions/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  console.log(userId);

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