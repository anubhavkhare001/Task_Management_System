import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <CheckSquare className="mr-2" size={24} />
            <span>TaskManager</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center text-sm">
                <User size={16} className="mr-1" />
                <span>{user.username}</span>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center text-sm bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded transition-colors"
            >
              <LogOut size={16} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;