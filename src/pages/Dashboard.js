import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Briefcase, FileText, CheckCircle, Clock, XCircle, 
  Plus, Edit2, Trash2, Shield, Eye, Settings, MapPin, 
  DollarSign, FileCode, Check, Ban, ExternalLink, ArrowUpRight,
  Award, Compass, GraduationCap, Sparkles
} from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();

  // Authentication State
  const [user, setUser] = useState(null);

  // Active Dashboard Sub-Tab
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'resumes'/'jobs', 'applications'

  // Loading & Alert state
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  // Data lists
  const [resumes, setResumes] = useState([]); // Candidates CVs
  const [applications, setApplications] = useState([]); // Applications list
  const [employerJobs, setEmployerJobs] = useState([]); // Employer posted jobs

  // Form inputs for Profile
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCompanyName, setProfileCompanyName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileWebsite, setProfileWebsite] = useState('');
  const [profileDescription, setProfileDescription] = useState('');

  // Form inputs for Resumes CRUD Modal
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [cvEditingId, setCvEditingId] = useState(null);
  const [cvTitle, setCvTitle] = useState('');
  const [cvSummary, setCvSummary] = useState('');
  const [cvSkills, setCvSkills] = useState('');
  const [cvExperience, setCvExperience] = useState('');
  const [cvEducation, setCvEducation] = useState('');
  const [cvProjects, setCvProjects] = useState('');
  const [cvCertificates, setCvCertificates] = useState('');
  const [cvLanguages, setCvLanguages] = useState('');
  const [cvPortfolioUrl, setCvPortfolioUrl] = useState('');
  const [cvAvatarUrl, setCvAvatarUrl] = useState('');
  const [cvTemplate, setCvTemplate] = useState('template_1');

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

  // Form inputs for Jobs CRUD Modal
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobEditingId, setJobEditingId] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobCategoryId, setJobCategoryId] = useState('');
  const [globalCategories, setGlobalCategories] = useState([]);

  // Modal to view Applicant's CV details
  const [viewingCv, setViewingCv] = useState(null);

  // Interview scheduler modal states
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');

  // Verify and fetch dashboard data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !storedUser) {
      navigate('/auth');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Initialize profile forms
      setProfileName(parsedUser.name || '');
      setProfileAvatar(parsedUser.avatar || '');
      if (parsedUser.role === 'candidate' && parsedUser.candidate) {
        setProfilePhone(parsedUser.candidate.phone || '');
      }
      if (parsedUser.role === 'employer' && parsedUser.employer) {
        setProfileCompanyName(parsedUser.employer.company_name || '');
        setProfilePhone(parsedUser.employer.phone || '');
        setProfileLocation(parsedUser.employer.location || '');
        setProfileWebsite(parsedUser.employer.website || '');
        setProfileDescription(parsedUser.employer.description || '');
      }

      fetchDashboardData(parsedUser);
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/auth');
    }
  }, [navigate]);

  const fetchDashboardData = async (currentUser) => {
    setLoading(true);
    try {
      // Load global job categories
      try {
        const catResponse = await api.get('categories');
        if (catResponse && catResponse.success) {
          setGlobalCategories(catResponse.data || []);
        } else if (catResponse && Array.isArray(catResponse)) {
          setGlobalCategories(catResponse);
        }
      } catch (catErr) {
        console.error('Failed to load categories:', catErr);
      }

      if (currentUser.role === 'candidate') {
        // Fetch CVs list
        const cvResponse = await api.get('resumes');
        if (cvResponse && cvResponse.success) {
          setResumes(cvResponse.data || []);
        }

        // Fetch applications list
        const appResponse = await api.get('applications');
        if (appResponse && appResponse.success) {
          setApplications(appResponse.data || []);
        }
      } 
      
      else if (currentUser.role === 'employer') {
        const employerId = currentUser.employer?.id;
        
        // Fetch Employer's posted jobs
        if (employerId) {
          const jobsResponse = await api.get(`jobs?employer_id=${employerId}`);
          if (jobsResponse && jobsResponse.success) {
            // Check if paginated
            const list = jobsResponse.data?.data || jobsResponse.data || [];
            setEmployerJobs(list);
          }
        }

        // Fetch applications submitted to employer's jobs
        const appResponse = await api.get('applications');
        if (appResponse && appResponse.success) {
          // If response is paginated
          const list = appResponse.data?.data || appResponse.data || [];
          setApplications(list);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard records:', err);
      showAlert('rose', 'Không thể tải dữ liệu bảng điều khiển!');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg({ type: '', text: '' }), 5000);
  };

  // --- Profile Operations ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: profileName,
        avatar: profileAvatar,
        full_name: user.role === 'candidate' ? profileName : undefined,
        phone: profilePhone,
        company_name: user.role === 'employer' ? profileCompanyName : undefined,
        location: user.role === 'employer' ? profileLocation : undefined,
        website: user.role === 'employer' ? profileWebsite : undefined,
        description: user.role === 'employer' ? profileDescription : undefined,
      };

      const response = await api.put('auth/update-profile', payload);

      if (response && response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        showAlert('emerald', 'Cập nhật thông tin tài khoản thành công!');
      } else {
        showAlert('rose', response.message || 'Cập nhật thất bại.');
      }
    } catch (err) {
      showAlert('rose', err.message || 'Đã xảy ra lỗi hệ thống.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Resumes CRUD (Candidate Only) ---
  const handleSaveCv = async (e) => {
    e.preventDefault();
    if (!cvTitle) {
      showAlert('rose', 'Tiêu đề CV không được để trống!');
      return;
    }

    setActionLoading(true);
    const payload = {
      title: cvTitle,
      summary: cvSummary,
      skills: cvSkills,
      experience: cvExperience,
      education: cvEducation,
      projects: cvProjects,
      certificates: cvCertificates,
      languages: cvLanguages,
      portfolio_url: `${cvTemplate}|${cvPortfolioUrl}|${cvAvatarUrl}`,
    };

    try {
      let response;
      if (cvEditingId) {
        response = await api.put(`resumes/${cvEditingId}`, payload);
      } else {
        response = await api.post('resumes', payload);
      }

      if (response && response.success) {
        showAlert('emerald', cvEditingId ? 'Cập nhật CV thành công!' : 'Tạo hồ sơ CV mới thành công!');
        setCvModalOpen(false);
        clearCvForm();
        fetchDashboardData(user);
      } else {
        showAlert('rose', response.message || 'Lưu CV thất bại.');
      }
    } catch (err) {
      showAlert('rose', err.message || 'Đã xảy ra lỗi khi lưu CV.');
    } finally {
      setActionLoading(false);
    }
  };

  const openCvEdit = (cv) => {
    setCvEditingId(cv.id);
    setCvTitle(cv.title || '');
    setCvSummary(cv.summary || '');
    setCvSkills(cv.skills || '');
    setCvExperience(cv.experience || '');
    setCvEducation(cv.education || '');
    setCvProjects(cv.projects || '');
    setCvCertificates(cv.certificates || '');
    setCvLanguages(cv.languages || '');
    const parsed = parsePortfolioAndTemplate(cv.portfolio_url);
    setCvTemplate(parsed.template);
    setCvPortfolioUrl(parsed.url);
    setCvAvatarUrl(parsed.avatar || '');
    setCvModalOpen(true);
  };

  const clearCvForm = () => {
    setCvEditingId(null);
    setCvTitle('');
    setCvSummary('');
    setCvSkills('');
    setCvExperience('');
    setCvEducation('');
    setCvProjects('');
    setCvCertificates('');
    setCvLanguages('');
    setCvPortfolioUrl('');
    setCvAvatarUrl('');
    setCvTemplate('template_1');
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use Canvas to dynamically compress and resize client-side
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-performance JPEG with 0.75 quality (only ~6KB to 10KB)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setCvAvatarUrl(compressedBase64);
        showAlert('emerald', 'Tải và tối ưu hóa ảnh đại diện thành công!');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleProfileAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setProfileAvatar(compressedBase64);
        showAlert('emerald', 'Tải ảnh lên thành công! Đừng quên nhấn "Lưu Thay Đổi".');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCv = async (cvId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hồ sơ CV này?')) return;
    
    setActionLoading(true);
    try {
      const response = await api.delete(`resumes/${cvId}`);
      if (response && response.success) {
        showAlert('emerald', 'Đã xóa CV thành công!');
        fetchDashboardData(user);
      } else {
        showAlert('rose', response.message || 'Xóa thất bại.');
      }
    } catch (err) {
      showAlert('rose', err.message || 'Không thể xóa hồ sơ này.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Cancel Candidate Application ---
  const handleCancelApplication = async (appId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn ứng tuyển này?')) return;

    setActionLoading(true);
    try {
      const response = await api.delete(`applications/${appId}`);
      if (response && response.success) {
        showAlert('emerald', 'Hủy đơn ứng tuyển thành công!');
        fetchDashboardData(user);
      } else {
        showAlert('rose', response.message || 'Hủy thất bại.');
      }
    } catch (err) {
      showAlert('rose', err.message || 'Không thể hủy đơn ứng tuyển đã được nhà tuyển dụng xét duyệt.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Employer Jobs CRUD ---
  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription || !jobLocation || !jobCategoryId) {
      showAlert('rose', 'Vui lòng nhập đầy đủ tiêu đề, mô tả, địa điểm và chọn danh mục!');
      return;
    }

    setActionLoading(true);
    const payload = {
      title: jobTitle,
      description: jobDescription,
      salary: jobSalary ? parseFloat(jobSalary) : null,
      location: jobLocation,
      category_id: jobCategoryId ? parseInt(jobCategoryId) : null,
    };

    try {
      let response;
      if (jobEditingId) {
        response = await api.put(`jobs/${jobEditingId}`, payload);
      } else {
        response = await api.post('jobs', payload);
      }

      if (response && response.success) {
        showAlert('emerald', jobEditingId ? 'Cập nhật việc làm thành công!' : 'Đăng việc làm mới thành công!');
        setJobModalOpen(false);
        clearJobForm();
        fetchDashboardData(user);
      } else {
        showAlert('rose', response.message || 'Lưu việc làm thất bại.');
      }
    } catch (err) {
      showAlert('rose', err.message || 'Đã xảy ra lỗi khi lưu việc làm.');
    } finally {
      setActionLoading(false);
    }
  };

  const openJobEdit = (job) => {
    setJobEditingId(job.id);
    setJobTitle(job.title || '');
    setJobDescription(job.description || '');
    setJobSalary(job.salary || '');
    setJobLocation(job.location || '');
    setJobCategoryId(job.category_id || '');
    setJobModalOpen(true);
  };

  const clearJobForm = () => {
    setJobEditingId(null);
    setJobTitle('');
    setJobDescription('');
    setJobSalary('');
    setJobLocation('');
    setJobCategoryId('');
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này? Các đơn ứng tuyển liên quan sẽ bị xóa!')) return;

    setActionLoading(true);
    try {
      const response = await api.delete(`jobs/${jobId}`);
      if (response && response.success) {
        showAlert('emerald', 'Xóa tin tuyển dụng thành công!');
        fetchDashboardData(user);
      } else {
        showAlert('rose', response.message || 'Xóa thất bại.');
      }
    } catch (err) {
      showAlert('rose', err.message || 'Không thể xóa tin tuyển dụng này.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Employer Applications Status Update ---
  const handleUpdateAppStatus = async (appId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await api.put(`applications/${appId}`, { status: newStatus });
      if (response && response.success) {
        showAlert('emerald', `Đã cập nhật trạng thái đơn ứng tuyển thành: ${newStatus === 'accepted' ? 'Chấp nhận' : 'Từ chối'}!`);
        fetchDashboardData(user);
      } else {
        showAlert('rose', response.message || 'Cập nhật thất bại.');
      }
    } catch (err) {
      showAlert('rose', err.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Employer Approve Application with Interview Schedule ---
  const handleApproveWithInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setActionLoading(true);
    setInterviewModalOpen(false);

    try {
      const response = await api.put(`applications/${selectedApp.id}`, { status: 'accepted' });
      if (response && response.success) {
        showAlert('emerald', 'Đã duyệt nhận ứng viên thành công! Đang chuẩn bị mở hộp thư gửi lịch hẹn...');

        // Construct pre-filled email to candidate via native Mailto client
        const candidateEmail = selectedApp.candidate?.user?.email || '';
        const candidateName = selectedApp.candidate?.full_name || 'Ứng viên';
        const jobTitle = selectedApp.job?.title || 'Vị trí tuyển dụng';
        const companyName = user.employer?.company_name || 'Công ty chúng tôi';

        const subject = encodeURIComponent(`[JobHunt] Thư mời phỏng vấn vị trí ${jobTitle} - ${companyName}`);
        const body = encodeURIComponent(
          `Chào ${candidateName},\n\n` +
          `Cảm ơn bạn đã nộp hồ sơ ứng tuyển vị trí ${jobTitle} tại ${companyName}.\n\n` +
          `Chúng tôi rất ấn tượng với CV của bạn và trân trọng kính mời bạn tham gia buổi phỏng vấn trực tiếp:\n` +
          `- Thời gian: ${interviewDate}\n` +
          `- Địa điểm: ${interviewLocation}\n` +
          `- Lời nhắn của nhà tuyển dụng: ${interviewNotes}\n\n` +
          `Vui lòng phản hồi email này hoặc liên hệ qua số điện thoại để xác nhận lịch hẹn phỏng vấn nhé.\n\n` +
          `Trân trọng,\n` +
          `${companyName}`
        );

        const mailtoUrl = `mailto:${candidateEmail}?subject=${subject}&body=${body}`;
        
        // Open native mail app in new window/tab
        window.open(mailtoUrl, '_blank');

        fetchDashboardData(user);
      } else {
        showAlert('rose', response.message || 'Cập nhật trạng thái thất bại.');
      }
    } catch (err) {
      showAlert('rose', err.message || 'Có lỗi xảy ra khi phê duyệt ứng viên.');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper formatting functions
  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
            <CheckCircle className="w-3.5 h-3.5" /> Được chấp nhận
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-100">
            <XCircle className="w-3.5 h-3.5" /> Bị từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
            <Clock className="w-3.5 h-3.5" /> Đang chờ duyệt
          </span>
        );
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            <div>
              <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-full uppercase tracking-wider mb-2 inline-block">
                Bảng điều khiển {user.role === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                Xin chào, {user.role === 'employer' && user.employer ? user.employer.company_name : user.name}!
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-1">
                {user.role === 'employer' 
                  ? 'Quản lý thông tin công ty, các tin tuyển dụng và phê duyệt ứng viên ứng tuyển.' 
                  : 'Xây dựng CV chuyên nghiệp, nộp đơn tìm việc và theo dõi kết quả ứng tuyển.'}
              </p>
            </div>

            {user.role === 'employer' ? (
              <button
                onClick={() => { clearJobForm(); setJobModalOpen(true); }}
                className="w-full sm:w-auto py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-5 h-5" /> Đăng tuyển việc làm
              </button>
            ) : (
              <button
                onClick={() => { clearCvForm(); setCvModalOpen(true); }}
                className="w-full sm:w-auto py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-5 h-5" /> Tạo CV mới
              </button>
            )}
          </div>

          {/* Toast alerts */}
          {alertMsg.text && (
            <div className={`p-4 rounded-xl text-sm font-medium border mb-6 transition-all duration-300 ${
              alertMsg.type === 'emerald' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {alertMsg.text}
            </div>
          )}

          {/* Recruitment Notification Center for Candidates */}
          {user.role === 'candidate' && applications.length > 0 && (
            <div className="space-y-4 mb-6">
              {applications
                .filter((app) => app.status === 'accepted' || app.status === 'rejected')
                .map((app) => (
                  <div
                    key={`notif-${app.id}`}
                    className={`p-5 rounded-2xl border text-sm font-semibold flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 ${
                      app.status === 'accepted'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50/70 text-rose-800 border-rose-100'
                    }`}
                  >
                    {app.status === 'accepted' ? (
                      <>
                        <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm shrink-0">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-base text-emerald-950">🎉 ĐƠN ỨNG TUYỂN ĐÃ ĐƯỢC DUYỆT NHẬN!</h4>
                          <p className="font-medium text-slate-700">
                            Chúc mừng! Nhà tuyển dụng <strong className="text-slate-900 font-extrabold">{app.job?.employer?.company_name || 'Công ty đối tác'}</strong> đã phê duyệt hồ sơ ứng tuyển của bạn cho vị trí <strong className="text-indigo-600 font-extrabold">{app.job?.title}</strong>.
                          </p>
                          <p className="text-xs text-emerald-700 font-bold mt-1">
                            * Nhà tuyển dụng đã lên lịch hẹn. Vui lòng check Gmail của bạn để xác nhận ngày giờ phỏng vấn chi tiết!
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-rose-500 text-white rounded-lg shadow-sm shrink-0">
                          <XCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-base text-rose-950">💼 Cập nhật đơn ứng tuyển</h4>
                          <p className="font-medium text-slate-700">
                            Đơn ứng tuyển vị trí <strong className="text-slate-900 font-bold">{app.job?.title}</strong> tại <strong className="text-slate-900 font-bold">{app.job?.employer?.company_name || 'Nhà tuyển dụng'}</strong> đã được xem xét và từ chối ở thời điểm hiện tại.
                          </p>
                          <p className="text-xs text-rose-600 font-bold mt-1">
                            * Đừng nản lòng! Hãy tiếp tục trau dồi kỹ năng, cập nhật CV trực tuyến và nắm bắt những cơ hội hấp dẫn khác trên JobHunt nhé!
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Grid Layout tabs and contents */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 border ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                    : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border-slate-100'
                }`}
              >
                <Settings className="w-4.5 h-4.5" /> Thông tin cá nhân
              </button>

              {user.role === 'candidate' ? (
                <>
                  <button
                    onClick={() => setActiveTab('resumes')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 border ${
                      activeTab === 'resumes'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <FileText className="w-4.5 h-4.5" /> Hồ sơ CV trực tuyến ({resumes.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('cv_templates')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 border ${
                      activeTab === 'cv_templates'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <Sparkles className="w-4.5 h-4.5 text-indigo-500" /> Mẫu CV Đẹp Sẵn Có
                  </button>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 border ${
                      activeTab === 'applications'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <Briefcase className="w-4.5 h-4.5" /> Lịch sử ứng tuyển ({applications.length})
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 border ${
                      activeTab === 'jobs'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <Briefcase className="w-4.5 h-4.5" /> Công việc đã đăng ({employerJobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 border ${
                      activeTab === 'applications'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <FileText className="w-4.5 h-4.5" /> Đơn ứng tuyển nhận được ({applications.length})
                  </button>
                </>
              )}
            </div>

            {/* Right Side Contents Panel */}
            <div className="lg:col-span-9">
              {loading ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
                  <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-sm text-slate-400 mt-2 font-semibold">Đang tải dữ liệu...</p>
                </div>
              ) : (
                <>
                  {/* --- TAB: Profile settings --- */}
                  {activeTab === 'profile' && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Cập nhật thông tin cá nhân</h3>
                      
                      <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                        
                        {/* Avatar Upload UI */}
                        <div className="space-y-2 pb-4">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ảnh đại diện / Logo</label>
                          <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-sm overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                              {profileAvatar ? (
                                <img src={profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-10 h-10 text-slate-300" />
                              )}
                            </div>
                            <div>
                              <label className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-sm rounded-xl cursor-pointer transition-colors inline-block">
                                Chọn Ảnh
                                <input type="file" className="hidden" accept="image/*" onChange={handleProfileAvatarChange} />
                              </label>
                              <p className="text-xs text-slate-400 mt-2">Định dạng JPG, PNG. Kích thước tối đa 2MB.</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Họ và tên</label>
                          <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Địa chỉ Email (Đăng nhập)</label>
                          <input
                            type="email"
                            value={user.email}
                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none font-semibold text-slate-400 cursor-not-allowed"
                            disabled
                          />
                        </div>

                        {user.role === 'candidate' && (
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại liên lạc</label>
                            <input
                              type="tel"
                              value={profilePhone}
                              onChange={(e) => setProfilePhone(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                              required
                            />
                          </div>
                        )}

                        {user.role === 'employer' && (
                          <>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tên công ty / Doanh nghiệp</label>
                              <input
                                type="text"
                                value={profileCompanyName}
                                onChange={(e) => setProfileCompanyName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại liên lạc</label>
                              <input
                                type="tel"
                                value={profilePhone}
                                onChange={(e) => setProfilePhone(e.target.value)}
                                placeholder="Ví dụ: 0901234567"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Địa chỉ trụ sở</label>
                              <input
                                type="text"
                                value={profileLocation}
                                onChange={(e) => setProfileLocation(e.target.value)}
                                placeholder="Ví dụ: Tòa nhà Bitexco, Quận 1, TP.HCM"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website công ty</label>
                              <input
                                type="url"
                                value={profileWebsite}
                                onChange={(e) => setProfileWebsite(e.target.value)}
                                placeholder="Ví dụ: https://congtycuatoi.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Giới thiệu doanh nghiệp</label>
                              <textarea
                                value={profileDescription}
                                onChange={(e) => setProfileDescription(e.target.value)}
                                placeholder="Mô tả ngắn gọn về quy mô, lĩnh vực hoạt động..."
                                rows="4"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                              />
                            </div>
                          </>
                        )}

                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 disabled:bg-slate-300"
                        >
                          {actionLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* --- TAB: Candidate CVs CRUD --- */}
                  {activeTab === 'resumes' && user.role === 'candidate' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="text-lg font-bold text-slate-800">Quản lý danh sách CV của bạn</h3>
                          <button
                            onClick={() => { clearCvForm(); setCvModalOpen(true); }}
                            className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" /> Tạo CV
                          </button>
                        </div>

                        {resumes.length === 0 ? (
                          <div className="text-center py-12 text-slate-400 space-y-2">
                            <FileText className="w-12 h-12 mx-auto text-slate-300" />
                            <p className="font-semibold text-sm">Bạn chưa tạo hồ sơ CV nào!</p>
                            <p className="text-xs">Hãy tạo một CV trực tuyến ngay để bắt đầu tìm kiếm những việc làm hấp dẫn nhất.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {resumes.map((cv) => (
                              <div key={cv.id} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 hover:border-indigo-200 hover:bg-white transition-all space-y-4 group">
                                <div>
                                  <h4 className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">{cv.title}</h4>
                                  <p className="text-xs text-slate-400 mt-1">Cập nhật lúc: {new Date(cv.updated_at).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div className="flex justify-end gap-2 border-t border-slate-200/50 pt-3">
                                  <button
                                    onClick={() => {
                                      setViewingCv({
                                        full_name: user.name,
                                        phone: user.candidate?.phone || '',
                                        user: { email: user.email },
                                        resumes: [cv]
                                      });
                                    }}
                                    className="mr-auto px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                                    title="Xem trước mẫu CV"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> Xem CV
                                  </button>
                                  <button
                                    onClick={() => openCvEdit(cv)}
                                    className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                                    title="Sửa hồ sơ CV"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCv(cv.id)}
                                    disabled={actionLoading}
                                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                                    title="Xóa hồ sơ CV"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- TAB: Candidate Applications history --- */}
                  {activeTab === 'applications' && user.role === 'candidate' && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Lịch sử các công việc đã ứng tuyển</h3>

                      {applications.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 space-y-2">
                          <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
                          <p className="font-semibold text-sm">Bạn chưa nộp đơn ứng tuyển nào!</p>
                          <p className="text-xs">Tìm kiếm các cơ hội việc làm thích hợp ngay tại trang chủ JobHunt.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                              <tr>
                                <th className="px-6 py-4">Vị trí công việc</th>
                                <th className="px-6 py-4">Công ty</th>
                                <th className="px-6 py-4">Mức lương</th>
                                <th className="px-6 py-4">Ngày ứng tuyển</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Hành động</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/50">
                                  <td className="px-6 py-4 font-bold text-slate-800">
                                    <Link to={`/jobs/${app.job_id}`} className="hover:text-indigo-600">{app.job?.title || 'Công việc đã đóng'}</Link>
                                  </td>
                                  <td className="px-6 py-4 font-semibold text-slate-600">{app.job?.employer?.company_name || 'Tuyển dụng trực tiếp'}</td>
                                  <td className="px-6 py-4 text-emerald-600 font-bold">{app.job?.salary ? `${app.job.salary} Tr VNĐ` : 'Thỏa thuận'}</td>
                                  <td className="px-6 py-4 text-slate-400 font-medium">{new Date(app.created_at).toLocaleDateString('vi-VN')}</td>
                                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                  <td className="px-6 py-4">
                                    {app.status === 'pending' ? (
                                      <button
                                        onClick={() => handleCancelApplication(app.id)}
                                        disabled={actionLoading}
                                        className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-100"
                                      >
                                        Hủy đơn
                                      </button>
                                    ) : (
                                      <span className="text-xs font-semibold text-slate-400">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- TAB: Candidate CV Templates Gallery --- */}
                  {activeTab === 'cv_templates' && user.role === 'candidate' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div>
                          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" /> Kho Mẫu CV Thiết Kế Đẹp Sẵn Có
                          </h3>
                          <p className="text-xs text-slate-400 font-bold mt-1">
                            Chọn mẫu CV được Top nhà tuyển dụng ưa thích, bấm chọn dùng mẫu để bắt đầu điền thông tin nhanh chóng!
                          </p>
                        </div>

                        {/* Visual grid matching vieclam24h template list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            { 
                              id: 'template_1', 
                              name: 'Đảo Phú Quý', 
                              themeName: 'Cam Năng Động',
                              colorBg: 'bg-orange-500', 
                              tag: 'Đơn giản',
                              desc: 'Vieclam24h Signature Style',
                              previewColors: ['bg-orange-500', 'bg-slate-50', 'bg-slate-100'],
                            },
                            { 
                              id: 'template_2', 
                              name: 'Đảo Phú Quốc', 
                              themeName: 'Navy Lịch Lãm',
                              colorBg: 'bg-indigo-950', 
                              tag: 'Chuyên nghiệp',
                              desc: 'Executive Slate Blue',
                              previewColors: ['bg-indigo-950', 'bg-slate-50', 'bg-indigo-50'],
                            },
                            { 
                              id: 'template_3', 
                              name: 'Đảo Nam Du', 
                              themeName: 'Emerald Tươi Trẻ',
                              colorBg: 'bg-emerald-600', 
                              tag: 'Hiện đại',
                              desc: 'Modern Emerald Tech Grid',
                              previewColors: ['bg-emerald-700', 'bg-slate-50', 'bg-emerald-50'],
                            },
                            { 
                              id: 'template_4', 
                              name: 'Đảo Bình Ba', 
                              themeName: 'Charcoal Sang Trọng',
                              colorBg: 'bg-slate-800 border-b-2 border-amber-500', 
                              tag: 'Sáng tạo',
                              desc: 'Luxury Gold Minimalist',
                              previewColors: ['bg-slate-900', 'bg-slate-50', 'bg-amber-50'],
                            },
                          ].map((temp) => (
                            <div 
                              key={temp.id} 
                              className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden hover:shadow-xl hover:border-indigo-250 transition-all duration-300 group flex flex-col justify-between h-[360px] relative"
                            >
                              {/* CV Template Visual Card Mock */}
                              <div className="p-4 bg-slate-50 border-b border-slate-100 flex-1 flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-2 right-2 bg-indigo-650 bg-indigo-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10">
                                  NEW
                                </div>

                                {/* Mock Layout representation of the CV template */}
                                <div className="w-full h-full bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col relative group-hover:scale-[1.02] transition-transform duration-300">
                                  {/* Header Mock */}
                                  <div className={`h-12 ${temp.colorBg} flex items-center justify-between px-3 text-[8px] font-black text-white/95`}>
                                    <div className="space-y-0.5">
                                      <div className="w-14 h-1.5 bg-white/30 rounded"></div>
                                      <div className="w-8 h-1 bg-white/20 rounded"></div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-white/25 border border-white/25"></div>
                                  </div>

                                  {/* Content Mock */}
                                  <div className="p-3 flex-1 space-y-2 text-[6px]">
                                    <div className="space-y-1 text-left">
                                      <div className="w-12 h-1 bg-slate-300 rounded"></div>
                                      <div className="w-full h-8 bg-slate-50 border border-slate-100 rounded-lg p-1.5 space-y-1">
                                        <div className="w-full h-1 bg-slate-200 rounded"></div>
                                        <div className="w-3/4 h-1 bg-slate-200 rounded"></div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-1 text-left">
                                      <div className="w-10 h-1 bg-slate-300 rounded"></div>
                                      <div className="flex flex-wrap gap-1">
                                        <div className="w-8 h-2 bg-slate-100 border border-slate-200 rounded"></div>
                                        <div className="w-6 h-2 bg-slate-100 border border-slate-200 rounded"></div>
                                        <div className="w-10 h-2 bg-slate-100 border border-slate-200 rounded"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Footer details */}
                              <div className="p-4 bg-white space-y-3">
                                <div>
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-extrabold text-sm text-slate-800">{temp.name}</h4>
                                    <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold rounded-lg">
                                      {temp.tag}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-bold mt-1 text-left">{temp.desc}</p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    clearCvForm();
                                    setCvTemplate(temp.id);
                                    setCvTitle(`Hồ sơ ${temp.themeName} - ${user.name}`);
                                    setCvModalOpen(true);
                                  }}
                                  className="w-full py-2.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1 group-hover:translate-y-[-2px]"
                                >
                                  Dùng mẫu này & Điền thông tin
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB: Employer Posted Jobs CRUD --- */}
                  {activeTab === 'jobs' && user.role === 'employer' && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h3 className="text-lg font-bold text-slate-800">Quản lý công việc đã đăng tuyển</h3>
                        <button
                          onClick={() => { clearJobForm(); setJobModalOpen(true); }}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Đăng tuyển mới
                        </button>
                      </div>

                      {employerJobs.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 space-y-2">
                          <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
                          <p className="font-semibold text-sm">Bạn chưa đăng tin tuyển dụng nào!</p>
                          <p className="text-xs">Đăng tuyển dụng ngay hôm nay để tuyển chọn hàng trăm ứng viên tiềm năng.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {employerJobs.map((job) => (
                            <div key={job.id} className="border border-slate-200/60 rounded-2xl p-5 hover:border-indigo-200 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                              <div className="space-y-2">
                                <h4 className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors flex flex-wrap items-center gap-2">
                                  <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                                  {job.category && (
                                    <span className="inline-block px-2.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-150 border-orange-200/50 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                      {job.category.name}
                                    </span>
                                  )}
                                </h4>
                                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
                                  <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                                  <span className="flex items-center gap-0.5"><DollarSign className="w-3.5 h-3.5" /> {job.salary ? `${job.salary} triệu VNĐ` : 'Thỏa thuận'}</span>
                                  <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {new Date(job.created_at).toLocaleDateString('vi-VN')}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                                <button
                                  onClick={() => openJobEdit(job)}
                                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                                  title="Chỉnh sửa tin tuyển dụng"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(job.id)}
                                  disabled={actionLoading}
                                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                                  title="Xóa tin tuyển dụng"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- TAB: Employer incoming applications management --- */}
                  {activeTab === 'applications' && user.role === 'employer' && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Đơn ứng tuyển từ ứng viên</h3>

                      {applications.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 space-y-2">
                          <FileText className="w-12 h-12 mx-auto text-slate-300" />
                          <p className="font-semibold text-sm">Chưa nhận được đơn ứng tuyển nào!</p>
                          <p className="text-xs">Tin tuyển dụng của bạn đang hoạt động, các hồ sơ CV mới sẽ hiển thị tại đây.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                              <tr>
                                <th className="px-6 py-4">Ứng viên</th>
                                <th className="px-6 py-4">Số điện thoại</th>
                                <th className="px-6 py-4">Vị trí công việc</th>
                                <th className="px-6 py-4">Ngày nộp</th>
                                <th className="px-6 py-4">Hồ sơ CV</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Hành động phê duyệt</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/50">
                                  <td className="px-6 py-4 font-bold text-slate-800">{app.candidate?.full_name || 'Ứng viên'}</td>
                                  <td className="px-6 py-4 font-semibold text-slate-600">{app.candidate?.phone || '-'}</td>
                                  <td className="px-6 py-4 font-bold text-slate-800">
                                    <Link to={`/jobs/${app.job_id}`} className="hover:text-indigo-600">{app.job?.title || 'Tin đã xóa'}</Link>
                                  </td>
                                  <td className="px-6 py-4 text-slate-400 font-medium">{new Date(app.created_at).toLocaleDateString('vi-VN')}</td>
                                  <td className="px-6 py-4">
                                    {/* View CV action */}
                                    <button
                                      onClick={() => {
                                        // Retrieve the candidate's CV details.
                                        // The backend applications endpoint might not contain a deep resume, but we can search candidate resumes.
                                        // Let's create an elegant inline preview of candidate details based on candidate data, or fetch candidate CVs if available.
                                        // To handle this nicely, let's preview candidate details immediately.
                                        setViewingCv(app.candidate);
                                      }}
                                      className="px-2.5 py-1.5 bg-indigo-55 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 flex items-center gap-1 hover:bg-indigo-100"
                                    >
                                      <Eye className="w-3.5 h-3.5" /> Xem CV
                                    </button>
                                  </td>
                                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                  <td className="px-6 py-4 flex gap-2">
                                    {app.status === 'pending' ? (
                                      <>
                                        <button
                                          onClick={() => {
                                            setSelectedApp(app);
                                            setInterviewDate('');
                                            setInterviewLocation('');
                                            setInterviewNotes('');
                                            setInterviewModalOpen(true);
                                          }}
                                          disabled={actionLoading}
                                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors border border-emerald-100"
                                          title="Duyệt nhận ứng viên & đặt lịch phỏng vấn"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                                          disabled={actionLoading}
                                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100"
                                          title="Từ chối ứng tuyển"
                                        >
                                          <Ban className="w-4 h-4" />
                                        </button>
                                      </>
                                    ) : (
                                      <span className="text-xs text-slate-400 font-medium">Đã xét duyệt</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                </>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* --- MODAL: CANDIDATE CV BUILDER (Create / Edit) --- */}
      {cvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-800">
                {cvEditingId ? 'Cập nhật hồ sơ CV trực tuyến' : 'Tạo mới hồ sơ CV trực tuyến'}
              </h3>
              <button
                onClick={() => setCvModalOpen(false)}
                className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCv} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Tiêu đề CV / Vị trí mong muốn *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nhân viên lập trình React, UI Designer"
                    value={cvTitle}
                    onChange={(e) => setCvTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Link Portfolio cá nhân (Nếu có)</label>
                  <input
                    type="url"
                    placeholder="https://myportfolio.com"
                    value={cvPortfolioUrl}
                    onChange={(e) => setCvPortfolioUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  />
                </div>
              </div>

              {/* Avatar Selector and Upload */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <label className="text-xs font-bold text-slate-650 block text-slate-700">Hình ảnh đại diện trên CV *</label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Current Avatar preview */}
                  <div className="w-16 h-16 rounded-full border-2 border-indigo-500 bg-white flex items-center justify-center text-slate-400 font-extrabold text-sm shrink-0 shadow-sm relative overflow-hidden">
                    {cvAvatarUrl ? (
                      <img src={cvAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      'Ảnh'
                    )}
                  </div>

                  <div className="space-y-2 w-full">
                    {/* File Upload Selector */}
                    <div className="flex flex-wrap gap-2">
                      <label className="cursor-pointer py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm">
                        Tải ảnh từ máy tính
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                          className="hidden"
                        />
                      </label>
                      
                      {cvAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setCvAvatarUrl('')}
                          className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-all"
                        >
                          Xóa ảnh
                        </button>
                      )}
                    </div>
                    
                    <p className="text-[10px] text-slate-400 font-bold leading-tight">Chấp nhận định dạng ảnh phổ biến. Giới hạn dung lượng dưới 200KB.</p>
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hoặc chọn ảnh chuyên nghiệp có sẵn:</span>
                  <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                    {[
                      { id: 'av_1', label: 'Nam Công Sở', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' },
                      { id: 'av_2', label: 'Nữ Công Sở', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150' },
                      { id: 'av_3', label: 'Nam Lịch Lãm', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
                      { id: 'av_4', label: 'Nữ Quản Lý', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150' },
                      { id: 'av_5', label: 'Nam Năng Động', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150' },
                      { id: 'av_6', label: 'Nữ Năng Động', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150' }
                    ].map((av, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCvAvatarUrl(av.url)}
                        className={`w-10 h-10 rounded-full shrink-0 border-2 overflow-hidden transition-all hover:scale-105 ${
                          cvAvatarUrl === av.url ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white hover:border-slate-300'
                        }`}
                        title={av.label}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct URL input as fallback */}
                <div className="space-y-1 pt-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hoặc dán trực tiếp đường dẫn ảnh (URL):</span>
                  <input
                    type="url"
                    placeholder="https://example.com/my-photo.jpg"
                    value={cvAvatarUrl.startsWith('data:') ? '' : cvAvatarUrl}
                    onChange={(e) => setCvAvatarUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-700"
                  />
                </div>
              </div>

              {/* CV Template Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 block">Chọn mẫu thiết kế CV đẹp mắt *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'template_1', name: 'Cam Năng Động', colorBg: 'bg-orange-500', desc: 'Vieclam24h Style' },
                    { id: 'template_2', name: 'Navy Lịch Lãm', colorBg: 'bg-indigo-950', desc: 'Elegant Navy' },
                    { id: 'template_3', name: 'Emerald Tươi Trẻ', colorBg: 'bg-emerald-600', desc: 'Modern Emerald' },
                    { id: 'template_4', name: 'Charcoal Sang Trọng', colorBg: 'bg-slate-800 border-b border-amber-500', desc: 'Luxury Charcoal' },
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      type="button"
                      onClick={() => setCvTemplate(temp.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-20 ${
                        cvTemplate === temp.id
                          ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`w-3.5 h-3.5 rounded-full ${temp.colorBg} shadow-sm`}></span>
                        {cvTemplate === temp.id && (
                          <span className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800 leading-tight">{temp.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">{temp.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Tóm tắt mục tiêu nghề nghiệp</label>
                <textarea
                  placeholder="Mô tả tóm tắt kỹ năng chính và mong muốn phát triển sự nghiệp của bạn..."
                  rows={2}
                  value={cvSummary}
                  onChange={(e) => setCvSummary(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Kỹ năng cốt lõi (Skills)</label>
                  <textarea
                    placeholder="Ví dụ: HTML, CSS, JavaScript, React, teamwork..."
                    rows={3}
                    value={cvSkills}
                    onChange={(e) => setCvSkills(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Kinh nghiệm làm việc (Experience)</label>
                  <textarea
                    placeholder="Ví dụ: 06/2024 - Hiện tại: Developer tại ABC Corp..."
                    rows={3}
                    value={cvExperience}
                    onChange={(e) => setCvExperience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Học vấn (Education)</label>
                  <textarea
                    placeholder="Ví dụ: Đại học Công nghệ Thông tin (2020 - 2024)..."
                    rows={2}
                    value={cvEducation}
                    onChange={(e) => setCvEducation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Dự án thực tế (Projects)</label>
                  <textarea
                    placeholder="Ví dụ: Xây dựng hệ thống quản lý tuyển dụng bằng Laravel..."
                    rows={2}
                    value={cvProjects}
                    onChange={(e) => setCvProjects(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Chứng chỉ đạt được (Certificates)</label>
                  <textarea
                    placeholder="Ví dụ: IELTS 6.5, TOEIC 750..."
                    rows={2}
                    value={cvCertificates}
                    onChange={(e) => setCvCertificates(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Ngoại ngữ (Languages)</label>
                  <textarea
                    placeholder="Tiếng Anh (Trôi chảy), Tiếng Nhật (Cơ bản)..."
                    rows={2}
                    value={cvLanguages}
                    onChange={(e) => setCvLanguages(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCvModalOpen(false)}
                  className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-200 disabled:bg-indigo-400"
                >
                  {actionLoading ? 'Đang lưu...' : 'Lưu Hồ Sơ CV'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EMPLOYER JOB CREATOR / EDITOR --- */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-800">
                {jobEditingId ? 'Cập nhật tin tuyển dụng' : 'Đăng mới tin tuyển dụng'}
              </h3>
              <button
                onClick={() => setJobModalOpen(false)}
                className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Chức danh / Vị trí việc làm *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lập trình viên PHP/Laravel Senior"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Danh mục nhóm ngành nghề tuyển dụng *</label>
                <select
                  value={jobCategoryId}
                  onChange={(e) => setJobCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  required
                >
                  <option value="">-- Chọn danh mục ngành nghề --</option>
                  {globalCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Mức lương tối thiểu (Triệu VNĐ/tháng)</label>
                  <input
                    type="number"
                    placeholder="Ví dụ: 15, 20... Để trống nếu thỏa thuận"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Địa điểm tuyển dụng *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Mô tả công việc & Yêu cầu tuyển dụng *</label>
                <textarea
                  placeholder="Nhập chi tiết nhiệm vụ công việc, yêu cầu kỹ năng, kinh nghiệm và các chế độ đãi ngộ..."
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-200 disabled:bg-indigo-400"
                >
                  {actionLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EMPLOYER VIEWING CANDIDATE CV PREVIEW --- */}
      {viewingCv && (() => {
        const getTemplateStyles = (templateName) => {
          switch (templateName) {
            case 'template_2': // Canva Black White Minimalist (Exactly like screenshot)
              return {
                headerBg: 'bg-[#2c353f] text-white',
                sidebarBg: 'bg-[#2c353f] text-slate-100 border-r border-[#242b33]',
                accentText: 'text-[#2c353f]',
                sectionBorder: 'border-l-2 border-[#2c353f]',
                badgeBg: 'bg-slate-50 text-slate-800 border border-slate-200',
                dividerColor: 'border-slate-200',
                iconBg: 'bg-slate-100 text-slate-700',
                label: 'Canva Minimalist'
              };
            case 'template_3': // Emerald Nam Du
              return {
                headerBg: 'bg-[#1a382e] text-white',
                sidebarBg: 'bg-[#1a382e] text-emerald-50 border-r border-[#132b23]',
                accentText: 'text-[#1a382e]',
                sectionBorder: 'border-l-2 border-[#1a382e]',
                badgeBg: 'bg-emerald-50 text-emerald-950 border border-emerald-100',
                dividerColor: 'border-slate-200',
                iconBg: 'bg-emerald-50 text-emerald-700',
                label: 'Đảo Nam Du (Emerald)'
              };
            case 'template_4': // Luxury Charcoal & Gold
              return {
                headerBg: 'bg-slate-900 text-white border-b-4 border-amber-500',
                sidebarBg: 'bg-slate-950 text-amber-50/90 border-r border-slate-900',
                accentText: 'text-amber-600',
                sectionBorder: 'border-l-2 border-amber-500',
                badgeBg: 'bg-amber-50 text-amber-950 border border-amber-200/50',
                dividerColor: 'border-slate-200',
                iconBg: 'bg-amber-50 text-amber-700',
                label: 'Đảo Bình Ba (Charcoal)'
              };
            case 'template_1': // Orange Signature
            default:
              return {
                headerBg: 'bg-orange-500 text-white',
                sidebarBg: 'bg-orange-600 text-white border-r border-orange-700/35',
                accentText: 'text-orange-600',
                sectionBorder: 'border-l-2 border-orange-500',
                badgeBg: 'bg-orange-50 text-orange-850 border border-orange-100',
                dividerColor: 'border-slate-200',
                iconBg: 'bg-orange-50 text-orange-600',
                label: 'Đảo Phú Quý (Cam)'
              };
          }
        };

        const cv = (viewingCv.resumes && viewingCv.resumes[0]) || null;
        const parsed = parsePortfolioAndTemplate(cv?.portfolio_url);
        const currentTemplate = parsed.template || 'template_1';
        const styles = getTemplateStyles(currentTemplate);
        
        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 relative border border-slate-100 flex flex-col justify-between">
              
              {/* Canva Header (Full Screen Controls) */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center shrink-0">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  ✨ Thiết kế CV trực tuyến • {styles.label}
                </span>
                <button
                  onClick={() => setViewingCv(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all"
                  title="Đóng"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* CV Body Content - 100% Canva-Identical Split Grid Layout */}
              <div className="bg-white text-slate-700 text-left flex-1 overflow-y-auto">
                {cv ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 min-h-[600px] border-b border-slate-100">
                    
                    {/* LEFT PANEL (Canva Dark Sidebar - 4 cols / 1/3 width) */}
                    <div className={`${styles.sidebarBg} md:col-span-4 p-8 space-y-6 text-sm flex flex-col justify-start`}>
                      
                      {/* Round Avatar with Border */}
                      <div className="text-center pb-4 mb-4">
                        <div className="w-24 h-24 rounded-full mx-auto bg-white/10 border-[3px] border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-lg overflow-hidden relative">
                          {parsed.avatar ? (
                            <img src={parsed.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            viewingCv.full_name?.split(' ').slice(-1)[0]?.toUpperCase() || 'CV'
                          )}
                        </div>
                      </div>

                      {/* Contact Section */}
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-black tracking-widest text-white uppercase border-b border-white/20 pb-1 mb-2">
                          CONTACT
                        </h4>
                        <div className="space-y-2 text-[11px] text-white/85 font-bold leading-normal">
                          <div>
                            <span className="block text-[8px] text-white/50 uppercase tracking-wider font-extrabold">Phone</span>
                            <span className="text-xs">{viewingCv.phone || 'Chưa cập nhật'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-white/50 uppercase tracking-wider font-extrabold">Email</span>
                            <span className="text-xs break-all">{viewingCv.user?.email || 'Chưa cập nhật'}</span>
                          </div>
                          {parsed.url && (
                            <div>
                              <span className="block text-[8px] text-white/50 uppercase tracking-wider font-extrabold">Portfolio</span>
                              <a href={parsed.url} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-white/100 text-white/90 break-all">{parsed.url}</a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Education Section */}
                      {cv.education && (
                        <div className="space-y-3">
                          <h4 className="text-[11px] font-black tracking-widest text-white uppercase border-b border-white/20 pb-1 mb-2">
                            EDUCATION
                          </h4>
                          <div className="text-[11px] text-white/85 font-medium whitespace-pre-line leading-relaxed">
                            {cv.education}
                          </div>
                        </div>
                      )}

                      {/* Expertise / Core Skills Section */}
                      {cv.skills && (
                        <div className="space-y-3">
                          <h4 className="text-[11px] font-black tracking-widest text-white uppercase border-b border-white/20 pb-1 mb-2">
                            EXPERTISE
                          </h4>
                          <ul className="text-[11px] text-white/85 font-bold space-y-1.5 list-disc pl-4 text-left">
                            {cv.skills.split(',').map((skill, idx) => (
                              <li key={idx} className="tracking-wide">
                                {skill.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Languages Section */}
                      {cv.languages && (
                        <div className="space-y-3">
                          <h4 className="text-[11px] font-black tracking-widest text-white uppercase border-b border-white/20 pb-1 mb-2">
                            LANGUAGE
                          </h4>
                          <div className="text-[11px] text-white/85 font-bold whitespace-pre-line leading-relaxed">
                            {cv.languages}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* RIGHT PANEL (Main Canvas - 8 cols / 2/3 width) */}
                    <div className="md:col-span-8 p-8 sm:p-10 space-y-6 text-sm text-slate-700 bg-white">
                      
                      {/* Name Card Block */}
                      <div className="space-y-1 border-b border-slate-100 pb-5">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight font-serif">
                          {viewingCv.full_name}
                        </h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          {cv.title || 'Marketing Manager'}
                        </p>
                        {cv.summary && (
                          <p className="text-slate-500 text-xs italic font-medium leading-relaxed mt-3 whitespace-pre-line max-w-xl">
                            {cv.summary}
                          </p>
                        )}
                      </div>

                      {/* Experience Section */}
                      {cv.experience && (
                        <div className="space-y-4">
                          <h4 className={`text-[11px] font-black tracking-widest ${styles.accentText} uppercase border-b ${styles.dividerColor} pb-1`}>
                            EXPERIENCE
                          </h4>
                          <div className="text-xs font-medium leading-relaxed text-slate-650 whitespace-pre-line text-left pl-1">
                            {cv.experience}
                          </div>
                        </div>
                      )}

                      {/* Projects Section */}
                      {cv.projects && (
                        <div className="space-y-4">
                          <h4 className={`text-[11px] font-black tracking-widest ${styles.accentText} uppercase border-b ${styles.dividerColor} pb-1`}>
                            PROJECTS & PORTFOLIO
                          </h4>
                          <div className="text-xs font-medium leading-relaxed text-slate-650 whitespace-pre-line text-left pl-1">
                            {cv.projects}
                          </div>
                        </div>
                      )}

                      {/* Certificates / References Section */}
                      {cv.certificates && (
                        <div className="space-y-4">
                          <h4 className={`text-[11px] font-black tracking-widest ${styles.accentText} uppercase border-b ${styles.dividerColor} pb-1`}>
                            REFERENCE / CERTIFICATE
                          </h4>
                          <div className="text-xs font-medium leading-relaxed text-slate-650 whitespace-pre-line text-left pl-1">
                            {cv.certificates}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-400 p-8 space-y-3">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 animate-bounce" />
                    <p className="font-extrabold text-slate-700 text-sm">Chưa có thông tin CV chi tiết</p>
                    <p className="text-xs text-slate-450 max-w-sm mx-auto font-medium">Ứng viên chưa soạn CV trực tuyến. Tuy nhiên bạn vẫn có thể liên lạc với họ qua số điện thoại hoặc email ở trên!</p>
                  </div>
                )}
              </div>

              {/* Direct Action Panel */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50 rounded-b-3xl">
                <button
                  onClick={() => setViewingCv(null)}
                  className="py-2.5 px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all"
                >
                  Đóng cửa sổ
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* --- MODAL: EMPLOYER SCHEDULING INTERVIEW AND APPROVING --- */}
      {interviewModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600" /> Phê Duyệt & Lên Lịch Hẹn Phỏng Vấn
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Ứng viên: {selectedApp.candidate?.full_name}</p>
              </div>
              <button
                onClick={() => setInterviewModalOpen(false)}
                className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors shrink-0"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveWithInterview} className="space-y-4 text-sm text-slate-600">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs font-semibold leading-relaxed text-indigo-800">
                🚀 Chấp nhận đơn ứng tuyển này sẽ cập nhật trạng thái của ứng viên sang <strong className="text-indigo-900">Được chấp nhận</strong>. Sau khi lưu, JobHunt sẽ tự động mở ứng dụng gửi Email để bạn gửi lịch hẹn phỏng vấn cho ứng viên!
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Thời gian phỏng vấn mong muốn *</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Địa điểm hoặc Link phỏng vấn trực tuyến (Google Meet/Zoom) *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phòng họp A, Tầng 3, tòa nhà ABC hoặc link https://meet.google.com/xyz..."
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Lời nhắn thêm cho ứng viên</label>
                <textarea
                  placeholder="Nhập ghi chú chuẩn bị phỏng vấn, liên hệ người đón tiếp hoặc dặn dằn ứng viên mang theo tài liệu..."
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInterviewModalOpen(false)}
                  className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-200"
                >
                  {actionLoading ? 'Đang duyệt...' : 'Duyệt Nhận & Mở Email Gửi Lịch'}
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

export default Dashboard;
