import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  // ✅ Lấy thông tin user
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setForm({
          name: data.user.name,
          phone: data.user.phone,
          address: data.user.address || "",
        });
      }
    } catch (error) {
      console.log("Lỗi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // ✅ Cập nhật thông tin
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/auth/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
    fetchUser();
  };

  // ✅ Đổi mật khẩu
  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="flex items-center -mt-12">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
                <User className="w-12 h-12 text-indigo-600" />
              </div>
              <div className="ml-6 mt-12">
                <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
                <p className="text-gray-500 mt-1">Quản lý tài khoản của bạn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin */}
        <div className="space-y-4">

          {/* Họ tên */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Họ tên</p>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-xl font-semibold">{user.email}</p>
              </div>
            </div>
          </div>

          {/* SĐT */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border p-2 rounded"
              rows="3"
            ></textarea>
          </div>

          {/* Nút lưu */}
          <button
            onClick={handleUpdate}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Lưu thay đổi
          </button>

          {/* Đổi mật khẩu */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-indigo-600" /> Đổi mật khẩu
            </h2>

            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
              onChange={(e) =>
                setPasswordData({ ...passwordData, current_password: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
            />

            <input
              type="password"
              placeholder="Mật khẩu mới"
              onChange={(e) =>
                setPasswordData({ ...passwordData, new_password: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
            />

            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password_confirmation: e.target.value,
                })
              }
              className="w-full border p-2 rounded mb-3"
            />

            <button
              onClick={handleChangePassword}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Đổi mật khẩu
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;