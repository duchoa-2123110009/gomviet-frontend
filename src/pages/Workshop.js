import { useEffect, useState } from "react";
import WorkshopCard from "../components/WorkshopCard";

function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/workshop-list")
      .then(res => res.json())
      .then(data => {
        setWorkshops(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải workshops:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-4">
            🎨 Trải nghiệm sáng tạo
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Workshop làm gốm
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tham gia workshop để tự tay nặn những sản phẩm gốm độc đáo cùng nghệ nhân giàu kinh nghiệm
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-amber-700 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Đang tải workshop...</p>
            <p className="text-gray-400 text-sm mt-2">Vui lòng chờ trong giây lát</p>
          </div>
        ) : workshops.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Chưa có workshop</h3>
            <p className="text-gray-600 mb-8">Hệ thống đang cập nhật lịch workshop mới</p>
            <button className="px-6 py-3 bg-amber-700 text-white rounded-full font-semibold hover:bg-amber-800 transition-all duration-300">
              Đăng ký nhận thông báo
            </button>
          </div>
        ) : (
          <>
            {/* Workshops Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {workshops.map(workshop => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>

            {/* Info Section */}
            <div className="mt-20 bg-gradient-to-br from-amber-700 to-green-600 rounded-3xl p-12 text-white shadow-2xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                
                <div>
                  <h3 className="text-3xl font-bold mb-4">
                    Tại sao nên tham gia Workshop?
                  </h3>
                  <p className="text-amber-100 text-lg leading-relaxed mb-6">
                    Workshop làm gốm là cơ hội tuyệt vời để bạn thư giãn, sáng tạo và tạo ra những sản phẩm độc đáo bằng chính đôi tay của mình.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Trải nghiệm thực tế</h4>
                        <p className="text-amber-100 text-sm">Tự tay nặn, tạo hình và hoàn thiện tác phẩm của riêng bạn</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Hướng dẫn chuyên nghiệp</h4>
                        <p className="text-amber-100 text-sm">Nghệ nhân giàu kinh nghiệm hướng dẫn từng bước chi tiết</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Mang về sản phẩm</h4>
                        <p className="text-amber-100 text-sm">Sở hữu sản phẩm gốm độc nhất do chính bạn làm ra</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <h4 className="text-2xl font-bold mb-6">Workshop bao gồm:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <span className="text-2xl">🏺</span>
                        <span>Nguyên liệu gốm cao cấp</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-2xl">🎨</span>
                        <span>Dụng cụ và thiết bị đầy đủ</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-2xl">☕</span>
                        <span>Trà và bánh miễn phí</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-2xl">📸</span>
                        <span>Chụp ảnh lưu niệm</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-2xl">🎁</span>
                        <span>Quà tặng đặc biệt</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <div className="inline-block bg-white rounded-3xl p-10 shadow-xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Bạn muốn tổ chức workshop riêng?
                </h3>
                <p className="text-gray-600 text-lg mb-6 max-w-xl">
                  Chúng tôi có thể tổ chức workshop riêng cho nhóm từ 5-20 người
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Liên hệ tư vấn ngay
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  );
}

export default Workshops;