require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PW,
  database: process.env.DB,
  port: process.env.MYSQLPORT,
});

app.get("/test", (req,res)=>{
  res.json("Hello from backend!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// login match
app.post("/stud", (req, res) => {
  const user_Id = req.cookies.user_id;
  const { email, password } = req.body;
  const sql = 'SELECT studentID, email, password FROM student WHERE email = ? AND password = ?';
  pool.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      if (results.length > 0){
         res.cookie('user_id', JSON.stringify(results[0].student_ID),{ httpOnly: false });
         console.log("user_id cookie:", req.cookies.user_id);
         res.send(true);
      }
      else{
        res.send("Incorrect email or password.");
      }
    }
  });
});

// Get all courses
app.get('/dashboard', (req, res) => {
  const sql = 'SELECT * FROM course';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      res.json(results);
      console.log(results);
    }
  });
});

// enroll courses
app.post('/api/enroll/:id/:courseID', (req, res) => {
  const grade = 'Graded';
  const status = 'Enrolled';
  const { id, courseID } = req.params;
  const sql2 = 'INSERT INTO schedule (fk_studentID,fk_course_ID) VALUES (?, ?)';
  const sql = 'INSERT INTO enrollment (studentID, courseID, grade, status) VALUES (?, ?, ?, ?)';
  connection.query(sql, [id, courseID, grade, status], (err, results1) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      connection.query(sql2, [id, courseID], (err, results2) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Error executing query');
        } else {
           res.send(results2);
        }
      })
    }
  })
})

// Get enrollment
app.get('/api/enrollment/:id', (req, res) => {
const {id} = req.params;
const sql = 'SELECT * FROM enrollment e JOIN course c ON e.course_ID = c.course_ID WHERE e.studentID = ?';
  connection.query(sql,[id], (err, results1) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
        res.send(results1);
    }
  })
})

// Get user by ID
app.get('/api/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM student WHERE studentID = ?';
  pool.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).send('Error executing query');
    } else {
      res.send(results);
    }
  })
})

// unenroll course
app.delete('/api/unenroll/:id/:courseID', (req, res) => {
  const { id, courseID } = req.params;
  const sql = 'SELECT * FROM enrollment WHERE studentID = ? AND courseID = ?';
  const sql3 = 'DELETE FROM schedule WHERE fk_studentID = ? AND fk_courseID = ?';
  const sql2 = 'DELETE FROM enrollment WHERE enrollmentID = ?';
  connection.query(sql, [id, courseID], (err, results1) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      const enrollmentID = results1[0].enrollmentID;
      connection.query(sql3, [id, courseID], (err, results2) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Error executing query');
        } else {
          connection.query(sql2, [enrollmentID], (err, results3) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Error executing query');
            } else {
              //console.log(results3);
              res.send(results3);
            }
          })
        }
      })
    }
  })
})


// Create new user
app.post('/api/register', (req, res) => {
  const { email,fname,lname,address,pnumber,dob, password } = req.body;
  const sql = 'SELECT * FROM student WHERE email = ?';
  connection.query(sql, [ email ], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    }
    if (results.length > 0){
         console.log("User exists!");
         res.send("User already exists!");
    }
    if (results.length < 1){
          const sql2 = 'INSERT INTO student (firstName, lastName, address, phoneNumber, email, dateOfBirth, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
          connection.query(sql2, [fname, lname, address, pnumber, email, dob, password], (err, results) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Error executing query');
            } else {
              res.send("Account created!");
            }
        });
     }
  });
});

// Update User
app.put('/api/update_user/:id', (req, res) => {
  const { fname, lname, address, pnumber, email, dob, password } = req.body;  
  const { id } = req.params;
  const sql = 'UPDATE student SET firstName = ?, lastName = ?, address = ?, phoneNumber = ?, email = ?, dateOfBirth = ?, password = ? WHERE studentID = ?';
  connection.query(sql, [fname, lname, address, pnumber, email, dob, password, id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      res.send("Profile updated successfully");
    }
  });
});

// Delete User
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM student WHERE studentID = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});

