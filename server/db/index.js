const mysql = require('mysql')

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'juejin',
  charset: 'utf8mb4'
})

module.exports = db
