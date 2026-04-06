import pkg from "pg";
import dotenv from "dotenv";
import fs from 'fs';

dotenv.config();

const is_pord = process.env.PROD || false

const { Pool } = pkg;


export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  ssl: 
    is_pord ?
      {
        rejectUnauthorized: false,
        ca: fs.readFileSync('./ca-certificate.crt')
      } 
    : 
      {
        rejectUnauthorized: false,
      },
});

pool.on("connect", (client) => {
  client.query("SET search_path TO htf, public");
});

const res = await pool.query(`SELECT schemaname, tablename 
FROM pg_tables 
WHERE tablename = 'users';`);
console.log(res.rows);