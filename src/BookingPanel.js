import React, { useState } from "react";

function BookingPanel() {
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");

  // Tìm booking (GET)
const findBooking = async () => {
  const res = await fetch(`http://127.0.0.1:8000/api/booking/find/${phone}`, {
    method: "GET",
  });
  const data = await res.json();
  if (res.ok) {
    setBooking(data.booking);
    setMessage(data.message);
  } else {
    setBooking(null);
    setMessage(data.message);
  }
};

// Xác nhận thanh toán (PUT)
const confirmPayment = async () => {
  const res = await fetch(`http://127.0.0.1:8000/api/booking/confirm/${phone}`, {
    method: "PUT",
  });
  const data = await res.json();
  if (res.ok) {
    setBooking(data.booking);
    setMessage(data.message);
  } else {
    setMessage(data.message);
  }
};

  return (
    <div>
      <h2>Staff Panel - Quản lý Booking</h2>
      <input
        type="text"
        placeholder="Nhập số điện thoại"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={findBooking}>Tìm Booking</button>

      {booking && (
        <div>
          <p>Tên: {booking.name}</p>
          <p>Dịch vụ: {booking.service}</p>
          <p>Trạng thái: {booking.status}</p>
          <p>Xác nhận: {booking.verified ? "Đã xác nhận" : "Chưa xác nhận"}</p>

          {!booking.verified && (
            <button onClick={confirmPayment}>Xác nhận thanh toán</button>
          )}
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default BookingPanel;