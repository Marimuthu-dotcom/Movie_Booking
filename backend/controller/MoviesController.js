const db = require("../config/db");

exports.getUsers = (req, res) => {
  console.log("API HIT AAGUDHU");
  const sql = "SELECT * FROM movies";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
};

exports.getCurrMovie=(req,res)=>{
  const sql=`SELECT * FROM movies 
  WHERE CURDATE() BETWEEN start_date AND end_date`; 

  db.query(sql,(err,result)=>{
    if(err){
      res.status(500).json(err);}
    else{
      res.json(result);}
  });
};

