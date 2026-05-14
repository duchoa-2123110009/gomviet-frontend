import FormField from "../components/FormField";
import { useState } from "react";

function Contact() {
  const [payload, setPayload] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const update = (f) => (e) => setPayload(p => ({ ...p, [f]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setPayload({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Liên hệ</h2>
        <form className="space-y-6" onSubmit={submit}>
          <FormField label="Họ tên" value={payload.name} onChange={update("name")} />
          <FormField label="Email" type="email" value={payload.email} onChange={update("email")} />
          <FormField label="Lời nhắn" type="textarea" value={payload.message} onChange={update("message")} />
          <button type="submit" className="px-5 py-2 bg-gray-900 text-white rounded hover:bg-black">
            Gửi liên hệ
          </button>
          {status === "loading" && <p className="text-gray-600">Đang gửi...</p>}
          {status === "success" && <p className="text-green-600">Đã gửi thành công!</p>}
          {status === "error" && <p className="text-red-600">Có lỗi xảy ra, thử lại sau.</p>}
        </form>
      </div>
    </section>
  );
}
export default Contact;