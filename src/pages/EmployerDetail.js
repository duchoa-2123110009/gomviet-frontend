import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, ArrowRight, Briefcase, Share2, Heart, Clock, Mail, Phone, Globe } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EmployerDetail = () => {
  const { id } = useParams();
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        const response = await api.get(`employers/${id}`);
        if (response && response.success) {
          setEmployer(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch employer details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployer();
  }, [id]);

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    return `${salary.toLocaleString('vi-VN')} triệu`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!employer) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center space-y-4">
          <Briefcase className="w-16 h-16 text-slate-300" />
          <h2 className="text-2xl font-bold text-slate-700">Không tìm thấy công ty!</h2>
          <Link to="/" className="text-indigo-600 font-bold hover:underline">Quay lại trang chủ</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-slate-50 min-h-screen pt-20">
        {/* Banner */}
        <div className="h-64 md:h-80 w-full bg-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-slate-800 to-indigo-900 opacity-90"></div>
          {/* Optional banner image if employer has one. For now use placeholder gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.4),transparent_70%)]"></div>
          <img 
             src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop" 
             className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
             alt="Banner" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-20">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end border border-slate-100">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Logo */}
              <div className="w-32 h-32 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center shrink-0 overflow-hidden relative">
                {employer.user?.avatar ? (
                  <img src={employer.user.avatar} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100 z-0"></div>
                    <span className="text-4xl font-black text-indigo-600 relative z-10">
                      {employer.company_name ? employer.company_name.substring(0, 3).toUpperCase() : 'COM'}
                    </span>
                  </>
                )}
              </div>
              
              <div className="space-y-2 pt-2 sm:pt-4">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
                  {employer.company_name}
                </h1>
                <div className="flex items-center text-slate-500 font-semibold text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-indigo-500" />
                  {employer.location || (employer.jobs && employer.jobs.length > 0 ? employer.jobs[0].location : 'Chưa cập nhật địa chỉ')}
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex justify-center items-center gap-2">
                <Heart className="w-4 h-4" /> Theo dõi • {Math.floor(Math.random() * 500) + 100}
              </button>
              <button className="px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-all flex justify-center items-center gap-2">
                <Share2 className="w-4 h-4" /> Chia sẻ
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            {/* Left Column - Jobs list */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                Vị trí đang tuyển
              </h3>

              {(!employer.jobs || employer.jobs.length === 0) ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
                  <p className="text-slate-500 font-medium">Hiện tại công ty này chưa có tin tuyển dụng nào.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {employer.jobs.map(job => (
                    <div key={job.id} className="bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl p-5 transition-all shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                      <div className="space-y-2 flex-1">
                        <Link to={`/jobs/${job.id}`} className="text-base font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          [{job.location}] {job.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                          <span className="flex items-center text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md">
                            <DollarSign className="w-3.5 h-3.5 mr-0.5" /> {formatSalary(job.salary)}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.location}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between self-stretch sm:w-auto w-full">
                        <button className="text-slate-400 hover:text-rose-500 transition-colors hidden sm:block">
                          <Heart className="w-5 h-5" />
                        </button>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-auto">
                          <Clock className="w-3.5 h-3.5" />
                          {/* Mock expiry date */}
                          Còn {Math.floor(Math.random() * 30) + 5} ngày
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Company Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="font-extrabold text-slate-700">Vị trí đang tuyển</span>
                    <span className="font-black text-indigo-600 text-xl">{employer.jobs ? employer.jobs.length : 0}</span>
                  </div>
                  
                  <div className="pt-2 space-y-4">
                    <h4 className="font-extrabold text-slate-800 text-sm">Giới thiệu doanh nghiệp</h4>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {employer.description || 'Chưa có thông tin giới thiệu chi tiết về doanh nghiệp này.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <h4 className="font-extrabold text-slate-800 text-sm">Thông tin liên hệ</h4>
                    
                    <div className="space-y-3">
                      {employer.website && (
                        <div className="flex items-center text-sm font-medium text-slate-600">
                          <Globe className="w-4 h-4 mr-3 text-slate-400" />
                          <a href={employer.website.startsWith('http') ? employer.website : `https://${employer.website}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline line-clamp-1">
                            {employer.website}
                          </a>
                        </div>
                      )}
                      {/* For now mock email and phone if they are not in the employer table, actually usually they are on the User model */}
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <Mail className="w-4 h-4 mr-3 text-slate-400" />
                        <span>{employer.user?.email || 'Đang cập nhật'}</span>
                      </div>
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <Phone className="w-4 h-4 mr-3 text-slate-400" />
                        <span>{employer.phone || 'Đang cập nhật'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EmployerDetail;
