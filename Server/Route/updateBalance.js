import express from "express"
import fetchBalance from "../Model/fetchBalance.js";

const router = express.Router();

router.get("/balance/:userId", async (req, res) => {
    try {
    const userId = parseInt(req.params.userId);
    console.log(userId);

    const user = await fetchBalance(userId);
    console.log("User Balance:", user.balance)

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