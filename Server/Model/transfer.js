import pool from "../config/db.js"

const findWalletByEmailOrPhone = async (identifier) => {
    try {
        const query = `
            SELECT id, first_name, last_name, email, phone, username, balance
            FROM users 
            WHERE (email = $1 OR phone = $1)
            LIMIT 1
        `;
        
        const { rows } = await pool.query(query, [identifier]);
        
        if (rows.length === 0) {
            return null;
        }
        
        const wallet = rows[0];
        
        // Add save method to update the wallet balance
        wallet.save = async function() {
            const updateQuery = `
                UPDATE users 
                SET balance = $1
                WHERE id = $2
            `;
            await pool.query(updateQuery, [this.balance, this.id]);
        };
        
        return wallet;
        
    } catch (error) {
        console.error('Error finding wallet:', error);
        throw error;
    }
};

export default findWalletByEmailOrPhone;