const mysql=require('mysql')

const db=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'root',
  database:'juejin'
})

module.exports=db