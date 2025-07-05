import pool from "../config/db.js"

const loginRoute = async (email) => {

    const query = 
      `SELECT * FROM users WHERE email = $1`;

      const {rows} = await pool.query(query, [email])

      return rows[0] || null

}
export default loginRoute;