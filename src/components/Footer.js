import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2 rounded-xl">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Job<span className="text-orange-500">Hunt</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Nền tảng tìm kiếm việc làm hàng đầu Việt Nam. Kết nối hàng ngàn cơ hội nghề nghiệp mỗi ngày cùng nhà tuyển dụng uy tín.
            </p>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-1.5">Dành cho ứng viên</h3>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
              <li>
                <Link 
                  to="/" 
                  onClick={() => {
                    setTimeout(() => {
                      const el = document.getElementById('jobs-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-orange-500 transition-colors"
                >
                  Tìm kiếm việc làm
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-500 transition-colors">Tạo hồ sơ trực tuyến</Link>
              </li>
              <li>
                <a 
                  href="https://vieclam24h.vn/cam-nang-nghe-nghiep/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-orange-500 transition-colors"
                >
                  Cẩm nang nghề nghiệp
                </a>
              </li>
              <li>
                <Link 
                  to="/" 
                  onClick={() => {
                    setTimeout(() => {
                      const el = document.getElementById('recruiter-brands');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-orange-500 transition-colors"
                >
                  Xem top công ty
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-1.5">Dành cho nhà tuyển dụng</h3>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-orange-500 transition-colors">Đăng tin tuyển dụng</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-500 transition-colors">Tìm kiếm ứng viên</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-500 transition-colors">Giải pháp nhân sự</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-500 transition-colors">Báo giá dịch vụ</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-1.5">Thông tin liên hệ</h3>
            <ul className="space-y-3 text-sm font-semibold text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-orange-500 mt-0.5 shrink-0" />
                <span>Khu Công Nghệ Cao, Quận 9, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                <span>+84 (028) 1234 5678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                <span>contact@jobhunt.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobHunt. Tất cả các quyền được bảo lưu.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Phát triển với <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> bởi đội ngũ JobHunt
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;