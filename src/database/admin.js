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
            `SELECT *
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
            `SELECT *
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


export async function getAllData() {
    try{
        const users = await pool.query("SELECT * FROM users");
        users.rows.forEach(x => delete x.password_hash)

        const teams = await pool.query("SELECT * from teams");
        const team_members = await pool.query("SELECT * from team_members");
        const submissions = await pool.query("SELECT * from submissions");

        return {success: true, data : {
                users: users.rows,
                teams: teams.rows,
                team_members: team_members.rows,
                submissions: submissions.rows
            }}

    }

    catch(err){
        console.error("Error Getting All data", err);
        return {"success": false, error: `Internal Server Errror: ${err}`}
    }
}