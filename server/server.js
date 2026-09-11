require ('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require ('cookie-parser')

const db = require('./database/database');
const  authRoutes =  require('./routes/authRoutes')
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use (
    cors(
        {
            origin: 'http://localhost:5173',
            credentials: true,
        }
    )
)
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});
 
app.get('/api/quizzes', (req, res) => {
    const quizzes = db.prepare('SELECT id, title, description FROM quizzes ORDER BY id').all();
    res.json(quizzes);
});

app.get('/api/quizzes/:id', (req, res) => {
  const quiz = db
    .prepare(`
      SELECT id, title, description
      FROM quizzes
      WHERE id = ?
    `)
    .get(req.params.id);

  if (!quiz) {
    return res.status(404).json({
      message: 'Quiz not found',
    });
  }

  const questions = db
    .prepare(`
      SELECT id, question_text
      FROM questions
      WHERE quiz_id = ?
      ORDER BY id
    `)
    .all(req.params.id);

  const getChoices = db.prepare(`
    SELECT id, choice_text
    FROM choices
    WHERE question_id = ?
    ORDER BY id
  `);

  const questionsWithChoices = questions.map((question) => ({
    ...question,
    choices: getChoices.all(question.id),
  }));

  res.json({
    ...quiz,
    questions: questionsWithChoices,
  });
});

app.post('/api/quizzes/:id/submit', authMiddleware, (req, res) => {
  const quizId = Number(req.params.id);
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      message: 'Answers must be an array',
    });
  }

  const quiz = db
    .prepare('SELECT id FROM quizzes WHERE id = ?')
    .get(quizId);

  if (!quiz) {
    return res.status(404).json({
      message: 'Quiz not found',
    });
  }

  const questions = db
    .prepare(`
      SELECT id
      FROM questions
      WHERE quiz_id = ?
    `)
    .all(quizId);

  let score = 0;

  const getCorrectChoice = db.prepare(`
    SELECT id
    FROM choices
    WHERE question_id = ? AND is_correct = 1
  `);

  questions.forEach((question) => {
    const submittedAnswer = answers.find(
      (answer) => Number(answer.questionId) === question.id,
    );

    if (!submittedAnswer) {
      return;
    }

    const correctChoice = getCorrectChoice.get(question.id);

    if (
      correctChoice &&
      Number(submittedAnswer.choiceId) === correctChoice.id
    ) {
      score += 1;
    }
  });

  const totalQuestions = questions.length;

  const result = db
    .prepare(`
      INSERT INTO quiz_attempts
      (user_id, quiz_id, score, total_questions)
      VALUES (?, ?, ?, ?)
    `)
    .run(req.user.id, quizId, score, totalQuestions);

  res.status(201).json({
    attemptId: result.lastInsertRowid,
    score,
    totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    passed: score / totalQuestions >= 0.6,
  });
});

app.get('/api/results/:id', authMiddleware, (req, res) => {
  const result = db
    .prepare(`
      SELECT
        quiz_attempts.id,
        quiz_attempts.quiz_id,
        quizzes.title AS quiz_title,
        quiz_attempts.score,
        quiz_attempts.total_questions,
        quiz_attempts.created_at
      FROM quiz_attempts
      JOIN quizzes
        ON quizzes.id = quiz_attempts.quiz_id
      WHERE quiz_attempts.id = ?
        AND quiz_attempts.user_id = ?
    `)
    .get(req.params.id, req.user.id);

  if (!result) {
    return res.status(404).json({
      message: 'Result not found',
    });
  }

  const percentage = Math.round(
    (result.score / result.total_questions) * 100,
  );

  res.json({
    ...result,
    percentage,
    passed: percentage >= 60,
  });
});

app.get('/api/my-results', authMiddleware, (req, res) => {
  const results = db
    .prepare(`
      SELECT
        quiz_attempts.id,
        quiz_attempts.quiz_id,
        quizzes.title AS quiz_title,
        quiz_attempts.score,
        quiz_attempts.total_questions,
        quiz_attempts.created_at
      FROM quiz_attempts
      JOIN quizzes
        ON quizzes.id = quiz_attempts.quiz_id
      WHERE quiz_attempts.user_id = ?
      ORDER BY quiz_attempts.created_at DESC
    `)
    .all(req.user.id);

  const resultsWithPercentage = results.map((result) => {
    const percentage = Math.round(
      (result.score / result.total_questions) * 100,
    );

    return {
      ...result,
      percentage,
      passed: percentage >= 60,
    };
  });

  res.json(resultsWithPercentage);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});