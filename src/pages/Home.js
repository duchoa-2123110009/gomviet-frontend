import React, { useState } from "react";
import Category from "./Category";
import Products from "./Product";
import Navbar from "../components/Navbar";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section id="home" className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Khối giới thiệu */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-emerald-800 text-sm font-medium">
                ✨ Thủ công - Tâm huyết - Đẳng cấp
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Gốm thủ công
                <span className="block text-emerald-700 mt-2">
                  cho không gian sống
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Mỗi sản phẩm gốm là một tác phẩm nghệ thuật, được tạo nên từ đôi
                bàn tay tâm huyết và tình yêu với nghề gốm truyền thống.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#products"
                  className="group px-8 py-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  Khám phá sản phẩm
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <a
                  href="workshop"
                  className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-600 rounded-full shadow-lg hover:bg-green-50 transition-all duration-300"
                >
                  Đặt lịch Workshop
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-emerald-700">500+</div>
                  <div className="text-sm text-gray-600 mt-1">Sản phẩm</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700">1000+</div>
                  <div className="text-sm text-gray-600 mt-1">Khách hàng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700">10+</div>
                  <div className="text-sm text-gray-600 mt-1">Năm kinh nghiệm</div>
                </div>
              </div>
            </div>

            {/* Khối hình ảnh */}
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>

              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg">
                    New Collection
                  </span>
                </div>

                <div className="aspect-[4/5] bg-gradient-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                  <img
                    src="/hii.jpg"
                    alt="Gốm thủ công Gomviet"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CATEGORY (CLICK Ở ĐÂY) ================= */}
      <Category onSelectCategory={setSelectedCategory} />

      {/* ================= PRODUCTS (ĐỔI THEO CATEGORY) ================= */}
      <Products selectedCategory={selectedCategory} />

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">

            <div className="text-center p-8 rounded-2xl hover:bg-green-50 transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                🏺
              </div>
              <h3 className="text-xl font-bold mb-3">Thủ công 100%</h3>
              <p className="text-gray-600">
                Mỗi sản phẩm được nặn và tạo hình thủ công
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl hover:bg-green-50 transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                🎨
              </div>
              <h3 className="text-xl font-bold mb-3">Workshop sáng tạo</h3>
              <p className="text-gray-600">
                Trải nghiệm tự tay nặn gốm cùng nghệ nhân
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl hover:bg-green-50 transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                🌿
              </div>
              <h3 className="text-xl font-bold mb-3">Thân thiện môi trường</h3>
              <p className="text-gray-600">
                Nguyên liệu tự nhiên, an toàn sức khỏe
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;