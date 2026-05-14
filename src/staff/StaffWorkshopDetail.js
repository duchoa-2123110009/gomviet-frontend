import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StaffNavbar from "../components/StaffPanel";

export default function StaffWorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/staff/workshops/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(data => {
        setWorkshop(data.workshop);
        setBookings(data.bookings);
        setLoading(false);
      })
      .catch(() => {
        alert("Không thể tải workshop");
        navigate("/staff/workshops");
      });
  }, [id, navigate, token]);

  const checkin = (bookingId) => {
    if (!window.confirm("Xác nhận check-in?")) return;

    fetch(`http://127.0.0.1:8000/api/staff/bookings/${bookingId}/checkin`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(() => {
        setBookings(bookings.map(b =>
          b.id === bookingId ? { ...b, status: "attended" } : b
        ));
      });
  };

  const cancel = (bookingId) => {
    if (!window.confirm("Hủy booking này?")) return;

    fetch(`http://127.0.0.1:8000/api/staff/bookings/${bookingId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(() => {
        setBookings(bookings.map(b =>
          b.id === bookingId ? { ...b, status: "canceled" } : b
        ));
      });
  };

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
        <h2>{workshop.title}</h2>
        <p>
          Số người: {workshop.current_people}/{workshop.capacity}
        </p>

        <h3>Danh sách đăng ký</h3>

        {bookings.length === 0 && <p>Chưa có booking</p>}

        {bookings.map(b => (
          <div
            key={b.id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              marginBottom: 10,
              borderRadius: 6
            }}
          >
            <b>{b.customer_name}</b> ({b.customer_phone})<br />
            Ghế: {b.seats}<br />
            Trạng thái: <b>{b.status}</b>

            <div style={{ marginTop: 6 }}>
              {b.status === "confirmed" && (
                <>
                  <button onClick={() => checkin(b.id)}>
                    ✅ Check-in
                  </button>{" "}
                  <button onClick={() => cancel(b.id)}>
                    ❌ Hủy
                  </button>
                </>
              )}

              {b.status === "attended" && (
                <span style={{ color: "green" }}>Đã tham gia</span>
              )}

              {b.status === "canceled" && (
                <span style={{ color: "red" }}>Đã hủy</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
