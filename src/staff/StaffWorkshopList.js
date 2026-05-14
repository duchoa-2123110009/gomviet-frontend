import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StaffNavbar from "../components/StaffPanel";

export default function StaffWorkshopList() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ Chặn nếu không phải staff
    if (!token || !user || user.roles !== "staff") {
      navigate("/");
      return;
    }

    fetch("http://127.0.0.1:8000/api/staff/workshops", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Không có quyền");
        return res.json();
      })
      .then(data => {
        setWorkshops(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Không thể tải workshop");
        navigate("/");
      });
  }, [navigate]);

  if (loading) {
    return (
      <>
        <StaffNavbar />
        <div style={{ padding: 20 }}>Đang tải...</div>
      </>
    );
  }

  return (
    <>
      <StaffNavbar />

      <div style={{ padding: 20 }}>
        <h2>Danh sách Workshop</h2>

        {workshops.length === 0 && (
          <p>Chưa có workshop nào</p>
        )}

        {workshops.map(w => {
          const remaining = w.capacity - w.current_people;

          return (
            <div
              key={w.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: 12,
                marginBottom: 12
              }}
            >
              <b>{w.title}</b>

              <div style={{ marginTop: 5 }}>
                Số lượng: {w.current_people}/{w.capacity}
                {" "}
                {remaining <= 0 ? (
                  <span style={{ color: "red" }}>(Đã đủ)</span>
                ) : (
                  <span style={{ color: "green" }}>
                    (Còn {remaining} chỗ)
                  </span>
                )}
              </div>

              <div style={{ marginTop: 5 }}>
                Thời gian: {w.start_time} → {w.end_time}
              </div>

              <Link
                to={`/staff/workshops/${w.id}`}
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  color: "#2563eb"
                }}
              >
                Xem danh sách đăng ký →
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
