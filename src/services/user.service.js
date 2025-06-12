import pool from "../config/database.js";

export const getUsers = async () => {
  return pool.query("SELECT * from users");
};
