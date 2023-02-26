// index.js

const express = require('express');
const mysql = require('mysql');
const app = express();

const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');

// Connect to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pakistan786',
  database: 'quizdb',
  port:'3306'
});


app.get("/messages", (req, res) => {
   // Define SQL query to get questions
  const sql = 'SELECT * FROM quiz';

  // Execute SQL query
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Define API routes
const router = express.Router();


router.get('/messages', (req, res) => {
  // Define SQL query to get questions
  res.send('Hello ');
});

app.get('/questions', (req, res) => {
  // Define SQL query to get questions
  const sql = 'SELECT * FROM quiz_question';

  // Execute SQL query
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/quiz/:quizId', (req, res) => {
  const quizId = req.params.quizId;
  const sql = `
    SELECT q.id AS quiz_id, q.name AS quiz_title,
           qq.id AS question_id, qq.question,
           qa.id AS answer_id, qa.answer, qa.is_correct
    FROM quiz q
    JOIN quiz_question qq ON qq.quiz_id = q.id
    JOIN quiz_answer qa ON qa.question_id = qq.id
    WHERE q.id = ?
  `;
  db.query(sql, quizId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Format the data into a nested object structure
    const quiz = { id: results[0].quiz_id, title: results[0].quiz_title, questions: [] };
    console.log(results);
    let currentQuestion;
    results.forEach(result => {
      if (!currentQuestion || currentQuestion.id !== result.question_id) {
        // New question found
        currentQuestion = { id: result.question_id, question_text: result.question, answers: [] };
        quiz.questions.push(currentQuestion);
      }
      // Add answer to the current question
      const answer = { id: result.answer_id, answer_text: result.answer, is_correct: result.is_correct };
      currentQuestion.answers.push(answer);
    });
    res.json(quiz);
  });
});


// Use API routes
//app.use('/api', router);

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
  console.log('Hello World');
});
