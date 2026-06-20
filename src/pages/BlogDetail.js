import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Calendar, Clock, ArrowLeft, CheckCircle2, 
  TrendingUp, User, Sparkles, Award, FileText, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Full detailed articles data based on Home.js mock lists
  const articlesDatabase = {
    '1': {
      title: 'Bí quyết viết CV chinh phục nhà tuyển dụng IT trong 30 giây',
      badge: 'Bí quyết viết CV',
      readTime: '5 phút đọc',
      date: '16/05/2026',
      author: 'Nguyễn Tiến Dũng - HR Director tại JobHunt',
      intro: 'Hồ sơ xin việc (CV) chính là tấm vé đầu tiên đưa bạn tiếp cận với công việc mơ ước. Trong lĩnh vực Công nghệ thông tin (IT), sự cạnh tranh là cực kỳ khốc liệt. Các nhà tuyển dụng thường chỉ dành ra trung bình 30 giây để lướt qua một CV trước khi quyết định giữ lại hay loại bỏ. Làm thế nào để CV của bạn tỏa sáng rực rỡ trong 30 giây đó?',
      sections: [
        {
          heading: '1. Trình bày ngắn gọn, khoa học (Tối ưu nhất là 1 Trang)',
          content: 'Đừng cố nhồi nhét tất cả mọi dự án, bài tập lớn từ thời sinh viên vào CV nếu chúng không liên quan trực tiếp đến vị trí ứng tuyển. Hãy chọn lọc 2-3 dự án nổi bật nhất và trình bày thật súc tích. Đặc biệt, định dạng file gửi đi bắt buộc phải là PDF để đảm bảo tính đồng bộ, không bị lỗi font chữ hay vỡ khung khi mở ở các thiết bị khác nhau.'
        },
        {
          heading: '2. Nổi bật kỹ năng kỹ thuật (Tech Stack) cốt lõi ngay phần đầu',
          content: 'Nhà tuyển dụng IT luôn muốn biết ngay lập tức bạn có sử dụng được ngôn ngữ hoặc framework họ yêu cầu hay không. Hãy lập danh mục Tech Stack rõ ràng ở vị trí bắt mắt nhất (Ví dụ: Frontend: ReactJS, VueJS; Backend: PHP/Laravel, Node.js; Database: MySQL, PostgreSQL).'
        },
        {
          heading: '3. Số hóa kết quả đạt được thay vì liệt kê nhiệm vụ',
          content: 'Thay vì ghi những câu mô tả chung chung như "Tham gia phát triển hệ thống bán hàng", hãy ghi số liệu cụ thể: "Tối ưu hóa các truy vấn cơ sở dữ liệu MySQL giúp giảm 45% thời gian tải trang của hệ thống" hoặc "Xây dựng module thanh toán Stripe giúp tăng tỷ lệ chuyển đổi đơn hàng thêm 15%". Con số thực tế luôn có tính thuyết phục cực kỳ cao!'
        }
      ],
      expertTip: 'Nhà tuyển dụng IT chuyên nghiệp sử dụng công cụ lọc tự động (ATS) để quét từ khóa. Hãy đọc thật kỹ Bản mô tả công việc (JD) và lồng ghép khéo léo các từ khóa công nghệ yêu cầu vào mục kỹ năng và dự án của bạn để nâng tỷ lệ được gọi phỏng vấn lên 80%!',
      related: [
        { id: '2', title: 'Top 10 câu hỏi phỏng vấn thường gặp và cách trả lời ấn tượng' },
        { id: '3', title: 'Làm thế nào để đàm phán mức lương mong muốn khi nhảy việc?' }
      ]
    },
    '2': {
      title: 'Top 10 câu hỏi phỏng vấn thường gặp và cách trả lời ấn tượng',
      badge: 'Phỏng vấn tuyển dụng',
      readTime: '7 phút đọc',
      date: '14/05/2026',
      author: 'Lê Thị Thu Thủy - Chuyên gia Nhân sự Cấp cao',
      intro: 'Vượt qua vòng hồ sơ CV, bạn đã tiến gần hơn một bước tới công việc mơ ước. Tuy nhiên, vòng phỏng vấn trực tiếp mới là thử thách quyết định xem bạn có thực sự phù hợp với văn hóa và yêu cầu của công ty hay không. Dưới đây là những câu hỏi phỏng vấn kinh điển nhất và bí quyết trả lời ghi điểm tuyệt đối.',
      sections: [
        {
          heading: '1. Hãy giới thiệu bản thân trong vòng 2 phút?',
          content: 'Sai lầm lớn nhất là kể lại toàn bộ tiểu sử hoặc đọc lại CV. Hãy tóm tắt súc tích công thức 3 phần: Kinh nghiệm nổi bật nhất của bạn + Kỹ năng/Thế mạnh lớn nhất có thể áp dụng ngay + Lý do bạn thực sự đam mê ứng tuyển vào công ty này.'
        },
        {
          heading: '2. Điểm yếu lớn nhất của bạn là gì?',
          content: 'Đừng nói "Tôi không có điểm yếu" hoặc "Tôi là người quá cầu toàn". Hãy đưa ra một điểm yếu thật sự nhưng không ảnh hưởng nghiêm trọng đến công việc ứng tuyển, và quan trọng nhất là đi kèm với giải pháp cụ thể bạn đã và đang thực hiện để khắc phục nó.'
        },
        {
          heading: '3. Tại sao chúng tôi nên chọn bạn thay vì các ứng viên khác?',
          content: 'Hãy tập trung kết nối trực tiếp những thế mạnh cốt lõi của bạn với khó khăn hoặc bài toán mà doanh nghiệp đang gặp phải. Khẳng định bằng sự tự tin rằng kinh nghiệm của bạn sẽ giúp họ giải quyết nhanh chóng bài toán đó và mang lại giá trị thiết thực.'
        }
      ],
      expertTip: 'Hãy luôn chuẩn bị sẵn 2-3 câu hỏi thông minh để hỏi ngược lại nhà tuyển dụng ở cuối buổi phỏng vấn (Ví dụ: "Lộ trình phát triển của vị trí này trong 1 năm tới là gì?" hoặc "Thách thức lớn nhất mà bộ phận đang đối mặt là gì?"). Điều này thể hiện bạn là một ứng viên thực sự nghiêm túc, chủ động và quan tâm sâu sắc đến công việc.',
      related: [
        { id: '1', title: 'Bí quyết viết CV chinh phục nhà tuyển dụng IT trong 30 giây' },
        { id: '3', title: 'Làm thế nào để đàm phán mức lương mong muốn khi nhảy việc?' }
      ]
    },
    '3': {
      title: 'Làm thế nào để đàm phán mức lương mong muốn khi nhảy việc?',
      badge: 'Đàm phán lương',
      readTime: '6 phút đọc',
      date: '12/05/2026',
      author: 'Trần Minh Hoàng - Senior Tech Recruiter',
      intro: 'Đàm phán lương luôn là một chủ đề nhạy cảm nhưng lại vô cùng quan trọng đối với mọi ứng viên. Một thỏa thuận lương khôn ngoan không chỉ giúp bạn có mức thu nhập tương xứng với năng lực thực tế mà còn khẳng định vị thế và lòng tự trọng nghề nghiệp của bạn trong mắt doanh nghiệp mới.',
      sections: [
        {
          heading: '1. Nghiên cứu kỹ lưỡng thị trường lương trước buổi phỏng vấn',
          content: 'Đừng đàm phán dựa trên cảm xúc cá nhân. Hãy tham khảo kỹ các báo cáo lương thị trường của JobHunt hoặc các nền tảng lớn để biết rõ khoảng lương (Range) trung bình cho vị trí, số năm kinh nghiệm và khu vực của bạn. Đây sẽ là những luận cứ khoa học không thể bác bỏ giúp bạn bảo vệ mức đề xuất.'
        },
        {
          heading: '2. Không bao giờ đưa ra con số chính xác trước - Hãy đưa ra một khoảng',
          content: 'Khi được hỏi về mức lương mong muốn, hãy đưa ra một khoảng lương (ví dụ: 20 triệu đến 25 triệu VNĐ) thay vì một con số cố định. Mẹo nhỏ là hãy đặt mức lương tối thiểu bạn chấp nhận được làm điểm đầu của khoảng lương đó.'
        },
        {
          heading: '3. Đừng chỉ đàm phán lương cứng - Hãy chú ý gói đãi ngộ tổng thể (Total Compensation)',
          content: 'Lương cứng chỉ là một phần. Hãy xem xét tổng hòa các yếu tố: Lương tháng 13, bonus hiệu quả công việc, trợ cấp đi lại, ăn trưa, chế độ bảo hiểm sức khỏe cao cấp, số ngày phép năm và cơ hội được tài trợ học tập các chứng chỉ quốc tế.'
        }
      ],
      expertTip: 'Hãy thể hiện sự cởi mở và linh hoạt trong suốt buổi thương lượng. Dùng cụm từ: "Tôi mong muốn mức lương X, tuy nhiên tôi sẵn sàng thảo luận thêm nếu chế độ phúc lợi tổng thể và cơ hội thăng tiến của công ty thực sự hấp dẫn." Điều này giúp bạn không bị mất cơ hội nhận Offer mà vẫn giữ được giá trị bản thân.',
      related: [
        { id: '1', title: 'Bí quyết viết CV chinh phục nhà tuyển dụng IT trong 30 giây' },
        { id: '2', title: 'Top 10 câu hỏi phỏng vấn thường gặp và cách trả lời ấn tượng' }
      ]
    }
  };

  const article = articlesDatabase[id] || articlesDatabase['1'];

  return (
    <>
      <Navbar />

      <div className="bg-slate-50 min-h-screen pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Quay lại Trang chủ
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                
                {/* Header Metadata */}
                <div className="space-y-4">
                  <span className="inline-block text-xs px-2.5 py-1 bg-orange-50 text-orange-600 font-extrabold rounded-lg border border-orange-100">
                    {article.badge}
                  </span>
                  
                  <h1 className="text-2xl sm:text-3.5xl font-black text-slate-800 tracking-tight leading-tight">
                    {article.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-400 border-b border-slate-100 pb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4 text-indigo-500" /> Tác giả: {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" /> Cập nhật: {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" /> {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Introduction Paragraph */}
                <p className="text-slate-650 text-slate-600 leading-relaxed font-bold text-base bg-slate-50/70 p-5 rounded-2xl border border-slate-100 italic">
                  "{article.intro}"
                </p>

                {/* Main Article Sections */}
                <div className="space-y-6">
                  {article.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                        {sec.heading}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Expert Tips Warning Panel */}
                <div className="bg-amber-50/60 border border-amber-250/50 border-amber-200 rounded-2xl p-5 space-y-2.5">
                  <h4 className="text-sm font-extrabold text-amber-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" /> LỜI KHUYÊN TỪ CHUYÊN GIA NHÂN SỰ:
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                    {article.expertTip}
                  </p>
                </div>
              </div>

              {/* Related articles panel */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <BookOpen className="w-5 h-5 text-indigo-500" /> Các bài viết cẩm nang liên quan:
                </h3>
                <div className="space-y-3">
                  {article.related.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/blog/${rel.id}`}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-150 transition-all group font-bold text-sm text-slate-700 hover:text-orange-500"
                    >
                      <span>💡 {rel.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Promo Area */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl space-y-5 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                
                <div className="space-y-2">
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-white font-extrabold rounded-md uppercase">
                    Quà Tặng Ứng Viên
                  </span>
                  <h3 className="text-xl font-black tracking-tight leading-snug">
                    Tạo CV chuyên nghiệp miễn phí ngay hôm nay!
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Sở hữu ngay mẫu CV đẹp mắt, chuẩn chuyên nghiệp để sẵn sàng nộp đơn vào các vị trí Hot lập tức.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span>Hơn 50+ mẫu CV chuẩn ATS</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span>Tải CV PDF miễn phí 100%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span>Gợi ý kỹ năng tự động theo ngành nghề</span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 text-sm"
                >
                  <FileText className="w-4 h-4" /> Tạo CV Trực Tuyến Ngay
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetail;
