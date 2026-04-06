import pkg from "pg";
import dotenv from "dotenv";
import fs from 'fs';

dotenv.config();

const id_prod = process.env.PROD || false

const { Pool } = pkg;


export const pool = new Pool({
  connectionString: process.env.DATABASE_URL_MAIN || process.env.DATABASE_URL_MAIN ,
  
  ssl: 
    id_prod ?
      {
        rejectUnauthorized: false,
        ca: fs.readFileSync('./ca-certificate.crt')
      } 
    : 
      {
        rejectUnauthorized: false,
      },
});

if (id_prod){
  pool.on("connect", (client) => {
    client.query("SET search_path TO htf, public");
  });

  const res = await pool.query(`
    SELECT current_database(), current_user, inet_server_addr();
  `);
  console.log(res.rows);
}
