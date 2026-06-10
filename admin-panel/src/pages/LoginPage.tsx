import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosClient';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true }); 
    }
  }, [navigate]);

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen flex items-center justify-center bg-white font-sans text-black">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-center">Bloowatch Admin Panel</h2>
          <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider mt-1">For Admin Use</p>
        </div>

        {error && (
          <div className="p-3 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 uppercase text-center tracking-wide">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black rounded-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:bg-gray-200"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </main>
  );
}