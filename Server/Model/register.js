import pool from "../config/db.js";

const registerModel = async (firstName, lastName, email, password, phone, username) => {

    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const userExists = await pool.query(checkUserQuery, [email]);
    
    if (userExists.rows.length > 0) {
        throw new Error('User already exists');
    }

const query = 
    `INSERT INTO users (first_name, last_name, email, password, phone, username)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`;

       const { rows } = await pool.query(query, [
        firstName,
        lastName,
        email,
        password,
        phone,
        username
       ])

       return rows[0]
}

export default registerModel;
