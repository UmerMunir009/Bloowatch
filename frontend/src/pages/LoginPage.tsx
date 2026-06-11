import  { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import api from '../api/axiosClient';

export default function LoginPage() {
  const { loginState } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting,setSubmitting]=useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/', { replace: true }); 
    }
  }, [navigate]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast('Please fill out all login parameters', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/auth/login', { email, password });
      const result = response.data;

      if (result.success) {
        showToast('Logged in successfully!', 'success');
        loginState(result.data.token, result.data.user);
        navigate('/');
      } else {
        showToast(result.message || 'Invalid email or password', 'error');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Invalid email or password';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[65vh] w-full flex items-center justify-center bg-white px-4 py-16 font-sans">
      <div className="w-full max-w-[460px] bg-white rounded-md shadow-[0_4px_25px_rgba(0,0,0,0.07)] p-10 border border-gray-100">
        <h2 className="text-[22px] font-bold text-black mb-6">Login</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="relative flex items-center">
            <span className="email-icon absolute left-4 h-6 w-6" />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 text-[14px] text-black placeholder:text-gray-400 rounded outline-none focus:border-brand-blue transition-colors"
            />
          </div>

          <div className="relative flex items-center">
            <span className="password-icon absolute left-4 h-6 w-6" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-16 py-3 border border-gray-200 text-[14px] text-black placeholder:text-gray-400 rounded outline-none focus:border-brand-blue transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-[13px] text-gray-400 hover:text-black cursor-pointer bg-transparent border-0"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-primary-blue text-white font-bold text-[14px] rounded transition-colors tracking-wide mt-4 cursor-pointer"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-[13px]">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/register" className="text-blue-800 font-bold hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}