import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.log("Lỗi Navbar:", error);
      }
    };

    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    } else {
      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-amber-50 via-white to-amber-50 backdrop-blur-md border-b-2 border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-amber-950 bg-clip-text text-transparent">
              GOM WORKSHOP
            </span>
          </Link>

          {/* Menu */}
          <ul className="hidden md:flex items-center space-x-8">
            <li><Link to="/#products" className="nav-link">Sản phẩm</Link></li>
            <li><Link to="/workshop" className="nav-link">Workshop</Link></li>
            <li><Link to="/booking" className="nav-link">Đặt lịch</Link></li>
            <li><Link to="/#Contact" className="nav-link">Liên hệ</Link></li>

            {(user?.roles === "staff" || user?.roles === "admin") && (
              <li>
                <Link to="/staff/workshops" className="relative text-blue-700 font-bold hover:text-blue-900 transition-colors group">
                  Staff Panel
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600"></span>
                </Link>
              </li>
            )}
          </ul>

          {/* Avatar + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)} // ✅ click để mở/đóng
              className="flex items-center space-x-2 p-2 hover:bg-amber-100 rounded-full transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {user ? user.name.charAt(0).toUpperCase() : "?"}
                </span>
              </div>
              {/* icon mũi tên */}
              <svg
                className={`w-4 h-4 text-amber-700 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown với animation */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-amber-200 z-50
                          transform transition-all duration-300 ease-out
                          ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
            >
              {!user ? (
                <Link to="/auth" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                  Đăng nhập
                </Link>
              ) : (
                <>
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-amber-50">
                    Trang cá nhân
                  </Link>
                  {(user.roles === "staff" || user.roles === "admin") && (
                    <Link to="/staff" className="block px-4 py-2 text-blue-700 font-bold hover:bg-blue-100">
                      Staff Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;