import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VnpayReturn() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy query params từ URL VNPAY return
    const params = new URLSearchParams(window.location.search);
    const responseCode = params.get("vnp_ResponseCode");
    const amount = params.get("vnp_Amount");
    const orderInfo = params.get("vnp_OrderInfo");
    const txnRef = params.get("vnp_TxnRef");
    const payDate = params.get("vnp_PayDate");

    setData({ responseCode, amount, orderInfo, txnRef, payDate });
    if (responseCode === "00") setSuccess(true);

    setLoading(false);
  }, []);

  const formatMoney = (money) => {
    if (!money) return "0 ₫";
    return (money / 100).toLocaleString("vi-VN") + " ₫";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}/${dateStr.substring(0, 4)} 
            ${dateStr.substring(8, 10)}:${dateStr.substring(10, 12)}`;
  };

  if (loading) {
    return (
      <section className="py-32 text-center">
        <p className="text-xl">Đang xử lý thanh toán...</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center">

        {success ? (
          <>
            <h1 className="text-4xl font-bold text-emerald-600 mb-4">
              🎉 Thanh toán thành công
            </h1>
            <p className="text-gray-600 mb-6">
              Bạn đã đăng ký workshop thành công
            </p>

            <div className="text-left bg-gray-50 rounded-xl p-5 space-y-2 text-sm mb-6">
              <p><b>Mã booking:</b> {data.txnRef}</p>
              <p><b>Số tiền:</b> {formatMoney(data.amount)}</p>
              <p><b>Nội dung:</b> {data.orderInfo}</p>
              <p><b>Thời gian:</b> {formatDate(data.payDate)}</p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
            >
              Về trang chủ
            </button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              ❌ Thanh toán thất bại
            </h1>
            <p className="text-gray-600 mb-6">
              Giao dịch không thành công hoặc đã bị hủy
            </p>

            <div className="text-left bg-gray-50 rounded-xl p-5 text-sm mb-6">
              <p><b>Mã booking:</b> {data.txnRef || "-"}</p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
            >
              Quay lại
            </button>
          </>
        )}

      </div>
    </section>
  );
}

export default VnpayReturn;
