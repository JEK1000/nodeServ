const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
//require('dotenv').config();
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
  origin: 'https://jkildare.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

//app.options('*', cors());

const connection = mysql.createConnection({
  host: '3.141.26.51',
  user: 'jason',
  password: 'Jaden0102!',
  database: 'mydb'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database!');
  }
});

app.get("/test", (req,res)=>{
  res.json("Hello from backend!");
});

const PORT = 443;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


// login match
app.post('/student_registration/stud', (req, res) => {
  const user_Id = req.cookies.user_id;
  const { FormData } = req.body;
  console.log(FormData);
  const sql = 'SELECT student_ID, email, password FROM mydb.Student WHERE email = ? AND password = ?';
  connection.query(sql, [ FormData.email, FormData.password], (err, results) => {
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
  const sql = 'SELECT * FROM mydb.Course';
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
  const sql2 = 'INSERT INTO mydb.Schedule (fk_student_ID,fk_course_ID) VALUES (?, ?)';
  const sql = 'INSERT INTO mydb.Enrollment (student_ID, course_ID, grade, status) VALUES (?, ?, ?, ?)';
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
const sql = 'SELECT * FROM mydb.Enrollment e JOIN mydb.Course c ON e.course_ID = c.course_ID WHERE e.student_ID = ?';
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
app.get('/student_registration/api/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM mydb.Student WHERE student_ID = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      res.send(results);
    }
  })
})

// unenroll course
app.delete('/api/unenroll/:id/:courseID', (req, res) => {
  const { id, courseID } = req.params;
  const sql = 'SELECT * FROM mydb.Enrollment WHERE student_ID = ? AND course_ID = ?';
  const sql3 = 'DELETE FROM mydb.Schedule WHERE fk_student_ID = ? AND fk_course_ID = ?';
  const sql2 = 'DELETE FROM mydb.Enrollment WHERE enrollment_ID = ?';
  connection.query(sql, [id, courseID], (err, results1) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      const enrollment_ID = results1[0].enrollment_ID;
      connection.query(sql3, [id, courseID], (err, results2) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Error executing query');
        } else {
          connection.query(sql2, [enrollment_ID], (err, results3) => {
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
  const { FormData } = req.body;
  const sql = 'SELECT * FROM mydb.Student WHERE email = ?';
  connection.query(sql, [ FormData.email ], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    }
    if (results.length > 0){
         console.log("User exists!");
         res.send("User already exists!");
    }
    if (results.length < 1){
          const sql2 = 'INSERT INTO mydb.Student (first_name, last_name, address, phone_number, email, date_of_birth, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
          connection.query(sql2, [FormData.fname, FormData.lname, FormData.address, FormData.pnumber, FormData.email, FormData.dob, FormData.password], (err, results) => {
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
  const { FormData } = req.body;  
  const { id } = req.params;
  const sql = 'UPDATE mydb.Student SET first_name = ?, last_name = ?, address = ?, phone_number = ?, email = ?, date_of_birth = ?, password = ? WHERE student_ID = ?';
  connection.query(sql, [FormData.fname, FormData.lname, FormData.address, FormData.pnumber, FormData.email, FormData.dob, FormData.password, id], (err, result) => {
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
  const sql = 'DELETE FROM mydb.Student WHERE student_ID = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});
