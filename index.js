const express = require("express");
const mysql = require("mysql");

const app = express();

const con = mysql.createConnection({
  host: "remotemysql.com",
  port: "3306",
  user: "6eaWCxFbZO",
  password: "v5UJK2vkSY",
  database: "6eaWCxFbZO"
});

con.connect(err => {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.json());

app.post("/api/users/register", async (req, res) => {
  console.log(req.body);
  await con.query(
    "INSERT INTO users(phone, name, password, DOB, email, s3_link) values (?, ?, ?, ?, ?, ?)",
    [req.body.phone, req.body.name, req.body.password, req.body.DOB, req.body.email, req.body.s3_link],
    (err, result) => {
      if (err) console.log("Error:", err);
      console.log("Result", result);
    }
  );
  res.send("You request is recieved");
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log("Listening on port", port));
