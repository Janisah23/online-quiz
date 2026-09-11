import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
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
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold">
          Quiz System
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/">Quizzes</Link>

          <Link to="/my-results">
            My Results
          </Link>

          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;