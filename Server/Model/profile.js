import pool from "../config/db.js";

const insertProfile = async (userId, firstName, lastName, username, phone, email, image) => {
        const query = `
        UPDATE users 
        SET first_name = $1, last_name = $2, username = $3, phone = $4, email = $5, image = $6
        WHERE id = $7
        RETURNING *
    `;

    const { rows } = await pool.query(query, [
        firstName,
        lastName,
        username,
        phone,
        email,
        image,
        userId
    ])

    return rows[0];
}
export default insertProfile;