import express from "express";
import pool from "../config/db.js"; // Import pool for database operations
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
      INSERT INTO transactions (sender_id, receiver_id, amount, status, note, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING id, created_at
    `;
    
    const transactionResult = await pool.query(transactionQuery, [
      senderWallet.id,
      receiverWallet.id,
      parseFloat(amount),
      'completed',
      `Transfer from ${senderEmail} to ${receiverIdentifier}`
    ]);
    
    const transaction = transactionResult.rows[0];

    // Get Socket.IO instance and emit notifications
    const io = req.app.get('io');
    
    if (io) {
      // Emit to receiver's room
      io.to(receiverIdentifier).emit('transaction', {
        type: 'received',
        message: `You received ${amount} from ${senderWallet.first_name} ${senderWallet.last_name}!`,
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

export default router;