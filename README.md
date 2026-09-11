# Online Quiz & Results System

A simple full-stack Online Quiz & Results System built for the Web Developer - Full-Stack React technical assessment.

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router DOM
- TanStack Query
- Zustand

### Backend
- Node.js
- Express.js
- SQLite
- better-sqlite3
- bcryptjs
- JSON Web Token

## Features

- User registration and login
- Password hashing
- JWT authentication
- Quiz listing
- Quiz title search
- Multiple-choice quizzes
- Five questions per quiz
- Four choices per question
- Backend score calculation
- Pass/fail result with 60% passing score
- Personal quiz results
- Logout

## Database

The application uses SQLite with the following tables:

- users
- quizzes
- questions
- choices
- quiz_attempts

## Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd online-quiz