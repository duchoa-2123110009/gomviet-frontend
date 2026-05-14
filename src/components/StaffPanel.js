import React, { useState } from "react";
import { Search, CheckCircle, User, Calendar, CreditCard } from "lucide-react";
import {  useNavigate } from "react-router-dom";

function StaffPanel() {
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
 const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // Tìm booking
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };
  const findBooking = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/booking/find/${phone}`);
      const data = await res.json();

      if (res.ok) {
        setBooking(data.booking);
        setMessage(data.message);
      } else {
        setBooking(null);
        setMessage(data.message || "Không tìm thấy booking");
      }
    } catch (err) {
      setMessage("Không thể kết nối server");
    }
  };

  // Xác nhận thanh toán
const confirmPayment = async () => {
  if (!booking?.id) {
    setMessage("Booking chưa được load");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/booking/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: booking.id }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      // Cập nhật booking mới
      setBooking(data.booking);
    }

    // Thông báo
    setMessage(data.message || "Có lỗi xảy ra");
  } catch (err) {
    setMessage("Không thể kết nối server");
  }
   
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Staff Panel - Quản lý Booking 
          </h2>
              <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
          <p className="text-gray-500 mb-6">Tìm kiếm và xác nhận đặt chỗ của khách hàng</p>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && findBooking()}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            <button
              onClick={findBooking}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Search size={20} />
              Tìm Booking
            </button>
          </div>
        </div>

        {booking && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Chi tiết Booking</h3>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                booking.payment_status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {booking.payment_status ? "✓ Đã xác nhận" : "⏳ Chưa xác nhận"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <User className="text-indigo-600" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Tên khách hàng</p>
                  <p className="text-lg font-semibold text-gray-800">{booking.customer_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Calendar className="text-indigo-600" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Tổng dịch vụ</p>
                  <p className="text-lg font-semibold text-gray-800">{booking.total_amount}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <CreditCard className="text-indigo-600" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className="text-lg font-semibold text-gray-800">{booking.status}</p>
                </div>
              </div>
            </div>

            {!booking.verified && (
              <button
                onClick={confirmPayment}
                className="w-full mt-6 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle size={24} />
                Xác nhận thanh toán
              </button>
            )}
        
          </div>
        )}

        {message && (
          <div className={`mt-6 p-4 rounded-xl shadow-lg ${
            booking ? 'bg-green-50 border-2 border-green-200 text-green-800' : 'bg-red-50 border-2 border-red-200 text-red-800'
          }`}>
            <p className="font-medium text-center">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffPanel;
