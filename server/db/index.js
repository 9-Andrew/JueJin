const mysql = require('mysql')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'juejin',
  charset: 'utf8mb4'
})

module.exports = db
