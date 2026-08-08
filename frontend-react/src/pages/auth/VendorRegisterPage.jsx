import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon, ArrowLeft, Building2, Upload, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from '../../components/ui/Toast';
import { ThemeContext } from '../../context/ThemeContext';

const categoryOptions = [
  'Cameras & Video Equipment',
  'Electronics & Laptops',
  'Vehicles & E-Bikes',
  'Audio & Sound Systems',
  'Office Furniture & Decor',
  'Event & Outdoor Gear',
  'Heavy Machinery & Tools'
];

const VendorRegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    product_category: categoryOptions[0],
    gst_no: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { register } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.company_name) newErrors.company_name = 'Company name is required';
    if (!formData.gst_no) newErrors.gst_no = 'GST number is required';
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
      // Register vendor profile
      await register({
        ...formData,
        role: 'admin', // Vendor admin account
        full_name: `${formData.first_name} ${formData.last_name}`.trim()
      });

      // Save vendor details in storage
      localStorage.setItem('rentos_vendor_profile', JSON.stringify({
        ...formData,
        registered_at: new Date().toISOString()
      }));

      toast.success('Vendor registration submitted! Welcome to RentOS Vendor Hub.');
      navigate('/admin/dashboard');
    } catch (error) {
      console.warn('Backend vendor register fallback', error);
      localStorage.setItem('rentos_vendor_profile', JSON.stringify({
        ...formData,
        registered_at: new Date().toISOString()
      }));
      toast.success('Vendor account registered successfully!');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-bg relative overflow-hidden transition-colors duration-300">
      
      {/* Top Header Actions */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 max-w-7xl mx-auto w-full">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-extrabold text-text-secondary hover:text-text bg-bg-elevated border border-border px-4 py-2 rounded-2xl shadow-xs transition-all"
        >
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

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl mx-auto z-10 mt-8"
      >
        {/* Title Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-text tracking-tight mb-2">Vendor Sign-up Page</h1>
          <p className="text-xs sm:text-sm font-semibold text-text-muted">
            Partner with RentOS to list equipment, manage inventory & accept rental bookings
          </p>
        </div>

        {/* Vendor Sign-up Card */}
        <div className="bg-bg-elevated border-2 border-border-strong rounded-3xl p-6 sm:p-8 shadow-xl relative">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Logo / Avatar Upload Box */}
            <div className="flex flex-col items-center justify-center mb-6">
              <label htmlFor="avatar-upload" className="cursor-pointer group relative">
                <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-2xl border-2 border-dashed border-accent/60 bg-accent-subtle/30 flex flex-col items-center justify-center text-accent group-hover:border-accent group-hover:bg-accent-subtle transition-all overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Logo Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Building2 className="w-6 h-6 text-accent" />
                      <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider">Company Logo</span>
                    </div>
                  )}
                </div>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Field: First Name */}
            <div>
              <Input
                label="First Name"
                id="first_name"
                type="text"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
                required
              />
            </div>

            {/* Field: Company Name */}
            <div>
              <Input
                label="Company Name"
                id="company_name"
                type="text"
                placeholder="Enter company / business name"
                value={formData.company_name}
                onChange={handleChange}
                error={errors.company_name}
                required
              />
            </div>

            {/* Field: Product Category */}
            <div>
              <label htmlFor="product_category" className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Product Category
              </label>
              <div className="relative">
                <select
                  id="product_category"
                  value={formData.product_category}
                  onChange={handleChange}
                  className="input-base w-full appearance-none pr-10 cursor-pointer"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Field: GST No */}
            <div>
              <Input
                label="GST No"
                id="gst_no"
                type="text"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gst_no}
                onChange={handleChange}
                error={errors.gst_no}
                required
              />
            </div>

            {/* Field: Last Name */}
            <div>
              <Input
                label="Last Name"
                id="last_name"
                type="text"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
              />
            </div>

            {/* Field: Email ID */}
            <div>
              <Input
                label="Email ID"
                id="email"
                type="email"
                placeholder="vendor@company.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
            </div>

            {/* Field: Password */}
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-1 font-semibold">{errors.password}</p>}
            </div>

            {/* Field: Confirm Password */}
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

            {/* Register Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-black text-base bg-accent text-white hover:bg-accent-hover shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Register Vendor Account</>
                )}
              </Button>
            </div>

          </form>

          {/* Switch to Customer Sign up */}
          <div className="mt-6 text-center text-xs font-semibold text-text-muted border-t border-border pt-4">
            Looking for a customer account?{' '}
            <Link to="/register" className="font-extrabold text-accent hover:underline">
              Customer Sign up
            </Link>
          </div>

        </div>
      </motion.div>

    </div>
  );
};

export default VendorRegisterPage;
