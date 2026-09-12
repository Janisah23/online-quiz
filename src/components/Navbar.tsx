import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  // Set to true to see Logout. Set to false to see Login and Sign Up.
  const [loggedIn, setLoggedIn] = useState(true);

  async function handleLogout() {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    setLoggedIn(false);
    navigate('/login');
  }

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          Quiz System
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Quizzes
          </Link>

          <Link
            to="/my-results"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            My Results
          </Link>

          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;