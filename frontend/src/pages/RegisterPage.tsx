import { useEffect, useState, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import api from '../api/axiosClient';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loginState, globalLoading, setGlobalLoading, token } = useAuth();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      showToast('All fields are required', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setGlobalLoading(true);

      const response = await api.post('/auth/register', formData);

      const result = response.data;
      if (result.success) {
        showToast(result.message || 'User registered successfully!', 'success');
        loginState(result.data.token, result.data.user);
        navigate('/');
      } else {
        showToast(result.message || 'Registration failed', 'error');
      }

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Cannot connect to authorization server';
      showToast(errorMsg, 'error');
    } finally {
      setGlobalLoading(false);
    }
  };
  
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-white px-4 py-16 font-sans">
      <div className="w-full max-w-[460px] bg-white rounded-md shadow-[0_4px_25px_rgba(0,0,0,0.07)] p-10 border border-gray-100">
        <h2 className="text-[22px] font-bold text-black mb-6">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 text-[14px] text-black placeholder:text-gray-400 rounded outline-none focus:border-brand-blue transition-colors"
            />
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 text-[14px] text-black placeholder:text-gray-400 rounded outline-none focus:border-brand-blue transition-colors"
            />
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          <p className="text-[12px] text-gray-500 text-center px-4 leading-relaxed pt-2">
            By registering up, you confirm that you have read and accepted our{' '}
            <a href="#notice" className="text-blue-800 font-bold hover:underline">User Notice</a> and{' '}
            <a href="#privacy" className="text-blue-800 font-bold hover:underline">Privacy Policy</a>.
          </p>
          <button
            type="submit"
            className="w-full py-3 bg-primary-blue text-white font-bold text-[14px] rounded transition-colors tracking-wide mt-2 cursor-pointer"
          >
            {globalLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center text-[13px]">
          <div>
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-blue-800 font-bold hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
