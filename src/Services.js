function Services() {
  const services = [
    { title: "Workshop UI", desc: "Thực hành trực tiếp với TailwindCSS." },
    { title: "Tài liệu học tập", desc: "Hướng dẫn chi tiết, dễ hiểu." },
    { title: "Demo Project", desc: "Ví dụ thực tế để áp dụng ngay." },
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-10">
          Dịch vụ của chúng tôi
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;