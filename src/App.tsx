
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import QuizListPage from './pages/QuizListPage';
import TakeQuizPage from './pages/TakeQuizPage';
import ResultPage from './pages/ResultPage';
import MyResultsPage from './pages/MyResultsPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/" element={<QuizListPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/signup" element={<SignupPage />} />

          <Route path="/quiz/:id" element={<TakeQuizPage />} />

          <Route path="/result/:id" element={<ResultPage />} />

          <Route path="/my-results" element={<MyResultsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
