import pool from "../config/db.js";

const fetchBalance = async (userId) => {
    const query = `SELECT balance from users WHERE id = $1`

    const { rows } = await pool.query(query, [userId]);

    return rows[0];
}

export default fetchBalance;