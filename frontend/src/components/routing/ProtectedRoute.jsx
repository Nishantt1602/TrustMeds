import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // You can also check local storage directly if you want it synchronous
  const storedUser = localStorage.getItem('userInfo');

  if (!user && !storedUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
