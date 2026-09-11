export type Choice = {
  id: number;
  choice_text: string;
};

export type Question = {
  id: number;
  question_text: string;
  choices: Choice[];
};

export type Quiz = {
  id: number;
  title: string;
  description: string;
};

export type QuizDetails = Quiz & {
  questions: Question[];
};

export type QuizAnswer = {
  questionId: number;
  choiceId: number;
};

export async function getQuizzes(): Promise<Quiz[]> {
  const response = await fetch('http://localhost:5000/api/quizzes');

  if (!response.ok) {
    throw new Error('Failed to load quizzes');
  }

  return response.json();
}

export async function getQuiz(id: string): Promise<QuizDetails> {
  const response = await fetch(
    `http://localhost:5000/api/quizzes/${id}`,
  );

  if (!response.ok) {
    throw new Error('Failed to load quiz');
  }

  return response.json();
}

export async function submitQuiz(
  id: string,
  answers: QuizAnswer[],
) {
  const response = await fetch(
    `http://localhost:5000/api/quizzes/${id}/submit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ answers }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit quiz');
  }

  return data;
}

export type QuizResult = {
  id: number;
  quiz_id: number;
  quiz_title: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  created_at: string;
};

export async function getResult(id: string): Promise<QuizResult> {
  const response = await fetch(
    `http://localhost:5000/api/results/${id}`,
    {
      credentials: 'include',
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load result');
  }

  return data;
}

export async function getMyResults(): Promise<QuizResult[]> {
  const response = await fetch(
    'http://localhost:5000/api/my-results',
    {
      credentials: 'include',
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load results');
  }

  return data;
}