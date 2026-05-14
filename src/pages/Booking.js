import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Countdown Timer
function CountdownTimer({ initialSeconds = 300, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = initialSeconds - elapsed;

      if (remaining <= 0) {
        setSecondsLeft(0);
        clearInterval(interval);
        if (onExpire) onExpire();
      } else {
        setSecondsLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [initialSeconds, onExpire]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="flex space-x-2 text-lg font-bold mb-4">
      <span>{minutes}</span>:<span>{seconds}</span>
    </div>
  );
}

function Booking() {
  const { id } = useParams(); // đây phải là param từ route React
  const token = localStorage.getItem("token");
const handleCashPayment = async () => {
  setErrors({});
  setLoading(true);

  if (!token) {
    alert("Bạn cần đăng nhập để đăng ký workshop");
    window.location.href = "/auth";
    return;
  }

  if (!form.name || !form.phone || form.quantity <= 0) {
    alert("Vui lòng điền đầy đủ thông tin hợp lệ");
    setLoading(false);
    return;
  }

  if (form.quantity > remainingSlots) {
    alert(`Chỉ còn ${remainingSlots} chỗ trống`);
    setLoading(false);
    return;
  }

  const payload = {
    workshop_id: Number(id),
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim() || null,
    quantity: Number(form.quantity),
    note: form.note.trim() || null,
    payment_method: "cash", // 👈 CHÌA KHÓA
  };

  try {
    const res = await fetch("http://127.0.0.1:8000/api/booking-vnpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Server error");
    }

    alert("Đặt chỗ thành công! Thanh toán tiền mặt tại workshop.");
    window.location.href = "/";

  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
    quantity: 1,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(0);

  // tránh fetch nếu id undefined
  useEffect(() => {
  if (!id) return; // không fetch nếu id undefined

  fetch(`http://127.0.0.1:8000/api/workshop-row/${id}`)
    .then(res => res.json())
    .then(data => setRemainingSlots(Number(data.remaining_slots) || 0))
    .catch(() => setRemainingSlots(0));
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value
    }));
  };

  const handleExpire = () => {
    alert("Thời gian đặt vé đã hết, vui lòng thử lại!");
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!token) {
      alert("Bạn cần đăng nhập để đăng ký workshop");
      window.location.href = "/auth";
      return;
    }

    if (!form.name || !form.phone || form.quantity <= 0) {
      alert("Vui lòng điền đầy đủ thông tin hợp lệ");
      setLoading(false);
      return;
    }

    if (form.quantity > remainingSlots) {
      alert(`Chỉ còn ${remainingSlots} chỗ trống`);
      setLoading(false);
      return;
    }

    const payload = {
      workshop_id: Number(id),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      quantity: Number(form.quantity),
      note: form.note.trim() || null,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/booking-vnpay", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
});


      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.error("Response không phải JSON:", raw);
      }

      if (!res.ok) {
        throw new Error(data?.message || "Server error");
      }

      if (!data?.payment_url) {
        throw new Error("Không nhận được link thanh toán từ server");
      }

      // redirect sang VNPAY
      window.location.assign(data.payment_url);

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return <p>Workshop không xác định, vui lòng quay lại trang trước.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        <CountdownTimer
          initialSeconds={300}
          onExpire={handleExpire}
        />

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg space-y-4">

          <div>
            <input
              name="name"
              placeholder="Họ tên"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-4 rounded-xl"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <input
              name="phone"
              placeholder="SĐT"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-4 rounded-xl"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              className="w-32 border p-4 rounded-xl"
              disabled={remainingSlots === 0}
            />
            <p className="text-sm text-gray-500">Còn lại: {remainingSlots} chỗ</p>
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>

          <div>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-4 rounded-xl"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border p-4 rounded-xl"
            />
            {errors.note && <p className="text-red-500 text-sm">{errors.note}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || remainingSlots === 0}
            className={`w-full py-4 text-white rounded-xl ${remainingSlots === 0 ? 'bg-gray-400' : 'bg-emerald-600'}`}
          >
            {loading ? "Đang xử lý..." : "Thanh toán VNPAY"}
          </button>
          <button
  type="button"
  onClick={handleCashPayment}
  disabled={loading || remainingSlots === 0}
  className={`w-full py-4 rounded-xl border 
    ${remainingSlots === 0 
      ? "bg-gray-200 text-gray-400" 
      : "bg-white text-gray-700 border-gray-400 hover:bg-gray-100"
    }`}
>
  Thanh toán tiền mặt
</button>

        </form>
      </div>
    </div>
  );
}

export default Booking;
