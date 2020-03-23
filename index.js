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
  if (err) console.log("Error:", err);
  console.log("Connected!");
});

app.use(express.json());

app.post("/api/users/register", async (req, res) => {
  console.log(req.body);
  con.query(
    "INSERT INTO users(phone, name, password, email) values (?, ?, ?, ?)",
    [req.body.phone, req.body.name, req.body.password, req.body.email],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.status(400).send(false);
      }
      console.log("Result", result);
      return res.status(200).send(true);
    }
  );
});

app.post("/api/users/login", async (req, res) => {
  console.log(req.body);
  con.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [req.body.email, req.body.password],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.status(400).send(false);
      } else {
        console.log("Result", result);
        if (result.length === 0) return res.status(400).send(false);
        else return res.status(200).send(true);
      }
    }
  );
});

app.post("/api/users/guest", async (req, res) => {
  console.log(req.body);
  con.query(
    "INSERT INTO guests(phone, name, email) values (?, ?, ?)",
    [req.body.phone, req.body.name, req.body.email],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        if (err.code === "ER_DUP_ENTRY") return res.status(200).send(true);
        return res.status(400).send(false);
      }
      console.log("Result", result);
      return res.status(200).send(true);
    }
  );
});

app.post("/api/managers/register", async (req, res) => {
  console.log(req.body);
  con.query(
    "INSERT INTO managers(phone, name, password, email) values (?, ?, ?, ?)",
    [req.body.phone, req.body.name, req.body.password, req.body.email],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.status(400).send(false);
      }
      console.log("Result", result);
      return res.status(200).send(true);
    }
  );
});

app.post("/api/managers/login", async (req, res) => {
  console.log(req.body);
  con.query(
    "SELECT * FROM managers WHERE email=? AND password=?",
    [req.body.email, req.body.password],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.status(400).send(false);
      }
      console.log("Result", result);
      if (result.length === 0) return res.status(400).send(false);
      else return res.status(200).send(true);
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log("Listening on port", port));
