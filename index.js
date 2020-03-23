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

app.post("/api/users/login", async (req, res) => {
  console.log(req.body);

  var r;
  await con.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [req.body.email, req.body.password],
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.send({ status: "false" });
      } else {
        if (result.length === 0) return res.send({ status: "false" });
        else {
          r = result[0];
          delete r.password;
          delete r.DOB;
          delete r.registered_on;
          delete r.email;
          delete r.address;
          r.status = "true";
        }
      }
    }
  );
  await con.query("SELECT COUNT(*) FROM helmets", (err, result) => {
    if (err) {
      console.log("Error:", err);
      return res.send({ status: "false" });
    } else {
      r.total_helmets = result[0]["COUNT(*)"];
    }
  });
  await con.query(
    "SELECT COUNT(*) FROM helmets WHERE availability=1",
    (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.send({ status: "false" });
      } else {
        r.available_helmets = result[0]["COUNT(*)"];
        return res.send(r);
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
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now();
  con.query(
    "INSERT INTO banks(bank_id, location, manager) VALUES(?, ?, ?)",
    [uniqid, req.body.location, req.body.manager],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send({ status: "false" });
      } else return res.send({ status: "true" });
    }
  );
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

app.post("/api/helmets/add", (req, res) => {
  console.log(req.body);
  con.query(
    "INSERT INTO helmets(helmet_no, bank) VALUES(?, ?)",
    [req.body.helmet_no, req.body.bank],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send({ status: "false" });
      } else return res.send({ status: "true" });
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log("Listening on port", port));
