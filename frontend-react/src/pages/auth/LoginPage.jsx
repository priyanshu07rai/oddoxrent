import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon, ArrowLeft, User, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { toast } from '../../components/ui/Toast';
import { ThemeContext } from '../../context/ThemeContext';

const LoginPage = () => {
  const [accountType, setAccountType] = useState('customer'); // 'customer' | 'vendor'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await login(formData);
      toast.success(`Welcome back to RentOS ${accountType === 'vendor' ? 'Vendor Portal' : ''}!`);
      if (user.role === 'admin' || accountType === 'vendor') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-bg relative overflow-hidden transition-colors duration-300">
      
      {/* Top Header Actions */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 max-w-7xl mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-text-secondary hover:text-text bg-bg-elevated border border-border px-4 py-2 rounded-2xl shadow-xs transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl text-text-secondary hover:text-text bg-bg-elevated border border-border transition-all"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10 my-auto mt-12"
      >
        {/* Top 2-Segment Control for Customer vs Vendor */}
        <div className="flex bg-bg-elevated p-1.5 rounded-2xl border-2 border-border-strong mb-6 shadow-sm">
          <button
            type="button"
            onClick={() => setAccountType('customer')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              accountType === 'customer' 
                ? 'bg-accent text-white shadow-md' 
                : 'text-text-muted hover:text-text'
            }`}
          >
            <User className="w-4 h-4" /> Customer Login
          </button>

          <button
            type="button"
            onClick={() => setAccountType('vendor')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              accountType === 'vendor' 
                ? 'bg-accent text-white shadow-md' 
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Building2 className="w-4 h-4" /> Vendor Login
          </button>
        </div>

        <Card padding="lg" className="shadow-2xl border-2 border-border-strong bg-bg-elevated rounded-3xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block mb-3">
              <div className="w-12 h-12 rounded-2xl bg-accent text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
                R
              </div>
            </Link>
            <h2 className="text-2xl font-black text-text mb-1">
              {accountType === 'vendor' ? 'Vendor Portal Sign In' : 'Welcome Back'}
            </h2>
            <p className="text-xs font-semibold text-text-muted">
              {accountType === 'vendor' ? 'Sign in to manage equipment inventory & rentals' : 'Sign in to manage your active gear rentals'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder={accountType === 'vendor' ? "vendor@company.com" : "you@example.com"}
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-base w-full pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border bg-bg-subtle text-accent focus:ring-accent accent-accent"
                />
                <span className="text-xs font-bold text-text-muted">Remember me</span>
              </label>

              <a href="#" className="text-xs font-bold text-accent hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Vibrant High-Contrast Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-black text-sm bg-accent text-white hover:bg-accent-hover shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Sign In to RentOS {accountType === 'vendor' ? 'Vendor Portal' : ''}</>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center space-y-2">
            <p className="text-xs font-semibold text-text-muted">
              Don't have an account?{' '}
              <Link 
                to={accountType === 'vendor' ? "/vendor/register" : "/register"} 
                className="font-black text-accent hover:underline"
              >
                Create {accountType === 'vendor' ? 'Vendor Account' : 'Customer Account'}
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
