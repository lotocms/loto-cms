//mysql配置
let debug = process.env.DB_DEBUG === "false" ? false : true;
export const db = [
  {
    key: "DB_PRIMARY",
    client: process.env.DB_CLIENT || "mysql2",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "123456",
    database: process.env.DB_DATABASE || "chancms",
    port: process.env.DB_PORT || "3306",
    max: parseInt(process.env.DB_POOL_MAX || 10),
    min: parseInt(process.env.DB_POOL_MIN || 5),
    debug: debug,
    filename: process.env.DB_FILENAME || "",
  },
  {
    key: "DB_SYSTEM",
    client: process.env.SYSDB_CLIENT || "mysql2",
    host: process.env.SYSDB_HOST || "localhost",
    user: process.env.SYSDB_USER || "root",
    password: process.env.SYSDB_PASS || "root123",
    database: process.env.SYSDB_DATABASE || "loto-sysdb",
    port: process.env.SYSDB_PORT || "3306",
    max: parseInt(process.env.DB_POOL_MAX || 2),
    min: parseInt(process.env.DB_POOL_MIN || 0),
    debug: debug,
    filename: process.env.DB_FILENAME || "",
  },
];

export default {
  db,
};
