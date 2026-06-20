import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, LogOut, Menu, X, FileText, PlusCircle, CheckSquare, Shield, Bell, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to storage events to update user state dynamically
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(prev => {
            // Only update if the object keys have actually changed to avoid infinite loop
            if (!prev || prev.id !== parsed.id || prev.role !== parsed.role || prev.email !== parsed.email || JSON.stringify(prev) !== storedUser) {
              return parsed;
            }
            return prev;
          });
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(prev => prev === null ? null : null);
      }
    };

    checkUser();
    
    // Polling or custom event to react to logins/logouts
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch applications to build real-time Notifications based on roles
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await api.get('applications');
        if (response && response.success && Array.isArray(response.data)) {
          const list = response.data;
          const notifs = [];

          if (user.role === 'employer') {
            // Employer notification: 'pending' applications received
            list.forEach(app => {
              if (app.status === 'pending') {
                notifs.push({
                  id: `app-${app.id}`,
                  text: `Đã có người ứng tuyển vị trí "${app.job?.title || 'Công việc'}"`,
                  subtext: `Ứng viên: ${app.candidate?.full_name || 'Hồ sơ mới'} (SĐT: ${app.candidate?.phone || '-'})`,
                  type: 'info',
                  time: new Date(app.created_at),
                  link: '/dashboard'
                });
              }
            });
          } else if (user.role === 'candidate') {
            // Candidate notification: 'accepted' or 'rejected' applications
            list.forEach(app => {
              if (app.status === 'accepted') {
                notifs.push({
                  id: `app-${app.id}`,
                  text: `🎉 CV của bạn đã được duyệt vị trí "${app.job?.title || 'Công việc'}"!`,
                  subtext: `Công ty: ${app.job?.employer?.company_name || 'Nhà tuyển dụng'}`,
                  type: 'success',
                  time: new Date(app.updated_at || app.created_at),
                  link: '/dashboard'
                });
              } else if (app.status === 'rejected') {
                notifs.push({
                  id: `app-${app.id}`,
                  text: `💼 Đơn ứng tuyển vị trí "${app.job?.title || 'Công việc'}" đã bị từ chối`,
                  subtext: `Công ty: ${app.job?.employer?.company_name || 'Nhà tuyển dụng'}`,
                  type: 'error',
                  time: new Date(app.updated_at || app.created_at),
                  link: '/dashboard'
                });
              }
            });
          }
          // Sort by time descending (newest first)
          notifs.sort((a, b) => b.time - a.time);
          setNotifications(notifs);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      await api.post('auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/auth');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 shadow-md backdrop-blur-md border-b border-slate-100 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Job<span className="text-indigo-600">Hunt</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors duration-200 ${
                isActive('/') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Việc làm
            </Link>

            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  Bảng điều khiển
                </Link>

                {/* Candidate specific links */}
                {user.role === 'candidate' && (
                  <div className="flex items-center space-x-6">
                    <span className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 font-medium rounded-full flex items-center gap-1 border border-teal-100">
                      <User className="w-3.5 h-3.5" /> Ứng viên
                    </span>
                  </div>
                )}

                {/* Employer specific links */}
                {user.role === 'employer' && (
                  <div className="flex items-center space-x-6">
                    <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 font-medium rounded-full flex items-center gap-1 border border-amber-100">
                      <Shield className="w-3.5 h-3.5" /> Nhà tuyển dụng
                    </span>
                  </div>
                )}

                {/* Real-time Notification Bell & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="relative p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center shrink-0"
                    title="Thông báo"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-[10px] font-black text-white rounded-full flex items-center justify-center animate-bounce shadow-sm">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="font-extrabold text-sm text-slate-800">Thông báo tuyển dụng</span>
                        {notifications.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold rounded-full">
                            {notifications.length} Mới
                          </span>
                        )}
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2.5 divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                            Không có thông báo mới nào.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setShowNotifDropdown(false);
                                navigate(notif.link);
                              }}
                              className="pt-2.5 first:pt-0 cursor-pointer flex gap-3 items-start hover:bg-slate-50/50 p-1.5 rounded-lg transition-colors text-left"
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 ${
                                notif.type === 'success'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : notif.type === 'error'
                                  ? 'bg-rose-50 text-rose-600'
                                  : 'bg-indigo-50 text-indigo-600'
                              }`}>
                                {notif.type === 'success' ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : notif.type === 'error' ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  <Briefcase className="w-4 h-4" />
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-xs font-extrabold text-slate-800 leading-tight">
                                  {notif.text}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400">
                                  {notif.subtext}
                                </p>
                                <p className="text-[9px] text-slate-400 font-medium">
                                  {notif.time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {notif.time.toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-5 w-px bg-slate-200"></div>

                {/* User Dropdown Profile info */}
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-800">
                      {user.role === 'employer' && user.employer ? user.employer.company_name : (user.role === 'candidate' && user.candidate ? user.candidate.full_name : user.name)}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/auth" 
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/auth?tab=register" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all hover:shadow-indigo-100"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 border-b border-slate-100 shadow-lg py-4 px-4 space-y-3 transition-all duration-300">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-semibold ${
              isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Việc làm
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                  isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Bảng điều khiển
              </Link>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-3">
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {user.role === 'employer' && user.employer ? user.employer.company_name : (user.role === 'candidate' && user.candidate ? user.candidate.full_name : user.name)}
                  </div>
                  <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                </div>
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2 px-3">
              <Link 
                to="/auth" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 border border-slate-200 rounded-xl"
              >
                Đăng nhập
              </Link>
              <Link 
                to="/auth?tab=register" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;