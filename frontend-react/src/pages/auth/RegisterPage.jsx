import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon, ArrowLeft, User, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { toast } from '../../components/ui/Toast';
import { ThemeContext } from '../../context/ThemeContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    if (errors[e.target.id]) {
      setErrors(prev => ({ ...prev, [e.target.id]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.email) newErrors.email = 'Email ID is required';
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      await register({
        ...formData,
        role: 'customer'
      });
      toast.success('Customer account created successfully!');
      navigate('/');
    } catch (error) {
      const serverErrors = error.response?.data || {};
      if (typeof serverErrors === 'object' && !Array.isArray(serverErrors)) {
        const formattedErrors = {};
        let firstMsg = '';
        Object.keys(serverErrors).forEach(key => {
          const val = serverErrors[key];
          const msg = Array.isArray(val) ? val.join(' ') : String(val);
          formattedErrors[key] = msg;
          if (!firstMsg) firstMsg = msg;
        });
        setErrors(formattedErrors);
        toast.error(firstMsg || 'Failed to create account.');
      } else {
        toast.error('Registered successfully!');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-bg relative overflow-hidden transition-colors duration-300">
      
      {/* Top Bar for Auth Page */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 max-w-7xl mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-text-secondary hover:text-text bg-bg-elevated border border-border px-4 py-2 rounded-2xl shadow-xs transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl text-text-secondary hover:text-text bg-bg-elevated border border-border transition-all"
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
            className="flex-1 py-3 rounded-xl text-xs font-black bg-accent text-white shadow-md flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" /> Customer Sign-up
          </button>

          <button
            type="button"
            onClick={() => navigate('/vendor/register')}
            className="flex-1 py-3 rounded-xl text-xs font-black text-text-muted hover:text-text transition-all flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4" /> Vendor Sign-up
          </button>
        </div>

        <Card padding="lg" className="shadow-2xl border-2 border-border-strong bg-bg-elevated rounded-3xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block mb-3">
              <div className="w-12 h-12 rounded-2xl bg-accent text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
                R
              </div>
            </Link>
            <h2 className="text-2xl font-black text-text mb-1">Create Customer Account</h2>
            <p className="text-xs font-semibold text-text-muted">Start renting equipment instantly across all hubs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="first_name"
                label="First Name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
                required
              />
              <Input
                id="last_name"
                label="Last Name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
              />
            </div>

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
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
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-1 font-semibold">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={handleChange}
                className="input-base w-full"
                required
              />
              {errors.confirm_password && <p className="text-xs text-danger mt-1 font-semibold">{errors.confirm_password}</p>}
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
                  <>Create Customer Account & Rent</>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center space-y-2">
            <p className="text-xs font-semibold text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-accent hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
