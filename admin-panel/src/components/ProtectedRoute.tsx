import { Navigate, Outlet } from 'react-router-dom';

interface UserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user'); 

  if (!token || !userJson) {
    return <Navigate to="/login" />;
  }

  try {
    const user: UserPayload = JSON.parse(userJson);

    if (user.role !== 'admin') {
      return <Navigate to="/login"  />;
    }
    return <Outlet />;
  } catch (error) {
    localStorage.clear();
    return <Navigate to="/login"  />;
  }
}