const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { pool } = require("./pool/dbConnection");
const port = process.env.PORT || 3000;
const app = express();
const LocalStrategy = require("passport-local").Strategy;

app.use(express.json());

//1. GET which returns all users
app
  .route("/allusers")
  .get((req, res) => {
    pool.query("SELECT  * FROM users", (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  })

  //2. POST create a new user

  //app.route('/newuser')
  .post((req, res) => {
    const { first_name, email, password } = req.body;

    //פה לעשות וולידציה בסוף
    if (!user.name || !user.email) {
      return res
        .sendStatus(400)
        .json({ msg: " do not forget to include a name and email" });
    }
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;

        //the way to insert a new user to the database
        pool.query(
          "INSERT INTO users(first_name,email,password) VALUES(?,?,?) ",
          [email, hash],
          (err, results, fields) => {
            if (err.code === "ER_DUP_ENTRY") {
              res
                .status(500)
                .json({ success: false, message: "Email already exitst" });
            }
            res.json({ success: true, user: results.insertId });
          }
        );
      });
    });
  });

//תופס שגיאות
app.use((err, req, res, next) => {
  if (err) return res.sendStatus(500);
  next();
});

//3.post/login הזדהות עם מייל וסיסמא

app.route("/login").post((req, res) => {
  const { email, password } = req.body;
  //פה עושים ולידציה למה שהמשתמש מכניס
  pool.query(
    "SELECT id,password FROM users WHERE email=?",
    email,
    (err, results, fields) => {
      if (err) throw err;
      if (results.length) {
        const { id, password: hash } = results.pop();
        bcrypt.compare(password, hash, (err, isEqual) => {
          if (err) throw err;
          if (isEqual) {
            res.json({ success: true, user: results[0].id });
          } else {
            res.sendStatus(401);
          }
        });
      }
      res.sendStatus(401);
    }
  );
});
app.use((err, req, res, next) => {
  if (err) return res.sendStatus(500);
  next();
});

//4.GET/account
//דף שרק משתמשים מזוהים יכולים להיכנס אליו

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));
app.route("/form").get((req, res) => {
  res.send(`
<html>
<head>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
<link rel="stylesheet" type="text/css" href="css/style.css" />
<body>
<h1 class ="text-center mb-3">{{title}}</h1>
<form action="" method="POST" action ="/form" class="mb-4">
<div class ="form-group">
<label for ="name">Name</label>
<input type ="text" name="name" class="form-control"   placeholder="Enter your Name">
</div>
<div class ="form-group">
<label for ="email">Email</label>
<input type ="text" name="email" class="form-control"  placeholder="Enter your Email">
</div>

<div class ="form-group">
<label for ="phone">Phone</label>
<input type ="text" name="phone" class="form-control" placeholder="Enter your Phone">
</div>
<input type ="submit" value="submit" class="btn btn-danger btn-block">
</form>
<form>
</form>
</body>
</head>
</html>
`);
});

//לא לשכוח ולידציה

app.route("/account").get((req, res) => {
  res.send(`
        <html>
        <head>
        </head>
        <body>
        <h1>Form Submitted</h1>
        </body>
        </html>

        
        `);
});

app.listen(port, () => console.log(`Server started on port ${port}`));
