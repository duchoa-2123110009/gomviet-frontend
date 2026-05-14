import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Payment() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Lấy thông tin booking
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        setBooking(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Không lấy được thông tin booking");
        setLoading(false);
      });
  }, [bookingId, token]);

  // 🔹 Gọi backend tạo link VNPAY
  const handleVnpay = async () => {
    setPaying(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/vnpay/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không tạo được link thanh toán");
      }

      // ✅ Redirect sang VNPAY
      window.location.href = data.payment_url;

    } catch (err) {
      alert(err.message);
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <section className="py-32 text-center">
        <p className="text-xl">Đang tải thông tin thanh toán...</p>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="py-32 text-center">
        <p className="text-red-600">Booking không tồn tại</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16 px-6">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Thanh toán workshop
        </h1>

        <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-sm mb-8">
          <p><b>Họ tên:</b> {booking.name}</p>
          <p><b>SĐT:</b> {booking.phone}</p>
          <p><b>Số lượng:</b> {booking.quantity}</p>
          <p>
            <b>Tổng tiền:</b>{" "}
            <span className="text-emerald-600 font-bold">
              {booking.total_price.toLocaleString("vi-VN")} ₫
            </span>
          </p>
        </div>

        <button
          onClick={handleVnpay}
          disabled={paying}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all
            ${paying
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105"
            }`}
        >
          {paying ? "Đang chuyển sang VNPAY..." : "Thanh toán qua VNPAY"}
        </button>

      </div>
    </section>
  );
}

export default Payment;
