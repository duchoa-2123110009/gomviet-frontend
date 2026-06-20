import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, Briefcase, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Registration Role
  const [role, setRole] = useState('candidate'); // 'candidate' or 'employer'

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu!');
      return false;
    }
    if (activeTab === 'register') {
      if (!name) {
        setError('Vui lòng nhập tên của bạn!');
        return false;
      }
      if (password !== passwordConfirmation) {
        setError('Mật khẩu xác nhận không trùng khớp!');
        return false;
      }
      if (role === 'candidate' && !phone) {
        setError('Vui lòng nhập số điện thoại ứng viên!');
        return false;
      }
      if (role === 'employer' && !companyName) {
        setError('Vui lòng nhập tên công ty tuyển dụng!');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (activeTab === 'login') {
        // Login Request
        const response = await api.post('auth/login', { email, password });
        
        if (response.success) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setSuccess('Đăng nhập thành công!');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          setError(response.message || 'Lỗi đăng nhập!');
        }
      } else {
        // Register Request
        const payload = {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          role,
          phone: role === 'candidate' ? phone : undefined,
          company_name: role === 'employer' ? companyName : undefined,
        };

        const response = await api.post('auth/register', payload);

        if (response.success) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setSuccess('Đăng ký thành công! Đang chuyển hướng...');

          setTimeout(() => {
            // Redirect to appropriate onboarding page based on role
            if (role === 'candidate') {
              navigate('/applicant-onboarding');
            } else {
              navigate('/employer-onboarding');
            }
          }, 1200);
        } else {
          setError(response.message || 'Đăng ký thất bại!');
        }
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-slate-50 bg-grid-pattern">
        <div className="w-full max-w-md px-4 sm:px-0">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-8 space-y-6">
            
            {/* Header / Tabs */}
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {activeTab === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                {activeTab === 'login' 
                  ? 'Đăng nhập vào JobHunt để quản lý và tìm kiếm cơ hội của bạn' 
                  : 'Tham gia mạng lưới tìm kiếm việc làm hàng đầu Việt Nam'}
              </p>

              {/* Tabs Switcher */}
              <div className="mt-6 flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-custom ${
                    activeTab === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-custom ${
                    activeTab === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Đăng ký
                </button>
              </div>
            </div>

            {/* Error / Success Toast alerts */}
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-3 rounded-lg text-sm font-medium flex items-center gap-1.5 animate-pulse">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <>
                  {/* Role selection tab */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Bạn là ai?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('candidate')}
                        className={`flex items-center justify-center gap-2 py-3 border rounded-xl font-semibold text-sm transition-custom ${
                          role === 'candidate'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-100'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <User className="w-4 h-4" /> Ứng viên xin việc
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('employer')}
                        className={`flex items-center justify-center gap-2 py-3 border rounded-xl font-semibold text-sm transition-custom ${
                          role === 'employer'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-100'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Briefcase className="w-4 h-4" /> Nhà tuyển dụng
                      </button>
                    </div>
                  </div>

                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom"
                      />
                    </div>
                  </div>

                  {/* Candidate Phone */}
                  {role === 'candidate' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Số điện thoại</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="0987654321"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom"
                        />
                      </div>
                    </div>
                  )}

                  {/* Employer Company Name */}
                  {role === 'employer' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Tên doanh nghiệp / Công ty</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Công ty TNHH Giải pháp Tech"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Email field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Password Confirmation field */}
              {activeTab === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 disabled:bg-indigo-400 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : activeTab === 'login' ? (
                  'Đăng nhập'
                ) : (
                  'Đăng ký tài khoản'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Auth;