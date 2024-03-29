require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://studentregistration-production.up.railway.app',
  credentials: true // Allow credentials (cookies)
}));

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'viaduct.proxy.rlwy.net',
  user: 'root',
  password: 'DDCF1ed2h45BAB6G4gEBEFbchddGhh4d',
  database: 'railway',
  port: '21831'
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
  const { email, password } = req.body;
  const sql = 'SELECT student_ID, email, password FROM Student WHERE email = ? AND password = ?';
  pool.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      if (results.length > 0){
        const userId = results[0].student_ID;
        res.cookie('user_id', JSON.stringify(userId), { httpOnly: false, domain: '.up.railway.app' });
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
  const sql = 'SELECT * FROM Course';
  pool.query(sql, (err, results) => {
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
  const sql2 = 'INSERT INTO Schedule (fk_student_ID,fk_course_ID) VALUES (?, ?)';
  const sql = 'INSERT INTO Enrollment (student_ID, course_ID, grade, status) VALUES (?, ?, ?, ?)';
  pool.query(sql, [id, courseID, grade, status], (err, results1) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      pool.query(sql2, [id, courseID], (err, results2) => {
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
const sql = 'SELECT * FROM Enrollment e JOIN Course c ON e.course_ID = c.course_ID WHERE e.student_ID = ?';
  pool.query(sql,[id], (err, results1) => {
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
  const sql = 'SELECT * FROM Student WHERE student_ID = ?';
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
  const sql = 'SELECT * FROM Enrollment WHERE student_ID = ? AND course_ID = ?';
  const sql3 = 'DELETE FROM Schedule WHERE fk_student_ID = ? AND fk_course_ID = ?';
  const sql2 = 'DELETE FROM Enrollment WHERE enrollment_ID = ?';

  pool.query(sql, [id, courseID], (err, results1) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      if (results1.length === 0) {
        res.status(404).send('Enrollment not found');
      } else {
        const enrollmentID = results1[0].enrollment_ID;

        pool.query(sql3, [id, courseID], (err, results2) => {
          if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
          } else {
            pool.query(sql2, [enrollmentID], (err, results3) => {
              if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error executing query');
              } else {
                res.send(results3);
              }
            })
          }
        })
      }
    }
  })
})

// Create new user
app.post('/api/register', (req, res) => {
  const { FormData } = req.body;
  const sql = 'SELECT * FROM Student WHERE email = ?';
  pool.query(sql, [ FormData.email ], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    }
    if (results.length > 0){
         console.log("User exists!");
         res.send("User already exists!");
    }
    if (results.length < 1){
          const sql2 = 'INSERT INTO Student (first_name, email, password) VALUES (?, ?, ?)';
          pool.query(sql2, [FormData.fname, FormData.email, FormData.password], (err, results) => {
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
  const { fname, email, password } = req.body;  
  const { id } = req.params;
  const sql = 'UPDATE Student SET first_name = ?, email = ?, password = ? WHERE student_ID = ?';
  pool.query(sql, [fname, email, password, id], (err, result) => {
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
  const sql = 'DELETE FROM Student WHERE student_ID = ?';
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});

