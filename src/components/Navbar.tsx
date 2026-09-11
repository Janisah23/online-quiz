import {Link} from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <div className="mx-auto max-w-6x1 items-center justify-between p-4">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    Online Quiz
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                <Link to="/Quizzes" className="text-gray-800 hover:text-gray-600">
                    Quizzes
                </Link>
                <Link to="/my-results" className="text-gray-800 hover:text-gray-600">
                    My Results
                </Link>
                <Link to="/login" className="text-gray-800 hover:text-gray-600">
                    Login   
                </Link>
                <Link to="/signup" className="text-gray-800 hover:text-gray-600">
                    Signup
                </Link>
            </div>
        </nav>
    );
}
export default Navbar;