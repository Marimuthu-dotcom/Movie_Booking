const db = require("../config/db");

exports.addFav = (req, res) => {
  const { movie_name, img } = req.body;
  if (!movie_name || !img) 
    return res.status(400).json({ msg: "Missing data" });

  const sql = "INSERT INTO favmovies (movie_name, img) VALUES (?, ?)";
  db.query(sql, [movie_name, img], (err, result) => {
    if (err) 
      return res.status(500).json(err);
    res.json({ msg: "Favorite added" });
  });
};

exports.getFavMovies = (req, res) => {
  const sql = "SELECT * FROM favmovies";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.removeFav=(req,res)=>{
  const {movie_name}=req.params;
  const sql="DELETE FROM favmovies WHERE movie_name=?";
  db.query(sql,[movie_name],(err,result)=>{
    if(err)
      return res.status(500).json(err);
    res.json({msg:"Favorite Deleted"});
  })
}
