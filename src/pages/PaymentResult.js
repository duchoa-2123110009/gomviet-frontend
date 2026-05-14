import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [txnRef, setTxnRef] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const s = searchParams.get("status");
    const t = searchParams.get("txnRef");
    const m = searchParams.get("message") || "";

    setStatus(s);
    setTxnRef(t);
    setMessage(m);
  }, [searchParams]);

  const handleBack = () => {
    navigate("/"); // quay về trang chủ
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md text-center">
        {status === "success" ? (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Thanh toán thành công!</h2>
            <p className="text-gray-700 mb-4">Mã giao dịch: <strong>{txnRef}</strong></p>
            <p className="text-gray-700">Booking của bạn đã được xác nhận.</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Thanh toán thất bại</h2>
            {message && <p className="text-gray-700 mb-4">{message}</p>}
            <p className="text-gray-700 mb-4">Mã giao dịch: <strong>{txnRef}</strong></p>
            <p className="text-gray-700">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
          </>
        )}
        <button
          onClick={handleBack}
          className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
