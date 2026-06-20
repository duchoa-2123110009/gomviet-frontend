import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, DollarSign, Calendar, ArrowLeft, Briefcase, 
  FileText, CheckCircle, ShieldAlert, Sparkles, XCircle, 
  User, BookOpen, GraduationCap, Award, Compass, FileCode
} from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Page data state
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Application & Auth state
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  // Modals state
  const [cvPreviewModalOpen, setCvPreviewModalOpen] = useState(false);
  const [quickCvModalOpen, setQuickCvModalOpen] = useState(false);

  // Quick CV Form inputs
  const [quickTitle, setQuickTitle] = useState('');
  const [quickSummary, setQuickSummary] = useState('');
  const [quickSkills, setQuickSkills] = useState('');
  const [quickExperience, setQuickExperience] = useState('');
  const [quickEducation, setQuickEducation] = useState('');

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`jobs/${id}`);
        if (response && response.success) {
          setJob(response.data);
        } else {
          setError(response.message || 'Không thể tìm thấy công việc!');
        }
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi tải thông tin công việc.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // Click handler for Apply Button
  const handleApplyClick = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.role !== 'candidate') {
      setApplyError('Chỉ có tài khoản ứng viên mới có thể nộp đơn ứng tuyển!');
      return;
    }

    setLoadingResumes(true);
    setApplyError('');
    setApplySuccess('');

    try {
      // Fetch Candidate CVs to see if they have one
      const response = await api.get('resumes');
      if (response && response.success) {
        const list = response.data || [];
        setResumes(list);

        if (list.length === 0) {
          // If no CV exists, show Quick CV Builder Modal
          setQuickCvModalOpen(true);
        } else {
          // If CV exists, show CV Preview & Review Modal
          setCvPreviewModalOpen(true);
        }
      } else {
        setApplyError('Không thể kiểm tra thông tin hồ sơ của bạn.');
      }
    } catch (err) {
      setApplyError('Có lỗi xảy ra khi truy vấn dữ liệu hồ sơ CV.');
    } finally {
      setLoadingResumes(false);
    }
  };

  // Confirm application with existing CV
  const handleConfirmApply = async () => {
    setApplying(true);
    setApplyError('');
    setApplySuccess('');
    setCvPreviewModalOpen(false);

    try {
      const response = await api.post('applications', { job_id: id });
      if (response && response.success) {
        setApplySuccess('Nộp đơn ứng tuyển thành công! Nhà tuyển dụng sẽ xem xét hồ sơ CV của bạn.');
      } else {
        setApplyError(response.message || 'Nộp đơn thất bại.');
      }
    } catch (err) {
      setApplyError(err.message || 'Bạn đã nộp đơn ứng tuyển cho công việc này rồi!');
    } finally {
      setApplying(false);
    }
  };

  // Save new Quick CV and then immediately Apply
  const handleSaveQuickCvAndApply = async (e) => {
    e.preventDefault();
    if (!quickTitle) {
      setApplyError('Tiêu đề CV không được để trống!');
      return;
    }

    setApplying(true);
    setApplyError('');
    setApplySuccess('');
    setQuickCvModalOpen(false);

    try {
      // 1. Create CV
      const cvPayload = {
        title: quickTitle,
        summary: quickSummary,
        skills: quickSkills,
        experience: quickExperience,
        education: quickEducation,
      };
      
      const cvResponse = await api.post('resumes', cvPayload);
      
      if (cvResponse && cvResponse.success) {
        // 2. Apply to Job
        const appResponse = await api.post('applications', { job_id: id });
        if (appResponse && appResponse.success) {
          setApplySuccess('Đã tạo hồ sơ CV mới & nộp đơn ứng tuyển thành công!');
          
          // Refresh user active resumes locally
          setResumes([cvResponse.data]);
        } else {
          setApplyError('Tạo CV thành công nhưng nộp đơn thất bại.');
        }
      } else {
        setApplyError(cvResponse.message || 'Không thể tạo hồ sơ CV.');
      }
    } catch (err) {
      setApplyError(err.message || 'Bạn đã nộp đơn ứng tuyển cho công việc này rồi!');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    return `${salary.toLocaleString('vi-VN')} triệu VNĐ`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Quay lại danh sách việc làm
          </Link>

          {loading ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-6 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
            </div>
          ) : error ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <h4 className="text-lg font-bold text-slate-700">Không tìm thấy thông tin</h4>
              <p className="text-sm text-slate-400">{error}</p>
              <Link
                to="/"
                className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
              >
                Về Trang Chủ
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Job Header Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-5 py-1.5 text-xs font-bold rounded-bl-2xl flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Tuyển dụng gấp
                </div>

                <div className="space-y-3">
                  <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg inline-block">
                    {job.employer?.company_name || 'Tuyển dụng trực tiếp'}
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
                    {job.title}
                  </h2>

                  {/* Primary Info tags */}
                  <div className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4.5 h-4.5 text-indigo-500" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4.5 h-4.5 text-emerald-500" /> Lương: {formatSalary(job.salary)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4.5 h-4.5 text-indigo-400" /> Đăng ngày {formatDate(job.created_at)}
                    </span>
                  </div>
                </div>

                {/* Apply Panel inside Header */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs text-slate-400 font-medium">
                    {user?.role === 'employer' 
                      ? 'Tài khoản nhà tuyển dụng không thể ứng tuyển.' 
                      : 'Hồ sơ CV của bạn sẽ được gửi trực tiếp đến hộp thư tuyển dụng của công ty.'}
                  </div>
                  
                  {user?.role !== 'employer' && (
                    <button
                      onClick={handleApplyClick}
                      disabled={applying || applySuccess || loadingResumes}
                      className="w-full sm:w-auto py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-1.5"
                    >
                      {loadingResumes ? (
                        'Đang kiểm tra hồ sơ...'
                      ) : applying ? (
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : applySuccess ? (
                        'Đã nộp đơn thành công'
                      ) : (
                        'Nộp Đơn Ứng Tuyển Ngay'
                      )}
                    </button>
                  )}
                </div>

                {/* Alert Messages */}
                {applyError && (
                  <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-3 rounded-lg text-sm font-medium">
                    {applyError}
                  </div>
                )}
                {applySuccess && (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-3 rounded-lg text-sm font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    {applySuccess}
                  </div>
                )}
              </div>

              {/* Job Body Description Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" /> Mô tả công việc
                  </h3>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-4">
                    {job.description}
                  </div>
                </div>

                {/* Extra standard details */}
                <div className="bg-slate-50 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider">Hình thức làm việc</span>
                    <span className="text-slate-700 text-sm font-bold">Toàn thời gian cố định</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider">Địa điểm tuyển dụng</span>
                    <span className="text-slate-700 text-sm font-bold">{job.location}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider">Tên công ty</span>
                    <span className="text-slate-700 text-sm font-bold">{job.employer?.company_name || 'Đang cập nhật'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider">Liên hệ tuyển dụng</span>
                    <span className="text-indigo-600 text-sm font-bold">{job.employer?.user?.email || 'Hệ thống JobHunt'}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* --- MODAL 1: PREVIEW / REVIEW EXISTING CV BEFORE SUBMITTING --- */}
      {cvPreviewModalOpen && resumes.length > 0 && (() => {
        const parsePortfolioAndTemplate = (portfolioStr) => {
          if (!portfolioStr) return { template: 'template_1', url: '', avatar: '' };
          if (portfolioStr.includes('|')) {
            const parts = portfolioStr.split('|');
            return { 
              template: parts[0] || 'template_1', 
              url: parts[1] || '',
              avatar: parts[2] || ''
            };
          }
          if (portfolioStr.startsWith('template_')) {
            return { template: portfolioStr, url: '', avatar: '' };
          }
          return { template: 'template_1', url: portfolioStr, avatar: '' };
        };

        const getTemplateStyles = (templateName) => {
          switch (templateName) {
            case 'template_2': // Elegant Navy
              return {
                headerBg: 'bg-indigo-900 text-white',
                sidebarBg: 'bg-indigo-950 text-indigo-50 border-r border-indigo-900/40',
                accentText: 'text-indigo-750 text-indigo-700',
                sectionBorder: 'border-l-4 border-indigo-900',
                badgeBg: 'bg-indigo-50 text-indigo-850 bg-indigo-50/70 border border-indigo-100',
                dividerColor: 'border-indigo-100',
                iconBg: 'bg-indigo-50 text-indigo-700',
                label: 'Mẫu Navy Lịch Lãm'
              };
            case 'template_3': // Modern Emerald
              return {
                headerBg: 'bg-emerald-700 text-white',
                sidebarBg: 'bg-emerald-800 text-emerald-50 border-r border-emerald-750',
                accentText: 'text-emerald-750 text-emerald-700',
                sectionBorder: 'border-l-4 border-emerald-600',
                badgeBg: 'bg-emerald-50 text-emerald-850 bg-emerald-50/70 border border-emerald-100',
                dividerColor: 'border-emerald-100',
                iconBg: 'bg-emerald-50 text-emerald-700',
                label: 'Mẫu Emerald Tươi Trẻ'
              };
            case 'template_4': // Luxury Charcoal
              return {
                headerBg: 'bg-slate-800 text-white border-b-4 border-amber-500',
                sidebarBg: 'bg-slate-900 text-amber-50/90 border-r border-slate-950',
                accentText: 'text-amber-600',
                sectionBorder: 'border-l-4 border-amber-500',
                badgeBg: 'bg-amber-50 text-amber-955 bg-amber-50/70 border border-amber-200/50',
                dividerColor: 'border-slate-100',
                iconBg: 'bg-amber-50 text-amber-700',
                label: 'Mẫu Charcoal Sang Trọng'
              };
            case 'template_1': // Orange Accent
            default:
              return {
                headerBg: 'bg-orange-500 text-white',
                sidebarBg: 'bg-orange-600 text-white border-r border-orange-700/35',
                accentText: 'text-orange-600',
                sectionBorder: 'border-l-4 border-orange-500',
                badgeBg: 'bg-orange-50 text-orange-850 bg-orange-50/70 border border-orange-100',
                dividerColor: 'border-orange-100',
                iconBg: 'bg-orange-50 text-orange-600',
                label: 'Mẫu Cam Năng Động'
              };
          }
        };

        const cv = resumes[0];
        const parsed = parsePortfolioAndTemplate(cv.portfolio_url);
        const currentTemplate = parsed.template || 'template_1';
        const styles = getTemplateStyles(currentTemplate);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 relative border border-slate-100 flex flex-col justify-between">
              
              {/* Premium CV Header Section */}
              <div className={`${styles.headerBg} p-6 sm:p-8 space-y-4 relative text-left shrink-0`}>
                <button
                  onClick={() => setCvPreviewModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                  title="Đóng cửa sổ"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                
                <div className="space-y-1">
                  <span className="text-[10px] px-2.5 py-1 bg-white/25 text-white font-extrabold rounded-full uppercase tracking-widest">
                    {styles.label}
                  </span>
                  <h3 className="text-2xl font-black tracking-tight">{user?.name || 'Hồ sơ Ứng viên'}</h3>
                  <p className="text-sm font-bold text-white/95">{cv.title}</p>
                </div>
              </div>

              {/* CV Body Content - Canva Redesigned Split Grid! */}
              <div className="bg-white text-slate-700 text-left flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                  
                  {/* LEFT PANEL (Canva Sidebar): Contact, Core Skills, Languages, Certificates (4 cols) */}
                  <div className={`${styles.sidebarBg} md:col-span-4 p-6 sm:p-8 space-y-6 text-sm`}>
                    
                    {/* Avatar Circle Place Card */}
                    <div className="text-center space-y-3 pb-6 border-b border-white/10">
                      <div className="w-20 h-20 rounded-full mx-auto bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl font-black tracking-wider text-white shadow-md overflow-hidden relative">
                        {parsed.avatar ? (
                          <img src={parsed.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.split(' ').slice(-1)[0]?.toUpperCase() || 'CV'
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-base tracking-tight text-white">{user?.name}</h4>
                        <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{styles.label}</p>
                      </div>
                    </div>

                    {/* Contact Info Details */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-white/90 border-b border-white/15 pb-1">
                        LIÊN LẠC
                      </h4>
                      <div className="space-y-3 text-[11px] text-white/80 font-semibold">
                        <div className="flex items-start gap-2.5">
                          <span className="shrink-0 p-1 bg-white/10 rounded-lg text-white">📞</span>
                          <div className="leading-tight">
                            <span className="block text-[9px] text-white/50 uppercase font-black">Điện thoại</span>
                            <span>{user?.candidate?.phone || 'Chưa cập nhật'}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="shrink-0 p-1 bg-white/10 rounded-lg text-white">✉️</span>
                          <div className="leading-tight break-all">
                            <span className="block text-[9px] text-white/50 uppercase font-black">Email</span>
                            <span>{user?.email || 'Chưa cập nhật'}</span>
                          </div>
                        </div>
                        {parsed.url && (
                          <div className="flex items-start gap-2.5">
                            <span className="shrink-0 p-1 bg-white/10 rounded-lg text-white">🔗</span>
                            <div className="leading-tight">
                              <span className="block text-[9px] text-white/50 uppercase font-black">Portfolio</span>
                              <a href={parsed.url} target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-indigo-200 block truncate max-w-[130px]">{parsed.url}</a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Core Skills - Canva Style Strength Indicators */}
                    {cv.skills && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/90 border-b border-white/15 pb-1">
                          KỸ NĂNG CỐT LÕI
                        </h4>
                        <div className="space-y-3">
                          {cv.skills.split(',').map((skill, idx) => {
                            const trimmed = skill.trim();
                            // Dynamically assign visual skill percentage bar matching Canva!
                            const pctList = [90, 85, 80, 75, 70];
                            const pct = pctList[idx % pctList.length];
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold text-white/90">
                                  <span>✨ {trimmed}</span>
                                  <span className="text-[10px] text-white/60 font-medium">{pct}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {cv.languages && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/90 border-b border-white/15 pb-1">
                          NGOẠI NGỮ
                        </h4>
                        <p className="text-[11px] font-bold text-white/80 leading-relaxed whitespace-pre-line text-left">
                          {cv.languages}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* RIGHT PANEL (Main Canvas): Objective, Experience, Education, Projects, Certificates (8 cols) */}
                  <div className="md:col-span-8 p-6 sm:p-8 space-y-6 text-sm text-slate-700 bg-white">
                    
                    {/* Objectives/Summary */}
                    {cv.summary && (
                      <div className="space-y-2">
                        <h4 className={`text-xs font-black uppercase tracking-wider ${styles.accentText} border-b ${styles.dividerColor} pb-1.5 flex items-center gap-1.5`}>
                          <Compass className="w-4 h-4" /> Mục tiêu nghề nghiệp
                        </h4>
                        <p className="text-slate-655 leading-relaxed font-semibold whitespace-pre-line text-[12.5px] bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          {cv.summary}
                        </p>
                      </div>
                    )}

                    {/* Work Experience with vertical timeline trees */}
                    {cv.experience && (
                      <div className="space-y-3">
                        <h4 className={`text-xs font-black uppercase tracking-wider ${styles.accentText} border-b ${styles.dividerColor} pb-1.5 flex items-center gap-1.5`}>
                          <Briefcase className="w-4 h-4" /> Kinh nghiệm làm việc
                        </h4>
                        
                        {/* Timeline display */}
                        <div className="relative pl-6 border-l-2 border-slate-150 space-y-4 text-left ml-2.5">
                          <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50"></div>
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-sm whitespace-pre-line font-semibold leading-relaxed text-[12.5px] text-slate-700">
                            {cv.experience}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Education details */}
                    {cv.education && (
                      <div className="space-y-3">
                        <h4 className={`text-xs font-black uppercase tracking-wider ${styles.accentText} border-b ${styles.dividerColor} pb-1.5 flex items-center gap-1.5`}>
                          <GraduationCap className="w-4 h-4" /> Học vấn & Trình độ
                        </h4>
                        <div className="relative pl-6 border-l-2 border-slate-150 space-y-4 text-left ml-2.5">
                          <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-emerald-50"></div>
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-sm whitespace-pre-line font-semibold leading-relaxed text-[12.5px] text-slate-700">
                            {cv.education}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {cv.projects && (
                      <div className="space-y-2">
                        <h4 className={`text-xs font-black uppercase tracking-wider ${styles.accentText} border-b ${styles.dividerColor} pb-1.5 flex items-center gap-1.5`}>
                          <FileCode className="w-4 h-4" /> Dự án thực tế
                        </h4>
                        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 whitespace-pre-line font-semibold leading-relaxed text-[12px] text-slate-700 text-left">
                          {cv.projects}
                        </div>
                      </div>
                    )}

                    {/* Certificates */}
                    {cv.certificates && (
                      <div className="space-y-2">
                        <h4 className={`text-xs font-black uppercase tracking-wider ${styles.accentText} border-b ${styles.dividerColor} pb-1.5 flex items-center gap-1.5`}>
                          📜 Chứng chỉ & Giải thưởng
                        </h4>
                        <div className="p-3.5 rounded-2xl bg-amber-50/30 border border-amber-100/50 whitespace-pre-line font-semibold text-[12px] leading-relaxed text-slate-700 text-left">
                          {cv.certificates}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Panel */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50 rounded-b-3xl">
                <button
                  onClick={() => setCvPreviewModalOpen(false)}
                  className="py-2.5 px-5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmApply}
                  className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-200"
                >
                  Xác nhận & Nộp Đơn Ngay
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* --- MODAL 2: MANDATORY QUICK CV BUILDER (IF NO CV EXISTS) --- */}
      {quickCvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-800">Bạn chưa tạo hồ sơ CV trực tuyến</h3>
                <p className="text-xs text-rose-500 font-bold mt-0.5">* Vui lòng soạn thông tin hồ sơ dưới đây để nộp đơn ứng tuyển!</p>
              </div>
              <button
                onClick={() => setQuickCvModalOpen(false)}
                className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors shrink-0"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickCvAndApply} className="space-y-4 text-sm text-slate-600">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Tiêu đề CV / Vị trí mong muốn *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lập trình viên ReactJS, Nhân viên thiết kế..."
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Mục tiêu nghề nghiệp & Giới thiệu bản thân</label>
                <textarea
                  placeholder="Giới thiệu bản thân và phương châm làm việc..."
                  rows={2}
                  value={quickSummary}
                  onChange={(e) => setQuickSummary(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Kỹ năng cốt lõi (Skills) *</label>
                <textarea
                  placeholder="Ví dụ: HTML, CSS, JavaScript, làm việc nhóm, giao tiếp..."
                  rows={2}
                  value={quickSkills}
                  onChange={(e) => setQuickSkills(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  required
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Kinh nghiệm làm việc (Experience)</label>
                <textarea
                  placeholder="Ví dụ: 08/2025 - Hiện tại: Thực tập sinh tại công ty ABC..."
                  rows={2}
                  value={quickExperience}
                  onChange={(e) => setQuickExperience(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Học vấn / Trình độ học tập *</label>
                <textarea
                  placeholder="Ví dụ: Đại học Công nghệ thông tin CNTT (Khóa 2022-2026)..."
                  rows={2}
                  value={quickEducation}
                  onChange={(e) => setQuickEducation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  required
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickCvModalOpen(false)}
                  className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-200 disabled:bg-indigo-400"
                >
                  {applying ? 'Đang tạo & nộp đơn...' : 'Tạo CV & Nộp Đơn Ứng Tuyển'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default JobDetail;
