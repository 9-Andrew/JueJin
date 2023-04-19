const db=require('../db/index')

exports.login=(req,res)=>{
  db.query('select 1', (err, results) => {
    if (err) return console.log(err.message)
    console.log(results)
  })
  res.send('1')
}