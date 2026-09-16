// Shared MySQL connection, configured through environment variables (see .env.example)
require("dotenv").config()
const sql = require("mysql2")

const conn = sql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "myfoundation",
})

conn.connect((err) => {
    if (err) console.log("database not connected", err.message)
    else console.log("database connected")
})

module.exports = conn
