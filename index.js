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

function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now();
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + uniqid;
}

app.post("/api/users/register", (req, res) => {
  console.log(req.body);
  con.query(
    "INSERT INTO users(phone, name, password, email) values (?, ?, ?, ?)",
    [req.body.phone, req.body.name, req.body.password, req.body.email],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.send({ status: "false" });
      }
      console.log("Result", result);
      return res.send({ status: "true" });
    }
  );
});

app.post("/api/users/login", (req, res) => {
  console.log(req.body);
  con.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [req.body.email, req.body.password],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.send({ status: "false" });
      } else {
        console.log("Result", result);
        if (result.length === 0) return res.send({ status: "false" });
        else {
          var r = result[0];
          r.status = "true";
          return res.send(r);
        }
      }
    }
  );
});

app.post("/api/users/guest", (req, res) => {
  console.log(req.body);
  con.query(
    "INSERT INTO guests(phone, name, email) values (?, ?, ?)",
    [req.body.phone, req.body.name, req.body.email],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        if (err.code === "ER_DUP_ENTRY") return res.send({ status: "true" });
        return res.send({ status: "false" });
      }
      console.log("Result", result);
      return res.send({ status: "true" });
    }
  );
});

app.post("/api/managers/register", (req, res) => {
  console.log(req.body);
  con.query(
    "INSERT INTO managers(phone, name, password, email) values (?, ?, ?, ?)",
    [req.body.phone, req.body.name, req.body.password, req.body.email],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.send({ status: "false" });
      }
      console.log("Result", result);
      return res.send({ status: "true" });
    }
  );
});

app.post("/api/managers/login", (req, res) => {
  console.log(req.body);
  con.query(
    "SELECT * FROM managers WHERE email=? AND password=?",
    [req.body.email, req.body.password],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.send({ status: "false" });
      }
      console.log("Result", result);
      if (result.length === 0) return res.send({ status: "false" });
      else return res.send({ status: "true" });
    }
  );
});

app.post("/api/banks/create", (req, res) => {
  console.log(req.body);
  con.query(
    "INSERT INTO banks(bank_id, location, manager) VALUES(?, ?, ?, ?, ?)",
    [
      guidGenerator(),
      req.body.location,
      req.body.total_helmets,
      req.body.available_helmets,
      req.body.manager
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send({ status: "false" });
      } else return res.send({ status: "true" });
    }
  );
  return res.send(guidGenerator());
});

app.post("/api/banks/edit", (req, res) => {
  console.log(req.body);
  let a = " VALUES(?";
  for (let i = 1; i < req.body.columns.length; i++) {
    a = a + "," + "?";
  }
  a = a + ");";
  let q = "UPDATE banks SET ";
  for (let x in req.body.columns) {
    if (x === "0") q = q + req.body.columns[x];
    else q = q + "," + req.body.columns[x];
  }
  con.query(q + a, req.body.values, (err, result) => {
    if (err) {
      console.log(err);
      return res.send({ status: "false" });
    } else return res.send({ status: "true" });
  });
  return res.send(q + a);
});

// app.post("/api/helmets/add", (req, res) => {
//   console.log(req.body);
//   con.query(
//     "INSERT INTO helmets VALUES"
//   )

// })

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log("Listening on port", port));
