import { useState } from "react";

function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const url =
    mode === "login"
      ? "http://127.0.0.1:8000/api/auth/login"
      : "http://127.0.0.1:8000/api/auth/register";

  const payload =
    mode === "login"
      ? {
          email: form.email,
          password: form.password,
        }
      : {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          password_confirmation: form.password_confirmation,
        };

  console.log("Payload gửi lên:", payload);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Response từ Laravel:", data);

    if (!res.ok) {
      alert(
        data.errors
          ? Object.values(data.errors).flat().join("\n")
          : data.message || "Có lỗi xảy ra"
      );
      return;
    }

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    alert(mode === "login" ? "Đăng nhập thành công!" : "Đăng ký thành công!");
    window.location.href = "/";
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Không thể kết nối server");
  }
};

  return (
    <div className="bg-gradient-to-r from-green-400 to-teal-500 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          {mode === "login" ? "🔐 Đăng nhập" : "📝 Đăng ký Tài khoản"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
            </>
          )}

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
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold"
          >
            {mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          {mode === "login" ? (
            <>
              Chưa có tài khoản?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-green-600 hover:underline"
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-green-600 hover:underline"
              >
                Đăng nhập
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Auth;