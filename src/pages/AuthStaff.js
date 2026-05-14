import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthStaff() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/staff-login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify(form),
});

      const data = await res.json();
      console.log("Staff login response:", data);

      if (!res.ok) {
        alert(data.message || "Đăng nhập thất bại");
        setLoading(false);
        return;
      }

      // ✅ Kiểm tra role
      if (data.user.roles !== "staff" && data.user.roles !== "admin") {
        alert("Bạn không có quyền truy cập Staff Panel!");
        setLoading(false);
        return;
      }

      // ✅ Lưu token và user
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Đăng nhập Staff thành công!");
      navigate("/staff"); // chuyển sang Staff Panel
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          🔐 Đăng nhập Staff
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập Staff"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthStaff;