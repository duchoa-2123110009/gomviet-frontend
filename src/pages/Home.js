import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, DollarSign, Calendar, ArrowRight, Briefcase, 
  Sparkles, Filter, ChevronLeft, ChevronRight, Laptop, Megaphone, 
  BadgeDollarSign, Calculator, Users, Palette, Flame, Building2, 
  BookOpen, Award, CheckCircle2
} from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  // Jobs & Categories states
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topEmployers, setTopEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Trigger state to trigger refetch
  const [triggerSearch, setTriggerSearch] = useState(false);

  // Fetch categories and employers on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('categories');
        if (response && response.length) {
          setCategories(response);
        } else if (response && response.success) {
          setCategories(response.data || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    const fetchTopEmployers = async () => {
      try {
        const response = await api.get('employers');
        if (response && response.success) {
          const employersList = Array.isArray(response.data) ? response.data : (response.data.data || []);
          setTopEmployers(employersList.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load top employers:', err);
      }
    };

    fetchCategories();
    fetchTopEmployers();
  }, []);

  // Fetch jobs when page or filter trigger changes
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchKeyword) params.append('search', searchKeyword);
        if (locationFilter) params.append('location', locationFilter);
        if (minSalary) params.append('min_salary', minSalary);
        if (selectedCategoryId) params.append('category_id', selectedCategoryId);
        params.append('page', currentPage);

        const response = await api.get(`jobs?${params.toString()}`);
        
        if (response && response.success) {
          const paginator = response.data;
          setJobs(paginator.data || []);
          setCurrentPage(paginator.current_page || 1);
          setTotalPages(paginator.last_page || 1);
          setTotalJobs(paginator.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, triggerSearch]);

  const getCategoryTheme = (catName) => {
    const name = catName ? catName.toLowerCase() : '';
    if (name.includes('công nghệ') || name.includes('it') || name.includes('lập trình') || name.includes('phần mềm') || name.includes('tin học')) {
      return { icon: Laptop, color: 'bg-indigo-50 text-indigo-650 border-indigo-100' };
    }
    if (name.includes('marketing') || name.includes('pr') || name.includes('quảng cáo') || name.includes('truyền thông')) {
      return { icon: Megaphone, color: 'bg-rose-50 text-rose-650 border-rose-100' };
    }
    if (name.includes('kinh doanh') || name.includes('bán hàng') || name.includes('sale') || name.includes('thương mại')) {
      return { icon: BadgeDollarSign, color: 'bg-amber-50 text-amber-650 border-amber-100' };
    }
    if (name.includes('tài chính') || name.includes('kế toán') || name.includes('ngân hàng') || name.includes('kiểm toán')) {
      return { icon: Calculator, color: 'bg-blue-50 text-blue-650 border-blue-100' };
    }
    if (name.includes('nhân sự') || name.includes('hành chính') || name.includes('văn phòng') || name.includes('quản lý')) {
      return { icon: Users, color: 'bg-emerald-50 text-emerald-650 border-emerald-100' };
    }
    if (name.includes('thiết kế') || name.includes('đồ họa') || name.includes('mỹ thuật') || name.includes('design') || name.includes('kiến trúc')) {
      return { icon: Palette, color: 'bg-purple-50 text-purple-650 border-purple-100' };
    }
    return { icon: Briefcase, color: 'bg-slate-50 text-slate-650 border-slate-100' };
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    setTriggerSearch(!triggerSearch);
    
    // Smooth scroll down to jobs section
    const jobsSec = document.getElementById('jobs-section');
    if (jobsSec) {
      jobsSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setLocationFilter('');
    setMinSalary('');
    setSelectedCategoryId('');
    setCurrentPage(1);
    setTriggerSearch(!triggerSearch);
  };

  const handleCategoryClick = (cat) => {
    if (cat && typeof cat === 'object') {
      setSelectedCategoryId(cat.id || '');
      setSearchKeyword(''); // Clear textual query to target the exact category ID
    } else {
      setSearchKeyword(cat || '');
      setSelectedCategoryId('');
    }
    setCurrentPage(1);
    setTriggerSearch(!triggerSearch);
    
    const jobsSec = document.getElementById('jobs-section');
    if (jobsSec) {
      jobsSec.scrollIntoView({ behavior: 'smooth' });
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

  // Mock Recruiting Brands
  const recruitingBrands = [
    { name: 'FPT Software', jobs: 45, color: 'from-orange-500 to-indigo-600', logoText: 'FPT', desc: 'Tập đoàn Công nghệ hàng đầu' },
    { name: 'Viettel Group', jobs: 28, color: 'from-red-600 to-rose-700', logoText: 'VTL', desc: 'Viễn thông & Công nghiệp' },
    { name: 'Vingroup', jobs: 35, color: 'from-blue-600 to-sky-700', logoText: 'VIN', desc: 'Đa ngành, Đô thị & Xe điện' },
    { name: 'Techcombank', jobs: 19, color: 'from-rose-600 to-red-500', logoText: 'TCB', desc: 'Ngân hàng TMCP Kỹ Thương' },
    { name: 'Shopee Việt Nam', jobs: 22, color: 'from-orange-600 to-amber-500', logoText: 'S', desc: 'Thương mại điện tử số 1' },
    { name: 'Vinamilk', jobs: 14, color: 'from-emerald-600 to-blue-700', logoText: 'VNM', desc: 'Dinh dưỡng Quốc gia' }
  ];

  // Mock Career Blog Articles
  const blogArticles = [
    {
      id: '1',
      title: 'Bí quyết viết CV chinh phục nhà tuyển dụng IT trong 30 giây',
      desc: 'Làm thế nào để nhà tuyển dụng dừng lại và ấn tượng ngay với CV của bạn giữa hàng trăm hồ sơ nộp về? Hãy xem ngay checklist vàng...',
      readTime: '5 phút đọc',
      date: '16/05/2026',
      badge: 'Bí quyết viết CV'
    },
    {
      id: '2',
      title: 'Top 10 câu hỏi phỏng vấn thường gặp và cách trả lời ấn tượng',
      desc: 'Giúp bạn tự tin vượt qua mọi cuộc phỏng vấn hóc búa, từ giới thiệu bản thân đến giải thích điểm yếu một cách thuyết phục nhất...',
      readTime: '7 phút đọc',
      date: '14/05/2026',
      badge: 'Phỏng vấn'
    },
    {
      id: '3',
      title: 'Làm thế nào để đàm phán mức lương mong muốn khi nhảy việc?',
      desc: 'Nắm chắc 5 quy tắc đàm phán lương khôn ngoan để bảo vệ quyền lợi và nâng cao thu nhập xứng đáng với năng lực của bạn...',
      readTime: '6 phút đọc',
      date: '12/05/2026',
      badge: 'Đàm phán lương'
    }
  ];

  return (
    <>
      <Navbar />

      {/* --- HERO SECTION: Vieclam24h Premium Styling --- */}
      <div className="bg-slate-900 text-white relative overflow-hidden pt-36 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.12),rgba(79,70,229,0.15),transparent_60%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wide text-amber-400 border border-white/10 pulse-orange-badge">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> 12,500+ Việc làm Hot đã được xác thực hôm nay!
          </div>
          
          <h1 className="text-4xl sm:text-6.5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Kiến tạo sự nghiệp <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600">
              Mơ ước của bạn
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-semibold">
            Nền tảng kết nối việc làm nhanh chóng, uy tín và hoàn toàn miễn phí. Tìm kiếm cơ hội đổi đời của bạn ngay bây giờ!
          </p>

          {/* --- Multi-Field Search Engine: Vieclam24h Style --- */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="bg-white p-2.5 rounded-3xl shadow-2xl shadow-indigo-950/40 max-w-4.5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-2 text-slate-800 border-2 border-slate-100"
          >
            {/* Input 1: Title / Keyword */}
            <div className="md:col-span-5 flex items-center px-3 border-b md:border-b-0 md:border-r border-slate-100 py-2">
              <Search className="w-5 h-5 text-orange-500 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Tên công việc, từ khóa tuyển dụng..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full text-sm focus:outline-none bg-transparent py-1 font-bold text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* Input 2: Location Dropdown */}
            <div className="md:col-span-3 flex items-center px-3 border-b md:border-b-0 md:border-r border-slate-100 py-2">
              <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mr-2" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full text-sm focus:outline-none bg-transparent py-1 font-bold text-slate-650 text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">Tất cả địa điểm</option>
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="Đồng Nai">Đồng Nai</option>
              </select>
            </div>

            {/* Input 3: Salary Dropdown Selection */}
            <div className="md:col-span-2 flex items-center px-3 py-2">
              <DollarSign className="w-5 h-5 text-emerald-500 shrink-0 mr-2" />
              <select
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full text-sm focus:outline-none bg-transparent py-1 font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">Tất cả lương</option>
                <option value="10">Trên 10 Triệu</option>
                <option value="15">Trên 15 Triệu</option>
                <option value="20">Trên 20 Triệu</option>
                <option value="25">Trên 25 Triệu</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 shrink-0 transform hover:scale-102"
              >
                Tìm kiếm <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Top Searches / Categories Quick Buttons */}
          {categories.length > 0 && (
            <div className="pt-6 max-w-4xl mx-auto">
              <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider block mb-2.5">Ngành nghề tìm kiếm nhiều nhất:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-xs font-bold rounded-xl transition-all flex items-center gap-1 hover:text-amber-400"
                  >
                    <CheckCircle2 className="w-3 h-3 text-amber-500" /> {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- SECTION 1: Trending Category Roundels ("Top Ngành Nghề Nổi Bật") --- */}
      <div className="bg-white border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs text-orange-500 font-extrabold uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Danh Mục Nổi Bật</span>
            <h2 className="text-2xl sm:text-3.5xl font-black text-slate-800 tracking-tight">Tìm kiếm theo nhóm ngành công việc</h2>
            <p className="text-sm text-slate-400 font-semibold">Khám phá hàng ngàn công việc HOT được phân loại theo từng lĩnh vực nghề nghiệp</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => {
              const theme = getCategoryTheme(cat.name);
              const IconComp = theme.icon;
              return (
                <div 
                  key={cat.id || idx}
                  onClick={() => handleCategoryClick(cat)}
                  className="bg-slate-50 border border-slate-200/50 hover:border-orange-200 hover:bg-white rounded-3xl p-5 text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-orange-100/30 group card-hover-zoom animate-in fade-in duration-300"
                >
                  <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center border mb-4 transition-transform group-hover:scale-110 duration-300 ${theme.color}`}>
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1 group-hover:text-orange-500 transition-colors">{cat.name}</h4>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    {cat.jobs_count !== undefined ? cat.jobs_count : Math.floor(Math.random() * 50) + 10}+ việc làm
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- SECTION 2: Top Recruiter Logos ("Thương Hiệu Tuyển Dụng Hàng Đầu") --- */}
      <div id="recruiter-brands" className="bg-slate-50 py-16 border-b border-slate-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs text-indigo-600 font-extrabold uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Nhà Tuyển Dụng Uy Tín</span>
            <h2 className="text-2xl sm:text-3.5xl font-black text-slate-800 tracking-tight">Thương hiệu tuyển dụng hàng đầu</h2>
            <p className="text-sm text-slate-400 font-semibold">Gia nhập các tập đoàn, doanh nghiệp quy mô lớn với môi trường phát triển sự nghiệp đỉnh cao</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topEmployers.length > 0 ? (
              topEmployers.map((employer) => (
                <Link 
                  key={employer.id}
                  to={`/employers/${employer.id}`}
                  className="bg-white border border-slate-100 hover:border-indigo-200 rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100/20 card-hover-zoom group"
                >
                  {/* Glowing Recruiter Brand Logo */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md shadow-indigo-100/40 relative overflow-hidden group-hover:scale-105 transition-transform`}>
                    {employer.user?.avatar ? (
                      <img src={employer.user.avatar} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>
                        {employer.company_name ? employer.company_name.substring(0, 3).toUpperCase() : 'COM'}
                      </>
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden flex-1">
                    <h4 className="font-extrabold text-base text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{employer.company_name}</h4>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1">{employer.location || 'Tuyển dụng toàn quốc'}</p>
                    <span className="inline-block text-[11px] px-2 py-0.5 bg-orange-50 text-orange-600 font-bold rounded-lg border border-orange-100">
                      Đang tuyển {employer.jobs ? employer.jobs.length : Math.floor(Math.random() * 20) + 1} vị trí
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback to mock data if no employers from DB yet
              recruitingBrands.map((brand, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-100 hover:border-indigo-200 rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100/20 card-hover-zoom"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${brand.color} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md shadow-indigo-100/40 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>
                    {brand.logoText}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <h4 className="font-extrabold text-base text-slate-800 line-clamp-1">{brand.name}</h4>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1">{brand.desc}</p>
                    <span className="inline-block text-[11px] px-2 py-0.5 bg-orange-50 text-orange-600 font-bold rounded-lg border border-orange-100">
                      Đang tuyển {brand.jobs} vị trí
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- MAIN JOBS LISTING SECTION: Side-by-Side Filters & Jobs Grid --- */}
      <div id="jobs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-6 sticky top-24">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-base">
                  <Filter className="w-5 h-5 text-orange-500" /> Bộ lọc tuyển dụng
                </h3>
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-orange-500 hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>

              {/* Keyword input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Từ khóa tuyển dụng</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Chức danh, kỹ năng, vị trí..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Location selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Địa điểm / Khu vực</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom appearance-none font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="">Tất cả địa điểm</option>
                    <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                  </select>
                </div>
              </div>

              {/* Minimum Salary input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mức lương tối thiểu (Triệu VNĐ)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Ví dụ: 10, 15, 20..."
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-custom font-semibold text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Submit Filter button */}
              <button
                onClick={handleSearchSubmit}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all font-bold"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>

          {/* Right Jobs Listing */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <p className="text-sm font-semibold text-slate-500">
                Tìm thấy <span className="text-orange-500 font-extrabold text-base">{totalJobs}</span> tin tuyển dụng phù hợp
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-lg font-black text-slate-700">Chưa tìm thấy tin tuyển dụng thích hợp</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">
                  Rất tiếc, chúng tôi không tìm thấy việc làm khớp với bộ lọc của bạn. Hãy thử thay đổi bộ lọc hoặc xóa bộ lọc!
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 text-xs font-bold text-orange-600 bg-orange-50 rounded-xl hover:bg-orange-100 border border-orange-100"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-orange-200 rounded-3xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100/10 group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        
                        {/* Company Logo Representation & Job Titles */}
                        <div className="flex gap-4 items-start">
                          <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-650 font-black text-sm shrink-0 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform">
                            {job.employer?.company_name ? job.employer.company_name.substring(0, 3).toUpperCase() : 'JOB'}
                          </div>

                          <div className="space-y-1.5">
                            {/* Badges: HOT & Employer Name */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 bg-orange-500 text-white font-extrabold rounded-md flex items-center gap-0.5 pulse-orange-badge uppercase">
                                <Flame className="w-3 h-3 fill-white" /> HOT
                              </span>
                              <span className="text-xs font-extrabold text-slate-500">
                                {job.employer?.company_name || 'Tuyển dụng trực tiếp'}
                              </span>
                              {job.category && (
                                <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-650 border border-orange-100/50 rounded-md text-[9px] font-black uppercase tracking-wider">
                                  {job.category.name}
                                </span>
                              )}
                            </div>
                            
                            {/* Title */}
                            <h4 className="text-lg font-black text-slate-800 group-hover:text-orange-500 transition-colors">
                              <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                            </h4>

                            {/* Quick details */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {job.location}
                              </span>
                              <span className="flex items-center gap-1 text-amber-600 font-extrabold">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {formatSalary(job.salary)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Đăng: {formatDate(job.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* View Detail button */}
                        <Link
                          to={`/jobs/${job.id}`}
                          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 group-hover:text-white bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 rounded-xl transition-all shrink-0 flex items-center justify-center gap-1 shadow-sm"
                        >
                          Xem Chi Tiết <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-600 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 font-bold text-sm rounded-xl transition-colors ${
                          currentPage === i + 1
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                            : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </div>

      {/* --- SECTION 4: Impressive Stats Counters ("Ấn Tượng Con Số JobHunt") --- */}
      <div className="bg-slate-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <span className="text-xs text-amber-400 font-extrabold uppercase tracking-widest">Năng Lực Kết Nối</span>
              <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight leading-tight">Những con số ấn tượng của JobHunt</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { count: '15,000+', label: 'Việc làm đang tuyển', desc: 'Cơ hội rộng mở cho mọi lập trình viên' },
                { count: '8,500+', label: 'Doanh nghiệp tin dùng', desc: 'Thương hiệu tuyển dụng hàng đầu' },
                { count: '3.2 Triệu+', label: 'Hồ sơ kết nối thành công', desc: 'Được hỗ trợ tận tâm, định hướng tương lai' }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-2 p-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
                  <h3 className="text-3.5xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-tight">{stat.count}</h3>
                  <p className="text-sm font-extrabold text-slate-200">{stat.label}</p>
                  <p className="text-xs text-slate-400 font-medium">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 5: Career Blog ("Cẩm Nang Tìm Việc & Bí Quyết Thành Công") --- */}
      <div className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs text-orange-500 font-extrabold uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Chia Sẻ & Cẩm Nang</span>
            <h2 className="text-2xl sm:text-3.5xl font-black text-slate-800 tracking-tight">Kinh nghiệm tìm việc & phát triển sự nghiệp</h2>
            <p className="text-sm text-slate-400 font-semibold">Tự tin ứng tuyển với những bí quyết phỏng vấn và mẹo làm CV từ các chuyên gia nhân sự</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogArticles.map((article) => (
              <Link 
                key={article.id}
                to={`/blog/${article.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-200/60 rounded-3xl p-6 bg-slate-50 hover:bg-white hover:border-orange-200 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100/20 group card-hover-zoom text-left space-y-4 block"
              >
                <span className="inline-block text-[10px] px-2.5 py-1 bg-indigo-50 text-indigo-700 font-extrabold rounded-lg">
                  {article.badge}
                </span>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-base text-slate-800 group-hover:text-orange-500 transition-colors line-clamp-2 leading-tight">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-450 text-slate-500 leading-relaxed line-clamp-3 font-semibold">
                    {article.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 border-t border-slate-200/40 pt-3">
                  <span>⏰ {article.readTime}</span>
                  <span>📅 {article.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;