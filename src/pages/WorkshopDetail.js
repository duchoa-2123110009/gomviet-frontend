import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import WorkshopCard from "../components/WorkshopCard";

function WorkshopDetail() {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [related, setRelated] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));


useEffect(() => {
  fetch(`http://127.0.0.1:8000/api/workshop-row/${id}`)
    .then(res => res.json())
    .then(res => {
      setWorkshop(res);
    });

  fetch("http://127.0.0.1:8000/api/workshop-list")
    .then(res => res.json())
    .then(list => {
      const others = list.filter(w => w.id !== Number(id));
      setRelated(others.slice(0, 4));
    });
}, [id]);


  if (!workshop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 border-4 border-green-700 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-2xl font-semibold text-gray-800">Đang tải workshop...</p>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <a href="/" className="text-gray-600 hover:text-green-700 transition flex items-center gap-1">
            <span>🏠</span>
            <span>Trang chủ</span>
          </a>
          <span className="text-gray-400">/</span>
          <a href="/workshops" className="text-gray-600 hover:text-green-700 transition">Workshop</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{workshop.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="relative p-12 md:p-16">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                  🎨 Workshop
                </span>
                <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full">
                  ✓ Còn chỗ
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {workshop.title}
              </h1>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                    ⏰
                  </div>
                  <div>
                    <p className="text-green-100 text-sm font-medium">Thời gian bắt đầu</p>
                    <p className="text-white font-bold text-lg">{workshop.start_time}</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm font-medium">Thời gian kết thúc</p>
                    <p className="text-white font-bold text-lg">{workshop.end_time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                    📍
                  </div>
                  <div>
                    <p className="text-green-100 text-sm font-medium">Địa điểm</p>
                    <p className="text-white font-bold text-lg">{workshop.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          
          {/* Left: Mô tả chi tiết */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Mô tả */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-green-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">📖</span>
                Về workshop này
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {workshop.description}
              </p>
            </div>

            {/* Lợi ích */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">✨</span>
                Bạn sẽ nhận được gì?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: "🏺", title: "Tác phẩm gốm của riêng bạn", desc: "Hoàn thiện và mang về nhà" },
                  { icon: "🎨", title: "Kỹ năng nặn gốm cơ bản", desc: "Hướng dẫn chi tiết từ A-Z" },
                  { icon: "👨‍🎨", title: "Được nghệ nhân hướng dẫn", desc: "Kinh nghiệm 15+ năm" },
                  { icon: "📸", title: "Ảnh kỷ niệm đẹp", desc: "Chụp ảnh trong quá trình làm" },
                  { icon: "☕", title: "Trà và bánh miễn phí", desc: "Trong suốt workshop" },
                  { icon: "🎁", title: "Quà tặng đặc biệt", desc: "Voucher cho lần sau" }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{item.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quy trình */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-green-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">🔄</span>
                Quy trình workshop
              </h2>
              
              <div className="space-y-4">
                {[
                  { step: "1", title: "Giới thiệu", desc: "Tìm hiểu về gốm sứ và các kỹ thuật cơ bản", time: "15 phút" },
                  { step: "2", title: "Thực hành nặn", desc: "Tự tay nặn và tạo hình sản phẩm", time: "90 phút" },
                  { step: "3", title: "Hoàn thiện", desc: "Trang trí và hoàn thiện tác phẩm", time: "30 phút" },
                  { step: "4", title: "Nung men", desc: "Sản phẩm sẽ được nung và gửi sau 1 tuần", time: "Sau buổi" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-green-50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <span className="text-sm text-green-700 font-medium">{item.time}</span>
                      </div>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-3xl shadow-2xl border-2 border-green-200 overflow-hidden">
              
              {/* Price Header */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
                <p className="text-sm font-medium text-green-100 mb-1">Giá tham gia</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">100.000-200.000</span>
                  <span className="text-2xl">₫</span>
                </div>
                <p className="text-green-100 text-sm mt-2">/ người</p>
              </div>

              {/* Booking Info */}
              <div className="p-6 space-y-4">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Thời lượng:</span>
                    <span className="font-bold text-gray-900">2.5 giờ</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Số người tối đa:</span>
                    <span className="font-bold text-gray-900">12 người</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Độ tuổi:</span>
                    <span className="font-bold text-gray-900">7+ tuổi</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">Còn lại:</span>
                    <span className="font-bold text-green-600">5 chỗ</span>
                  </div>
                </div>

                {/* CTA Button */}
                {user?.roles !== "staff" && (
  <Link 
    to={`/booking/${workshop.id}`}
    className="block w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white text-center py-5 rounded-2xl text-lg font-bold hover:shadow-2xl hover:scale-105 active:scale-100 transition-all duration-300"
  >
    <span className="flex items-center justify-center gap-2">
      <span className="text-2xl">🎨</span>
      <span>Đăng ký ngay</span>
    </span>
  </Link>
)}
{user?.roles === "staff" && (
  <p className="text-center text-red-600 font-semibold">
    Staff không thể đăng ký workshop
  </p>
)}


                {/* Extra Info */}
                <div className="space-y-2 pt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Miễn phí hủy trong 24h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Thanh toán sau khi workshop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Bảo hiểm tai nạn</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-green-50 p-6 border-t border-green-100">
                <p className="text-sm text-gray-700 mb-3">Cần tư vấn thêm?</p>
                <button className="w-full bg-white text-green-700 py-3 rounded-xl font-semibold border-2 border-green-700 hover:bg-green-50 transition-all duration-300">
                  📞 Liên hệ: 0123 456 789
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop khác */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-4">
              🎨 Khám phá thêm
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Workshop khác
            </h2>
            <p className="text-xl text-gray-600">
              Những trải nghiệm tuyệt vời đang chờ bạn
            </p>
          </div>

          {related.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map(w => (
                <WorkshopCard key={w.id} workshop={w} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có workshop khác</h3>
              <p className="text-gray-600">Vui lòng quay lại sau</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkshopDetail;