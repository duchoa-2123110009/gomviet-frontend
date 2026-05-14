import { Link } from "react-router-dom";

function WorkshopCard({ workshop }) {
  const isFull = workshop.current_people >= workshop.max_people;

  return (
    <div className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-green-100 hover:-translate-y-2">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-6 overflow-hidden">

        {/* Badge Đã đầy */}
        {isFull && (
          <span className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg">
            Đã đầy
          </span>
        )}

        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full"></div>

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              Workshop
            </span>
            <span className="text-3xl">🌿</span>
          </div>

          <h3 className="text-2xl font-bold text-white leading-tight group-hover:scale-105 transition-transform duration-300">
            {workshop.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">

        {/* Thời gian */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg">⏰</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Thời gian bắt đầu</p>
            <p className="text-gray-800 font-semibold">{workshop.start_time}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Thời gian kết thúc</p>
            <p className="text-gray-800 font-semibold">{workshop.end_time}</p>
          </div>
        </div>

        {/* Địa điểm */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📍</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Địa điểm</p>
            <p className="text-gray-800 font-semibold">{workshop.location}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4"></div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-emerald-500">✓</span>
            <span>Miễn phí nguyên liệu</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-emerald-500">✓</span>
            <span>Hướng dẫn tận tình</span>
          </div>
        </div>

        {/* Button */}
        {isFull ? (
          <button
            disabled
            className="block w-full mt-6 bg-gray-300 text-gray-600 text-center px-6 py-3.5 rounded-xl font-semibold cursor-not-allowed"
          >
            Đã đủ số lượng
          </button>
        ) : (
          <Link
            to={`/workshop/${workshop.id}`}
            className="block w-full mt-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-center px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 group/btn"
          >
            <span className="flex items-center justify-center gap-2">
              Xem chi tiết
              <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        )}
      </div>

      <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400"></div>
    </div>
  );
}

export default WorkshopCard;