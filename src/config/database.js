import mysql from "mysql2/promise";
import { envs } from "../config/envs.js";
const { database } = envs;

const pool = mysql.createPool(database.db_url);
export default pool;
