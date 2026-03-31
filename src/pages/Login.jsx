import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");
    
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate('/home');
    } catch (error) {
       toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
       await loginWithGoogle();
       toast.success("Welcome!");
       navigate('/home');
    } catch (error) {
       toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full">
        <div className="text-center mb-8">
            <UserCircle className="w-16 h-16 text-brand-navy mx-auto mb-4" />
            <h2 className="text-3xl font-black text-brand-navy">Welcome Back!</h2>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white transition"
              placeholder="student@college.edu"
              required
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm text-brand-orange hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white transition"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-brand-orange hover:bg-orange-600 font-bold text-white rounded-xl transition shadow-md disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="relative my-8 text-center text-sm font-medium text-gray-400">
           <span className="bg-white px-2 relative z-10">OR</span>
           <div className="absolute top-1/2 left-0 w-full border-t border-gray-200 -z-0"></div>
        </div>

        <button 
           onClick={handleGoogleLogin}
           className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 font-bold text-gray-700 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm"
        >
           <svg className="w-5 h-5" viewBox="0 0 24 24">
             <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
             <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
             <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22l.81-.62z"/>
             <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
           </svg>
           <span>Sign in with Google</span>
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
           Don't have an account? <Link to="/signup" className="text-brand-orange font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
