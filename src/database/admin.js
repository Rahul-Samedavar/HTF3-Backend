import bcrypt from "bcrypt";
import { pool } from "./db.js";

// CREATE TABLE admins (
//   id SERIAL PRIMARY KEY,
//   username TEXT NOT NULL UNIQUE,
//   password_hash TEXT NOT NULL,
//   role TEXT NOT NULL
// );

export async function getAdminByName(username) {

    username = username.toLowerCase().trim();

    try {
        const result = await pool.query(
            `SELECT id,username, role
            FROM admins 
            WHERE username= $1`
            ,
            [username]
        );

        return result.rows[0];
    }

    catch (err) {
        console.error("Error gettingAdminByEmail: ", err);
        throw err
  }
}


export async function getAdminByID(id) {
    try {
        const result = await pool.query(
            `SELECT id,username,role
            FROM admins 
            WHERE id= $1`
            ,
            [id]
        );

        return result.rows[0];
    }

    catch (err) {
        console.error("Error gettingAdminByID: ", err);
        throw err
  }
}



export async function verifyPassword(password, hash) {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (err) {
        console.error("Error verifying password: ", err);
        throw err;
    }
}
