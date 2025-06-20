import { config } from "dotenv";
config();

export const envs = {
  port: process.env.PORT || 3000,
  database: {
    db_user: process.env.DB_USER,
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    db_port: process.env.DB_PORT,
    db_password: process.env.DB_PASSWORD,
    db_url:process.env.DB_URL
  },
};
