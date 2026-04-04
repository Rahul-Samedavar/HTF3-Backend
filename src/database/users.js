import bcrypt from "bcrypt";
import { pool } from "./db.js";

// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     email TEXT UNIQUE NOT NULL,
//     password_hash TEXT NOT NULL,
//     username TEXT NOT NULL,
//     phone TEXT,
//     gender TEXT,
//     location TEXT,
//     bio TEXT,
//     college TEXT,
//     department TEXT,
//     year INTEGER,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );


// this creates bare user without profile details. i mean signup
// returns id if new created , -1 if email already taken
export async function createUser(email, password, username) {

    email = email.toLowerCase().trim();

    try {
        if (await getUserByEmail(email)) return -1;
        const hash_pass = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (email, password_hash, username)
            VALUES ($1, $2, $3)
            RETURNING id, email`
            ,
            [email, hash_pass, username]
        );

        return result.rows[0]?.id;
    }

    catch (err) {
        console.error("Error adding user: ", err);
        throw err
  }
}


// returns undefined is user not found
export async function getUserByEmail(email) {

    email = email.toLowerCase().trim();

    try {
        const result = await pool.query(
            `SELECT *
            FROM users 
            WHERE email= $1`
            ,
            [email]
        );

        return result.rows[0];
    }

    catch (err) {
        console.error("Error gettingUserByEmail: ", err);
        throw err
  }
}


// returns undefined if userNotFound
export async function getUserByID(id) {
    try {
        const result = await pool.query(
            `SELECT * 
            FROM users 
            WHERE id= $1`
            ,
            [id]
        );

        return result.rows[0];
    }

    catch (err) {
        console.error("Error gettingUserByID: ", err);
        throw err
  }
}

// returns true if password was updated
export async function resetPassword(email, new_password) {

    email = email.toLowerCase().trim();
    try {
        const hash_pass = await bcrypt.hash(new_password, 10);

        const result = await pool.query(
            `UPDATE users
             SET password_hash = $1
             WHERE email = $2`,
            [hash_pass, email]
        );

        return result.rowCount === 1;
    } catch (err) {
        console.error("Error resetting password: ", err);
        throw err;
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

// raises error If userNot Found
// Otherwise it returns user object
export async function updateDetails(id, updates) {
    try {
        const userExists = await getUserByID(id);
        if (!userExists) {
            throw new Error(`User with ID ${id} not found.`);
        }

        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined && value !== "") {
                fields.push(`${key} = $${index}`);
                values.push(value);
                index++;
            }
        }

        if (fields.length === 0) {
            throw new Error("No valid fields provided for update.");
        }

        const query = `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING *
        `;

        values.push(id);

        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (err) {
        console.error("Error updating user details: ", err);
        throw err;
    }
}

export async function  deleteUser(email) {
    try{
        if (!email) return {success: false, error: "email hakri anna"}

        if (email == "awatelaxman2005@gmail.com" | email == "mayurdharwadkar39@gmail.com"  | email == "prateeknerli@gmail.com" | email == "funbothindi@gmail.com"){

            const result = await pool.query(
                "DELETE FROM users WHERE email=$1;",
                [email]
            );

            return {success: true, count: result.rowCount}
        }
        else return {success: false, error: "Only testers emails are allowed"}
    }
    catch(err){
        console.error("Error Deleting user", err);
        return {"success": false, error: `Internal Server Errror: ${err}`}
    }
}