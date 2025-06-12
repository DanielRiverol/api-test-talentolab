import mysql from "mysql2/promise";
import { envs } from "../config/envs.js";
const { database } = envs;

// const pool = mysql.createPool({
//   host: database.db_host,
//   user: database.db_user,
//   password: database.db_password,
//   database: database.db_name,
//   waitForConnections: true,
//   connectionLimit: 5,
//   queueLimit: 0,
// });
const pool = mysql.createPool(database.db_url);
export default pool;
